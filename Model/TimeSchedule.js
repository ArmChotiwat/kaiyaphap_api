const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
var Schema = mongoose.Schema

var timescheduleSchema = new Schema({

    _storeid: {type: Schema.Types.ObjectId},
    _branchid: {type: Schema.Types.ObjectId},
    data: [
        {
            timeFrom: String,
            timeTo: String
        }
    ]

}, { collection: 'm_timeschedule' });

var timescheduleModel = mongooseConn.model("m_timeschedule", timescheduleSchema)

module.exports = timescheduleModel;