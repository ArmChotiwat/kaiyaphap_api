/**
 *  PurchaseOrder PO (ใบจ่ายยา)
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const documentName = 'l_purchaseorder';
const purchaseOrderSchema = new Schema({

    run_number: { type: Number, default: null }, // Run Number (Auto Incresement)
    run_po: { type: String, default: null },

    _ref_treatmentid: { type: ObjectId, default: null }, // ObjectId Course/Package => ref: 'l_treatment._id'

    _ref_casepatinetid: { type: ObjectId, default: null }, // ObjectId Course/Package => ref: 'l_casepatient._id'

    count_product_list: { type: Number, default: 0 }, // จำนวนรายการสินค้าทั้งหมด
    price_product_list_total: { type: Number, default: 0 }, // รวมราคาสินค้าทั้งหมด
    price_product_list_discount: { type: Number, default: 0 }, // ราคา ลดราคาสินค้า
    price_product_list_total_discount: { type: Number, default: 0 }, // รวมราคาสินค้า และลดราคาสินค้าทั้งหมด

    count_course_list: { type: Number, default: 0 }, // จำนวนรายการ Course/Package ทั้งหมด
    price_course_list_total: { type: Number, default: 0 }, // รวมราคา Course/Package ทั้งหมด
    price_course_list_discount: { type: Number, default: 0 }, // ราคา ลดราคาสินค้า
    price_course_list_total_discount: { type: Number, default: 0 }, // รวมราคาสินค้า และลดราคาสินค้าทั้งหมด

    price_total_before: { type: Number, default: 0 }, // ราคารวม สินค้า (Product) และการรักษา (Course/Package)
    price_discount: { type: Number, default: 0 }, // ราคา ส่วนลด
    price_total_after: { type: Number, default: 0 }, // ราคาสุทธิ (ราคารวม-ราคาส่วนลด)

    _ref_storeid: { type: ObjectId, required: true }, // ObjectId ร้าน => ref: 'm_store._id'
    _ref_branchid: { type: ObjectId, required: true }, // ObjectId สาขา => ref: 'm_store.branch._id'

    create_date: { type: Date, required: true }, // ObjectDateTime วัน-เวลาที่สร้าง
    create_date_string: { type: String, required: true }, // วันที่สร้าง (String) YYYY-MM-DD
    create_time_string: { type: String, required: true }, // เวลาที่สร้าง (String) HH:mm:ss
    _ref_agent_userid_create: { type: ObjectId, required: true }, // ObjectId _id ผู้สร้าง => ref: 'm_agents._id'
    _ref_agent_userstoreid_create: { type: ObjectId, required: true }, // ObjectId store._id ผู้สร้าง => ref: 'm_agents.store._id'

    modify_date: { type: Date, required: true }, // ObjectDateTime วัน-เวลาที่แก้ไขล่าสุด
    modify_date_string: { type: String, required: true }, // วันที่แก้ไขล่าสุด (String) YYYY-MM-DD
    modify_time_string: { type: String, required: true }, // เวลาที่แก้ไขล่าสุด (String) HH:mm:ss
    _ref_agent_userid_modify: { type: ObjectId, required: true }, // ObjectId _id ผู้แก้ไขล่าสุด => ref: 'm_agents._id'
    _ref_agent_userstoreid_modify: { type: ObjectId, required: true }, // ObjectId store._id ผู้แก้ไขล่าสุด => ref: 'm_agents.store._id'

    paid_type: { type: String, default: null },

    ispaid: { type: Boolean, default: false }, // จ่าย หรือยังไม่จ่าย
    isclosed: { type: Boolean, default: false }, // ปิดใช้งาน
    istruncated : { type: Boolean, default: false }, // ปิดใช้งาน โดย Imd

}, { collection: documentName });

purchaseOrderSchema.index({ '_ref_storeid': 1 }, {});
purchaseOrderSchema.index({ '_ref_branchid': 1 }, {});
purchaseOrderSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1 }, {});

purchaseOrderSchema.index({ '_ref_casepatinetid': 1 }, {});
purchaseOrderSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, '_ref_casepatinetid': 1 }, {});

purchaseOrderSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const purchaseOrderModel = mongooseConn.model(documentName, purchaseOrderSchema);

module.exports = purchaseOrderModel;