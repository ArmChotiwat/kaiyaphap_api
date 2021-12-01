const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const AutoIncrementInventoryImportRunnerSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: {type: mongoose.Schema.Types.Mixed, required: true},
    seq: { type: Number, default: 0 }
}, { collection: 'ai_product_inventory_import_runner' });

const AutoIncrementInventoryImportRunnerhModel = mongooseConn.model('ai_product_inventory_import_runner', AutoIncrementInventoryImportRunnerSchema);

module.exports = AutoIncrementInventoryImportRunnerhModel;