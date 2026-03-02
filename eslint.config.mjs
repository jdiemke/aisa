import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: './src/tsconfig.json',
            },
        },
        rules: {
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-useless-assignment': 'off',
        },
    },
    {
        ignores: ['**/*.js', 'dist/**', 'node_modules/**'],
    },
);
