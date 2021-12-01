/**
 * Misc Controller สำหรับ ดู คิว
 ** updateStatusMode = 1 => 'นัดหมายไว้'
 ** updateStatusMode = 2 => 'ยกเลิกนัด'
 ** updateStatusMode = 3 => 'รอรับการรักษา'
 ** updateStatusMode = 4 => 'รอชำระเงิน'
 ** updateStatusMode = 5 => 'เสร็จสิ้น'
 */
const Schedule_Check_Status = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_scheduleid: '',
    },
    callback = (err = new Error) => { }
) => {
    const controllerName = `Schedule_Check_Status`;

    const validateObjectId = require('./validateObjectId');
    const moment = require('moment');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (typeof data._ref_scheduleid != 'string' || !validateObjectId(data._ref_scheduleid)) { callback(new Error(`${controllerName}: <data._ref_scheduleid> must be String ObjectId`)); return; }
    else {
        const checkObjectId = require('./checkObjectId');

        const _ref_storeid = await checkObjectId(data._ref_storeid, (err) => { if (err) { callback(err); return; } });
        const _ref_branchid = await checkObjectId(data._ref_branchid, (err) => { if (err) { callback(err); return; } });
        const _ref_scheduleid = await checkObjectId(data._ref_scheduleid, (err) => { if (err) { callback(err); return; } });

        if (!_ref_storeid) { callback(new Error(`${controllerName}: checkObjectId "_ref_storeid" have error`)); return; }
        else if (!_ref_branchid) { callback(new Error(`${controllerName}: checkObjectId "_ref_branchid" have error`)); return; }
        else if (!_ref_scheduleid) { callback(new Error(`${controllerName}: checkObjectId "_ref_scheduleid" have error`)); return; }
        else {
            const { ObjectId, scheduleModel_Refactor } = require('../../mongodbController');

            const findSchedule = await scheduleModel_Refactor.aggregate(
                [
                    {
                        '$match': {
                            '_id': _ref_scheduleid,
                            '_ref_storeid': _ref_storeid,
                            '_ref_branchid': _ref_branchid,
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_agents',
                            'localField': '_ref_agent_userid',
                            'foreignField': '_id',
                            'as': 'lookup_agent'
                        }
                    }, {
                        '$unwind': {
                            'path': '$lookup_agent',
                            'includeArrayIndex': 'index_lookup_agent',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '_id': _ref_scheduleid,
                            '_ref_storeid': _ref_storeid,
                            '_ref_branchid': _ref_branchid,
                            'index_lookup_agent': {
                                '$ne': null
                            },
                            'lookup_agent.store._storeid': _ref_storeid,
                            'lookup_agent.store.branch._branchid': _ref_branchid,
                        }
                    }, {
                        '$unwind': {
                            'path': '$lookup_agent.store',
                            'includeArrayIndex': 'index_lookup_agent_store',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '_id': _ref_scheduleid,
                            '_ref_storeid': _ref_storeid,
                            '_ref_branchid': _ref_branchid,
                            'index_lookup_agent': {
                                '$ne': null
                            },
                            'index_lookup_agent_store': {
                                '$ne': null
                            },
                            'lookup_agent.store._storeid': _ref_storeid,
                            'lookup_agent.store.branch._branchid': _ref_branchid,
                        }
                    }, {
                        '$unwind': {
                            'path': '$lookup_agent.store.branch',
                            'includeArrayIndex': 'index_lookup_agent_store_branch',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '_id': _ref_scheduleid,
                            '_ref_storeid': _ref_storeid,
                            '_ref_branchid': _ref_branchid,
                            'index_lookup_agent': {
                                '$ne': null
                            },
                            'index_lookup_agent_store': {
                                '$ne': null
                            },
                            'lookup_agent.store._storeid': _ref_storeid,
                            'index_lookup_agent_store_branch': {
                                '$ne': null
                            },
                            'lookup_agent.store.branch._branchid': _ref_branchid,
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_patients',
                            'localField': '_ref_patient_userid',
                            'foreignField': '_id',
                            'as': 'lookup_patient'
                        }
                    }, {
                        '$match': {
                            '_id': _ref_scheduleid,
                            '_ref_storeid': _ref_storeid,
                            '_ref_branchid': _ref_branchid,
                            'index_lookup_agent': {
                                '$ne': null
                            },
                            'index_lookup_agent_store': {
                                '$ne': null
                            },
                            'lookup_agent.store._storeid': _ref_storeid,
                            'index_lookup_agent_store_branch': {
                                '$ne': null
                            },
                            'lookup_agent.store.branch._branchid': _ref_branchid,
                            'lookup_patient.store._storeid': _ref_storeid,
                        }
                    }, {
                        '$unwind': {
                            'path': '$lookup_patient',
                            'includeArrayIndex': 'index_lookup_patient',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '_id': _ref_scheduleid,
                            '_ref_storeid': _ref_storeid,
                            '_ref_branchid': _ref_branchid,
                            'index_lookup_agent': {
                                '$ne': null
                            },
                            'index_lookup_agent_store': {
                                '$ne': null
                            },
                            'lookup_agent.store._storeid': _ref_storeid,
                            'index_lookup_agent_store_branch': {
                                '$ne': null
                            },
                            'lookup_agent.store.branch._branchid': _ref_branchid,
                            'index_lookup_patient': {
                                '$ne': null
                            },
                            'lookup_patient.store._storeid': _ref_storeid,
                        }
                    }, {
                        '$unwind': {
                            'path': '$lookup_patient.store',
                            'includeArrayIndex': 'index_lookup_patient_store',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '_id': _ref_scheduleid,
                            '_ref_storeid': _ref_storeid,
                            '_ref_branchid': _ref_branchid,
                            'index_lookup_agent': {
                                '$ne': null
                            },
                            'index_lookup_agent_store': {
                                '$ne': null
                            },
                            'lookup_agent.store._storeid': _ref_storeid,
                            'index_lookup_agent_store_branch': {
                                '$ne': null
                            },
                            'lookup_agent.store.branch._branchid': _ref_branchid,
                            'index_lookup_patient': {
                                '$ne': null
                            },
                            'index_lookup_patient_store': {
                                '$ne': null
                            },
                            'lookup_patient.store._storeid': _ref_storeid,
                        }
                    }, {
                        '$project': {
                            '_id': 0,
                            '_ref_scheduleid': '$_id',
                            '_ref_storeid': '$_ref_storeid',
                            '_ref_branchid': '$_ref_branchid',
                            'status': '$status',
                            'dateFrom': '$dateFrom',
                            'dateFrom_string': '$dateFrom_string',
                            'timeFrom_string': '$timeFrom_string',
                            'dateTo': '$dateFrom',
                            'dateTo_string': '$dateTo_string',
                            'timeTo_string': '$timeTo_string',
                            '_ref_agent_userid': '$_ref_agent_userid',
                            '_ref_agent_userstoreid': '$_ref_agent_userstoreid',
                            'agent_pre_name': '$lookup_agent.store.personal.pre_name',
                            'agent_special_prename': {
                                '$cond': {
                                    'if': {
                                        '$eq': [
                                            '$lookup_agent.store.personal.pre_name', 'อื่นๆ'
                                        ]
                                    },
                                    'then': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$lookup_agent.store.personal.special_prename', null
                                                ]
                                            },
                                            'then': null,
                                            'else': '$lookup_agent.store.personal.special_prename'
                                        }
                                    },
                                    'else': null
                                }
                            },
                            'agent_first_name': '$lookup_agent.store.personal.first_name',
                            'agent_last_name': '$lookup_agent.store.personal.last_name',
                            '_ref_patient_userid': '$_ref_patient_userid',
                            '_ref_patient_userstoreid': '$_ref_patient_userstoreid',
                            'patient_pre_name': '$lookup_patient.store.personal.pre_name',
                            'patient_special_prename': {
                                '$cond': {
                                    'if': {
                                        '$eq': [
                                            '$lookup_patient.store.personal.pre_name', 'อื่นๆ'
                                        ]
                                    },
                                    'then': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$lookup_patient.store.personal.special_prename', null
                                                ]
                                            },
                                            'then': null,
                                            'else': '$lookup_patient.store.personal.special_prename'
                                        }
                                    },
                                    'else': null
                                }
                            },
                            'patient_first_name': '$lookup_patient.store.personal.first_name',
                            'patient_last_name': '$lookup_patient.store.personal.last_name',
                            'create_date': '$create_date',
                            'create_date_string': '$create_date_string',
                            'create_time_string': '$create_time_string',
                            'modify_date': '$modify_date',
                            'modify_date_string': '$modify_date_string',
                            'modify_time_string': '$modify_time_string'
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );

            if (!findSchedule) { callback(new Error(`${controllerName}: findSchedule return not found`)); }
            else if (findSchedule.length !== 1) { callback(new Error(`${controllerName}: findSchedule.length (${findSchedule.length}) not equal 1`)); }
            else {
                let statusMode = 0;
                switch (String(findSchedule[0].status)) {
                    case 'นัดหมายไว้':
                        statusMode = 1
                        break;
                    case 'ยกเลิกนัด':
                        statusMode = 2
                        break;
                    case 'รอรับการรักษา':
                        statusMode = 3
                        break;
                    case 'รอชำระเงิน':
                        statusMode = 4
                        break;
                    case 'เสร็จสิ้น':
                        statusMode = 5
                        break;
                    default:
                        statusMode = 0
                        break;
                }

                if (statusMode === 0) { callback(new Error(`${controllerName}: statusMode is 0`)); return; }
                else {
                    callback(null);
                    return {
                        _ref_scheduleid: ObjectId(findSchedule[0]._ref_scheduleid),
                        _ref_storeid: ObjectId(findSchedule[0]._ref_storeid),
                        _ref_branchid: ObjectId(findSchedule[0]._ref_branchid),
                        statusMode: statusMode,
                        statusName: String(findSchedule[0].status),
                        dateFrom: moment(findSchedule[0].dateFrom),
                        dateFrom_string: String(findSchedule[0].dateFrom_string),
                        timeFrom_string: String(findSchedule[0].timeFrom_string),
                        dateTo: moment(findSchedule[0].dateTo),
                        dateTo_string: String(findSchedule[0].dateTo_string),
                        timeTo_string: String(findSchedule[0].timeTo_string),
                        _ref_agent_userid: ObjectId(findSchedule[0]._ref_agent_userid),
                        _ref_agent_userstoreid: ObjectId(findSchedule[0]._ref_agent_userstoreid),
                        agent_pre_name: String(findSchedule[0].agent_pre_name),
                        agent_special_prename: !findSchedule[0].agent_special_prename ? null : String(findSchedule[0].agent_special_prename),
                        agent_first_name: String(findSchedule[0].agent_first_name),
                        agent_last_name: String(findSchedule[0].agent_last_name),
                        _ref_patient_userid: ObjectId(findSchedule[0]._ref_patient_userid),
                        _ref_patient_userstoreid: ObjectId(findSchedule[0]._ref_patient_userstoreid),
                        patient_pre_name: String(findSchedule[0].patient_pre_name),
                        patient_special_prename: !findSchedule[0].patient_special_prename ? null : String(findSchedule[0].patient_special_prename),
                        patient_first_name: String(findSchedule[0].patient_first_name),
                        patient_last_name: String(findSchedule[0].patient_last_name),
                        create_date: moment(findSchedule[0].create_date),
                        create_date_string: String(findSchedule[0].create_date_string),
                        create_time_string: String(findSchedule[0].create_time_string),
                        modify_date: moment(findSchedule[0].modify_date),
                        modify_date_string: String(findSchedule[0].modify_date_string),
                        modify_time_string: String(findSchedule[0].modify_time_string),
                    };
                }
            }
        }
    }
};

module.exports = Schedule_Check_Status;