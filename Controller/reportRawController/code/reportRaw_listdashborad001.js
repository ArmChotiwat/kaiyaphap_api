const reportRaw_listdashborad001 = async (data = { _storeid: new String }, callback = (err = new Error) => {} ) => {
  const checkObjectId = require('../../mongodbController').checkObjectId;
  const patientModel = require('../../mongodbController').patientModel;

    const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { console.error(err); callback(err); return; } })
    try {
        const getResult = await patientModel.aggregate(
            [
                {
                  '$project': {
                    'store': 1
                  }
                }, {
                  '$match': {
                    'store._storeid': _storeid
                  }
                }, {
                  '$unwind': {
                    'path': '$store'
                  }
                }, {
                  '$group': {
                    '_id': '$_id', 
                    'gender': {
                      '$push': '$store.personal.gender'
                    }
                  }
                }, {
                  '$unwind': {
                    'path': '$gender'
                  }
                }, {
                  '$group': {
                    '_id': {
                      '_genderid': '$gender'
                    }, 
                    'count': {
                      '$sum': 1
                    }
                  }
                }, {
                  '$addFields': {
                    'gender': '$_id._genderid'
                  }
                }, {
                  '$project': {
                    '_id': 0
                  }
                }
            ]
        );

        const mapArr = [];
        const male = getResult.filter(where => where.gender == 'ชาย')[0];
        const female = getResult.filter(where => where.gender == 'หญิง')[0];
        const nongender = getResult.filter(where => where.gender == null)[0] || {count: 0, gender: null};

        mapArr.push(male, nongender, female);
    
        callback(null);
        return mapArr;
    } catch (error) {
        console.error(error);
        callback(error);
        return;
    }
};

module.exports = reportRaw_listdashborad001;