module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react/recommended',
    'standard',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  globals: {
    JSX: true
  }
}
