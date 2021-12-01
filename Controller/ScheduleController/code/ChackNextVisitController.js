/**
 *  Chack_Next_Visit_Controller คือ ฟังชั่นทีตรวจว่า ในตารางการจอง คนไข้เคย เปิดเคส หรือ ทำอะไรมาก่อนไหม 
 * 
 *  OUTPUT => _ref_caseid {tpye : string}
 */
const Chack_Next_Visit_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _patientid: new String(''),
        _scheduleid: new String(''),
    }, callback = (err = new Error) => { }) => {

    if (
        typeof data._storeid != 'string' || data._storeid == '' || data._storeid == null ||
        typeof data._branchid != 'string' || data._branchid == '' || data._branchid == null ||
        typeof data._patientid != 'string' || data._patientid == '' || data._patientid == null ||
        typeof data._scheduleid != 'string' || data._scheduleid == '' || data._scheduleid == null
    ) {
        callback(new Error(`data Error`));
        return;
    } else {
        const name_fn = 'Chack_Next_Visit_Controller';
        const mongodbController = require('../../mongodbController');
        const miscController = require('../../miscController');

        const CheckStoreBranch = await miscController.checkStoreBranch({ _storeid: data._storeid, _branchid: data._branchid }, (err) => { if (err) { callback(err); return; } });
        const checkPatientId = await miscController.checkPatientId({ _storeid: data._storeid, _patientid: data._patientid }, (err) => { if (err) { callback(err); return; } });


        if (CheckStoreBranch !== true) {
            callback(new Error(` ${name_fn} checkStoreBranch : storeid and branchid is not fied in storeModel`));
            return;
        } else if (!checkPatientId || checkPatientId === '' || checkPatientId === null) {
            callback(new Error(` ${name_fn} checkPatientId : storeid and patientid is not fied in patientModel`));
            return;
        } else {
            const _storeid = await miscController.checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
            const _branchid = await miscController.checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
            const _scheduleid = await miscController.checkObjectId(data._scheduleid, (err) => { if (err) { callback(err); return; } });            
            const patientid = await miscController.checkPatientId({_storeid: data._storeid,_patientid: data._patientid}, (err) => { if (err) { callback(err); return; } });
            const scheduleModel_casepatien = await mongodbController.scheduleModel_Refactor.aggregate(
                [
                    {
                        '$match': {
                            '_ref_storeid': _storeid,
                            '_ref_branchid': _branchid,
                            '_id': _scheduleid,
                            '_ref_patient_userid': patientid._patientid,
                            '_ref_patient_userstoreid' : patientid._patientstoreid,
                        }
                    }, {
                        '$lookup': {
                            'from': 'l_treatment',
                            'localField': '_id',
                            'foreignField': '_ref_scheduleid',
                            'as': 'l_treatment'
                        }
                    }, {
                        '$lookup': {
                            'from': 'l_treatment_progressionnote',
                            'localField': '_id',
                            'foreignField': '_ref_scheduleid',
                            'as': 'l_treatment_progressionnote'
                        }
                    }, {
                        '$lookup': {
                            'from': 'l_casepatient',
                            'localField': '_id',
                            'foreignField': '_ref_scheduleid',
                            'as': 'l_casepatient'
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_casepatient',
                            'includeArrayIndex': 'l_casepatient_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_treatment',
                            'includeArrayIndex': 'l_treatment_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_treatment_progressionnote',
                            'includeArrayIndex': 'l_treatment_progressionnote_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$addFields': {
                            '_ref_casepatinetid': {
                                '$switch': {
                                    'branches': [
                                        {
                                            'case': {
                                                '$ne': [
                                                    '$l_casepatient_index', null
                                                ]
                                            },
                                            'then': '$l_casepatient._id'
                                        }, {
                                            'case': {
                                                '$ne': [
                                                    '$l_treatment_index', null
                                                ]
                                            },
                                            'then': '$l_treatment._ref_casepatinetid'
                                        }, {
                                            'case': {
                                                '$ne': [
                                                    '$l_treatment_progressionnote_index', null
                                                ]
                                            },
                                            'then': '$l_treatment_progressionnote._ref_casepatinetid'
                                        }
                                    ],
                                    'default': null
                                }
                            }
                        }
                    }, {
                        '$lookup': {
                            'from': 'st_casepatient',
                            'localField': '_ref_casepatinetid',
                            'foreignField': '_ref_casepatientid',
                            'as': 'st_casepatient'
                        }
                    }, {
                        '$unwind': {
                            'path': '$st_casepatient',
                            'includeArrayIndex': 'st_casepatien_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$addFields': {
                            'type': {
                                '$switch': {
                                    'branches': [
                                        {
                                            'case': {
                                                $ne: [
                                                    '$l_casepatient_index',
                                                    null
                                                ]
                                            },
                                            then: 'First case'
                                        },
                                        {
                                            'case': {
                                                '$eq': [
                                                    '$st_casepatien_index', null
                                                ]
                                            },
                                            'then': null
                                        }, {
                                            'case': {
                                                '$ne': [
                                                    '$st_casepatient.isnextvisited', true
                                                ]
                                            },
                                            'then': 'next visit'
                                        }, {
                                            'case': {
                                                '$eq': [
                                                    '$st_casepatient.isnextvisited', false
                                                ]
                                            },
                                            'then': 'First case'
                                        }
                                    ],
                                    'default': null
                                }
                            }
                        }
                    }, {
                        '$group': {
                            '_id': {
                                '_ref_casepatinetid': '$_ref_casepatinetid',
                                'type': '$type'
                            }
                        }
                    }
                ], (err) => { if (err) { callback(err); return; } }
            );
            let map = [];
            if (!scheduleModel_casepatien || scheduleModel_casepatien.length === 0) {
                map[0] = {
                    _casepatinetid: null,
                    type: null
                }
                callback(null);
                return map;
            } else {
                let index = 0;
                while (index < scheduleModel_casepatien.length) {
                    if (scheduleModel_casepatien[index]._id.type === 'next visit') {
                        map[0] = {
                            _casepatinetid: scheduleModel_casepatien[index]._id._ref_casepatinetid,
                            type: scheduleModel_casepatien[index]._id.type
                        }
                        callback(null);
                        return map
                    }
                    index++;
                }
                index = 0
                while (index < scheduleModel_casepatien.length) {
                    if (scheduleModel_casepatien[index]._id.type === 'First case') {
                        map[0] = {
                            _casepatinetid: scheduleModel_casepatien[index]._id._ref_casepatinetid,
                            type: scheduleModel_casepatien[index]._id.type
                        }

                        callback(null);
                        return map
                    }
                    index++;
                }
                map[0] = {
                    _casepatinetid: scheduleModel_casepatien[0]._id._ref_casepatinetid,
                    type: scheduleModel_casepatien[0]._id.type
                }

                callback(null);
                return map;
            }
        }
    }
}
module.exports = Chack_Next_Visit_Controller;
