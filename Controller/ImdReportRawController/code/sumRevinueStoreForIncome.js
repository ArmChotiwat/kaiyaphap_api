const sumRevinueStoreForIncomeController = async (data = { _storeid: new String, getDate: new String | new Date() }, callback = (err = new Error) => { }) => {
    const mongodbController = require('../../mongodbController');
    const { checkObjectId } = require('../../mongodbController');
    const moment = require('moment');
    const storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
    try {
        let date = '';
        let match_data, match_data2 = '';
        if (typeof data.getDate === 'string' && data.getDate.length === 10) {
            date = moment(data.getDate).format("YYYY-MM-DD");
            match_data = {
                'create_date_string': {
                    '$gte': moment(date).startOf('month').format('YYYY-MM-DD'),
                    '$lte': moment(date).endOf('month').format('YYYY-MM-DD')
                }
            }
            match_data2 = {
                'create_date_string': {
                    '$lte': moment(date).endOf('month').format('YYYY-MM-DD')
                }
            }
        } else {
            match_data = {
                'create_date_string': {
                    '$gte': moment().startOf('month').format('YYYY-MM-DD'),
                    '$lte': moment().endOf('month').format('YYYY-MM-DD')
                }
            }
            match_data2 = {
                'create_date_string': {
                    '$lte': moment().format('YYYY-MM-DD')
                }
            }
        }
        const f_sum_revinue_store = async () => {
            const sum_revinue_store = await mongodbController.purchaseOrderModel.aggregate
                (
                    [
                        {
                            '$match': {
                                '_ref_storeid': storeid
                            }
                        }, {
                            '$match': match_data2
                        }, {
                            '$group': {
                                '_id': '$_ref_storeid',
                                'price_total_after': {
                                    '$sum': '$price_total_after'
                                },
                                'price_product_list_total_discount': {
                                    '$sum': '$price_product_list_total_discount'
                                },
                                'price_course_list_total_discount': {
                                    '$sum': '$price_course_list_total_discount'
                                }
                            }
                        }
                    ]
                )
            let map;
            if (sum_revinue_store.length === 0 || !sum_revinue_store) {
                return map = {
                    price_total_after: 0,
                    price_product_list_total_discount: 0,
                    price_course_list_total_discount: 0
                };
            } else {
                return map = {
                    price_total_after: sum_revinue_store[0].price_total_after,
                    price_product_list_total_discount: sum_revinue_store[0].price_product_list_total_discount,
                    price_course_list_total_discount: sum_revinue_store[0].price_course_list_total_discount
                };
            }
        }

        const f_sum_revinue_month_store = async () => {
            const sum_revinue_month_store = await mongodbController.purchaseOrderModel.aggregate
                (
                    [
                        {
                            '$match': {
                                '_ref_storeid': storeid
                            }
                        }, {
                            '$match': match_data
                        }, {
                            '$group': {
                                '_id': '$_ref_storeid',
                                'price_total_after': {
                                    '$sum': '$price_total_after'
                                },
                                'price_product_list_total_discount': {
                                    '$sum': '$price_product_list_total_discount'
                                },
                                'price_course_list_total_discount': {
                                    '$sum': '$price_course_list_total_discount'
                                }
                            }
                        }
                    ]
                )
            let map;
            if (sum_revinue_month_store.length === 0 || !sum_revinue_month_store) {
                return map = {
                    price_total_after: 0,
                    price_product_list_total_discount: 0,
                    price_course_list_total_discount: 0
                };
            } else {
                return map = {
                    price_total_after: sum_revinue_month_store[0].price_total_after,
                    price_product_list_total_discount: sum_revinue_month_store[0].price_product_list_total_discount,
                    price_course_list_total_discount: sum_revinue_month_store[0].price_course_list_total_discount
                };
            }
        }

        let map
        map = {
            date_start: match_data.create_date_string.$gte,
            date_end: match_data.create_date_string.$lte,
            sum_revinue_store: await f_sum_revinue_store(),
            sum_revinue_month_store: await f_sum_revinue_month_store()
        }
        callback(null);
        return map;

    } catch (error) {
        callback(error);
        return;
    }
};


module.exports = sumRevinueStoreForIncomeController;