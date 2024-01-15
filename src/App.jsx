import React from './core/react-dom/React.js'

function App() {
    return (
        <div>
            hi mini react jsx
            <h1>h1 content</h1>
            <div>
                content
                <h2>h2 content</h2>
                <Count count={10}></Count>
                <Count count={20}></Count>
            </div>
        </div>
    )    
}
function Count({ count }){
    return <div>{ count }</div>
}
export default App
