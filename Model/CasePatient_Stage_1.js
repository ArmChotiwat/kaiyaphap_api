const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const casePatientStage1Schema = new Schema({

    _ref_casepatinetid: { type: ObjectId, required: true, ref: 'l_casepatient' },

    create_date: { type: Date, required: true },
    create_date_string: { type: String, required: true },
    create_time_string: { type: String, required: true },

    modify_date: { type: Date, required: true },
    modify_date_string: { type: String, required: true },
    modify_time_string: { type: String, required: true },

    lastest_treatment_date: { type: Date, default: null },
    lastest_treatment_date_string: { type: String, default: null },
    lastest_treatment_time_string: { type: String, default: null },

    stage1data: {

        medicine_take:[
           {
                group: { type: String, default: null },
                detail: { type: String, default: null },
           }
        ],

        injury_history: {
            flag: { type: Boolean, required: true, default: false },
            name: { type: String, default: null }
        },

        physical_examination: {
            flag: { type: Boolean, required: true, default: false },
            group: [
                { type: String, required: true }
            ],
        },

        surgery_history: {
            flag: { type: Boolean, required: true, default: false },
            type: { type: String, default: null },
            name: { type: String, default: null }
        },

        caution: { type: String, default: null },


        congenital_disease:[
           {
                _ref_illnesscharid: { type: ObjectId, required: true, ref: 'm_illnesscharactics' },
                name: { type: String, required: true },
           }
        ],

        drug_allergy: { type: String, default: null }, 

        illness_history: [
            {
                _ref_illnessid: { type: ObjectId, required: true, ref: 'm_illnesses' },
                name: { type: String, required: true  },
                answer: { type: Number, required: true, default: 2  },
                detail: { type: String, default: null }
            }
        ]
    }     
    
}, { collection: 'l_casepatient_stage_1' });

casePatientStage1Schema.index({ '_ref_casepatinetid': 1 }, { unique: true }); // One Case - One Stage1

const casePatientStage1Model = mongooseConn.model("l_casepatient_stage_1", casePatientStage1Schema);

module.exports = casePatientStage1Model;