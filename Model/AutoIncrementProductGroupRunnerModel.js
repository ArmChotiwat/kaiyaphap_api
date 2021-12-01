const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const documentName = 'ai_product_group_runner';
const AutoIncrementRunnerProductGroupSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: {type: mongoose.Schema.Types.Mixed, required: true},
    seq: { type: Number, default: 0 }
}, { collection: documentName });

const AutoIncrementRunnerProductGroupModel = mongooseConn.model(documentName, AutoIncrementRunnerProductGroupSchema);

module.exports = AutoIncrementRunnerProductGroupModel;