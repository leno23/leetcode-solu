'use strict';

let React;
let ReactDOM;
let ReactTestUtils;

describe('ReactElement', () => {
	let ComponentFC;
	let originalSymbol;
	beforeEach(() => {
		jest.restModules();

		originalSymbol = global.Symbol;
		global.Symbol = undefined;
		React = require('react');
		ReactDOM = require('react-dom');
		ReactTestUtils = require('react-test-utils');
		ComponentFC = () => {
			return React.createElement('div');
		};
	});

	it('uses the fallback value when in an environment without symbol', () => {
		expect((<div />).$$typeof).toBe(0xeac7);
	});
	it('returns a complete element according to spec', () => {
		const element = React.createElement(ComponentFC);
		expect(element.type).toBe(ComponentFC);
		expect(element.key).toBe(null);
		expect(element.ref).toBe(null);
	});

	it('uses the fallbac bnk value when in an environment without symbol', () => {});
});
