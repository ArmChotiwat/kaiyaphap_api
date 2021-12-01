const view_sellproductreport_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''), // ค่าเริ่มต้นเป็นค่า null อยู่ใน type string "null"
        todate: new String(''), // 0 == YTD , 1 == MTD , 2 == drily 
    }, callback = (err = new Err) => { }
) => {
    const hader = 'view_revenues_visitor_controller';
    if (typeof data._storeid !== 'string' || data._storeid === '' || data._storeid === null ||
        typeof data.todate !== 'string' || data.todate === '' || data.todate === null || !data.todate
    ) {
        callback(new Error(` ${hader} : data Error`));
        return;
    } else {
        const checkObjectId = require('../../miscController').checkObjectId
        const moment = require('moment');
        const chackWeekOfMouth = require('./chackWeekOfMouth')
        const mongodbController = require('../../mongodbController')
        const storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const branchid = await checkObjectId(data._branchid, (err) => { if (err) { return; } });
        const chackMonthOrYear = require('./chackMonthOrYear');
        let year, mouth;
        let chack_date_start, p_chack_date_start, chack_date_end, p_chack_date_end;
        if (+data.todate === 0) {
            year = moment().format('YYYY')
            mouth = 'null'
            chack_date_start = await chackMonthOrYear.chack_date_start({ Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
            p_chack_date_start = await chackMonthOrYear.p_chack_date_start({ date: chack_date_start, Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
            chack_date_end = await chackMonthOrYear.chack_date_end({ Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
            p_chack_date_end = await chackMonthOrYear.p_chack_date_end({ date: chack_date_end, Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });

        } else if (+data.todate === 1) {
            year = 'null'
            mouth = moment().format('MM')
            chack_date_start = await chackMonthOrYear.chack_date_start({ Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
            p_chack_date_start = await chackMonthOrYear.p_chack_date_start({ date: chack_date_start, Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
            chack_date_end = await chackMonthOrYear.chack_date_end({ Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
            p_chack_date_end = await chackMonthOrYear.p_chack_date_end({ date: chack_date_end, Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });

        } else if (+data.todate === 2) {
            chack_date_start = moment().format('YYYY-MM-DD');
            p_chack_date_start = moment().subtract(1, 'day').format('YYYY-MM-DD');
            chack_date_end = moment().format('YYYY-MM-DD');
            p_chack_date_end = moment().subtract(1, 'day').format('YYYY-MM-DD');
        } else {
            callback(new Error(` ${hader} : todate most be 0 , 1 , 2 `));
            return;
        }

        let match;
        if (!branchid) {
            match = { '$match': { '_ref_storeid': storeid, 'create_date_string': { '$gte': chack_date_start, '$lte': chack_date_end } } }
        } else {
            match = { '$match': { '_ref_storeid': storeid, '_ref_branchid': branchid, 'create_date_string': { '$gte': chack_date_start, '$lte': chack_date_end } } }
        }
        const sum_total_revenues = async () => {
            const treatmentDetailModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    match,
                    { '$group': { '_id': '$_ref_storeid', 'sumtotal': { '$sum': '$price_product_list_total_discount' } } }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            if (!treatmentDetailModel || treatmentDetailModel.length === 0) {
                return 0;
            } else {
                return treatmentDetailModel[0].sumtotal;
            }
        }

        const proportion_by_group = async () => {
            const treatmentDetailModel = await mongodbController.purchaseOrderDetailModel.aggregate(
                [
                    match,
                    {
                        '$lookup': {
                            'from': 'm_product',
                            'localField': '_ref_productid',
                            'foreignField': '_id',
                            'as': 'm_product'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_product'
                        }
                    }, {
                        '$addFields': {
                            '_ref_product_groupid': '$m_product._ref_product_groupid'
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_product_group',
                            'localField': '_ref_product_groupid',
                            'foreignField': '_id',
                            'as': 'm_product_group'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_product_group'
                        }
                    }, {
                        '$lookup': {
                            'from': 'l_purchaseorder',
                            'localField': '_ref_poid',
                            'foreignField': '_id',
                            'as': 'l_purchaseorder'
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_purchaseorder',
                            'includeArrayIndex': 'l_purchaseorder_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            'l_purchaseorder_index': 0
                        }
                    }, {
                        '$group': {
                            '_id': '$m_product_group.name',
                            'sumtotal': {
                                '$sum': '$l_purchaseorder.price_product_list_total_discount'
                            },
                            'sumcount_product': {
                                '$sum': '$product_count'
                            },
                            'sumprice_product': {
                                '$sum': '$product_price'
                            }
                        }
                    }, {
                        '$sort': {
                            'sumtotal': -1
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            let map = [];
            if (!treatmentDetailModel || treatmentDetailModel.length === 0) {
                map[0] = {
                    group_name: 'ไม่พบข้อมูล',
                    sumtotal: 0,
                    sumcount_product: 0,
                    sumprice_product: 0,
                }
                return map;
            } else {
                for (let index = 0, length = treatmentDetailModel.length; index < length; index++) {
                    map[index] = {
                        group_name: treatmentDetailModel[index]._id,
                        sumtotal: treatmentDetailModel[index].sumtotal,
                        sumcount_product: treatmentDetailModel[index].sumcount_product,
                        sumprice_product: treatmentDetailModel[index].sumprice_product,
                    }
                }
                return map;
            }
        }
        const count_best_low = async () => {
            const treatmentDetailModel = await mongodbController.purchaseOrderDetailModel.aggregate(
                [
                    match,
                    {
                        '$match': {
                            'course_count': 0
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_product',
                            'localField': '_ref_productid',
                            'foreignField': '_id',
                            'as': 'm_product'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_product'
                        }
                    }, {
                        '$match': {
                            'product_count': {
                                '$gt': 0
                            }
                        }
                    }, {
                        '$group': {
                            '_id': '$m_product.product_name',
                            'count_product': {
                                '$sum': '$product_count'
                            }
                        }
                    }, {
                        '$sort': {
                            'count_product': -1
                        }
                    }
                ]
                ,
                (err) => { if (err) { callback(err); return; } }
            );

            let map;
            if (!treatmentDetailModel || treatmentDetailModel.length === 0) {
                map = {
                    name_count_baet: 'ไม่พบข้อมูล',
                    name_count_low: 'ไม่พบข้อมูล',
                    count_baet: 0,
                    count_low: 0
                }
            } else {
                map = {
                    name_count_baet: treatmentDetailModel[0]._id,
                    name_count_low: treatmentDetailModel[treatmentDetailModel.length - 1]._id,
                    count_baet: treatmentDetailModel[0].count_product,
                    count_low: treatmentDetailModel[treatmentDetailModel.length - 1].count_product
                }
            }

            return map
        }
        const revenues_best_low = async () => {
            const treatmentDetailModel = await mongodbController.purchaseOrderDetailModel.aggregate(
                [
                    match,
                    {
                        '$match': {
                            'course_count': 0
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_product',
                            'localField': '_ref_productid',
                            'foreignField': '_id',
                            'as': 'm_product'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_product'
                        }
                    }, {
                        '$lookup': {
                            'from': 'l_purchaseorder',
                            'localField': '_ref_poid',
                            'foreignField': '_id',
                            'as': 'l_purchaseorder'
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_purchaseorder',
                            'includeArrayIndex': 'l_purchaseorder_index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$match': {
                            'l_purchaseorder_index': 0
                        }
                    }, {
                        '$group': {
                            '_id': '$m_product.product_name',
                            'price_product_total': {
                                '$sum': '$l_purchaseorder.price_product_list_total_discount'
                            }
                        }
                    }, {
                        '$match': {
                            'price_product_total': {
                                '$gt': 0
                            }
                        }
                    }, {
                        '$sort': {
                            'price_product_total': -1
                        }
                    }
                ]
                ,
                (err) => { if (err) { callback(err); return; } }
            );
            let map;
            if (!treatmentDetailModel || treatmentDetailModel.length === 0) {
                map = {
                    name_revenues_baet: 'ไม่พบข้อมูล',
                    name_revenues_low: 'ไม่พบข้อมูล',
                    revenues_baet: 0,
                    revenues_low: 0
                }
            } else {
                map = {
                    name_revenues_baet: treatmentDetailModel[0]._id,
                    name_revenues_low: treatmentDetailModel[treatmentDetailModel.length - 1]._id,
                    revenues_baet: treatmentDetailModel[0].price_product_total,
                    revenues_low: treatmentDetailModel[treatmentDetailModel.length - 1].price_product_total
                }
            }
            return map
        }

        const top_10_product = async () => {
            const treatmentDetailModel = await mongodbController.purchaseOrderDetailModel.aggregate(
                [
                    match,
                    {
                        '$match': {
                            'course_count': 0
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_product',
                            'localField': '_ref_productid',
                            'foreignField': '_id',
                            'as': 'm_product'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_product'
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_product_inventory',
                            'localField': '_ref_productid',
                            'foreignField': '_ref_productid',
                            'as': 'm_product_inventory'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_product_inventory'
                        }
                    }, {
                        '$lookup': {
                            'from': 'l_purchaseorder',
                            'localField': '_ref_poid',
                            'foreignField': '_id',
                            'as': 'l_purchaseorder'
                        }
                    }, {
                        '$unwind': {
                            'path': '$l_purchaseorder',
                            'includeArrayIndex': 'l_purchaseorder_Index',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$group': {
                            '_id': {
                                'name': '$m_product.product_name'
                            },
                            'sumtotal': {
                                '$sum': '$l_purchaseorder.price_product_list_total_discount'
                            },
                            'sumcount_product': {
                                '$sum': '$product_count'
                            },
                            'price': {
                                '$avg': '$m_product_inventory.product_price'
                            }
                        }
                    }, {
                        '$project': {
                            'price': {
                                '$round': [
                                    '$price', 2
                                ]
                            },
                            'sumcount_product': 1,
                            'sumtotal': 1,
                            '_id': 1
                        }
                    }, {
                        '$sort': {
                            'sumtotal': -1
                        }
                    }
                ]
                ,
                (err) => { if (err) { callback(err); return; } }
            );
            let map = [];
            if (!treatmentDetailModel || treatmentDetailModel.length === 0) {
                map[0] = {
                    name_product: 'ไม่พบข้อมูล',
                    revenues: 0,
                    sell_out: 0,
                    price: 0
                }
            } else {
                for (let index = 0, length = treatmentDetailModel.length; index < length; index++) {
                    map[index] = {
                        name_product: treatmentDetailModel[index]._id.name,
                        revenues: treatmentDetailModel[index].sumtotal,
                        sell_out: treatmentDetailModel[index].sumcount_product,
                        price: treatmentDetailModel[index].price
                    }
                }
            }
            return map
        }

        const growth = async () => {
            const CTD = await sum_total_revenues();
            let mathcs
            if (!branchid) {
                mathcs = { '$match': { '_ref_storeid': storeid, 'create_date_string': { '$gte': p_chack_date_start, '$lte': p_chack_date_end } } }
            } else {
                mathcs = { '$match': { '_ref_storeid': storeid, '_ref_branchid': branchid, 'create_date_string': { '$gte': p_chack_date_start, '$lte': p_chack_date_end } } }
            }
            const treatmentDetailModel = await mongodbController.purchaseOrderModel.aggregate(
                [
                    mathcs,
                    { '$group': { '_id': '$_ref_storeid', 'sumtotal': { '$sum': '$price_product_list_total_discount' } } }
                ], (err) => { if (err) { callback(err); return; } }
            );
            if (!treatmentDetailModel || treatmentDetailModel.length === 0) {// ในกรณีที่หายอดขายของปีที่เเล้วไม่เจอ ให้ยอดขายของปีที่แล้วเท่ากับ 0 
                const PTD = 0; // PYD คือ ยอดยายของปีที่เเล้ว 
                let Growth = 0;
                try {
                    Growth = CTD - PTD;
                } catch (error) {
                    Growth = 0;
                }
                return Growth
            } else {
                const PTD = treatmentDetailModel[0].sumtotal;
                let Growth = 0;
                try {
                    Growth = CTD - PTD;
                } catch (error) {
                    Growth = 0;
                }
                return Growth
            }
        }

        const accumulated = async () => {
            const weeks = await chackWeekOfMouth(1, chack_date_start, chack_date_end, (err) => { if (err) { callback(err); return; } });
            let mathcs, P_start, P_end;
            if (!branchid) {
                mathcs = { '$match': { '_ref_storeid': storeid } }
            } else {
                mathcs = { '$match': { '_ref_storeid': storeid, '_ref_branchid': branchid } }
            }
            let map = []
            if (+data.todate === 0) {
                const mouth_string = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
                for (let index = 0; index < 12; index++) {
                    P_start = moment().month(index).startOf('month').format('YYYY-MM-DD');
                    P_end = moment().month(index).endOf('month').format('YYYY-MM-DD');
                    const treatmentDetailModel = await mongodbController.purchaseOrderModel.aggregate(
                        [
                            mathcs,
                            { '$match': { 'create_date_string': { '$gte': P_start, '$lte': P_end } } },
                            { '$group': { '_id': '$_ref_storeid', 'sumtotal': { '$sum': '$price_product_list_total_discount' } } }
                        ], (err) => { if (err) { callback(err); return; } }
                    );
                    if (!treatmentDetailModel || treatmentDetailModel.length === 0) {
                        if (index === 0) {
                            map[index] = {
                                day: mouth_string[index],
                                accumulated: 0
                            };
                        } else {
                            if ((moment().month() - 1) <= index) {
                                map[index] = {
                                    day: mouth_string[index],
                                    accumulated: 0
                                };
                            } else if (map[index - 1].accumulated !== 0) {
                                map[index] = {
                                    day: mouth_string[index],
                                    accumulated: map[index - 1].accumulated
                                };
                            } else {
                                map[index] = {
                                    day: mouth_string[index],
                                    accumulated: 0
                                };
                            }
                        }
                    } else {
                        if (index === 0) {
                            map[index] = {
                                day: mouth_string[index],
                                accumulated: treatmentDetailModel[0].sumtotal
                            };
                        } else {
                            if (treatmentDetailModel[0].sumtotal === 0) {
                                map[index] = {
                                    day: mouth_string[index],
                                    accumulated: map[index - 1].accumulated
                                };
                            } else {
                                map[index] = {
                                    day: mouth_string[index],
                                    accumulated: map[index - 1].accumulated + treatmentDetailModel[0].sumtotal
                                };
                            }
                        }
                    }
                }
                return map
            } else {
                for (let index = 0, length = weeks.length; index < length; index++) {
                    const treatmentDetailModel = await mongodbController.purchaseOrderModel.aggregate(
                        [
                            mathcs,
                            { '$match': { 'create_date_string': { '$gte': weeks[index].P_start, '$lte': weeks[index].P_end } } },
                            { '$group': { '_id': '$_ref_storeid', 'sumtotal': { '$sum': '$price_product_list_total_discount' } } }
                        ], (err) => { if (err) { callback(err); return; } }
                    );
                    if (!treatmentDetailModel || treatmentDetailModel.length === 0) {// ในกรณีที่หายอดขายของปีที่เเล้วไม่เจอ ให้ยอดขายของปีที่แล้วเท่ากับ 0 
                        if (index === 0) {
                            map.push({
                                day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
                                accumulated: 0
                            });
                            // console.log(` index : ${index} || index-1 : ${index - 1}`);
                        } else {
                            // console.log(` index : ${index} || index-1 : ${index - 1}`);
                            if (moment().week() <= weeks[index].week) {
                                map.push({
                                    day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
                                    // sumtotal : 0,
                                    accumulated: 0
                                });
                            } else if (map[index - 1].accumulated !== 0) {
                                map.push({
                                    day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
                                    // sumtotal : 0,
                                    accumulated: map[index - 1].accumulated
                                });
                            } else {
                                map.push({
                                    day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
                                    accumulated: 0
                                });
                            }
                        }
                    } else {
                        if (index === 0) {
                            map.push({
                                day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
                                // sumtotal : treatmentDetailModel[0].sumtotal,
                                accumulated: treatmentDetailModel[0].sumtotal
                            });
                        } else {
                            if (map[index - 1].accumulated !== 0 && treatmentDetailModel[0].sumtotal === 0) {
                                map.push({
                                    day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
                                    // sumtotal : treatmentDetailModel[0].sumtotal,
                                    accumulated: map[index - 1].accumulated
                                });
                            } else {
                                map.push({
                                    day: moment(weeks[index].P_start).format('DD') + '-' + moment(weeks[index].P_end).format('DD'),
                                    //sumtotal : treatmentDetailModel[0].sumtotal,
                                    accumulated: map[index - 1].accumulated + treatmentDetailModel[0].sumtotal
                                });
                            }
                        }
                    }
                    // console.log(map[index]);
                }
                return map
            }
        }

        //(1,chack_date_start,chack_date_end, (err) => { if (err) { callback(err); return; }});
        let mapdata;
        mapdata = {
            date_start: chack_date_start,
            date_end: chack_date_end,
            sum_total_revenues: await sum_total_revenues(),
            proportion_by_group: await proportion_by_group(),
            count_best_low: await count_best_low(),
            revenues_best_low: await revenues_best_low(),
            top_10_product: await top_10_product(),
            growth: await growth(),
            accumulated: await accumulated(),
        }
        callback(null);
        return mapdata;
    }

}

module.exports = view_sellproductreport_Controller;