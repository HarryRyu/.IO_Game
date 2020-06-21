export function update(tileArray, update, drawQueue){
    for (var i = 0; i < update.length; i++){
        var x = update[i][0];
        var y = update[i][1];
        tileArray[x][y].troop = update[i][2].troop;
    }
    drawQueue[0] = 1;
}