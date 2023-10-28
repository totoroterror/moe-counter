module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'standard',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    indent: [
      'warn',
      2,
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'no-return-await': [
      'warn',
    ],
    'no-unused-vars': [
      'off',
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
    ],
    'brace-style': [
      0,
      '1tbs',
      {
        allowSingleLine: true,
      },
    ],
  },
}
