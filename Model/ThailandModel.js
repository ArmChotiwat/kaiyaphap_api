const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
var Schema = mongoose.Schema

var thailandSchema = new Schema({
    provinces: [
        {
            id: String,
            code: String,
            name_th: String,
            name_en: String,
            geography_id: String
        }
    ],
    amphures: [
        {
            id: String,
            code: String,
            name_th: String,
            name_en: String,
            province_id: String
        }
    ],
    districts: [
        {
            id: String,
            zip_code: String,
            name_th: String,
            name_en: String,
            amphure_id: String
        }
    ]
},{collection: 'm_thailand'});

var thailandModel = mongooseConn.model("m_thailand", thailandSchema)

module.exports = thailandModel;