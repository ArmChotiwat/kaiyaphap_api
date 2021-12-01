const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
// const m_casetype = require('./TempCaseTypeModel');

const casePatientSchema = new Schema({

    _ref_scheduleid: { type: ObjectId, required: true, ref: 'l_schedule' }, // ObjectId คิว => ref: 'l_schedule.data._id'

    _ref_storeid: { type: ObjectId, required: true },
    _ref_branchid: { type: ObjectId, required: true },

    _ref_patient_userid: { type: ObjectId, required: true },
    _ref_patient_userstoreid: { type: ObjectId, required: true },

    _ref_agent_userid: { type: ObjectId, required: true },
    _ref_agent_userstoreid: { type: ObjectId, required: true },

    create_date: { type: Date, required: true },
    create_date_string: { type: String, required: true },
    create_time_string: { type: String, required: true },

    modify_date: { type: Date, required: true },
    modify_date_string: { type: String, required: true },
    modify_time_string: { type: String, required: true },

    run_number_store:  { type: Number, required: true },
    case_number_store: { type: String, required: true },

    run_number_branch: { type: Number, required: true }, // Auto Incresement
    case_number_branch: { type: String, required: true },

    _ref_casemaintypeid: { type: ObjectId, required: true, ref: 'm_casetype' },
    _ref_reftcasemaintypeid: { type: ObjectId, required: true, ref: 't_casetype' },
    _casemaintypename: { type: String, required: true },

    _ref_casesubtypeid: { type: ObjectId, required: true, ref: 'm_casetype.type_sub' },
    _ref_reftcasesubtypeid: { type: ObjectId, required: true },
    _casesubtypename: { type: String, required: true },

    isclosed: { type: Boolean, required: true },
    istruncated: { type: Boolean, required: true },

}, { collection: 'l_casepatient' });

casePatientSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1 }, { unique: false });

casePatientSchema.index({ '_ref_storeid': 1, 'case_number_store': 1 }, { unique: true });

casePatientSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, 'case_number_branch': 1 }, { unique: true });

casePatientSchema.index({ '_ref_scheduleid': 1 }, { unique: true });

const casePatientModel = mongooseConn.model("l_casepatient", casePatientSchema);

module.exports = casePatientModel;