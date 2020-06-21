//
//Import files
//
import {onGameStart} from './game.js'
import {eventListener} from './eventListener.js'
import {updateLeaderboard} from './updateLeaderboard.js'

//
//some constants for DOM
//
const receiveUsernameForm = document.getElementById('login-form')
const receiveGameStart = document.getElementById('game-start')
const receiveUsernameButton = document.getElementById('user-submit')
const loginPage = document.getElementById('login-page')
const title = document.getElementById('title')
const mainPage = document.getElementById('main-page')
const gamePage = document.getElementById('game-page')
const canvas = document.getElementById('gameCanvas')
const userList = document.querySelector("#lobby-list")
const userTemplate = document.querySelector('#user-template').innerHTML
const loadingScreen = document.querySelector('#loading-screen');
const userTable = document.querySelector('#lobby-table')
const leaderboard = document.querySelector('#leaderboard')
const gameOverPage = document.querySelector('#game-over-page')

const range1 = document.querySelector('#range1')
const range2 = document.querySelector('#range2')
const range3 = document.querySelector('#range3')
const range4 = document.querySelector('#range4')
const output1 = document.querySelector('#output1')
const output2 = document.querySelector('#output2')
const output3 = document.querySelector('#output3')
const output4 = document.querySelector('#output4')

//
//Setup server
//
//socket is for connection with server
//username is the variable that stores the username the user submits in the beginning
//playerID
//gameOn is the variable that remembers whether a game is currently ongoing
const socket = io();
var username;
var gameOn = [0];
/*
This eventlistener runs when the user submits a username in the beginning.
It will store the inputted username in the username variable and send a request to the server to
see if the same username already exists
*/
receiveUsernameForm.addEventListener('submit', (e) => {
    e.preventDefault()
    receiveUsernameButton.setAttribute('disabled', 'disabled')
    username = receiveUsernameForm.querySelector('input').value
    socket.emit('sendUsername', username) 
    receiveUsernameButton.removeAttribute('disabled')
})

/*
The server will respond to the username request. If there are no identical username present in the server
the player will enter the main page, where there will be a list of online users and users that are currently in a game
*/
socket.on('usernameReceived', (usernameExist, usernameList, gameParameters) => {
    var lobbyHeight = 43.4;
    if (!usernameExist){
        if (gameOn[0] == 0) {
            //For exiting login page
            loginPage.style.display = "none"
            title.style.display = "none"
            mainPage.style.display = "block"
            userList.style.display = "block"
            
            if (gameParameters != null){
                range1.value = gameParameters.mapSize;
                range2.value = gameParameters.mountain;
                range3.value = gameParameters.city;
                range4.value = gameParameters.gameSpeed;
                output1.innerHTML = gameParameters.mapSize;
                output2.innerHTML = gameParameters.mountain + '%';
                output3.innerHTML = gameParameters.city;
                output4.innerHTML = gameParameters.gameSpeed;
            }
        }
        //For removing existing lobby list
        var lobbyList = userTable.getElementsByTagName('tbody');
        const lobbyLength = lobbyList.length;
        for (var i = 1; i < lobbyLength; i++){
            lobbyList[1].remove();
        }
        for (var i = 0; i < usernameList.length; i++){
            //For list of users in lobby
            if (usernameList[i].inGame == false && usernameList[i].ready == false){
                const user = Mustache.render(userTemplate, {
                    username: usernameList[i].username,
                })
                userTable.insertAdjacentHTML('beforeend', user);
                lobbyHeight += 23.2;
                document.getElementsByClassName("ready")[i].style = "color: transparent; text-shadow: 0 0 0 yellow";
                document.getElementsByClassName("ready")[i].innerHTML = '&#9898'
            }
            else if (usernameList[i].inGame == false && usernameList[i].ready == true) {
                //For list of users in game
                const user = Mustache.render(userTemplate, {
                    username: usernameList[i].username,
                })
                userTable.insertAdjacentHTML('beforeend', user);
                lobbyHeight += 23.2;
                document.getElementsByClassName("ready")[i].style = "color: transparent; text-shadow: 0 0 0 green";
                document.getElementsByClassName("ready")[i].innerHTML = '&#10003';
            }
            else {
                //For list of users in game
                const user = Mustache.render(userTemplate, {
                    username: usernameList[i].username,
                })
                userTable.insertAdjacentHTML('beforeend', user);
                lobbyHeight += 23.2;
                document.getElementsByClassName("ready")[i].style = "color: transparent; text-shadow: 0 0 0 red";
                document.getElementsByClassName("ready")[i].innerHTML = '&#9898'
            }
        }
        userList.style.height = lobbyHeight + "px";
    }
    else {
        receiveUsernameForm.querySelector('input').value = '';
    }
})

