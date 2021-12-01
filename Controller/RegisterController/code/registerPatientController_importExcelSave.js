const registerPatientController_importExcelSave = async (payload = new Object, callback = (err = new Error) => { }) => {
    if (typeof payload != 'object') { callback(new Error('payload is not Object')); return; }
    else if (typeof payload.store != 'object' && payload.store.length != 1) { callback(new Error('payload.store is not Array and length of store must 1')); return; }
    else if (typeof payload.store[0]._storeid != 'string' || payload.store[0]._storeid == '') { callback(new Error('payload.store._storeid is not String nad not Empty')); return; }
    else if (typeof payload.username != 'string' || payload.username == '') { callback(new Error('payload.username is not String nad not Empty')); return; }
    else {
      const moment = require('moment');
      const checkObjectId = require('../../mongodbController').checkObjectId;
      const ObjectId = require('../../mongodbController').ObjectId;
      const patientModel = require('../../mongodbController').patientModel;
  
      const currentDateTime = require('../../miscController').currentDateTime();
  
      await checkObjectId(payload.store[0]._storeid, (err) => { if (err) { callback(err); return; } });
      payload.store[0].personal.birth_date = (typeof payload.store[0].personal.birth_date != 'string') ? null : _replaceBitrhDay(payload.store[0].personal.birth_date);
      payload.username = payload.username.replace(new RegExp('-', 'ig'), '').replace(new RegExp(' ', 'ig'), '')
      const findUsernameExists = await patientModel.aggregate([
        {
          '$match': {
            'username': payload.username
          }
        }
      ]);
      if (findUsernameExists.length === 0) {
        const registerPatientController_AutoIncresement = require('../index').registerPatientController.registerPatientController_AutoIncresement;
        const ai = await registerPatientController_AutoIncresement({ _storeid: payload.store[0]._storeid, personal_idcard: payload.username }, (err) => { if (err) { callback(err); return; } });
        payload.store[0].hn = _zeroFill(parseInt(ai.seq), 6);
        payload.store[0].userRegisterDate = moment().format('YYYY-MM-DD');
        payload.store[0].create_date = currentDateTime.currentDateTime_Object;
        payload.store[0].create_date_string = currentDateTime.currentDate_String;
        payload.store[0].create_time_string = currentDateTime.currentTime_String;
        payload.store[0].register_from_branch = await checkObjectId(payload.store[0].register_from_branch, (err) => { if (err) { callback(err); return; } });
  
        const transactionSaveModel = new patientModel(payload);
        const result_data = await transactionSaveModel.save()
          .then(
            (result) => { return result; }
          )
          .catch(
            (err) => { callback(err); return; }
          );
  
        callback(null);
        return result_data;
      }
      else if (findUsernameExists.length === 1) {
        const checkStoreExists = await patientModel.aggregate(
          [
            {
              '$match': {
                'username': payload.username
              }
            }, {
              '$match': {
                'store._storeid': ObjectId(payload.store[0]._storeid)
              }
            }, {
              '$unwind': {
                'path': '$store'
              }
            }, {
              '$match': {
                'store._storeid': ObjectId(payload.store[0]._storeid)
              }
            }
          ]
        );
        if (checkStoreExists.length === 0) {
          const registerPatientController_AutoIncresement = require('../index').registerPatientController.registerPatientController_AutoIncresement;
          const ai = await registerPatientController_AutoIncresement({ _storeid: payload.store[0]._storeid, personal_idcard: payload.username }, (err) => { if (err) { callback(err); return; } });
          payload.store[0].hn = _zeroFill(parseInt(ai.seq), 6);
          payload.store[0].userRegisterDate = moment().format('YYYY-MM-DD');
          payload.store[0].create_date = currentDateTime.currentDateTime_Object;
          payload.store[0].create_date_string = currentDateTime.currentDate_String;
          payload.store[0].create_time_string = currentDateTime.currentTime_String;
          payload.store[0].register_from_branch = await checkObjectId(payload.store[0].register_from_branch, (err) => { if (err) { callback(err); return; } });
  
          const transactionUpdate = await patientModel.findByIdAndUpdate(
            findUsernameExists[0]._id,
            {
              $addToSet: { 'store': payload.store[0] }
            },
            (err) => { if (err) { callback(err); return; } }
          );
          callback(null);
          return;
        }
        else {
          callback(new Error('registerPatientController_importExcelSave: Have Problem due length of [checkStoreExists] from aggregate more than 0'));
          return;
        }
      }
      else {
        callback(new Error('registerPatientController_importExcelSave: Have Problem due length of [findUsernameExists] from aggregate more than 0'));
        return;
      }
    }
  };
  module.exports = registerPatientController_importExcelSave