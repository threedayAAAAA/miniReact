import React from './core/react-dom/React.js'

function App() {
    const handler = () => {
        console.log('handler')
    }
    return (
        <div>
            hi mini react jsx
            <h1>h1 content</h1>
            <div>
                content
                <h2>h2 content</h2>
                <button onClick={handler}>click</button>
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
