module.exports = {
	env: {
		browser: true,
		es2021: true,
		// 'jest/globals': true,
	},
	extends: ['airbnb-base', 'plugin:jest/recommended'],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'no-tabs': ['error', { allowIndentationTabs: true }],
		indent: ['error', 'tab'],
		'linebreak-style': ['off', 'windows'],
	},
	plugins: ['jest'],
};
