const attachTo = (app, {gameController}) => {
    app.get('/game/:id', gameController.getPlayPage);
    app.post('/start', gameController.startGame);
    app.post('/join', gameController.joinGame);
};

module.exports = {attachTo};