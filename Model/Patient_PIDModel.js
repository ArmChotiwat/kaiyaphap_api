const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId =  Schema.Types.ObjectId
const collectionName ='m_patients_pid'

const patientPIDSchema = new Schema({
    _ref_storeid: { type: ObjectId, required: true },
    _ref_patient_userid: { type: ObjectId, default: null },
    _ref_patient_userstoreid: { type: ObjectId, default: null },
    identity_card: { type: String, required: true }

}, { collection: collectionName });

patientPIDSchema.index({ '_ref_storeid': 1, 'identity_card': 1 }, { unique: true });
const PatientPIDModel = mongooseConn.model(collectionName, patientPIDSchema);

module.exports = PatientPIDModel;