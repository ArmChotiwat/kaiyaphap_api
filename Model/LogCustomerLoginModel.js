const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const documentName = 'log_customer_login';
const logCustomerLoginSchema = new Schema({
    _ref_agent_userid: { type: ObjectId, required: true },
    _ref_agent_storeid: { type: ObjectId, required: true },
    _ref_storeid: { type: ObjectId, required: true },
    _ref_branchid: { type: ObjectId, required: true },
    jwtToken: { type: String, required: true },
    username: { type: String, required: true },
    datetime: { type: Date, required: true},
    date_string: { type: String, required: true},
    time_string: { type: String, required: true},
    client_ip: { type: String, default: null },
}, { collection: documentName });

const logCustomerLoginModel = mongooseConn.model(documentName, logCustomerLoginSchema);

module.exports = logCustomerLoginModel;