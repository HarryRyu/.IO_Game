import {returnParameter} from '../parameters.js'

var keyQueue = [];
var position = returnParameter("position");
var intervalRun = false;
var interval;
var queueOpen = true;
export function keyEvent(tileArray, socket, drawQueue, arrowArray, playerID, gameOn){

    setInterval(function(){
        if (keyQueue.length != 0 && gameOn[0] == 1 && queueOpen){
            if (intervalRun == false){
                intervalRun = true;
                interval = setInterval(function(){
                    if (keyQueue.length == 0){
                        position.on = false;
                        intervalRun = false;
                        clearInterval(interval);
                    } else {
                        var eventParameter = keyQueue.shift();
                        if (tileArray[eventParameter[2]][eventParameter[3]].owner == playerID){
                            queueOpen = false;
                            socket.emit("keyDownEvent", eventParameter);
                        }
                        if (keyQueue.length == 0){
                            position.on = false;
                            intervalRun = false;
                            clearInterval(interval);
                        }
                    }
                }, 700);
            }
        }
    }, 50)

    // interval = setInterval(function(){
    //     if (keyQueue.length != 0){
    //         var eventParameter = keyQueue.shift();
    //         if (tileArray[eventParameter[2]][eventParameter[3]].owner == playerID){
    //             socket.emit("keyDownEvent", eventParameter);
    //         }
    //         if (keyQueue.length == 0){
    //             position.on = false;
    //             intervalRun = false;
    //         }
    //         if (gameOn[0] == 0){
    //             clearInterval(interval);
    //         }
    //     }
    // }, 700);

    //When key is pressed
    document.addEventListener("keydown", event => {
        if (event.keyCode == 69) {
            if (keyQueue.length > 0){
                var tmp = keyQueue.pop();
                arrowArray.pop();
                position.x = tmp.position_x;
                position.y = tmp.position_y;
                position.on = true;
                drawQueue[0]++;

            }
        }
        else if (position.on == true){
            //For ahead movements
            var delta_x;
            var delta_y;
            //up
            if (event.keyCode == 38 || event.keyCode == 87){
                delta_x = 0;
                delta_y = -1;
            }
            //right
            else if (event.keyCode == 37 || event.keyCode == 65){
                delta_x = -1;
                delta_y = 0;
            }
            //left
            else if (event.keyCode == 39 || event.keyCode == 68){
                delta_x = 1;
                delta_y = 0;
            }
            //down
            else if (event.keyCode == 40 || event.keyCode == 83){
                delta_x = 0;
                delta_y = 1;
            }
        
            if (position.x + delta_x >= 0 && position.x + delta_x < tileArray.length && position.y + delta_y >= 0 && position.y + delta_y < tileArray.length) {
                if (keyQueue.length < 30){
                    //Lines up for queue
                    const sendEvent = [delta_x, delta_y, position.x, position.y, playerID];
                    keyQueue.push(sendEvent);
                    //For arrow drawing
                    arrowArray.push({'x1': position.x, 'y1' : position.y, 'x2': delta_x, 'y2' : delta_y});
                    tileArray[position.x][position.y].click = false;
                    position.x += delta_x;
                    position.y += delta_y;
                    tileArray[position.x][position.y].click = true;
                    drawQueue[0]++;
                }
            }
        }
    })
}

export function keyUpdate(tileArray, result, arrowArray, removeContainer, cancelMovement, drawQueue){
    if (cancelMovement){
        position.on = false;
        keyQueue.length = 0;
        arrowArray.length = 0;
    }
    for (var i = 0; i < result.length; i++){
        var x = result[i][0];
        var y = result[i][1];
        var map = result[i][2];
        if (map.terrain == 1){
            tileArray[x][y].terrain = 5;
        }
        else {
            tileArray[x][y].terrain = map.terrain;
            tileArray[x][y].owner = map.owner;
            tileArray[x][y].troop = map.troop;
        }
    }
    if (removeContainer != null){
        for (var i = 0; i < removeContainer.length; i++){
            const x = removeContainer[i].x;
            const y  = removeContainer[i].y;
            if (tileArray[x][y].terrain == 5){
                tileArray[x][y].terrain = 1;
            }
            else {
                tileArray[x][y].terrain = 0;
            }
        }
    }
    arrowArray.shift();
    drawQueue[0] = 1;
    queueOpen = true;
}