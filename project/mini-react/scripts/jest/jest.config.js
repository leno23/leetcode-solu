const { defaults } = require('jest-config');

module.exports = {
	...defaults,
	rootDir: process.cwd(),
	modulePathIgnorePatterns: ['<rootDir>/.history'],
	moduleDirectories: [
		// 对于React ReactDOM
		'dist/node_modules',
		...defaults.moduleDirectories
	],
	testEnvironment: 'jsdom'
};
