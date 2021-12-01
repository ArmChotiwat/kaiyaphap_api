/**
 *  บันทึกราคาสินค้า
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const documentName = 'l_product_inventory_price';
const productPriceSchema = new Schema({

    _ref_productid: { type: ObjectId, required: true }, // ชื่อ-รหัสสินค้า Ref. OjectId จาก "_id" ของ m_product <ProductModel.js>

    _ref_storeid: { type: ObjectId, required: true }, // ชื่อ-รหัสร้าน Ref. ObjectId จาก "_id" ของ m_stores <StoreModel.js>
    _ref_branchid: { type: ObjectId, required: true }, // ชื่อ-รหัสสาขา Ref. ObjectId จาก "branch._id" ของ m_stores <StoreModel.js>

    create_date: { type: Date, required: true }, // วันที่ และเวลาที่สร้างเอกสาร (Date/Time)
    create_date_string: { type: String, required: true }, // วันที่สร้างเอกสาร (String)
    create_time_string: { type: String, required: true }, // เวลาที่สร้างเอกสาร (String)
    _ref_agent_userid_create: { type: ObjectId, required: true }, // ชื่อ-รหัสผู้ที่สร้างเอกสาร <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
    _ref_agent_userstoreid_create: { type: ObjectId, required: true }, // ชื่อ-รหัสผู้ที่สร้างเอกสาร <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>

    run_number_inventoryimport:  { type: Number, default: null }, // Running Number ของเอกสารนี้ นับ 1 เมื่อ _storeid, _branchid ซ้ำกัน
    run_number_inventoryimport_customize:  { type: String, default: null }, // เลขที่เองสารกำหนดเอง
    run_number_inventoryimport_ref:  { type: String, default: null }, // เลขที่เอกสารอ้างอิง

    isused: { type: Boolean, required: true }, // ปิดการใช้งาน
    istruncated: { type: Boolean, required: true }, // โดนยกเลิก โดย Imd

    product_price: { type: Number, default: 0 }, // ราคาสินค้า

}, { collection: documentName });

//productPriceSchema.index({ '_ref_storeid': 1, 'product_name': 1 }, { unique: true });
// productPriceSchema.index({ '_ref_storeid': 1, 'run_number_inventoryimport': 1 , 'run_number_store': 1}, { unique: true });

productPriceSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const productInventoryPriceModel = mongooseConn.model(documentName, productPriceSchema);

module.exports = productInventoryPriceModel;