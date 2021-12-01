const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const documentName = 'ai_template_pt_diagnosis_runner';
const AutoIncrementRunnePtDiagnosisSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: {type: mongoose.Schema.Types.Mixed, required: true},
    seq: { type: Number, default: 0 }
}, { collection: documentName });

const AutoIncrementRunnePtDiagnosisModel = mongooseConn.model(documentName, AutoIncrementRunnePtDiagnosisSchema);

module.exports = AutoIncrementRunnePtDiagnosisModel;