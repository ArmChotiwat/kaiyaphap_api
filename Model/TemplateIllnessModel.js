const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;

const documentName = "t_illness";
const tmpIllnessSchema = new Schema({
    _storeid: { type: Schema.Types.ObjectId, default: null },
    name: { type: String, required: true },
    isused: { type: String, default: true },
}, { collection: documentName });

tmpIllnessSchema.index({ '_storeid': 1, 'name': 1 }, { unique: true });

const tmpIllnessModel = mongooseConn.model(documentName, tmpIllnessSchema);

module.exports = tmpIllnessModel;