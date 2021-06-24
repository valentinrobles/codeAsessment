module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    mocha: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    quotes: [2, 'single', { avoidEscape: true }],
    'max-len': [2, 180, 4, { ignoreUrls: true }],
    'no-unused-vars': ['error', { varsIgnorePattern: 'should|expect' }],
  },
};
