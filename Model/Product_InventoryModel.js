/**
 *  รายการสินค้าคงคลัง
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const documentName = 'm_product_inventory';
const inventorySchema = new Schema({

    _ref_productid: { type: ObjectId, required: true }, // ชื่อ-รหัสสินค้า Ref. OjectId จาก "_id" ของ m_product <ProductModel.js>

    _ref_storeid: { type: ObjectId, required: true }, // ชื่อ-รหัสร้าน Ref. ObjectId จาก "_id" ของ m_stores <StoreModel.js>
    _ref_branchid: { type: ObjectId, required: true }, // ชื่อ-รหัสสาขา Ref. ObjectId จาก "branch._id" ของ m_stores <StoreModel.js>

    modify_recent_date: { type: Date, required: true }, // วันที่ และเวลาที่แก้ไขเอกสารล่าสุด (Date/Time)
    modify_recent_date_string: { type: String, required: true },// วันที่แก้ไขเอกสารล่าสุด (String)
    modify_recent_time_string: { type: String, required: true }, // เวลาที่แก้ไขเอกสารล่าสุด (String)
    _ref_agent_userid_modify_recent: { type: ObjectId, required: true }, // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
    _ref_agent_userstoreid_modify_recent: { type: ObjectId, required: true }, // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>

    isused: { type: Boolean, default:false  }, // ปิดการใช้งาน
    istruncated: { type: Boolean, default: false }, // โดนยกเลิก โดย Imd

    product_inventory_count: { type: Number, default: 0 }, // จำนวนสินค้าคงเหลือ
    
    product_price: { type: Number, default: 0 }, // ราคาสินค้าปัจจุบัน


}, { collection: documentName , timestamps: true });

//inventorySchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, 'run_number_product_inventory': 1 }, { unique: true });
inventorySchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, '_ref_productid': 1 }, { unique: true });

inventorySchema.plugin(updateIfCurrentPlugin, { strategy: "timestamp" });

const inventoryModel = mongooseConn.model(documentName, inventorySchema);

module.exports = inventoryModel;