
import React from 'react-noop-renderer'

function App() {
    return (
        <>
            <Child></Child>
            <div>hello</div>
        </>
    )
}

function Child() {
    return 'Child'
}
const root = React.createRoot()
root.render(<App />)
window.root = root