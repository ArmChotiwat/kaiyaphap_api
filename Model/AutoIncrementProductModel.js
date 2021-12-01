const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const ObjectId = mongoose.Types.ObjectId;

const AutoIncrementProductSchema = new mongoose.Schema({
    _storeid: { type: ObjectId, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    seq: { type: Number, default: 0 }
}, { collection: 'ai_product' });

AutoIncrementProductSchema.plugin(AutoIncrement, { id: 'product_runner', reference_fields: ['_storeid'], inc_field: 'seq', collection_name: 'ai_product_runner', inc_amount: 1 });

const AutoIncrementProductModel = mongooseConn.model('ai_product', AutoIncrementProductSchema);

module.exports = AutoIncrementProductModel;