const reportRaw_countAgePatient = async (data = { _storeid: new String }, callback = (err = new Error) => {} ) => {
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
                    'store._storeid':  _storeid
                  }
                },{
                  '$match': {
                    '$and': [
                      {
                          'store.personal.birth_date': {
                              '$ne': ''
                          }
                      }, {
                          'store.personal.birth_date': {
                              '$ne': null
                          }
                      }
                    ]
                  }
                }, {
                  '$project': {
                    'store.personal.birth_date': 1
                  }
                }, {
                  '$addFields': {
                    'bdate': {
                      '$dateFromString': {
                        'dateString': '$store.personal.birth_date', 
                        'format': '%Y/%m/%d'
                      }
                    }
                  }
                }, {
                  '$project': {
                    'data': 0
                  }
                }, {
                  '$addFields': {
                    'byear': {
                      '$year': '$bdate'
                    }, 
                    'cyear': {
                      '$year': new Date()
                    }
                  }
                }, {
                  '$addFields': {
                    'age': {
                      '$subtract': [
                        '$cyear', '$byear'
                      ]
                    }
                  }
                }
            ]
        );
        const filterBelow20 = getReport.filter(
            where => (
                where.age < 20
            )
        );
        const filterBeetween20And29 = getReport.filter(
            where => (
                where.age >= 20 && where.age <= 29
            )
        );
        const filterBeetween30And39 = getReport.filter(
            where => (
                where.age >= 30 && where.age <= 39
            )
        );
        const filterBeetween40And49 = getReport.filter(
            where => (
                where.age >= 40 && where.age <= 49
            )
        );
        const filterBeetween50And64 = getReport.filter(
            where => (
                where.age >= 50 && where.age <= 64
            )
        );
        const filterAbove65 = getReport.filter(
            where => (
                where.age >= 65
            )
        );
        const mapData = {
            "Below20": filterBelow20.length || 0,
            "Beetween20And29": filterBeetween20And29.length || 0,
            "Beetween30And39": filterBeetween30And39.length || 0,
            "Beetween40And49": filterBeetween40And49.length || 0,
            "Beetween50And64": filterBeetween50And64.length || 0,
            "Above65": filterAbove65.length || 0
        }
        
        callback(null);
        return mapData;

    } catch (error) {
        console.error(error);
        callback(error);
        return;
    }
    
};


module.exports = reportRaw_countAgePatient;