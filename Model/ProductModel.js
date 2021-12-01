/**
 *  ระเบียนสินค้า
 */
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const documentName = 'm_product';
const productSchema = new Schema({

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

    run_number_product:  { type: Number, default: null },

    isused: { type: Boolean, required: true }, // ปิดการใช้งาน
    istruncated: { type: Boolean, required: true }, // โดนยกเลิก โดย Imd

    product_name: { type: String, required: true }, // ชื่อสินค้า
    product_serial: { type: String, default: null }, // รหัสสินค้า
    product_category : { type: String, default: null }, // ประเภทสินค้า 
    product_brand: { type: String, default: null }, // ยี่ห้องสินค้า
    product_main_version: { type: String, default: null }, // รุ่นสินค้า
    product_sub_version: { type: String, default: null }, // รุ่นย่อยสินค้า
    _ref_product_groupid : { type: ObjectId, default: null }, // กลุ่มสินค้า ref: <m_product_group._id>

}, { collection: documentName });

productSchema.index({ '_ref_storeid': 1, 'product_name': 1 }, { unique: true });
// productSchema.index({ '_ref_storeid': 1, 'run_number_product': 1 }, { unique: false });

productSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const productModel = mongooseConn.model(documentName, productSchema);

module.exports = productModel;