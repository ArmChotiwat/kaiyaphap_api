/**
 *  บันทึกราคาสินค้า
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const documentName = 'm_product_group';
const productGroupSchema = new Schema({

    name: { type: String, required: true }, // ชื่อ Product Group

    _ref_storeid: { type: ObjectId, required: true }, // ชื่อ-รหัสร้าน Ref. ObjectId จาก "_id" ของ m_stores <StoreModel.js>

    create_date: { type: Date, required: true }, // วันที่ และเวลาที่สร้างเอกสาร (Date/Time)
    create_date_string: { type: String, required: true }, // วันที่สร้างเอกสาร (String)
    create_time_string: { type: String, required: true }, // เวลาที่สร้างเอกสาร (String)
    _ref_agent_userid_create: { type: ObjectId, required: true }, // ชื่อ-รหัสผู้ที่สร้างเอกสาร <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
    _ref_agent_userstoreid_create: { type: ObjectId, required: true }, // ชื่อ-รหัสผู้ที่สร้างเอกสาร <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>

    modify_recent_date: { type: Date, required: true }, // วันที่ และเวลาที่แก้ไขเอกสารล่าสุด (Date/Time)
    modify_recent_date_string: { type: String, required: true },// วันที่แก้ไขเอกสารล่าสุด (String)
    modify_recent_time_string: { type: String, required: true }, // เวลาที่แก้ไขเอกสารล่าสุด (String)
    _ref_agent_userid_modify_recent: { type: ObjectId, required: true }, // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
    _ref_agent_userstoreid_modify_recent: { type: ObjectId, required: true }, // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>
    
    run_number:  { type: Number, default: null }, // Running Number ของเอกสารนี้ นับ 1 เมื่อ _ref_storeid ซ้ำกัน ()

    isused: { type: Boolean, required: true }, // ปิดการใช้งาน
    istruncated: { type: Boolean, required: true }, // โดนยกเลิก โดย Imd

}, { collection: documentName });

productGroupSchema.index({ '_ref_storeid': 1, 'name': 1 }, { unique: true });

productGroupSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const productGroupModel = mongooseConn.model(documentName, productGroupSchema);

module.exports = productGroupModel;