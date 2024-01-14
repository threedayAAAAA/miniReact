function taskSchedule(deadLine, taskFn) {
    let shouldYield = false
    while(!shouldYield){
        taskFn()
        shouldYield = deadLine.timeRemaining() < 1
    }
    runTask(taskFn)
}

export function runTask(taskFn){
    requestIdleCallback(deadLine => taskSchedule(deadLine, taskFn))
}