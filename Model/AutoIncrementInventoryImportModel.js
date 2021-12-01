const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const ObjectId = mongoose.Types.ObjectId;

const AutoIncrementInventoryImportSchema = new mongoose.Schema({
    _storeid: { type: ObjectId, required: true },
    _branchid: { type: ObjectId, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    seq: { type: Number, default: 0 }
}, { collection: 'ai_product_inventory_import' });

AutoIncrementInventoryImportSchema.plugin(AutoIncrement,
    {
        id: 'incremen_inventory_import_runner',
        reference_fields: ['_storeid', '_branchid', 'year', 'month'],
        inc_field: 'seq',
        collection_name: 'ai_product_inventory_import_runner', inc_amount: 1
    });

const AutoIncrementInventoryImportModel = mongooseConn.model('ai_product_inventory_import', AutoIncrementInventoryImportSchema);

module.exports = AutoIncrementInventoryImportModel;