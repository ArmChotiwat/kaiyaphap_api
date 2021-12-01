/**
 *  PurchaseOrder PO (ใบจ่ายยา) (Detail)
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const documentName = 'l_purchaseorder_detail';
const purchaseOrderDetailSchema = new Schema({

    run_number: { type: Number, default: null }, // Run Number (Auto Incresement)

    _ref_poid: { type: ObjectId, required: true, ref: 'l_purchaseorder' },

    _ref_treatmentid: { type: ObjectId, default: null }, // ObjectId Course/Package => ref: 'l_treatment._id'

    _ref_casepatinetid: { type: ObjectId, default: null }, // ObjectId Course/Package => ref: 'l_casepatient._id'

    _ref_productid: { type: ObjectId, default: null }, // ObjectId => ref: 'm_product._id'
    product_count: { type: Number, default: 0 }, // จำนวน สินค้า
    product_price: { type: Number, default: 0 }, // ราคา สินค้า
    product_price_total: { type: Number, default: 0 }, // รวมราคา สินค้า
    product_remark: { type: String, default: null }, // หมายเหตุของ สินค้า

    _ref_courseid: { type: ObjectId, default: null }, // ObjectId Course/Package => ref: 'm_course._id'
    course_count: { type: Number, default: 0 }, // ราคา Course/Package
    course_price: { type: Number, default: 0 }, // ราคา Course/Package
    course_price_total: { type: Number, default: 0 }, // รวมราคา Course/Package
    course_remark: { type: String, default: null }, // หมายเหตุของ Course/Package

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

    ispaid: { type: Boolean, default: false }, // จ่าย หรือยังไม่จ่าย
    isclosed: { type: Boolean, default: true }, // ปิดใช้งาน
    istruncated : { type: Boolean, default: false }, // ปิดใช้งาน โดย Imd

    po_modifier_ref_poid: { // ข้อมูลอ้างอิงเมื่อถูกแก้ไขข้อมูล จากใบ PO
        type: [
            {
                _ref_poid: { type: ObjectId, required: true }, // ObjectId _id ใบ PO
                modify_date: { type: Date, required: true }, // ObjectDateTime วัน-เวลาที่แก้ไขล่าสุด
                modify_date_string: { type: String, required: true }, // วันที่แก้ไขล่าสุด (String) YYYY-MM-DD
                modify_time_string: { type: String, required: true }, // เวลาที่แก้ไขล่าสุด (String) HH:mm:ss
                _ref_agent_userid_modify: { type: ObjectId, required: true }, // ObjectId _id ผู้แก้ไขล่าสุด => ref: 'm_agents._id'
                _ref_agent_userstoreid_modify: { type: ObjectId, required: true }, // ObjectId store._id ผู้แก้ไขล่าสุด => ref: 'm_agents.store._id'
            }
        ]
    },

}, { collection: documentName });

purchaseOrderDetailSchema.index({ '_ref_productid': 1 }, {});
purchaseOrderDetailSchema.index({ '_ref_productid': 1, '_ref_storeid': 1 }, {});
purchaseOrderDetailSchema.index({ '_ref_productid': 1, '_ref_branchid': 1 }, {});
purchaseOrderDetailSchema.index({ '_ref_productid': 1, '_ref_storeid': 1, '_ref_branchid': 1 }, {});

purchaseOrderDetailSchema.index({ '_ref_courseid': 1 }, {});
purchaseOrderDetailSchema.index({ '_ref_courseid': 1, '_ref_storeid': 1 }, {});
purchaseOrderDetailSchema.index({ '_ref_courseid': 1, '_ref_branchid': 1 }, {});
purchaseOrderDetailSchema.index({ '_ref_courseid': 1, '_ref_storeid': 1, '_ref_branchid': 1 }, {});

purchaseOrderDetailSchema.index({ '_ref_storeid': 1 }, {});
purchaseOrderDetailSchema.index({ '_ref_branchid': 1 }, {});
purchaseOrderDetailSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1 }, {});

purchaseOrderDetailSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const purchaseOrderDetailModel = mongooseConn.model(documentName, purchaseOrderDetailSchema);

module.exports = purchaseOrderDetailModel;