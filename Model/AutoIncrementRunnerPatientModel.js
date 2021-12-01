const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const AutoIncrementRunnerPatientSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: {type: mongoose.Schema.Types.Mixed, required: true},
    seq: { type: Number, default: 0 }
});

const AutoIncrementRunnerPatientModel = mongooseConn.model('ai_patient_runners', AutoIncrementRunnerPatientSchema);

module.exports = AutoIncrementRunnerPatientModel;