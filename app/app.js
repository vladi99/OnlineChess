const express = require('express');
const path = require('path');
const helpers = require('./helpers');

const init = (data) => {
    const app = express();
    const controllers = require('./controllers')(data, helpers);
    const sockets = require('./sockets');

    app.use('/libs', express.static(path.join(__dirname, '../node_modules/')));
    app.use(express.static(path.join(__dirname, '../public/')));

    require('./config/app.config').attachTo(app);
    require('./routers').attachTo(app, controllers);

    const server = require('./config/socket.config')(app, data, sockets);

    return Promise.resolve(server);
};

module.exports = { init };
