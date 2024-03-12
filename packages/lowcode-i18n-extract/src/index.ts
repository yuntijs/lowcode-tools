import { IPublicTypePageSchema, IPublicTypeProjectSchema } from '@alilc/lowcode-types';
import { cloneDeep } from 'lodash';

import { findSchemaI18n } from './extract';
import { generateKeyAndReplace } from './replace';

export type * from './types';

export interface ExtractI18nOptions {
  /** schema 过滤器，可以过滤一些不需要提取中文的字段，不传使用默认的过滤器 `defaultSchemaFilter` */
  schemaFilter?: <T = IPublicTypePageSchema>(
    schema: IPublicTypeProjectSchema<T>
  ) => IPublicTypeProjectSchema<T>;
  /** 批量提取文案时生成 key 值时的默认翻译源, 默认 Pinyin，可选 Pinyin/Google/Baidu/Bing */
  defaultI18nKeyApi?: 'Pinyin' | 'Google' | 'Baidu' | 'Bing';
}

export const defaultSchemaFilter = <T = IPublicTypePageSchema>(
  schema: IPublicTypeProjectSchema<T>
) => {
  const pureSchmea = cloneDeep(schema);
  const _filterChildren = (children: IPublicTypePageSchema['children']) => {
    for (const key of Object.keys(children)) {
      const value = (children as Record<string, any>)[key];
      if (!value) {
        continue;
      }
      // 过滤 table 等数据源静态数据
      if (key === 'dataSource' && Array.isArray(value)) {
        delete (children as Record<string, any>).dataSource;
      }
      if (typeof value === 'object') {
        _filterChildren(value);
      }
    }
    return children;
  };
  pureSchmea.componentsTree = pureSchmea.componentsTree?.map(container => {
    const { props, state, methods, dataSource, lifeCycles, children } =
      container as IPublicTypePageSchema;
    // 默认仅提取以下几个字段中的中文
    return {
      props,
      state,
      methods,
      dataSource,
      lifeCycles,
      children: _filterChildren(children),
    } as T;
  });
  return pureSchmea;
};

export const extractI18n = <T = IPublicTypePageSchema>(
  schema: IPublicTypeProjectSchema<T>,
  options: ExtractI18nOptions = {}
) => {
  const { schemaFilter = defaultSchemaFilter } = options;
  const pureSchmea = schemaFilter(schema);
  const matches = findSchemaI18n(pureSchmea);
  return generateKeyAndReplace(matches, schema);
};
