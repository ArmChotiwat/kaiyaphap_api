const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
var Schema = mongoose.Schema

var scheduleSchema = new Schema({
    id: Number,
    code: String,
    name_th: String,
    name_en: String,
    geography_id: Number
}, { collection: 'm_provinces' });

var scheduleModel = mongooseConn.model("m_provinces", scheduleSchema)

module.exports = scheduleModel;