//Settings for zooming and dragging
var zoomSetting = {'scale' : 1, 'currentzoom' : 1, 'originx' : 0, 'originy' : 0, 'mousex' : 0, 'mousey' : 0};
var currentPosition = {'on' : false, 'x' : null, 'y' : null};
const tileSize = 30;
const tileSizeActual = 31;
const tileBorder = 0.5;
const color =  { 'empty' : 'gray', 'mountain': 'black', 'click' : 'white'}
const playerColor = {'ownerless': "rgb(211,211,211)", 'player' : ['red', 'orange', 'yellow', 'green', 'blue' , 'purple']};
const totalPlayer = 6;


export function returnParameter(request){
    if (request == "zoom"){
        return zoomSetting;
    }
    else if (request == "position"){
        return currentPosition;
    }
    else if (request == "tileSize"){
        return tileSize;
    }
    else if (request == "tileBorder"){
        return tileBorder;
    }
    else if (request == "color"){
        return color;
    }
    else if (request == "playerColor"){
        return playerColor;
    }
    else if (request == "totalPlayer"){
        return totalPlayer;
    }
    else if (request == "tileSizeActual"){
        return tileSizeActual;
    }
}