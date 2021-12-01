const reportRaw_listCountPatient = async (data = { _storeid: new String }, callback = (err = new Error) => {} ) => {
  const checkObjectId = require('../../mongodbController').checkObjectId;
  const patientModel = require('../../mongodbController').patientModel;

    const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { console.error(err); callback(err); return; } });
    try {
        const getReport = await patientModel.aggregate(
            [
              {
                '$match': {
                  'store._storeid': _storeid
                }
              }, {
                '$unwind': {
                  'path': '$store'
                }
              }, {
                '$match': {
                  'store._storeid': _storeid
                }
              }, {
                '$count': 'patientCount'
              }
            ]
        );
          
        callback(null);
        return getReport[0] || { patientCount: 0 };
        
    } catch (error) {
        console.error(error);
        callback(error);
        return;
    }
};


module.exports = reportRaw_listCountPatient;