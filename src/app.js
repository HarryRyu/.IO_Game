const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const usernameHandler = require('./usernameHandler.js')
const gameStart = require('./gameStart.js')
const keyEvent = require('./keyEvent.js')
const parameterHandler = require("./parameterHandler")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

var gameParameters = {'mapSize' : 30, 'mountain' : 20, 'city' : 30, 'gameSpeed' : 1}
var usernameList = [];
var gameSettings = {'map': [], 'visionContainer': [], 'unitContainer': [], 'alivePlayers' : [0], 'leaderboardStat' : []}
/*
This is where the program starts. When a client connects to the server, this function will run
*/
io.on('connection', (socket) => {

    //This function handles all input related to the username page
    usernameHandler(io, socket, usernameList, gameParameters);

    //For handing optional parameters
    parameterHandler(io, socket, gameParameters);
    
    //This function handles all input related to starting the game
    gameStart(io, socket, usernameList, gameSettings, gameParameters);

    keyEvent(io, socket, usernameList, gameSettings);
    socket.on('disconnect', () => {
        for (var i = 0; i < usernameList.length; i++){
            if (socket.id == usernameList[i].id){
                if (usernameList[i].inGame == false){
                }
                //If the user was in game
                if (usernameList[i].inGame == true){
                    gameSettings.alivePlayers[0]--;
                    usernameList[i].disconnected = true;
                    //Only occurs if the disconnection results in one player remaining in the game
                    if (gameSettings.alivePlayers[0] <= 1){
                        io.to('room').emit('gameover');
                        setTimeout(function(){
                            for (var j = 0; j < usernameList.length; j++){
                                usernameList[j].inGame = false;
                            }
                            for (var i = 0; i < usernameList.length; i++){
                                if (usernameList[i].disconnected == true){
                                    usernameList.splice(i, 1);     
                                }
                            }
                            io.to('room').emit('usernameReceived', false, usernameList)
                            io.to('room').emit('BacktoLobby');
                        }, 3000);
                    }
                }
                break;
            }
        }
    })

})

server.listen(port, () =>{
    console.log('Server is up on port 3000')
})



