const view_Treatment_By_BodyChart_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''), // ค่าเริ่มต้นเป็นค่า null 
        Year: new String(''),
        Month: new String(''),
    }, callback = (err = new Err) => { }
) => {


    const hader = 'view_Treatment_By_BodyChart_Controller';
    if (typeof data._storeid !== 'string' || data._storeid === '' || data._storeid === null ||
        typeof data._branchid !== 'string' || data._branchid === '' || data._branchid === null ||
        typeof data.Year !== 'string' || data.Year === '' || data.Year === null ||
        typeof data.Month !== 'string' || data.Month === '' || data.Month === null
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
        const chackWeekOfMouth = require('./chackWeekOfMouth');


        let match_branchid;
        if (!branchid) {
            match_branchid = {}
        } else {
            match_branchid = { '_ref_branchid': branchid }
        }
        let start, end

        if (+data.Year >= 2020 && +data.Month >= 1 && +data.Month <= 12) {
            start = moment(data.Year + '-' + data.Month + '-01').startOf('month').format('YYYY-MM-DD');
            end = moment(start).endOf('month').format('YYYY-MM-DD');
        } else if (+data.Year >= 2020) {
            start = moment(data.Year + '-01-01').startOf('year').format('YYYY-MM-DD');
            end = moment(start).endOf('year').format('YYYY-MM-DD');
        } else {
            start = moment().format('YYYY-MM-DD');
            end = moment().format('YYYY-MM-DD');
        }

        const revenues_by_sex = async () => {
            const purchaseOrderModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    { '$match': { '_ref_storeid': storeid } },
                    { '$match': match_branchid },
                    { '$match': { 'create_date_string': { '$gte': start, '$lte': end } } },
                    { '$lookup': { 'from': 'l_casepatient', 'localField': '_ref_casepatinetid', 'foreignField': '_id', 'as': 'l_casepatient' } },
                    { '$unwind': { 'path': '$l_casepatient' } },
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
                    { '$project': { '_ref_storeid': '$_ref_storeid', '_ref_branchid': '$_ref_branchid', 'totel': { '$sum': ['$price_product_list_total_discount', '$price_course_list_total_discount'] }, 'sex': '$m_patients.store.personal.gender' } },
                    { '$group': { '_id': '$sex', 'sum': { '$sum': '$totel' } } }
                ], (err) => { if (err) { callback(err); return; } }
            );

            let map = [];

            if (!purchaseOrderModel || purchaseOrderModel.length === 0) {
                map[0] = {
                    sex: 'ไม่พบข้อมูล',
                    totel: 0
                }
                return map;
            } else {
                const length_PO = purchaseOrderModel.length
                for (let index = 0; index < length_PO; index++) {
                    map[index] = {
                        sex: purchaseOrderModel[index]._id,
                        totel: purchaseOrderModel[index].sum
                    }
                }
                return map
            }
        }

        const top_count_boby = async () => {
            const casePatientStage2Model = await mongodbController.casePatientStage2Model.aggregate(
                [
                    // { '$match': { '_ref_storeid': storeid } },
                    // { '$match': match_branchid },
                    // { '$match': { 'create_date_string': { '$gte': start, '$lte': end } } },
                    {
                        '$lookup': {
                            'from': 'l_casepatient',
                            'localField': '_ref_casepatinetid',
                            'foreignField': '_id',
                            'as': 'l_casepatient'
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_casepatient'
                        }
                    }, {
                        '$unwind': {
                            'path': '$stage2data.body_chart'
                        }
                    },
                    { '$match': { 'l_casepatient._ref_storeid': storeid } },
                    // { '$match': match_branchid },
                    { '$match': { 'l_casepatient.create_date_string': { '$gte': start, '$lte': end } } },
                    {
                        '$project': {
                            'body_name': '$stage2data.body_chart.body_name',
                            'body_name_id': '$stage2data.body_chart._id',
                            '_ref_storeid': '$l_casepatient._ref_storeid',
                            '_ref_branchid': '$l_casepatient._ref_branchid',
                            'px': '$stage2data.body_chart.pain_point_data.px',
                            'py': '$stage2data.body_chart.pain_point_data.py',
                            'patint': '$l_casepatient._ref_patient_userid',
                            'create_date_string': 1
                        }
                    },
                    { '$match': match_branchid },
                    { '$match': { '_ref_storeid': storeid } },
                    {
                        '$group': {
                            '_id': {
                                'Pa_id': '$patint',
                                'body_name': '$body_name'
                            },
                            'count': {
                                '$sum': 1
                            }
                        }
                    }, {
                        '$group': {
                            '_id': '$_id.body_name',
                            'count': {
                                '$sum': 1
                            }
                        }
                    },
                    { '$sort': { 'count': -1 } }
                ], (err) => { if (err) { callback(err); return; } }
            );

            const casePatientStage2Model_px_py = await mongodbController.casePatientStage2Model.aggregate( // มาเอาตำแหน่ง px py 
                [
                    { '$lookup': { 'from': 'l_casepatient', 'localField': '_ref_casepatinetid', 'foreignField': '_id', 'as': 'l_casepatient' } },
                    { '$unwind': { 'path': '$l_casepatient' } },
                    { '$unwind': { 'path': '$stage2data.body_chart' } },
                    { '$project': { 'body_name': '$stage2data.body_chart.body_name', 'body_name_id': '$stage2data.body_chart._id', '_ref_storeid': '$l_casepatient._ref_storeid', '_ref_branchid': '$l_casepatient._ref_branchid', 'px': '$stage2data.body_chart.pain_point_data.px', 'py': '$stage2data.body_chart.pain_point_data.py', 'create_date_string': '$l_casepatient.create_date_string' } },
                    { '$match': { '_ref_storeid': storeid } },
                    { '$match': match_branchid },
                    { '$match': { 'create_date_string': { '$gte': start, '$lte': end } } },
                ], (err) => { if (err) { callback(err); return; } }
            );

            let map = [];
            if (!casePatientStage2Model || casePatientStage2Model.length === 0 || !casePatientStage2Model_px_py) {
                map[0] = {
                    name: 'ไม่พบข้อมูล',
                    count: 0,
                    px: 0,
                    py: 0
                }
                return map;
            } else {
                for (let index = 0; index < casePatientStage2Model.length; index++) {
                    const element = casePatientStage2Model[index];
                    const p_element = casePatientStage2Model_px_py.filter(
                        where => (
                            where.body_name.toString() === element._id.toString()
                        )
                    )

                    if (p_element.length >= 1) {
                        map.push({
                            name: element._id,
                            count: element.count,
                            px: p_element[0].px,
                            py: p_element[0].py
                        })
                    } else {
                        map.push({
                            name: element._id,
                            count: element.count,
                            px: 0,
                            py: 0
                        })
                    }

                }
                return map;
            }
        }
        const top_count_boby2 = async () => {
            const casePatientStage2Model = await mongodbController.casePatientStage2Model.aggregate(
               
                [
                {
                    '$lookup': {
                        'from': 'l_casepatient',
                        'localField': '_ref_casepatinetid',
                        'foreignField': '_id',
                        'as': 'l_casepatient'
                    }
                }, {
                    '$unwind': {
                        'path': '$l_casepatient'
                    }
                }, {
                    '$unwind': {
                        'path': '$stage2data.body_chart'
                    }
                }, {
                    '$project': {
                        'pa_id': '$l_casepatient._ref_patient_userid',
                        'M1': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$create_date_string', '2020-01-01'
                                            ]
                                        }, {
                                            '$lte': [
                                                '$create_date_string', '2020-01-31'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        },
                        'M2': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$create_date_string', '2020-02-01'
                                            ]
                                        }, {
                                            '$lte': [
                                                '$create_date_string', '2020-02-29'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        },
                        'M3': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$create_date_string', '2020-03-01'
                                            ]
                                        }, {
                                            '$lte': [
                                                '$create_date_string', '2020-03-31'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        },
                        'M4': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$create_date_string', '2020-04-01'
                                            ]
                                        }, {
                                            '$lte': [
                                                '$create_date_string', '2020-04-30'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        },
                        'M5': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$create_date_string', '2020-05-01'
                                            ]
                                        }, {
                                            '$lte': [
                                                '$create_date_string', '2020-05-31'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        },
                        'M6': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$create_date_string', '2020-06-01'
                                            ]
                                        }, {
                                            '$lte': [
                                                '$create_date_string', '2020-06-30'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        },
                        'M7': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$create_date_string', '2020-07-01'
                                            ]
                                        }, {
                                            '$lte': [
                                                '$create_date_string', '2020-07-31'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        },
                        'M8': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$create_date_string', '2020-08-01'
                                            ]
                                        }, {
                                            '$lte': [
                                                '$create_date_string', '2020-08-31'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        },
                        'M9': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$create_date_string', '2020-09-01'
                                            ]
                                        }, {
                                            '$lte': [
                                                '$create_date_string', '2020-09-30'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        },
                        'M10': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$create_date_string', '2020-10-01'
                                            ]
                                        }, {
                                            '$lte': [
                                                '$create_date_string', '2020-10-31'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        },
                        'M11': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$create_date_string', '2020-11-01'
                                            ]
                                        }, {
                                            '$lte': [
                                                '$create_date_string', '2020-11-30'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        },
                        'M12': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$create_date_string', '2020-12-01'
                                            ]
                                        }, {
                                            '$lte': [
                                                '$create_date_string', '2020-12-31'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        },
                        'dayOfWeek': {
                            '$isoDayOfWeek': '$create_date'
                        },
                        'body_name': '$stage2data.body_chart.body_name',
                        '_ref_storeid': '$l_casepatient._ref_storeid',
                        '_ref_branchid': '$l_casepatient._ref_branchid',
                        'create_date_string': '$create_date_string'
                    }
                },
                { '$match': { '_ref_storeid': storeid } },
                { '$match': match_branchid },
                { '$match': { 'create_date_string': { '$gte': start, '$lte': end } } },
                {
                    '$project': {
                        'M1': 1,
                        'M2': 1,
                        'M3': 1,
                        'M4': 1,
                        'M5': 1,
                        'M6': 1,
                        'M7': 1,
                        'M8': 1,
                        'M9': 1,
                        'M10': 1,
                        'M11': 1,
                        'M12': 1,
                        'sum': {
                            '$sum': [
                                '$M1', '$M2', '$M3', '$M4', '$M5', '$M6', '$M7', '$M8', '$M9', '$M10', '$M11', '$M12'
                            ]
                        },
                        'dayOfWeek': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gt': [
                                                '$dayOfWeek', 0
                                            ]
                                        }, {
                                            '$lt': [
                                                '$dayOfWeek', 6
                                            ]
                                        }
                                    ]
                                }, 'weekday', 'weekend'
                            ]
                        },
                        'body_name': 1,
                        '_ref_storeid': 1,
                        '_ref_branchid': 1,
                        'create_date_string': 1,
                        'pa_id': 1
                    }
                }, {
                    '$group': {
                        '_id': {
                            'name': '$body_name',
                            'dayOfWeek': '$dayOfWeek',
                            'pa_id': '$pa_id'
                        },
                        'M1': {
                            '$sum': '$M1'
                        },
                        'M2': {
                            '$sum': '$M2'
                        },
                        'M3': {
                            '$sum': '$M3'
                        },
                        'M4': {
                            '$sum': '$M4'
                        },
                        'M5': {
                            '$sum': '$M5'
                        },
                        'M6': {
                            '$sum': '$M6'
                        },
                        'M7': {
                            '$sum': '$M7'
                        },
                        'M8': {
                            '$sum': '$M8'
                        },
                        'M9': {
                            '$sum': '$M9'
                        },
                        'M10': {
                            '$sum': '$M10'
                        },
                        'M11': {
                            '$sum': '$M11'
                        },
                        'M12': {
                            '$sum': '$M12'
                        },
                        'sum': {
                            '$sum': '$sum'
                        }
                    }
                }, {
                    '$project': {
                        'M1': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$M1', 0
                                    ]
                                }, 0, 1
                            ]
                        },
                        'M2': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$M2', 0
                                    ]
                                }, 0, 1
                            ]
                        },
                        'M3': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$M3', 0
                                    ]
                                }, 0, 1
                            ]
                        },
                        'M4': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$M4', 0
                                    ]
                                }, 0, 1
                            ]
                        },
                        'M5': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$M5', 0
                                    ]
                                }, 0, 1
                            ]
                        },
                        'M6': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$M6', 0
                                    ]
                                }, 0, 1
                            ]
                        },
                        'M7': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$M7', 0
                                    ]
                                }, 0, 1
                            ]
                        },
                        'M8': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$M8', 0
                                    ]
                                }, 0, 1
                            ]
                        },
                        'M9': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$M9', 0
                                    ]
                                }, 0, 1
                            ]
                        },
                        'M10': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$M10', 0
                                    ]
                                }, 0, 1
                            ]
                        },
                        'M11': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$M11', 0
                                    ]
                                }, 0, 1
                            ]
                        },
                        'M12': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$M12', 0
                                    ]
                                }, 0, 1
                            ]
                        },
                        'sum': {
                            '$cond': [
                                {
                                    '$eq': [
                                        '$sum', 0
                                    ]
                                }, 0, 1
                            ]
                        }
                    }
                }, {
                    '$group': {
                        '_id': {
                            'name': '$_id.name',
                            'dayOfWeek': '$_id.dayOfWeek'
                        },
                        'M1': {
                            '$sum': '$M1'
                        },
                        'M2': {
                            '$sum': '$M2'
                        },
                        'M3': {
                            '$sum': '$M3'
                        },
                        'M4': {
                            '$sum': '$M4'
                        },
                        'M5': {
                            '$sum': '$M5'
                        },
                        'M6': {
                            '$sum': '$M6'
                        },
                        'M7': {
                            '$sum': '$M7'
                        },
                        'M8': {
                            '$sum': '$M8'
                        },
                        'M9': {
                            '$sum': '$M9'
                        },
                        'M10': {
                            '$sum': '$M10'
                        },
                        'M11': {
                            '$sum': '$M11'
                        },
                        'M12': {
                            '$sum': '$M12'
                        },
                        'sum': {
                            '$sum': '$sum'
                        }
                    }
                }, {
                    '$sort': {
                        'sum': -1
                    }
                }
                ], (err) => { if (err) { callback(err); return; } }
            );

            let map = [];
            if (!casePatientStage2Model || casePatientStage2Model.length === 0) {
                map[0] = {
                    _id: {
                        name: 'ไม่พบข้อมูล',
                        dayOfWeek: 'ไม่พบข้อมูล'
                    },
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
                return map;
            } else {
                return casePatientStage2Model;
            }
        }

        let map;
        map = {
            start: start,
            end: end,
            revenues_by_sex: await revenues_by_sex(),
            top_count_boby: await top_count_boby(),
            count_body_pont: await top_count_boby2(),
        }

        callback(null);
        return map;
    }
}
module.exports = view_Treatment_By_BodyChart_Controller;

