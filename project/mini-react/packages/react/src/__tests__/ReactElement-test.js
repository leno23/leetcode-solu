'use strict';

let React;
let ReactDOM;
let ReactTestUtils;

describe('ReactElement', () => {
	let ComponentFC;
	let originalSymbol;
	beforeEach(() => {
		jest.resetModules();

		originalSymbol = global.Symbol;
		global.Symbol = undefined;
		React = require('react');
		ReactDOM = require('react-dom');
		ReactTestUtils = require('react-dom/test-utils');
		ComponentFC = () => {
			return React.createElement('div', { key: 1 });
		};
	});

	// 原生环境不支持Symbol时，type为0xeac7
	it('uses the fallback value when in an environment without symbol', () => {
		expect((<div />).$$typeof).toBe(0xeac7);
	});
	it('returns a complete element according to spec', () => {
		const element = React.createElement(ComponentFC);
		expect(element.type).toBe(ComponentFC);
		expect(element.key).toBe(null);
		expect(element.ref).toBe(null);

		expect(element.props).toEqual({});
	});

	it('uses the fallbac bnk value when in an environment without symbol', () => { });

	it('merge an additional arguments onto the children prop', () => {
		const a = 1;
		const element = React.createElement(ComponentFC, { children: 'text' }, a);
		expect(element.props.children).toBe(a);
	});

	it('does not warn for NaN props', () => {
		function Test() {
			return <div />;
		}
		const test = ReactTestUtils.renderIntoDocument(<Test value={+undefined} />);
		expect(test.props.value).toBeNaN;
	});
});
