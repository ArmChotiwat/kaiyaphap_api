const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
// const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ObjectId = mongoose.Types.ObjectId;

const documentName = 'ai_purchaseorder';
const AutoIncrementPurchaseOrderSchema = new mongoose.Schema({
    _ref_storeid: { type: ObjectId, required: true },
    _ref_branchid: { type: ObjectId, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    seq: { type: Number, default: 0 }
}, { collection: documentName });

AutoIncrementPurchaseOrderSchema.plugin(
    AutoIncrement, 
    { 
        id: 'purchaseorder_runner', 
        reference_fields: ['_ref_storeid','_ref_branchid', 'year', 'month'], 
        inc_field: 'seq', 
        collection_name: 'ai_purchaseorder_runner', 
        inc_amount: 1 
    }
);

// AutoIncrementPurchaseOrderSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const AutoIncrementPurchaseOrderModel = mongooseConn.model(documentName, AutoIncrementPurchaseOrderSchema);

module.exports = AutoIncrementPurchaseOrderModel;