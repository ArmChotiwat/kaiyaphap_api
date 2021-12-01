const reportRaw_listCountIllnessPatient = async (data = { _storeid: new String, _branchid: new String, month: new String, year: new String }, callback = (err = new Error) => {} ) => {
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const scheduleModel_Refactor = require('../../mongodbController').scheduleModel_Refactor;
    const illnessModel = require('../../mongodbController').illnessModel;

    const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { console.error(err); callback(err); return; } })
    const _branchid = await checkObjectId(data._branchid, (err) => { if(err) { console.error(err); callback(err); return; } })
    const month = data.month;
    const year = data.year;
    try {
        const illdata = await scheduleModel_Refactor.aggregate(
          [
            {
              '$match': {
                '_ref_storeid': _storeid, 
                '_ref_branchid': _branchid, 
                'status': {
                  '$nin': [
                    'ยกเลิกนัด', 'นัดหมายไว้'
                  ]
                }
              }
            }, {
              '$project': {
                '_ref_patient_userid': 1, 
                'xyear': {
                  '$year': '$dateFrom'
                }, 
                'xmonth': {
                  '$month': '$dateFrom'
                }
              }
            }, {
              '$match': {
                'xyear': parseInt(year),
                'xmonth': parseInt(month),
              }
            }, {
              '$group': {
                '_id': {
                  '_patientid': '$_ref_patient_userid', 
                  'xyear': '$xyear', 
                  'xmonth': '$xmonth'
                }
              }
            }, {
              '$lookup': {
                'from': 'm_patients', 
                'localField': '_id._patientid', 
                'foreignField': '_id', 
                'as': 'data'
              }
            }, {
              '$unwind': {
                'path': '$data'
              }
            }, {
              '$unwind': {
                'path': '$data.store'
              }
            }, {
              '$match': {
                'data.store._storeid': _storeid
              }
            }, {
              '$project': {
                'illdata': '$data.store.personal.illness_history'
              }
            }, {
              '$unwind': {
                'path': '$illdata'
              }
            }, {
              '$match': {
                'illdata.answer': 1
              }
            }, {
              '$group': {
                '_id': {
                  '_illid': '$illdata.id'
                }, 
                'count': {
                  '$sum': 1
                }
              }
            }
          ]
          );
          if(illdata.length < 0) { callback(new Error('reportRawController => reportRaw_listCountIllnessPatient: schedule Model Error')); return; }
          else {
            const fnCheckCount = (getIlldata = [], getid) => {
              const checkData = getIlldata.filter(
                x => (
                  x._id._illid.toString() == getid.toString()
                )
              );
      
              if (checkData.length === 1) {
                return checkData[0].count
              }
              else {
                return 0
              }
            }
            const illmaster = await illnessModel.find({'_storeid': _storeid});
            const mapData = illmaster.map(
              (where, mapIndex) => (
                {
                  _id: where.id,
                  name: where.name,
                  count: fnCheckCount(illdata, where.id)
                }
              )
            );
      
            callback(null);
            return mapData;
        }
    } catch (error) {
        console.error(error);
        callback(error);
        return;
    }
};

module.exports = reportRaw_listCountIllnessPatient;