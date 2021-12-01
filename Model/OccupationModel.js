const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
var Schema = mongoose.Schema

var occupationSchema = new Schema({
    name_th: String
}, { collection: 'm_occupations' });

var occupationModel = mongooseConn.model("m_occupations", occupationSchema)

module.exports = occupationModel;