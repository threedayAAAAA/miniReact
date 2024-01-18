import React from './core/react-dom/React.js'

let count = 10
let showBar = false
let showMany = false
let showFlase = false
let showFunction = false
function App() {
    const onAdd = () => {
        count++
        React.update()
    }
    const showBarHandler = () => {
        showBar = !showBar
        React.update()
    }
    const foo = <p>foo</p>
    const bar = <div>bar</div>

    const fewNode = <p>few</p>
    const manyNode = <div>
        many
        <p>child</p>
        <p>child2</p>
    </div>
    const showManyHandler = () => {
        showMany = !showMany
        React.update()
    }

    const falseNode = <p>falseNode</p>
    const showFlaseHandler = () => {
        showFlase = !showFlase
        React.update()
    }

    const showFunctionHandler = () => {
        showFunction = !showFunction
        React.update()
    }
    const Foo = () => <p>foo</p>
    const Bar = () => <div>bar</div>
    return (
        <div>
            hi
            <h1>h1 content</h1>
            <div>
                content
                <h2>h2 content</h2>
                <Count count={count}></Count>
                <Count count={count * 2}></Count>
                <button onClick={onAdd}>+1</button>

                <div>
                    <button onClick={showBarHandler}>showBar</button>
                    { showBar ? bar : foo }
                </div>

                <div>
                    <button onClick={showFunctionHandler}>showFunction</button>
                    { showFunction ? <Bar /> : <Foo /> }
                </div>

                <div>
                    <button onClick={showManyHandler}>showMany</button>
                    { showMany ? manyNode : fewNode }
                </div>


                <div>
                    <p>showFlase</p>
                    { showFlase && falseNode }
                    <button onClick={showFlaseHandler}>showFlase</button>
                </div>
            </div>
        </div>
    )    
}
function Count({ count }){
    return <div>{ count }</div>
}
export default App
