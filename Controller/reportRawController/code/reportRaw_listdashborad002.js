const reportRaw_listdashborad002 = async (data = { _storeid: new String }, callback = (err = new Error) => {} ) => {
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
                  '$project': {
                    'data.agent': 0
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
                    'IllnessDataGroup': {
                      '$push': '$store.personal.illness_history'
                    }
                  }
                }, {
                  '$unwind': {
                    'path': '$IllnessDataGroup'
                  }
                }, {
                  '$unwind': {
                    'path': '$IllnessDataGroup'
                  }
                }, {
                  '$project': {
                    '_id': 0
                  }
                }, {
                  '$group': {
                    '_id': {
                      '_illnessID': '$IllnessDataGroup.id', 
                      '_illnessName': '$IllnessDataGroup.name'
                    }, 
                    'count': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              {
                                '$toInt': '$IllnessDataGroup.answer'
                              }, 1
                            ]
                          }, 1, 0
                        ]
                      }
                    }
                  }
                }
              ]
        );

        callback(null);
        return getReport;

    } catch (error) {
        console.error(error);
        callback(error);
        return;
    }
};



module.exports = reportRaw_listdashborad002;