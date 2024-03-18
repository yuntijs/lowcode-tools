---
title: i18n-extract
order: 0
---

<a name="readme-top"></a>

<div align="center">

<h1>Yunti Lowcode I18n Extract Tools</h1>

🌐 [@yuntijs/lowcode-i18n-extract](https://www.npmjs.com/package/@yuntijs/lowcode-i18n-extract) is an i18n extract tools for schema of [lowcode engine](https://lowcode-engine.cn/index) inspired by [Kiwi](https://github.com/alibaba/kiwi).

</div>

## 📦 Installation

To install @yuntijs/lowcode-i18n-extract, run the following command:

```bash
pnpm add @yuntijs/lowcode-i18n-extract
```

## 🌐 Usage

```ts
import { extractI18n } from '@yuntijs/lowcode-i18n-extract';

const schema = {
  /** full schema here */
};

const { matches, schema: schemaWithI18n } = extractI18n(schema);
// matches are extracted i18n texts
// schemaWithI18n is scheam with i18n injected
```

## 🤝 API

### `extractI18n(schema, options)`

#### `schema`

The full project schema of [lowcode engine](https://lowcode-engine.cn/index).

#### `options`

```ts
export interface ExtractI18nOptions {
  /** schema 过滤器，可以过滤一些不需要提取中文的字段，不传使用默认的过滤器 `defaultSchemaFilter` */
  schemaFilter?: <T = IPublicTypePageSchema>(
    schema: IPublicTypeProjectSchema<T>
  ) => IPublicTypeProjectSchema<T>;
}
```

`defaultSchemaFilter`:

```ts
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
```

## 🛝 Playground

<code src="./demo/index.tsx"></code>

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square
