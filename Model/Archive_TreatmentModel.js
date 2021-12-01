/**
 *  Treatment (ใบสั่งยา) (Header) (ArchiveDocument)
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const documentName = 'ar_treatment';
const archiveTreatmentSchema = new Schema({

    _ref_original_treatmentid: { type: ObjectId, required: true, ref: 'l_treatment' },

    run_number: { type: Number, default: null }, // Run Number (Auto Incresement)

    _ref_treatment_progressionnoteid: { type: ObjectId, default: null, ref: 'l_treatment_progressionnote' }, // ObjectId คิว => ref: 'l_treatment_progressionnote._id'

    _ref_casepatinetid: { type: ObjectId, required: true, ref: 'l_casepatient' },

    count_product_list: { type: Number, default: 0 }, // จำนวนรายการสินค้าทั้งหมด
    price_product_list_total: { type: Number, default: 0 }, // รวมราคาสินค้าทั้งหมด
    price_product_list_discount: { type: Number, default: 0 }, // ราคา ลดราคาสินค้า
    price_product_list_total_discount: { type: Number, default: 0 }, // รวมราคาสินค้า และลดราคาสินค้าทั้งหมด

    count_course_list: { type: Number, default: 0 }, // จำนวนรายการ Course/Package ทั้งหมด
    price_course_list_total: { type: Number, default: 0 }, // รวมราคา Course/Package ทั้งหมด
    price_course_list_discount: { type: Number, default: 0 }, // ราคา ลดราคาสินค้า
    price_course_list_total_discount: { type: Number, default: 0 }, // รวมราคาสินค้า และลดราคาสินค้าทั้งหมด

    price_total_before: { type: Number, default: 0 }, // ราคารวม สินค้า (Product) และการรักษา (Course/Package)
    price_discount: { type: Number, default: 0 }, // ราคา ส่วนลดทั้งหมด
    price_total_after: { type: Number, default: 0 }, // ราคาสุทธิ (ราคารวมทั้งหมด-ราคาส่วนลดทั้งหมด)

    _ref_storeid: { type: ObjectId, required: true }, // ObjectId ร้าน => ref: 'm_store._id'
    _ref_branchid: { type: ObjectId, required: true }, // ObjectId สาขา => ref: 'm_store.branch._id'

    isclosed: { type: Boolean, default: false }, // ปิดใช้งาน
    istruncated : { type: Boolean, default: false }, // ปิดใช้งาน โดย Imd

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

    medical_certificate_th: { // ใบรับรองแพทย์ (ภาษาไทย)
        patient_name: { type: String, default: null }, // ชือผู้ป่วย (Free Text)
        detected_symptom: { type: String, default: null }, // อาการที่ตรวจภาพ (Free Text)
        pt_diagnosis: { type: String, default: null }, // ผลการตรวจวินิจฉัยทางกายภาพ (Free Text)
        treatment: { type: String, default: null }, // ได้รับการรักษาโดยการ (Free Text)
    },
    medical_certificate_en: { // ใบรับรองแพทย์ (ภาษาอังกฤษ)
        patient_name: { type: String, default: null }, // ชือผู้ป่วย (Free Text)
        detected_symptom: { type: String, default: null }, // อาการที่ตรวจภาพ (Free Text)
        pt_diagnosis: { type: String, default: null }, // ผลการตรวจวินิจฉัยทางกายภาพ (Free Text)
        treatment: { type: String, default: null }, // ได้รับการรักษาโดยการ (Free Text)
    },

    po_is_modified: { type: Boolean, default: false }, // ถูกแก้ไขข้อมูล จากใบ PO
    po_modifier_ref_poid: { // ข้อมูลอ้างอิงเมื่อถูกแก้ไขข้อมูล จากใบ PO
        type: [
            {
                _ref_poid: { type: ObjectId, required: true }, // ObjectId _id 'l_purchaseorder'
                _ref_archive_treatmentid: { type: ObjectId, required: true }, // ObjectId _id 'ar_treatment'
                modify_date: { type: Date, required: true }, // ObjectDateTime วัน-เวลาที่แก้ไขล่าสุด
                modify_date_string: { type: String, required: true }, // วันที่แก้ไขล่าสุด (String) YYYY-MM-DD
                modify_time_string: { type: String, required: true }, // เวลาที่แก้ไขล่าสุด (String) HH:mm:ss
                _ref_agent_userid_modify: { type: ObjectId, required: true }, // ObjectId _id ผู้แก้ไขล่าสุด => ref: 'm_agents._id'
                _ref_agent_userstoreid_modify: { type: ObjectId, required: true }, // ObjectId store._id ผู้แก้ไขล่าสุด => ref: 'm_agents.store._id'
            }
        ]
    },

}, { collection: documentName });

archiveTreatmentSchema.index({ '_ref_storeid': 1 }, {});
archiveTreatmentSchema.index({ '_ref_branchid': 1 }, {});
archiveTreatmentSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1 }, {});

archiveTreatmentSchema.index({ '_ref_casepatinetid': 1 }, {});
archiveTreatmentSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, '_ref_casepatinetid': 1 }, {});

archiveTreatmentSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const archiveTreatmentModel = mongooseConn.model(documentName, archiveTreatmentSchema);

module.exports = archiveTreatmentModel;