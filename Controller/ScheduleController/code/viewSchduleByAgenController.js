const view_Schdule_By_Agen_Controller = async (
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
        const name_fn = 'view_Schdule_By_Agen_Controller';
        const mongodbController = require('../../mongodbController');

        const CheckStoreBranch = await miscController.checkStoreBranch({ _storeid: data._storeid, _branchid: data._branchid }, (err) => { if (err) { callback(err); return; } });
        const ChackAgentid = await miscController.checkAgentId({ _storeid: data._storeid, _branchid: data._branchid, _agentid: data._agentid }, (err) => { if (err) { callback(err); return; } })

        if (CheckStoreBranch !== true) {
            callback(new Error(` ${name_fn} checkStoreBranch : storeid and branchid is not fied in storeModel`));
            return;
        } else if (!ChackAgentid || ChackAgentid === '' || ChackAgentid === null) {
            callback(new Error(` ${name_fn} ChackAgentid : Agentid is not fied in AgentModel`));
            return;
        } else {

            const _storeid = await miscController.checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
            const _branchid = await miscController.checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
            const renderTimeTable = await mongodbController.scheduleModel_Refactor.aggregate(
                [
                    {
                        '$match': {
                            '_ref_storeid': _storeid,
                            '_ref_branchid': _branchid,
                            '_ref_agent_userid': ChackAgentid._agentid
                        }
                    },{
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
                            'dateFrom_string': data.getdate,
                            'status': 'รอรับการรักษา'
                        }
                    },{
                        '$lookup': {
                            'from': 'm_patients',
                            'localField': '_ref_patient_userid',
                            'foreignField': '_id',
                            'as': 'patinetDetail'
                        }
                    },{
                        '$unwind': {
                            'path': '$patinetDetail',
                            'includeArrayIndex': 'patinetDetail_indexs1',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$unwind': {
                            'path': '$patinetDetail.store',
                            'includeArrayIndex': 'patinetDetail_store_indexs1',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            'patinetDetail.store._storeid': _storeid
                        }
                    }, {
                        '$match': {
                            '_ref_storeid': _storeid,
                            '_ref_branchid': _branchid,
                            '_ref_agent_userid': ChackAgentid._agentid
                        }
                    }, {
                        '$project': {
                            '_id' : 1,
                            '_ref_branchid' : 1 ,
                            '_ref_storeid' : 1,
                            '_agentid': '$_ref_agent_userstoreid',
                            'pfcolor': '$m_agents.store.personal.pflevel',
                            'agentname': {
                                '$concat': [
                                    '$m_agents.store.personal.first_name', ' ', '$m_agents.store.personal.last_name'
                                ]
                            },
                            'avatarUrl': '$m_agents.store.avatarUrl',
                            'timeFrom': '$timeFrom_string',
                            'timeTo_string': '$timeTo_string',
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
                            'dateFrom': 1,
                            'hn': '$patinetDetail.store.hn',
                            'agent_special_prename' : 1,
                            'agent_pre_name':1,
                            'patient_special_prename' : 1,
                            'patient_pre_name' : 1,
                        }
                    },
                    { '$sort': { 'dateFrom': -1 } },
                    {
                        '$project': {
                            '_id': '$_id',
                            '_agentid': '$_agentid',
                            'agentname': '$agentname',
                            '_patientid': '$_patientid',
                            'patientnamge': '$pateintname',
                            'detail': '$detail',
                            'status': '$status',
                            'date': '$date',
                            'timeFrom': '$timeFrom',
                            'timeTo': '$timeTo_string',
                            'hn': '$hn',
                            'patient_prename': '$patient_pre_name',
                            'patient_special_prename': '$patient_special_prename',
                            'agent_prename': '$agent_pre_name',
                            'agent_special_prename': '$agent_special_prename',
                            "timeFromnew": "$dateFrom"
                        }
                    }
                ], (err) => { if (err) { callback(err); return; } }
            );
            //res.send(renderTimeTable).end();            
            if (!renderTimeTable) {
                callback(new Error(` ${name_fn} renderTimeTable : find scheduleModel_Refactor error`));
                return ;
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
module.exports = view_Schdule_By_Agen_Controller;
