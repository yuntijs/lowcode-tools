import init from '../src/index.mjs'

init({
  entryPath: "demo/index.tsx",
  components: undefined,
  skipComponents: ['TreeNode', 'DirectoryTree', 'Item', 'MonacoDiffEditor', 'BaseMonacoEditor'],
})