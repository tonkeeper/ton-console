import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import mobx from 'eslint-plugin-mobx';
import chakraUI from 'eslint-plugin-chakra-ui';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
    {
        ignores: [
            'node_modules',
            'dist',
            'scripts',
            '.next',
            '.lintstagedrc.cjs',
            'src/shared/lib/validators/address-validator.test.ts',
            'src/shared/lib/decimals.test.ts',
            'src/features/tonapi/pricing/utils/calculating.test.ts'
        ]
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        rules: {
            /* common */
            'no-underscore-dangle': 'off',
            'no-plusplus': 'off',
            'class-method-use-this': 'off',
            eqeqeq: ['error', 'smart'],
            complexity: 'warn',
            'no-empty': ['error'],
            'no-restricted-globals': 'error',
            'no-irregular-whitespace': 'warn',
            'no-param-reassign': 'off',
            'no-prototype-builtins': 'off',

            /* styles */
            'array-bracket-spacing': ['error', 'never'],
            'object-curly-spacing': ['error', 'always'],
            'comma-dangle': ['error', 'never'],
            indent: 'off',
            'max-classes-per-file': 'error',
            radix: ['error', 'as-needed'],
            'no-return-assign': 'off',
            'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
            'no-useless-escape': 'off',
            'no-console': [
                'warn',
                {
                    allow: ['debug', 'error', 'info']
                }
            ],
            /* react */
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/display-name': 'off'
        }
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json'
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            react,
            'react-hooks': reactHooks,
            import: importPlugin,
            'unused-imports': unusedImports,
            mobx,
            'chakra-ui': chakraUI
        },
        rules: {
            /* imports */
            'import/extensions': [
                'error',
                'never',
                {
                    scss: 'always',
                    css: 'always',
                    json: 'always',
                    svg: 'always',
                    store: 'always',
                    generated: 'always',
                    config: 'always',
                    api: 'always'
                }
            ],
            'import/prefer-default-export': 'off',
            'import/no-extraneous-dependencies': [
                'error',
                { devDependencies: false, optionalDependencies: false, peerDependencies: false }
            ],

            /* typescript-eslint */
            '@typescript-eslint/no-use-before-define': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-inferrable-types': 'error',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'enumMember',
                    format: ['UPPER_CASE']
                }
            ],
            '@typescript-eslint/dot-notation': 'error',
            '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/return-await': 'error',
            '@typescript-eslint/indent': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/lines-between-class-members': 'off',
            '@typescript-eslint/no-throw-literal': 'off',

            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'all',
                    ignoreRestSiblings: true,
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ],

            /* react-hooks */
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'off',

            /* Chakra UI */
            'chakra-ui/props-order': 'error',
            'chakra-ui/props-shorthand': 'error',
            'chakra-ui/require-specific-component': 'error',

            /* mobx */
            'mobx/missing-observer': 'off'
        },
        settings: {
            react: {
                version: 'detect'
            }
        }
    },
    {
        files: ['tests/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.test.json'
            }
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            import: importPlugin
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
        }
    },
    {
        files: ['src/**/*.stories.{ts,tsx}'],
        plugins: {
            import: importPlugin
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            'import/no-extraneous-dependencies': 'off'
        }
    },
    {
        files: ['vite.config.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.vite.json'
            }
        },
        rules: {
            '@typescript-eslint/indent': 'off'
        }
    },
    {
        files: [
            'src/features/app-messages/model/APP_MESSAGES_LINKS.ts',
            'src/features/invoices/models/INVOICES_LINKS.ts'
        ],
        rules: {
            '@typescript-eslint/no-duplicate-enum-values': 'off'
        }
    }
];
