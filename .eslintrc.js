module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
 
    '@typescript-eslint/no-explicit-any': 'off',
    'no-useless-escape': 'error',
    "@typescript-eslint/no-unsafe-function-type": "off",
  },
};