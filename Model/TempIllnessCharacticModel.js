const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;

const documentName = "t_illnesscharactics";
const tmpIllnessCharSchema = new Schema({
    _storeid: { type: Schema.Types.ObjectId, default: null },
    name: { type: String, required: true },
    isused: { type: String, default: true },
}, { collection: documentName });

tmpIllnessCharSchema.index({ '_storeid': 1, 'name': 1 }, { unique: true });

const tmpIllnessCharModel = mongooseConn.model(documentName, tmpIllnessCharSchema);

module.exports = tmpIllnessCharModel;