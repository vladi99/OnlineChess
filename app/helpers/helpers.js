const validateGame = (req) => {
    // These must exist
    if (!req.session.gameID) {
        return Promise.reject(null);
    }
    if (!req.session.playerColor) {
        return Promise.reject(null);
    }
    if (!req.session.playerName) {
        return Promise.reject(null);
    }
    if (!req.params.id) {
        return Promise.reject(null);
    }
    // These must match
    if (req.session.gameID !== req.params.id) {
        return Promise.reject(null);
    }
    return Promise.resolve({
        gameID: req.session.gameID,
        playerColor: req.session.playerColor,
        playerName: req.session.playerName
    });
};

const validateStartGame = (req) => {
    // These must exist
    if (!req.body['player-color']) {
        return Promise.reject(null);
    }

    // Player Color must be 'white' or 'black'
    if (req.body['player-color'] !== 'white' && req.body['player-color'] !== 'black') {
        return Promise.reject(null);
    }

    // If Player Name consists only of whitespace, set as 'Player 1'
    if (/^\s*$/.test(req.body['player-name'])) {
        req.body['player-name'] = 'Player 1';
    }
    return Promise.resolve({
        playerColor: req.body['player-color'],
        playerName: req.body['player-name']
    });
};

const validateJoinGame = (req) => {
    // These must exist
    if (!req.body['game-id']) {
        return Promise.reject(null);
    }

    // If Game ID consists of only whitespace, return null
    if (/^\s*$/.test(req.body['game-id'])) {
        return Promise.reject(null);
    }

    // If Player Name consists only of whitespace, set as 'Player 2'
    if (/^\s*$/.test(req.body['player-name'])) {
        return Promise.resolve(req.body['player-name'] = 'Player 2');
    }

    return Promise.resolve({
        gameID: req.body['game-id'],
        playerName: req.body['player-name']
    });
};

module.exports = {
    validateGame,
    validateStartGame,
    validateJoinGame
};