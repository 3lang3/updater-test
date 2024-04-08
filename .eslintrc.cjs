module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/no-unknown-property': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-useless-escape': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-constant-condition': 'off'
  }
}
