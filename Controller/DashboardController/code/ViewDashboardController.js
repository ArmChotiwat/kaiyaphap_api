const View_Dashboard_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''), // ค่าเริ่มต้นเป็นค่า null 
        todate: new String(''), //  0 = YYD & 1 = MTD
    },
    callback = (err = new Err) => { }
) => {

    if (
        typeof data._storeid != 'string' || data._storeid == '' || data._storeid == null ||
        typeof data.todate != 'string' || data.todate == '' || data.todate == null
    ) {
        callback(new Error(`data Error`));
        return;
    } else {
        data.todate = +data.todate
        const mongodbController = require('../../mongodbController');
        const checkObjectId = require('../../miscController').checkObjectId

        const moment = require('moment');
        const date = moment();
        const date_string = date.format('YYYY');
        const date_string_month = date.format('MM');
        const date_string_day = date.format('DD');
        const P_date_string = +date_string - 1; // ปีที่เเล้ว 
        const P_date_string_month = +date_string_month - 2; // เดือนที่เเล้ว 
        const P_date_string_day = +date_string_day - 1;
        const mouth_string = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        let start // วันที่เริ่ม 
        let n_match, n_group, n_group_course, n_group_product, n_match_revenues, P_start, P_end, p_n_match, avg_project, avg_macth, start_treatment, number_mouth;
        const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(null); return; } });
        if (data.todate === 0) {// 0 = YYD
            start = 'year';
            start_treatment = await mongodbController.purchaseOrderModel.aggregate([
                {
                    '$match': { '_ref_storeid': _storeid, 'create_date_string': { '$gte': moment().startOf(start).format('YYYY-MM-DD'), '$lte': moment().endOf(start).format('YYYY-MM-DD') } }
                }, {
                    '$group': { '_id': null, 'min': { '$min': '$create_date_string' } }
                }
            ], (err) => { if (err) { return; } }
            );
            P_start = P_date_string.toString() + '-01-01';//วันที่เริ่มต้นของปีที่ค้นหาของปีที่เเล้ว  
            P_end = P_date_string.toString() + '-12-' + moment().endOf('month').format('DD');//วันที่สิ้นสุดของปีที่ค้นหาของปีที่เเล้ว  
            if (start_treatment.length === 0) {
                number_mouth = 1
            } else {
                number_mouth = +moment().format('MM') - +moment(start_treatment[0].min).format('MM');
            }



        } else if (data.todate === 1) {// 1 = MTD        
            start = 'month';
            number_mouth = moment().week() - moment().startOf('month').week()
            if (number_mouth == 0) { number_mouth = 1; }
            P_start = date_string.toString() + '-' + moment().month(P_date_string_month).format('MM') + '-01';// วันที่เริ่มต้นของเดือนที่เเล้ว 
            P_end = date_string.toString() + '-' + moment().month(P_date_string_month).format('MM') + '-' + moment().endOf('month').format('DD');// วันที่สิ้นสุดของเดิอนที่แล้ว
        }
        else if (data.todate === 2) {// 2 = day  
            start = 'day';
            P_start = moment().day(P_date_string_day).format('YYYY-MM-DD')
            P_end = moment().day(P_date_string_day).format('YYYY-MM-DD')
        } else {
            callback(new Error(`to datd must be 0 or 1 orly`));
            return;
        }


        if (data._branchid === null || data._branchid === '' || data._branchid === 'null') { // การค้นหาทั้งหมดเป้นการค้นหาในระดับร้าน
            n_match = {
                '$match': {
                    'store._storeid': _storeid,
                    'store.userRegisterDate': {
                        '$gte': moment().startOf(start).format('YYYY-MM-DD'),
                        '$lte': moment().endOf(start).format('YYYY-MM-DD')
                    }
                }
            }
            n_group = {
                '$group': {
                    '_id': _storeid,
                    'count': {
                        '$sum': 1
                    }
                }
            }
            n_group_course = {
                '$group': {
                    '_id': {
                        '_ref_storeid': _storeid
                    },
                    'price_course_list_total': {
                        '$sum': "$price_course_list_total_discount"
                    }
                }
            }
            n_group_product = {
                '$group': {
                    '_id': {
                        '_ref_storeid': _storeid
                    },
                    'price_product_list_total': {
                        '$sum': "$price_product_list_total_discount"
                    }
                }
            }
            n_match_revenues = {
                '$match': {
                    '_ref_storeid': _storeid,
                    'create_date_string': {
                        '$gte': moment().startOf(start).format('YYYY-MM-DD'),
                        '$lte': moment().endOf(start).format('YYYY-MM-DD')
                    }
                }
            }
            p_n_match = {
                '$match': {
                    '_ref_storeid': _storeid,
                    'create_date_string': {
                        '$gte': P_start,
                        '$lt': P_end
                    }
                }
            }

            avg_macth = {
                '$match': {
                    '_ref_storeid': _storeid,
                    'create_date_string': {
                        '$gte': moment().startOf(start).format('YYYY-MM-DD'),
                        '$lte': moment().endOf(start).format('YYYY-MM-DD')
                    }
                }
            }
        } else {// การค้นหาทั้งหมดเป้นการค้นหาในระดับสาขา 

            n_match = {
                '$match': {
                    'store._storeid': _storeid,
                    'store.register_from_branch': _branchid,
                    'store.userRegisterDate': {
                        '$gte': moment().startOf(start).format('YYYY-MM-DD'),
                        '$lte': moment().endOf(start).format('YYYY-MM-DD')
                    }
                }
            }
            n_group = {
                '$group': {
                    '_id': { '_storeid': _storeid, '_branchid': _branchid },
                    'count': {
                        '$sum': 1
                    }
                }
            }
            n_group_course = {
                '$group': {
                    '_id': {
                        '_ref_storeid': _storeid, '_branchid': _branchid
                    },
                    'price_course_list_total': {
                        '$sum': "$price_course_list_total_discount"
                    }
                }
            }
            n_group_product = {
                '$group': {
                    '_id': {
                        '_ref_storeid': _storeid, '_branchid': _branchid
                    },
                    'price_product_list_total': {
                        '$sum': "$price_product_list_total_discount"
                    }
                }
            }
            n_match_revenues = {
                '$match': {
                    '_ref_storeid': _storeid,
                    '_ref_branchid': _branchid,
                    'create_date_string': {
                        '$gte': moment().startOf(start).format('YYYY-MM-DD'),
                        '$lte': moment().endOf(start).format('YYYY-MM-DD')
                    }
                }
            }
            p_n_match = {
                '$match': {
                    '_ref_storeid': _storeid,
                    '_ref_branchid': _branchid,
                    'create_date_string': {
                        '$gte': P_start,
                        '$lt': P_end
                    }
                }
            }
            avg_macth = {
                '$match': {
                    '_ref_storeid': _storeid,
                    '_ref_branchid': _branchid,
                    'create_date_string': {
                        '$gte': moment().startOf(start).format('YYYY-MM-DD'),
                        '$lte': moment().endOf(start).format('YYYY-MM-DD')
                    }
                }
            }
        }

        /**
         * ฟังชั้นในการหาจำนวนคนไข้ ที่ลงทะเบียนใหม่ 
         * 
         * ผลลัพ => จำนวนคนไข้ 
         */
        const Count_Patinet = async () => {
            let mach, group
            if (!_branchid) {
                mach = {
                    'store._storeid': _storeid,
                    'store.userRegisterDate': {
                        '$gte': moment().startOf(start).format('YYYY-MM-DD'),
                        '$lte': moment().endOf(start).format('YYYY-MM-DD')
                    }
                }
                group = {
                    '_storeid': '$store._storeid'
                }
            } else {
                mach = {
                    'store._storeid': _storeid,
                    'store.register_from_branch': _branchid,
                    'store.userRegisterDate': {
                        '$gte': moment().startOf(start).format('YYYY-MM-DD'),
                        '$lte': moment().endOf(start).format('YYYY-MM-DD')
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
                            '_id': _storeid,
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
        /**
         * ฟังชั้น หารายได้จากการขาย course  
         * 
         * ผลลัพ => รายได้ course  
         */
        const Sum_price_course = async () => {
            let Sum_price_course_mach, Sum_price_course_id
            if (!_branchid) {
                Sum_price_course_mach = {}
                Sum_price_course_id = {
                    '_ref_storeid': _storeid
                }
            } else {
                Sum_price_course_mach = {
                    '_ref_branchid': _branchid,
                }
                Sum_price_course_id = {
                    '_ref_storeid': _storeid, '_ref_branchid': _branchid
                }
            }
            const sum_totel_revenues = await mongodbController.purchaseOrderModel.aggregate(
                [
                    {
                        '$match': {
                            '_ref_storeid': _storeid,
                            'create_date_string': {
                                '$gte': moment().startOf(start).format('YYYY-MM-DD'),
                                '$lte': moment().endOf(start).format('YYYY-MM-DD')
                            }
                        }
                    },
                    {
                        '$match': Sum_price_course_mach
                    },
                    {
                        '$group': {
                            '_id': Sum_price_course_id,
                            'price_course_list_total': {
                                '$sum': "$price_course_list_total_discount"
                            }
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            if (sum_totel_revenues.length === 0) {
                return 0;// `Sum_price_course cannot find in treatmentModel`;
            } else {
                return sum_totel_revenues.pop().price_course_list_total;
            }
        };
        /**
         * ฟังชั้น การหารายได้จากการขาย product  
         * 
         * ผลลัพ => รายได้ product  
         */
        const Sum_price_product = async () => {
            let SSum_price_product_mach, SSum_price_product_id
            if (!_branchid) {
                SSum_price_product_mach = {}
                SSum_price_product_id = {
                    '_ref_storeid': _storeid
                }
            } else {
                SSum_price_product_mach = {
                    '_ref_branchid': _branchid,
                }
                SSum_price_product_id = {
                    '_ref_storeid': _storeid, '_ref_branchid': _branchid
                }
            }
            const sum_totel_revenues = await mongodbController.purchaseOrderModel.aggregate(
                [
                    {
                        '$match': {
                            '_ref_storeid': _storeid,
                            'create_date_string': {
                                '$gte': moment().startOf(start).format('YYYY-MM-DD'),
                                '$lte': moment().endOf(start).format('YYYY-MM-DD')
                            }
                        }
                    },
                    {
                        '$match': SSum_price_product_mach
                    },
                    {
                        '$group': {
                            '_id': SSum_price_product_id,
                            'price_product_list_total': {
                                '$sum': "$price_product_list_total_discount"
                            }
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            if (sum_totel_revenues.length === 0) {
                return 0; //`Sum_price_product cannot find in treatmentModel`;
            } else {
                return sum_totel_revenues.pop().price_product_list_total;
            }
        };
        const totel_revenues = await Sum_price_course() + await Sum_price_product(); // รายได้ของการขาย คอร์ส รวมกับ รายได้ของการขาย สินค้า
        /**
         * ฟังชั้น หาอัตราการเติบโต 
         * 
         * ผลลัพ => อัตราการเติบโต 
         */
        const Growth = async () => {
            const CTD = totel_revenues;
            const sum_p_growth_totel_course = await mongodbController.purchaseOrderModel.aggregate(
                [
                    p_n_match,
                    {
                        '$project': {
                            'sum_price': {
                                '$sum': [
                                    '$price_product_list_total_discount', '$price_course_list_total_discount'
                                ]
                            }
                        }
                    }, {
                        '$group': {
                            '_id': null,
                            'totel': {
                                '$sum': '$sum_price'
                            }
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            if (sum_p_growth_totel_course.length === 0) { // ในกรณีที่หายอดขายของปีที่เเล้วไม่เจอ ให้ยอดขายของปีที่แล้วเท่ากับ 0 
                const PTD = 0; // PYD คือ ยอดยายของปีที่เเล้ว 
                const Growth_totel = (CTD - PTD) / CTD * 100;
                return Growth_totel;
            } else {
                const PTD = sum_p_growth_totel_course.pop().totel;
                const Growth_totel = (CTD - PTD) / CTD * 100;
                return Growth_totel;
            }
        };
        /**
        * ฟังชั้น หาค่าเฉลี่ยของรายได้ เป็นรายปี  
        * 
        * ผลลัพ => ค่าเฉลี่ยรายได้ 
        */
        const avg_revenues = async () => {
            let paramiter
            if (data.todate === 0) {
                paramiter = 12
            } else if (data.todate === 1) {
                paramiter = Number(moment().endOf('month').format('DD'))
            }
            const avg_revenues = await mongodbController.purchaseOrderModel.aggregate(
                [
                    avg_macth,
                    {
                        '$group': {
                            '_id': '$_ref_storeid',
                            'totel': {
                                '$sum': '$price_total_after'
                            }
                        }
                    }, {
                        '$project': {
                            'totel': '$totel'
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            if (avg_revenues.length === 0) {
                return 0; //`Sum_price_product cannot find in treatmentModel`;
            } else {
                return avg_revenues.pop().totel / paramiter;

            }
        };
        /**
        * ฟังชั้น หาค่าเฉลี่ยของรายได้ เป็นรายเดือนหรือรายอาทิตย์   
        * 
        * ผลลัพ => ค่าเฉลี่ยรายได้ 
        */
        const avg_revenues_by_month = async () => {
            // const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
            let avg_revenues_array = [];
            if (data.todate === 0) {
                for (let index = 0; index < 12; index++) {
                    P_start = moment().month(index).startOf('month').format('YYYY-MM-DD');
                    P_end = moment().month(index).endOf('month').format('YYYY-MM-DD');
                    if (!_branchid) {
                        avg_revenues_match = {
                            '$match': {
                                '_ref_storeid': _storeid,
                                'create_date_string': {
                                    '$gte': P_start,
                                    '$lt': P_end
                                }
                            }
                        }
                    } else {
                        avg_revenues_match = {
                            '$match': {
                                '_ref_storeid': _storeid,
                                '_ref_branchid': _branchid,
                                'create_date_string': {
                                    '$gte': P_start,
                                    '$lt': P_end
                                }
                            }
                        }
                    }
                    const avg_revenues = await mongodbController.purchaseOrderModel.aggregate(
                        [
                            avg_revenues_match, {
                                '$group': {
                                    '_id': '$_ref_storeid',
                                    'min_date': {
                                        '$min': {
                                            '$dayOfMonth': '$create_date'
                                        }
                                    },
                                    'max_date': {
                                        '$max': {
                                            '$dayOfMonth': '$create_date'
                                        }
                                    },
                                    'totel': {
                                        '$sum': '$price_total_after'
                                    }
                                }
                            }, {
                                '$project': {
                                    'totel': '$totel'
                                }
                            }
                        ],
                        (err) => { if (err) { callback(err); return; } }
                    );
                    if (avg_revenues.length === 0) {
                        avg_revenues_array[index] = {
                            "lebel": mouth_string[index],
                            "velue": 0
                        };
                    } else {
                        avg_revenues_array[index] = {
                            "lebel": mouth_string[index],
                            "velue": avg_revenues[0].totel / 12
                        };;
                    }
                }

            } else if (data.todate == 1) { // ค้นหาตาม วันที่ ที่ต้องการ 
                //const calender = moment();
                let project_avg_revenues, group_avg_revenues;
                const start_day_week = moment().startOf('month').week();
                const end_day_week = moment().endOf('month').week();
                let index_start_week = 1; // เลืุอกวันที่เริ่มของอาทิต 0 = วันอาทิตย์ - 6 = วันเสาร์ 
                for (let index = start_day_week, week = end_day_week; index <= week; index++) {
                    if (moment().startOf('month').day() === 0) {
                        if (index_start_week === 0) { // กรณีวันแรกเป็นวันอาทิตย์ 
                            if (index === start_day_week) { // ต้นเดือน 
                                P_start = moment().startOf('month').format('YYYY-MM-DD');
                                P_end = moment().week(index).endOf('week').format('YYYY-MM-DD');
                            } else if (index === end_day_week) {//กลางเดือน 
                                if (moment().endOf('month').day() >= index_start_week) { // กรณีกำหนดวันเริ่มต้นของอาทิตย์เกินวันสินสุดของเดิอน 
                                    P_start = moment().week(index).startOf('week').format('YYYY-MM-DD');
                                    P_end = moment().endOf('month').format('YYYY-MM-DD');
                                }
                            } else { //  สื้นเดือน 
                                P_start = moment().week(index).startOf('week').format('YYYY-MM-DD');
                                P_end = moment().week(index).endOf('week').format('YYYY-MM-DD');

                            }
                        } else { // กรณีวันแรกเป็น วันอื่น ไม่ใช่วันอาทิตย์ 
                            if (index === start_day_week) {
                                for (let indexs = 0; indexs <= 1; indexs++) {
                                    if (indexs === 0) {
                                        P_start = moment().startOf('month').format('YYYY-MM-DD');
                                        P_end = moment().week(index).day(index_start_week - 1).format('YYYY-MM-DD');
                                    } else {
                                        P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                                        P_end = moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD');
                                    }
                                }

                            } else if (index === end_day_week) {
                                if (moment().endOf('month').day() >= index_start_week) {
                                    P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                                    P_end = moment().endOf('month').format('YYYY-MM-DD');
                                }

                            } else {
                                P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                                P_end = moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD');

                            }
                        }
                    } else {// กรณีวันแรกเป็น วันอื่น ไม่ใช่วันอาทิตย์ 
                        if (index === start_day_week) {
                            P_start = moment().startOf('month').format('YYYY-MM-DD');
                            P_end = moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD');
                        } else if (index === end_day_week) {
                            if (moment().endOf('month').day() >= index_start_week) {
                                P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                                P_end = moment().endOf('month').format('YYYY-MM-DD');
                            }
                        } else {
                            P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                            P_end = moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD');
                        }
                    }

                    if (data._branchid == null || data._branchid == '' || data._branchid == 'null') {
                        avg_revenues_match = {
                            '$match': {
                                '_ref_storeid': _storeid,
                                'create_date_string': {
                                    '$gte': P_start,
                                    '$lt': P_end
                                }
                            }
                        }
                    } else {
                        const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
                        avg_revenues_match = {
                            '$match': {
                                '_ref_storeid': _storeid,
                                '_ref_branchid': _branchid,
                                'create_date_string': {
                                    '$gte': P_start,
                                    '$lt': P_end
                                }
                            }
                        }
                    }
                    const avg_revenues_week = await mongodbController.purchaseOrderModel.aggregate(
                        [
                            avg_revenues_match, {
                                '$group': {
                                    '_id': '$_ref_storeid',
                                    'min_date': {
                                        '$min': {
                                            '$dayOfWeek': '$create_date'
                                        }
                                    },
                                    'max_date': {
                                        '$max': {
                                            '$dayOfWeek': '$create_date'
                                        }
                                    },
                                    'totel': {
                                        '$sum': '$price_total_after'
                                    }
                                }
                            }, {
                                '$project': {
                                    'totel': '$totel'
                                }
                            }
                        ],
                        (err) => { if (err) { callback(err); return; } }
                    );

                    const new_index = index - start_day_week;
                    if (avg_revenues_week.length == 0) {
                        avg_revenues_array[new_index] = {
                            "lebel": moment(P_start).format('DD') + '-' + moment(P_end).format('DD'),
                            "velue": 0
                        };
                    } else {
                        avg_revenues_array[new_index] = {
                            "lebel": moment(P_start).format('DD') + '-' + moment(P_end).format('DD'),
                            "velue": avg_revenues_week[0].totel / (Number(moment(P_end).format('DD')) - Number(moment(P_start).format('DD')))
                        };
                    }

                }
            }
            if (avg_revenues_array.length != 0) {
                return avg_revenues_array;
            } else {
                return 0;
            }

        };
        /**
        * ฟังชั้น ผลรวมรายได้ เป็นรายเดือนหรือรายอาทิตย์   
        * 
        * ผลลัพ => รายได้ 
        */
        const sum_revenues_by_month = async () => {
            // const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
            let avg_revenues_array = [];
            let group_id
            if (data.todate === 0) {
                for (let index = 0; index < 12; index++) {
                    P_start = moment().month(index).startOf('month').format('YYYY-MM-DD');
                    P_end = moment().month(index).endOf('month').format('YYYY-MM-DD');
                    if (data._branchid == null || data._branchid == '' || data._branchid == 'null') {
                        avg_revenues_match = {
                            '$match': {
                                '_ref_storeid': _storeid,
                                'create_date_string': {
                                    '$gte': P_start,
                                    '$lt': P_end
                                }
                            }
                        }
                        avg_revenues_project = {
                            '$project': {
                                '_id': {
                                    '_ref_storeid': _storeid,
                                },
                                'avg_price': {
                                    '$sum': ["$price_course_list_total_discount", "$price_product_list_total_discount"]
                                }
                            }
                        }
                        group_id = {
                            '_ref_storeid': _storeid,
                        }
                    } else {
                        const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
                        avg_revenues_match = {
                            '$match': {
                                '_ref_storeid': _storeid,
                                '_ref_branchid': _branchid,
                                'create_date_string': {
                                    '$gte': P_start,
                                    '$lt': P_end
                                }
                            }
                        }
                        avg_revenues_project = {
                            '$project': {
                                '_id': {
                                    '_ref_storeid': _storeid,
                                    '_ref_branchid': _branchid,
                                },
                                'avg_price': {
                                    '$sum': ["$price_course_list_total_discount", "$price_product_list_total_discount"]
                                }
                            }
                        }
                        group_id = {
                            '_ref_storeid': _storeid,
                            '_ref_branchid': _branchid
                        }
                    }
                    const avg_revenues = await mongodbController.purchaseOrderModel.aggregate(
                        [
                            avg_revenues_match, avg_revenues_project, {
                                '$group': {
                                    '_id': group_id,
                                    'totel': {
                                        '$sum': "$avg_price"
                                    }
                                }
                            }
                        ],
                        (err) => { if (err) { callback(err); return; } }
                    );
                    if (avg_revenues.length === 0) {
                        avg_revenues_array[index] = 0;
                    } else {
                        avg_revenues_array[index] = avg_revenues[0].totel;
                    }
                }

            } else if (data.todate == 1) { // ค้นหาตาม วันที่ ที่ต้องการ 
                //const calender = moment();
                let project_avg_revenues, group_avg_revenues;
                const start_day_week = moment().startOf('month').week();
                const end_day_week = moment().endOf('month').week();
                let index_start_week = 1; // เลืุอกวันที่เริ่มของอาทิต 0 = วันอาทิตย์ - 6 = วันเสาร์ 
                for (let index = start_day_week, week = end_day_week; index <= week; index++) {
                    if (moment().startOf('month').day() === 0) {
                        if (index_start_week === 0) { // กรณีวันแรกเป็นวันอาทิตย์ 
                            if (index === start_day_week) { // ต้นเดือน 
                                P_start = moment().startOf('month').format('YYYY-MM-DD');
                                P_end = moment().week(index).endOf('week').format('YYYY-MM-DD');
                            } else if (index === end_day_week) {//กลางเดือน 
                                if (moment().endOf('month').day() >= index_start_week) { // กรณีกำหนดวันเริ่มต้นของอาทิตย์เกินวันสินสุดของเดิอน 
                                    P_start = moment().week(index).startOf('week').format('YYYY-MM-DD');
                                    P_end = moment().endOf('month').format('YYYY-MM-DD');
                                }
                            } else { //  สื้นเดือน 
                                P_start = moment().week(index).startOf('week').format('YYYY-MM-DD');
                                P_end = moment().week(index).endOf('week').format('YYYY-MM-DD');

                            }
                        } else { // กรณีวันแรกเป็น วันอื่น ไม่ใช่วันอาทิตย์ 
                            if (index === start_day_week) {
                                for (let indexs = 0; indexs <= 1; indexs++) {
                                    if (indexs === 0) {
                                        P_start = moment().startOf('month').format('YYYY-MM-DD');
                                        P_end = moment().week(index).day(index_start_week - 1).format('YYYY-MM-DD');
                                    } else {
                                        P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                                        P_end = moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD');
                                    }
                                }

                            } else if (index === end_day_week) {
                                if (moment().endOf('month').day() >= index_start_week) {
                                    P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                                    P_end = moment().endOf('month').format('YYYY-MM-DD');
                                }

                            } else {
                                P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                                P_end = moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD');

                            }
                        }
                    } else {// กรณีวันแรกเป็น วันอื่น ไม่ใช่วันอาทิตย์ 
                        if (index === start_day_week) {
                            P_start = moment().startOf('month').format('YYYY-MM-DD');
                            P_end = moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD');
                        } else if (index === end_day_week) {
                            if (moment().endOf('month').day() >= index_start_week) {
                                P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                                P_end = moment().endOf('month').format('YYYY-MM-DD');
                            }
                        } else {
                            P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                            P_end = moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD');
                        }
                    }

                    if (data._branchid == null || data._branchid == '' || data._branchid == 'null') {
                        avg_revenues_match = {
                            '$match': {
                                '_ref_storeid': _storeid,
                                'create_date_string': {
                                    '$gte': P_start,
                                    '$lt': P_end
                                }
                            }
                        }
                        project_avg_revenues = {
                            '$project': {
                                '_id': {
                                    '_ref_storeid': _storeid,
                                },
                                'avg_price': {
                                    '$sum': ["$price_course_list_total_discount", "$price_product_list_total_discount"]
                                }
                            }
                        }
                    } else {
                        const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
                        avg_revenues_match = {
                            '$match': {
                                '_ref_storeid': _storeid,
                                '_ref_branchid': _branchid,
                                'create_date_string': {
                                    '$gte': P_start,
                                    '$lt': P_end
                                }
                            }
                        }
                        project_avg_revenues = {
                            '$project': {
                                '_id': {
                                    '_ref_storeid': _storeid,
                                    '_ref_branchid': _branchid,
                                },
                                'avg_price': {
                                    '$sum': ["$price_course_list_total_discount", "$price_product_list_total_discount"]
                                }
                            }
                        }
                    }
                    const avg_revenues_week = await mongodbController.purchaseOrderModel.aggregate(
                        [
                            avg_revenues_match, project_avg_revenues, {
                                '$group': {
                                    '_id': {
                                        '_ref_storeid': _storeid,
                                    },
                                    'totel': {
                                        '$sum': "$avg_price"
                                    }
                                }
                            }
                        ],
                        (err) => { if (err) { callback(err); return; } }
                    );

                    const new_index = index - start_day_week;
                    if (avg_revenues_week.length == 0) {
                        avg_revenues_array[new_index] = {
                            "lebel": moment(P_start).format('DD') + '-' + moment(P_end).format('DD'),
                            "velue": 0
                        };
                    } else {
                        avg_revenues_array[new_index] = {
                            "lebel": moment(P_start).format('DD') + '-' + moment(P_end).format('DD'),
                            "velue": avg_revenues_week[0].totel
                        };
                    }

                }
            }
            if (avg_revenues_array.length != 0) {
                return avg_revenues_array;
            } else {
                return 0;
            }

        };
        /**
        * ฟังชั้น หาจำนวนการรักษาหรือซื้ออุปกรณ์  
        * 
        * ผลลัพ => จำนวนการรักษาหรือการซื้ออุปกรณ์ 
        */
        const count_visitor = async () => {
            const count_visitor = await mongodbController.purchaseOrderModel.aggregate(
                [
                    avg_macth,
                    {
                        '$lookup': {
                            'from': 'l_casepatient',
                            'localField': '_ref_casepatinetid',
                            'foreignField': '_id',
                            'as': 'l_casepatient'
                        }
                    }, {
                        '$match': {
                            'l_casepatient': {
                                '$size': 1
                            }
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_casepatient',
                            'includeArrayIndex': 'l_casepatient_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$group': {
                            '_id': {
                                'id': '$_ref_storeid',
                                'p_id': '$l_casepatient._ref_patient_userid'
                            },
                            'count': {
                                '$sum': 1
                            }
                        }
                    }, {
                        '$group': {
                            '_id': '$_id.id',
                            'count': {
                                '$sum': 1
                            }
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            if (count_visitor.length === 0) {
                return 0; //`Sum_price_product cannot find in treatmentModel`;
            } else {
                if (data.todate === 0) {
                    return count_visitor.pop().count;
                } else {
                    return count_visitor.pop().count;
                }
            }
        }

        const count_visitor_mouth = async () => {
            let count_visitor = [];
            let visitor_match, group_visitor;
            if (data.todate === 0) {
                for (let index = 0; index < 12; index++) {
                    P_start = moment().month(index).startOf('month').format('YYYY-MM-DD');
                    P_end = moment().month(index).endOf('month').format('YYYY-MM-DD');
                    if (data._branchid == null || data._branchid == '' || data._branchid == 'null') {
                        visitor_match = {
                            '$match': {
                                '_ref_storeid': _storeid,
                                'create_date_string': {
                                    '$gte': P_start,
                                    '$lt': P_end
                                }
                            }
                        }
                    } else {
                        const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
                        visitor_match = {
                            '$match': {
                                '_ref_storeid': _storeid,
                                '_ref_branchid': _branchid,
                                'create_date_string': {
                                    '$gte': P_start,
                                    '$lt': P_end
                                }
                            }
                        }
                    }
                    const avg_revenues = await mongodbController.purchaseOrderModel.aggregate([
                        visitor_match,
                        {
                            '$lookup': {
                                'from': 'l_casepatient',
                                'localField': '_ref_casepatinetid',
                                'foreignField': '_id',
                                'as': 'l_casepatient'
                            }
                        }, {
                            '$match': {
                                'l_casepatient': {
                                    '$size': 1
                                }
                            }
                        }, {
                            '$unwind': {
                                'path': '$l_casepatient',
                                'includeArrayIndex': 'l_casepatient_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$group': {
                                '_id': {
                                    'id': '$_ref_storeid',
                                    'p_id': '$l_casepatient._ref_patient_userid'
                                },
                                'count': {
                                    '$sum': 1
                                }
                            }
                        }, {
                            '$group': {
                                '_id': '$_id.id',
                                'count': {
                                    '$sum': 1
                                }
                            }
                        }
                    ],
                        (err) => { if (err) { callback(err); return; } }
                    );
                    if (avg_revenues.length === 0) {
                        count_visitor[index] = {
                            "lebel": mouth_string[index],
                            "velue": 0
                        };
                    } else {
                        count_visitor[index] = {
                            "lebel": mouth_string[index],
                            "velue": avg_revenues[0].count
                        };;
                    }
                }

            } else if (data.todate == 1) { // ค้นหาตาม วันที่ ที่ต้องการ 
                //const calender = moment();
                let project_avg_revenues, group_avg_revenues;
                const start_day_week = moment().startOf('month').week();
                const end_day_week = moment().endOf('month').week();
                let index_start_week = 1; // เลืุอกวันที่เริ่มของอาทิต 0 = วันอาทิตย์ - 6 = วันเสาร์ 
                for (let index = start_day_week, week = end_day_week; index <= week; index++) {
                    if (moment().startOf('month').day() === 0) {
                        if (index_start_week === 0) { // กรณีวันแรกเป็นวันอาทิตย์ 
                            if (index === start_day_week) { // ต้นเดือน 
                                P_start = moment().startOf('month').format('YYYY-MM-DD');
                                P_end = moment().week(index).endOf('week').format('YYYY-MM-DD');
                            } else if (index === end_day_week) {//กลางเดือน 
                                if (moment().endOf('month').day() >= index_start_week) { // กรณีกำหนดวันเริ่มต้นของอาทิตย์เกินวันสินสุดของเดิอน 
                                    P_start = moment().week(index).startOf('week').format('YYYY-MM-DD');
                                    P_end = moment().endOf('month').format('YYYY-MM-DD');
                                }
                            } else { //  สื้นเดือน 
                                P_start = moment().week(index).startOf('week').format('YYYY-MM-DD');
                                P_end = moment().week(index).endOf('week').format('YYYY-MM-DD');
                            }
                        } else { // กรณีวันแรกเป็น วันอื่น ไม่ใช่วันอาทิตย์ 
                            if (index === start_day_week) {
                                for (let indexs = 0; indexs <= 1; indexs++) {
                                    if (indexs === 0) {
                                        P_start = moment().startOf('month').format('YYYY-MM-DD');
                                        P_end = moment().week(index).day(index_start_week - 1).format('YYYY-MM-DD');
                                    } else {
                                        P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                                        P_end = moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD');
                                    }
                                }
                            } else if (index === end_day_week) {
                                if (moment().endOf('month').day() >= index_start_week) {
                                    P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                                    P_end = moment().endOf('month').format('YYYY-MM-DD');
                                }
                            } else {
                                P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                                P_end = moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD');
                            }
                        }
                    } else {// กรณีวันแรกเป็น วันอื่น ไม่ใช่วันอาทิตย์ 
                        if (index === start_day_week) {
                            P_start = moment().startOf('month').format('YYYY-MM-DD');
                            P_end = moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD');
                        } else if (index === end_day_week) {
                            if (moment().endOf('month').day() >= index_start_week) {
                                P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                                P_end = moment().endOf('month').format('YYYY-MM-DD');
                            }
                        } else {
                            P_start = moment().week(index).day(index_start_week).format('YYYY-MM-DD');
                            P_end = moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD');
                        }
                    }
                    if (data._branchid == null || data._branchid == '' || data._branchid == 'null') {
                        visitor_match = {
                            '$match': {
                                '_ref_storeid': _storeid,
                                'create_date_string': {
                                    '$gte': P_start,
                                    '$lt': P_end
                                }
                            }
                        }
                    } else {
                        const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
                        visitor_match = {
                            '$match': {
                                '_ref_storeid': _storeid,
                                '_ref_branchid': _branchid,
                                'create_date_string': {
                                    '$gte': P_start,
                                    '$lt': P_end
                                }
                            }
                        }
                    }

                    const count_visitor_week = await mongodbController.purchaseOrderModel.aggregate(
                        [
                            visitor_match,
                            {
                                '$lookup': {
                                    'from': 'l_casepatient',
                                    'localField': '_ref_casepatinetid',
                                    'foreignField': '_id',
                                    'as': 'l_casepatient'
                                }
                            }, {
                                '$match': {
                                    'l_casepatient': {
                                        '$size': 1
                                    }
                                }
                            }, {
                                '$unwind': {
                                    'path': '$l_casepatient',
                                    'includeArrayIndex': 'l_casepatient_index',
                                    'preserveNullAndEmptyArrays': true
                                }
                            }, {
                                '$group': {
                                    '_id': {
                                        'id': '$_ref_storeid',
                                        'p_id': '$l_casepatient._ref_patient_userid'
                                    },
                                    'count': {
                                        '$sum': 1
                                    }
                                }
                            }, {
                                '$group': {
                                    '_id': '$_id.id',
                                    'count': {
                                        '$sum': 1
                                    }
                                }
                            }
                        ],
                        (err) => { if (err) { callback(err); return; } }
                    );
                    const new_index = index - start_day_week;
                    if (count_visitor_week.length == 0) {
                        count_visitor[new_index] = {
                            "lebel": moment(P_start).format('DD') + '-' + moment(P_end).format('DD'),
                            "velue": 0
                        };
                    } else {
                        count_visitor[new_index] = {
                            "lebel": moment(P_start).format('DD') + '-' + moment(P_end).format('DD'),
                            "velue": count_visitor_week[0].count
                        };
                    }
                }
            }
            if (count_visitor.length != 0) {
                return count_visitor;
            } else {
                return 0;
            }
        }
        const accumulated = async () => {
            let sum_accumulated = [];
            if (data.todate == 1) {
                const sum_accumulated_month = await sum_revenues_by_month();
                for (let index = 0, length = sum_accumulated_month.length; index < length; index++) {
                    if (index == 0) {
                        sum_accumulated[index] = {
                            lebel: sum_accumulated_month[index].lebel,
                            velue: sum_accumulated_month[index].velue
                        };
                    } else if (sum_accumulated_month[index].velue == 0) {
                        sum_accumulated[index] = {
                            lebel: sum_accumulated_month[index].lebel,
                            velue: 0
                        };

                    } else {
                        sum_accumulated[index] = {
                            lebel: sum_accumulated_month[index].lebel,
                            velue: sum_accumulated[index - 1].velue + sum_accumulated_month[index].velue
                        };
                    }
                }
            } else {
                const accumulated_month = await sum_revenues_by_month();
                for (let index = 0, length = accumulated_month.length; index < length; index++) {
                    if (index == 0) { // ค่าแรกให้เท่ากับ ค่าของมันเอง 
                        sum_accumulated[index] = {
                            lebel: mouth_string[index],
                            velue: accumulated_month[index]
                        };
                    } else if (accumulated_month[index] == 0) { // ถ้าค่าที่ส่งมา เป็น 0 
                        sum_accumulated[index] = {
                            lebel: mouth_string[index],
                            velue: 0
                        };
                    } else {
                        sum_accumulated[index] = {
                            lebel: mouth_string[index],
                            velue: sum_accumulated[index - 1].velue + accumulated_month[index]
                        };
                    }
                }
            }
            if (!sum_accumulated || sum_accumulated.length === 0) {
                return 0;
            } else {
                return sum_accumulated;
            }

        }

        const treatments = await Sum_price_course();
        const sele_equipment = await Sum_price_product();
        let mapdata = {
            date_start: moment().startOf(start).format('YYYY-MM-DD'),
            date_end: moment().endOf(start).format('YYYY-MM-DD'),
            count_new_patient: await Count_Patinet(),
            totel_revenues: totel_revenues,
            persen_growth: await Growth(),
            treatment: treatments,
            sele_equipment: sele_equipment,
            persen_treatment: treatments / totel_revenues * 100,
            persen_sele_equipment: sele_equipment / totel_revenues * 100,
            avg_revenues: await avg_revenues(),
            revenues_by_month: await avg_revenues_by_month(),
            count_visitor: await count_visitor(),
            count_visitor_by_mouth: await count_visitor_mouth(),
            accumulated: await accumulated()
        }

        callback(null);
        return mapdata;

    }

};
module.exports = View_Dashboard_Controller;