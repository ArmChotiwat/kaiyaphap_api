const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const AutoIncrementRunnerPatientBranchSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: {type: mongoose.Schema.Types.Mixed, required: true},
    seq: { type: Number, default: 0 }
}, { collection: 'ai_case_patient_branch_runner' });

const AutoIncrementRunnerPatientBranchModel = mongooseConn.model('ai_case_patient_branch_runner', AutoIncrementRunnerPatientBranchSchema);

module.exports = AutoIncrementRunnerPatientBranchModel;