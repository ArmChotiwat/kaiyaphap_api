const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const AutoIncrementRunnerProductStoreSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: {type: mongoose.Schema.Types.Mixed, required: true},
    seq: { type: Number, default: 0 }
}, { collection: 'ai_product_store_runner' });

const AutoIncrementRunnerProductStoreModel = mongooseConn.model('ai_product_store_runner', AutoIncrementRunnerProductStoreSchema);

module.exports = AutoIncrementRunnerProductStoreModel;