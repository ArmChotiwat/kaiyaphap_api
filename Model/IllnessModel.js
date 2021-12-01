const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;

const collectionName = "m_illnesses";
const illnessSchema = new Schema({
    _storeid: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    isused: { type: Boolean, default: true },
}, { collection: collectionName });

illnessSchema.index({ '_storeid': 1, 'name': 1 }, { unique: true });

const IllnessModel = mongooseConn.model(collectionName, illnessSchema);

module.exports = IllnessModel;