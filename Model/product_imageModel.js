const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const productImagesSchema = new Schema({

    create_date: { type: Date, required: true }, // วันที่ และเวลาที่สร้างเอกสาร (Date/Time)
    create_date_string: { type: String, required: true }, // วันที่สร้างเอกสาร (String)
    create_time_string: { type: String, required: true }, // เวลาที่สร้างเอกสาร (String)

    _ref_productid: { type: ObjectId, required: true },
    _ref_storeid: { type: ObjectId, required: true },
    count_images : {type: Number, required: true},
    images: { type: String, required: true }

}, { collection: 'l_product_image' });

//productImagesSchema.index({ '_ref_productid': 1 }, { unique: true });
//productImagesSchema.index({ '_ref_storeid': 1 }, { unique: true });;
//productImagesSchema.index({ 'imnge': 1 }, { unique: true });;

const productImagesModel = mongooseConn.model("l_product_image", productImagesSchema);

module.exports = productImagesModel;