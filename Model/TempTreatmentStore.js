const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
var Schema = mongoose.Schema

var tmpTreatmentStoreSchema = new Schema({
    _storeid: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    isused: { type: String, required: true },
})

var tmpTreatmentStoreModel = mongooseConn.model("t_treatmentStore", tmpTreatmentStoreSchema);

module.exports = tmpTreatmentStoreModel;