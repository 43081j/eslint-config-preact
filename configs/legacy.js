import {
	parserOptions,
	globals,
	settings,
	rules
} from './shared.js';

export const legacyConfig = {
	// TODO: this is really only required for class property initializer methods, which are seeing declining usage.
	// At some point, we should un-ship the custom parser and let ESLint use esprima.
	parser: require.resolve('@babel/eslint-parser'),
	// We don't use plugin:react/recommended here to avoid React-specific rules.
	extends: [
		'eslint:recommended'
	],
	plugins: [
		'compat',
		'react',
		'react-hooks'
	],
	env: {
		browser: true,
		es6: true,
		node: true
	},
	parserOptions,
	globals,
	settings,
	rules,
};
