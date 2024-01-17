import React from './core/react-dom/React.js'

let count = 10
function App() {
    const onAdd = () => {
        count++
        React.update()
    }
    return (
        <div>
            hi mini react jsx
            <h1>h1 content</h1>
            <div>
                content
                <h2>h2 content</h2>
                <Count count={count}></Count>
                <Count count={count * 2}></Count>
                <button onClick={onAdd}>+1</button>
            </div>
        </div>
    )    
}
function Count({ count }){
    return <div>{ count }</div>
}
export default App
