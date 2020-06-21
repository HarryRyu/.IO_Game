import {returnParameter} from './parameters.js'

var position = returnParameter("position");
var zoom = returnParameter("zoom");
var tileSize = returnParameter("tileSize");
var tileSizeActual = returnParameter("tileSizeActual");
var tileBorder = returnParameter("tileBorder");
var color = returnParameter("color");
var playerColor = returnParameter("playerColor");
var totalPlayer = returnParameter("totalPlayer");
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext("2d");

export function windowEvent(){
    window.addEventListener('resize', event => {
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext("2d");
    })
}

//For drawing the canvas 
export function draw(tileArray, arrowArray){
    const tile_num = tileArray.length;
    //Clear the background
    ctx.fillStyle = "black";
    ctx.clearRect(zoom.originx , zoom.originy , canvas.width / zoom.scale, canvas.height / zoom.scale);
    //For drawing tiles
    for (var x = 0; x < tile_num; x++){
        for (var y = 0; y < tile_num; y++){
            //Current state of the tile
            const terrain = tileArray[x][y].terrain;
           /*
           Terrain 0 indicates that there is no vision on the tile. It will just draw a gray tile. This terrain excludes mountains
           */
            if (terrain == 0){
                ctx.fillStyle = color.empty;
                ctx.fillRect(x * tileSize,y * tileSize, tileSizeActual, tileSizeActual);           
            }
            /*
            Terrain 1 indicates that the tile has a mountain on top. This function will draw a mountain on top of the tile
            */
            else if (terrain == 1){

                drawMountain(x, y);
            }
            /*
            Terrain 3 indicates that the tile is empty. This function will color the terrain with the player's color
            */
            else if (terrain == 3) {
                var owner = tileArray[x][y].owner;
                drawTile(x, y, owner);
                drawNumber(x, y, tileArray);
            }
            /*
            Terrain 4 indicates that the tile has a king. This will draw a king on top of the tile
            */
            else if (terrain == 4){
                var owner = tileArray[x][y].owner;
                drawKing(x, y, owner);
                drawNumber(x, y, tileArray);
            }
            //Visible mountain
            else if (terrain == 5){
                visibleMountain(x,y);
            }
        } 
    }
    /*
    If the tile is currntly clicked by the player, a black box will be drawn around the border of the tile
    */
    if (position.on){
        ctx.strokeStyle = "black";
        ctx.strokeRect(position.x * tileSize, position.y * tileSize, tileSize, tileSize);
    }
    /*
    This function will draw arrows around the map to indicate the movements that the player has ordered
    */
    drawArrow(arrowArray);
}

function drawNumber(x, y, tileArray){
    var troop = tileArray[x][y].troop;
    //This loop runs if troops are present on the tile
    if (troop != 0) {
        //Some parameters for the font
        ctx.fillStyle = "white";
        ctx.font = "11px Arial";
        //This loop runs if the number of troops is 1 digit
        if (troop < 10){
            ctx.fillText(troop, (x * tileSize + tileSize / 2 - 3), y * tileSize + tileSize / 2 + 4);
        }
        //This loop runs if the number of troops is 2 digit
        else if (troop < 100){
            ctx.fillText(troop, (x * tileSize + tileSize / 2 - 6), y * tileSize + tileSize / 2 + 4);
        }
        //This loop runs if the number of troops is 3 digit
        else if (troop < 1000){
            ctx.fillText(troop, (x * tileSize + tileSize / 2 - 9), y * tileSize + tileSize / 2 + 4);
        }
    }
}

function drawMountain(x, y){

    ctx.fillStyle = "gray";
    ctx.fillRect(x* tileSize, y* tileSize, tileSizeActual, tileSizeActual);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(x * tileSize + 0.25 * tileSize, y * tileSize + 0.75 * tileSize);
    ctx.lineTo(x * tileSize + 0.50 * tileSize, y * tileSize + 0.25 * tileSize);
    ctx.lineTo(x * tileSize + 0.75 * tileSize, y * tileSize + 0.75 * tileSize);
    ctx.stroke();
}

function visibleMountain(x, y){
    ctx.fillStyle = playerColor.ownerless;
    ctx.fillRect(x* tileSize, y* tileSize, tileSizeActual, tileSizeActual);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(x * tileSize + 0.25 * tileSize, y * tileSize + 0.75 * tileSize);
    ctx.lineTo(x * tileSize + 0.50 * tileSize, y * tileSize + 0.25 * tileSize);
    ctx.lineTo(x * tileSize + 0.75 * tileSize, y * tileSize + 0.75 * tileSize);
    ctx.stroke();
}

function drawTile(x, y, owner){
    for (var i = -1; i < totalPlayer; i++){
        if (i == -1){
            ctx.fillStyle = playerColor.ownerless;
        }
        else if (i == owner){
            ctx.fillStyle = playerColor.player[i];
        }
    }
    ctx.fillRect(x * tileSize , y * tileSize, tileSizeActual, tileSizeActual);
}

