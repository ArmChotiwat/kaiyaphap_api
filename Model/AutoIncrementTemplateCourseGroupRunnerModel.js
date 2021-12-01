const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const documentName = 'ai_template_course_group_runner';
const AutoIncrementRunneTemplateCourseGroupSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: {type: mongoose.Schema.Types.Mixed, required: true},
    seq: { type: Number, default: 0 }
}, { collection: documentName });

const AutoIncrementRunneTemplateCourseGroupModel = mongooseConn.model(documentName, AutoIncrementRunneTemplateCourseGroupSchema);

module.exports = AutoIncrementRunneTemplateCourseGroupModel;