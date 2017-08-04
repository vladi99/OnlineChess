const fs = require('fs');
const path = require('path');

const attachTo = (app, controllers) => {
    fs.readdirSync(__dirname)
        .filter((file) => file.includes('.router'))
        .forEach((filename) => {
            const modulePath = path.join(__dirname, filename);
            require(modulePath).attachTo(app, controllers);
        });
};

module.exports = { attachTo };