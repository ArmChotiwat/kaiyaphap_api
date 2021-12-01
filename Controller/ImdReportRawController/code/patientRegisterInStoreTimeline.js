// จำนวนผู้ป่วยที่ลงทะเบียนในเดือนนี้ (แยกตาม Store)
const patientRegisterInStoreTimelineController = async (data = {_storeid: new String, getDate: new String | new Date() }, callback = (err = new Error) => {}) => {
  const patientModel = require('../../mongodbController').patientModel;
  const checkObjectId = require('../../mongodbController').checkObjectId;
  const moment = require('moment');

    try {
        const _storeid = await checkObjectId(data._storeid);
        const getDate = moment(data.getDate).format("YYYY-MM-DD");
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
                  '$addFields': {
                    'rdate': {
                      '$dateFromString': {
                        'dateString': '$store.userRegisterDate', 
                        'format': '%Y-%m-%d'
                      }
                    }
                  }
                }, {
                  '$addFields': {
                    'result': {
                      '$and': [
                        {
                          '$eq': [
                            {
                              '$year': new Date(getDate)
                            }, {
                              '$year': '$rdate'
                            }
                          ]
                        }, {
                          '$eq': [
                            {
                              '$month': new Date(getDate)
                            }, {
                              '$month': '$rdate'
                            }
                          ]
                        }
                      ]
                    }
                  }
                }, {
                  '$match': {
                    'result': {
                      '$eq': true
                    }
                  }
                }, {
                  '$group': {
                    '_id': '$rdate', 
                    'registerPatientCount': {
                      '$sum': 1
                    }
                  }
                }
            ]
        );
        if(findResult.length === 0) {
            callback(null);
            return;
        }
        else {
            const mapData = findResult.map(
                (where, index) => ({
                    'rdate': moment(where._id).format("YYYY-MM-DD").toString(),
                    'registerPatientCount': where.registerPatientCount
                })
            );
            callback(null);
            return mapData;
        }
    } catch (error) {
        callback(error);
        return;
    }
};


module.exports = patientRegisterInStoreTimelineController;