import { fork } from 'child_process'


function roundRoubin(array:any[], index = 0) {
    return function () {
        if (index >= array.length) index = 0

        return array[index++]
    }
}

function initializeCluster({ backgroundTaskFile, clusterSize }:{
    backgroundTaskFile:string, 
    clusterSize:number
}) {
    const processes = new Map()
    for (let index = 0; index < clusterSize; index++) {

        const child = fork(backgroundTaskFile)
        child.on('exit', () => {
            processes.delete(child.pid)
        })

        child.on('error', error => {
            console.log({error})
            process.exit(1)
        })


        processes.set(child.pid, child)
    }

    return {
        getProcess: roundRoubin([...processes.values()]),
        killAll: () => {
            processes.forEach((child) => child.kill())
        }
    }

}

export function initialize(this: any, { backgroundTaskFile, clusterSize}:{
    backgroundTaskFile:string, 
    clusterSize:number
}) {

    const { getProcess, killAll } = initializeCluster({ backgroundTaskFile, clusterSize })

    function sendToChild(message:any) {
        const child = getProcess()
        child.send(message)
    }


    return {
        sendToChild: sendToChild.bind(this),
        killAll: killAll.bind(this)
    }
}


