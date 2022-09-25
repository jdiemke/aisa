module.exports = {
    "root": true,
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": ["./tsconfig.json"]
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        //  0 = off, 1 = warn, 2 = error
        "@typescript-eslint/no-inferrable-types": 0,
        "@typescript-eslint/no-empty-function": 0,
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-unused-vars": 0
    }
};