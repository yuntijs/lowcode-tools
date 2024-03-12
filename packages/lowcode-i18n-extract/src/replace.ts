import { IPublicTypePageSchema, IPublicTypeProjectSchema } from '@alilc/lowcode-types';
import { cloneDeep, findKey, get, set } from 'lodash';
import { pinyin } from 'pinyin-pro';

import { I18nMatch } from './types';
import { I18N_EN_KEY, I18N_ZH_KEY } from './utils';

/**
 * 处理作为 key 值的翻译原文
 */
const getTransOriginText = (text: string) => {
  // 避免翻译的字符里包含数字或者特殊字符等情况，只过滤出汉字和字母
  const reg = /[A-Za-z\u4E00-\u9FA5]+/g;
  const findText = text.match(reg) || [];
  const transOriginText = findText ? findText.join('').slice(0, 5) : '中文符号';

  return transOriginText;
};

const filterTemplateLiteralsInMatches = (matches: I18nMatch[]) => {
  // 过滤掉模板字符串内的中文，避免替换时出现异常
  const targetMatches = matches?.reduce<I18nMatch[]>((pre, matchObj, i) => {
    // 因为文案已经根据位置倒排，所以比较时只需要比较剩下的文案即可
    const afterMatches = matches.slice(i + 1);
    if (afterMatches.some(obj => matchObj.range.end <= obj.range.end)) {
      return pre;
    }
    // eslint-disable-next-line unicorn/prefer-spread
    return pre.concat(matchObj);
  }, []);
  const len = (matches.length || 0) - targetMatches.length;
  if (len > 0) {
    console.warn(`存在 ${len} 处文案无法替换，请避免在模板字符串的变量中嵌套中文`, matches);
  }
  return targetMatches;
};
const generateI18nKey = (text: string, i18nCN: Record<string, string>) => {
  let key = findKey(i18nCN, i18nText => i18nText === text);
  if (key) {
    return key;
  }
  const pinyinKey = pinyin(getTransOriginText(text), { toneType: 'none', nonZh: 'consecutive' });
  key = `i18n-${pinyinKey.split(/\s+/).join('-')}`;
  const keyReg = new RegExp(`^${key}(\-[0-9]+)?$`);
  const keyCount = Object.keys(i18nCN).filter(key => keyReg.test(key)).length;
  if (keyCount > 0) {
    key += `-${keyCount + 1}`;
  }
  return key;
};

function replaceAndUpdateCodeItem(code: string, match: I18nMatch, i18nFuncKey = 'this.i18n') {
  let finalReplaceText = match.text;
  const { start, end } = match.range;
  const i18nVar = `${i18nFuncKey}('${match.key}')`;
  if (!match.isString) {
    return {
      code: `${code.slice(0, start)}{${i18nVar}}${code.slice(end)}`,
      text: finalReplaceText,
    };
  }
  // 若是字符串，删掉两侧的引号
  // 如果引号左侧是 等号，则可能是 jsx 的 props，此时要替换成 {
  const preTextStart = start - 1;
  // eslint-disable-next-line unicorn/prefer-spread
  const [last2Char, last1Char] = code.slice(preTextStart, start + 1).split('');
  let finalReplaceVal = i18nVar;
  if (last2Char === '=') {
    finalReplaceVal = '{' + i18nVar + '}';
  }
  // 若是模板字符串，看看其中是否包含变量
  if (last1Char === '`') {
    const varInStr = match.text.match(/(\${[^}]+?})/g);
    if (varInStr) {
      const kvPair = varInStr.map((str, index) => {
        return `val${index + 1}: ${str.replace(/^\${([^}]+)}$/, '$1')}`;
      });
      finalReplaceVal = `${i18nFuncKey}('${match.key}', { ${kvPair.join(',\n')} })`;

      for (const [index, str] of varInStr.entries()) {
        finalReplaceText = finalReplaceText.replace(str, `{val${index + 1}}`);
      }
    }
  }

  // \n 会被自动转义成 \\n，这里转回来
  // eslint-disable-next-line unicorn/prefer-string-replace-all
  finalReplaceText = finalReplaceText.replace(/\\n/gm, '\n');

  return {
    code: `${code.slice(0, start)}${finalReplaceVal}${code.slice(end)}`,
    text: finalReplaceText,
  };
}

