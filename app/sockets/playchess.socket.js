const attachSocket = (io, socket, data ) => {
    socket.on('join', (gameID) => {
        return data.games.getById(gameID)
            .then((game) => {
                if (!game) {
                    console.log('ERROR: Game Not Found');
                    return socket.emit('error', {message: "Game not found"});
                }
                return Promise.resolve(game)
            }).then((game) => {
                socket.join(gameID);
                return io.sockets.in(gameID).emit('update', game);
            }).catch(() => {
                console.log('ERROR: Failed to Add Player');
                return socket.emit('error', {message: "Unable to join game"});
            });
    });

    socket.on('move', (socketData) => {
        return data.games.getById(socketData.gameID)
            .then((game) => {
                if (!game) {
                    console.log('ERROR: Game Not Found');
                    return socket.emit('error', {message: "Game not found"});
                }
                return Promise.resolve(game)
            }).then((game) => {
                return io.sockets.in(socketData.gameID).emit('update', game);
            }).catch(() => {
                console.log('ERROR: Failed to Apply Move');
                return socket.emit('error', {message: "Invalid move, please try again"});
            });
    });
};

module.exports = attachSocket;