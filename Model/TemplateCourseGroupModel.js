/**
 *  กลุ่ม Course/Package ของ Treatment (Imd Template)
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const documentName = 't_course_group';
const tempCourseGroupSchema = new Schema({

    name: { type: String, required: true }, // กลุ่ม Course/Package ของ Treatment

    run_number: { type: Number, default: null },

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

    isused: { type: Boolean, default: false }, // เปิดใช้งาน

}, { collection: documentName });

tempCourseGroupSchema.index({ 'name': 1 }, { unique: true });

tempCourseGroupSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const tempCourseGroupModel = mongooseConn.model(documentName, tempCourseGroupSchema)

module.exports = tempCourseGroupModel;