// replace js code
export const replaceAndUpdateJsCode = (matches: I18nMatch[], jsCode: string, type: string) => {
  let newCode = jsCode;
  const JS_FUNCTION_PREFIX_REG = /^(function\s*(\w+)?\s*\([^)]*\)\s*{)/;
  const IS_ADD_I18N_VAR = type === 'JSFunction' && JS_FUNCTION_PREFIX_REG.test(newCode);
  let i18nFuncKey = IS_ADD_I18N_VAR ? '__I18N' : 'this.i18n';
  const i18nRecords: Record<string, string> = {};
  for (const match of matches) {
    const { code, text } = replaceAndUpdateCodeItem(newCode, match, i18nFuncKey);
    newCode = code;
    i18nRecords[match.key] = text;
  }
  // 函数类型的 code 在函数体首行增加 i18n 函数变量声明，可以避免一些 this 指向引起的 i18n 无法获取的问题
  if (IS_ADD_I18N_VAR) {
    newCode = newCode.replace(JS_FUNCTION_PREFIX_REG, `$1\n  const __I18N = this.i18n;\n`);
  }
  return {
    code: newCode,
    i18nRecords,
  };
};

export const generateKeyAndReplace = <T = IPublicTypePageSchema>(
  matches: I18nMatch[],
  _schema: IPublicTypeProjectSchema<T>
) => {
  const schema = cloneDeep(_schema);
  if (!schema.i18n) {
    schema.i18n = {
      [I18N_ZH_KEY]: {},
      [I18N_EN_KEY]: {},
    };
  }
  if (!schema.i18n[I18N_ZH_KEY]) {
    schema.i18n[I18N_ZH_KEY] = {};
  }
  if (!schema.i18n[I18N_EN_KEY]) {
    schema.i18n[I18N_EN_KEY] = {};
  }
  const needRewriteI18nRecords: Record<string, string> = {};
  const _genKeysForMatches = (_matches: I18nMatch[]) => {
    for (let match of _matches) {
      const { text, path } = match;
      if (text) {
        const key = generateI18nKey(text, schema.i18n[I18N_ZH_KEY]);
        match.key = key;
        schema.i18n[I18N_ZH_KEY][key] = text;
        schema.i18n[I18N_EN_KEY][key] = text;
        if (path) {
          set(schema, path, {
            key,
            type: 'i18n',
          });
        }
        continue;
      }
      if (match.matches) {
        const jsMatchesWithKey = _genKeysForMatches(filterTemplateLiteralsInMatches(match.matches));
        // replace js code
        const { code, i18nRecords } = replaceAndUpdateJsCode(
          jsMatchesWithKey,
          get(schema, path),
          get(schema, [...path.slice(0, -1), 'type'])
        );
        set(schema, path, code);
        Object.assign(needRewriteI18nRecords, i18nRecords);
        match.matches = jsMatchesWithKey;
      }
    }
    return _matches;
  };
  const newMaches = _genKeysForMatches(matches);

  // 替换可能存在变量的国际化文案
  Object.assign(schema.i18n[I18N_ZH_KEY], needRewriteI18nRecords);
  Object.assign(schema.i18n[I18N_EN_KEY], needRewriteI18nRecords);

  // @Todo: 在这里删除 originCode (因为 originCode 中的国际化文案已经在 schema 中的其他字段中提取过了，而且低码引擎会根据 schema 中的相关字段重新生成 originCode)
  for (const container of schema.componentsTree) {
    delete (container as Record<string, any>).originCode;
  }

  return { matches: newMaches, schema };
};
