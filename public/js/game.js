export function onGameStart(map){
    //size of map
    const tile_num = map.length;
    //array of tiles
    var tileArray = [];
    for (var i = 0; i < tile_num; i++){
        var insideArray = [];
        for (var j = 0; j < tile_num; j++){
            var tmpTile = new tile();
            if (map[i][j].terrain != 3){
                tmpTile.terrain = map[i][j].terrain;
            }
            insideArray.push(tmpTile);
        }
    tileArray.push(insideArray);
    }
    return tileArray;
}

function tile(){
    this.terrain = 0;
    this.owner = -1;
    this.troop = 0;
    this.nearbyTileNum = 0;
    this.nearbyTile = {
        up: 0,
        down : 0,
        left: 0,
        right: 0,
    }
}
