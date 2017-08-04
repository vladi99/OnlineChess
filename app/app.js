const express = require('express');
const path = require('path');

const init = (data) => {
    const app = express();
    const controllers = require('./controllers')(data);

    app.use('/libs', express.static(path.join(__dirname, '../node_modules/')));
    app.use(express.static(path.join(__dirname, '../public/')));

    require('./config').attachTo(app);
    require('./routers').attachTo(app, controllers);

    return Promise.resolve(app);
};

module.exports = { init };
