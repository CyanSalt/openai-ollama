import config from '@cyansalt/eslint-config'

export default config({
  configs: [
    {
      languageOptions: {
        parserOptions: {
          project: [
            './tsconfig.app.json',
            './tsconfig.node.json',
          ],
        },
      },
    },
  ],
})
