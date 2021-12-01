/**
 *  Course/Package
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const documentName = 'm_course';
const courseSchema = new Schema({

    run_number: { type: Number, default: null }, // Run Number (Auto Incresement)

    name: { type: String, required: true }, // Course/Package
    _ref_course_groupid: { type: ObjectId, required: true }, // กลุ่ม Course/Package => ref: 't_course_group._id'
    price: { type: Number, default: 0 }, // ราคา Course/Package

    _ref_storeid: { type: ObjectId, required: true }, // ObjectId ร้าน => ref: 'm_store._id'
    _ref_branchid: { type: ObjectId, required: true }, // ObjectId สาขา => ref: 'm_store.branch._id'

    isused: { type: Boolean, default: true }, // เปิดใช้งาน
    istruncated : { type: Boolean, default: false }, // ปิดใช้งาน โดย Imd

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

}, { collection: documentName });

courseSchema.index({ 'name': 1, '_ref_storeid': 1, '_ref_branchid': 1 }, { unique: true });

courseSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const courseModel = mongooseConn.model(documentName, courseSchema);

module.exports = courseModel;