const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const documentName = 'ai_course_group';
const AutoIncrementCourseGroupSchema = new mongoose.Schema({
    year: { type: Number, default: 2020 },
    month: { type: Number, default: 1 },
    seq: { type: Number, default: 0 }
}, { collection: documentName });

AutoIncrementCourseGroupSchema.plugin(
    AutoIncrement, 
    { 
        id: 'course_runner', 
        reference_fields: ['dataname'], 
        inc_field: 'seq', 
        collection_name: 'ai_course_runner', 
        inc_amount: 1 
    }
);

const AutoIncrementCourseGroupModel = mongooseConn.model(documentName, AutoIncrementCourseGroupSchema);

module.exports = AutoIncrementCourseGroupModel;