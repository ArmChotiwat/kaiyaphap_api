const checkPatientId = async (
  data = {
    _storeid: new String(''),
    _patientid: new String('')
  },
  callback = (err = new Error) => { }
) => {
  const mongodbController = require('../../mongodbController');
  const patientModel = mongodbController.patientModel;
  const checkObjectId = mongodbController.checkObjectId;

  if (typeof data != 'object') { callback(new Error(`checkPatientId: <data> must be Object`)); return; }
  else if (typeof data._storeid != 'string') { callback(new Error(`checkPatientId: <data._storeid> must be String and Not Empty`)); return; }
  else if (typeof data._patientid != 'string') { callback(new Error(`checkPatientId: <data._patientid> must be String and Not Empty`)); return; }
  else {
    const _patientid = await checkObjectId(data._patientid, (err) => { if (err) { callback(err); return; } });
    const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });

    const findPatient_Logic1 = await patientModel.aggregate(
      [
        {
          '$match': {
            '_id': _patientid,
            'store._storeid': _storeid,
            'store.user_status': true
          }
        }, {
          '$unwind': {
            'path': '$store'
          }
        }, {
          '$match': {
            '_id': _patientid,
            'store._storeid': _storeid,
            'store.user_status': true
          }
        }
      ],
      (err) => { if (err) { callback(err); return; } }
    );

    if (findPatient_Logic1 && findPatient_Logic1.length === 1) {
      const mapData = {
        _patientid: new mongodbController.mongoose.Types.ObjectId(findPatient_Logic1[0]._id),
        _patientstoreid: new mongodbController.mongoose.Types.ObjectId(findPatient_Logic1[0].store._id),
        _storeid: new mongodbController.mongoose.Types.ObjectId(findPatient_Logic1[0].store._storeid)
      }
      callback(null);
      return mapData;
    }
    else if (findPatient_Logic1 && findPatient_Logic1.length === 0) {
      const findPatient_Logic2 = await patientModel.aggregate(
        [
          {
            '$match': {
              'store._id': _patientid,
              'store._storeid': _storeid,
              'store.user_status': true
            }
          }, {
            '$unwind': {
              'path': '$store'
            }
          }, {
            '$match': {
              'store._id': _patientid,
              'store._storeid': _storeid,
              'store.user_status': true
            }
          }
        ],
        (err) => { if (err) { callback(err); return; } }
      );

      if (findPatient_Logic2 && findPatient_Logic2.length === 1) {
        const mapData = {
          _patientid: new mongodbController.mongoose.Types.ObjectId(findPatient_Logic2[0]._id),
          _patientstoreid: new mongodbController.mongoose.Types.ObjectId(findPatient_Logic2[0].store._id),
          _storeid: new mongodbController.mongoose.Types.ObjectId(findPatient_Logic2[0].store._storeid),
        }
        callback(null);
        return mapData;
      }
      else { callback(null); return; }
    }
    else { callback(null); return; }

  }

};

module.exports = checkPatientId;
