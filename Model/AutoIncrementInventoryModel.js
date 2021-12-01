const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const ObjectId = mongoose.Types.ObjectId;

const documentName = `ai_product_inventory`;
const AutoIncrementInventorySchema = new mongoose.Schema({
    _storeid: { type: ObjectId, required: true },
    _branchid: { type: ObjectId, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    seq: { type: Number, default: 0 }
}, { collection: documentName });

AutoIncrementInventorySchema.plugin(AutoIncrement, { id: 'incremen_inventory_runner', reference_fields: ['_storeid', '_branchid', 'year', 'month'], inc_field: 'seq', collection_name: documentName+'_runner', inc_amount: 1 });

const AutoIncrementInventoryModel = mongooseConn.model(documentName, AutoIncrementInventorySchema);

module.exports = AutoIncrementInventoryModel;