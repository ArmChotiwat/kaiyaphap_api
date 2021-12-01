const view_Therapist_Dashboard_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''), // ค่าเริ่มต้นเป็นค่า null อยู่ใน type string "null"
        todate: new String(''), // 0 == YTD , 1 == MTD 
    }, callback = (err = new Err) => { }
) => {
    const hader = 'view_Therapist_Dashboard_Controller';
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
            callback(new Error(` ${hader} : todate most be 0 , 1  `)); return;
        }

        const chack_date_start = await chackMonthOrYear.chack_date_start({ Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
        const p_chack_date_start = await chackMonthOrYear.p_chack_date_start({ date: chack_date_start, Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
        const chack_date_end = await chackMonthOrYear.chack_date_end({ Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
        const p_chack_date_end = await chackMonthOrYear.p_chack_date_end({ date: chack_date_end, Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });

        let match;
        if (!branchid) {
            match = { '_ref_storeid': storeid }
        } else {
            match = { '_ref_storeid': storeid, '_ref_branchid': branchid }
        }

        const count_new_patient = async () => {
            let match_patientModel;
            if (!branchid) {
                match_patientModel = { 'store._storeid': storeid }
            } else {
                match_patientModel = { 'store._storeid': storeid, 'store.register_from_branch': branchid }
            }
            const patientModel = await mongodbController.patientModel.aggregate(
                [
                    { '$match': match_patientModel },
                    {
                        '$unwind': {
                            'path': '$store',
                            'includeArrayIndex': 'store_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    },
                    { '$match': match_patientModel },
                    { '$match': { 'store.userRegisterDate': { '$gte': chack_date_start, '$lte': chack_date_end } } },
                    { '$group': { '_id': '$store._storeid', 'count': { '$sum': 1 } } }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            if (!patientModel || patientModel.length === 0) {
                return 0;
            } else {
                return patientModel[0].count
            }
        }
        const revenues_old_new_patient = async () => {
            const purchaseOrderModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    { '$match': match },
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
                            'includeArrayIndex': 'l_casepatient_index',
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
                                    'm_patients_store_index': null
                                }, {
                                    'm_patients_store_index': 0
                                }
                            ]
                        }
                    }, {
                        '$group': {
                            '_id': '$l_casepatient._ref_patient_userid',
                            'price_course_list_total': {
                                '$sum': 1
                            },
                            'price_course_list_totals': {
                                '$sum': '$price_total_after'
                            }
                        }
                    }, {
                        '$project': {
                            'new': {
                                '$switch': {
                                    'branches': [
                                        {
                                            'case': {
                                                '$lte': [
                                                    '$price_course_list_total', 1
                                                ]
                                            },
                                            'then': '$price_course_list_totals'
                                        }
                                    ],
                                    'default': 0
                                }
                            },
                            'old': {
                                '$switch': {
                                    'branches': [
                                        {
                                            'case': {
                                                '$gte': [
                                                    '$price_course_list_total', 2
                                                ]
                                            },
                                            'then': '$price_course_list_totals'
                                        }
                                    ],
                                    'default': 0
                                }
                            },
                            'name': {
                                '$switch': {
                                    'branches': [
                                        {
                                            'case': {
                                                '$gte': [
                                                    '$price_course_list_total', 2
                                                ]
                                            },
                                            'then': 'old'
                                        }
                                    ],
                                    'default': 'new'
                                }
                            }
                        }
                    }, {
                        '$group': {
                            '_id': '$name',
                            'new': {
                                '$sum': '$new'
                            },
                            'old': {
                                '$sum': '$old'
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
        const revenues_sum_avg = async () => {
            let paramiter
            if (+data.todate === 0) {
                paramiter = 12
            } else {
                paramiter = Number(moment().endOf('month').format('DD'))
            }
            const purchaseOrderModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    { '$match': match },
                    { '$match': { 'create_date_string': { '$gte': chack_date_start, '$lte': chack_date_end } } },
                    { '$project': { '_id': '$_ref_storeid', 'sum': { '$sum': ['$price_course_list_total_discount', '$price_product_list_total_discount'] }, 'avg': { '$sum': ['$price_course_list_total_discount', '$price_product_list_total_discount'] } } },
                    { '$group': { '_id': '$_ref_storeid', 'sum': { '$sum': '$sum' } } }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            if (!purchaseOrderModel || purchaseOrderModel.length === 0) {
                return {
                    sum: 0,
                    avg: 0
                };
            } else {
                let avg = await purchaseOrderModel[0].sum / paramiter
                return {
                    sum: purchaseOrderModel[0].sum,
                    avg: avg
                };
            }
        }

        const proportion_revenues_by_department = async () => {
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
                    }, {
                        '$match': {
                            'l_casepatient._casemaintypename': {
                                '$ne': null
                            }
                        }
                    },
                    { '$project': { '_casemaintypename': '$l_casepatient._casemaintypename', 'sum': { '$sum': '$price_total_after' } } },
                    { '$group': { '_id': '$_casemaintypename', 'sum': { '$sum': '$sum' } } }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            let map;
            if (!purchaseOrderModel || purchaseOrderModel.length === 0) {
                return {
                    Orthopedics_name: 'Orthopedics',
                    Orthopedics_value: 0,
                    Neurological_name: 'Neurological',
                    Neurological_value: 0,
                };
            } else {
                if (purchaseOrderModel.length === 1) {
                    if (purchaseOrderModel[0]._id === 'Orthopedics') {
                        map = {
                            Orthopedics_name: purchaseOrderModel[0]._id,
                            Orthopedics_value: purchaseOrderModel[0].sum,
                            Neurological_name: 'Neurological',
                            Neurological_value: 0,
                        }
                    } else {
                        map = {
                            Orthopedics_name: 'Orthopedics',
                            Orthopedics_value: 0,
                            Neurological_name: purchaseOrderModel[0]._id,
                            Neurological_value: purchaseOrderModel[0].sum
                        }
                    }
                } else {
                    if (purchaseOrderModel[0]._id === 'Orthopedics') {
                        map = {
                            Orthopedics_name: purchaseOrderModel[0]._id,
                            Orthopedics_value: purchaseOrderModel[0].sum,
                            Neurological_name: purchaseOrderModel[1]._id,
                            Neurological_value: purchaseOrderModel[1].sum
                        }
                    } else {
                        map = {
                            Orthopedics_name: purchaseOrderModel[1]._id,
                            Orthopedics_value: purchaseOrderModel[1].sum,
                            Neurological_name: purchaseOrderModel[0]._id,
                            Neurological_value: purchaseOrderModel[0].sum
                        }
                    }
                }
                return map;
            }
        }

        const revenues_patient_aging_group_by_gender = async () => {
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
                            'includeArrayIndex': 'm_patients_store_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    },
                    {
                        '$match': {
                            'm_patients_store_index': 0
                        }
                    },
                    { '$match': { '_ref_storeid': storeid, 'm_patients.store._storeid': storeid } },
                    { '$addFields': { 'bdate': { '$dateFromString': { 'dateString': '$m_patients.store.personal.birth_date', 'format': '%Y/%m/%d' } } } },
                    { '$addFields': { 'age': { '$trunc': [{ '$let': { 'vars': { 'diff': { '$subtract': [new Date(), '$bdate'] } }, 'in': { '$divide': ['$$diff', (365 * 24 * 60 * 60 * 1000)] } } }, 0] } } },
                    { '$project': { '_ref_storeid': '$_ref_storeid', '_ref_branchid': '$_ref_branchid', 'totel': { '$sum': ['$price_product_list_total_discount', '$price_course_list_total_discount'] }, 'sex': '$m_patients.store.personal.gender', 'name': '$m_course.name', 'age': '$age', 'age_day': '$bdate', 'S0307': { '$cond': [{ '$and': [{ '$gte': ['$age', 1] }, { '$lte': ['$age', 6] }] }, { '$sum': ['$price_product_list_total_discount', '$price_course_list_total_discount'] }, 0] }, 'S0812': { '$cond': [{ '$and': [{ '$gte': ['$age', 7] }, { '$lte': ['$age', 12] }] }, { '$sum': ['$price_product_list_total_discount', '$price_course_list_total_discount'] }, 0] }, 'S1318': { '$cond': [{ '$and': [{ '$gte': ['$age', 13] }, { '$lte': ['$age', 18] }] }, { '$sum': ['$price_product_list_total_discount', '$price_course_list_total_discount'] }, 0] }, 'S1935': { '$cond': [{ '$and': [{ '$gte': ['$age', 19] }, { '$lte': ['$age', 35] }] }, { '$sum': ['$price_product_list_total_discount', '$price_course_list_total_discount'] }, 0] }, 'S3660': { '$cond': [{ '$and': [{ '$gte': ['$age', 36] }, { '$lte': ['$age', 60] }] }, { '$sum': ['$price_product_list_total_discount', '$price_course_list_total_discount'] }, 0] }, 'S0061': { '$cond': [{ '$gte': ['$age', 61] }, { '$sum': ['$price_product_list_total_discount', '$price_course_list_total_discount'] }, 0] }, 'not': { '$cond': [{ '$lte': ['$age', 0] }, { '$sum': ['$price_product_list_total_discount', '$price_course_list_total_discount'] }, 0] } } },
                    { '$group': { '_id': '$sex', 'sum': { '$sum': '$totel' }, 'Beetween03And07': { '$sum': '$S0307' }, 'Beetween08And12': { '$sum': '$S0812' }, 'Beetween13And18': { '$sum': '$S1318' }, 'Beetween19And35': { '$sum': '$S1935' }, 'Beetween36And60': { '$sum': '$S3660' }, 'Above60': { '$sum': '$S0061' }, 'not': { '$sum': '$not' } } }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            let data = [];
            if (!purchaseOrderModel || purchaseOrderModel.length === 0) {
                return [{
                    sex: 'ไม่พบข้อมูล',
                    Beetween01And06: 0,
                    Beetween07And12: 0,
                    Beetween13And18: 0,
                    Beetween19And35: 0,
                    Beetween36And60: 0,
                    Above60: 0,
                    ungroup: 0
                }];
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
            let mathcs, P_start, P_end;
            let map = []
            if (+data.todate === 0) {
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
                            },{
                                '$match': {
                                    'l_casepatient._casemaintypename': {
                                        '$ne': null
                                    }
                                }
                            },
                            { '$project': { '_casemaintypename': '$l_casepatient._casemaintypename', 'sum': { '$sum': '$price_total_after' } } },
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
            } else {
                for (let index = 0, length = weeks.length; index < length; index++) {
                    const purchaseOrderModel = await mongodbController.purchaseOrderModel.aggregate(
                        [
                            { '$match': match },
                            { '$match': { 'create_date_string': { '$gte': weeks[index].P_start, '$lte': weeks[index].P_end } } },
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
                            { '$project': { '_casemaintypename': '$l_casepatient._casemaintypename', 'sum': { '$sum': ['$price_course_list_total_discount', '$price_product_list_total_discount'] } } },
                            { '$group': { '_id': '$_casemaintypename', 'sum': { '$sum': '$sum' } } }
                        ],
                        (err) => { if (err) { callback(err); return; } }
                    );
                    if (!purchaseOrderModel || purchaseOrderModel.length === 0) {// ในกรณีที่หายอดขายของปีที่เเล้วไม่เจอ ให้ยอดขายของปีที่แล้วเท่ากับ 0 
                        map[index] = {
                            day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
                            Orthopedics_name: 'Orthopedics',
                            Orthopedics_value: 0,
                            Neurological_name: 'Neurological',
                            Neurological_value: 0,
                        }
                    } else {
                        if (purchaseOrderModel.length === 1) {
                            if (purchaseOrderModel[0]._id === 'Orthopedics') {
                                map[index] = {
                                    day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
                                    Orthopedics_name: purchaseOrderModel[0]._id,
                                    Orthopedics_value: purchaseOrderModel[0].sum,
                                    Neurological_name: 'Neurological',
                                    Neurological_value: 0,
                                }
                            } else {
                                map[index] = {
                                    day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
                                    Orthopedics_name: 'Orthopedics',
                                    Orthopedics_value: 0,
                                    Neurological_name: purchaseOrderModel[0]._id,
                                    Neurological_value: purchaseOrderModel[0].sum
                                }
                            }
                        } else {
                            if (purchaseOrderModel[0]._id === 'Orthopedics') {
                                map[index] = {
                                    day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
                                    Orthopedics_name: purchaseOrderModel[0]._id,
                                    Orthopedics_value: purchaseOrderModel[0].sum,
                                    Neurological_name: purchaseOrderModel[1]._id,
                                    Neurological_value: purchaseOrderModel[1].sum
                                }
                            } else {
                                map[index] = {
                                    day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
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
            }
        }
        let map;
        map = {
            start: chack_date_start,
            end: chack_date_end,
            new_patient: await count_new_patient(),
            revenues_old_new_patient: await revenues_old_new_patient(),
            revenues_sum_avg: await revenues_sum_avg(),
            revenues_by_department: await proportion_revenues_by_department(),
            revenues_patient_aging_group_by_gender: await revenues_patient_aging_group_by_gender(),
            revenues_Orthopedics_or_Neurological: await revenues_Orthopedics_or_Neurological(),
        }
        callback(null);
        return map;
    }
}

module.exports = view_Therapist_Dashboard_Controller;
