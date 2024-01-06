import { ReactElementType } from 'shared/ReactTypes';
// @ts-ignore
// import ReactDOM from './index';   // 不能使用相对路径引入，因为打包时会当做依赖打进去
import { createRoot } from 'react-dom';

export function renderIntoDocument(element: ReactElementType) {
	const div = document.createElement('div');
	return createRoot(div).render(element);
}
