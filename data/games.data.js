const { ObjectId } = require('mongodb');

const BaseData = require('./base/base.data');
const Game = require('../models/game.model');

class GamesData extends BaseData {
    constructor(db) {
        super(db, Game, Game);
    }

    addPlayer(gameId){
        return this.collection.update(
            {_id: ObjectId(gameId) },
            {$set : {player2: 'player 2'}},
            {upsert: false}
        )
    }
}

module.exports = GamesData;