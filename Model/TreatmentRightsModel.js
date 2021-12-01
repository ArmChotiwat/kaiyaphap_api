/**
 *  สิทธิการรักษา
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const documentName = 'm_treatment_rights';
const treatmentRightsSchema = new Schema({

    _ref_storeid: { type: ObjectId, required: true, ref: 'm_stores' }, // Foreign Key Of <m_store>._id
    _ref_branchid: { type: ObjectId, required: true }, // Foreign Key Of <m_store>.branch._id

    _ref_ttreatment_rightid: { type: ObjectId, default: null, ref: 't_treatment_rights' }, // Foreign Key Of <t_treatment_rights>

    create_date: { type: Date, required: true },
    create_date_string: { type: String, required: true },
    create_time_string: { type: String, required: true },
    _ref_agent_userid_create: { type: ObjectId, required: true },
    _ref_agent_userstoreid_create: { type: ObjectId, required: true },

    modify_date: { type: Date, required: true },
    modify_date_string: { type: String, required: true },
    modify_time_string: { type: String, required: true },
    _ref_agent_userid_modify: { type: ObjectId, required: true },
    _ref_agent_userstoreid_modify: { type: ObjectId, required: true },

    name: { type: String, required: true }, // สิทธิการรักษา

    isused: { type: Boolean, default: true }, // เปิดใช้งาน
    istruncated: { type: Boolean, required: false }, // โดนยกเลิกโดย Imd

}, { collection: documentName });

treatmentRightsSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1 });
treatmentRightsSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, '_ref_ttreatment_rightid': 1 }, { sparse: true });
treatmentRightsSchema.index({ '_ref_storeid': 1, '_ref_branchid': 1, 'name': 1 }, { unique: true });

treatmentRightsSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const treatmentRightsModel = mongooseConn.model(documentName, treatmentRightsSchema)

module.exports = treatmentRightsModel;