const view_Schdule_Montht_By_Agen_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        getdate: new String(''),
    }, callback = (err = new Error) => { }) => {
    const miscController = require('../../miscController');
    if (
        typeof data._storeid != 'string' || data._storeid == '' || data._storeid == null ||
        typeof data._branchid != 'string' || data._branchid == '' || data._branchid == null ||
        typeof data._agentid != 'string' || data._agentid == '' || data._agentid == null ||
        typeof data.getdate != 'string' || data.getdate == '' || data.getdate == null
    ) {
        callback(new Error(`data Error`));
        return;
    } else {
        const name_fn = 'view_Schdule_Montht_By_Agen_Controller';
        const mongodbController = require('../../mongodbController');
        const moment = require('moment');

        const CheckStoreBranch = await miscController.checkStoreBranch({ _storeid: data._storeid, _branchid: data._branchid }, (err) => { if (err) { callback(err); return; } });
        const ChackAgentid = await miscController.checkAgentId({ _storeid: data._storeid, _branchid: data._branchid, _agentid: data._agentid }, (err) => { if (err) { callback(err); return; } })        
        if (CheckStoreBranch !== true) {
            callback(new Error(` ${name_fn} checkStoreBranch : storeid and branchid is not fied in storeModel`));
            return;
        } else if (!ChackAgentid || ChackAgentid === '' || ChackAgentid === null) {
            callback(new Error(` ${name_fn} ChackAgentid : Agentid is not fied in AgentModel`));
            return;
        } else {
            const date_after_validate = await miscController.validateSchedule_String_Date(data.getdate);
            const _storeid = await miscController.checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
            const _branchid = await miscController.checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
            let chack_date_start, chack_date_end
            if (date_after_validate === false) {
                chack_date_start = moment().startOf('month').format('YYYY-MM-DD');
                chack_date_end = moment().endOf('month').format('YYYY-MM-DD');
            } else {
                chack_date_start = moment(data.getdate, 'YYYY-MM-DD', true).startOf('month').format('YYYY-MM-DD');
                chack_date_end = moment(data.getdate, 'YYYY-MM-DD', true).endOf('month').format('YYYY-MM-DD');
            }

            const renderTimeTable = await mongodbController.scheduleModel_Refactor.aggregate(
                [
                    {
                        '$match': {
                            '_ref_storeid': _storeid,
                            '_ref_branchid': _branchid,
                            'dateFrom_string': { '$gte': chack_date_start, '$lte': chack_date_end },
                            '_ref_agent_userid': ChackAgentid._agentid,
                            'status': {
                                '$ne': 'ยกเลิกนัด'
                            }
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_agents',
                            'localField': '_ref_agent_userid',
                            'foreignField': '_id',
                            'as': 'm_agents'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_agents',
                            'includeArrayIndex': 'index_m_agents',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_agents.store',
                            'includeArrayIndex': 'index_m_agents_store',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_agents.store.branch',
                            'includeArrayIndex': 'index_branch',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            'm_agents.store._storeid': _storeid,
                            'm_agents.store.branch._branchid': _branchid,
                            'm_agents._id': ChackAgentid._agentid,
                            '_ref_agent_userid': ChackAgentid._agentid
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_patients',
                            'localField': '_ref_patient_userid',
                            'foreignField': '_id',
                            'as': 'patinetDetail'
                        }
                    }, {
                        '$unwind': {
                            'path': '$patinetDetail'
                        }
                    }, {
                        '$unwind': {
                            'path': '$patinetDetail.store'
                        }
                    }, {
                        '$match': {
                            'patinetDetail.store._storeid': _storeid
                        }
                    }, {
                        '$match': {
                            '_ref_storeid': _storeid,
                            '_ref_branchid': _branchid,
                            'dateFrom_string': { '$gte': chack_date_start, '$lte': chack_date_end },
                            '_ref_agent_userid': ChackAgentid._agentid,
                            'status': {
                                '$ne': 'ยกเลิกนัด'
                            }
                        }
                    }, {
                        '$project': {
                            '_agentid': '$_ref_agent_userstoreid',
                            'pfcolor': '$m_agents.store.personal.pflevel',
                            'agentname': {
                                '$concat': [
                                    '$m_agents.store.personal.first_name', ' ', '$m_agents.store.personal.last_name'
                                ]
                            },
                            'avatarUrl': '$m_agents.store.avatarUrl',
                            'timeFrom': '$timeFrom_string',
                            'timeTo': '$timeTo_string',
                            '_scheduleid': '$_id',
                            'pateintname': {
                                '$concat': [
                                    '$patinetDetail.store.personal.first_name', ' ', '$patinetDetail.store.personal.last_name'
                                ]
                            },
                            '_patientid': '$_ref_patient_userid',
                            'status': '$status',
                            'detail': '$detail',
                            'date': '$dateFrom_string',
                            'hn': '$patinetDetail.store.hn',
                            'idstatus': {
                                '$cond': {
                                    'if': {
                                        '$ne': [
                                            '$patinetDetail.store.personal.identity_card.id', null
                                        ]
                                    },
                                    'then': true,
                                    'else': false
                                }
                            }
                        }
                    }, {
                        '$group': {
                            '_id': {
                                'pfcolor': '$pfcolor',
                                "_agentid": "$_agentid",
                                "agentname": "$agentname",
                            },
                            'timeTable': {
                                '$push': {
                                    "timeFrom": "$timeFrom",
                                    "timeTo": "$timeTo",
                                    "data": {
                                        "_scheduleid": '$_id',
                                        "pateintname": "$pateintname",
                                        "_patientid": "$_patientid",
                                        "status": '$status',
                                        "detail": "$detail",
                                        "date": "$date",
                                    }
                                }
                            }
                        }
                    }, {
                        '$project': {
                            "_agentid": "$_id._agentid",
                            'pfcolor': '$_id.pfcolor',
                            "agentname": "$_id.agentname",
                            'timeTable': 1
                        }
                    }
                ], (err) => { if (err) { callback(err); return; } }
            );            
            if (!renderTimeTable) {
                callback(new Error(` ${name_fn} renderTimeTable : find scheduleModel_Refactor error`));
                return;
            }
            else if (renderTimeTable.length === 0) {
                callback(null);
                return renderTimeTable;
            }
            else {
                callback(null);
                return renderTimeTable;
            }
        }
    }
}
module.exports = view_Schdule_Montht_By_Agen_Controller;
