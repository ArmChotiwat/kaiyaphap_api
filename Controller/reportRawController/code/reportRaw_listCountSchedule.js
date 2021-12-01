const reportRaw_listCountSchedule = async (data = { _storeid: new String, _branchid: new String }, callback = (err = new Error) => {} ) => {
  const checkObjectId = require('../../mongodbController').checkObjectId;
  const scheduleModel_Refactor = require('../../mongodbController').scheduleModel_Refactor;

    const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { console.error(err); callback(err); return; } });
    const _branchid = await checkObjectId(data._branchid, (err) => { if(err) { console.error(err); callback(err); return; } });
    try {
      const getReport = await scheduleModel_Refactor.aggregate(
        [
          {
            '$match': {
              '_ref_storeid': _storeid,
              'status': {
                '$eq': 'ยกเลิกนัด'
              }
            }
          }, {
            '$group': {
              '_id': '$_ref_storeid',
              'scheduleFinishedCount': {
                '$sum': 1
              }
            }
          }
        ], (err) => { if (err) { callback(err); return; } }
      );
  
  
      if (getReport.length === 0) {
        callback(null);
        return { scheduleFinishedCount: 0 }
      } else {
        callback(null);
        return { scheduleFinishedCount: getReport[0].scheduleFinishedCount }
      }

    } catch (error) {
        console.error(error);
        callback(error);
        return;
    }
};


module.exports = reportRaw_listCountSchedule;