function usernameHandler(io,socket, usernameList, gameParameters){
        /*
        This is the first interation between the server and the client. The client will submit a username to the server which the
        server will check if its an existing username or not
        */
    socket.on('sendUsername', (username, callback) => {
        var usernameExist = false;


        /*
        This will run if the username already exists inside the server. The server will send a variable usernameExist
        that is set to true to indicate that the username already exists
        */
        for (var i = 0; i < usernameList.length; i++){
            if (usernameList[i].username == username){
                usernameExist = true;
                socket.emit('usernameReceived', usernameExist);
            }
        }
        /*
        If the username doesn't exist, the server will add a new entry to an array called usernameList which keeps track of all the
        usernames in the server. 

            Username: actual username 
            socket.id: unique id of the client 
            ready: whether the client is ready to start the game or not
            inGame: whether the client is in a game or not

        */
        if (!usernameExist){
            socket.join('room')
            usernameList.push({ 'username' : username, 'id' : socket.id, 'ready': false, 'inGame' : false, 'disconnected' : false});
            io.to('room').emit('usernameReceived', usernameExist, usernameList, gameParameters)
        }
    })
}
module.exports = usernameHandler;