const view_Stock_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''), // ค่าเริ่มต้นเป็นค่า null 
        _ref_product_groupid: new String(''),
        year: new String('')
    }, callback = (err = new Err) => { }
) => {
    const hader = 'view_Stock_Controller';
    if (typeof data._storeid !== 'string' || data._storeid === '' || data._storeid === null ||
        typeof data._branchid !== 'string' || data._branchid === '' || data._branchid === null ||
        typeof data.year !== 'string' || data.year === '' || data.year === null
    ) {
        callback(new Error(` ${hader} : data Error`));
        return;
    } else {
        const checkObjectId = require('../../miscController').checkObjectId
        const moment = require('moment');
        const mongodbController = require('../../mongodbController')
        const storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
        const product_groupid = await checkObjectId(data._ref_product_groupid, (err) => { if (err) { return; } });
        const chackMonthOrYear = require('./chackMonthOrYear');
        let year, mouth, chack_date_start, chack_date_end;

        if (+data.year >= 2020) {
            year = moment(data.year + '-01-01').format('YYYY');
            mouth = 'null';
            chack_date_start = await chackMonthOrYear.chack_date_start({ Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
            chack_date_end = await chackMonthOrYear.chack_date_end({ Year: year, Month: mouth }, (err) => { if (err) { callback(err); return; } });
        } else {
            chack_date_start = moment().format('YYYY-MM-DD')
            chack_date_end = moment().format('YYYY-MM-DD')
        }

        let _ref_product_group_mach
        if (!product_groupid) {
            _ref_product_group_mach = {}
        } else {
            _ref_product_group_mach = { '_ref_product_groupid': product_groupid }
        }

        let map = [];

        let _ref_branchid_mach
        if (!branchid) {
            _ref_branchid_mach = {
                'm_product_inventory._ref_storeid': storeid,
            }
        } else {
            _ref_branchid_mach = {
                'm_product_inventory._ref_storeid': storeid,
                'm_product_inventory._ref_branchid': branchid
            }
        }
        const product_name_all = await mongodbController.productModel.aggregate(
            [
                {
                    '$match': {
                        '_ref_storeid': storeid
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
                        'path': '$m_product_group',
                        'includeArrayIndex': 'm_product_group_index',
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$lookup': {
                        'from': 'm_product_inventory',
                        'localField': '_id',
                        'foreignField': '_ref_productid',
                        'as': 'm_product_inventory'
                    }
                }, {
                    '$unwind': {
                        'path': '$m_product_inventory',
                        'includeArrayIndex': 'm_product_inventory_index',
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$match': _ref_branchid_mach
                }, {
                    '$project': {
                        'name_product_group': '$m_product_group.name',
                        'name_product': '$product_name',
                        'inventoryimport_count': '$m_product_inventory.product_inventory_count',
                        '_id': 1
                    }
                }, {
                    '$group': {
                        '_id': {
                            'name_product': '$name_product',
                            'name_product_group': '$name_product_group'
                        },
                        'product_inventory_counts': {
                            '$sum': '$inventoryimport_count'
                        }
                    }
                }
            ], (err) => { if (err) { callback(err); return; } }
        );

        if (product_name_all.length === 0 || !product_name_all) {
            callback(null);
            return {
                chack_date_start: chack_date_start,
                chack_date_end: chack_date_end,
                map: [{
                    chack_date_start: chack_date_start,
                    chack_date_end: chack_date_end,
                    product: 'ไม่พบข้อมูล',
                    group: 'ไม่พบข้อมูล',
                    path_image: 0,
                    Balance_QTY: 0,
                    Stock_in: 0,
                    Stock_out: 0,
                    Stock_OnHand: 0,
                    AVG_Cost: 0,
                    Stock_value: 0
                }]
            }
        } else {
            const product_name_all_length = product_name_all.length;
            for (let index = 0; index < product_name_all_length; index++) {
                map[index] = {
                    chack_date_start: chack_date_start,
                    chack_date_end: chack_date_end,
                    product: product_name_all[index]._id.name_product,
                    group: product_name_all[index]._id.name_product_group,
                    path_image: 0,
                    Balance_QTY: product_name_all[index].product_inventory_counts,
                    Stock_in: 0,
                    Stock_out: 0,
                    Stock_OnHand: product_name_all[index].product_inventory_counts,
                    AVG_Cost: 0,
                    Stock_value: 0
                }
            }

            const Product_InventoryImport = await mongodbController.inventoryImportModel.aggregate(
                [
                    { '$match': { '_ref_storeid': storeid, '_ref_branchid': branchid } },
                    { '$match': { 'create_date_string': { '$gte': chack_date_start, '$lte': chack_date_end } } },
                    { '$lookup': { 'from': 'm_product', 'localField': '_ref_productid', 'foreignField': '_id', 'as': 'm_product' } },
                    { '$unwind': { 'path': '$m_product', 'includeArrayIndex': 'm_product_index', 'preserveNullAndEmptyArrays': true } },
                    { '$lookup': { 'from': 'm_product_group', 'localField': 'm_product._ref_product_groupid', 'foreignField': '_id', 'as': 'm_product_group' } },
                    { '$unwind': { 'path': '$m_product_group', 'includeArrayIndex': 'm_product_group_index', 'preserveNullAndEmptyArrays': true } },
                    { '$group': { '_id': { '_id': '$_ref_productid', 'name_product': '$m_product.product_name', 'name_product_group': '$m_product_group.name' }, 'product_inventory_counts': { '$sum': '$inventoryimport_count' } } }
                ], (err) => { if (err) { callback(err); return; } }
            );

            const Product_InventoryImport_length = Product_InventoryImport.length;
            for (let index = 0; index < map.length; index++) {
                for (let index1 = 0; index1 < Product_InventoryImport_length; index1++) {
                    if (map[index].product === Product_InventoryImport[index1]._id.name_product && map[index].group === Product_InventoryImport[index1]._id.name_product_group) {
                        map[index] = {
                            chack_date_start: chack_date_start,
                            chack_date_end: chack_date_end,
                            product: map[index].product,
                            group: map[index].group,
                            path_image: 0,
                            Balance_QTY: map[index].Balance_QTY - Product_InventoryImport[index1].product_inventory_counts,
                            Stock_in: Product_InventoryImport[index1].product_inventory_counts,
                            Stock_out: 0,
                            Stock_OnHand: map[index].Stock_OnHand,
                            AVG_Cost: 0,
                            Stock_value: 0
                        }
                    }
                }
            }


            const PurchaseOrder_Detail = await mongodbController.purchaseOrderDetailModel.aggregate(
                [
                    { '$match': { '_ref_storeid': storeid, '_ref_branchid': branchid } },
                    { '$match': { 'create_date_string': { '$gte': chack_date_start, '$lte': chack_date_end } } },
                    { '$lookup': { 'from': 'm_product', 'localField': '_ref_productid', 'foreignField': '_id', 'as': 'm_product' } },
                    { '$unwind': { 'path': '$m_product' } },
                    { '$addFields': { '_ref_product_groupid': '$m_product._ref_product_groupid' } },
                    { '$lookup': { 'from': 'm_product_group', 'localField': '_ref_product_groupid', 'foreignField': '_id', 'as': 'm_product_group' } },
                    { '$unwind': { 'path': '$m_product_group' } },
                    { '$project': { 'name_product_group': '$m_product_group.name', 'name_product': '$m_product.product_name', '_ref_productid': 1, '_ref_product_groupid': 1, 'product_count': 1 } },
                    { '$match': _ref_product_group_mach },
                    { '$group': { '_id': { 'name_product': '$name_product', 'name_product_group': '$name_product_group' }, 'product_count': { '$sum': '$product_count' } } }
                ], (err) => { if (err) { callback(err); return; } }
            );

            const PurchaseOrder_Detail_length = PurchaseOrder_Detail.length;
            for (let index = 0; index < map.length; index++) {
                for (let index1 = 0; index1 < PurchaseOrder_Detail_length; index1++) {
                    if (map[index].product === PurchaseOrder_Detail[index1]._id.name_product && map[index].group === PurchaseOrder_Detail[index1]._id.name_product_group) {
                        map[index] = {
                            chack_date_start: chack_date_start,
                            chack_date_end: chack_date_end,
                            product: map[index].product,
                            group: map[index].group,
                            path_image: 0,
                            Balance_QTY: map[index].Balance_QTY + PurchaseOrder_Detail[index1].product_count,
                            Stock_in: map[index].Stock_in,
                            Stock_out: PurchaseOrder_Detail[index1].product_count,
                            Stock_OnHand: map[index].Stock_OnHand,
                            AVG_Cost: 0,
                            Stock_value: 0
                        }
                    }
                }
            }


            const Product_Price = await mongodbController.productInventoryPriceModel.aggregate(
                [
                    { '$match': { '_ref_storeid': storeid, '_ref_branchid': branchid } },
                    { '$lookup': { 'from': 'm_product', 'localField': '_ref_productid', 'foreignField': '_id', 'as': 'm_product' } },
                    { '$unwind': { 'path': '$m_product' } },
                    { '$addFields': { '_ref_product_groupid': '$m_product._ref_product_groupid' } },
                    { '$lookup': { 'from': 'm_product_group', 'localField': '_ref_product_groupid', 'foreignField': '_id', 'as': 'm_product_group' } },
                    { '$unwind': { 'path': '$m_product_group' } },
                    { '$project': { 'name_product_group': '$m_product_group.name', 'name_product': '$m_product.product_name', '_ref_productid': 1, '_ref_product_groupid': 1, 'product_price': 1 } },
                    { '$match': _ref_product_group_mach },
                    { '$match': { 'product_price': { '$gt': 0 } } },
                    { '$group': { '_id': { 'name_product': '$name_product', 'name_product_group': '$name_product_group', '_ref_productid': '$_ref_productid' }, 'product_price': { '$avg': '$product_price' } } },
                    { '$project': { '_id': '$_id', 'product_price': { '$round': ['$product_price', 2] } } }
                ], (err) => { if (err) { callback(err); return; } }
            );

            const Product_Price_length = Product_Price.length;
            for (let index = 0; index < map.length; index++) {
                for (let index1 = 0; index1 < Product_Price_length; index1++) {
                    if (map[index].product === Product_Price[index1]._id.name_product && map[index].group === Product_Price[index1]._id.name_product_group) {
                        map[index] = {
                            chack_date_start: chack_date_start,
                            chack_date_end: chack_date_end,
                            product: map[index].product,
                            group: map[index].group,
                            path_image: Product_Price[index1]._id._ref_productid,
                            Balance_QTY: map[index].Balance_QTY,
                            Stock_in: map[index].Stock_in,
                            Stock_out: map[index].Stock_out,
                            Stock_OnHand: map[index].Stock_OnHand,
                            AVG_Cost: Product_Price[index1].product_price,
                            Stock_value: Product_Price[index1].product_price * map[index].Stock_OnHand,
                        }
                    }
                }
            }



            let map_all = {
                chack_date_start: chack_date_start,
                chack_date_end: chack_date_end,
                map: map,

            }
            callback(null);
            return map_all;
        }

    }
}
module.exports = view_Stock_Controller;
