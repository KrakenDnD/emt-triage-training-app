module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
    },
    extends: [
        'eslint:recommended',
        'prettier',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'no-console': 'warn',
        'no-unused-vars': 'warn',
        'prefer-const': 'error',
        'no-var': 'error',
    },
    overrides: [
        {
        files: ['backend/**/*.js'],
        env: {
            node: true,
            browser: false,
        },
        rules: {
            'no-console': 'off',
        },
        },
    ],
};