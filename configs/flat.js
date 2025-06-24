import {
	parserOptions,
	globals as sharedGlobals,
	settings,
	rules
} from './shared.js';
import parser from '@babel/eslint-parser';
import eslintJS from '@eslint/js';
import compatPlugin from 'eslint-plugin-compat';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export const flatConfig = [
	eslintJS.configs.recommended,
	{
		languageOptions: {
			parser,
			parserOptions,
			globals: {
				...globals.browser,
				...globals.es2015,
				...globals.node,
				...sharedGlobals,
			}
		},
		plugins: {
			js: eslintJS,
			compat: compatPlugin,
			react: reactPlugin,
			'react-hooks': reactHooksPlugin
		},
		settings,
		rules
	}
];
