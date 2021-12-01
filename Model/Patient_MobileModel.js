const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const collectionName = 'm_patients_mobile';
const Patient_MobileSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    store: [
      {
        _ref_patient_userid: { type: ObjectId, required: true },
        _ref_patient_userstoreid: { type: ObjectId, required: true },
      }
    ],
}, { collection: collectionName });

Patient_MobileSchema.index({ 'username': 1 }, { unique: true });
Patient_MobileSchema.index({ 'username': 1, 'password': 1 }, { unique: false });

const Patient_MobileModel = mongooseConn.model(collectionName, Patient_MobileSchema);

module.exports = Patient_MobileModel;