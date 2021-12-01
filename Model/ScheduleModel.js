var momnet = require('moment')
const { mongoose, mongooseConn } = require('../Config/Engine_mongodb');
var Schema = mongoose.Schema

var scheduleSchema = new Schema({

    _storeid: { type: Schema.Types.ObjectId },
    _barnchid: { type: Schema.Types.ObjectId },
    data: [
        {
            _agentid: { type: Schema.Types.ObjectId }, // ObjectID ของ นักกายภาพ
            agentname: String, // ชื่อ นักกายภาพ
            _patientid: { type: Schema.Types.ObjectId }, // ObjectID ของ ผู้ป่วย
            patientnamge: String, // ชื่อผู้ป่วย
            detail: String, // รายละเอียด
            status: String, // สถาณะการทำงาน
            date: String, // วันที่นัด
            timeFrom: String, // เลลานัด
            timeTo: String // เลลานัด
        }
    ]
    
}, { collection: 'l_schedule' });

var scheduleModel = mongooseConn.model("l_schedule", scheduleSchema)

module.exports = scheduleModel;