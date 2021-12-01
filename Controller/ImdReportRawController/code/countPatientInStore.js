// จำนวนผู้ป่วยในระบบทั้งหมด (แยกตาม Store)
const countPatientInStoreController = async (data = {_storeid: new String}, callback = (err = new Error) => {}) => {
  const patientModel = require('../../mongodbController').patientModel;
  const checkObjectId = require('../../mongodbController').checkObjectId;
  const moment = require('moment');
  
    try {
        const _storeid = await checkObjectId(data._storeid);
        const findResult = await patientModel.aggregate(
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
              '$group': {
                '_id': {
                  '_storeid': '$store._storeid'
                }, 
                'patientCount': {
                  '$sum': 1
                }
              }
            }, {
              '$project': {
                '_id': 0, 
                '_storeid': '$_id._storeid', 
                'patientCount': '$patientCount'
              }
            }
          ]
        );
        if(findResult.length === 0) {
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


module.exports = countPatientInStoreController;