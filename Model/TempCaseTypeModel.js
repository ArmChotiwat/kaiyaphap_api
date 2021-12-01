const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const tempcaseTypeSchema = new Schema({
    name: { type: String, required: true },
    prefix: { type: String, required: true },
    num: { type: Number, required: true },
    dateAdd: { type: Date, required: true },
    dateModify: { type: Date, required: true },
    type_sub: [
        {
            name: { type: String, required: true },
            prefix: { type: String, required: true },
            num: { type: Number, required: true },
            dateAdd: { type: Date, required: true },
            dateModify: { type: Date, required: true },
        }
    ]
}, { collection: 't_casetype' });

tempcaseTypeSchema.index({ 'name': 1 }, { unique: true });
tempcaseTypeSchema.index({ 'prefix': 1 }, { unique: true });
tempcaseTypeSchema.index({ 'num': 1 }, { unique: true });

tempcaseTypeSchema.index({ 'type_sub.name': 1 }, { unique: true, sparse: true });
tempcaseTypeSchema.index({ 'type_sub.prefix': 1 }, { unique: true, sparse: true });
tempcaseTypeSchema.index({ 'name': 1, 'type_sub.num': 1 }, { unique: true });

const tepCaseTypeModel = mongooseConn.model("t_casetype", tempcaseTypeSchema);

module.exports = tepCaseTypeModel;