const view_revenues = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''), // ค่าเริ่มต้นเป็นค่า null 
        Year: new String(''),
        Month: new String(''),
        r_or_v: new String('') // 0 is revenues , 1 is visitor
    },
    callback = (err = new Err) => { }
) => {
    const hader = 'view_revenues_visitor_controller';
    if (typeof data._storeid !== 'string' || data._storeid === '' || data._storeid === null ||
        typeof data.Year !== 'string' || data.Year === '' || data.Year === null || !data.Year ||
        typeof data.Month !== 'string' || data.Month === '' || data.Month === null || !data.Month ||
        typeof data.r_or_v !== 'string' || data.r_or_v === '' || data.r_or_v === null
    ) {
        callback(new Error(` ${hader} : data Error`));
        return;
    } else {
        const r_or_v = +data.r_or_v; // ทำให้เป็น Number 
        const mongodbController = require('../../mongodbController');
        const checkObjectId = require('../../miscController').checkObjectId        
        const moment = require('moment');
        let date_start, date_end, p_match_treatmentModel, match_treatmentModel, group_course_treatmentModel, group_product_treatmentModel, project_treatment_department, group_sum_count, match_treatmentModel_by_age, match_treatmentModel_product_by_age;
        const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });

        const chack_date_start = async () => {
            try {
                if (data.Year !== 'null' && data.Month === 'null') { // มีการส่งค่า ปี มาเป็น string แต่ไม่ส่งค่าเดือนมา
                    if (+data.Year > 2019) {
                        date_start = moment(data.Year + '-01-01', 'YYYY-MM-DD', true).startOf('year').format('YYYY-MM-DD');
                        return date_start;
                    } else {
                        date_start = moment().startOf('year').format('YYYY-MM-DD');
                        return date_start;
                    }
                } else if (data.Month !== 'null' && data.Year === 'null') { // ไม่ส่งค่า เดือนมา แต่ไม่ส่งค่าปีมา 
                    if (+data.Month > 0 && +data.Month < 13) {
                        date_start = moment(moment().startOf('month').format('YYYY') + '-' + data.Month + '-01', 'YYYY-MM-DD', true).startOf('month').format('YYYY-MM-DD');
                        return date_start;
                    } else {
                        date_start = moment().startOf('month').format('YYYY-MM-DD');
                        return date_start;
                    }
                } else if (data.Month !== 'null' && data.Year !== 'null') {// ส่ง มาทั่งสอง ค่า คือ ปี และ เดือน 
                    date_start = moment(moment(data.Year, 'YYYY', true).format('YYYY') + '-' + data.Month + '-01', 'YYYY-MM-DD', true).startOf('month').format('YYYY-MM-DD');
                    return date_start;
                } else {// ไม่่ส่งค่าอะไรมาเเล้ว 
                    date_start = moment().format('YYYY-MM-DD');
                    return date_start;
                }
            } catch (error) {
                date_start = moment().format('YYYY-MM-DD');
                return date_start;
            }
        }
        const chack_date_end = async () => {
            try {
                if (data.Year !== 'null' && data.Month === 'null') { // มีการส่งค่า ปี มาเป็น string แต่ไม่ส่งค่าเดือนมา
                    if (+data.Year > 2019) {
                        date_end = moment(data.Year + '-01-01', 'YYYY-MM-DD', true).endOf('year').format('YYYY-MM-DD');
                        return date_end;
                    } else {
                        date_end = moment().endOf('year').format('YYYY-MM-DD');
                        return date_end;
                    }
                } else if (data.Month !== 'null' && data.Year === 'null') { // ไม่ส่งค่า เดือนมา แต่ไม่ส่งค่าปีมา 
                    if (+data.Month > 0 && +data.Month < 13) {
                        date_end = moment(moment().startOf('month').format('YYYY') + '-' + data.Month + '-01', 'YYYY-MM-DD', true).endOf('month').format('YYYY-MM-DD');
                        return date_end;
                    } else {
                        date_end = moment().endOf('month').format('YYYY-MM-DD');
                        return date_end;
                    }
                } else if (data.Month !== 'null' && data.Year !== 'null') { // ส่ง มาทั่งสอง ค่า คือ ปี และ เดือน 
                    date_end = moment(moment(data.Year, 'YYYY', true).format('YYYY') + '-' + data.Month + '-01', 'YYYY-MM-DD', true).endOf('month').format('YYYY-MM-DD');
                    return date_end;
                } else {// ไม่่ส่งค่าอะไรมาเเล้ว 
                    date_end = moment().format('YYYY-MM-DD');
                    return date_end;
                }
            } catch (error) {
                date_end = moment().format('YYYY-MM-DD');
                return date_end;
            }
        }
        const p_chack_date_start = async () => {
            try {
                if (data.Year !== 'null' && data.Month === 'null') { // มีการส่งค่า ปี มาเป็น string แต่ไม่ส่งค่าเดือนมา
                    date_start = moment(await chack_date_start()).subtract(1, 'year').format('YYYY-MM-DD')
                    return date_start;
                } else if (data.Month !== 'null' && data.Year === 'null') { // ไม่ส่งค่า เดือนมา แต่ไม่ส่งค่าปีมา 
                    date_start = moment(await chack_date_start()).subtract(1, 'month').format('YYYY-MM-DD')
                    return date_start;
                } else if (data.Month !== 'null' && data.Year !== 'null') {// ส่ง มาทั่งสอง ค่า คือ ปี และ เดือน 
                    date_start = moment(await chack_date_start()).subtract(1, 'month').format('YYYY-MM-DD')
                    return date_start;
                } else {// ไม่่ส่งค่าอะไรมาเเล้ว 
                    date_start = moment().subtract(1, 'day').format('YYYY-MM-DD')
                    return date_start;
                }
            } catch (error) {
                date_start = moment().subtract(1, 'day').format('YYYY-MM-DD')
                return date_start;
            }
        }
        const p_chack_date_end = async () => {
            try {
                if (data.Year !== 'null' && data.Month === 'null') { // มีการส่งค่า ปี มาเป็น string แต่ไม่ส่งค่าเดือนมา
                    date_end = moment(await chack_date_end()).subtract(1, 'year').format('YYYY-MM-DD')
                    return date_end;
                } else if (data.Month !== 'null' && data.Year === 'null') { // ไม่ส่งค่า เดือนมา แต่ไม่ส่งค่าปีมา 
                    date_end = moment(await chack_date_end()).subtract(1, 'month').format('YYYY-MM-DD')
                    return date_end;
                } else if (data.Month !== 'null' && data.Year !== 'null') {// ส่ง มาทั่งสอง ค่า คือ ปี และ เดือน 
                    date_end = moment(await chack_date_end()).subtract(1, 'month').format('YYYY-MM-DD')
                    return date_end;
                } else {// ไม่่ส่งค่าอะไรมาเเล้ว 
                    date_end = moment().subtract(1, 'day').format('YYYY-MM-DD')
                    return date_end;
                }
            } catch (error) {
                date_end = moment().subtract(1, 'day').format('YYYY-MM-DD')
                return date_end;
            }
        }

        if (await checkObjectId(data._branchid, (err) => { if (err) { return null; } }) === null || !await checkObjectId(data._branchid, (err) => { if (err) { return null; } })) { // ไม่ส่งค่า _branchid มา 
            match_treatmentModel = { '$match': { '_ref_storeid': _storeid, 'create_date_string': { '$gte': await chack_date_start(), '$lte': await chack_date_end() } } }
            p_match_treatmentModel = { '$match': { '_ref_storeid': _storeid, 'create_date_string': { '$gte': await p_chack_date_start(), '$lte': await p_chack_date_end() } } }
            match_treatmentModel_by_age = { '$match': { '_ref_storeid': _storeid, 'm_patients.store._storeid': _storeid } }
            match_treatmentModel_product_by_age = { '$match': { '_ref_storeid': _storeid, 'm_patients.store._storeid': _storeid } }

        } else {
            const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
            match_treatmentModel = { '$match': { '_ref_storeid': _storeid, '_ref_branchid': _branchid, 'create_date_string': { '$gte': await chack_date_start(), '$lte': await chack_date_end() } } }
            p_match_treatmentModel = { '$match': { '_ref_storeid': _storeid, '_ref_branchid': _branchid, 'create_date_string': { '$gte': await p_chack_date_start(), '$lte': await p_chack_date_end() } } }
            match_treatmentModel_by_age = { '$match': { '_ref_storeid': _storeid, 'm_patients.store._storeid': _storeid, '_ref_branchid': _branchid, } }
        }
        if (r_or_v === 0) {
            group_course_treatmentModel = { '$sum': '$course_price_total' }
            group_product_treatmentModel = { '$group': { '_id': '$_ref_productid', 'totel': { '$sum': '$product_price_total' } } }
            projec_treatment = { '$sum': ['$price_product_list_total_discount', '$price_course_list_total_discount'] }
            project_treatment_department = { '$sum': '$price_total_after' }
            group_sum_count = { '$group': { '_id': { 'name': '$name', 'sex': '$sex' }, 'totel': { '$sum': '$totel' }, 'Beetween1935': { '$sum': '$1935' }, 'Beetween1318': { '$sum': '$1318' }, 'Beetween3660': { '$sum': '$3660' }, 'Beetween0307': { '$sum': '$0307' }, 'Beetween0812': { '$sum': '$0712' }, 'Beetween0061': { '$sum': '$0061' } } }
        } else if (r_or_v === 1) {
            group_course_treatmentModel = { '$sum': 1 }
            group_product_treatmentModel = { '$group': { '_id': '$_ref_productid', 'totel': { '$sum': 1 } } }
            projec_treatment = { '$sum': 1 }
            project_treatment_department = { '$sum': 1 }
            group_sum_count = { '$group': { '_id': { 'name': '$name', 'sex': '$sex' }, 'totel': { '$sum': 1 }, 'Beetween1935': { '$sum': 1 }, 'Beetween1318': { '$sum': 1 }, 'Beetween3660': { '$sum': 1 }, 'Beetween0307': { '$sum': 1 }, 'Beetween0812': { '$sum': 1 }, 'Beetween0061': { '$sum': 1 } } }
        }


        const sum_count_revenues_product_treatmentModel = async () => {
            let data = []
            const sum_revenues_course_treatmentModels = await mongodbController.purchaseOrderDetailModel.aggregate(
                [
                    match_treatmentModel, group_product_treatmentModel,
                    {
                        '$match': {
                            '_id': {
                                '$ne': null
                            }
                        }
                    },
                    { '$lookup': { 'from': 'm_product', 'localField': '_id', 'foreignField': '_id', 'as': 'name' } },
                    { '$unwind': { 'path': '$name' } },
                    { '$sort': { 'totel': -1 } }
                ], (err) => {
                    if (err) { callback(err); return; }
                }
            );

            const p_sum_revenues_course_treatmentModels = await mongodbController.purchaseOrderDetailModel.aggregate(
                [
                    p_match_treatmentModel, group_product_treatmentModel, { '$lookup': { 'from': 'm_product', 'localField': '_id', 'foreignField': '_id', 'as': 'name' } },
                    { '$unwind': { 'path': '$name' } },
                    { '$sort': { 'totel': -1 } }
                ], (err) => { if (err) { callback(err); return; } }
            );

            if (!sum_revenues_course_treatmentModels || sum_revenues_course_treatmentModels.length === 0 || !p_sum_revenues_course_treatmentModels) {
                return [{
                    name: 'ไม่พบข้อมูล',
                    current_price_count: 0,
                    Historical_price: 0,
                }];
            } else {
                for (let index = 0; index < sum_revenues_course_treatmentModels.length; index++) {
                    const element = sum_revenues_course_treatmentModels[index];
                    const p_element = p_sum_revenues_course_treatmentModels.filter(
                        where => (
                            where._id.toString() === element._id.toString()
                        )
                    )

                    if (p_element.length === 1) {
                        data.push({
                            name: element.name.product_name,
                            current_price_count: element.totel,
                            Historical_price: p_element[0].totel,
                        })
                    } else {
                        data.push({
                            name: element.name.product_name,
                            current_price_count: element.totel,
                            Historical_price: 0,
                        })
                    }

                }
                return data
            }
        }

        const sum_count_revenues_product_diagnosis = async () => {
            let data = []
            const sum_count_revenues_course_diagnosiss = await mongodbController.purchaseOrderModel.aggregate(
                [
                    match_treatmentModel,
                    { '$lookup': { 'from': 'l_casepatient_stage_3', 'localField': '_ref_casepatinetid', 'foreignField': '_ref_casepatinetid', 'as': 'name' } },
                    { '$match': { 'name': { '$size': 1 } } },
                    { '$unwind': { 'path': '$name' } },
                    { '$project': { 'totel': projec_treatment, 'pt_diagnosis': { '$switch': { 'branches': [{ 'case': { '$ne': ['$name.stage3data.ortho.upper', null] }, 'then': '$name.stage3data.ortho.upper.pt_diagnosis' }, { 'case': { '$ne': ['$name.stage3data.ortho.lower', null] }, 'then': '$name.stage3data.ortho.lower.pt_diagnosis' }, { 'case': { '$ne': ['$name.stage3data.ortho.trunk_spine', null] }, 'then': '$name.stage3data.ortho.trunk_spine.pt_diagnosis' }, { 'case': { '$ne': ['$name.stage3data.ortho.general', null] }, 'then': '$name.stage3data.ortho.general.pt_diagnosis' }] } } } },
                    { '$group': { '_id': '$pt_diagnosis', 'totel': { '$sum': '$totel' } } },
                    { '$project': { '_id': 0, 'name': '$_id', 'totel': '$totel' } },
                    { '$sort': { 'totel': -1 } }
                ], (err) => {
                    if (err) { callback(err); return; }
                }
            );

            if (!sum_count_revenues_course_diagnosiss || sum_count_revenues_course_diagnosiss.length === 0) {
                return [{
                    name: 'ไม่พบข้อมูล',
                    current_price_count: 0,
                    Historical_price: 0,
                }];
            } else {
                let lengths = sum_count_revenues_course_diagnosiss.length;
                for (let index = 0; index < lengths; index++) {
                    const p_sum_count_revenues_course_diagnosiss = await mongodbController.purchaseOrderModel.aggregate([
                        p_match_treatmentModel,
                        { '$lookup': { 'from': 'l_casepatient_stage_3', 'localField': '_ref_casepatinetid', 'foreignField': '_ref_casepatinetid', 'as': 'name' } },
                        { '$match': { 'name': { '$size': 1 } } }, { '$unwind': { 'path': '$name' } },
                        { '$project': { 'totel': projec_treatment, 'pt_diagnosis': { '$switch': { 'branches': [{ 'case': { '$ne': ['$name.stage3data.ortho.upper', null] }, 'then': '$name.stage3data.ortho.upper.pt_diagnosis' }, { 'case': { '$ne': ['$name.stage3data.ortho.lower', null] }, 'then': '$name.stage3data.ortho.lower.pt_diagnosis' }, { 'case': { '$ne': ['$name.stage3data.ortho.trunk_spine', null] }, 'then': '$name.stage3data.ortho.trunk_spine.pt_diagnosis' }, { 'case': { '$ne': ['$name.stage3data.ortho.general', null] }, 'then': '$name.stage3data.ortho.general.pt_diagnosis' }] } } } },
                        { '$group': { '_id': '$pt_diagnosis', 'totel': { '$sum': '$totel' } } },
                        { '$project': { '_id': 0, 'name': '$_id', 'totel': '$totel' } },
                        { '$match': { 'name': sum_count_revenues_course_diagnosiss[index].name } }
                    ], (err) => { if (err) { callback(err); return; } });
                    if (!p_sum_count_revenues_course_diagnosiss || p_sum_count_revenues_course_diagnosiss.length === 0) {
                        data[index] = {
                            name: sum_count_revenues_course_diagnosiss[index].name,
                            current_price_count: sum_count_revenues_course_diagnosiss[index].totel,
                            Historical_price: 0,
                        }
                    } else {
                        data[index] = {
                            name: sum_count_revenues_course_diagnosiss[index].name,
                            current_price_count: sum_count_revenues_course_diagnosiss[index].totel,
                            Historical_price: p_sum_count_revenues_course_diagnosiss[0].totel,
                        }
                    }
                }
                return data
            }
        }

        const sum_count_revenues_course_treatmentModel = async () => {
            let data = []
            const sum_revenues_course_treatmentModels = await mongodbController.purchaseOrderDetailModel.aggregate(
                [
                    match_treatmentModel, {
                        '$match': {
                            '_ref_courseid': {
                                '$ne': null
                            }
                        }
                    }, {
                        '$group': {
                            '_id': '$_ref_courseid',
                            'totel': group_course_treatmentModel
                        }
                    }, {
                        '$match': {
                            '_id': {
                                '$ne': null
                            }
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_course',
                            'localField': '_id',
                            'foreignField': '_id',
                            'as': 'name'
                        }
                    }, {
                        '$unwind': {
                            'path': '$name',
                            'includeArrayIndex': 'm_course_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            'm_course_index': {
                                '$ne': null
                            }
                        }
                    }, {
                        '$project': {
                            '_id': 1,
                            'totel': 1,
                            'name': '$name.name'
                        }
                    }, {
                        '$sort': {
                            'totel': -1
                        }
                    }
                ], (err) => {
                    if (err) { callback(err); return; }
                }
            );

            const p_sum_revenues_course_treatmentModels = await mongodbController.purchaseOrderDetailModel.aggregate(
                [
                    p_match_treatmentModel,
                    {
                        '$match': {
                            '_ref_courseid': {
                                '$ne': null
                            }
                        }
                    }, {
                        '$group': {
                            '_id': '$_ref_courseid',
                            'totel': group_course_treatmentModel
                        }
                    }, {
                        '$match': {
                            '_id': {
                                '$ne': null
                            }
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_course',
                            'localField': '_id',
                            'foreignField': '_id',
                            'as': 'name'
                        }
                    }, {
                        '$unwind': {
                            'path': '$name',
                            'includeArrayIndex': 'm_course_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            'm_course_index': {
                                '$ne': null
                            }
                        }
                    }, {
                        '$project': {
                            '_id': 1,
                            'totel': 1,
                            'name': '$name.name'
                        }
                    }, {
                        '$sort': {
                            'totel': -1
                        }
                    }
                ], (err) => { if (err) { callback(err); return; } });

            if (!sum_revenues_course_treatmentModels || sum_revenues_course_treatmentModels.length === 0 || !p_sum_revenues_course_treatmentModels || p_sum_revenues_course_treatmentModels.length < 0) {
                return [{
                    name: 'ไม่พบข้อมูล',
                    current_price_count: 0,
                    Historical_price: 0,
                }];
            } else {
                for (let index2 = 0; index2 < sum_revenues_course_treatmentModels.length; index2++) {
                    const element = sum_revenues_course_treatmentModels[index2];
                    const filter_Pevious_Historical_price = p_sum_revenues_course_treatmentModels.filter(
                        where => (
                            where._id.toString() === element._id.toString()
                        )
                    );
                    if (filter_Pevious_Historical_price.length === 1) {
                        data.push({
                            name: element.name,
                            current_price_count: element.totel,
                            Historical_price: filter_Pevious_Historical_price[0].totel,
                        })
                    }
                    if (filter_Pevious_Historical_price.length === 0) {
                        data.push({
                            name: element.name,
                            current_price_count: element.totel,
                            Historical_price: 0,
                        })
                    }
                }

            }
            return data
        }

        const sum_count_revenues_department = async () => {
            let data = []
            const sum_count_revenues_departments = await mongodbController.purchaseOrderModel.aggregate(
                [
                    match_treatmentModel,
                    {
                        '$lookup': {
                            'from': 'l_casepatient',
                            'localField': '_ref_casepatinetid',
                            'foreignField': '_id',
                            'as': 'name'
                        }
                    }, {
                        '$unwind': {
                            'path': '$name',
                            'includeArrayIndex': 'name_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            'name_index': {
                                '$ne': null
                            }
                        }
                    }, {
                        '$group': {
                            '_id': '$name._casemaintypename',
                            'totel': project_treatment_department
                        }
                    }, {
                        '$sort': {
                            'totel': -1
                        }
                    }
                ], (err) => {
                    if (err) { callback(err); return; }
                }
            );
            if (!sum_count_revenues_departments || sum_count_revenues_departments.length === 0) {
                return [{
                    name: 'ไม่พบข้อมูล',
                    current_price_count: 0,
                    Historical_price: 0,
                }];
            } else {
                const p_sum_count_revenues_departments = await mongodbController.purchaseOrderModel.aggregate([
                    p_match_treatmentModel,
                    {
                        '$lookup': {
                            'from': 'l_casepatient',
                            'localField': '_ref_casepatinetid',
                            'foreignField': '_id',
                            'as': 'name'
                        }
                    }, {
                        '$unwind': {
                            'path': '$name',
                            'includeArrayIndex': 'name_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            'name_index': {
                                '$ne': null
                            }
                        }
                    }, {
                        '$group': {
                            '_id': '$name._casemaintypename',
                            'totel': project_treatment_department
                        }
                    }, {
                        '$sort': {
                            'totel': -1
                        }
                    }
                ], (err) => { if (err) { callback(err); return; } });

                let lengths = sum_count_revenues_departments.length;

                for (let index = 0; index < lengths; index++) {

                    if (!p_sum_count_revenues_departments || p_sum_count_revenues_departments.length === 0) {
                        data[index] = {
                            name: sum_count_revenues_departments[index]._id,
                            current_price_count: sum_count_revenues_departments[index].totel,
                            Historical_price: 0,
                        }
                    } else if (p_sum_count_revenues_departments.length === 1) {
                        if (sum_count_revenues_departments[index]._id === p_sum_count_revenues_departments[0]._id) {
                            data[index] = {
                                name: sum_count_revenues_departments[index]._id,
                                current_price_count: sum_count_revenues_departments[index].totel,
                                Historical_price: p_sum_count_revenues_departments[0].totel,
                            }
                        } else {
                            data[index] = {
                                name: sum_count_revenues_departments[index]._id,
                                current_price_count: sum_count_revenues_departments[index].totel,
                                Historical_price: 0,
                            }
                        }

                    } else {
                        for (let index2 = 0; index2 < p_sum_count_revenues_departments.length; index2++) {
                            if (sum_count_revenues_departments[index]._id === p_sum_count_revenues_departments[index2]._id) {
                                data[index] = {
                                    name: sum_count_revenues_departments[index]._id,
                                    current_price_count: sum_count_revenues_departments[index].totel,
                                    Historical_price: p_sum_count_revenues_departments[index2].totel,
                                }
                            }
                        }
                    }

                }
                return data
            }
        }

        const sum_count_treatment_group = async () => {
            let data = []

            if (r_or_v === 0) {
                const treatmentDetailModel_aggregate = await mongodbController.purchaseOrderDetailModel.aggregate(
                    [
                        match_treatmentModel,
                        { '$lookup': { 'from': 'l_casepatient', 'localField': '_ref_casepatinetid', 'foreignField': '_id', 'as': 'name' } },
                        { '$lookup': { 'from': 'm_patients', 'localField': 'name._ref_patient_userstoreid', 'foreignField': 'store._id', 'as': 'm_patients' } },
                        { '$lookup': { 'from': 'm_course', 'localField': '_ref_courseid', 'foreignField': '_id', 'as': 'm_course' } },
                        { '$match': { 'm_course': { '$size': 1 }, 'm_patients': { '$size': 1 }, 'name': { '$size': 1 } } },
                        { '$unwind': { 'path': '$name' } },
                        { '$unwind': { 'path': '$m_patients' } },
                        { '$unwind': { 'path': '$m_course' } },
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
                        match_treatmentModel_by_age,
                        { '$addFields': { 'bdate': { '$dateFromString': { 'dateString': '$m_patients.store.personal.birth_date', 'format': '%Y/%m/%d' } } } },
                        { '$addFields': { 'age': { '$trunc': [{ '$let': { 'vars': { 'diff': { '$subtract': [new Date(), '$bdate'] } }, 'in': { '$divide': ['$$diff', (365 * 24 * 60 * 60 * 1000)] } } }, 0] } } },
                        { '$project': { '_ref_storeid': '$_ref_storeid', '_ref_branchid': '$_ref_branchid', 'totel': { '$sum': '$price_course_total' }, 'sex': '$m_patients.store.personal.gender', 'name': '$m_course.name', 'age': '$age', 'age_day': '$bdate', 'S0307': { '$cond': [{ '$lte': ['$age', 7] }, { '$sum': '$price_course_total' }, 0] }, 'S0812': { '$cond': [{ '$and': [{ '$gte': ['$age', 8] }, { '$lte': ['$age', 12] }] }, { '$sum': '$price_course_total' }, 0] }, 'S1318': { '$cond': [{ '$and': [{ '$gte': ['$age', 13] }, { '$lte': ['$age', 18] }] }, { '$sum': '$price_course_total' }, 0] }, 'S1935': { '$cond': [{ '$and': [{ '$gte': ['$age', 19] }, { '$lte': ['$age', 35] }] }, { '$sum': '$price_course_total' }, 0] }, 'S3660': { '$cond': [{ '$and': [{ '$gte': ['$age', 36] }, { '$lte': ['$age', 60] }] }, { '$sum': '$price_course_total' }, 0] }, 'S0061': { '$cond': [{ '$gte': ['$age', 61] }, { '$sum': '$price_course_total' }, 0] }, 'count0812': { '$cond': [{ '$and': [{ '$gte': ['$age', 8] }, { '$lte': ['$age', 12] }] }, 1, 0] }, 'count0307': { '$cond': [{ '$lte': ['$age', 7] }, 1, 0] }, 'count1318': { '$cond': [{ '$and': [{ '$gte': ['$age', 13] }, { '$lte': ['$age', 18] }] }, 1, 0] }, 'count1935': { '$cond': [{ '$and': [{ '$gte': ['$age', 19] }, { '$lte': ['$age', 35] }] }, 1, 0] }, 'count3660': { '$cond': [{ '$and': [{ '$gte': ['$age', 36] }, { '$lte': ['$age', 60] }] }, 1, 0] }, 'count0061': { '$cond': [{ '$gte': ['$age', 61] }, 1, 0] } } },
                        { '$group': { '_id': { 'name': '$name', 'sex': '$sex' }, 'sumBeetween1935': { '$sum': '$S1935' }, 'sumBeetween1318': { '$sum': '$S1318' }, 'sumBeetween3660': { '$sum': '$S3660' }, 'sumBeetween0307': { '$sum': '$S0307' }, 'sumBeetween0812': { '$sum': '$S0812' }, 'sumBeetween0061': { '$sum': '$S0061' }, 'sum': { '$sum': '$totel' }, 'countBeetween1935': { '$sum': '$count1935' }, 'countBeetween1318': { '$sum': '$count1318' }, 'countBeetween3660': { '$sum': '$count3660' }, 'countBeetween0307': { '$sum': '$count0307' }, 'countBeetween0812': { '$sum': '$count0812' }, 'countBeetween0061': { '$sum': '$count0061' }, 'totel': { '$sum': 1 } } },
                        { '$sort': { 'sum': -1 } }
                    ], (err) => { if (err) { callback(err); return; } }
                );
                if (!treatmentDetailModel_aggregate || treatmentDetailModel_aggregate.length === 0) {
                    return [{
                        name: 'ไม่พบข้อมูล',
                        Beetween03And06: 0,
                        Beetween07And12: 0,
                        Beetween13And18: 0,
                        Beetween19And35: 0,
                        Beetween36And60: 0,
                        Above60: 0,
                        Total: 0,
                        Gender: '',
                    }];
                } else {
                    let lengths = treatmentDetailModel_aggregate.length;
                    for (let index = 0; index < lengths; index++) {
                        data[index] = {
                            name: treatmentDetailModel_aggregate[index]._id.name,
                            Beetween03And06: treatmentDetailModel_aggregate[index].sumBeetween0307,
                            Beetween07And12: treatmentDetailModel_aggregate[index].sumBeetween0812,
                            Beetween13And18: treatmentDetailModel_aggregate[index].sumBeetween1318,
                            Beetween19And35: treatmentDetailModel_aggregate[index].sumBeetween1935,
                            Beetween36And60: treatmentDetailModel_aggregate[index].sumBeetween3660,
                            Above60: treatmentDetailModel_aggregate[index].sumBeetween0061,
                            Total: treatmentDetailModel_aggregate[index].sum,
                            Gender: treatmentDetailModel_aggregate[index]._id.sex,
                        }
                    }
                    return data
                }
            } else if (r_or_v === 1) {
                const treatmentDetailModel_aggregate = await mongodbController.purchaseOrderDetailModel.aggregate(
                    [
                        match_treatmentModel,
                        { '$lookup': { 'from': 'l_casepatient', 'localField': '_ref_casepatinetid', 'foreignField': '_id', 'as': 'name' } },
                        { '$lookup': { 'from': 'm_patients', 'localField': 'name._ref_patient_userstoreid', 'foreignField': 'store._id', 'as': 'm_patients' } },
                        { '$lookup': { 'from': 'm_course', 'localField': '_ref_courseid', 'foreignField': '_id', 'as': 'm_course' } },
                        { '$match': { 'm_course': { '$size': 1 }, 'm_patients': { '$size': 1 }, 'name': { '$size': 1 } } },
                        { '$unwind': { 'path': '$name' } },
                        { '$unwind': { 'path': '$m_patients' } },
                        { '$unwind': { 'path': '$m_course' } },
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
                        match_treatmentModel_by_age,
                        { '$addFields': { 'bdate': { '$dateFromString': { 'dateString': '$m_patients.store.personal.birth_date', 'format': '%Y/%m/%d' } } } },
                        { '$addFields': { 'age': { '$trunc': [{ '$let': { 'vars': { 'diff': { '$subtract': [new Date(), '$bdate'] } }, 'in': { '$divide': ['$$diff', (365 * 24 * 60 * 60 * 1000)] } } }, 0] } } },
                        { '$project': { '_ref_storeid': '$_ref_storeid', '_ref_branchid': '$_ref_branchid', 'totel': { '$sum': '$price_course_total' }, 'sex': '$m_patients.store.personal.gender', 'name': '$m_course.name', 'age': '$age', 'age_day': '$bdate', 'S0307': { '$cond': [{ '$lte': ['$age', 7] }, { '$sum': '$price_course_total' }, 0] }, 'S0812': { '$cond': [{ '$and': [{ '$gte': ['$age', 8] }, { '$lte': ['$age', 12] }] }, { '$sum': '$price_course_total' }, 0] }, 'S1318': { '$cond': [{ '$and': [{ '$gte': ['$age', 13] }, { '$lte': ['$age', 18] }] }, { '$sum': '$price_course_total' }, 0] }, 'S1935': { '$cond': [{ '$and': [{ '$gte': ['$age', 19] }, { '$lte': ['$age', 35] }] }, { '$sum': '$price_course_total' }, 0] }, 'S3660': { '$cond': [{ '$and': [{ '$gte': ['$age', 36] }, { '$lte': ['$age', 60] }] }, { '$sum': '$price_course_total' }, 0] }, 'S0061': { '$cond': [{ '$gte': ['$age', 61] }, { '$sum': '$price_course_total' }, 0] }, 'count0812': { '$cond': [{ '$and': [{ '$gte': ['$age', 8] }, { '$lte': ['$age', 12] }] }, 1, 0] }, 'count0307': { '$cond': [{ '$lte': ['$age', 7] }, 1, 0] }, 'count1318': { '$cond': [{ '$and': [{ '$gte': ['$age', 13] }, { '$lte': ['$age', 18] }] }, 1, 0] }, 'count1935': { '$cond': [{ '$and': [{ '$gte': ['$age', 19] }, { '$lte': ['$age', 35] }] }, 1, 0] }, 'count3660': { '$cond': [{ '$and': [{ '$gte': ['$age', 36] }, { '$lte': ['$age', 60] }] }, 1, 0] }, 'count0061': { '$cond': [{ '$gte': ['$age', 61] }, 1, 0] } } },
                        { '$group': { '_id': { 'name': '$name', 'sex': '$sex' }, 'sumBeetween1935': { '$sum': '$S1935' }, 'sumBeetween1318': { '$sum': '$S1318' }, 'sumBeetween3660': { '$sum': '$S3660' }, 'sumBeetween0307': { '$sum': '$S0307' }, 'sumBeetween0812': { '$sum': '$S0812' }, 'sumBeetween0061': { '$sum': '$S0061' }, 'sum': { '$sum': '$totel' }, 'countBeetween1935': { '$sum': '$count1935' }, 'countBeetween1318': { '$sum': '$count1318' }, 'countBeetween3660': { '$sum': '$count3660' }, 'countBeetween0307': { '$sum': '$count0307' }, 'countBeetween0812': { '$sum': '$count0812' }, 'countBeetween0061': { '$sum': '$count0061' }, 'totel': { '$sum': 1 } } },
                        { '$sort': { 'totel': -1 } }
                    ], (err) => { if (err) { callback(err); return; } }
                );
                if (!treatmentDetailModel_aggregate || treatmentDetailModel_aggregate.length === 0) {
                    return [{
                        name: 'ไม่พบข้อมูล',
                        Beetween03And06: 0,
                        Beetween07And12: 0,
                        Beetween13And18: 0,
                        Beetween19And35: 0,
                        Beetween36And60: 0,
                        Above60: 0,
                        Total: 0,
                        Gender: '',
                    }];
                } else {
                    let lengths = treatmentDetailModel_aggregate.length;
                    for (let index = 0; index < lengths; index++) {
                        data[index] = {
                            name: treatmentDetailModel_aggregate[index]._id.name,
                            Beetween03And06: treatmentDetailModel_aggregate[index].countBeetween0307,
                            Beetween07And12: treatmentDetailModel_aggregate[index].countBeetween0812,
                            Beetween13And18: treatmentDetailModel_aggregate[index].countBeetween1318,
                            Beetween19And35: treatmentDetailModel_aggregate[index].countBeetween1935,
                            Beetween36And60: treatmentDetailModel_aggregate[index].countBeetween3660,
                            Above60: treatmentDetailModel_aggregate[index].countBeetween0061,
                            Total: treatmentDetailModel_aggregate[index].totel,
                            Gender: treatmentDetailModel_aggregate[index]._id.sex,
                        }

                    }
                    return data
                }
            } else {
                return 0;
            }

        }
        const sum_count_treatment_pt_diagnosis_group = async () => {
            let data = []
            if (r_or_v === 0) {
                const sum_count_treatment_pt_diagnosis_groups = await mongodbController.purchaseOrderModel.aggregate(
                    [
                        match_treatmentModel,
                        { '$lookup': { 'from': 'l_casepatient_stage_3', 'localField': '_ref_casepatinetid', 'foreignField': '_ref_casepatinetid', 'as': 'l_casepatient_stage_3' } },
                        { '$unwind': { 'path': '$l_casepatient_stage_3' } },
                        { '$lookup': { 'from': 'l_casepatient', 'localField': 'l_casepatient_stage_3._ref_casepatinetid', 'foreignField': '_id', 'as': 'l_casepatient' } },
                        { '$unwind': { 'path': '$l_casepatient' } },
                        { '$lookup': { 'from': 'm_patients', 'localField': 'l_casepatient._ref_patient_userstoreid', 'foreignField': 'store._id', 'as': 'm_patients' } },
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
                        match_treatmentModel_by_age,
                        { '$addFields': { 'bdate': { '$dateFromString': { 'dateString': '$m_patients.store.personal.birth_date', 'format': '%Y/%m/%d' } } } },
                        { '$addFields': { 'age': { '$trunc': [{ '$let': { 'vars': { 'diff': { '$subtract': [new Date(), '$bdate'] } }, 'in': { '$divide': ['$$diff', (365 * 24 * 60 * 60 * 1000)] } } }, 0] } } },
                        { '$project': { '_ref_storeid': '$_ref_storeid', '_ref_branchid': '$_ref_branchid', 'totel': { '$sum': '$price_course_total' }, 'sex': '$m_patients.store.personal.gender', name: { '$switch': { 'branches': [{ 'case': { '$ne': ['$l_casepatient_stage_3.stage3data.ortho.upper', null] }, 'then': '$l_casepatient_stage_3.stage3data.ortho.upper.pt_diagnosis' }, { 'case': { '$ne': ['$l_casepatient_stage_3.stage3data.ortho.lower', null] }, 'then': '$l_casepatient_stage_3.stage3data.ortho.lower.pt_diagnosis' }, { 'case': { '$ne': ['$l_casepatient_stage_3.stage3data.ortho.trunk_spine', null] }, 'then': '$l_casepatient_stage_3.stage3data.ortho.trunk_spine.pt_diagnosis' }, { 'case': { '$ne': ['$l_casepatient_stage_3.stage3data.ortho.general', null] }, 'then': '$l_casepatient_stage_3.stage3data.ortho.general.pt_diagnosis' }] } }, 'age': '$age', 'age_day': '$bdate', 'S0307': { '$cond': [{ '$lte': ['$age', 7] }, { '$sum': ['$price_course_total', 'price_product_total'] }, 0] }, 'S0812': { '$cond': [{ '$and': [{ '$gte': ['$age', 8] }, { '$lte': ['$age', 12] }] }, { '$sum': ['$price_course_total', 'price_product_total'] }, 0] }, 'S1318': { '$cond': [{ '$and': [{ '$gte': ['$age', 13] }, { '$lte': ['$age', 18] }] }, { '$sum': ['$price_course_total', 'price_product_total'] }, 0] }, 'S1935': { '$cond': [{ '$and': [{ '$gte': ['$age', 19] }, { '$lte': ['$age', 35] }] }, { '$sum': ['$price_course_total', 'price_product_total'] }, 0] }, 'S3660': { '$cond': [{ '$and': [{ '$gte': ['$age', 36] }, { '$lte': ['$age', 60] }] }, { '$sum': ['$price_course_total', 'price_product_total'] }, 0] }, 'S0061': { '$cond': [{ '$gte': ['$age', 61] }, { '$sum': ['$price_course_total', 'price_product_total'] }, 0] }, 'count0812': { '$cond': [{ '$and': [{ '$gte': ['$age', 8] }, { '$lte': ['$age', 12] }] }, 1, 0] }, 'count0307': { '$cond': [{ '$lte': ['$age', 7] }, 1, 0] }, 'count1318': { '$cond': [{ '$and': [{ '$gte': ['$age', 13] }, { '$lte': ['$age', 18] }] }, 1, 0] }, 'count1935': { '$cond': [{ '$and': [{ '$gte': ['$age', 19] }, { '$lte': ['$age', 35] }] }, 1, 0] }, 'count3660': { '$cond': [{ '$and': [{ '$gte': ['$age', 36] }, { '$lte': ['$age', 60] }] }, 1, 0] }, 'count0061': { '$cond': [{ '$gte': ['$age', 61] }, 1, 0] } } },
                        { '$group': { '_id': { 'name': '$name', 'sex': '$sex' }, 'sumBeetween1935': { '$sum': '$S1935' }, 'sumBeetween1318': { '$sum': '$S1318' }, 'sumBeetween3660': { '$sum': '$S3660' }, 'sumBeetween0307': { '$sum': '$S0307' }, 'sumBeetween0812': { '$sum': '$S0812' }, 'sumBeetween0061': { '$sum': '$S0061' }, 'sum': { '$sum': '$totel' }, 'countBeetween1935': { '$sum': '$count1935' }, 'countBeetween1318': { '$sum': '$count1318' }, 'countBeetween3660': { '$sum': '$count3660' }, 'countBeetween0307': { '$sum': '$count0307' }, 'countBeetween0812': { '$sum': '$count0812' }, 'countBeetween0061': { '$sum': '$count0061' }, 'totel': { '$sum': 1 } } },
                        { '$sort': { 'sum': -1 } }
                    ], (err) => { if (err) { callback(err); return; } }
                );
                if (!sum_count_treatment_pt_diagnosis_groups || sum_count_treatment_pt_diagnosis_groups.length === 0) {
                    return [{
                        name: 'ไม่พบข้อมูล',
                        Beetween03And06: 0,
                        Beetween07And12: 0,
                        Beetween13And18: 0,
                        Beetween19And35: 0,
                        Beetween36And60: 0,
                        Above60: 0,
                        Total: 0,
                        Gender: '',
                    }];
                } else {
                    let lengths = sum_count_treatment_pt_diagnosis_groups.length;
                    for (let index = 0; index < lengths; index++) {
                        data[index] = {
                            name: sum_count_treatment_pt_diagnosis_groups[index]._id.name,
                            Beetween03And06: sum_count_treatment_pt_diagnosis_groups[index].sumBeetween0307,
                            Beetween07And12: sum_count_treatment_pt_diagnosis_groups[index].sumBeetween0812,
                            Beetween13And18: sum_count_treatment_pt_diagnosis_groups[index].sumBeetween1318,
                            Beetween19And35: sum_count_treatment_pt_diagnosis_groups[index].sumBeetween1935,
                            Beetween36And60: sum_count_treatment_pt_diagnosis_groups[index].sumBeetween3660,
                            Above60: sum_count_treatment_pt_diagnosis_groups[index].sumBeetween0061,
                            Total: sum_count_treatment_pt_diagnosis_groups[index].sum,
                            Gender: sum_count_treatment_pt_diagnosis_groups[index]._id.sex,
                        }
                    }
                    return data
                }
            } else if (r_or_v === 1) {
                const sum_count_treatment_pt_diagnosis_groups = await mongodbController.purchaseOrderModel.aggregate(
                    [
                        match_treatmentModel,
                        { '$lookup': { 'from': 'l_casepatient_stage_3', 'localField': '_ref_casepatinetid', 'foreignField': '_ref_casepatinetid', 'as': 'l_casepatient_stage_3' } },
                        { '$unwind': { 'path': '$l_casepatient_stage_3' } },
                        { '$lookup': { 'from': 'l_casepatient', 'localField': 'l_casepatient_stage_3._ref_casepatinetid', 'foreignField': '_id', 'as': 'l_casepatient' } },
                        { '$unwind': { 'path': '$l_casepatient' } },
                        { '$lookup': { 'from': 'm_patients', 'localField': 'l_casepatient._ref_patient_userstoreid', 'foreignField': 'store._id', 'as': 'm_patients' } },
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
                        match_treatmentModel_by_age,
                        { '$addFields': { 'bdate': { '$dateFromString': { 'dateString': '$m_patients.store.personal.birth_date', 'format': '%Y/%m/%d' } } } },
                        { '$addFields': { 'age': { '$trunc': [{ '$let': { 'vars': { 'diff': { '$subtract': [new Date(), '$bdate'] } }, 'in': { '$divide': ['$$diff', (365 * 24 * 60 * 60 * 1000)] } } }, 0] } } },
                        { '$project': { '_ref_storeid': '$_ref_storeid', '_ref_branchid': '$_ref_branchid', 'totel': { '$sum': '$price_course_total' }, 'sex': '$m_patients.store.personal.gender', name: { '$switch': { 'branches': [{ 'case': { '$ne': ['$l_casepatient_stage_3.stage3data.ortho.upper', null] }, 'then': '$l_casepatient_stage_3.stage3data.ortho.upper.pt_diagnosis' }, { 'case': { '$ne': ['$l_casepatient_stage_3.stage3data.ortho.lower', null] }, 'then': '$l_casepatient_stage_3.stage3data.ortho.lower.pt_diagnosis' }, { 'case': { '$ne': ['$l_casepatient_stage_3.stage3data.ortho.trunk_spine', null] }, 'then': '$l_casepatient_stage_3.stage3data.ortho.trunk_spine.pt_diagnosis' }, { 'case': { '$ne': ['$l_casepatient_stage_3.stage3data.ortho.general', null] }, 'then': '$l_casepatient_stage_3.stage3data.ortho.general.pt_diagnosis' }] } }, 'age': '$age', 'age_day': '$bdate', 'S0307': { '$cond': [{ '$lte': ['$age', 7] }, { '$sum': ['$price_course_total', 'price_product_total'] }, 0] }, 'S0812': { '$cond': [{ '$and': [{ '$gte': ['$age', 8] }, { '$lte': ['$age', 12] }] }, { '$sum': ['$price_course_total', 'price_product_total'] }, 0] }, 'S1318': { '$cond': [{ '$and': [{ '$gte': ['$age', 13] }, { '$lte': ['$age', 18] }] }, { '$sum': ['$price_course_total', 'price_product_total'] }, 0] }, 'S1935': { '$cond': [{ '$and': [{ '$gte': ['$age', 19] }, { '$lte': ['$age', 35] }] }, { '$sum': ['$price_course_total', 'price_product_total'] }, 0] }, 'S3660': { '$cond': [{ '$and': [{ '$gte': ['$age', 36] }, { '$lte': ['$age', 60] }] }, { '$sum': ['$price_course_total', 'price_product_total'] }, 0] }, 'S0061': { '$cond': [{ '$gte': ['$age', 61] }, { '$sum': ['$price_course_total', 'price_product_total'] }, 0] }, 'count0812': { '$cond': [{ '$and': [{ '$gte': ['$age', 8] }, { '$lte': ['$age', 12] }] }, 1, 0] }, 'count0307': { '$cond': [{ '$lte': ['$age', 7] }, 1, 0] }, 'count1318': { '$cond': [{ '$and': [{ '$gte': ['$age', 13] }, { '$lte': ['$age', 18] }] }, 1, 0] }, 'count1935': { '$cond': [{ '$and': [{ '$gte': ['$age', 19] }, { '$lte': ['$age', 35] }] }, 1, 0] }, 'count3660': { '$cond': [{ '$and': [{ '$gte': ['$age', 36] }, { '$lte': ['$age', 60] }] }, 1, 0] }, 'count0061': { '$cond': [{ '$gte': ['$age', 61] }, 1, 0] } } },
                        { '$group': { '_id': { 'name': '$name', 'sex': '$sex' }, 'sumBeetween1935': { '$sum': '$S1935' }, 'sumBeetween1318': { '$sum': '$S1318' }, 'sumBeetween3660': { '$sum': '$S3660' }, 'sumBeetween0307': { '$sum': '$S0307' }, 'sumBeetween0812': { '$sum': '$S0812' }, 'sumBeetween0061': { '$sum': '$S0061' }, 'sum': { '$sum': '$totel' }, 'countBeetween1935': { '$sum': '$count1935' }, 'countBeetween1318': { '$sum': '$count1318' }, 'countBeetween3660': { '$sum': '$count3660' }, 'countBeetween0307': { '$sum': '$count0307' }, 'countBeetween0812': { '$sum': '$count0812' }, 'countBeetween0061': { '$sum': '$count0061' }, 'totel': { '$sum': 1 } } },
                        { '$sort': { 'totel': -1 } }
                    ], (err) => { if (err) { callback(err); return; } }
                );
                if (!sum_count_treatment_pt_diagnosis_groups || sum_count_treatment_pt_diagnosis_groups.length === 0) {
                    return [{
                        name: 'ไม่พบข้อมูล',
                        Beetween03And06: 0,
                        Beetween07And12: 0,
                        Beetween13And18: 0,
                        Beetween19And35: 0,
                        Beetween36And60: 0,
                        Above60: 0,
                        Total: 0,
                        Gender: '',
                    }];
                } else {
                    let lengths = sum_count_treatment_pt_diagnosis_groups.length;
                    for (let index = 0; index < lengths; index++) {
                        data[index] = {
                            name: sum_count_treatment_pt_diagnosis_groups[index]._id.name,
                            Beetween03And06: sum_count_treatment_pt_diagnosis_groups[index].countBeetween0307,
                            Beetween07And12: sum_count_treatment_pt_diagnosis_groups[index].countBeetween0812,
                            Beetween13And18: sum_count_treatment_pt_diagnosis_groups[index].countBeetween1318,
                            Beetween19And35: sum_count_treatment_pt_diagnosis_groups[index].countBeetween1935,
                            Beetween36And60: sum_count_treatment_pt_diagnosis_groups[index].countBeetween3660,
                            Above60: sum_count_treatment_pt_diagnosis_groups[index].countBeetween0061,
                            Total: sum_count_treatment_pt_diagnosis_groups[index].totel,
                            Gender: sum_count_treatment_pt_diagnosis_groups[index]._id.sex,
                        }

                    }
                    return data
                }
            } else {
                return 0;
            }
        }
        //
        let mapdata;
        mapdata = {
            date_start: await chack_date_start(),//แก้เเล้ว
            date_end: await chack_date_end(),//แก้เเล้ว
            sum_count_revenues_product: await sum_count_revenues_product_treatmentModel(),
            sum_count_revenues_diagnosis: await sum_count_revenues_product_diagnosis(),
            sum_count_revenues_course: await sum_count_revenues_course_treatmentModel(),
            sum_count_revenues_department: await sum_count_revenues_department(), //แก้เเล้ว
            treatment_group: await sum_count_treatment_group(),
            pt_diagnosis_group: await sum_count_treatment_pt_diagnosis_group(),
        }

        callback(null);
        return mapdata;
    };

}
module.exports = view_revenues;

