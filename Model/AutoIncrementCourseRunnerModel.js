const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');

const documentName = 'ai_course_group_runner';
const AutoIncrementRunnerCourseGroupSchema = new mongoose.Schema({
    id: { type: String, required: true },
    reference_value: {type: mongoose.Schema.Types.Mixed, required: true},
    seq: { type: Number, default: 0 }
}, { collection: documentName });

const AutoIncrementRunnerCourseGroupModel = mongooseConn.model(documentName, AutoIncrementRunnerCourseGroupSchema);

module.exports = AutoIncrementRunnerCourseGroupModel;