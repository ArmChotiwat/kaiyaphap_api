/**
 *  ระเบียนผู้จำหน่าย
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const documentName = 'm_product_vendor';
const vendorSchema = new Schema({

    _ref_storeid: { type: ObjectId, required: true },

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

    run_number_vendor:  { type: Number, required: true },

    isused: { type: Boolean, required: true }, // ปิดการใช้งาน
    istruncated: { type: Boolean, required: true }, // โดนยกเลิก โดย Imd

    vendor_name: { type: String, required: true }, // ชื่อผู้จำหน่ายสินค้า
    vendor_serial: { type: String, default: null }, // รหัสผู้จำหน่ายสินค้า

}, { collection: documentName });

vendorSchema.index({ '_ref_storeid': 1, 'vendor_name': 1 }, { unique: true });
vendorSchema.index({ '_ref_storeid': 1, 'run_number_vendor': 1 }, { unique: false });

vendorSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const vendorModel = mongooseConn.model(documentName, vendorSchema);

module.exports = vendorModel;