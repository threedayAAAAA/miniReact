import React from './core/react-dom/React.js'

let count = 10
let showBar = false
let showMany = false
let showFalse = false
let showFunction = false

function App(){
    const [count, setCount] = React.useState(10)
    const [bar, setBar] = React.useState('bar')
    const addAppCount = () => {
        setCount(count + 1)
    }
    const addBar = () => {
        setBar('bar')
    }
    console.log('update APP')
    return <div>
        <p>app count: { count }</p>
        <p>app bar: { bar }</p>
        <div>
            <button onClick={addAppCount}>appCount</button>
            <div>
                <button onClick={addBar}>addBar</button>
            </div>
        </div>
        <Count />
        <Count2 />
        <App2 />
    </div>
}

let count1 = 0
function Count(){
    const update = React.update()
    const addCount1 = () => {
        count1++
        update()
    }
    console.log('Count1 update')
    return <div>
        <p>count1: { count1 }</p>
        <div>
            <button onClick={addCount1}>count1++</button>
        </div>
    </div>
}

let count2 = 0
function Count2(){
    const update = React.update()
    const addCount2 = () => {
        count2++
        update()
    }
    console.log('Count2 update')
    return <div>
        <p>count2: { count2 }</p>
        <div>
            <button onClick={addCount2}>addCount2++</button>
        </div>
    </div>
}

function App2() {
    const update = React.update()
    const showBarHandler = () => {
        showBar = !showBar
        update()
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
        update()
    }

    const falseNode = <p>falseNode</p>
    const showFalseHandler = () => {
        showFalse = !showFalse
        update()
    }

    const showFunctionHandler = () => {
        showFunction = !showFunction
        update()
    }
    const Foo = () => <p>Foo</p>
    const Bar = () => <div>Bar</div>
    return (
        <div>
            hi
            <h1>h1 content</h1>
            <div>
                content
                <h2>h2 content</h2>
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
                    <p>showFalse</p>
                    { showFalse && falseNode }
                    <button onClick={showFalseHandler}>showFalse</button>
                </div>
            </div>
        </div>
    )    
}
export default App
