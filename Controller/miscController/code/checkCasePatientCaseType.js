const checkCasePatientCaseType = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _patientid: new String(''),
        _casepatientid: new String(''),
    },
    callback = (err = new Err) => {}
    ) => {
        const checkCasePatientProgress = require('./checkCasePatientProgress');

        const chkCaseProgress = await checkCasePatientProgress(
            {
                _storeid: data._storeid,
                _branchid: data._branchid,
                _agentid: data._agentid,
                _patientid: data._patientid,
                _casepatientid: data._casepatientid
            },
            (err) => { if(err) { callback(err); return; } }
        );

        if(!chkCaseProgress.casePatientId) {
            callback(new Error('checkCasePatientCaseType: data-casePatientId-not-exists'));
            return;
        }
        else if(!chkCaseProgress.casePatientPersonalDetailId) {
            callback(new Error('checkCasePatientCaseType: data-casePatientPersonalDetailId-not-exists'));
            return;
        }
        else {
            const mongodbController = require('../../mongodbController');

            const findCaseType = await mongodbController.casePatientModel.aggregate(
                [
                    {
                      '$match': {
                        '_id': chkCaseProgress.casePatientId
                      }
                    }, {
                      '$lookup': {
                        'from': 'm_casetype', 
                        'localField': '_ref_casemaintypeid', 
                        'foreignField': '_id', 
                        'as': 'mcasetype'
                      }
                    }, {
                      '$match': {
                        'mcasetype': {
                          '$size': 1
                        }
                      }
                    }, {
                      '$unwind': {
                        'path': '$mcasetype'
                      }
                    }, {
                      '$unwind': {
                        'path': '$mcasetype.type_sub'
                      }
                    }, {
                      '$addFields': {
                        'compare_maincase': {
                          '$eq': [
                            '$_ref_casemaintypeid', '$mcasetype._id'
                          ]
                        }, 
                        'compare_subcase': {
                          '$eq': [
                            '$_ref_casesubtypeid', '$mcasetype.type_sub._id'
                          ]
                        }
                      }
                    }, {
                      '$match': {
                        'compare_maincase': true, 
                        'compare_subcase': true
                      }
                    }
                ],
                (err) => { if(err) { callback(err); return; } }
            );

            if(!findCaseType && !findCaseType.length === 1) {
                callback(new Error(`checkCasePatientCaseType: findCaseType not found Or length is morethan 1`));
                return;
            }
            else {
                callback(null);
                return {
                    _casepatientid: findCaseType[0]._id,
                    main_prefix: findCaseType[0].mcasetype.prefix,
                    sub_prefix: findCaseType[0].mcasetype.type_sub.prefix,
                };
            }
        }
    };

module.exports = checkCasePatientCaseType;