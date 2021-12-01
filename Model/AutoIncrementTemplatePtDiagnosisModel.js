const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const documentName = 'ai_template_pt_diagnosis';
const AutoIncrementPtDiagnosisSchema = new mongoose.Schema({
    year: { type: Number, default: 2020 },
    month: { type: Number, default: 1 },
    seq: { type: Number, default: 0 }
}, { collection: documentName });

AutoIncrementPtDiagnosisSchema.plugin(
    AutoIncrement, 
    { 
        id: 'template_pt_diagnosis_runner', 
        reference_fields: ['year','month'], 
        inc_field: 'seq', 
        collection_name: 'ai_template_pt_diagnosis_runner', 
        inc_amount: 1 
    }
);

const AutoIncrementPtDiagnosisModel = mongooseConn.model(documentName, AutoIncrementPtDiagnosisSchema);

module.exports = AutoIncrementPtDiagnosisModel;