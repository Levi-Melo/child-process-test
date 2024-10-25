process.on('message', (data:string[]) => {
    let item:string[] = []
    data.reduce((acc, input, index)=>{
        item.push(input)
        if(index+1 % Number(process.env.COLUMNS_SIZE) == 0){
            acc.push(item)
            item = []
        }
        return acc
    }, [] as (string[])[])
    process.send!('item-done');
});
