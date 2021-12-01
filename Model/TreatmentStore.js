const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
var Schema = mongoose.Schema

var treatmentStoreSchema = new Schema({
    _storeid: { type: Schema.Types.ObjectId, ref: 'm_stores', required: true }, // ObectID (id) ร้าน
    _branchid: { type: Schema.Types.ObjectId, required: true }, // ObectID (id) สาขาร้าน
    name: { type: String, required: true }, // ชื้อ Threatment
    price: { type: Number, default: 0, required: true },
    isused: { type: Boolean, required: true }, // ใช้งาน
})

var treatmentStoreModel = mongooseConn.model("m_treatmentstores", treatmentStoreSchema);

module.exports = treatmentStoreModel;