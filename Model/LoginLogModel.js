const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
var Schema = mongoose.Schema

var logLoginSchema = new Schema({
    _agentid: {type: Schema.Types.ObjectId},
    username: String,
    // _storeid: {type: Schema.Types.ObjectId},
    // _branchid: {type: Schema.Types.ObjectId},
    jwtToken: String,
    datetime: Date,
})

var logLoginModel = mongooseConn.model("log_logins", logLoginSchema);

module.exports = logLoginModel;