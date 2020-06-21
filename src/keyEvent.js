const keyCalculations = require('./keyCalculations')

function keyEvent(io, socket, usernameList, gameSettings){
    //Runs when keyboard event is received
    socket.on('keyDownEvent', (event, callback) => {

        var map = gameSettings.map;
        var visionContainer = gameSettings.visionContainer;
        var alivePlayers = gameSettings.alivePlayers;

        var enemyID = map[event[2] + event[0]][event[3] + event[1]].owner;
        var playerID = map[event[2]][event[3]].owner;

        const result = keyCalculations(event, gameSettings);
        const playerVision = result.playerVision;
        const removeContainer = result.removeContainer;
        const cancelMovement = result.cancelMovement;

        /*
        This loop occurs if there are at least two players alive
        */
        if (alivePlayers[0] > 1){

            for (var i = 0; i < playerVision.length; i++){
                var player = playerVision[i];

                tmpArray = [];
                for (var j = 0; j < visionContainer[player].length; j++){
                    tmpArray.push([visionContainer[player][j].x, visionContainer[player][j].y, map[visionContainer[player][j].x][visionContainer[player][j].y]]);
                }
                /*
                Sends the updated result after calculations. The enemy has to receive a removeContainer if they lost territory since
                now their vision could be reduced
                */

                if (player == enemyID) {
                    io.to(usernameList[player].id).emit('keyUpdate', tmpArray, removeContainer, null);
                }
                else if (player == playerID){
                    io.to(usernameList[player].id).emit('keyUpdate', tmpArray, null, cancelMovement);
                }
                else {
                    io.to(usernameList[player].id).emit('keyUpdate', tmpArray);
                }
                io.to('room').emit('updateLeaderBoard', gameSettings.leaderboardStat);
            }
        }
        else {
            io.to('room').emit('gameover');
            setTimeout(function(){
                io.to('room').emit('BacktoLobby');
                for (var i = 0; i < usernameList.length; i++){
                    if (usernameList[i].disconnected == true){
                        usernameList.splice(i, 1);
                    }
                }
                for (var j = 0; j < usernameList.length; j++){
                    usernameList[j].inGame = false;
                }
                //send new userlist to everyone
                io.to('room').emit('usernameReceived', false, usernameList);
            }, 3000);
        }
    })
}

module.exports = keyEvent;