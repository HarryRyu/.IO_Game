function updateUnit(io, socket, usernameList, gameSettings, gameParameters){
    console.log(gameParameters);

    //update units every 3 second
    updateUnit = setInterval(function(){

        var map = gameSettings.map;
        var visionContainer = gameSettings.visionContainer;
        var unitContainer = gameSettings.unitContainer;
        var alivePlayers = gameSettings.alivePlayers;
        var leaderboardStat = gameSettings.leaderboardStat


        for (var i = 0; i < unitContainer.length; i++){
            map[unitContainer[i].x][unitContainer[i].y].troop++;
            leaderboardStat[map[unitContainer[i].x][unitContainer[i].y].owner][1]++;
        }
        //Sending it to people who are still alive
        for (var i = 0; i < visionContainer.length; i++){
            if (visionContainer[i].length != 0){
                tmpArray = [];
                for (var j = 0; j < visionContainer[i].length; j++){
                    tmpArray.push([visionContainer[i][j].x, visionContainer[i][j].y, map[visionContainer[i][j].x][visionContainer[i][j].y]]);
                }
                if (usernameList[i] != null){
                    io.to(usernameList[i].id).emit('update', tmpArray);
                }
            }
        }
        io.to('room').emit('updateLeaderBoard', leaderboardStat);
        if (gameSettings.alivePlayers[0] <= 1){
            clearInterval(updateUnit);
        }
    }, 10000 / (gameParameters.gameSpeed / 10));
    
    // updateCityState = setInterval(function(){
    //     for (var i = 0; i < cityContainer.length; i++){
    //         var x = cityContainer[i][0];
    //         var y = cityContainer[i][1];
    //         map[x][y].troop++;
    //     }
    //     for (var i = 0; i < alivePlayers.length; i++){
    //         if (alivePlayers[i] != null){
    //             tmpArray = [];
    //             for (var j = 0; x < visionContainer[i].length; x++){
    //                 tmpArray.push(map[visionContainer[i][j][0]][visionContainer[i][j][1]]);
    //             }
    //             io.to(toString(i)).emit('update', tmpArray);
    //         }
    //     }
    // }, 3000);
}

module.exports = updateUnit;