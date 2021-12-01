const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const collectionName = 'm_patients_refactor';
const Patient_RefactorSchema = new Schema({

    _ref_storeid: { type: ObjectId, required: true }, // Object ID ร้าน
    _userstoreid: { type: ObjectId, required: true }, // Patient Store ID

    _register_from_branch: { type: ObjectId, default: null, ref: 'm_stores.branch.id' }, // ObjectId สาขา => ref: 'm_store.branch._id'
    hn: { type: String, required: true }, // รหัส HN ใหม่ <*>
    hn_ref: { type: String, default: null }, // รหัส HN เก่า ของร้าน
    create_date: { type: Date, required: true }, // ObjectDateTime วัน-เวลาที่สร้าง                วันที่ที่ถูกเปล่ยนใหม่ 
    create_date_string: { type: String, required: true }, // วันที่สร้าง (String) YYYY-MM-DD       วันที่ที่ถูกเปล่ยนใหม่ 
    create_time_string: { type: String, required: true }, // เวลาที่สร้าง (String) HH:mm:ss        วันที่ที่ถูกเปล่ยนใหม่ 
    user_status: { type: Boolean, required: true }, //สถาณะยูสเซอร์
    personal: { // ข้อมูลส่วนตัว
        identity_card: { // ข้อมูล บัตรประชาชน หรือพาสปอต
            ctype: { type: Boolean, default: true }, // บัตรประชาชน (citicen_id) = true or พาสปอต (passport_id) = false
            id: { type: String, default: null } // หมายเลขบัตรประชาชน หรือหมายเลขพาสปอต
        },

        pre_name: { type: String, required: true }, // 
        special_prename: { type: String, default: null },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        nick_name: { type: String, default: null },

        gender: { type: String, default: null },
        birth_date: { type: Date, default: null }, // Date Object
        birth_date_string: { type: String, default: null }, // YYYY-MM-DD
        height: { type: Number, default: null },
        weight: { type: Number, default: null },

        nationality: { type: String, default: null },
        race: { type: String, default: null },
        religion: { type: String, default: null },
        blood_type: { type: String, default: null },

        telephone_number: { type: String, default: null },
        phone_number: { type: String, default: null },
        email: { type: String, default: null },

        status: { type: String, default: null }, //สถาณภาพ แต่งงาน/โสด .....
        occupation: { type: String, default: null },

        contract_card: {
            address_number: { type: String, default: null },
            village_number: { type: Number, default: null },
            village: { type: String, default: null },
            building: { type: String, default: null },
            alley: { type: String, default: null },
            road: { type: String, default: null },
            province: { type: String, default: null },
            district: { type: String, default: null },
            sub_district: { type: String, default: null },
            postcode: { type: String, default: null }
        },

        contract_present: {
            address_number: { type: String, default: null },
            village_number: { type: Number, default: null },
            village: { type: String, default: null },
            building: { type: String, default: null },
            alley: { type: String, default: null },
            road: { type: String, default: null },
            province: { type: String, default: null },
            district: { type: String, default: null },
            sub_district: { type: String, default: null },
            postcode: { type: String, default: null }
        },

        contract_emergency: {
            isenabled: { type: Boolean, default: false }, // มีผู้ติดต่อฉุกเฉิน => true || ไม่มีผู้ติดต่อฉุกเฉิน => false
            data: {
                personal_realationship: { type: String, default: null }, // ความเกี่ยวข้อง
                pre_name: { type: String, default: null }, // คำนำหน้า
                special_prename: { type: String, default: null },
                first_name: { type: String, default: null }, // ชื่อจริง
                last_name: { type: String, default: null }, // นามสกุล

                address_number: { type: String, default: null }, // บ้านเลขที่
                village_number: { type: Number, default: null }, // หมู่ที่
                village: { type: String, default: null }, // ชื่อหมูบ้าน
                building: { type: String, default: null }, // ชื่อตึก-อาคาร
                alley: { type: String, default: null }, // ซอย
                road: { type: String, default: null }, // ถนน
                province: { type: String, default: null }, // จังหวัด
                district: { type: String, default: null }, // อำเภอ-เขต
                sub_district: { type: String, default: null }, // ตำบล-แขวง
                postcode: { type: String, default: null }, // รหัสไปรณีย์

                telephone_number: { type: String, default: null }, // โทรศัพท์บ้าน
                phone_number: { type: String, default: null }, // โทรมือถือ
                email: { type: String, default: null } // เมลล์
            }
        },

        medication_privilege: {
            privilege_name: { type: String, default: null }
        },

        general_user_detail: {
            cigarette_acttivity: {
                answer: { type: Boolean, default: false },
                detail: { type: String, default: null }
            },
            alcohol_acttivity: {
                answer: { type: Boolean, default: false },
                detail: { type: String, default: null }
            },
            congenital_disease: [
                {
                    _illnesscharid: { type: ObjectId, required: true },
                    name: { type: String, default: null, required: true }
                }
            ],
            drug_allergy: { type: String, default: null }
        },

        illness_history: [
            {
                id: { type: ObjectId, required: true },
                name: { type: String, required: true },
                answer: { type: Number, default: 2, required: true },
                detail: { type: String, default: "" }
            }
        ],

        referral: {
            referral_name: { type: String, default: null }, // ชื่อคนแนะนำ
        },

        vip_agent: {
            _agentid: { type: ObjectId, default: null } // ผู้ป่วย เลือกที่จะเจาะจงเรียกใช้บริการนักกายภาพ ชื่อ......
        },

    }

}, { collection: collectionName });


Patient_RefactorSchema.index({ '_userstoreid': 1 }, { unique: true });
Patient_RefactorSchema.index({ '_ref_storeid': 1, '_userstoreid': 1 }, { unique: true });


const Patient_RefactorModel = mongooseConn.model(collectionName, Patient_RefactorSchema);

module.exports = Patient_RefactorModel;