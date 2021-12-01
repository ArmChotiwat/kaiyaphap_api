const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const documentName = `ai_product_inventory_price_runner`;
const AutoIncrementPruductPriceRunnerSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: {type: mongoose.Schema.Types.Mixed, required: true},
    seq: { type: Number, default: 0 }
}, { collection: documentName });

const AutoIncrementPruductPriceRunnerhModel = mongooseConn.model(documentName, AutoIncrementPruductPriceRunnerSchema);

module.exports = AutoIncrementPruductPriceRunnerhModel;