/**
 * Controller สำหรับ ดูใบ PO
 */
const PurchaseOrder_View_ForStroeOrBbranch_Controller = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agentid: '',
    },
    callback = (err = new Error) => { }
) => {
    const controllerName = `PurchaseOrder_View_ForStroeOrBbranch_Controller`;

    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const checkAgentId = miscController.checkAgentId;

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
    else {
        const chkAgentId = await checkAgentId(
            {
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid,
                _agentid: data._ref_agentid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgentId) { callback(new Error(`${controllerName}: chkAgentId return not found`)); return; }
        if (chkAgentId.role !== 1) { callback(new Error(`${controllerName}: chkAgentId.role (${chkAgentId.role}) not equal 1`)); return; }
        else {
            const { purchaseOrderModel } = require('../../mongodbController');

            const findPurchaseOrderHeader = await purchaseOrderModel.aggregate(
                [
                    {
                        '$match': {
                            '_ref_storeid': chkAgentId._storeid,
                            '_ref_branchid': chkAgentId._branchid
                        }
                    }, {
                        '$lookup': {
                            'from': 'l_treatment',
                            'localField': '_ref_treatmentid',
                            'foreignField': '_id',
                            'as': 'l_treatment'
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_treatment',
                            'includeArrayIndex': 'l_treatment_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$lookup': {
                            'from': 'l_casepatient',
                            'localField': '_ref_casepatinetid',
                            'foreignField': '_id',
                            'as': 'l_casepatient'
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_casepatient',
                            'includeArrayIndex': 'l_casepatient_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    },{
                        '$lookup': {
                            'from': 'm_agents',
                            'localField': 'l_treatment._ref_agent_userid_create',
                            'foreignField': '_id',
                            'as': 'm_agents'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_agents',
                            'includeArrayIndex': 'm_agents_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_agents.store',
                            'includeArrayIndex': 'm_agents_store_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_agents.store.branch',
                            'includeArrayIndex': 'm_agents_store_branch_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    '$and': [
                                        {
                                            'm_agents.store._storeid': chkAgentId._storeid
                                        }, {
                                            'm_agents.store.branch._branchid': chkAgentId._branchid
                                        }
                                    ]
                                }, {
                                    'm_agents_store_branch_index': null
                                }
                            ]
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_patients',
                            'localField': 'l_casepatient._ref_patient_userid',
                            'foreignField': '_id',
                            'as': 'm_patients'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_patients',
                            'includeArrayIndex': 'm_patients_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_patients.store',
                            'includeArrayIndex': 'm_patients_store_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    'm_patients.store._storeid': chkAgentId._storeid
                                }, {
                                    'm_patients_store_index': null
                                }
                            ]
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_agents',
                            'localField': '_ref_agent_userid_create',
                            'foreignField': '_id',
                            'as': 'm_agents_admin'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_agents_admin',
                            'includeArrayIndex': 'm_agents_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_agents_admin.store',
                            'includeArrayIndex': 'm_agents_admin_store_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_agents_admin.store.branch',
                            'includeArrayIndex': 'm_agents_admin_store_branch_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    '$and': [
                                        {
                                            'm_agents_admin.store._storeid': chkAgentId._storeid
                                        }, {
                                            'm_agents_admin.store.branch._branchid': chkAgentId._branchid
                                        }
                                    ]
                                }, {
                                    'm_agents_admin_store_branch_index': null
                                }, {
                                    'm_agents_admin_store_index': null
                                }
                            ]
                        }
                    }, {
                        '$sort': {
                            'create_date': -1
                        }
                    }, {
                        '$project': {
                            'price': '$price_total_after',
                            'poid': '$_id',
                            'run_po': '$run_po',
                            'iscounter': {
                                '$cond': [
                                    {
                                        '$eq': [
                                            '$m_agents_store_branch_index', null
                                        ]
                                    }, true, false
                                ]
                            },
                            'create_date_string': '$create_date_string',
                            'cashier_name': {
                                '$concat': [
                                    '$m_agents_admin.store.personal.first_name', ' ', '$m_agents_admin.store.personal.last_name'
                                ]
                            },
                            'agent_name': {
                                '$concat': [
                                    '$m_agents.store.personal.first_name', ' ', '$m_agents.store.personal.last_name'
                                ]
                            },
                            'patient_name': {
                                '$concat': [
                                    '$m_patients.store.personal.first_name', ' ', '$m_patients.store.personal.last_name'
                                ]
                            }
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            if (!findPurchaseOrderHeader) { callback(new Error(`${controllerName}: findPurchaseOrderHeader have error`)); return; }
            else {
                callback(null);
                return findPurchaseOrderHeader;
            }
        }
    }
};

module.exports = PurchaseOrder_View_ForStroeOrBbranch_Controller;