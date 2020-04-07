module.exports = {
  'extends': 'airbnb-base',
  'plugins': [
    'import',
  ],
  'globals': {
    'localStorage': true,
  },
  'rules': {
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'no-use-before-define': ['error', { 'functions': false, 'classes': false }],
    'import/prefer-default-export': 'off',
    'max-len': 'off',
    'arrow-body-style': 'off',
    'no-console': 'off',
    'default-case': 'off',
    'dot-notation': 'off',
    'padded-blocks': 'off',
    'camelcase': 'off',
    'no-param-reassign': 'off',
    'func-names': 'off',
    'semi': ['error', 'never'],
  },
};
