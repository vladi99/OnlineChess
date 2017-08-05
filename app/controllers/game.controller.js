const gameController = (data, helpers) => {
    return {
        getPlayPage(req, res) {
            return helpers.validateGame(req)
                .then((validData) => {
                    if (!validData) {
                        return res.redirect('/');
                    }
                    return res.render('play', validData)
                });
        },
        startGame(req, res) {
            return helpers.validateStartGame(req)
                .then((validData) => {
                    if (!validData) {
                        return res.redirect('/');
                    }
                    return Promise.resolve(data.games.create(validData));
                }).then((game)=> {
                    req.session.gameID = game._id.toString();
                    req.session.playerColor = game.playerColor;
                    req.session.playerName = game.playerName;

                    return res.redirect('/game/'+game._id.toString());
                });
        },
        joinGame(req, res) {
            // Validate form input
            return helpers.validateJoinGame(req)
                .then((validData) => {
                    if (!validData) {
                        return res.redirect('/');
                    }
                    return Promise.all([data.games.getById(validData.gameID), validData]);
                }).then(([game, validData]) => {
                    if (!game) {
                        return res.redirect('/');
                    }
                    const joinColor = (game.playerColor) ? 'white' : 'black';

                    req.session.gameID = validData.gameID;
                    req.session.playerColor = joinColor;
                    req.session.playerName = validData.playerName;

                    return res.redirect('/game/'+validData.gameID);
                });
        }
    }
};

module.exports = gameController;