/**
 *  Treatment (รายละเอียด ใบจ่ายยา)
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const documentName = 'l_billing_detail';
const billingDetailSchema = new Schema({

    run_number: { type: Number, default: null }, // Run Number (Auto Incresement)

    _ref_billingid: { type: ObjectId, required: true, ref: 'l_billing' },
    _ref_casepatinetid: { type: ObjectId, default: null, ref: 'l_casepatient' },
    _ref_casepatinetid: { type: ObjectId, default: null, ref: 'l_treatment' },

    _ref_productid: { type: ObjectId, default: null }, // ObjectId => ref: 'm_product._id'
    count_product: { type: Number, default: 0 }, // จำนวน สินค้า
    price_product: { type: Number, default: 0 }, // ราคา สินค้า
    price_product_total: { type: Number, default: 0 }, // รวมราคา สินค้า

    _ref_courseid: { type: ObjectId, default: null }, // ObjectId Course/Package => ref: 'm_course._id'
    count_course: { type: Number, default: 0 }, // ราคา Course/Package
    price_course: { type: Number, default: 0 }, // ราคา Course/Package
    price_course_total: { type: Number, default: 0 }, // รวมราคา Course/Package

    _ref_storeid: { type: ObjectId, required: true }, // ObjectId ร้าน => ref: 'm_store._id'
    _ref_branchid: { type: ObjectId, required: true }, // ObjectId สาขา => ref: 'm_store.branch._id'

    isused: { type: Boolean, default: true }, // เปิดใช้งาน
    istruncated: { type: Boolean, default: false }, // ปิดใช้งาน โดย Imd

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

}, { collection: documentName });


billingDetailSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const billingDetailModel = mongooseConn.model(documentName, billingDetailSchema);

module.exports = billingDetailModel;