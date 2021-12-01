/**
 *  สิทธิการรักษา (Imd Template)
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const documentName = 't_treatment_rights';
const tempTreatmentRightsSchema = new Schema({

    name: { type: String, required: true }, // สิทธิการรักษา

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

    isused: { type: Boolean, default: true }, // เปิดใช้งาน

}, { collection: documentName });

tempTreatmentRightsSchema.index({ 'name': 1 }, { unique: true });

const tempTreatmentRightsModel = mongooseConn.model(documentName, tempTreatmentRightsSchema)

module.exports = tempTreatmentRightsModel;