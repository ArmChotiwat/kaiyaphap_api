const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const casePatientPersonalDetailSchema = new Schema({

    _ref_casepatinetid: { type: ObjectId, required: true, ref: 'l_casepatient' },

    create_date: { type: Date, required: true },
    create_date_string: { type: String, required: true },
    create_time_string: { type: String, required: true },

    patient_personal: {
        identity_card: {
            ctype: Boolean, // citicen_id = true or passport_id = false
            id: String
        },

        pre_name: String,
        special_prename: String,
        first_name: String,
        last_name: String,
        nick_name: String,

        gender: String,
        birth_date: String,
        height: Number,
        weight: Number,

        nationality: String,
        race: String,
        religion: String,
        blood_type: String,

        telephone_number: String,
        phone_number: String,
        email: String,

        status: String, //สถาณภาพ แต่งงาน/โสด .....
        occupation: String,

        contract_card: {
            address_number: String,
            village_number: Number,
            village: String,
            building: String,
            alley: String,
            road: String,
            province: String,
            district: String,
            sub_district: String,
            postcode: String
        },

        contract_present: {
            address_number: String,
            village_number: Number,
            village: String,
            building: String,
            alley: String,
            road: String,
            province: String,
            district: String,
            sub_district: String,
            postcode: String
        },

        contract_emergency: {
            isenabled: Boolean, // มีผู้ติดต่อฉุกเฉิน => true || ไม่มีผู้ติดต่อฉุกเฉิน => false
            data: {
                personal_realationship: String, // ความเกี่ยวข้อง
                pre_name: String, // คำนำหน้า
                special_prename: String,
                first_name: String, // ชื่อจริง
                last_name: String, // นามสกุล

                address_number: String, // บ้านเลขที่
                village_number: Number, // หมู่ที่
                village: String, // ชื่อหมูบ้าน
                building: String, // ชื่อตึก-อาคาร
                alley: String, // ซอย
                road: String, // ถนน
                province: String, // จังหวัด
                district: String, // อำเภอ-เขต
                sub_district: String, // ตำบล-แขวง
                postcode: String, // รหัสไปรณีย์

                telephone_number: String, // โทรศัพท์บ้าน
                phone_number: String, // โทรมือถือ
                email: String // เมลล์
            }
        },

        medication_privilege: {
            privilege_name: String
        },

        general_user_detail: {
            cigarette_acttivity: {
                answer: Boolean,
                detail: String
            },
            alcohol_acttivity: {
                answer: Boolean,
                detail: String
            },
            congenital_disease: [
                {
                    _illnesscharid: { type: Schema.Types.ObjectId },
                    name: String
                }
            ],
            drug_allergy: String
        },

        illness_history: [
            {
                id: { type: Schema.Types.ObjectId },
                name: String,
                answer: Number,
                detail: String
            }
        ]
    },

}, { collection: 'l_casepatient_pd' });

casePatientPersonalDetailSchema.index({ '_ref_casepatinetid': 1 }, { unique: true }); // One Case - One PD

const casePatientPersonalDetailModel = mongooseConn.model("l_casepatient_pd", casePatientPersonalDetailSchema);

module.exports = casePatientPersonalDetailModel;