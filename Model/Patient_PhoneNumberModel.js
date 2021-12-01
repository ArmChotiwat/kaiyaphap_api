const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId =  Schema.Types.ObjectId
const collectionName ='m_patients_phone_number'

const patientPhoneNumberSchema = new Schema({
    _ref_storeid: { type: ObjectId, required: true },
    _ref_patient_userid: { type: ObjectId, default: null },
    _ref_patient_userstoreid: { type: ObjectId, default: null },
    phone_number: { type: String, required: true }

}, { collection: collectionName });

patientPhoneNumberSchema.index({ '_ref_storeid': 1, 'phone_number': 1 }, { unique: true });
const PatientPhoneNumberModel = mongooseConn.model(collectionName, patientPhoneNumberSchema);

module.exports = PatientPhoneNumberModel;