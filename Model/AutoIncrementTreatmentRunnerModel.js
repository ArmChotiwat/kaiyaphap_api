const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const documentName = 'ai_treatment_runner';
const AutoIncrementRunnerTreatmentSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: {type: mongoose.Schema.Types.Mixed, required: true},
    seq: { type: Number, default: 0 }
}, { collection: documentName });

const AutoIncrementRunnerTreatmentModel = mongooseConn.model(documentName, AutoIncrementRunnerTreatmentSchema);

module.exports = AutoIncrementRunnerTreatmentModel;