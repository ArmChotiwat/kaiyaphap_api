const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId =  Schema.Types.ObjectId;

const collectionName ='m_agents_email'
const AgentEmailSchema = new Schema({
    _ref_storeid: { type: ObjectId, required: true },
    _ref_branchid: { type: ObjectId, required: true },
    email: { type: String, required: true }

}, { collection: collectionName });

AgentEmailSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, 'email': 1 }, { unique: true });

const AgentEmailModel = mongooseConn.model(collectionName, AgentEmailSchema);

module.exports = AgentEmailModel;