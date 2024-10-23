import { initialize } from "./cluster.js"
import fs from 'fs'
import readline from 'readline'
const ITEMS_PER_PAGE = 100
const CLUSTER_SIZE = 99
const TASK_FILE = new URL('./background-task.js').pathname

    async function* getAllPagedData(itemsPerPage:number) {
    const rl = readline.createInterface({
      input: fs.createReadStream('.csv'),
      crlfDelay: Infinity,
    });
  
    let currentPage = [];
    let currentPageCount = 0;
    for await (const line of rl ) {
    const row = line.split(',');
    if(row.length !== 1){
        currentPage.push(row)
    }
      currentPageCount++;
  
      if (currentPageCount >= itemsPerPage) {
        yield currentPage;
        currentPage = [];
        currentPageCount = 0;
      }
    }
  
    if (currentPage.length > 0) {
      yield currentPage;
    }
  }


const cp = initialize(
    {
        backgroundTaskFile: TASK_FILE,
        clusterSize: CLUSTER_SIZE,
    }
)

for await (const data of getAllPagedData(ITEMS_PER_PAGE)) {
    cp.sendToChild(data)
}