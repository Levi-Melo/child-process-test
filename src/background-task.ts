process.on('message', (rows:any[]) => {
    for (const item of rows) {
        console.log(item)
        process.send!('item-done');
    }
});
