const { ObjectId } = require('mongodb');

class BaseData {
    constructor(db, ModelClass, validator) {
        this.db = db;
        this.ModelClass = ModelClass;
        this.validator = validator;
        this.collectionName = this._getCollectionName();
        this.collection = this.db.collection(this.collectionName);
    }

    getAll() {
        return this.collection
            .find()
            .toArray();
    }

    create(model) {
        if (!this._isModelValid(model)) {
            return Promise.reject('Invalid model');
        }
        return this.collection.insert(model)
            .then(() => {
                return this.ModelClass.toViewModel(model);
            });
    }

    getById(id) {
        return this.collection.findOne({ _id: ObjectId(id) });
    }

    _isModelValid(model) {
        return this.validator.isValid(model);
    }

    _getCollectionName() {
        return this.ModelClass.name.toLowerCase() + 's';
    }
}

module.exports = BaseData;
