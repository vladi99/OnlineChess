const bodyParser = require('body-parser');

const attachTo = (app) => {
    app.set('view engine', 'pug');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
};

module.exports = { attachTo };