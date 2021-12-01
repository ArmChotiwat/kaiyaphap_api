/**
 *  รายการสินค้าคงคลัง
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const documentName = 'log_product_inventory_decrese';
const logProductInventoryDecreseSchema = new Schema({

    _ref_treatmentid: { type: ObjectId, default: null }, // Ref. OjectId จาก "_id" ของ l_treatment._id <TreatmentModel.js>

    _ref_purchase_orderid: { type: ObjectId, default: null }, // Ref. OjectId จาก "_id" ของ l_purchase_order._id <PurchaseOrderModel.js>
    _ref_purchase_order_detailid: { type: ObjectId, default: null }, // Ref. OjectId จาก "_id" ของ l_purchase_order_detail._id <PurchaseOrderDetailModel.js>

    _ref_productid: { type: ObjectId, required: true }, // ชื่อ-รหัสสินค้า Ref. OjectId จาก "_id" ของ m_product <ProductModel.js>
    _ref_product_inventoryid: { type: ObjectId, required: true }, // Ref. OjectId จาก "_id" ของ m_product_inventory <Product_InventoryModel.js>

    _ref_storeid: { type: ObjectId, required: true }, // ชื่อ-รหัสร้าน Ref. ObjectId จาก "_id" ของ m_stores <StoreModel.js>
    _ref_branchid: { type: ObjectId, required: true }, // ชื่อ-รหัสสาขา Ref. ObjectId จาก "branch._id" ของ m_stores <StoreModel.js>

    create_date: { type: Date, required: true }, // ObjectDateTime วัน-เวลาที่สร้าง
    create_date_string: { type: String, required: true }, // วันที่สร้าง (String) YYYY-MM-DD
    create_time_string: { type: String, required: true }, // เวลาที่สร้าง (String) HH:mm:ss
    _ref_agent_userid_create: { type: ObjectId, required: true }, // ObjectId _id ผู้สร้าง => ref: 'm_agents._id'
    _ref_agent_userstoreid_create: { type: ObjectId, required: true }, // ObjectId store._id ผู้สร้าง => ref: 'm_agents.store._id'

    modify_recent_date: { type: Date, required: true }, // วันที่ และเวลาที่แก้ไขเอกสารล่าสุด (Date/Time)
    modify_recent_date_string: { type: String, required: true },// วันที่แก้ไขเอกสารล่าสุด (String)
    modify_recent_time_string: { type: String, required: true }, // เวลาที่แก้ไขเอกสารล่าสุด (String)
    _ref_agent_userid_modify_recent: { type: ObjectId, required: true }, // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
    _ref_agent_userstoreid_modify_recent: { type: ObjectId, required: true }, // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>

    isused: { type: Boolean, default: true  }, // การใช้งาน
    istruncated: { type: Boolean, default: false }, // โดนยกเลิก โดย Imd

    product_inventory_decrese_count: { type: Number, default: 0 }, // จำนวนสินค้าคงคลัง ที่จะปรับลด "m_product_inventory.product_inventory_count" <Product_InventoryModel.js>

    iscommit: { type: Boolean, required: true }, // Log นี้ ได้ทำการปรับลด Stock "m_product_inventory.product_inventory_count" <Product_InventoryModel.js> เรียบร้อยแล้ว (true) หรือไม่ (false)
    isrollback: { type: Boolean, required: true }, // Log นี้ ได้ทำหารปรับคืน Stock "m_product_inventory.product_inventory_count" <Product_InventoryModel.js> เรียบร้อยแล้ว (true) หรือไม่ (false)

}, { collection: documentName });

//logProductInventoryDecreseSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, 'run_number_product_inventory': 1 }, { unique: true });
logProductInventoryDecreseSchema.index({ '_ref_storeid': 1 }, {});
logProductInventoryDecreseSchema.index({ '_ref_branchid': 1 }, {});
logProductInventoryDecreseSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1 }, {});

logProductInventoryDecreseSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, '_ref_treatmentid': 1 }, {});

logProductInventoryDecreseSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, '_ref_purchase_orderid': 1 }, {});
logProductInventoryDecreseSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, '_ref_purchase_orderid': 1, '_ref_purchase_order_detailid': 1 }, {});

logProductInventoryDecreseSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, '_ref_productid': 1 }, {});
logProductInventoryDecreseSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, '_ref_product_inventoryid': 1 }, {});
logProductInventoryDecreseSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, '_ref_productid': 1, '_ref_product_inventoryid': 1 }, {});

logProductInventoryDecreseSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const logProductInventoryDecreseModel = mongooseConn.model(documentName, logProductInventoryDecreseSchema);

module.exports = logProductInventoryDecreseModel;