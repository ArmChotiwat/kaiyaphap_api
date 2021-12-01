// จำนวนผู้ป่วยในระบบทั้งหมดระบุตามเพศ (แยกตาม Store)
const countPatientInStoreFilterByGenderController = async (data = {_storeid: new String, getGender: 0 | 1}, callback = (err = new Error) => {}) => {
  const patientModel = require('../../mongodbController').patientModel;
  const checkObjectId = require('../../mongodbController').checkObjectId;
  const moment = require('moment');

  try {
      const _storeid = await checkObjectId(data._storeid);
      const getGender = ((data.getGender === 0 || data.getGender === 1) && typeof data.getGender == 'number') ? data.getGender:0
      const strGetGender = (getGender === 0) ? 'ชาย':'หญิง'
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
              'store._storeid': _storeid, 
              'store.personal.gender': strGetGender
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

module.exports = countPatientInStoreFilterByGenderController;