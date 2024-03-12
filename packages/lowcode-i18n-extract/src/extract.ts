import { IPublicTypePageSchema, IPublicTypeProjectSchema } from '@alilc/lowcode-types';
import * as babelParser from '@babel/parser';
import * as babelTraverse from '@babel/traverse';
import * as babelTypes from '@babel/types';
import { sortBy } from 'lodash';

import type { I18nMatch } from './types';
import { DOUBLE_BYTE_REGEX } from './utils';

const JS_EXPRESSION_PREFIX = 'const _JS_EXPRESSION = ';
const JS_FUNCTION_SOURCE_REG = /^function\(\){/;
const JS_FUNCTION_PREFIX = 'function _JS_FUNC() {';
/**
 * 查找 JS 代码中的中文
 * ref: https://github.com/alibaba/kiwi/blob/master/kiwi-cli/src/extract/findChineseText.ts
 */
function findTextInJs(code: string, type: string, path: string[]) {
  // 修正 code，尽量保证可执行
  let fixedCode = code;
  if (type === 'JSFunction') {
    fixedCode = code.replace(JS_FUNCTION_SOURCE_REG, JS_FUNCTION_PREFIX);
  } else if (type === 'JSExpression') {
    fixedCode = JS_EXPRESSION_PREFIX + code;
  }
  const offset = fixedCode.length - code.length;
  const jsMatches: I18nMatch = {
    path,
    matches: [],
  };
  const ast = babelParser.parse(fixedCode, {
    sourceType: 'module',
    plugins: ['jsx', 'decorators-legacy'],
  });

  babelTraverse.default(ast, {
    StringLiteral({ node }) {
      const { start, end, value } = node as babelTypes.StringLiteral;
      if (value && DOUBLE_BYTE_REGEX.test(value)) {
        const range = { start: start - offset, end: end - offset };
        jsMatches.matches.push({
          range,
          text: value,
          isString: true,
        });
      }
    },
    TemplateLiteral({ node }) {
      const { start, end } = node as babelTypes.TemplateLiteral;
      const templateContent = fixedCode.slice(start, end);
      if (DOUBLE_BYTE_REGEX.test(templateContent)) {
        const range = { start: start - offset, end: end - offset };
        jsMatches.matches.push({
          range,
          text: fixedCode.slice(start + 1, end - 1),
          isString: true,
        });
      }
    },
    JSXElement({ node }) {
      const { children } = node as babelTypes.JSXElement;
      for (const child of children) {
        if (babelTypes.isJSXText(child)) {
          const { value, start, end } = child;
          const range = { start: start - offset, end: end - offset };
          if (DOUBLE_BYTE_REGEX.test(value)) {
            jsMatches.matches.push({
              range,
              text: value.trim(),
              isString: false,
            });
          }
        }
      }
    },
  });
  return jsMatches;
}

const findI18n = (obj: Record<string, any>, path: string[] = [], matches: I18nMatch[] = []) => {
  for (const key of Object.keys(obj)) {
    const newPath = [...path, key];
    // skip keys start with '__', eg: '__events'
    if (key.startsWith('__')) {
      continue;
    }
    const value = obj[key];
    if (!value) {
      continue;
    }
    const valueType = typeof value;
    if (valueType === 'object') {
      if (value.type) {
        if (['JSExpression', 'JSFunction'].includes(value.type) && value.value) {
          try {
            const jsMatches = findTextInJs(value.value, value.type, [...newPath, 'value']);
            if (jsMatches.matches.length === 0) {
              continue;
            }
            // 需要对 methods 中的 source 进行特殊处理
            if (value.source) {
              const sourceJsMatches = findTextInJs(value.source, value.type, [
                ...newPath,
                'source',
              ]);
              sourceJsMatches.matches = sortBy(
                sourceJsMatches.matches,
                match => -match.range.start
              );
              matches.push(sourceJsMatches);
            }
            // 调整文案顺序，保证从后面的文案往前替换，避免位置更新导致替换出错
            jsMatches.matches = sortBy(jsMatches.matches, match => -match.range.start);
            matches.push(jsMatches);
          } catch (error) {
            console.warn(`parse '${newPath.join(' > ')}' failed, code is: ${value.value}`, error);
          }
          continue;
        }
        if (value.type === 'JSSlot') {
          delete value.title;
        }
      }
      // 组件只需要提取 props 和 children (Page 等根组件除外)
      if (path.length > 1 && value.componentName) {
        if (value.props) {
          findI18n(value.props, [...newPath, 'props'], matches);
        }
        if (value.children) {
          findI18n(value.children, [...newPath, 'children'], matches);
        }
        continue;
      }
      findI18n(value, newPath, matches);
      continue;
    }
    if (valueType === 'string' && DOUBLE_BYTE_REGEX.test(value)) {
      matches.push({
        path: newPath,
        text: value,
        isString: true,
      });
    }
  }
  return matches;
};

export const findSchemaI18n = <T = IPublicTypePageSchema>(schema: IPublicTypeProjectSchema<T>) => {
  const matches: I18nMatch[] = [];
  findI18n(schema.componentsTree || [], ['componentsTree'], matches);
  return matches;
};
