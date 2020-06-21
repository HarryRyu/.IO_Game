import {returnParameter} from '../parameters.js'

var position = returnParameter("position");
var zoom = returnParameter("zoom");
var tileSize = returnParameter("tileSize")

/*
When the player clicks the mouse while hovering over a tile in the game, the game must know that the tile has been clicked.
This function will provide that function.
*/

export function clickEvent(tileArray, drawQueue, playerID){ 

    document.getElementById('gameCanvas').addEventListener("click", event => {
        //These variables stores the location of the mouse on the screen when the event happens
        const mouse_x = event.clientX
        const mouse_y = event.clientY

        //position of mouse on tile
        position.x = Math.floor((mouse_x / zoom.scale + zoom.originx) / tileSize);
        position.y = Math.floor((mouse_y / zoom.scale + zoom.originy) / tileSize);
        //Now you know which tile was clicked
        //if a tile was clicked and it is a territory
        if (position.x < tileArray.length && position.y < tileArray.length && tileArray[position.x][position.y].owner == playerID){
            position.on = true;

        }
        //if a tile was not clicked
        else {
            position.on = false;
        }
        drawQueue[0] = 1;
    })
}