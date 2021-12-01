const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const caseTypeSchema = new Schema({
    _storeid: { type: ObjectId, required: true },
    _branchid: { type: ObjectId, required: true },

    name: { type: String, required: true },
    prefix: { type: String, required: true },
    num: { type: Number, required: true },
    dateAdd: { type: Date, required: true },
    dateModify: { type: Date, required: true },

    _reftid: { type: ObjectId, required: true },
    isused: { type: Boolean, required: true },
    
    type_sub: [
        {
            name: { type: String, required: true },
            prefix: { type: String, required: true },
            num: { type: Number, required: true },
            dateAdd: { type: Date, required: true },
            dateModify: { type: Date, required: true },

            _reftid: { type: ObjectId, required: true },
            isused: { type: Boolean, required: true },
        }
    ]
}, { collection: 'm_casetype' });

caseTypeSchema.index({ '_storeid': 1, '_branchid': 1, '_reftid': 1 }, { unique: true });
caseTypeSchema.index({ '_storeid': 1, '_branchid': 1, 'type_sub._reftid': 1 }, { unique: true });

caseTypeSchema.index({ '_storeid': 1, '_branchid': 1, 'name': 1 }, { unique: true });
caseTypeSchema.index({ '_storeid': 1, '_branchid': 1, 'prefix': 1 }, { unique: true });
caseTypeSchema.index({ '_storeid': 1, '_branchid': 1, 'num': 1 }, { unique: true });

caseTypeSchema.index({ '_storeid': 1, '_branchid': 1, 'type_sub.name': 1 }, { unique: true, sparse: true });
caseTypeSchema.index({ '_storeid': 1, '_branchid': 1, 'type_sub.prefix': 1 }, { unique: true, sparse: true });
caseTypeSchema.index({ '_storeid': 1, '_branchid': 1, 'name': 1, 'type_sub.num': 1 }, { unique: true });

caseTypeSchema.plugin(updateIfCurrentPlugin, { strategy: "version" });

const caseTypeModel = mongooseConn.model("m_casetype", caseTypeSchema);

module.exports = caseTypeModel;