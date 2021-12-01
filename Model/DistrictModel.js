const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
var Schema = mongoose.Schema

var scheduleSchema = new Schema({
    id: String,
    zip_code: Number,
    name_th: String,
    name_en: String,
    amphure_id: Number
}, { collection: 'm_districts' });

var scheduleModel = mongooseConn.model("m_districts", scheduleSchema)

module.exports = scheduleModel;