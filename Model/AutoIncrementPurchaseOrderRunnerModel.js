const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const documentName = 'ai_purchaseorder_runner';
const AutoIncrementPurchaseOrderRunnerSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: { type: mongoose.Schema.Types.Mixed, required: true },
    seq: { type: Number, default: 0 }
}, { collection: documentName });

const AutoIncrementPurchaseOrderRunnerModel = mongooseConn.model(documentName, AutoIncrementPurchaseOrderRunnerSchema);

module.exports = AutoIncrementPurchaseOrderRunnerModel;