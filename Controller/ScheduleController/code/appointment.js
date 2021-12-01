const findScheduleAppointmentNowToFutureController = async (data = { _storeid: new String, _branchid: new String }, callback = (err = new Error) => { }) => {
  const moment = require('moment');
  const checkObjectId = require('../../mongodbController').checkObjectId;
  const scheduleModel_Refactor = require('../../mongodbController').scheduleModel_Refactor;

  try {
    const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { throw err; } });
    const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { throw err; } });
    const date = await moment().format("YYYY-MM-DD").toString()
    const findResult = await scheduleModel_Refactor.aggregate(
      [
        {
          '$match': {
            '_ref_storeid': _storeid,
            '_ref_branchid': _branchid
          }
        }, {
          '$match': {
            'status': {
              '$ne': 'ยกเลิกนัด'
            }
          }
        }, {
          '$lookup': {
            'from': 'm_patients',
            'localField': '_ref_patient_userid',
            'foreignField': '_id',
            'as': 'patinetDetail'
          }
        }, {
          '$unwind': {
            'path': '$patinetDetail'
          }
        }, {
          '$unwind': {
            'path': '$patinetDetail.store'
          }
        }, {
          '$match': {
            'patinetDetail.store._storeid': _storeid
          }
        }, {
          '$lookup': {
            'from': 'm_agents',
            'localField': '_ref_agent_userstoreid',
            'foreignField': 'store._id',
            'as': 'agentDetail'
          }
        }, {
          '$unwind': {
            'path': '$agentDetail'
          }
        }, {
          '$unwind': {
            'path': '$agentDetail.store'
          }
        }, {
          '$match': {
            'agentDetail.store._storeid': _storeid
          }
        }, {
          '$addFields': {
            'hn': '$patinetDetail.store.hn',
            'patient_prename': '$patinetDetail.store.personal.pre_name',
            'patient_special_prename': '$patinetDetail.store.personal.special_prename',
            'agent_prename': '$agentDetail.store.personal.pre_name',
            'agent_special_prename': '$agentDetail.store.personal.special_prename',
            'agentname': {
              '$concat': [
                '$agentDetail.store.personal.first_name', ' ', '$agentDetail.store.personal.last_name'
              ]
            },
            'patientnamge': {
              '$concat': [
                '$patinetDetail.store.personal.first_name', ' ', '$patinetDetail.store.personal.last_name'
              ]
            }
            //, 'date_new': 
          }
        }, {
          '$match': {
            'dateFrom_string': {
              '$gte': date
            }
          }
        }, {
          '$sort': {
            'dateFrom_string': 1
          }
        }, {
          '$group': {
            '_id': {
              '_id': '$_id',
              '_storeid': '$_ref_storeid',
              '_barnchid': '$_ref_branchid'
            },
            'data': {
              '$push': {
                '_id': '$_id',
                '_agentid': '$_ref_agent_userid',
                'agentname': '$agentname',
                '_patientid': '$_ref_patient_userid',
                'patientnamge': '$patientnamge',
                'detail': '$detail',
                'status': '$status',
                'date': '$dateFrom_string',
                'timeFrom': '$timeFrom_string',
                'timeTo': '$timeTo_string',
                'hn': '$hn',
                'patient_prename': '$patient_prename',
                'patient_special_prename': '$patient_special_prename',
                'agent_prename': '$agent_prename',
                'agent_special_prename': '$agent_special_prename'
              }
            }
          }
        }, {
          '$project': {
            '_id': 0,
            '_storeid': '$_id._storeid',
            '_barnchid': '$_id._barnchid',
            'data': '$data'
          }
        }
      ],
      (err) => { if (err) { throw err; } }
    );

    for (let index = 0; index < findResult.length; index++) {
        findResult[index].data = findResult[index].data[0];       
    }    
    findResult.sort((a, b) => (a.data.date > b.data.date) ? 1 : (a.data.date === b.data.date) ? ((a.data.timeFrom > b.data.timeFrom) ? 1 : -1) : -1);        
    if (findResult.length === 0) {
      callback(null);
      return;
    }
    else {
      callback(null);
      return findResult;
    }
  } catch (error) {
    callback(error);
    return;
  }
};

module.exports = {
  findScheduleAppointmentNowToFutureController,
};