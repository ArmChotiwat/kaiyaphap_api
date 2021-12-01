const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const documentName = 'ai_template_course_group';
const AutoIncrementTemplateCourseGroupSchema = new mongoose.Schema({
    year: { type: Number, default: 2020 },
    month: { type: Number, default: 1 },
    seq: { type: Number, default: 0 }
}, { collection: documentName });

AutoIncrementTemplateCourseGroupSchema.plugin(
    AutoIncrement, 
    { 
        id: 'template_course_group_runner', 
        reference_fields: ['year', 'month'], 
        inc_field: 'seq', 
        collection_name: 'ai_template_course_group_runner', 
        inc_amount: 1 
    }
);

const AutoIncrementTemplateCourseGroupModel = mongooseConn.model(documentName, AutoIncrementTemplateCourseGroupSchema);

module.exports = AutoIncrementTemplateCourseGroupModel;