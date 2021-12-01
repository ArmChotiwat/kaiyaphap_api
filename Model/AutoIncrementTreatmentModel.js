const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const ObjectId = mongoose.Types.ObjectId;

const documentName = 'ai_treatment';
const AutoIncrementTreatmentSchema = new mongoose.Schema({
    _ref_storeid: { type: ObjectId, required: true },
    seq: { type: Number, default: 0 }
}, { collection: documentName });

AutoIncrementTreatmentSchema.plugin(
    AutoIncrement, 
    { 
        id: 'treatment_runner', 
        reference_fields: ['_ref_storeid'], 
        inc_field: 'seq', 
        collection_name: 'ai_treatment_runner', 
        inc_amount: 1 
    }
);

const AutoIncrementTreatmentModel = mongooseConn.model(documentName, AutoIncrementTreatmentSchema);

module.exports = AutoIncrementTreatmentModel;