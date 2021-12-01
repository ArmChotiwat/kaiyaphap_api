const caseTypeStoreController_save = async (data = { _storeid: new String, _branchid: new String }, callback = (err = new Error) => {} ) => {

  const storeModel = require('../../mongodbController').storeModel;
  const caseTypeModel = require('../../mongodbController').caseTypeModel;
  const tempCaseTypeModel = require('../../mongodbController').tempCaseTypeModel;
  const checkObjectId = require('../../mongodbController').checkObjectId;

        const currentDate = new Date();
        const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err);  } });
        const _branchid = await checkObjectId(data._branchid, (err) => { if(err) { callback(err);  } });

        const findStoreExists = await storeModel.aggregate(
            [
                {
                  '$match': {
                    '_id': _storeid, 
                    'branch._id': _branchid
                  }
                }, {
                  '$unwind': {
                    'path': '$branch'
                  }
                }, {
                  '$match': {
                    '_id': _storeid, 
                    'branch._id': _branchid
                  }
                }
            ],
            (err) => {
                if(err) { callback(err); }
            }
        );
        if(findStoreExists.length != 1) { callback(new Error(`Store/Branch Not Found`));  } // Store and Branch Must Exists
        else {
            let errdata = []
            const getTemplateCaseType = await tempCaseTypeModel.find(
                {},
                (err) => { if(err) { callback(err);  } }
            );
            const mapTemplateCaseType = getTemplateCaseType.map(
                where => ({
                    _storeid: _storeid,
                    _branchid: _branchid,

                    name: where.name,
                    prefix: where.prefix,
                    num: where.num,
                    dateAdd: currentDate,
                    dateModify: currentDate,

                    _reftid: where._id,
                    isused: true,

                    type_sub: where.type_sub.map(
                        where_s => (
                            {
                                name: where_s.name,
                                prefix: where_s.prefix,
                                num: where_s.num,
                                dateAdd: currentDate,
                                dateModify: currentDate,

                                _reftid: where_s._id,
                                isused: true
                            }
                        )
                    )
                })
            );

            for (let index = 0; index < mapTemplateCaseType.length; index++) {
                const elementCaseType = mapTemplateCaseType[index];
                const transactionSave = new caseTypeModel(elementCaseType);
                try {
                    await transactionSave.save()
                } catch (error) {
                    errdata.push(
                        {
                            caseType: elementCaseType,
                            errorDetail: error
                        }
                    );
                    callback(error);
                }
            }

            callback(null);
            return mapTemplateCaseType;
        }
        
};


const caseTypeStoreController_view = async (data = { _storeid: new String(''), _branchid: new String('') }, callback = (err = new Error) => {} ) => {
    if(typeof data != 'object') { callback(new Error(`caseTypeStoreController_view: typeof <data> must be Object`)); }
    else if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`caseTypeStoreController_view: typeof <_storeid> must be String and NOT Empty`)); return; }
    else if(typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`caseTypeStoreController_view: typeof <_branchid> must be String and NOT Empty`)); return; }
    else {
      const caseTypeModel = require('../../mongodbController').caseTypeModel;
      const checkObjectId = require('../../mongodbController').checkObjectId;

        const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
        const _branchid = await checkObjectId(data._branchid, (err) => { if(err) { callback(err); return; } });

        const findData = await caseTypeModel.aggregate(
            [
                {
                  '$match': {
                    '_storeid': _storeid, 
                    '_branchid': _branchid, 
                    'isused': true
                  }
                }, {
                  '$unwind': {
                    'path': '$type_sub'
                  }
                }, {
                  '$match': {
                    'type_sub.isused': true
                  }
                }, {
                    '$sort': {
                      'num': 1, 
                      'type_sub.num': 1
                    }
                }, {
                  '$group': {
                    '_id': {
                      '_id': '$_id', 
                      '_storeid': '$_storeid', 
                      '_branchid': '$_branchid', 
                      'num': '$num', 
                      'dateAdd': '$dateAdd', 
                      'dateModify': '$dateModify', 
                      '_reftid': '$_reftid', 
                      'isused': '$isused',
                      'name': '$name',
                      'prefix': '$prefix'
                    }, 
                    'type_sub': {
                      '$push': '$type_sub'
                    }
                  }
                }, {
                  '$project': {
                    '_id': '$_id._id', 
                    '_reftid': '$_id._reftid', 
                    '_storeid': '$_id._storeid', 
                    '_branchid': '$_id._branchid', 
                    'name': '$_id.name',
                    'prefix': '$_id.prefix',
                    'num': '$_id.num', 
                    'dateAdd': '$_id.dateAdd', 
                    'dateModify': '$_id.dateModify', 
                    'isused': '$_id.isused',
                    'type_sub': '$type_sub'
                  }
                }, {
                  '$sort': {
                    'num': 1
                  }
                }
            ],
            (err) => {
                if(err) {
                    callback(err);
                    return;
                }
            }
        );

        callback(null);
        return findData;
    }
}

module.exports = {
    caseTypeStoreController_save,
    caseTypeStoreController_view,
}
