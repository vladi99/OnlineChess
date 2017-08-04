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
                    return data.games.create(validData);
                }).then((game)=> {
                    req.session.gameID = game._id.toString();
                    req.session.playerColor = game.playerColor;
                    req.session.playerName = game.playerName;

                    return res.redirect('/game/'+game._id.toString());
                });
        },
        joinGame(req, res) {
            // Create a new session
            req.session.regenerate((err) => {
                if (err) { res.redirect('/'); return; }

                // Validate form input
                const validData = helpers.validateJoinGame(req);
                if (!validData) {
                    return res.redirect('/');
                }

                // Find specified game
                const game = data.games.getById(validData.gameID);
                if (!game) {
                    return res.redirect('/');
                }

                // Determine which player (color) to join as
                const joinColor = (game.players[0].joined) ? game.players[1].color : game.players[0].color;

                // Save data to session
                req.session.gameID = validData.gameID;
                req.session.playerColor = joinColor;
                req.session.playerName = validData.playerName;

                // Redirect to game page
                res.redirect('/game/'+validData.gameID);
            });
        }
    }
};

module.exports = gameController;