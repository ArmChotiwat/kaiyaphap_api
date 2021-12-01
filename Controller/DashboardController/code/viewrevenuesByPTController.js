const view_revenues_By_PT_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''), // ค่าเริ่มต้นเป็นค่า null อยู่ใน type string "null"
        _agent_userid: new String(''), // ค่าเริ่มต้นเป็นค่า null อยู่ใน type string "null"
        todate: new String(''), // 0 == YTD , 1 == MTD , 2 == DTD
    }, callback = (err = new Err) => { }
) => {
    const hader = 'view_revenues_By_PT_Controller';
    if (typeof data._storeid !== 'string' || data._storeid === '' || data._storeid === null ||
        typeof data._branchid !== 'string' || data._branchid === '' || data._branchid === null ||
        typeof data.todate !== 'string' || data.todate === '' || data.todate === null
    ) {
        callback(new Error(` ${hader} : data Error`));
        return;
    } else {
        const checkObjectId = require('../../miscController').checkObjectId
        const moment = require('moment');
        const mongodbController = require('../../mongodbController')
        const storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const branchid = await checkObjectId(data._branchid, (err) => { if (err) { return; } });
        const agentid = await checkObjectId(data._agent_userid, (err) => { if (err) { return; } });
        const chackMonthOrYear = require('./chackMonthOrYear');
        let year, mouth;

        if (+data.todate === 0) {
            year = moment().format('YYYY');
            mouth = 'null';
        }
        else if (+data.todate === 1) {
            year = 'null';
            mouth = moment().format('MM');
        }
        else if (+data.todate === 2) {
            year = 'null';
            mouth = 'null';
        }
        else {
            callback(new Error(` ${hader} : todate most be 0 , 1 , 2  `)); return;
        }

        const chack_date_start = await chackMonthOrYear.chack_date_start({ Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
        const p_chack_date_start = await chackMonthOrYear.p_chack_date_start({ date: chack_date_start, Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
        const chack_date_end = await chackMonthOrYear.chack_date_end({ Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
        const p_chack_date_end = await chackMonthOrYear.p_chack_date_end({ date: chack_date_end, Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });

        let match, match_agen;
        if (!branchid || typeof branchid !== 'object') {
            match = { '_ref_storeid': storeid }
        } else {
            match = { '_ref_storeid': storeid, '_ref_branchid': branchid }
        }
        if (!agentid || typeof agentid !== 'object') {
            match_agen = {}
        } else {
            match_agen = {
                '$or': [
                    {
                        '_ref_agent_userstoreid': agentid
                    }, {
                        '_ref_agent_userid_create': agentid
                    }
                ]
            }
        }

        const count_all_patient = async () => {
            let match_patientModel, purchaseOrderModel_match_agen;
            if (!branchid || typeof branchid !== 'object') {
                match_patientModel = { '_ref_storeid': storeid }
            } else {
                match_patientModel = { '_ref_storeid': storeid, '_ref_branchid': branchid }
            }

            if (!agentid || typeof agentid !== 'object') {
                purchaseOrderModel_match_agen = {}
            } else {
                purchaseOrderModel_match_agen = {
                    '$or': [
                        {
                            'l_casepatient._ref_agent_userstoreid': agentid
                        }, {
                            'l_casepatient._ref_agent_userid_create': agentid
                        }
                    ]
                }
            }
            const patientModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    {
                        '$match': match_patientModel
                    },
                    { '$match': { 'create_date_string': { '$gte': chack_date_start, '$lte': chack_date_end } } },
                    {
                        '$lookup': {
                            'from': 'l_casepatient',
                            'localField': '_ref_casepatinetid',
                            'foreignField': '_id',
                            'as': 'l_casepatient'
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_casepatient',
                            'includeArrayIndex': 'index_st_casepatient',
                            'preserveNullAndEmptyArrays': true
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
                            'includeArrayIndex': 'index_m_patients',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_patients.store',
                            'includeArrayIndex': 'inex_m_patients_store',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    'inex_m_patients_store': null
                                }, {
                                    'inex_m_patients_store': 0
                                }
                            ]
                        }
                    }, {
                        '$match': {
                            '_ref_storeid': storeid,
                            'm_patients.store._storeid': storeid,
                            'l_casepatient._ref_storeid': storeid
                        }
                    }, {
                        '$match': purchaseOrderModel_match_agen
                    },
                    {
                        '$match': {
                            'count_course_list': 1
                        }
                    }, {
                        '$group': {
                            '_id': {
                                '_id': '$_ref_storeid',
                                'patientsid': '$m_patients._id'
                            },
                            'price_total_after': {
                                '$sum': 1
                            },
                            'price_total_afters': {
                                '$sum': '$price_total_after'
                            }
                        }
                    }, {
                        '$project': {
                            'storeid': '$_id._id',
                            'patientsid': '$_id.patientsid',
                            'price_total_after': 1,
                            'price_total_afters': 1,
                            'name': {
                                '$cond': {
                                    'if': {
                                        '$ne': [
                                            '$price_total_after', 1
                                        ]
                                    },
                                    'then': 'old',
                                    'else': 'new'
                                }
                            }
                        }
                    }, {
                        '$group': {
                            '_id': {
                                'name': '$name',
                                'storeid': '$storeid'
                            },
                            'count_visit': {
                                '$sum': '$price_total_after'
                            },
                            'count_patients': {
                                '$sum': 1
                            },
                            'revenues': {
                                '$sum': '$price_total_afters'
                            }
                        }
                    }, {
                        '$group': {
                            '_id': '$_id.storeid',
                            'count_visit': {
                                '$sum': '$count_visit'
                            },
                            'count_patients': {
                                '$sum': '$count_patients'
                            },
                            'revenues': {
                                '$sum': '$revenues'
                            }
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            let map = [];
            if (!patientModel || patientModel.length === 0) {
                map[0] = {
                    _id: 'ไม่พบข้อมูล',
                    count_visit: 0,
                    count_patients: 0,
                    revenues: 0,
                }
                return map;
            } else {
                return patientModel;
            }
        }

        const count_visit = async () => {
            let match_patientModel;
            if (!branchid || typeof branchid !== 'object') {
                match_patientModel = { '_ref_storeid': storeid }
            } else {
                match_patientModel = { '_ref_storeid': storeid, '_ref_branchid': branchid }
            }

            if (!agentid || typeof agentid !== 'object') {
                purchaseOrderModel_match_agen = {}
            } else {
                purchaseOrderModel_match_agen = {
                    '$or': [
                        {
                            'l_casepatient._ref_agent_userstoreid': agentid
                        }, {
                            'l_casepatient._ref_agent_userid_create': agentid
                        }
                    ]
                }
            }
            
            const patientModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    { '$match': match_patientModel },
                    {
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
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    'l_casepatient_index': null
                                }, {
                                    'l_casepatient_index': 0
                                }
                            ]
                        }
                    },
                    { '$match': purchaseOrderModel_match_agen }, {
                        '$group': { '_id': '$_ref_storeid', 'count': { '$sum': 1 } }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            let map = [];
            if (!patientModel || patientModel.length === 0) {
                map[0] = {
                    _id: 'ไม่พบข้อมูล',
                    count: 0
                }
                return map;
            } else {
                return patientModel;
            }
        }

        const totel_income = async () => {
            let match_patientModel;
            if (!branchid || typeof branchid !== 'object') {
                match_patientModel = { '_ref_storeid': storeid }
            } else {
                match_patientModel = { '_ref_storeid': storeid, '_ref_branchid': branchid }
            }

            if (!agentid || typeof agentid !== 'object') {
                purchaseOrderModel_match_agen = {}
            } else {
                purchaseOrderModel_match_agen = {
                    '$or': [
                        {
                            'l_casepatient._ref_agent_userstoreid': agentid
                        }, {
                            'l_casepatient._ref_agent_userid_create': agentid
                        }
                    ]
                }
            }

            const patientModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    { '$match': match_patientModel },
                    { '$match': { 'create_date_string': { '$gte': chack_date_start, '$lte': chack_date_end } } },
                    { '$match': purchaseOrderModel_match_agen },
                    {
                        '$group': { '_id': '$_ref_storeid', 'sum': { '$sum': '$price_total_after' } }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            let map = [];
            if (!patientModel || patientModel.length === 0) {
                map[0] = {
                    _id: 'ไม่พบข้อมูล',
                    sum: 0
                }
                return map;
            } else {
                return patientModel;
            }
        }



        const fn_visit_patients_revenues = async () => {
            if (!agentid || typeof agentid !== 'object') {
                purchaseOrderModel_match_agen = {}
            } else {
                purchaseOrderModel_match_agen = {
                    '$or': [
                        {
                            'l_casepatient._ref_agent_userstoreid': agentid
                        }, {
                            'l_casepatient._ref_agent_userid_create': agentid
                        }
                    ]
                }
            }
            const purchaseOrderModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    {
                        '$match': match
                    },
                    { '$match': { 'create_date_string': { '$gte': chack_date_start, '$lte': chack_date_end } } },
                    {
                        '$lookup': {
                            'from': 'l_casepatient',
                            'localField': '_ref_casepatinetid',
                            'foreignField': '_id',
                            'as': 'l_casepatient'
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_casepatient',
                            'includeArrayIndex': 'index_st_casepatient',
                            'preserveNullAndEmptyArrays': true
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
                            'includeArrayIndex': 'index_m_patients',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    'index_m_patients': null
                                }, {
                                    'index_m_patients': 0
                                }
                            ]
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_patients.store',
                            'includeArrayIndex': 'inex_m_patients_store',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    'inex_m_patients_store': null
                                }, {
                                    'inex_m_patients_store': 0
                                }
                            ]
                        }
                    }, {
                        '$match': {
                            '_ref_storeid': storeid,
                            'm_patients.store._storeid': storeid,
                            'l_casepatient._ref_storeid': storeid
                        }
                    }, {
                        '$match': purchaseOrderModel_match_agen
                    }, {
                        '$match': {
                            'count_course_list': 1
                        }
                    }, {
                        '$group': {
                            '_id': {
                                '_id': '$_ref_storeid',
                                'patientsid': '$m_patients._id'
                            },
                            'price_total_after': {
                                '$sum': 1
                            },
                            'price_total_afters': {
                                '$sum': '$price_total_after'
                            }
                        }
                    }, {
                        '$project': {
                            'storeid': '$_id._id',
                            'patientsid': '$_id.patientsid',
                            'price_total_after': 1,
                            'price_total_afters': 1,
                            'name': {
                                '$cond': {
                                    'if': {
                                        '$ne': [
                                            '$price_total_after', 1
                                        ]
                                    },
                                    'then': 'old',
                                    'else': 'new'
                                }
                            }
                        }
                    }, {
                        '$group': {
                            '_id': {
                                'name': '$name',
                                'storeid': '$storeid'
                            },
                            'count_visit': {
                                '$sum': '$price_total_after'
                            },
                            'count_patients': {
                                '$sum': 1
                            },
                            'revenues': {
                                '$sum': '$price_total_afters'
                            }
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            let map;
            if (!purchaseOrderModel || purchaseOrderModel.length === 0) {
                return {
                    new: 'new',
                    new_value: 0,
                    new_count_visit: 0,
                    new_count_patients: 0,
                    old: 'old',
                    old_value: 0,
                    old_count_visit: 0,
                    old_count_patients: 0,
                };
            } else {
                if (purchaseOrderModel.length === 1) {
                    if (purchaseOrderModel[0]._id.name === 'new') {
                        map = {
                            new: purchaseOrderModel[0]._id.name,
                            new_value: purchaseOrderModel[0].revenues,
                            new_count_visit: purchaseOrderModel[0].count_visit,
                            new_count_patients: purchaseOrderModel[0].count_patients,
                            old: 'old',
                            old_value: 0,
                            old_count_visit: 0,
                            old_count_patients: 0,

                        }
                    } else {
                        map = {
                            new: 'new',
                            new_value: 0,
                            new_count_visit: 0,
                            new_count_patients: 0,
                            old: purchaseOrderModel[0]._id.name,
                            old_value: purchaseOrderModel[0].revenues,
                            old_count_visit: purchaseOrderModel[0].count_visit,
                            old_count_patients: purchaseOrderModel[0].count_patients,
                        }
                    }
                } else {
                    if (purchaseOrderModel[0]._id.name === 'new') {
                        map = {
                            new: purchaseOrderModel[0]._id.name,
                            new_value: purchaseOrderModel[0].revenues,
                            new_count_visit: purchaseOrderModel[0].count_visit,
                            new_count_patients: purchaseOrderModel[0].count_patients,
                            old: purchaseOrderModel[1]._id.name,
                            old_value: purchaseOrderModel[1].revenues,
                            old_count_visit: purchaseOrderModel[1].count_visit,
                            old_count_patients: purchaseOrderModel[1].count_patients,
                        }
                    } else {
                        map = {
                            new: purchaseOrderModel[1]._id.name,
                            new_value: purchaseOrderModel[1].revenues,
                            new_count_visit: purchaseOrderModel[1].count_visit,
                            new_count_patients: purchaseOrderModel[1].count_patients,
                            old: purchaseOrderModel[0]._id.name,
                            old_value: purchaseOrderModel[0].revenues,
                            old_count_visit: purchaseOrderModel[0].count_visit,
                            old_count_patients: purchaseOrderModel[0].count_patients,
                        }
                    }
                }
            }
            return map;

        }
        const revenues_sum_avg = async () => {
            if (!agentid || typeof agentid !== 'object') {
                purchaseOrderModel_match_agen = {}
            } else {
                purchaseOrderModel_match_agen = {
                    '$or': [
                        {
                            'l_casepatient._ref_agent_userstoreid': agentid
                        }, {
                            'l_casepatient._ref_agent_userid_create': agentid
                        }
                    ]
                }
            }
            const purchaseOrderModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    { '$match': match },
                    {
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
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    'l_casepatient_index': null
                                }, {
                                    'l_casepatient_index': 0
                                }
                            ]
                        }
                    },
                    { '$match': purchaseOrderModel_match_agen },
                    { '$match': { 'create_date_string': { '$gte': chack_date_start, '$lte': chack_date_end } } },
                    { '$project': { '_id': '$_ref_storeid', 'sum': { '$sum': ['$price_course_list_total_discount', '$price_product_list_total_discount'] }, 'avg': { '$sum': ['$price_course_list_total_discount', '$price_product_list_total_discount'] } } },
                    { '$group': { '_id': '$_ref_storeid', 'sum': { '$sum': '$sum' }, 'avg': { '$avg': '$avg' } } }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            let map;
            if (!purchaseOrderModel || purchaseOrderModel.length === 0) {
                return map = {
                    sum: 0,
                    avg: 0
                };
            } else {
                return map = {
                    sum: purchaseOrderModel[0].sum,
                    avg: purchaseOrderModel[0].avg
                };
            }
        }

        const proportion_revenues_by_department = async () => {
            if (!agentid || typeof agentid !== 'object') {
                purchaseOrderModel_match_agen = {}
            } else {
                purchaseOrderModel_match_agen = {
                    '$or': [
                        {
                            'l_casepatient._ref_agent_userstoreid': agentid
                        }, {
                            'l_casepatient._ref_agent_userid_create': agentid
                        }
                    ]
                }
            }
            const purchaseOrderModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    { '$match': match },
                    { '$match': { 'create_date_string': { '$gte': chack_date_start, '$lte': chack_date_end } } },
                    { '$lookup': { 'from': 'l_casepatient', 'localField': '_ref_casepatinetid', 'foreignField': '_id', 'as': 'l_casepatient' } },
                    {
                        '$unwind': {
                            'path': '$l_casepatient',
                            'includeArrayIndex': 'l_casepatient_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    'l_casepatient_index': null
                                }, {
                                    'l_casepatient_index': 0
                                }
                            ]
                        }
                    },
                    { '$match': match },
                    { '$lookup': { 'from': 'm_patients', 'localField': 'l_casepatient._ref_patient_userid', 'foreignField': '_id', 'as': 'm_patients' } },
                    {
                        '$unwind': {
                            'path': '$m_patients',
                            'includeArrayIndex': 'm_patients_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    'm_patients_index': null
                                }, {
                                    'm_patients_index': 0
                                }
                            ]
                        }
                    },
                    { '$match': purchaseOrderModel_match_agen },
                    { '$group': { '_id': { '_ref_patient_userid': '$l_casepatient._ref_patient_userid' }, 'price_total_after': { '$sum': 1 }, 'price_total_afters': { '$sum': '$price_total_after' } } },
                    { '$project': { 'new': { '$switch': { 'branches': [{ 'case': { '$lte': ['$price_total_after', 1] }, 'then': '$price_total_after' }], 'default': 0 } }, 'old': { '$switch': { 'branches': [{ 'case': { '$gte': ['$price_total_after', 2] }, 'then': '$price_total_after' }], 'default': 0 } }, 'name': { '$switch': { 'branches': [{ 'case': { '$gte': ['$price_total_after', 2] }, 'then': 'old' }], 'default': 'new' } } } },
                    { '$group': { '_id': '$name', 'new': { '$sum': '$new' }, 'old': { '$sum': '$old' } } }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            let map;
            if (!purchaseOrderModel || purchaseOrderModel.length === 0) {
                return map = {
                    new: 'new',
                    new_value: 0,
                    old: 'old',
                    old_value: 0,
                };
            } else {
                if (purchaseOrderModel.length === 1) {
                    if (purchaseOrderModel[0]._id === 'new') {
                        map = {
                            new: purchaseOrderModel[0]._id,
                            new_value: purchaseOrderModel[0].new,
                            old: 'old',
                            old_value: 0,
                        }
                    } else {
                        map = {
                            new: 'new',
                            new_value: 0,
                            old: purchaseOrderModel[0]._id,
                            old_value: purchaseOrderModel[0].old
                        }
                    }
                } else {
                    if (purchaseOrderModel[0]._id === 'new') {
                        map = {
                            new: purchaseOrderModel[0]._id,
                            new_value: purchaseOrderModel[0].new,
                            old: purchaseOrderModel[1]._id,
                            old_value: purchaseOrderModel[1].old
                        }
                    } else {
                        map = {
                            new: purchaseOrderModel[1]._id,
                            new_value: purchaseOrderModel[1].new,
                            old: purchaseOrderModel[0]._id,
                            old_value: purchaseOrderModel[0].old
                        }
                    }
                }
            }
            return map;

        }

        const revenues_patient_aging_group_by_gender = async () => {
            if (!agentid || typeof agentid !== 'object') {
                purchaseOrderModel_match_agen = {}
            } else {
                purchaseOrderModel_match_agen = {
                    '$or': [
                        {
                            'l_casepatient._ref_agent_userstoreid': agentid
                        }, {
                            'l_casepatient._ref_agent_userid_create': agentid
                        }
                    ]
                }
            }
            const purchaseOrderModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    { '$match': match },
                    { '$match': { 'create_date_string': { '$gte': chack_date_start, '$lte': chack_date_end } } },
                    { '$lookup': { 'from': 'l_casepatient', 'localField': '_ref_casepatinetid', 'foreignField': '_id', 'as': 'l_casepatient' } },
                    {
                        '$unwind': {
                            'path': '$l_casepatient',
                            'includeArrayIndex': 'l_casepatient_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    'l_casepatient_index': null
                                }, {
                                    'l_casepatient_index': 0
                                }
                            ]
                        }
                    },
                    { '$lookup': { 'from': 'm_patients', 'localField': 'l_casepatient._ref_patient_userid', 'foreignField': '_id', 'as': 'm_patients' } },
                    { '$unwind': { 'path': '$m_patients' } },
                    {
                        '$unwind': {
                            'path': '$m_patients.store',
                            'includeArrayIndex': 'store_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    'store_index': null
                                }, {
                                    'store_index': 0
                                }
                            ]
                        }
                    },
                    { '$match': purchaseOrderModel_match_agen },
                    {
                        '$match': {
                            '_ref_storeid': storeid,
                            'm_patients.store._storeid': storeid,
                            'l_casepatient._ref_storeid': storeid
                        }
                    },
                    { '$addFields': { 'bdate': { '$dateFromString': { 'dateString': '$m_patients.store.personal.birth_date', 'format': '%Y/%m/%d' } } } },
                    { '$addFields': { 'age': { '$trunc': [{ '$let': { 'vars': { 'diff': { '$subtract': [new Date(), '$bdate'] } }, 'in': { '$divide': ['$$diff', (365 * 24 * 60 * 60 * 1000)] } } }, 0] } } },
                    {
                        '$match': {
                            'count_course_list': 1
                        }
                    },
                    { '$project': { '_ref_storeid': '$_ref_storeid', '_ref_branchid': '$_ref_branchid', 'totel': { '$sum': ['$price_product_list_total_discount', '$price_course_list_total_discount'] }, 'sex': '$m_patients.store.personal.gender', 'name': '$m_course.name', 'age': '$age', 'age_day': '$bdate', 'S0307': { '$cond': [{ '$and': [{ '$gte': ['$age', 1] }, { '$lte': ['$age', 6] }] }, 1, 0] }, 'S0812': { '$cond': [{ '$and': [{ '$gte': ['$age', 7] }, { '$lte': ['$age', 12] }] }, 1, 0] }, 'S1318': { '$cond': [{ '$and': [{ '$gte': ['$age', 13] }, { '$lte': ['$age', 18] }] }, 1, 0] }, 'S1935': { '$cond': [{ '$and': [{ '$gte': ['$age', 19] }, { '$lte': ['$age', 35] }] }, 1, 0] }, 'S3660': { '$cond': [{ '$and': [{ '$gte': ['$age', 36] }, { '$lte': ['$age', 60] }] }, 1, 0] }, 'S0061': { '$cond': [{ '$gte': ['$age', 61] }, 1, 0] }, 'not': { '$cond': [{ '$lte': ['$age', 0] }, 1, 0] } } },
                    { '$group': { '_id': '$sex', 'sum': { '$sum': '$totel' }, 'Beetween03And07': { '$sum': '$S0307' }, 'Beetween08And12': { '$sum': '$S0812' }, 'Beetween13And18': { '$sum': '$S1318' }, 'Beetween19And35': { '$sum': '$S1935' }, 'Beetween36And60': { '$sum': '$S3660' }, 'Above60': { '$sum': '$S0061' }, 'not': { '$sum': '$not' } } }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            let data = [];
            if (!purchaseOrderModel || purchaseOrderModel.length === 0) {
                data[0] = {
                    sex: 'ไม่พบข้อมูล',
                    Beetween01And06: 0,
                    Beetween07And12: 0,
                    Beetween13And18: 0,
                    Beetween19And35: 0,
                    Beetween36And60: 0,
                    Above60: 0,
                    ungroup: 0
                };
                return data
            } else {
                const lengths = purchaseOrderModel.length;
                for (let index = 0; index < lengths; index++) {
                    data[index] = {
                        sex: purchaseOrderModel[index]._id,
                        Beetween01And06: purchaseOrderModel[index].Beetween03And07,
                        Beetween07And12: purchaseOrderModel[index].Beetween08And12,
                        Beetween13And18: purchaseOrderModel[index].Beetween13And18,
                        Beetween19And35: purchaseOrderModel[index].Beetween19And35,
                        Beetween36And60: purchaseOrderModel[index].Beetween36And60,
                        Above60: purchaseOrderModel[index].Above60,
                        ungroup: purchaseOrderModel[index].not
                    }

                }
                return data
            }
        }

        const revenues_Orthopedics_or_Neurological = async () => {
            const chackMonthOrYear = require('./chackMonthOrYear');
            const chackWeekOfMouth = require('./chackWeekOfMouth')
            const weeks = await chackWeekOfMouth(1, chack_date_start, chack_date_end, (err) => { if (err) { callback(err); return; } });
            let P_start, P_end;
            let map = []
            if (!agentid || typeof agentid !== 'object') {
                purchaseOrderModel_match_agen = {}
            } else {
                purchaseOrderModel_match_agen = {
                    '$or': [
                        {
                            'l_casepatient._ref_agent_userstoreid': agentid
                        }, {
                            'l_casepatient._ref_agent_userid_create': agentid
                        }
                    ]
                }
            }
            // if (+data.todate === 0) {
            const mouth_string = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
            for (let index = 0; index < 12; index++) {
                P_start = moment().month(index).startOf('month').format('YYYY-MM-DD');
                P_end = moment().month(index).endOf('month').format('YYYY-MM-DD');
                const purchaseOrderModel = await mongodbController.purchaseOrderModel.aggregate(
                    [
                        { '$match': match },
                        { '$match': { 'create_date_string': { '$gte': P_start, '$lte': P_end } } },
                        { '$lookup': { 'from': 'l_casepatient', 'localField': '_ref_casepatinetid', 'foreignField': '_id', 'as': 'l_casepatient' } },
                        {
                            '$unwind': {
                                'path': '$l_casepatient',
                                'includeArrayIndex': 'l_casepatient_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$match': {
                                '$or': [
                                    {
                                        'l_casepatient_index': null
                                    }, {
                                        'l_casepatient_index': 0
                                    }
                                ]
                            }
                        },
                        { '$match': purchaseOrderModel_match_agen }, {
                            '$match': {
                                '_ref_storeid': storeid,
                                'l_casepatient._ref_storeid': storeid
                            }
                        },
                        {
                            '$match': {
                                'count_course_list': 1
                            }
                        },
                        { '$project': { '_casemaintypename': '$l_casepatient._casemaintypename', 'sum': '$price_total_after' } },
                        { '$group': { '_id': '$_casemaintypename', 'sum': { '$sum': '$sum' } } }
                    ],
                    (err) => { if (err) { callback(err); return; } }
                );
                if (!purchaseOrderModel || purchaseOrderModel.length === 0) {
                    map[index] = {
                        day: mouth_string[index],
                        Orthopedics_name: 'Orthopedics',
                        Orthopedics_value: 0,
                        Neurological_name: 'Neurological',
                        Neurological_value: 0,
                    }
                } else {
                    if (purchaseOrderModel.length === 1) {
                        if (purchaseOrderModel[0]._id === 'Orthopedics') {
                            map[index] = {
                                day: mouth_string[index],
                                Orthopedics_name: purchaseOrderModel[0]._id,
                                Orthopedics_value: purchaseOrderModel[0].sum,
                                Neurological_name: 'Neurological',
                                Neurological_value: 0,
                            }
                        } else {
                            map[index] = {
                                day: mouth_string[index],
                                Orthopedics_name: 'Orthopedics',
                                Orthopedics_value: 0,
                                Neurological_name: purchaseOrderModel[0]._id,
                                Neurological_value: purchaseOrderModel[0].sum
                            }
                        }
                    } else {
                        if (purchaseOrderModel[0]._id === 'Orthopedics') {
                            map[index] = {
                                day: mouth_string[index],
                                Orthopedics_name: purchaseOrderModel[0]._id,
                                Orthopedics_value: purchaseOrderModel[0].sum,
                                Neurological_name: purchaseOrderModel[1]._id,
                                Neurological_value: purchaseOrderModel[1].sum
                            }
                        } else {
                            map[index] = {
                                day: mouth_string[index],
                                Orthopedics_name: purchaseOrderModel[1]._id,
                                Orthopedics_value: purchaseOrderModel[1].sum,
                                Neurological_name: purchaseOrderModel[0]._id,
                                Neurological_value: purchaseOrderModel[0].sum
                            }
                        }
                    }
                }
            }
            return map
            // } else {
            //     for (let index = 0, length = weeks.length; index < length; index++) {
            //         const purchaseOrderModel = await mongodbController.purchaseOrderModel.aggregate(
            //             [
            //                 { '$match': match },
            //                 { '$match': { 'create_date_string': { '$gte': weeks[index].P_start, '$lte': weeks[index].P_end } } },
            //                 { '$lookup': { 'from': 'l_casepatient', 'localField': '_ref_casepatinetid', 'foreignField': '_id', 'as': 'l_casepatient' } },
            //                 { '$unwind': { 'path': '$l_casepatient' } },
            //                 { '$match': purchaseOrderModel_match_agen },
            //                 { '$project': { '_casemaintypename': '$l_casepatient._casemaintypename', 'sum': { '$sum': ['$price_course_list_total_discount', '$price_product_list_total_discount'] } } },
            //                 { '$group': { '_id': '$_casemaintypename', 'sum': { '$sum': '$sum' } } }
            //             ],
            //             (err) => { if (err) { callback(err); return; } }
            //         );
            //         if (!purchaseOrderModel || purchaseOrderModel.length === 0) {// ในกรณีที่หายอดขายของปีที่เเล้วไม่เจอ ให้ยอดขายของปีที่แล้วเท่ากับ 0 
            //             map[index] = {
            //                 day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
            //                 Orthopedics_name: 'Orthopedics',
            //                 Orthopedics_value: 0,
            //                 Neurological_name: 'Neurological',
            //                 Neurological_value: 0,
            //             }
            //         } else {
            //             if (purchaseOrderModel.length === 1) {
            //                 if (purchaseOrderModel[0]._id === 'Orthopedics') {
            //                     map[index] = {
            //                         day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
            //                         Orthopedics_name: purchaseOrderModel[0]._id,
            //                         Orthopedics_value: purchaseOrderModel[0].sum,
            //                         Neurological_name: 'Neurological',
            //                         Neurological_value: 0,
            //                     }
            //                 } else {
            //                     map[index] = {
            //                         day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
            //                         Orthopedics_name: 'Orthopedics',
            //                         Orthopedics_value: 0,
            //                         Neurological_name: purchaseOrderModel[0]._id,
            //                         Neurological_value: purchaseOrderModel[0].sum
            //                     }
            //                 }
            //             } else {
            //                 if (purchaseOrderModel[0]._id === 'Orthopedics') {
            //                     map[index] = {
            //                         day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
            //                         Orthopedics_name: purchaseOrderModel[0]._id,
            //                         Orthopedics_value: purchaseOrderModel[0].sum,
            //                         Neurological_name: purchaseOrderModel[1]._id,
            //                         Neurological_value: purchaseOrderModel[1].sum
            //                     }
            //                 } else {
            //                     map[index] = {
            //                         day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
            //                         Orthopedics_name: purchaseOrderModel[1]._id,
            //                         Orthopedics_value: purchaseOrderModel[1].sum,
            //                         Neurological_name: purchaseOrderModel[0]._id,
            //                         Neurological_value: purchaseOrderModel[0].sum
            //                     }
            //                 }
            //             }
            //         }
            //         return map
            //     }
            // }
        }
        const new_patient_by_request = async () => {
            if (!agentid || typeof agentid !== 'object') {
                purchaseOrderModel_match_agen = {}
            } else {
                purchaseOrderModel_match_agen = {
                    '$or': [
                        {
                            'l_casepatient._ref_agent_userstoreid': agentid
                        }, {
                            'l_casepatient._ref_agent_userid_create': agentid
                        }
                    ]
                }
            }
            const purchaseOrderModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    { '$match': match },
                    { '$match': { 'create_date_string': { '$gte': chack_date_start, '$lte': chack_date_end } } },
                    { '$lookup': { 'from': 'l_casepatient', 'localField': '_ref_casepatinetid', 'foreignField': '_id', 'as': 'l_casepatient' } },
                    {
                        '$unwind': {
                            'path': '$l_casepatient',
                            'includeArrayIndex': 'l_casepatient_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            '$or': [
                                {
                                    'l_casepatient_index': null
                                }, {
                                    'l_casepatient_index': 0
                                }
                            ]
                        }
                    },
                    { '$lookup': { 'from': 'm_patients', 'localField': 'l_casepatient._ref_patient_userid', 'foreignField': '_id', 'as': 'm_patients' } },
                    { '$unwind': { 'path': '$m_patients' } },
                    {
                        '$unwind': {
                            'path': '$m_patients.store',
                            'includeArrayIndex': 'm_patients_store_indexa',
                            'preserveNullAndEmptyArrays': true
                        }
                    },  {
                        '$match': {
                            '$or': [
                                {
                                    'm_patients_store_indexa': null
                                }, {
                                    'm_patients_store_indexa': 0
                                }
                            ]
                        }
                    },
                    {
                        '$match': {
                            '_ref_storeid': storeid,
                            'm_patients.store._storeid': storeid,
                            'l_casepatient._ref_storeid': storeid
                        }
                    },
                    { '$match': purchaseOrderModel_match_agen },
                    { '$group': { '_id': '$m_patients.store.personal.vip_agent._agentid', 'count': { '$sum': 1 } } }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            let map;
            if (!purchaseOrderModel || purchaseOrderModel.length === 0) {
                return map = {
                    request: 'request',
                    count_request: 0,
                    not_request: 'not_request',
                    count_not_request: 0
                }
            } else {
                const length = purchaseOrderModel.length;
                for (let index = 0; index < length; index++) {
                    if (index === 0) {
                        if (purchaseOrderModel[index]._id === null) {
                            map = {
                                request: 'request',
                                count_request: 0,
                                not_request: 'not_request',
                                count_not_request: purchaseOrderModel[index].count
                            }
                        } else {
                            map = {
                                request: 'request',
                                count_request: purchaseOrderModel[index].count,
                                not_request: 'not_request',
                                count_not_request: 0
                            }
                        }
                    } else {
                        if (purchaseOrderModel[index]._id === null) {
                            map = {
                                request: 'request',
                                count_request: map.count_request,
                                not_request: 'not_request',
                                count_not_request: purchaseOrderModel[index].count + map.count_not_request
                            }
                        } else {
                            map = {
                                request: 'request',
                                count_request: purchaseOrderModel[index].count + map.count_request,
                                not_request: 'not_request',
                                count_not_request: map.count_not_request
                            }
                        }
                    }

                }
                return map
            }

        }

        const course_diagnosiss = async () => {
            if (!agentid || typeof agentid !== 'object') {
                purchaseOrderModel_match_agen = {}
            } else {
                purchaseOrderModel_match_agen = {
                    '$or': [
                        {
                            'l_casepatient._ref_agent_userstoreid': agentid
                        }, {
                            'l_casepatient._ref_agent_userid_create': agentid
                        }
                    ]
                }
            }
            const purchaseOrderModel = await mongodbController.treatmentModel.aggregate(
                [
                    { '$match': match },
                    {
                        '$lookup': {
                            'from': 'l_casepatient',
                            'localField': '_ref_casepatinetid',
                            'foreignField': '_id',
                            'as': 'l_casepatient'
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_casepatient',
                            'includeArrayIndex': 'l_casepatient_index_a',
                            'preserveNullAndEmptyArrays': true
                        }
                    },  {
                        '$match': {
                            '$or': [
                                {
                                    'l_casepatient_index_a': null
                                }, {
                                    'l_casepatient_index_a': 0
                                }
                            ]
                        }
                    },
                    { '$lookup': { 'from': 'l_casepatient_stage_3', 'localField': '_ref_casepatinetid', 'foreignField': '_ref_casepatinetid', 'as': 'l_casepatient_stage_3' } },
                    {
                        '$unwind': {
                            'path': '$l_casepatient_stage_3',
                            'includeArrayIndex': 'l_casepatient_stage_3_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    },
                    {
                        '$match': {
                            '$or': [
                                {
                                    'l_casepatient_stage_3_index': null
                                }, {
                                    'l_casepatient_stage_3_index': 0
                                }
                            ]
                        }
                    },
                    { '$match': purchaseOrderModel_match_agen },
                    { '$project': { 'totel': { '$sum': ['$price_product_list_total_discount', '$price_course_list_total_discount'] }, 'pt_diagnosis': { '$switch': { 'branches': [{ 'case': { '$ne': ['$l_casepatient_stage_3.stage3data.ortho.upper', null] }, 'then': '$l_casepatient_stage_3.stage3data.ortho.upper.pt_diagnosis' }, { 'case': { '$ne': ['$l_casepatient_stage_3.stage3data.ortho.lower', null] }, 'then': '$l_casepatient_stage_3.stage3data.ortho.lower.pt_diagnosis' }, { 'case': { '$ne': ['$l_casepatient_stage_3.stage3data.ortho.trunk_spine', null] }, 'then': '$l_casepatient_stage_3.stage3data.ortho.trunk_spine.pt_diagnosis' }, { 'case': { '$ne': ['$l_casepatient_stage_3.stage3data.ortho.general', null] }, 'then': '$l_casepatient_stage_3.stage3data.ortho.general.pt_diagnosis' }] } }, 'store_storeid': '$m_patients.store._storeid', '_ref_storeid': '$_ref_storeid', '_ref_branchid': '$_ref_branchid', 'sex': '$m_patients.store.personal.gender', 'create_date_string': 1, 'group': 'ortho' } },
                    { '$project': { 'M1': { '$cond': [{ '$and': [{ '$gte': ['$create_date_string', moment().format('YYYY') + '-01-01'] }, { '$lte': ['$create_date_string', moment().format('YYYY') + '-01-31'] }] }, 1, 0] }, 'M2': { '$cond': [{ '$and': [{ '$gte': ['$create_date_string', moment().format('YYYY') + '-02-01'] }, { '$lte': ['$create_date_string', moment().format('YYYY') + '-02-29'] }] }, 1, 0] }, 'M3': { '$cond': [{ '$and': [{ '$gte': ['$create_date_string', moment().format('YYYY') + '-03-01'] }, { '$lte': ['$create_date_string', moment().format('YYYY') + '-03-31'] }] }, 1, 0] }, 'M4': { '$cond': [{ '$and': [{ '$gte': ['$create_date_string', moment().format('YYYY') + '-04-01'] }, { '$lte': ['$create_date_string', moment().format('YYYY') + '-04-30'] }] }, 1, 0] }, 'M5': { '$cond': [{ '$and': [{ '$gte': ['$create_date_string', moment().format('YYYY') + '-05-01'] }, { '$lte': ['$create_date_string', moment().format('YYYY') + '-05-31'] }] }, 1, 0] }, 'M6': { '$cond': [{ '$and': [{ '$gte': ['$create_date_string', moment().format('YYYY') + '-06-01'] }, { '$lte': ['$create_date_string', moment().format('YYYY') + '-06-30'] }] }, 1, 0] }, 'M7': { '$cond': [{ '$and': [{ '$gte': ['$create_date_string', moment().format('YYYY') + '-07-01'] }, { '$lte': ['$create_date_string', moment().format('YYYY') + '-07-31'] }] }, 1, 0] }, 'M8': { '$cond': [{ '$and': [{ '$gte': ['$create_date_string', moment().format('YYYY') + '-08-01'] }, { '$lte': ['$create_date_string', moment().format('YYYY') + '-08-31'] }] }, 1, 0] }, 'M9': { '$cond': [{ '$and': [{ '$gte': ['$create_date_string', moment().format('YYYY') + '-09-01'] }, { '$lte': ['$create_date_string', moment().format('YYYY') + '-09-30'] }] }, 1, 0] }, 'M10': { '$cond': [{ '$and': [{ '$gte': ['$create_date_string', moment().format('YYYY') + '-10-01'] }, { '$lte': ['$create_date_string', moment().format('YYYY') + '-10-31'] }] }, 1, 0] }, 'M11': { '$cond': [{ '$and': [{ '$gte': ['$create_date_string', moment().format('YYYY') + '-11-01'] }, { '$lte': ['$create_date_string', moment().format('YYYY') + '-11-30'] }] }, 1, 0] }, 'M12': { '$cond': [{ '$and': [{ '$gte': ['$create_date_string', moment().format('YYYY') + '-12-01'] }, { '$lte': ['$create_date_string', moment().format('YYYY') + '-12-31'] }] }, 1, 0] }, 'name': '$pt_diagnosis', 'totel': '$totel', 'sex': '$sex', 'group': 1 } },
                    { '$project': { 'M1': 1, 'M2': 1, 'M3': 1, 'M4': 1, 'M5': 1, 'M6': 1, 'M7': 1, 'M8': 1, 'M9': 1, 'M10': 1, 'M11': 1, 'M12': 1, 'sum': { '$sum': ['$M1', '$M2', '$M3', '$M4', '$M5', '$M6', '$M7', '$M8', '$M9', '$M10', '$M11', '$M12'] }, 'name': 1, 'group': 1 } },
                    { '$group': { '_id': { 'name': '$name', 'group': '$group' }, 'M1': { '$sum': '$M1' }, 'M2': { '$sum': '$M2' }, 'M3': { '$sum': '$M3' }, 'M4': { '$sum': '$M4' }, 'M5': { '$sum': '$M5' }, 'M6': { '$sum': '$M6' }, 'M7': { '$sum': '$M7' }, 'M8': { '$sum': '$M8' }, 'M9': { '$sum': '$M9' }, 'M10': { '$sum': '$M10' }, 'M11': { '$sum': '$M11' }, 'M12': { '$sum': '$M12' }, 'sum': { '$sum': '$sum' } } }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            let map = [];
            if (!purchaseOrderModel || purchaseOrderModel.length === 0) {// ในกรณีที่หายอดขายของปีที่เเล้วไม่เจอ ให้ยอดขายของปีที่แล้วเท่ากับ 0 
                map[0] = {
                    name: "ไม่พบข้อมูล",
                    group: "ไม่พบกลุ่มข้อมูล",
                    M1: 0,
                    M2: 0,
                    M3: 0,
                    M4: 0,
                    M5: 0,
                    M6: 0,
                    M7: 0,
                    M8: 0,
                    M9: 0,
                    M10: 0,
                    M11: 0,
                    M12: 0,
                    sum: 0
                }
            } else {
                for (let index = 0, length = purchaseOrderModel.length; index < length; index++) {
                    map[index] = {
                        name: purchaseOrderModel[index]._id.name,
                        group: purchaseOrderModel[index]._id.group,
                        M1: purchaseOrderModel[index].M1,
                        M2: purchaseOrderModel[index].M2,
                        M3: purchaseOrderModel[index].M3,
                        M4: purchaseOrderModel[index].M4,
                        M5: purchaseOrderModel[index].M5,
                        M6: purchaseOrderModel[index].M6,
                        M7: purchaseOrderModel[index].M7,
                        M8: purchaseOrderModel[index].M8,
                        M9: purchaseOrderModel[index].M9,
                        M10: purchaseOrderModel[index].M10,
                        M11: purchaseOrderModel[index].M11,
                        M12: purchaseOrderModel[index].M12,
                        sum: purchaseOrderModel[index].sum
                    }
                }
            }
            return map
        }


        const Count_Patinet = async () => {
            let mach, group
            if (!branchid) {
                mach = {
                    'store._storeid': storeid,
                    'store.userRegisterDate': {
                        '$gte': chack_date_start,
                        '$lte': chack_date_end
                    }
                }
                group = {
                    '_storeid': '$store._storeid'
                }
            } else {
                mach = {
                    'store._storeid': storeid,
                    'store.register_from_branch': branchid,
                    'store.userRegisterDate': {
                        '$gte': chack_date_start,
                        '$lte': chack_date_end
                    }
                }
                group = {
                    '_storeid': '$store._storeid',
                    'register_from_branch': '$store.register_from_branch'
                }
            }

            const find_PatientBranch = await mongodbController.patientModel.aggregate(
                [
                    {
                        '$match': mach
                    },
                    {
                        '$unwind': {
                            'path': '$store',
                            'includeArrayIndex': 'store_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, 
                    {
                        '$match': mach
                    }, {
                        '$group': {
                            '_id': storeid,
                            'count': {
                                '$sum': 1
                            }
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            if (find_PatientBranch.length === 0) {
                return 0;//`new_patient cannot find in patientModel`;
            } else {
                return find_PatientBranch.pop().count;
            }
        };
        
        const visit_patients_revenues = await fn_visit_patients_revenues()
        const all_visit_patients_revenues = await count_all_patient()
        let map;
        map = {
            start: chack_date_start,
            end: chack_date_end,
            count_all_patient: [{
                _id: all_visit_patients_revenues[0]._id,
                count: await Count_Patinet()
            }],
            count_visit: [{
                _id: all_visit_patients_revenues[0]._id,
                count: all_visit_patients_revenues[0].count_visit
            }],
            totel_income: [{
                _id: all_visit_patients_revenues[0]._id,
                sum: all_visit_patients_revenues[0].revenues
            }],
            revenues_old_new_patient: {
                new: visit_patients_revenues.new,
                new_value: visit_patients_revenues.new_value,
                old: visit_patients_revenues.old,
                old_value: visit_patients_revenues.old_value,
            },
            revenues_sum_avg: await revenues_sum_avg(),
            count_old_new_patient: {
                new: visit_patients_revenues.new,
                new_value: visit_patients_revenues.new_count_visit,
                old: visit_patients_revenues.old,
                old_value: visit_patients_revenues.old_count_visit
            },
            revenues_patient_aging_group_by_gender: await revenues_patient_aging_group_by_gender(),
            revenues_Orthopedics_or_Neurological: await revenues_Orthopedics_or_Neurological(),
            new_patient_by_request: await new_patient_by_request(),
            course_diagnosiss: await course_diagnosiss(),
        }
        callback(null);
        return map;
    }
}

module.exports = view_revenues_By_PT_Controller;
