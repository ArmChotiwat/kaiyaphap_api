/**
 * Controller สำหรับ ดูใบ PO ที่ Counter 
 */
const PurchaseOrder_View_forCounter_Controller = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_poid: '',
    },
    callback = (err = new Error) => { }
) => {
    const controllerName = `PurchaseOrder_View_forCounter_Controller`;

    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (typeof data._ref_poid != 'string' || !validateObjectId(data._ref_poid)) { callback(new Error(`${controllerName}: <data._ref_poid> must be String ObjectId`)); return; }
    else {

        const { checkObjectId, purchaseOrderModel, purchaseOrderDetailModel } = require('../../mongodbController');

        const _ref_poid = await checkObjectId(data._ref_poid, (err) => { if (err) { callback(err); return; } });
        const _storeid = await checkObjectId(data._ref_storeid, (err) => { if (err) { callback(err); return; } });
        const _branchid = await checkObjectId(data._ref_branchid, (err) => { if (err) { callback(err); return; } });
        if (!_ref_poid) { callback(new Error(`${controllerName}: _ref_poid convert ObjectId failed`)); return; }
        else {
            const findPurchaseOrderHeader = await purchaseOrderModel.aggregate(
                [
                    {
                        '$match': {
                            '_id': _ref_poid,
                            '_ref_storeid': _storeid,
                            '_ref_branchid': _branchid,
                            'ispaid': true,
                            'isclosed': false,
                            'istruncated': false
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_stores',
                            'localField': '_ref_storeid',
                            'foreignField': '_id',
                            'as': 'm_stores'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_stores'
                        }
                    }, {
                        '$addFields': {
                            'text': '$m_stores.address.tax_id'
                        }
                    }, {
                        '$project': {
                            '_id': 0,
                            'po_data': {
                                '_ref_poid': '$_id',
                                'run_po': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                {
                                                    '$ifNull': [
                                                        '$run_po', false
                                                    ]
                                                }, false
                                            ]
                                        },
                                        'then': null,
                                        'else': '$run_po'
                                    }
                                },
                                '_ref_agent_userid_po_create': '$_ref_agent_userid_create',
                                '_ref_agent_userstoreid_create': '$_ref_agent_userstoreid_create',
                                'agent_po_prename': '$agent_po_lookup.store.personal.pre_name',
                                'agent_po_special_prename': {
                                    '$cond': {
                                        'if': {
                                            '$eq': [
                                                '$agent_po_lookup.store.personal.pre_name', 'อื่นๆ'
                                            ]
                                        },
                                        'then': {
                                            '$ifNull': [
                                                '$agent_po_lookup.store.personal.special_prename', null
                                            ]
                                        },
                                        'else': null
                                    }
                                },
                                'agent_po_firstname': '$agent_po_lookup.store.personal.first_name',
                                'agent_po_lastname': '$agent_po_lookup.store.personal.last_name',
                                'count_product_list': '$count_product_list',
                                'price_product_list_total': '$price_product_list_total',
                                'price_product_list_discount': '$price_product_list_discount',
                                'price_product_list_total_discount': '$price_product_list_total_discount',
                                'count_course_list': '$count_course_list',
                                'price_course_list_total': '$price_course_list_total',
                                'price_course_list_discount': '$price_course_list_discount',
                                'price_course_list_total_discount': '$price_course_list_total_discount',
                                'price_total_before': '$price_total_before',
                                'price_discount': '$price_discount',
                                'price_total_after': '$price_total_after',
                                'create_date': '$create_date',
                                'create_date_string': '$create_date_string',
                                'create_time_string': '$create_time_string',
                                'ispaid': '$ispaid',
                                'paid_type' : '$paid_type'
                            },
                            'text': '$text'
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );

            const findPurchaseOrderDetail = await purchaseOrderDetailModel.aggregate(
                [
                    {
                        '$match': {
                            '_ref_poid': _ref_poid,
                            '_ref_storeid': _storeid,
                            '_ref_branchid': _branchid,
                            'ispaid': true,
                            'isclosed': false,
                            'istruncated': false
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_product',
                            'localField': '_ref_productid',
                            'foreignField': '_id',
                            'as': 'product_lookup'
                        }
                    }, {
                        '$project': {
                            '_id': 0,
                            '_ref_poid': '$_ref_poid',
                            '_ref_po_detailid': '$_id',
                            'run_number': '$run_number',
                            '_ref_productid': '$_ref_productid',
                            'product_name': {
                                '$cond': {
                                    'if': {
                                        '$eq': [
                                            '$_ref_productid', null
                                        ]
                                    },
                                    'then': null,
                                    'else': {
                                        '$arrayElemAt': [
                                            '$product_lookup.product_name', 0
                                        ]
                                    }
                                }
                            },
                            'product_count': '$product_count',
                            'product_price': '$product_price',
                            'product_price_total': '$product_price_total',
                            'product_remark': '$product_remark',
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );

            if (!findPurchaseOrderHeader || findPurchaseOrderHeader.length === 0) { callback(new Error(`${controllerName}: findPurchaseOrderHeader have error`)); return; }
            else if (findPurchaseOrderHeader.length !== 1) { callback(new Error(`${controllerName}: findPurchaseOrderHeader have document (${findPurchaseOrderHeader.length}) not equal 1`)); return; }
            if (!findPurchaseOrderDetail || findPurchaseOrderDetail.length === 0) { callback(new Error(`${controllerName}: findPurchaseOrderDetail have error`)); return; }
            else {
                callback(null);
                return {
                    po_header: findPurchaseOrderHeader[0],
                    podetail: findPurchaseOrderDetail,
                };
            }

        }
    }
};

module.exports = PurchaseOrder_View_forCounter_Controller;