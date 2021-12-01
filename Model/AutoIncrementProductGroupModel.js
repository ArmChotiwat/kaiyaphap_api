const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const ObjectId = mongoose.Types.ObjectId;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const documentName = 'ai_product_group';
const AutoIncrementProductGroupSchema = new mongoose.Schema({
    _ref_storeid: { type: ObjectId, required: true },
    year: { type: Number, default: 2020 },
    month: { type: Number, default: 1 },
    seq: { type: Number, default: 0 }
}, { collection: documentName });

AutoIncrementProductGroupSchema.plugin(
    AutoIncrement, 
    { 
        id: 'product_group_runner', 
        reference_fields: ['_ref_storeid', 'year', 'month'], 
        inc_field: 'seq', 
        collection_name: 'ai_product_group_runner', 
        inc_amount: 1 
    }
);

const AutoIncrementProductGroupModel = mongooseConn.model(documentName, AutoIncrementProductGroupSchema);

module.exports = AutoIncrementProductGroupModel;