const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const collectionName = 'm_agents';
const agentSchema = new Schema(
    {

        username: { type: String, required: true },
        password: { type: String, required: true },
        isclosed: { type: Boolean, default: false }, // สำหรับ Ban - Agent User ให้ Login ไม่ได้

        store: [
            {
                _storeid: { type: ObjectId, required: true }, // Object ID ร้าน
                branch: [
                    {
                        _branchid: { type: ObjectId, required: true }, // Object ID สำขา ---- ถ้าไม่มีสาขาให้ใช้ Object ID ร้าน
                    }
                ],
                role: { type: Number, required: true }, // ตำแหน่ง 1 เป็น Admin --- ตำแหน่ง 2 เป็น นักกายภาพ
                roleAdminViewOnly: { type: Boolean, default: false }, // ตำแหน่ง ธุรการ เป็น Admin ถ้าใช่ คื่อ true ถ้าไม่ใช้ คื่อ false 
                userRegisterDate: { type: String, required: true }, // วันที่ลงทะเบียน
                avatarUrl: { type: String, default: null }, // รูป โปรไฟล์
                email: { type: String, required: true }, // Email
                user_status: { type: Boolean, default: true }, //สถาณะยูสเซอร์
                personal: { //ข้อมูลส่วนตัว
                    pre_name: { type: String, required: true }, //คำนำหน้า
                    special_prename: { type: String, default: null }, //คำนำหน้า หากเลือกอื่น ๆ
                    first_name: { type: String, required: true }, //ชื่อจริง
                    last_name: { type: String, required: true }, //นามสกุล
                    gender: { type: String, required: true },
                    birth_date: { type: String, required: true },
                    telephone_number: { type: String, default: null },
                    phone_number: { type: String, default: null },
                    identity_card: { // เลขบัตร ประชาชน/พาสปอร์ต
                        ctype: { type: Boolean, default: true }, // citicen_id = true or passport_id = false
                        id:  { type: String, required: true },
                    },
                    address: { // ที่อยู่
                        country: { type: String, default: null }, // ประเทศ
                        homenumber: { type: String, required: true }, // บ้านเลขที่
                        province: { type: String, required: true }, // จังหวัด
                        district: { type: String, required: true }, // เขต - อำเถอ
                        subdistrict: { type: String, required: true }, // แขวง - ตำบล
                        alley: { type: String, default: null  }, // ซอย
                        village_number: { type: Number, default: null  }, // หมูที่
                        village: { type: String, default: null  }, // หมูบ้าน
                        building: { type: String, default: null  }, // อาคาร
                        postcode: { type: String, required: true } // รหัสไปรณีย์
                    },
                    educated_histroy: [ // ประวัติวิชาชีพ การศึกษา
                        {
                            deegree: { type: String, required: true }, // วุฒิ การศึกษา
                            faculty: { type: String, required: true }, // สาขาวิชา การศึกษา
                            educatedYear: { type: String, required: true }, //ปี การศึกษา
                            university: { type: String, required: true }, // มหาวิทยาลัย การศึกษา
                        }
                    ],
                    certificate: {
                        certificatedCode: { type: String, default: null },
                        certificatedExpired: { type: String, default: null },
                    },
                    work_expriance: [
                        {
                            location: { type: String, required: true }, // สถาณที่
                            year: { type: String, default: null }, // ปี
                            description: { type: String, default: null } // บรรยาย
                        }
                    ],
                    pflevel: { type: String, default: null }, //อาชีพ
                    skill: [ { type: String, default: null } ], //ความชำนาญ
                }
            }
        ]
    },
    { collection: collectionName }
);

agentSchema.index({ 'username': 1 }, { unique: true });
agentSchema.index({ 'username': 1, 'store._storeid': 1 }, { unique: true });

agentSchema.index({ 'store._storeid': 1 }, { sparse: true });
agentSchema.index({ 'store._storeid': 1, 'store.branch._branchid': 1 }, { });

const AgentModel = mongooseConn.model(collectionName, agentSchema);

module.exports = AgentModel;