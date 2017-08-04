const attachSocket = (io, socket, data ) => {
    socket.on('join', (gameID) => {
        const sess = this.handshake.session;
        const debugInfo = {
            socketID : this.id,
            event: 'join',
            gameID: gameID,
            session: sess
        };

        if (gameID !== sess.gameID) {
            console.log('ERROR: Access Denied', debugInfo);
            this.emit('error', {message: "You cannot join this game"});
            return;
        }

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
                console.log(sess.playerName+' joined '+gameID);
            }).catch((err) => {
                console.log('ERROR: Failed to Add Player', debugInfo);
                this.emit('error', {message: "Unable to join game"});
            });
    });

    socket.on('move', (game) => {
        const sess = this.handshake.session;
        const debugInfo = {
            socketID : this.id,
            event: 'move',
            gameID: game.gameID,
            move: game.move,
            session  : sess
        };

        // Check if user has permission to access this game
        if (game.gameID !== sess.gameID) {
            console.log('ERROR: Access Denied', debugInfo);
            this.emit('error', {message: "You have not joined this game"});
            return;
        }

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
                console.log(game.gameID+' '+ sess.playerName+': '+game.move);
            }).catch((err) => {
                console.log('ERROR: Failed to Apply Move', debugInfo);
                this.emit('error', {message: "Invalid move, please try again"});
            });
    });

    socket.on('disconnect', () => {
        const sess = this.handshake.session;
        const debugInfo = {
            socketID : this.id,
            event    : 'disconnect',
            session  : sess
        };

        // Lookup game in database
        return data.games.getById(sess.gameID)
            .then((game) => {
                if (!game) {
                    console.log('ERROR: Game Not Found', debugInfo);
                    return;
                }
                return game.removePlayer(sess);
            }).then(() => {
                console.log(sess.playerName+' left '+sess.gameID);
                console.log('Socket '+this.id+' disconnected');
            }).catch((err) => {
                console.log('ERROR: '+sess.playerName+' failed to leave '+sess.gameID);
            });
    });
};

module.exports = attachSocket;