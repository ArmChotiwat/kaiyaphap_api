const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const AutoIncrementInventoryRunnerSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: {type: mongoose.Schema.Types.Mixed, required: true},
    seq: { type: Number, default: 0 }
}, { collection: 'ai_inventory_runner' });

const AutoIncrementInventoryRunnerhModel = mongooseConn.model('ai_inventory_runner', AutoIncrementInventoryRunnerSchema);

module.exports = AutoIncrementInventoryRunnerhModel;