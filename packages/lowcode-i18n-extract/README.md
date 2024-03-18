<a name="readme-top"></a>

<div align="center">

<h1>Yunti Lowcode I18n Extract Tools</h1>

🌐 [@yuntijs/lowcode-i18n-extract](https://www.npmjs.com/package/@yuntijs/lowcode-i18n-extract) is an i18n extract tools for schema of [lowcode engine](https://lowcode-engine.cn/index) inspired by [Kiwi](https://github.com/alibaba/kiwi).

English ・ [简体中文](./README.zh-CN.md) ・ [Changelog](./CHANGELOG.md) · [Report Bug][github-issues-link] · [Request Feature][github-issues-link]

<!-- SHIELD GROUP -->

[![][npm-release-shield]][npm-release-link]

<!-- [![][vercel-shield]][vercel-link] -->

[![][npm-downloads-shield]][npm-downloads-link]
[![][github-releasedate-shield]][github-releasedate-link]
[![][github-action-test-shield]][github-action-test-link]
[![codecov][codecov-shield]][codecov-link]<br/>
[![][github-action-release-shield]][github-action-release-link]
[![][github-contributors-shield]][github-contributors-link]
[![][github-forks-shield]][github-forks-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]
[![][github-license-shield]][github-license-link]

<!-- [![][banner]][vercel-link] -->

</div>

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [✨ Features](#-features)
- [📦 Installation](#-installation)
- [🌐 Usage](#-usage)
- [⌨️ Local Development](#️-local-development)
- [🤝 Contributing](#-contributing)

####

</details>

## ✨ Features

- [x] 🔠 Supports extracting Chinese text of `string` type from lowCode schema .
- [x] 🚀 Supports extracting Chinese text of `JSExpression` and `JSFunction` type from lowCode schema.
- [ ] 🌐 Support automated i18n translation.

## 📦 Installation

To install @yuntijs/lowcode-i18n-extract, run the following command:

```bash
pnpm add @yuntijs/lowcode-i18n-extract
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🌐 Usage

> \[!NOTE]\
> The @yuntijs/lowcode-i18n-extract is inspired by [Kiwi](https://github.com/alibaba/kiwi),
> the i18n extraction solution can be said to be a simplified version of kiwi.

```ts
import { extractI18n } from '@yuntijs/lowcode-i18n-extract';

const schema = {
  /** full schema here */
};

const { matches, schema: schemaWithI18n } = extractI18n(schema);
// matches are extracted i18n texts
// schemaWithI18n is scheam with i18n injected
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⌨️ Local Development

You can use Github Codespaces for online development:

[![][codespaces-shield]][codespaces-link]

Or clone it for local development:

```bash
git clone https://github.com/yuntijs/lowcode-tools.git
cd lowcode-tools
pnpm install
pnpm dev:i18n-extract
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤝 Contributing

Contributions of all types are more than welcome, if you are interested in contributing code, feel free to check out our GitHub [Issues][github-issues-link] to get stuck in to show us what you’re made of.

[![][pr-welcome-shield]][pr-welcome-link]

[![][contributors-contrib]][contributors-link]

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

<details><summary><h4>📝 License</h4></summary>

[![][fossa-license-shield]][fossa-license-link]

</details>

Copyright © 2024 [YuntiJS][profile-link]. <br />
This project is [MIT](./LICENSE) licensed.

<!-- LINK GROUP -->

<!-- [vercel-link]: https://ui.yuntijs.com -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square
[codecov-link]: https://codecov.io/gh/yuntijs/lowcode-tools
[codecov-shield]: https://codecov.io/gh/yuntijs/lowcode-tools/graph/badge.svg?token=XVQEXR75U4
[codespaces-link]: https://codespaces.new/yuntijs/lowcode-tools
[codespaces-shield]: https://github.com/codespaces/badge.svg
[contributors-contrib]: https://contrib.rocks/image?repo=yuntijs/lowcode-tools
[contributors-link]: https://github.com/yuntijs/lowcode-tools/graphs/contributors
[fossa-license-link]: https://app.fossa.com/projects/git%2Bgithub.com%2Fyuntijs%2Flowcode-tools
[fossa-license-shield]: https://app.fossa.com/api/projects/git%2Bgithub.com%2Fyuntijs%2Flowcode-tools.svg?type=large
[github-action-release-link]: https://github.com/actions/workflows/yuntijs/lowcode-tools/release.yml
[github-action-release-shield]: https://img.shields.io/github/actions/workflow/status/yuntijs/lowcode-tools/release.yml?label=release&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-action-test-link]: https://github.com/actions/workflows/yuntijs/lowcode-tools/test-i18n-extract.yml
[github-action-test-shield]: https://img.shields.io/github/actions/workflow/status/yuntijs/lowcode-tools/test-i18n-extract.yml?label=test&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-contributors-link]: https://github.com/yuntijs/lowcode-tools/graphs/contributors
[github-contributors-shield]: https://img.shields.io/github/contributors/yuntijs/lowcode-tools?color=c4f042&labelColor=black&style=flat-square
[github-forks-link]: https://github.com/yuntijs/lowcode-tools/network/members
[github-forks-shield]: https://img.shields.io/github/forks/yuntijs/lowcode-tools?color=8ae8ff&labelColor=black&style=flat-square
[github-issues-link]: https://github.com/yuntijs/lowcode-tools/issues
[github-issues-shield]: https://img.shields.io/github/issues/yuntijs/lowcode-tools?color=ff80eb&labelColor=black&style=flat-square
[github-license-link]: https://github.com/yuntijs/lowcode-tools/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/yuntijs/lowcode-tools?color=white&labelColor=black&style=flat-square
[github-releasedate-link]: https://github.com/yuntijs/lowcode-tools/releases
[github-releasedate-shield]: https://img.shields.io/github/release-date/yuntijs/lowcode-tools?labelColor=black&style=flat-square
[github-stars-link]: https://github.com/yuntijs/lowcode-tools/network/stargazers
[github-stars-shield]: https://img.shields.io/github/stars/yuntijs/lowcode-tools?color=ffcb47&labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@yuntijs/lowcode-i18n-extract
[npm-downloads-shield]: https://img.shields.io/npm/dt/@yuntijs/lowcode-i18n-extract?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@yuntijs/lowcode-i18n-extract
[npm-release-shield]: https://img.shields.io/npm/v/@yuntijs/lowcode-i18n-extract?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[pr-welcome-link]: https://github.com/yuntijs/lowcode-tools/pulls
[pr-welcome-shield]: https://img.shields.io/badge/☁️_pr_welcome-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge
[profile-link]: https://github.com/yuntijs
