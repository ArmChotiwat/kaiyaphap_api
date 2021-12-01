/**
 *  Treatment (ใบสั่งยา) (Header)
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const documentName = 'l_treatment_progressionnote';
const treatment_ProgressionNoteSchema = new Schema({

    run_number: { type: Number, default: null }, // Run Number (Auto Incresement)

    _ref_scheduleid: { type: ObjectId, required: true, ref: 'l_schedule' }, // ObjectId คิว => ref: 'l_schedule.data._id'

    _ref_casepatinetid: { type: ObjectId, required: true, ref: 'l_casepatient' },

    _ref_treatmentid: { type: ObjectId, default: null, ref: 'l_treatment' },

    _ref_patient_userid:  { type: ObjectId, required: true, ref: 'm_patients' },
    _ref_patient_userstoreid:  { type: ObjectId, required: true }, // ObjectId ผู้ป่วย => ref: 'm_patients.store._id'

    _ref_storeid: { type: ObjectId, required: true }, // ObjectId ร้าน => ref: 'm_store._id'
    _ref_branchid: { type: ObjectId, required: true }, // ObjectId สาขา => ref: 'm_store.branch._id'

    S: { type: String, default: null },
    O: { type: String, default: null },
    A: { type: String, default: null },
    P: { type: String, default: null },

    diagnosis_file_type: { type: Number, default: 0 }, // 0 = ไม่มี, 1 = MRI, 2 = CT-Scan, 3 = X-Rays
    diagnosis_file: [
        {
            file_name: { type: String, required: true }
        }
    ],

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

}, { collection: documentName });

treatment_ProgressionNoteSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

treatment_ProgressionNoteSchema.index({ '_ref_storeid': 1 }, {});
treatment_ProgressionNoteSchema.index({ '_ref_branchid': 1 }, {});
treatment_ProgressionNoteSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1 }, {});

treatment_ProgressionNoteSchema.index({ '_ref_treatmentid': 1 }, {});
treatment_ProgressionNoteSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, '_ref_treatmentid': 1 }, { });

treatment_ProgressionNoteSchema.index({ '_ref_scheduleid': 1 }, { unique: true });

const treatment_ProgressionNoteModel = mongooseConn.model(documentName, treatment_ProgressionNoteSchema);

module.exports = treatment_ProgressionNoteModel;