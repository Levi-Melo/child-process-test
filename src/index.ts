import {createReadStream} from 'fs'
import { initialize } from './cluster'
import { Transform } from 'stream'

(()=>{
  const COLUMNS_SIZE = Number(process.env.COLUMNS_SIZE!)
  const CLUSTER_SIZE = Number(process.env.CLUSTER_SIZE!)
  
  const TASK_FILE = __dirname + '/background-task'
  const start = Date.now()
  
  const cp = initialize(
    {
        backgroundTaskFile: TASK_FILE,
        clusterSize: CLUSTER_SIZE,
    }
  )
  let restItems:any[] = []
  let count = 0
  const transform = new Transform({
    objectMode: true,
    readableObjectMode: true,
    writableObjectMode: true,
    transform: (
      data: Buffer,
      _,
      _callback
    ) => {
      count+=data.toString().split(',').length / COLUMNS_SIZE
      const items = [...restItems, data.toString().split(',')]
      if(items.length % COLUMNS_SIZE != 0){
        restItems = items.slice(-items.length % COLUMNS_SIZE)
      }
      cp.sendToChild(items)
      _callback();
    },
    flush:(_callback)=>{
      console.log('lines ≈', count)
      console.log(Date.now()- start)
      _callback()
    }
  }).on("error", (e) => console.log(e))
    const s = createReadStream('.csv')
    s.pipe(transform)
})()