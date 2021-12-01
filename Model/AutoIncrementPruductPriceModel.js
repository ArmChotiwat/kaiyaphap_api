const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const ObjectId = mongoose.Types.ObjectId;

const documentName = `ai_product_inventory_price`;
const AutoIncrementPruductPriceSchema = new mongoose.Schema({
    _productid: { type: ObjectId, required: true },
    _storeid: { type: ObjectId, required: true },
    _branchid: { type: ObjectId, required: true },
    year: { type: Number, default: 2020 },
    month: { type: Number, default: 8 },
    seq: { type: Number, default: 0 }
}, { collection: documentName });

AutoIncrementPruductPriceSchema.plugin(AutoIncrement,
    {
        id: documentName+'_runner',
        reference_fields: [' _productid','_storeid', '_branchid', 'year', 'month'],
        inc_field: 'seq', 
        collection_name: documentName+'_runner',
        inc_amount: 1
    }
);
const AutoIncrementPruductPriceModel = mongooseConn.model(documentName, AutoIncrementPruductPriceSchema);
module.exports = AutoIncrementPruductPriceModel;