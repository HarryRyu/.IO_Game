function parameterHandler(io, socket, gameParameters){

    mapSize = gameParameters.mapSize;
    mountain = gameParameters.mountain;
    city = gameParameters.city;
    gameSpeed = gameParameters.gameSpeed;

    socket.on('mapParam', input => {
        gameParameters.mapSize = input;
        io.to('room').emit('mapParamRes', gameParameters.mapSize);
        if(Math.ceil(gameParameters.mapSize * gameParameters.mapSize / 10) < gameParameters.city){
            gameParameters.city = Math.ceil(gameParameters.mapSize * gameParameters.mapSize / 10);
            io.to('room').emit('cityParamRes', gameParameters.city);
        }
    })
    socket.on('mountainParam', input => {
        gameParameters.mountain = input;
        io.to('room').emit('mountainParamRes', gameParameters.mountain);
    })
    socket.on('cityParam', input => {
        if (input < gameParameters.mapSize * gameParameters.mapSize / 10) {
            gameParameters.city = input;
        }
        else {
            gameParameters.city = Math.ceil(gameParameters.mapSize * gameParameters.mapSize / 10);
        }
        io.to('room').emit('cityParamRes', gameParameters.city);
    })
    socket.on('gameSpeedParam', input => {
        gameParameters.gameSpeed = input;
        io.to('room').emit('gameSpeedParamRes', gameParameters.gameSpeed);
    })
}

module.exports = parameterHandler;