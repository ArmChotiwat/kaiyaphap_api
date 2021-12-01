const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const Schema = mongoose.Schema;

const documentName = 'm_stores';
const storeSchema = new Schema({
    name: { type: String, required: true }, // ชื่อสาขา
    email: { type: String, required: true }, // email สาขา
    phone_number: { type: String, required: true }, // เบอร์โทรศัพท์มือถือ ของร้าน
    tel_number: { type: String, default: null }, // เบอร์โทรศัพท์บ้าน ของร้าน
    image : {type: String, default: null},//รุปภาพ โลโก้ 
    address: { // ร้าน
        type: { //ที่อยู่
            buiding: { type: String, default: null }, //ตึก ของร้าน
            country: { type: String, default: null }, //ประเทศ ของร้าน
            homenumber: { type: String, default: null }, //บ้านเลขที่ ของร้าน
            province: { type: String, default: null }, //จังหวัด ของร้าน
            district: { type: String, default: null }, //เขต - อำเถอ ของร้าน
            subdistrict: { type: String, default: null }, //แขวง - ตำบล ของร้าน
            alley: { type: String, default: null }, //ซอย ของร้าน
            villagenumber: { type: Number, default: null }, //หมูที่ ของร้าน
            village: { type: String, default: null }, //หมูบ้าน ของร้าน
            postcode: { type: String, default: null }, // รหัสไปรณีย์ ของร้าน
            tax_id: { type: String, default: null }, // เลขประจำตัวผู้เสียภาษี ของร้าน
        },
        required: true
    },
    isclosed: { type: Boolean, default: false }, // ปิดร้าน
    branch: [
        { //สาขา ** 1 ร้าน จะต้องสขาหลัก
            name: { type: String, required: true }, // ชื่อสาขา
            email: { type: String, required: true }, // email สาขา
            phone_number: { type: String, required: true }, // เบอร์โทรศัพท์มือถือ ของสาขา
            tel_number: { type: String, default: null }, // เบอร์โทรศัพท์บ้าน ของสาขา
            address: {
                type: { //ที่อยู่
                    buiding: { type: String, default: null }, //ตึก ของสาขา
                    country: { type: String, default: null }, //ประเทศ ของสาขา
                    homenumber: { type: String, default: null }, //บ้านเลขที่ ของสาขา
                    province: { type: String, default: null }, //จังหวัด ของสาขา
                    district: { type: String, default: null }, //เขต - อำเถอ ของสาขา
                    subdistrict: { type: String, default: null }, //แขวง - ตำบล ของสาขา
                    alley: { type: String, default: null }, //ซอย ของสาขา
                    villagenumber: { type: Number, default: null }, //หมูที่ ของสาขา
                    village: { type: String, default: null }, //หมูบ้าน ของสาขา
                    postcode: { type: String, default: null }, // รหัสไปรณีย์ ของสาขา
                    tax_id: { type: String, default: null }, // เลขประจำตัวผู้เสียภาษี ของสาขา
                },
                required: true
            },
            isclosed: { type: Boolean, default: false } // ปิดสาขา
        }
    ]
}, { collection: documentName });

storeSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const storeModel = mongooseConn.model(documentName, storeSchema);

module.exports = storeModel;