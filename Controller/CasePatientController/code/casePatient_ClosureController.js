/**
 * Controller สำหรับ ดู สถานะ CasePatient
 */
const case_Patient_Closure_Controller = async (
    data = {
        _ref_storeid: String(''),
        _ref_branchid: String(''),
        _ref_agentid: String(''),
        _ref_casepatientid: String('')

    },
    callback = (err = new Err) => { }
) => {
    const controllerName = `CasePatient_View_Related_Status_Controller`;
    const { validateObjectId, checkAgentId, checkObjectId } = require('../../miscController');
    const { casePatientModel, casePatient_StatusModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
    else if (typeof data._ref_casepatientid != 'string' || !validateObjectId(data._ref_casepatientid)) { callback(new Error(`${controllerName}: <data._ref_casepatientid> must be String ObjectId`)); return; }
    else {
        const chkAgent = await checkAgentId(
            {
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid,
                _agentid: data._ref_agentid
            },
            (err) => { if (err) { callback(err); return; } }
        );
        if (!chkAgent) { callback(new Error(`${controllerName}: Can't find chkAgent return not found`)); return; }
        else if (chkAgent.role !== 2) { callback(new Error(`${controllerName}: chkAgent.role = (${chkAgent.role}) must be Agent not Other`)); return; }
        else {
            const casepatientid = await checkObjectId(data._ref_casepatientid, (err) => { if (err) { callback(err); return; } });
            let find_casePatientModel = await casePatientModel.findOne(
                {
                    _id: casepatientid,
                    _ref_storeid: chkAgent._storeid,
                    _ref_branchid: chkAgent._branchid,
                    _ref_agent_userid : chkAgent._agentid,

                },
                {}, (err) => { if (err) { callback(err); return; } });

            let find_casePatient_StatusModel = await casePatient_StatusModel.find(
                {
                    _ref_casepatientid: casepatientid,
                    _ref_storeid: chkAgent._storeid,
                    _ref_branchid: chkAgent._branchid,

                },
                {}, (err) => { if (err) { callback(err); return; } });
            const aggregate_casePatient_StatusModel = await casePatient_StatusModel.aggregate(
                [
                    {
                        '$match': {
                            '_ref_casepatientid': casepatientid,
                            '_ref_storeid': chkAgent._storeid,
                            '_ref_branchid': chkAgent._branchid
                        }
                    }, {
                        '$project': {
                            'casepatient': {
                                '$switch': {
                                    'branches': [
                                        {
                                            'case': {
                                                '$and': [
                                                    {
                                                        '$ne': [
                                                            '$_ref_treatmentid', null
                                                        ]
                                                    }, {
                                                        '$eq': [
                                                            '$isnextvisited', false
                                                        ]
                                                    }
                                                ]
                                            },
                                            'then': true
                                        }, {
                                            'case': {
                                                '$and': [
                                                    {
                                                        '$ne': [
                                                            '$_ref_treatmentid', null
                                                        ]
                                                    }, {
                                                        '$eq': [
                                                            '$isnextvisited', true
                                                        ]
                                                    }
                                                ]
                                            },
                                            'then': true
                                        }
                                    ],
                                    'default': false
                                }
                            }
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            )
            const length_aggregate_casePatient_Status = aggregate_casePatient_StatusModel.length;
            if (length_aggregate_casePatient_Status !== 0) {
                for (let index = 0; index < length_aggregate_casePatient_Status; index++) {
                    const chack_case_st = aggregate_casePatient_StatusModel[index].casepatient
                    if (chack_case_st === false) {
                        callback(new Error(`${controllerName}: check treatment some treatment not close`)); 
                        return;
                    }
                }
            } else {
                callback(new Error(`${controllerName}: casePatient_StatusModel have't data`)); 
                return;
            }

            if (!find_casePatientModel) { callback(new Error(`${controllerName}: Can't find Case in PatientModel Or this agen is not open case`)); return; }
            else if (!find_casePatient_StatusModel || find_casePatient_StatusModel.length === 0) { callback(`${controllerName}: Can't find Case Status in casePatient_StatusModel`); return; }
            else {
                let i = 1;
                while (i <= 10) {
                    find_casePatientModel.isclosed = true;
                    find_casePatientModel = await find_casePatientModel.save().then((result) => { return result; }).catch((err) => { callback(err); return; });
                    if (find_casePatientModel !== null && find_casePatientModel !== '' && find_casePatientModel) {
                        break;
                    }
                    i++;
                }

                if (!find_casePatientModel) {
                    callback(new Error(`${controllerName}: Can't save isclosed : true in casePatientModel`)); return;
                } else {
                    for (let index = 0; index < find_casePatient_StatusModel.length; index++) {
                        i = 1;
                        while (i <= 10) {
                            find_casePatient_StatusModel[index].isclosed = true;
                            find_casePatient_StatusModel[index] = await find_casePatient_StatusModel[index].save().then((result) => { return result; }).catch((err) => { callback(err); return; });
                            if (find_casePatient_StatusModel[index] !== null && find_casePatient_StatusModel[index] !== '' && find_casePatient_StatusModel[index]) {
                                break;
                            }
                            i++;
                        }

                    }
                }
                callback(null);
                return { find_casePatientModel, find_casePatient_StatusModel };

            }

        }
    }
};

module.exports = case_Patient_Closure_Controller;