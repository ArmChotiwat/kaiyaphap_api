/**
 * Master Data โรคประจำตัว
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;

const documentName = "m_illnesscharactics";
const illnessCharacticSchema = new Schema({
    _storeid: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    isused: { type: Boolean, default: true },
}, { collection: documentName });

illnessCharacticSchema.index({ '_storeid': 1, 'name': 1 }, { unique: true });

const illnessCharacticModel = mongooseConn.model(documentName, illnessCharacticSchema);

module.exports = illnessCharacticModel;