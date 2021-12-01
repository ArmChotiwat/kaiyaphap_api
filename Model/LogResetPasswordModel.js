const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
var Schema = mongoose.Schema

var illnessSchema = new Schema({
    _userid: { type: mongoose.Types.ObjectId },
    isused: Boolean,
    username: String,
})

var IllnessModel = mongooseConn.model("log_resetpassword", illnessSchema);

module.exports = IllnessModel;