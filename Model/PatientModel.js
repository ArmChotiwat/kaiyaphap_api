const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

const collectionName = 'm_patients';
const patientSchema = new Schema({

    username: { type: String, required: true },
    password: { type: String, required: true },

    store: [
        {
            _storeid: { type: ObjectId, required: true }, // Object ID ร้าน
            register_from_branch: { type: ObjectId, default: null, ref: 'm_stores.branch.id' }, // ObjectId สาขา => ref: 'm_store.branch._id'
            hn: { type: String, required: true }, // รหัส HN ใหม่ <*>
            hn_ref: { type: String, default: null }, // รหัส HN เก่า ของร้าน
            userRegisterDate: { type: String, required: true }, // วันที่ลงทะเบียน <*>                    ของเก่า ยังไม่ได้ มายเกรด 

            
            create_date: { type: Date, required: true }, // ObjectDateTime วัน-เวลาที่สร้าง                วันที่ที่ถูกเปล่ยนใหม่ 
            create_date_string: { type: String, required: true }, // วันที่สร้าง (String) YYYY-MM-DD       วันที่ที่ถูกเปล่ยนใหม่ 
            create_time_string: { type: String, required: true }, // เวลาที่สร้าง (String) HH:mm:ss        วันที่ที่ถูกเปล่ยนใหม่ 
            // _ref_agent_userid_create: { type: ObjectId, required: true }, // ObjectId _id ผู้สร้าง => ref: 'm_agents._id'
            // _ref_agent_userstoreid_create: { type: ObjectId, required: true }, // ObjectId store._id ผู้สร้าง => ref: 'm_agents.store._id'

            // modify_date: { type: Date, required: true }, // ObjectDateTime วัน-เวลาที่แกไข                วันที่ที่ถูกเปล่ยนใหม่ 
            // modify_date_string: { type: String, required: true }, // วันที่แก้ไข (String) YYYY-MM-DD       วันที่ที่ถูกเปล่ยนใหม่ 
            // modify_time_string: { type: String, required: true }, // เวลาที่แก้ไข (String) HH:mm:ss        วันที่ที่ถูกเปล่ยนใหม่ 
            // _ref_agent_userid_modify: { type: ObjectId, required: true }, // ObjectId _id ผู้แก้ไขล่าสุด => ref: 'm_agents._id'
            // _ref_agent_userstoreid_modify: { type: ObjectId, required: true }, // ObjectId store._id ผู้แก้ไขล่าสุด => ref: 'm_agents.store._id'

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
                        detail: { type: String, default: null }
                    }
                ],

                referral: {
                    referral_name: { type: String, default: null }, // ชื่อคนแนะนำ
                },

                vip_agent: {
                    _agentid: { type: ObjectId, default: null } // ผู้ป่วย เลือกที่จะเจาะจงเรียกใช้บริการนักกายภาพ ชื่อ......
                },

            }
        }

    ],

}, { collection: collectionName });

patientSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

patientSchema.index({ 'store._storeid': 1, 'store.personal.identity_card.id': 1 }, { unique: false });
patientSchema.index({ 'username': 1 }, { unique: true });
patientSchema.index({ 'username': 1, 'store._storeid': 1 }, { unique: true });


const PatientModel = mongooseConn.model(collectionName, patientSchema);

module.exports = PatientModel;