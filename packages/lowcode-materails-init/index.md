---
title: materials-init
order: 0
---

<a name="readme-top"></a>

<div align="center">

<h1>Yunti Lowcode Materials Init Tools</h1>

🌐 [@yuntijs/lowcode-materails-init](https://www.npmjs.com/package/@yuntijs/lowcode-materails-init) is an lowcode materails init tools for [Low Code Engine Material Protocol Specification](https://lowcode-engine.cn/site/docs/specs/material-spec) inspired by [@alilc/lowcode-material-parser](https://github.com/alibaba/lowcode-engine/tree/main/modules/material-parser).

</div>

## 📦 Installation

To install @yuntijs/lowcode-materails-init, run the following command:

```bash
pnpm add @yuntijs/lowcode-materails-init
```

## 🌐 Usage

init.mjs

```mjs
import init from '@yuntijs/lowcode-materails-init';

init({
  components: undefined,
  skipComponents: ['TreeNode', 'DirectoryTree', 'Item', 'MonacoDiffEditor', 'BaseMonacoEditor'],
});
```

pakage.json

```json
{
  "scripts": {
    "init": "node init.mjs"
  }
}
```

## 🤝 API

### `init(options)`

#### `options`

| name           | Description                     | Type      | Default         | Version |
| :------------- | :------------------------------ | :-------- | :-------------- | :------ |
| rootDir        | Entry file root path            | string    | ''              | -       |
| entryPath      | Relative path of the entry file | string    | "src/index.tsx" | -       |
| components     | Parsed components only          | string\[] | -               | -       |
| skipComponents | Unparsed components             | string\[] | \[]             | -       |
| lowcodeDir     | Generate folder name            | string    | 'lowcode'       | -       |
| metaFormat     | Generated file type             | string    | ts              | -       |
| devAlias       | Generate filename suffix        | string    | ''              | -       |

<div align="right">

[![][back-to-top]](#readme-top)

</div>

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square