/*
In the main screen, players will have the option to click on start to indicate that they are ready to play.
The function will send a notification to the server, and if all players online indicate they are ready, the game will start
*/
receiveGameStart.addEventListener('submit', (e) => {
    e.preventDefault()
    receiveGameStart.setAttribute('disabled', 'disabled')
    socket.emit('startGame', username) 
    receiveGameStart.removeAttribute('disabled')
})

//For parameter sliders

range1.oninput = function(){
    socket.emit('mapParam', this.value);
}
range2.oninput = function(){
    socket.emit('mountainParam', this.value);
}
range3.oninput = function(){
    socket.emit('cityParam', this.value);
}

range4.oninput = function(){
    socket.emit('gameSpeedParam', this.value);
}

socket.on('mapParamRes', result => {
    output1.innerHTML = result
    range1.value = result;
})
socket.on('mountainParamRes', result => {
    output2.innerHTML = result + "%";
    range2.value = result;
})
socket.on('cityParamRes', result => {
    output3.innerHTML = result
    range3.value = result;
})
socket.on('gameSpeedParamRes', result => {
    output4.innerHTML = result / 10
    range4.value = result;
})

//
//Beginning of game
//

//Canvas width and height will be equal to the size of the browser
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



//When all players are ready, the server will send a message to all players indicating that the game has started
socket.on('gameStart', result => {
    //This variable has the inital map created by the server
    var tmpMap = result[0];
    //This variable has the leaderboard stats first created by the server
    var leaderboardStat = result[1];
    //This variable has the vision information for the player
    var visionArray = result[2];
    //This variable is the player ID (not socket ID)
    var playerID = result[3];
    //The next several functions turns of the lobby and turns on the game page
    userList.style.display = "none"
    loadingScreen.style.display = "block"
    mainPage.style.display = "none"
    //Starts the game by chaning gameOn to 1
    gameOn[0] = 1;

    //This is a 2D array that stores the map for the game
    console.log(tmpMap)
    var tileArray = onGameStart(tmpMap)
    //This loop updates the map with the vision information
    for (var i = 0; i < visionArray.length; i++){
        var x = visionArray[i][0];
        var y = visionArray[i][1];
        if (visionArray[i][2].terrain == 1){
            tileArray[x][y].terrain = 5;
        }
        else {
            tileArray[x][y].terrain = visionArray[i][2].terrain;
            tileArray[x][y].owner = visionArray[i][2].owner;
            tileArray[x][y].troop = visionArray[i][2].troop;
        }
    }

    updateLeaderboard(socket, leaderboardStat);
    eventListener(socket, tileArray, playerID, gameOn);
})

socket.on('loadingScreenCancel', result => {
    loadingScreen.style.display = "none"
    leaderboard.style.display = "block"
    gamePage.style.display = "block"
})

socket.on('gameover', result => {
    leaderboard.style.display = "none";
    gamePage.style.display = "none";
    gameOverPage.style.display = "block"
})

//When there is only one player remaining, the server will send a message to the remaining players in the game that the game is over
socket.on('BacktoLobby', result => {
    userList.style.display = "block";
    gameOverPage.style.display = "none";
    mainPage.style.display = "block";
    gameOn[0] = 0;
})