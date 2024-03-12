import { defineConfig } from 'dumi';
import { readdirSync } from 'fs';
import { join } from 'path';

const PUBLIC_PATH = '/lowcode-tools-public/';

const headPkgList: string[] = [];
const pkgDirList = readdirSync(join(__dirname, 'packages')).filter(
  pkg => !pkg.includes('.') && !headPkgList.includes(pkg)
);
const pkgs = {
  'lowcode-i18n-extract': 'lowcode-i18n-extract',
};
export const alias = pkgDirList.reduce((pre, name) => {
  pre[`@yuntijs/${pkgs[name]}`] = join(__dirname, 'packages', name, 'src');
  return {
    ...pre,
  };
}, {});

export default defineConfig({
  alias,
  // autoAlias: true,
  resolve: {
    docDirs: ['docs'],
    atomDirs: [{ type: 'lowcode-tools', dir: 'packages' }],
  },
  favicons: [`${PUBLIC_PATH}img/favicon.ico`],
  publicPath: PUBLIC_PATH,
  themeConfig: {
    logo: `${PUBLIC_PATH}img/logo.svg`,
    nav: [
      { title: '开发指南', link: '/guide' },
      { title: '组件总览', link: '/lowcode-tools/overview' },
    ],
  },
  ignoreMomentLocale: true,
  mfsu: {
    strategy: 'normal',
    shared: {
      react: {
        singleton: true,
      },
    },
  },
  // 默认重定向到子包的 src 文件夹
  monorepoRedirect: {
    peerDeps: true,
    useRootProject: true,
  },
  lessLoader: {
    javascriptEnabled: true,
    strictMath: false,
    math: 'parens-division',
    modifyVars: {
      // '@ant-prefix': PREFIX_CLS,
    },
  },
});
