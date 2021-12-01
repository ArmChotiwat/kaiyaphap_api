/**
 *  Treatment (รายละเอียด ใบจ่ายยา)
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const documentName = 'l_billing_contract';
const billingDetailSchema = new Schema({

    run_number: { type: Number, default: null }, // Run Number (Auto Incresement)

    _ref_billingid: { type: ObjectId, required: true, ref: 'l_billing' },
    _ref_casepatinetid: { type: ObjectId, default: null, ref: 'l_casepatient' },
    _ref_casepatinetid: { type: ObjectId, default: null, ref: 'l_treatment' },

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

    patient_data: { // ref: m_patient.store
        type: {
            _storeid: { type: Schema.Types.ObjectId, required: true }, // Object ID ร้าน
            hn: { type: String, required: true }, // รหัส HN ใหม่ <*>
            hn_ref: { type: String, default: null }, // รหัส HN เก่า ของร้าน
            userRegisterDate: { type: String, required: true }, // วันที่ลงทะเบียน <*>
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
                birth_date: { type: String, default: null },
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
                            _illnesscharid: { type: Schema.Types.ObjectId, required: true },
                            name: { type: String, default: null, required: true }
                        }
                    ],
                    drug_allergy: { type: String, default: null }
                },

                illness_history: [
                    {
                        id: { type: Schema.Types.ObjectId, required: true },
                        name: { type: String, required: true },
                        answer: { type: Number, default: 2, required: true },
                        detail: { type: String, default: "" }
                    }
                ],

                referral: {
                    referral_name: { type: String, default: null }, // ชื่อคนแนะนำ
                },

                vip_agent: {
                    _agentid: { type: Schema.Types.ObjectId, default: null } // ผู้ป่วย เลือกที่จะเจาะจงเรียกใช้บริการนักกายภาพ ชื่อ......
                },

            }
        },
        default: null
    },

    agent_data: { // ref: m_agent.store
        type: {
            _storeid: { type: Schema.Types.ObjectId }, // Object ID ร้าน
            branch: [
                {
                    _branchid: { type: Schema.Types.ObjectId }, // Object ID สำขา ---- ถ้าไม่มีสาขาให้ใช้ Object ID ร้าน
                }
            ],
            role: Number, // ตำแหน่ง 1 เป็น Admin --- ตำแหน่ง 2 เป็น นักกายภาพ
            userRegisterDate: String, // วันที่ลงทะเบียน
            avatarUrl: String, // รูป โปรไฟล์
            email: String, // Email
            user_status: Boolean, //สถาณะยูสเซอร์
            personal: { //ข้อมูลส่วนตัว
                pre_name: String, //คำนำหน้า
                special_prename: String, //คำนำหน้า หากเลือกอื่น ๆ
                first_name: String, //ชื่อจริง
                last_name: String, //นามสกุล
                gender: String,
                birth_date: String,
                telephone_number: String,
                phone_number: String,
                identity_card: { // เลขบัตร ประชาชน/พาสปอร์ต
                    ctype: { type: Boolean, default: true }, // citicen_id = true or passport_id = false
                    id: String,
                },
                address: { //ที่อยู่
                    country: String, //ประเทศ
                    homenumber: String, //บ้านเลขที่
                    province: String, //จังหวัด
                    district: String, //เขต - อำเถอ
                    subdistrict: String, //แขวง - ตำบล
                    alley: String, //ซอย
                    village_number: Number, //หมูที่
                    village: String, //หมูบ้าน
                    building: String, //อาคาร
                    postcode: String //รหัสไปรณีย์
                },
                educated_histroy: [
                    {
                        deegree: String, //วุธการศึกษา
                        faculty: String, //สานาการศึกษา
                        educatedYear: String, //ปีการศึกษา
                        university: String, //มหาวิทยาลัย
                    }
                ],
                certificate: {
                    certificatedCode: String,
                    certificatedExpired: String,
                },
                work_expriance: [
                    {
                        location: String, // สถาณที่
                        year: String, // ปี
                        description: String // บรรยาย
                    }
                ],
                pflevel: String, //อาชีพ
                skill: [], //ความชำนาญ
            }
        },
        default: null
    },

}, { collection: documentName });


billingDetailSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const billingDetailModel = mongooseConn.model(documentName, billingDetailSchema);

module.exports = billingDetailModel;