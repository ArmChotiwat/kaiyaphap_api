const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const ObjectId = mongoose.Types.ObjectId;

const AutoIncrementCasePatientBranchSchema = new mongoose.Schema({
    _storeid: { type: ObjectId, required: true },
    _branchid: { type: ObjectId, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    seq: { type: Number, default: 0 }
}, { collection: 'ai_case_patient_branch' });

AutoIncrementCasePatientBranchSchema.plugin(AutoIncrement, { id: 'casepatient_branch_runner', reference_fields: ['_storeid', '_branchid', 'year', 'month'], inc_field: 'seq', collection_name: 'ai_case_patient_branch_runner', inc_amount: 1 });

const AutoIncrementCasePatientBranchModel = mongooseConn.model('ai_case_patient_branch', AutoIncrementCasePatientBranchSchema);

module.exports = AutoIncrementCasePatientBranchModel;