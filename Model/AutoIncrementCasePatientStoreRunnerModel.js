const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const AutoIncrementRunnerPatientStoreSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: {type: mongoose.Schema.Types.Mixed, required: true},
    seq: { type: Number, default: 0 }
}, { collection: 'ai_case_patient_store_runner' });

const AutoIncrementRunnerPatientModel = mongooseConn.model('ai_case_patient_store_runner', AutoIncrementRunnerPatientStoreSchema);

module.exports = AutoIncrementRunnerPatientModel;