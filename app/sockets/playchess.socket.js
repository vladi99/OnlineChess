const attachSocket = (io, socket, data ) => {
    socket.on('join', (gameID) => {
        const debugInfo = {
            socketID : this.id,
            event: 'join',
            gameID: gameID
        };

        return data.games.getById(gameID)
            .then((game) => {
                if (!game) {
                    console.log('ERROR: Game Not Found', debugInfo);
                    this.emit('error', {message: "Game not found"});
                    return;
                }
                return data.games.addPlayer(game._id);
            }).then(() => {
                this.join(gameID);
                io.sockets.in(gameID).emit('update', game);
            }).catch((err) => {
                console.log('ERROR: Failed to Add Player', debugInfo);
                this.emit('error', {message: "Unable to join game"});
            });
    });

    socket.on('move', (game) => {
        const debugInfo = {
            socketID : this.id,
            event: 'move',
            gameID: game.gameID,
            move: game.move,
        };

        // Lookup game in database
        return data.games.getById(game.gameID)
            .then((dbGame) => {
                if (!dbGame) {
                    console.log('ERROR: Game Not Found', debugInfo);
                    this.emit('error', {message: "Game not found"});
                    return
                }
                return dbGame.move(game.move);
            }).then((dbGame) => {
                io.sockets.in(game.gameID).emit('update', dbGame);
            }).catch((err) => {
                console.log('ERROR: Failed to Apply Move', debugInfo);
                this.emit('error', {message: "Invalid move, please try again"});
            });
    });

    socket.on('disconnect', (gameID) => {
        const debugInfo = {
            socketID : this.id,
            event    : 'disconnect'
        };

        // Lookup game in database
        return data.games.getById(gameID)
            .then((game) => {
                if (!game) {
                    console.log('ERROR: Game Not Found', debugInfo);
                    return;
                }
                console.log('Socket '+this.id+' disconnected');
                return game.removePlayer(gameID);
            });
    });
};

module.exports = attachSocket;