function drawKing(x, y, owner){
    for (var i = -1; i < totalPlayer; i++){
        if (i == -1){
            ctx.fillStyle = playerColor.ownerless;
        }
        else if (i == owner){
            ctx.fillStyle = playerColor.player[i];
        }
    }
    ctx.fillRect(x * tileSize , y * tileSize, tileSizeActual, tileSizeActual);

    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(x * tileSize + 0.30 * tileSize, y * tileSize + 0.80 * tileSize);
    ctx.lineTo(x * tileSize + 0.20 * tileSize, y * tileSize + 0.40 * tileSize);
    ctx.lineTo(x * tileSize + 0.40 * tileSize, y * tileSize + 0.50 * tileSize);
    ctx.lineTo(x * tileSize + 0.50 * tileSize, y * tileSize + 0.20 * tileSize);
    ctx.lineTo(x * tileSize + 0.60 * tileSize, y * tileSize + 0.50 * tileSize);
    ctx.lineTo(x * tileSize + 0.80 * tileSize, y * tileSize + 0.40 * tileSize);
    ctx.lineTo(x * tileSize + 0.70 * tileSize, y * tileSize + 0.80 * tileSize);
    ctx.lineTo(x * tileSize + 0.30 * tileSize, y * tileSize + 0.80 * tileSize);
    ctx.stroke();
}

function drawArrow(arrowArray){
    //For arrows
    ctx.fillStyle = "black";
    for (var i = 0; i < arrowArray.length; i++){
        if (arrowArray[i].x2 == 1){
            ctx.beginPath();
            ctx.moveTo(arrowArray[i].x1 * tileSize + tileSize, arrowArray[i].y1 * tileSize + tileSize / 2);
            ctx.lineTo(arrowArray[i].x1 * tileSize + tileSize + tileSize / 8 * 3, arrowArray[i].y1 * tileSize + tileSize /2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(arrowArray[i].x1 * tileSize + tileSize + tileSize / 8 * 3, arrowArray[i].y1 * tileSize + tileSize / 2);
            ctx.lineTo(arrowArray[i].x1 * tileSize + tileSize + tileSize / 4, arrowArray[i].y1 * tileSize + tileSize / 8 * 5);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(arrowArray[i].x1 * tileSize + tileSize + tileSize / 8 * 3, arrowArray[i].y1 * tileSize + tileSize /2);
            ctx.lineTo(arrowArray[i].x1 * tileSize + tileSize + tileSize /4, arrowArray[i].y1 * tileSize + tileSize /8 * 3);
            ctx.stroke();
        }
        else if (arrowArray[i].x2 == -1){
            ctx.beginPath();
            ctx.moveTo(arrowArray[i].x1 * tileSize, arrowArray[i].y1 * tileSize + tileSize / 2);
            ctx.lineTo(arrowArray[i].x1 * tileSize - tileSize / 8 * 3, arrowArray[i].y1 * tileSize + tileSize /2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(arrowArray[i].x1 * tileSize - tileSize / 8 * 3, arrowArray[i].y1 * tileSize + tileSize / 2);
            ctx.lineTo(arrowArray[i].x1 * tileSize - tileSize / 4, arrowArray[i].y1 * tileSize + tileSize / 8 * 5);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(arrowArray[i].x1 * tileSize - tileSize / 8 * 3, arrowArray[i].y1 * tileSize + tileSize /2);
            ctx.lineTo(arrowArray[i].x1 * tileSize - tileSize /4, arrowArray[i].y1 * tileSize + tileSize /8 * 3);
            ctx.stroke();
        }
        else if (arrowArray[i].y2 == 1){
            ctx.beginPath();
            ctx.moveTo(arrowArray[i].x1 * tileSize + tileSize / 2, arrowArray[i].y1 * tileSize + tileSize);
            ctx.lineTo(arrowArray[i].x1 * tileSize + tileSize / 2, arrowArray[i].y1 * tileSize + tileSize + tileSize / 8 * 3);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(arrowArray[i].x1 * tileSize + tileSize / 2, arrowArray[i].y1 * tileSize + tileSize + tileSize / 8 * 3);
            ctx.lineTo(arrowArray[i].x1 * tileSize + tileSize / 8 * 3, arrowArray[i].y1 * tileSize + tileSize + tileSize / 4);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(arrowArray[i].x1 * tileSize + tileSize / 2, arrowArray[i].y1 * tileSize + tileSize + tileSize / 8 * 3);
            ctx.lineTo(arrowArray[i].x1 * tileSize + tileSize / 8 * 5, arrowArray[i].y1 * tileSize + tileSize + tileSize / 4);
            ctx.stroke();
        }

        else if (arrowArray[i].y2 == -1){
            ctx.beginPath();
            ctx.moveTo(arrowArray[i].x1 * tileSize + tileSize / 2, arrowArray[i].y1 * tileSize);
            ctx.lineTo(arrowArray[i].x1 * tileSize + tileSize / 2, arrowArray[i].y1 * tileSize - tileSize / 8 * 3);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(arrowArray[i].x1 * tileSize + tileSize / 2, arrowArray[i].y1 * tileSize - tileSize / 8 * 3);
            ctx.lineTo(arrowArray[i].x1 * tileSize + tileSize / 8 * 3, arrowArray[i].y1 * tileSize - tileSize / 4);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(arrowArray[i].x1 * tileSize + tileSize / 2, arrowArray[i].y1 * tileSize - tileSize / 8 * 3);
            ctx.lineTo(arrowArray[i].x1 * tileSize + tileSize / 8 * 5, arrowArray[i].y1 * tileSize - tileSize / 4);
            ctx.stroke();
        }
    }
}