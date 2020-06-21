function keyCalculations(event, gameSettings){

    var map = gameSettings.map;
    var visionContainer = gameSettings.visionContainer;
    var unitContainer = gameSettings.unitContainer;
    var alivePlayers = gameSettings.alivePlayers;
    var leaderboardStat = gameSettings.leaderboardStat;

    var delta_x = event[0];
    var delta_y = event[1];
    var position_x = event[2];
    var position_y = event[3];
    const remainUnit = 0;
    const visionDistance = 1;

    const initialTile = map[position_x][position_y];
    const nextTile = map[position_x + delta_x][position_y + delta_y];
    const enemyID = nextTile.owner
    const playerID = initialTile.owner;
    var removeContainer = [];

    var cancelMovement = false;

    var playerVision = [];
    for (var i = 0; i < initialTile.vision.length; i++){
        playerVision.push(initialTile.vision[i]);
    }
    const visionLength = playerVision.length;
    for (var i = 0; i < nextTile.vision.length; i++){
        var alreadyExist = false;
        for (var j = 0; j < visionLength; j++){
            if (playerVision[j] == nextTile.vision[i]){
                alreadyExist = true;
            }
        }
        if (!alreadyExist){
            playerVision.push(nextTile.vision[i]);
        }
    }

    console.log('2: ', playerVision);

    if (position_x + delta_x >= 0 && position_x + delta_x < map.length && position_y + delta_y >= 0 && position_y + delta_y < map.length) {
        if (nextTile.terrain == 3 && initialTile.troop > remainUnit){
            //if empty tile
            if (nextTile.owner == -1){
                nextTile.troop = initialTile.troop - remainUnit;
                nextTile.owner = initialTile.owner
                initialTile.troop = remainUnit;

                //Update Leaderboard
                leaderboardStat[nextTile.owner][2]++;

                unitContainer.push({'x' : position_x + delta_x, 'y' : position_y + delta_y});

                for (var x = -visionDistance; x < visionDistance + 1; x++){
                    for (var y = -visionDistance; y < visionDistance + 1; y++){
                        if (position_x + delta_x + x >= 0 && position_x + delta_x + x< map.length && position_y + delta_y + y>= 0 && position_y + delta_y + y < map.length) {
                            var exist = false;
                            for (var i = 0; i < visionContainer[playerID].length; i++){
                                if (visionContainer[playerID][i].x == x + position_x + delta_x && visionContainer[playerID][i].y == y + position_y +  delta_y){
                                    visionContainer[playerID][i].count++;
                                    exist = true;
                                }
                            }
                            if (!exist){
                                visionContainer[playerID].push({'x': x + position_x +  delta_x, 'y' : y + position_y +  delta_y, 'count' : 1})
                                map[position_x + delta_x + x][position_y + delta_y + y].vision.push(playerID)
                            }
                        }
                    }
                }
            }
            //Owned by player
            else if (nextTile.owner == playerID){
                nextTile.troop += initialTile.troop - remainUnit;
                initialTile.troop = remainUnit;
            }
            //Owned by Enemy
            else {
                //Player has more troop than opponant
                if (initialTile.troop - remainUnit > nextTile.troop){

                    //For leaderboard
                    leaderboardStat[nextTile.owner][1] -= nextTile.troop;
                    leaderboardStat[nextTile.owner][2]--;
                    leaderboardStat[initialTile.owner][1] -= nextTile.troop;
                    leaderboardStat[initialTile.owner][2]++;

                    nextTile.troop = (initialTile.troop - remainUnit) - nextTile.troop;
                    nextTile.owner = initialTile.owner;
                    initialTile.troop = remainUnit;
                

                    //For vision 
                    for (var x = -visionDistance; x < visionDistance + 1; x++){
                        for (var y = -visionDistance; y < visionDistance + 1; y++){
                            if (position_x + delta_x + x >= 0 && position_x + delta_x + x< map.length && position_y + delta_y + y>= 0 && position_y + delta_y + y < map.length) {
                                //For ally vision
                                var exist = false;
                                for (var i = 0; i < visionContainer[playerID].length; i++){
                                    if (visionContainer[playerID][i].x == x + position_x +  delta_x && visionContainer[playerID][i].y == y + position_y +  delta_y){
                                        visionContainer[playerID][i].count++;
                                        exist = true;
                                    }
                                }
                                if (!exist){
                                    visionContainer[playerID].push({'x': x + position_x +  delta_x, 'y' : y + position_y +  delta_y, 'count' : 1})
                                    map[position_x + delta_x + x ][position_y + delta_y + y].vision.push(playerID)
                                }
                                //For enemy vision
                                for (var i = 0; i < visionContainer[enemyID].length; i++){
                                    if (visionContainer[enemyID][i].x == x + position_x + delta_x && visionContainer[enemyID][i].y == y + position_y +  delta_y){
                                        visionContainer[enemyID][i].count--;
                                        if (visionContainer[enemyID][i].count == 0){
                                            var tmp = visionContainer[enemyID].splice(i,1);
                                            removeContainer.push({'x' : tmp[0].x, 'y' : tmp[0].y})
                                            for (var k = 0; k < map[tmp[0].x][tmp[0].y].vision.length; k++){
                                                if (map[tmp[0].x][tmp[0].y].vision[k] == enemyID){
                                                    map[tmp[0].x][tmp[0].y].vision.splice(k,1);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (initialTile.troop - remainUnit <= nextTile.troop){
                    nextTile.troop = nextTile.troop - (initialTile.troop - remainUnit);
                    initialTile.troop = remainUnit;

                    //For leaderboard
                    leaderboardStat[nextTile.owner][1] -= (initialTile.troop - remainUnit);
                    leaderboardStat[initialTile.owner][1] -= (initialTile.troop - remainUnit);

                    cancelMovement = true;
                }
            }
        }
        //if mountain tile
        else if (map[position_x + delta_x][position_y+ delta_y].terrain == 1){
            cancelMovement = true;
            //Nothing happens
        }
        //King is present
        else if (nextTile.terrain == 4 && initialTile.troop > remainUnit){
            //Owned by player
            if (nextTile.owner == playerID){
                nextTile.troop += initialTile.troop - remainUnit;
                initialTile.troop = remainUnit;
            }
            //Owned by Enemy
            else {
                //Player has more troop than opponant
                if (initialTile.troop - remainUnit > nextTile.troop){
                    var defeated = nextTile.owner;
                    nextTile.troop = (initialTile.troop - remainUnit) - nextTile.troop;
                    //nextTile.owner = initialTile.owner;
                    initialTile.troop = remainUnit;
                    alivePlayers[0]--;
                    nextTile.terrain = 3;

                    //tile transfer
                    kingDied(enemyID, playerID, map, visionContainer, playerVision, visionDistance)

                    //For vision 
                    // var exist = false;
                    // for (var x = -visionDistance; x < visionDistance + 1; x++){
                    //     for (var y = -visionDistance; y < visionDistance + 1; y++){
                    //         //For ally vision
                    //         for (var i = 0; i < visionContainer[playerID].length; i++){
                    //             if (visionContainer[playerID][i].x == x + position_x +  delta_x && visionContainer[playerID][i].y == y + position_y +  delta_y){
                    //                 visionContainer[playerID][i].count++;
                    //                 exist = true;
                    //             }
                    //             if (!exist){
                    //                 visionContainer[playerID].push({'x': x + position_x +  delta_x, 'y' : y + position_y +  delta_y, 'count' : 1})
                    //             }
                    //         }
                    //         //For enemy vision
                    //         for (var i = 0; i < visionContainer[enemyID].length; i++){
                    //             if (visionContainer[enemyID][i].x == x + position_x + delta_x && visionContainer[enemyID][i].y == y + position_y +  delta_y){
                    //                 visionContainer[enemyID][i].count--;
                    //                 if (visionContainer[enemyID][i].count == 0){
                    //                     visionContainer[enemyID].splice(i,1);
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                }
                else if (initialTile.troop - remainUnit <= nextTile.troop){
                    nextTile.troop = nextTile.troop - (initialTile.troop - remainUnit);
                    initialTile.troop = remainUnit;

                    cancelMovement = true;
                }
            }
        }
    }
    result = {'playerVision' : playerVision, 'removeContainer' : removeContainer, 'cancelMovement' : cancelMovement}
    return result;
}

function kingDied(enemyID, playerID, map, visionContainer, playerVision, visionDistance){

    for (var k = 0; k < visionContainer[enemyID].length; k++){
        
        var tile_x = visionContainer[enemyID][k].x;
        var tile_y = visionContainer[enemyID][k].y;
        //Transfer Tile
        if (map[tile_x][tile_y].owner == enemyID){

            map[tile_x][tile_y].owner = playerID;

            for (var i = 0; i < map[tile_x][tile_y].vision.length; i++){
                for (var j = 0; j < playerVision.length; j++){
                    if (playerVision[j] != map[tile_x][tile_y].vision[i]){
                        playerVision.push(map[tile_x][tile_y].vision[i]);
                    }
                }
            }

            //New Vision
            for (var x = -visionDistance; x < visionDistance + 1; x++){
                for (var y = -visionDistance; y < visionDistance + 1; y++){
                    if (tile_x + x >= 0 && tile_x + x < map.length && tile_y + y>= 0 && tile_y + y < map.length) {
                        var exist = false;
                        for (var i = 0; i < visionContainer[playerID].length; i++){
                            if (visionContainer[playerID][i].x == x + tile_x && visionContainer[playerID][i].y == y + tile_y){
                                visionContainer[playerID][i].count++;
                                exist = true;
                            }
                        }
                        if (!exist){
                            visionContainer[playerID].push({'x': x + tile_x, 'y' : y + tile_y, 'count' : 1})
                            map[tile_x + x][tile_y + y].vision.push(playerID)
                        }
                    }
                }
            }

        }
    }
}

module.exports = keyCalculations;