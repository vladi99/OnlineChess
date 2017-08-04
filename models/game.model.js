const BaseModel = require('./base/base.model');

class Game extends BaseModel {
    static isValid(model) {
        // TODO: validations
        return model !== undefined;
    }
}

module.exports = Game;