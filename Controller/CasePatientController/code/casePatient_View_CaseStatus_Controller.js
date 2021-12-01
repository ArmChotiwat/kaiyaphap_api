/**
 * Controller สำหรับ ดู สถานะ CasePatient
 */
const casePatient_View_CaseStatus_Controller = async (
    data = {
        _ref_storeid: String(''),
        _ref_branchid: String(''),
        _ref_agentid: String(''),
        _ref_patientid: String(''),
        _ref_casepatientid: String('')

    },
    callback = (err = new Err) => { }
) => {
    const controllerName = "casePatient_View_CaseStatus_Controller";

    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const checkStoreBranch = miscController.checkStoreBranch;

    if (typeof data != 'object') { callback(new Error(`${controllerName}: data must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: data._ref_storeid must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: data._ref_branchid must be String ObjectId`)); return; }
    else if (!(await checkStoreBranch({ _storeid: data._ref_storeid, _branchid: data._ref_branchid }, (err) => { if (err) { return; } }))) { callback(new Error(`${controllerName}: data._ref_storeid and data._ref_branchid checkStoreBranch return not found`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: data._ref_agentid must be String ObjectId`)); return; }
    else if (typeof data._ref_patientid != 'string' || !validateObjectId(data._ref_patientid)) { callback(new Error(`${controllerName}: data._ref_patientid must be String ObjectId`)); return; }
    else if (typeof data._ref_casepatientid != 'string' || !validateObjectId(data._ref_casepatientid)) { callback(new Error(`${controllerName}: data._ref_casepatientid must be String ObjectId`)); return; }
    else {
        const checkObjectId = miscController.checkObjectId;
        const checkAgentId = miscController.checkAgentId;
        const checkPatientId = miscController.checkPatientId;

        const mongodbController = require('../../mongodbController');
        const casePatientModel = mongodbController.casePatientModel;
        const casePatientStage1Model = mongodbController.casePatientStage1Model;
        const casePatientStage2Model = mongodbController.casePatientStage2Model;
        const casePatientStage3Model = mongodbController.casePatientStage3Model;
        const treatmentModel = mongodbController.treatmentModel;
        const agentModel = mongodbController.agentModel;
        const patientModel = mongodbController.patientModel;
        const casePatient_StatusModel = mongodbController.casePatient_StatusModel;

        const _ref_casepatientid = await checkObjectId(data._ref_casepatientid, (err) => { if (err) { callback(err); return; } });
        const _ref_storeid = await checkObjectId(data._ref_storeid, (err) => { if (err) { callback(err); return; } });
        const _ref_branchid = await checkObjectId(data._ref_branchid, (err) => { if (err) { callback(err); return; } });
        // const _ref_agentid = await checkObjectId(data._ref_agentid, (err) => { if (err) { callback(err); return; } });
        const _ref_patientid = await checkObjectId(data._ref_patientid, (err) => { if (err) { callback(err); return; } });

        const findAgent = await checkAgentId(
            {
                _agentid: data._ref_agentid,
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        const findPatient = await checkPatientId(
            {
                _patientid: data._ref_patientid,
                _storeid: data._ref_storeid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        const findCasePatient = await casePatientModel.findOne(
            {
                '_id': _ref_casepatientid,
                '_ref_storeid': _ref_storeid,
                '_ref_branchid': _ref_branchid,
                '_ref_patient_userid': _ref_patientid
            },
            {},
            (err) => { if (err) { callback(err); return; } }
        );

        if (!findAgent) {
            callback(new Error(`${controllerName}: cannot find Agent ${data._ref_agentid}`));
            return;
        } else if (!findPatient) {
            callback(new Error(`${controllerName}: cannot find Patient ${data._ref_patientid}`));
            return;
        } else if (!findCasePatient) {
            callback(new Error(`${controllerName}: cannot find CasePatient ${data._ref_casepatientid}`));
            return;
        } else {
            let cerent_date = [];
            let cerent_time = [];
            const findcasePatientStage1Models = async () => {
                const findcasePatientStage1Model = await casePatientStage1Model.findOne(
                    {
                        '_ref_casepatinetid': _ref_casepatientid
                    }, (err) => { if (err) { callback(err); return; } }
                );
                if (!findcasePatientStage1Model) {
                    return false;
                } else {
                    cerent_date.push(
                        {
                            date: findcasePatientStage1Model.modify_date_string,
                            time: findcasePatientStage1Model.modify_time_string
                        }
                    );

                    return true;
                }
            }


            const findcasePatientStage2Models = async () => {
                const findcasePatientStage2Model = await casePatientStage2Model.findOne(
                    {
                        '_ref_casepatinetid': _ref_casepatientid
                    }, (err) => { if (err) { callback(err); return; } }
                );
                if (!findcasePatientStage2Model) {
                    return false;
                } else {
                    cerent_date.push(
                        {
                            date: findcasePatientStage2Model.modify_date_string,
                            time: findcasePatientStage2Model.modify_time_string
                        }
                    );

                    return true;
                }
            }


            const findcasePatientStage3Models = async () => {
                const findcasePatientStage3Model = await casePatientStage3Model.findOne(
                    {
                        '_ref_casepatinetid': _ref_casepatientid
                    }, (err) => { if (err) { callback(err); return; } }
                );
                if (!findcasePatientStage3Model) {
                    return false;
                } else {
                    cerent_date.push(
                        {
                            date: findcasePatientStage3Model.modify_date_string,
                            time: findcasePatientStage3Model.modify_time_string
                        }
                    );

                    return true;
                }
            }


            const findcasePatientStage4Models_FirstTime_Treatment = async () => {
                const findFirstTimeTreatmant = await treatmentModel.find(
                    {
                        '_ref_casepatinetid': _ref_casepatientid,
                        '_ref_storeid': _ref_storeid
                    },
                    {},
                    (err) => { if (err) { callback(err); return; } }
                ).sort({ _id: 1 }).limit(1);

                if (!findFirstTimeTreatmant || findFirstTimeTreatmant.length != 1) { return false; }
                else {
                    cerent_date.push(
                        {
                            date: findFirstTimeTreatmant[0].modify_date_string,
                            time: findFirstTimeTreatmant[0].modify_time_string
                        }
                    );
                    return true;
                }
            };

            const finndDateNextVisit = async () => {
                const findNextVisit = await casePatient_StatusModel.aggregate(
                    [
                        {
                            '$match': {
                                '_ref_storeid': _ref_storeid,
                                '_ref_branchid': _ref_branchid,
                                '_ref_casepatientid': _ref_casepatientid,
                                'isnextvisited': true
                            }
                        }, {
                            '$lookup': {
                                'from': 'l_treatment_progressionnote',
                                'localField': '_ref_treatment_progressionnoteid',
                                'foreignField': '_id',
                                'as': 'lookup_treatment_PGN'
                            }
                        }, {
                            '$unwind': {
                                'path': '$lookup_treatment_PGN',
                                'includeArrayIndex': 'unwind_treatment_PGN_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$match': {
                                '$or': [
                                    {
                                        'unwind_treatment_PGN_index': 0
                                    }, {
                                        'unwind_treatment_PGN_index': null
                                    }
                                ]
                            }
                        }, {
                            '$lookup': {
                                'from': 'l_treatment',
                                'localField': '_ref_treatmentid',
                                'foreignField': '_id',
                                'as': 'lookup_treatment'
                            }
                        }, {
                            '$unwind': {
                                'path': '$lookup_treatment',
                                'includeArrayIndex': 'unwind_treatment_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$match': {
                                '$or': [
                                    {
                                        'unwind_treatment_index': 0
                                    }, {
                                        'unwind_treatment_index': null
                                    }
                                ]
                            }
                        }, {
                            '$project': {
                                '_ref_storeid': 1,
                                '_ref_branchid': 1,
                                '_ref_casepatientid': 1,
                                '_ref_treatmentid': '$lookup_treatment._id',
                                '_ref_treatment_PGN': '$lookup_treatment_PGN._id',
                                'isnextvisited': 1,
                                'TM_create_date': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                '$unwind_treatment_index', null
                                            ]
                                        },
                                        'then': null,
                                        'else': '$lookup_treatment.modify_date'
                                    }
                                },
                                'TM_create_date_string': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                '$unwind_treatment_index', null
                                            ]
                                        },
                                        'then': null,
                                        'else': '$lookup_treatment.modify_date_string'
                                    }
                                },
                                'TM_create_time_string': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                '$unwind_treatment_index', null
                                            ]
                                        },
                                        'then': null,
                                        'else': '$lookup_treatment.modify_time_string'
                                    }
                                },
                                'PGN_create_date': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                '$unwind_treatment_PGN_index', null
                                            ]
                                        },
                                        'then': null,
                                        'else': '$lookup_treatment_PGN.modify_date'
                                    }
                                },
                                'PGN_create_date_string': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                '$unwind_treatment_PGN_index', null
                                            ]
                                        },
                                        'then': null,
                                        'else': '$lookup_treatment_PGN.modify_date_string'
                                    }
                                },
                                'PGN_create_time_string': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                '$unwind_treatment_PGN_index', null
                                            ]
                                        },
                                        'then': null,
                                        'else': '$lookup_treatment_PGN.modify_time_string'
                                    }
                                }
                            }
                        }
                    ],
                    (err) => { if (err) { callback(err); return; } }
                );
                if (!findNextVisit) {
                    return {
                        _ref_storeid: null,
                        _ref_branchid: null,
                        _ref_casepatientid: null,
                        _ref_treatmentid: null,
                        _ref_treatment_PGN: null,
                        isnextvisited: null,
                        start_date: null,
                        end_date: null,
                    };
                }
                else {
                    let data = []
                    for (let index = 0; index < findNextVisit.length; index++) {
                        if (findNextVisit[index].TM_create_date_string === null || findNextVisit[index].PGN_create_date_string === null) {
                            if (findNextVisit[index].TM_create_date_string === null) {
                                data.push(
                                    {
                                        _ref_storeid: findNextVisit[index]._ref_storeid,
                                        _ref_branchid: findNextVisit[index]._ref_branchid,
                                        _ref_casepatientid: findNextVisit[index]._ref_casepatientid,
                                        _ref_treatment_PGN: findNextVisit[index]._ref_treatment_PGN,
                                        _ref_treatmentid: findNextVisit[index]._ref_treatmentid,
                                        isnextvisited: findNextVisit[index].isnextvisited,
                                        start_date: findNextVisit[index].PGN_create_date_string + ' ' + findNextVisit[index].PGN_create_time_string,
                                        end_date: findNextVisit[index].PGN_create_date_string + ' ' + findNextVisit[index].PGN_create_time_string,
                                    }
                                );
                            } else {
                                data.push(
                                    {
                                        _ref_storeid: findNextVisit[index]._ref_storeid,
                                        _ref_branchid: findNextVisit[index]._ref_branchid,
                                        _ref_casepatientid: findNextVisit[index]._ref_casepatientid,
                                        _ref_treatment_PGN: findNextVisit[index]._ref_treatment_PGN,
                                        _ref_treatmentid: findNextVisit[index]._ref_treatmentid,
                                        isnextvisited: findNextVisit[index].isnextvisited,
                                        start_date: findNextVisit[index].TM_create_date_string + ' ' + findNextVisit[index].TM_create_time_string,
                                        end_date: findNextVisit[index].TM_create_date_string + ' ' + findNextVisit[index].TM_create_time_string,
                                    }
                                );
                            }

                        } else if (findNextVisit[index].TM_create_date_string < findNextVisit[index].PGN_create_date_string) {
                            data.push(
                                {
                                    _ref_storeid: findNextVisit[index]._ref_storeid,
                                    _ref_branchid: findNextVisit[index]._ref_branchid,
                                    _ref_casepatientid: findNextVisit[index]._ref_casepatientid,
                                    _ref_treatmentid: findNextVisit[index]._ref_treatmentid,
                                    _ref_treatment_PGN: findNextVisit[index]._ref_treatment_PGN,
                                    isnextvisited: findNextVisit[index].isnextvisited,
                                    start_date: findNextVisit[index].TM_create_date_string + ' ' + findNextVisit[index].TM_create_time_string,
                                    end_date: findNextVisit[index].PGN_create_date_string + ' ' + findNextVisit[index].PGN_create_time_string,
                                }
                            );
                        } else {
                            data.push(
                                {
                                    _ref_storeid: findNextVisit[index]._ref_storeid,
                                    _ref_branchid: findNextVisit[index]._ref_branchid,
                                    _ref_casepatientid: findNextVisit[index]._ref_casepatientid,
                                    _ref_treatmentid: findNextVisit[index]._ref_treatmentid,
                                    _ref_treatment_PGN: findNextVisit[index]._ref_treatment_PGN,
                                    isnextvisited: findNextVisit[index].isnextvisited,
                                    start_date: findNextVisit[index].PGN_create_date_string + ' ' + findNextVisit[index].PGN_create_time_string,
                                    end_date: findNextVisit[index].TM_create_date_string + ' ' + findNextVisit[index].TM_create_time_string,
                                }
                            );
                        }
                    }
                    return data;
                }
            }
            const findTreatmentNextVisit = async () => {
                const findNextVisit = await casePatient_StatusModel.aggregate(
                    [
                        {
                            '$match': {
                                '_ref_storeid': _ref_storeid,
                                '_ref_branchid': _ref_branchid,
                                '_ref_casepatientid': _ref_casepatientid,
                                'isnextvisited': true
                            }
                        }, {
                            '$addFields': {
                                'chkTreatment': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                '$_ref_treatmentid', null
                                            ]
                                        },
                                        'then': false,
                                        'else': true
                                    }
                                },
                                'chkTreatment_PGN': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                '$_ref_treatment_progressionnoteid', null
                                            ]
                                        },
                                        'then': false,
                                        'else': true
                                    }
                                }
                            }
                        }, {
                            '$lookup': {
                                'from': 'l_treatment_progressionnote',
                                'localField': '_ref_treatment_progressionnoteid',
                                'foreignField': '_id',
                                'as': 'lookup_treatment_PGN'
                            }
                        }, {
                            '$unwind': {
                                'path': '$lookup_treatment_PGN',
                                'includeArrayIndex': 'unwind_treatment_PGN_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$match': {
                                '$or': [
                                    {
                                        'unwind_treatment_PGN_index': 0
                                    }, {
                                        'unwind_treatment_PGN_index': null
                                    }
                                ]
                            }
                        }, {
                            '$lookup': {
                                'from': 'm_agents',
                                'localField': 'lookup_treatment_PGN._ref_agent_userid_create',
                                'foreignField': '_id',
                                'as': 'lookup_agent'
                            }
                        }, {
                            '$unwind': {
                                'path': '$lookup_agent',
                                'includeArrayIndex': 'unwind_treatment_PGN_patient_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$addFields': {
                                'chkAgentId_PGN': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                '$chkTreatment_PGN', true
                                            ]
                                        },
                                        'then': true,
                                        'else': false
                                    }
                                }
                            }
                        }, {
                            '$match': {
                                '$or': [
                                    {
                                        'chkTreatment': true,
                                        'chkTreatment_PGN': false
                                    }, {
                                        'chkAgentId_PGN': true
                                    }
                                ]
                            }
                        }, {
                            '$unwind': {
                                'path': '$lookup_agent.store',
                                'includeArrayIndex': 'unwind_treatment_PGN_patient_store_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$addFields': {
                                'chkAgentId_Store_PGN': {
                                    '$cond': {
                                        'if': {
                                            '$and': [
                                                {
                                                    '$eq': [
                                                        '$chkTreatment_PGN', true
                                                    ]
                                                }, {
                                                    '$eq': [
                                                        {
                                                            '$cmp': [
                                                                '$lookup_treatment_PGN._ref_agent_userstoreid_create', '$lookup_agent.store._id'
                                                            ]
                                                        }, 0
                                                    ]
                                                }
                                            ]
                                        },
                                        'then': true,
                                        'else': false
                                    }
                                }
                            }
                        }, {
                            '$match': {
                                '$or': [
                                    {
                                        'chkTreatment': true,
                                        'chkTreatment_PGN': false
                                    }, {
                                        'chkAgentId_PGN': true,
                                        'chkAgentId_Store_PGN': true
                                    }
                                ]
                            }
                        }, {
                            '$lookup': {
                                'from': 'l_treatment',
                                'localField': '_ref_treatmentid',
                                'foreignField': '_id',
                                'as': 'lookup_treatment'
                            }
                        }, {
                            '$unwind': {
                                'path': '$lookup_treatment',
                                'includeArrayIndex': 'unwind_treatment_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$match': {
                                '$or': [
                                    {
                                        'unwind_treatment_index': 0
                                    }, {
                                        'unwind_treatment_index': null
                                    }
                                ]
                            }
                        }, {
                            '$lookup': {
                                'from': 'm_agents',
                                'localField': 'lookup_treatment._ref_agent_userid_create',
                                'foreignField': '_id',
                                'as': 'lookup_treatment_agent'
                            }
                        }, {
                            '$unwind': {
                                'path': '$lookup_treatment_agent',
                                'includeArrayIndex': 'unwind_treatment_agent_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$addFields': {
                                'chkTreatmentAgentid': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                '$unwind_treatment_agent_index', null
                                            ]
                                        },
                                        'then': false,
                                        'else': {
                                            '$cond': {
                                                'if': {
                                                    '$eq': [
                                                        {
                                                            '$cmp': [
                                                                '$lookup_treatment._ref_agent_userid_create', '$lookup_treatment_agent._id'
                                                            ]
                                                        }, 0
                                                    ]
                                                },
                                                'then': true,
                                                'else': false
                                            }
                                        }
                                    }
                                }
                            }
                        }, {
                            '$match': {
                                '$or': [
                                    {
                                        '$and': [
                                            {
                                                'unwind_treatment_agent_index': {
                                                    '$ne': null
                                                }
                                            }, {
                                                'chkTreatmentAgentid': {
                                                    '$eq': true
                                                }
                                            }
                                        ]
                                    }, {
                                        '$and': [
                                            {
                                                'unwind_treatment_agent_index': {
                                                    '$eq': null
                                                }
                                            }, {
                                                'chkTreatmentAgentid': {
                                                    '$eq': false
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }, {
                            '$unwind': {
                                'path': '$lookup_treatment_agent.store',
                                'includeArrayIndex': 'unwind_treatment_agent_store_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$addFields': {
                                'chkTreatmentAgentStoreid': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                '$unwind_treatment_agent_store_index', null
                                            ]
                                        },
                                        'then': false,
                                        'else': {
                                            '$cond': {
                                                'if': {
                                                    '$eq': [
                                                        {
                                                            '$cmp': [
                                                                '$lookup_treatment._ref_agent_userstoreid_create', '$lookup_treatment_agent.store._id'
                                                            ]
                                                        }, 0
                                                    ]
                                                },
                                                'then': true,
                                                'else': false
                                            }
                                        }
                                    }
                                }
                            }
                        }, {
                            '$match': {
                                '$or': [
                                    {
                                        '$and': [
                                            {
                                                'unwind_treatment_agent_store_index': {
                                                    '$ne': null
                                                }
                                            }, {
                                                'chkTreatmentAgentStoreid': {
                                                    '$eq': true
                                                }
                                            }
                                        ]
                                    }, {
                                        '$and': [
                                            {
                                                'unwind_treatment_agent_store_index': {
                                                    '$eq': null
                                                }
                                            }, {
                                                'chkTreatmentAgentStoreid': {
                                                    '$eq': false
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }, {
                            '$project': {
                                '_id': 0,
                                '_ref_storeid': '$_ref_storeid',
                                '_ref_branchid': '$_ref_branchid',
                                '_ref_casepatientid': '$_ref_casepatientid',
                                '_ref_treatmentid': '$_ref_treatmentid',
                                '_ref_treatment_progressionnoteid': '$_ref_treatment_progressionnoteid',
                                '_ref_poid': '$_ref_poid',
                                'isnextvisited': '$isnextvisited',
                                'agent_PGN_Data': {
                                    '_ref_agent_userid': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$chkAgentId_Store_PGN', false
                                                ]
                                            },
                                            'then': null,
                                            'else': '$lookup_agent._id'
                                        }
                                    },
                                    '_ref_agent_storeid': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$chkAgentId_Store_PGN', false
                                                ]
                                            },
                                            'then': null,
                                            'else': '$lookup_agent.store._id'
                                        }
                                    },
                                    'agent_pre_name': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$chkAgentId_Store_PGN', false
                                                ]
                                            },
                                            'then': null,
                                            'else': '$lookup_agent.store.personal.pre_name'
                                        }
                                    },
                                    'agent_special_pre_name': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$chkAgentId_Store_PGN', false
                                                ]
                                            },
                                            'then': null,
                                            'else': {
                                                '$cond': {
                                                    'if': {
                                                        '$ne': [
                                                            '$lookup_agent.store.personal.pre_name', 'อื่นๆ'
                                                        ]
                                                    },
                                                    'then': null,
                                                    'else': '$lookup_agent.store.personal.special_prename'
                                                }
                                            }
                                        }
                                    },
                                    'agent_first_name': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$chkAgentId_Store_PGN', false
                                                ]
                                            },
                                            'then': null,
                                            'else': '$lookup_agent.store.personal.first_name'
                                        }
                                    },
                                    'agent_last_name': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$chkAgentId_Store_PGN', false
                                                ]
                                            },
                                            'then': null,
                                            'else': '$lookup_agent.store.personal.last_name'
                                        }
                                    }
                                },
                                'treatment_Data': {
                                    'startDateNextVisit': null,
                                    'endDateNextVisit': null,
                                },
                                'agent_Treatment_Data': {
                                    '_ref_agent_userid': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$chkTreatmentAgentid', false
                                                ]
                                            },
                                            'then': null,
                                            'else': '$lookup_treatment_agent._id'
                                        }
                                    },
                                    '_ref_agent_storeid': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$chkTreatmentAgentStoreid', false
                                                ]
                                            },
                                            'then': null,
                                            'else': '$lookup_treatment_agent.store._id'
                                        }
                                    },
                                    'agent_pre_name': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$chkTreatmentAgentStoreid', false
                                                ]
                                            },
                                            'then': null,
                                            'else': '$lookup_treatment_agent.store.personal.pre_name'
                                        }
                                    },
                                    'agent_special_pre_name': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$chkTreatmentAgentStoreid', false
                                                ]
                                            },
                                            'then': null,
                                            'else': {
                                                '$cond': {
                                                    'if': {
                                                        '$ne': [
                                                            '$lookup_treatment_agent.store.personal.pre_name', 'อื่นๆ'
                                                        ]
                                                    },
                                                    'then': null,
                                                    'else': '$lookup_treatment_agent.store.personal.special_prename'
                                                }
                                            }
                                        }
                                    },
                                    'agent_first_name': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$chkTreatmentAgentStoreid', false
                                                ]
                                            },
                                            'then': null,
                                            'else': '$lookup_treatment_agent.store.personal.first_name'
                                        }
                                    },
                                    'agent_last_name': {
                                        '$cond': {
                                            'if': {
                                                '$eq': [
                                                    '$chkTreatmentAgentStoreid', false
                                                ]
                                            },
                                            'then': null,
                                            'else': '$lookup_treatment_agent.store.personal.last_name'
                                        }
                                    }
                                }
                            }
                        }
                    ],
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!findNextVisit) { callback(new Error(`${controllerName}: findTreatmentNextVisit => findNextVisit have error`)); return; }
                else {
                    const date_NextVisit = await finndDateNextVisit();
                    for (let index = 0; index < findNextVisit.length; index++) {
                        for (let index2 = 0; index2 < date_NextVisit.length; index2++) {

                            if (date_NextVisit[index2]._ref_treatment_PGN &&
                                date_NextVisit[index2]._ref_treatmentid &&
                                findNextVisit[index]._ref_treatmentid &&
                                findNextVisit[index]._ref_treatment_progressionnoteid
                            ) {
                                if (
                                    findNextVisit[index]._ref_storeid.toString() === date_NextVisit[index2]._ref_storeid.toString() &&
                                    findNextVisit[index]._ref_branchid.toString() === date_NextVisit[index2]._ref_branchid.toString() &&
                                    findNextVisit[index]._ref_casepatientid.toString() === date_NextVisit[index2]._ref_casepatientid.toString() &&
                                    findNextVisit[index]._ref_treatmentid.toString() === date_NextVisit[index2]._ref_treatmentid.toString()
                                ) {
                                    findNextVisit[index].treatment_Data.startDateNextVisit = date_NextVisit[index2].start_date.toString()
                                    findNextVisit[index].treatment_Data.endDateNextVisit = date_NextVisit[index2].end_date.toString()
                                }

                            } else if (
                                date_NextVisit[index2]._ref_treatmentid &&
                                findNextVisit[index]._ref_treatmentid &&
                                !date_NextVisit[index2]._ref_treatment_PGN &&
                                !findNextVisit[index]._ref_treatment_progressionnoteid
                            ) {
                                if (
                                    findNextVisit[index]._ref_storeid.toString() === date_NextVisit[index2]._ref_storeid.toString() &&
                                    findNextVisit[index]._ref_branchid.toString() === date_NextVisit[index2]._ref_branchid.toString() &&
                                    findNextVisit[index]._ref_casepatientid.toString() === date_NextVisit[index2]._ref_casepatientid.toString() &&
                                    findNextVisit[index]._ref_treatmentid.toString() === date_NextVisit[index2]._ref_treatmentid.toString()
                                ) {
                                    findNextVisit[index].treatment_Data.startDateNextVisit = date_NextVisit[index2].start_date.toString()
                                    findNextVisit[index].treatment_Data.endDateNextVisit = date_NextVisit[index2].end_date.toString()
                                }
                            } else if (
                                date_NextVisit[index2]._ref_treatment_PGN &&
                                findNextVisit[index]._ref_treatment_progressionnoteid &&
                                !date_NextVisit[index2]._ref_treatmentid &&
                                !findNextVisit[index]._ref_treatmentid
                            ) {
                                if (
                                    findNextVisit[index]._ref_storeid.toString() === date_NextVisit[index2]._ref_storeid.toString() &&
                                    findNextVisit[index]._ref_branchid.toString() === date_NextVisit[index2]._ref_branchid.toString() &&
                                    findNextVisit[index]._ref_casepatientid.toString() === date_NextVisit[index2]._ref_casepatientid.toString() &&
                                    findNextVisit[index]._ref_treatment_progressionnoteid.toString() === date_NextVisit[index2]._ref_treatment_PGN.toString()
                                ) {
                                    findNextVisit[index].treatment_Data.startDateNextVisit = date_NextVisit[index2].start_date.toString()
                                    findNextVisit[index].treatment_Data.endDateNextVisit = date_NextVisit[index2].end_date.toString()
                                }
                            }


                        }

                    }

                };
                return findNextVisit;
            }

            const cerent_date_now = async () => {
                if (cerent_date.length >= 1) {
                    cerent_date.sort((a, b) => (a.date > b.date) ? 1 : (a.date === b.date) ? ((a.time > b.time) ? 1 : -1) : -1);
                    const cerent_date_last_start = cerent_date[0].date + ' ' + cerent_date[0].time
                    const cerent_date_last_end = cerent_date[cerent_date.length - 1].date + ' ' + cerent_date[cerent_date.length - 1].time
                    if (!cerent_date_last_start && !cerent_date_last_end) {
                        return {
                            start: null,
                            end: null
                        }
                    } else if (cerent_date_last_start && cerent_date_last_end) {
                        return {
                            start: cerent_date_last_start.toString(),
                            end: cerent_date_last_end.toString()
                        };
                    } else if (cerent_date_last_start && !cerent_date_last_end) {
                        return {
                            start: cerent_date_last_start.toString(),
                            end: null
                        };
                    } else if (!cerent_date_last_start && cerent_date_last_end) {
                        return {
                            start: null,
                            end: cerent_date_last_end.toString()
                        };
                    } else {
                        return {
                            start: null,
                            end: null
                        }
                    }
                } else {
                    return {
                        start: null,
                        end: null
                    }
                }

            };


            const findAgentData = async () => {
                const findAgentResult = await agentModel.aggregate(
                    [
                        {
                            '$match': {
                                '_id': findCasePatient._ref_agent_userid,
                            }
                        }, {
                            '$unwind': {
                                'path': '$store'
                            }
                        }, {
                            '$match': {
                                'store._id': findCasePatient._ref_agent_userstoreid,
                            }
                        }, {
                            '$project': {
                                '_id': 0,
                                '_ref_agent_userid': '$_id',
                                '_ref_agent_userstoreid': '$store._id',
                                'pre_name': '$store.personal.pre_name',
                                'special_prename': {
                                    $cond: {
                                        if: { $eq: ['$store.personal.pre_name', 'อื่นๆ'] },
                                        then: { $ifNull: ['$store.personal.special_prename', null] },
                                        else: null
                                    }
                                },
                                'first_name': '$store.personal.first_name',
                                'last_name': '$store.personal.last_name'
                            }
                        }
                    ],
                    (err) => { if (err) callback(err); return null; }
                );

                if (!findAgentResult || findAgentResult.length !== 1) { callback(new Error(`${controllerName}: findAgentResult return not found OR return more than 1`)); return null; }
                else {
                    callback(null);
                    return {
                        _ref_agent_userid: findAgentResult[0]._ref_agent_userid,
                        _ref_agent_userstoreid: findAgentResult[0]._ref_agent_userstoreid,
                        pre_name: findAgentResult[0].pre_name,
                        special_prename: findAgentResult[0].special_prename,
                        first_name: findAgentResult[0].first_name,
                        last_name: findAgentResult[0].last_name,
                    };
                }
            };

            const findPatient = async () => {
                const findPatientResult = await patientModel.aggregate(
                    [
                        {
                            '$match': {
                                '_id': findCasePatient._ref_patient_userid,
                            }
                        }, {
                            '$unwind': {
                                'path': '$store'
                            }
                        }, {
                            '$match': {
                                'store._id': findCasePatient._ref_patient_userstoreid,
                            }
                        }, {
                            '$project': {
                                '_id': 0,
                                '_ref_patient_userid': '$_id',
                                '_ref_patient_userstoreid': '$store._id',
                                'pre_name': '$store.personal.pre_name',
                                'special_prename': {
                                    $cond: {
                                        if: { $eq: ['$store.personal.pre_name', 'อื่นๆ'] },
                                        then: { $ifNull: ['$store.personal.special_prename', null] },
                                        else: null
                                    }
                                },
                                'first_name': '$store.personal.first_name',
                                'last_name': '$store.personal.last_name'
                            }
                        }
                    ],
                    (err) => { if (err) { callback(err); return null; } }
                );

                if (!findPatientResult || findPatientResult.length !== 1) { callback(new Error(`${controllerName}: findPatientResult <${findPatientResult.length}> return not found OR return more than 1`)); return null; }
                else {
                    callback(null);
                    return {
                        _ref_patient_userid: findPatientResult[0]._ref_patient_userid,
                        _ref_patient_userstoreid: findPatientResult[0]._ref_patient_userstoreid,
                        pre_name: findPatientResult[0].pre_name,
                        special_prename: findPatientResult[0].special_prename,
                        first_name: findPatientResult[0].first_name,
                        last_name: findPatientResult[0].last_name,
                    };
                }
            };

            const GET_agentPersonalData = await findAgentData();
            const GET_patientPersonalData = await findPatient();
            const GET_casePatientStage1 = await findcasePatientStage1Models();
            const GET_casePatientStage2 = await findcasePatientStage2Models();
            const GET_casePatientStage3 = await findcasePatientStage3Models();
            const GET_casePatientStage4 = await findcasePatientStage4Models_FirstTime_Treatment();

            let mapdata = null;
            const dates = await cerent_date_now();
            mapdata = {
                MainCase: {
                    create_date: dates.start,
                    cerent_date: dates.end,
                    agentPersonalData: GET_agentPersonalData,
                    patientPersonalData: GET_patientPersonalData,
                    casePatientStage1: GET_casePatientStage1,
                    casePatientStage2: GET_casePatientStage2,
                    casePatientStage3: GET_casePatientStage3,
                    casePatientStage4: GET_casePatientStage4,
                },
                SubCase: await findTreatmentNextVisit()
            }
            return mapdata;
        }
    }
};

module.exports = casePatient_View_CaseStatus_Controller;