module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "plugin:jsx-a11y/recommended",
    "prettier",
    "plugin:effector/recommended",
    "plugin:effector/future",
    "plugin:effector/patronum",
    "plugin:effector/react",
    "plugin:effector/scope",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', 'jsx-a11y', 'prettier', 'effector'],
  rules: {
    'react-refresh/only-export-components': 'warn',
  },
}
