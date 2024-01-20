import React from './core/react-dom/React.js'

let count = 10
let showBar = false
let showMany = false
let showFalse = false
let showFunction = false

function App(){
    const [count, setCount] = React.useState(10)
    const addAppCount = () => {
        setCount(count + 1)
    }
    console.log('update APP')
    return <div>
        <hr />
        <h1>01.支持条件渲染组件,动态渲染组件</h1>
        <UpdateChildren />

        <hr />
        <h1>02.使用useState状态变化时,只更新对应组件而不是整体重新渲染</h1>
        <p>app count: { count }</p>
        <div><button onClick={addAppCount}>appCount++</button></div>
        <Count />
        <Count2 />
        
        <hr />
        <h1>03.支持useEffect</h1>
        <Effect />
    </div>
}

function Effect(){
    const [count, setCount] = React.useState(10)
    const [bar, setBar] = React.useState('bar')
    const addCount = () => setCount(count + 1)
    const addBar = () => setBar(bar + 'bar')
    const setBarEqualVal = () => setBar(bar)
    React.useEffect(() => {
        console.log('init')
        return () => {
            console.err('cleanup not deps')
        }
    }, [])
    React.useEffect(() => {
        console.log('update: count')
        return () => {
            console.log('cleanup update: count')
        }
    }, [count])
    React.useEffect(() => {
        console.log('update: count or bar')
        return () => {
            console.log('cleanup update: count or bar')
        }
    }, [count, bar])
    return <div>
        <p>count: { count }</p>
        <p>bar: { bar }</p>
        <div><button onClick={addCount}>addCount</button></div>
        <div><button onClick={addBar}>addBar</button></div>
        <div><button onClick={setBarEqualVal}>setBarEqualVal</button></div>
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

function UpdateChildren() {
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
            <div>
                <button onClick={showBarHandler}>showBar</button>
                { showBar ? bar : foo }
            </div>

            <div>
                <button onClick={showFunctionHandler}>切换函数组件渲染</button>
                { showFunction ? <Bar /> : <Foo /> }
            </div>

            <div>
                <button onClick={showManyHandler}>切换子组件变多或变少渲染</button>
                { showMany ? manyNode : fewNode }
            </div>


            <div>
                <p>showFalse</p>
                { showFalse && falseNode }
                <button onClick={showFalseHandler}>使用false && 的语法动态切换</button>
            </div>
        </div>
    )    
}
export default App
