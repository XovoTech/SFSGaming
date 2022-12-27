module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'curly': 'off',
        'eqeqeq': 'off',
        'jsx-quotes': 'off',
        'dot-notation': 'off',
        'semi': 'off',
        'quotes': 'off',
        'no-floating-decimal': 'off',
        'prettier/prettier': 0,
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
      },
    },
  ],
};
