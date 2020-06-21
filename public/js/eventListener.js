import {draw, windowEvent} from './draw.js'
import {clickEvent} from './events/clickEvent.js'
import {wheelEvent} from './events/wheelEvent.js'
import {dragEvent} from './events/dragEvent.js'
import {keyEvent, keyUpdate} from './events/keyEvent.js'
import {update} from './update.js'

//Settings for zooming and dragging
var drawQueue = [0];
var arrowArray = [];

/*
When the game is started, the eventListener and leaderboard function will start running. The eventListener function will listen
to user inputs from the client and send back data to the server.

    clickEvent: runs when the user clicks in the game. (It will allow the player to click on tiles / units)
    dragEvent: runs when the user holds the left mouse button and drags it around. (It will move the map around the screen)
    keyEvent: runs when the user presses the keyboard. (It will allow the player to move units if the unit is clicked beforehand)
    wheelEvent: runs when the wheel on the mouse is rolled. (It will zoom the map in and out)

*/
export function eventListener(socket, tileArray, playerID, gameOn){

    drawQueue[0] = 1;
    
    /*
    In order to prevent the system from rerendering multiple times in an unnecessarily short period of time, the timer will rerender the canvas
    every 20ms if the drawQueue is set to 1.

    When the game is over, it will terminate itself
    */
    var timer = setInterval(function(){
        if (drawQueue[0] != 0){
            draw(tileArray, arrowArray);
            drawQueue[0] = 0;
        }
        if (gameOn[0] == 0){
            clearInterval(timer);
        }
    }, 20)

    //These are the different events as mentioned above

    //When wheel is rolled
    wheelEvent(drawQueue);
    //When mouse is clicked
    clickEvent(tileArray, drawQueue, playerID);
    //When mouse is dragged
    dragEvent(drawQueue);
    //When keyboard is pressed
    keyEvent(tileArray, socket, drawQueue, arrowArray, playerID, gameOn);
    //When window is resized
    windowEvent();


    /*
    Every few second, the server will update the game by increasing the number of units on each tile, among others
    When this happens, the server will send a message to the client with the new information, which this function will receive
    */ 
    
    socket.on('update', result => {
        update(tileArray, result, drawQueue);
    })

    /*
    When the keyEvent is run, the server will make calculations and return the results to the client. This event will run when 
    another client in the game pressed a keyboard and this client had vision where the armies were moved
    */

    socket.on('keyUpdate', (result, removeContainer, cancelMovement) => {
        keyUpdate(tileArray, result, arrowArray, removeContainer, cancelMovement, drawQueue);
    })
        
}
