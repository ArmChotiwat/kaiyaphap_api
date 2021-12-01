/**
 *  รายการสินค้านำเข้า
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const documentName = 'l_product_inventory_import';
const inventoryImportSchema = new Schema({

    _ref_productid: { type: ObjectId, required: true }, // ชื่อ-รหัสสินค้า Ref. OjectId จาก "_id" ของ m_product <ProductModel.js>

    _ref_storeid: { type: ObjectId, required: true }, // ชื่อ-รหัสร้าน Ref. ObjectId จาก "_id" ของ m_stores <StoreModel.js>
    _ref_branchid: { type: ObjectId, required: true }, // ชื่อ-รหัสสาขา Ref. ObjectId จาก "branch._id" ของ m_stores <StoreModel.js>

    _ref_vendorid: { type: ObjectId, default: null }, // ชื่อ-รหัสผู้จำหน่าย Ref. ObjectId จาก "_id" ของ m_vendor <Product_VendorModel.js>

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

    import_date: { type: Date, required: true }, // วันที่ และเวลาที่ซื้อ (Date/Time)
    import_date_string: { type: String, required: true }, // วันที่ซื้อ (String)
    import_time_string: { type: String, required: true }, // เวลาที่ซื้อ (String)
    _ref_agent_userid_import: { type: ObjectId, required: true }, // ชื่อ-รหัสผู้ที่ซื้อ <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
    _ref_agent_userstoreid_import: { type: ObjectId, required: true }, // ชื่อ-รหัสผู้ที่ซื้อ <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>

    run_number_inventoryimport:  { type: Number, default: 0 }, // Running Number ของเอกสารนี้ นับ 1 เมื่อ _storeid, _branchid ซ้ำกัน Ref. <AutoIncrementProductStoreModel.js>, <AutoIncrementProductStoreRunnerModel.js>
    run_number_inventoryimport_customize:  { type: String, default: null }, // เลขที่เองสารกำหนดเอง
    run_number_inventoryimport_ref:  { type: String, default: null }, // เลขที่เอกสารอ้างอิง

    isused: { type: Boolean, required: true }, // ปิดการใช้งาน
    istruncated: { type: Boolean, required: true }, // โดนยกเลิก โดย Imd

    inventoryimport_count: { type: Number, required: true }, // จำนวนสินค้านำเข้า

    inventoryimport_price: { type: Number, required: true }, // ราคาสินค้านำเข้า

    inventoryimport_price_total: { type: Number, required: true }, // ราคาสินค้านำเข้าทั้งหมด
    

}, { collection: documentName });

inventoryImportSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1});
inventoryImportSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, '_ref_productid': 1 });

inventoryImportSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const inventoryImportModel = mongooseConn.model(documentName, inventoryImportSchema);

module.exports = inventoryImportModel;