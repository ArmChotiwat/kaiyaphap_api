const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const casePatientStage2Schema = new Schema({

    _ref_casepatinetid: { type: ObjectId, required: true, ref: 'l_casepatient' },

    create_date: { type: Date, required: true },
    create_date_string: { type: String, required: true },
    create_time_string: { type: String, required: true },

    modify_date: { type: Date, required: true },
    modify_date_string: { type: String, required: true },
    modify_time_string: { type: String, required: true },

    stage2data: {
        type: {
            current_history: { type: String, default: null },
            important_symptoms: { type: String, default: null },
            body_chart: [
                {
                    body_name: { type: String, required: true },
                    pain: { type: String, default: null },
                    pain_point: { type: Boolean, default: null },
                    pain_point_data: {
                        px: { type: String, default: null },
                        py: { type: String, default: null },
                    },
                    numbness: { type: String, default: null },
                    continuation: { type: String, default: null },
                    depth: { type: String, default: null },
                    strength: { type: String, default: null },
                    pain_scale: { type: Number, default: 0 },
                    aggrevate: { type: String, default: null },
                    ease: { type: String, default: null },
                    am: { type: String, default: null },
                    pm: { type: String, default: null },
                    night: { type: String, default: null }
                }
            ],
            type_scan: { type: String, default: null },
            data_body_chart_active: [
                {
                    name: { type: String, required: true },
                    class: { type: String, required: true }
                }
            ],
            inputfile_image: [
                {
                    name: { type: String, default: null }
                }
            ]
        },
        default: null

    },
    stage2data_neuro: {
        type: {
            hemi: { type: String, default: null },
            para: {
                type: {
                    indexMotorAll: { type: Number, default: null },
                    indexMotorLeft: { type: Number, default: null },
                    indexMotorRight: { type: Number, default: null },
                    indexSensoryAll: { type: Number, default: null },
                    indexSensoryLeft: { type: Number, default: null },
                    indexSensoryRight: { type: Number, default: null },
                }, // 
                default: null
            },
            full: { type: String, default: null },
            description: { type: String, default: null },
            formData: {
                fall: { type: String, required: true }, // ประวัติการหกล้ม มี ไม่มี ไม่ระบุ
                numberFall: { type: Number, default: null }, // จำนวนครั้ง
                lastFall: { type: String, default: null }, // ล้มครั้งล่าสุดเมื่อวันที่
                stay: { type: String, default: null }, // พักอาศัยอยู่
                careTaker: { type: String, default: null }, // ผู้ดูแลหลัก
                houseStyle: { type: Number, required: true }, // ลักษณะบ้าน 0 1 2 3 4 5 6 
                bathroomStyle: { // ลักษณะและสถานที่ห้องน้ำ
                    position: { type: String, required: true }, // none or  inside or outside
                    type: { type: String, required: true }, // none or seat or squatting
                    handrail: { type: String, required: true }, //none or yes or no
                },
                OtherEnvironment: { type: String, default: null }, // สภาพแวดล้อมอื่นๆ
                mentalAndSocialState: { // สภาพแวดล้อมอื่นๆ
                    type: { type: String, required: true },//none good or notgood
                    text: { type: String, default: null },
                },
            },          
            type_scan: { type: String, default: null },  
            inputfile_image: [
                {
                    name: { type: String, default: null }
                }
            ]
        },
        default: null
    }

}, { collection: 'l_casepatient_stage_2' });

casePatientStage2Schema.index({ '_ref_casepatinetid': 1 }, { unique: true }); // One Case - One Stage2

const casePatientStage2Model = mongooseConn.model("l_casepatient_stage_2", casePatientStage2Schema);

module.exports = casePatientStage2Model;
