const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
var Schema = mongoose.Schema

var userDetailSchema = new Schema({
  username: String,

  citizen_id: String,
  passport_id: String,

  pre_name: String,
  first_name: String,
  last_name: String,
  nick_name: String,

  gender: String,
  birth_date: String,
  height: String,
  weight: String,

  nationality: String,
  race: String,
  religion: String,
  blood_type: String,

  telephone_number: String,
  phone_number: String,
  email: String

})

var userDetailModel = mongooseConn.model("m_users", userDetailSchema);

module.exports = userDetailModel;