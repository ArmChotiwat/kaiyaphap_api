const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
var Schema = mongoose.Schema

var scheduleSchema = new Schema({
    id: String,
    code: String,
    name_th: String,
    name_en: String,
    province_id: Number
}, { collection: 'm_amphures' });

var scheduleModel = mongooseConn.model("m_amphures", scheduleSchema)

module.exports = scheduleModel;