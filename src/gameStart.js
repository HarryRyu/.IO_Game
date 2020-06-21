const gameParameter = require('./GameParameter')
const updateUnit = require('./updateUnit.js')

//Monitors how many players in the game are ready to star the game
var readyNum = 0;

function gameStart(io, socket, usernameList, gameSettings, gameParameters){
        /*
        This function will run when the client clicks the start button on the main menu. If all players in the menu 
        indicate that they are ready, the game will start
        */
       
    socket.on('startGame', (username, callback) => {
        /*
        This loop will run to update whether the players in the lobby are ready or not
        */
        for (var i = 0; i < usernameList.length; i++){
            if (usernameList[i].username == username){
                if (usernameList[i].ready == false){
                    usernameList[i].ready = true;
                }
                else if (usernameList[i].ready == true){
                    usernameList[i].ready = false;
                }
                io.to('room').emit('usernameReceived', false, usernameList);

                break;
            }
        }
        /*
        This function runs if all players in the main menu are ready
        */
        readyNum = 0;
        for (var i = 0; i < usernameList.length; i++){
            if (usernameList[i].ready == true){
                readyNum++;
            }
        }
        if (readyNum == usernameList.length && readyNum > 1){
            for (var i = 0; i < usernameList.length; i++){
                usernameList[i].ready = false;
            }

            //This variable will check how many players are still alive in the game
            gameSettings.alivePlayers[0] = usernameList.length;

            //Update usernameList so that all players in the lobby are now inside the game
            for (var i = 0; i < readyNum; i++){
                usernameList[i].inGame = true;
                usernameList[i].ready = false;
            }

            //This function sets up the game settings
            result = gameParameter(gameSettings.alivePlayers[0], gameParameters);
            var tmpMap = result.tmpMap;
            gameSettings.map = result.map;
            gameSettings.visionContainer = result.visionContainer;
            gameSettings.unitContainer = result.unitContainer;
            
            //This function will set up the leaderboard inside the game
            for (var i = 0; i < gameSettings.alivePlayers[0]; i++){
                var tmpArray = [usernameList[i].username, 1, 1];
                gameSettings.leaderboardStat.push(tmpArray);
            }
            /*
            Each player will have different visions of the map. This loop will send each player different maps based on 
            which tiles they have visions of
            */
            for (var i = 0; i < gameSettings.alivePlayers[0]; i++){
            tmpArray = [];
            for (var j = 0; j < gameSettings.visionContainer[i].length; j++){
                //The tile location and the number of troops on the tile
                var vision = gameSettings.visionContainer[i][j];
                tmpArray.push([vision.x, vision.y, gameSettings.map[vision.x][vision.y]]);
            }
            //Sends map information and leaderboard to each player along with unique vision information
            io.to(usernameList[i].id).emit('gameStart', [tmpMap, gameSettings.leaderboardStat, tmpArray, i]);
            }

            setTimeout(function(){
            io.to('room').emit('loadingScreenCancel');
            //After the game starts, this function will increase the number of units in tiles
            updateUnit(io, socket, usernameList, gameSettings, gameParameters);
            }, 3000);
        }
    })
}

module.exports = gameStart;