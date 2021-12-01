const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const collectionName = 'l_schedule_refactor';
const schedule_RefactorSchema = new Schema({

    // _id (Primary Key ObjectId) => _ref_scheduleid (Foreign Key ObjectId)

    _ref_storeid: { type: ObjectId, required: true }, // ObjectId ร้าน
    _ref_branchid: { type: ObjectId, required: true }, // ObjectId สาขา ของร้าน

    seq: { type: Number, default: 0 },

    _ref_agent_userid: { type: ObjectId, required: true }, // ObjectId ของ Agent => ref: m_agents._id
    _ref_agent_userstoreid: { type: ObjectId, required: true }, // ObjectId ของ Agent ใน Store => ref:  m_agents.store[]._id
    agent_pre_name: { type: String, required: true }, // ชื่อนำหน้า Agent => ref: m_agents.store[].personal.pre_name ตาม Store นั้น ๆ
    agent_special_prename: { type: String, default: null }, // ชื่อพิเศษ Agent => ref: m_agents.store[].personal.special_prename ตาม Store นั้น ๆ
    agent_first_name: { type: String, required: true }, // ชื่อจริง Agent => ref: m_agents.store[].personal.first_name ตาม Store นั้น ๆ
    agent_last_name: { type: String, required: true }, // ชื่อสกุล Agent => ref: m_agents.store[].personal.last_name ตาม Store นั้น ๆ

    _ref_patient_userid: { type: ObjectId, required: true }, // ObjectId ของ Patient => ref: m_patients._id
    _ref_patient_userstoreid: { type: ObjectId, required: true }, // ObjectId ของ Patient ใน Store => ref:  m_patients.store[]._id
    patient_pre_name: { type: String, required: true }, // ชื่อนำหน้า Patient => ref: m_patients.store[].personal.pre_name ตาม Store นั้น ๆ
    patient_special_prename: { type: String, default: null }, // ชื่อพิเศษ Patient => ref: m_patients.store[].personal.special_prename ตาม Store นั้น ๆ
    patient_first_name: { type: String, required: true }, // ชื่อจริง Patient => ref: m_patients.store[].personal.first_name ตาม Store นั้น ๆ
    patient_last_name: { type: String, required: true }, // ชื่อสกุล Patient => ref: m_patients.store[].personal.last_name ตาม Store นั้น ๆ
    
    create_date: { type: Date, required: true }, // Date Object ที่สร้างเอกสาร
    create_date_string: { type: String, required: true }, // YYYY-MM-DD ที่สร้างเอกสาร
    create_time_string: { type: String, required: true }, // HH:mm:ss ที่สร้างเอกสาร

    modify_date: { type: Date, required: true }, // Date Object ที่แก้ไขเอกสาร
    modify_date_string: { type: String, required: true }, // YYYY-MM-DD ที่แก้ไขเอกสาร
    modify_time_string: { type: String, required: true }, // YYYY-MM-DD ที่แก้ไขเอกสาร

    dateFrom:  { type: Date, required: true }, // Date Object เวลานัด (เริ่ม)
    dateFrom_string:  { type: String, required: true }, // YYYY-MM-DD เวลานัด (เริ่ม)
    timeFrom_string:  { type: String, required: true }, // HH:mm:ss เวลานัด (เริ่ม)

    dateTo:  { type: Date, required: true }, // Date Object เวลานัด (สิ้นสุด)
    dateTo_string:  { type: String, required: true }, // YYYY-MM-DD เวลานัด (สิ้นสุด)
    timeTo_string:  { type: String, required: true }, // HH:mm:ss เวลานัด (สิ้นสุด)
    
    detail: { type: String, default: null }, // รายละเอียด (บันทึก Free Text)

    /**
     * สถาณะการจอง
     ** 0 = ยกเลิกนัด
     ** 1 = นัดหมายไว้
     ** 2 = รอรับการรักษา
     ** 3 = รอชำระเงิน
     ** 4 = เสร็จสิ้น
     */
    status: { type: String, required: true },
    
}, { collection: collectionName });


schedule_RefactorSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });


schedule_RefactorSchema.plugin(
    AutoIncrement, 
    {
        id: `${collectionName}_runner`,
        reference_fields: ['_ref_storeid', '_ref_branchid'], 
        inc_field: 'seq', 
        collection_name: `ai_${collectionName}_runner`, 
        inc_amount: 1 
    }
);

schedule_RefactorSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1 }, { sparse: true });

const schedule_RefactorModel = mongooseConn.model(collectionName, schedule_RefactorSchema)

module.exports = schedule_RefactorModel;