const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const ObjectId = mongoose.Types.ObjectId;

const AutoIncrementPatientSchema = new mongoose.Schema({
    _storeid: { type: ObjectId, required: true },
    personal_idcard: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

AutoIncrementPatientSchema.plugin(AutoIncrement, { id: '_id' , reference_fields: ['_storeid'], inc_field: 'seq', collection_name: 'ai_patient_runners', inc_amount: 1 });

const AutoIncrementPatientModel = mongooseConn.model('ai_patient', AutoIncrementPatientSchema);

module.exports = AutoIncrementPatientModel;