module.exports = {
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "prettier"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
  "rules": {
    "no-useless-catch": 0,
    "@typescript-eslint/indent": [2, 2],
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/ban-ts-comment": 0,
    //   camelcase: ['error', { allow: ['user_id'] }],
    //   'comma-dangle': 0,
    //   'arrow-parens': 0,
    //   'no-underscore-dangle': 0,
    //   // 'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    //   // 'function-paren-newline': 0,
    //   'indent': ['error', 2],
    //   'linebreak-style': ['error', 'unix'],
    //   'quotes': ['error', 'single'],
    //   'semi': 0
  }
};
