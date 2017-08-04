const GamesData = require('./games.data');

const init = (db) => {
    return Promise.resolve({
        games: new GamesData(db)
    });
};

module.exports = { init };