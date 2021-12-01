const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const ObjectId = mongoose.Types.ObjectId;

const AutoIncrementCasePatientStoreSchema = new mongoose.Schema({
    _storeid: { type: ObjectId, required: true },
    seq: { type: Number, default: 0 }
}, { collection: 'ai_product_store' });

AutoIncrementCasePatientStoreSchema.plugin(AutoIncrement, { id: 'product_store_runner', reference_fields: ['_storeid'], inc_field: 'seq', collection_name: 'ai_product_store_runner', inc_amount: 1 });

const AutoIncrementCasePatientStoreModel = mongooseConn.model('ai_product_store', AutoIncrementCasePatientStoreSchema);

module.exports = AutoIncrementCasePatientStoreModel;