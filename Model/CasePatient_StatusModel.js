/**
 *  Status ของ Case Patient
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const documentName = 'st_casepatient';
const casePatient_StatusSchema = new Schema({
    _ref_storeid: { type: ObjectId, required: true },
    _ref_branchid: { type: ObjectId, required: true },
    _ref_casepatientid: { type: ObjectId, required: true },
    _ref_treatmentid: { type: ObjectId, default: null },
    _ref_treatment_progressionnoteid: { type: ObjectId,  default: null },
    _ref_poid: { type: ObjectId,  default: null },
    isnextvisited: { type: Boolean, required: true },
    isclosed: { type: Boolean, default: false },
    istruncated: { type: Boolean, default: false },
}, { collection: documentName });


casePatient_StatusSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

casePatient_StatusSchema.index({ '_storeid': 1, '_branchid': 1, '_ref_casepatientid': 1 }, { });

casePatient_StatusSchema.index({ '_ref_casepatientid': 1 }, { });
casePatient_StatusSchema.index({ '_ref_treatmentid': 1 }, { });
casePatient_StatusSchema.index({ '_ref_treatment_progressionnoteid': 1 }, { });
casePatient_StatusSchema.index({ '_ref_poid': 1 }, { });


const casePatient_StatusModel = mongooseConn.model(documentName, casePatient_StatusSchema);

module.exports = casePatient_StatusModel;