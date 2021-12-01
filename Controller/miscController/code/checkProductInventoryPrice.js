/**
 * Misc Controller ใช้สำหรับ ตรวจหาสินค้า ตามราคา
 ** ถ้าใช้ data._ref_productid ส่วน data._ref_product_inventoryid จะต้อง null
 ** ถ้าใช้ data._ref_product_inventoryid ส่วน data._ref_productid จะต้อง null
 */
const checkProductInventoryPrice = async (
    data = {
        _ref_productid: String(''),
        _ref_product_inventoryid: String(''),
        _ref_storeid: String(''),
        _ref_branchid: String(''),
        product_price: -1
    },
    callback = (err = new Error) => {}
) => {
    const { validateObjectId, checkObjectId } = require('..');

    if (typeof data != 'object') { callback(new Error(`checkProductInventory: data must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`checkProductInventory: data._ref_storeid must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`checkProductInventory: data._ref_branchid must be String ObjectId`)); return; }
    else if (typeof data.product_price != 'number' || typeof data.product_price < 0) { callback(new Error(`checkProductInventory: data._ref_branchid must be Number and morethan or equal 0`)); return; }
    else {
        const _ref_storeid = await checkObjectId(data._ref_storeid,(err) => { if(err) { callback(err); return; } });
        const _ref_branchid = await checkObjectId(data._ref_branchid,(err) => { if(err) { callback(err); return; } });

        if (typeof data._ref_productid == 'string' && validateObjectId(data._ref_productid)) {
            const { productModel, inventoryModel } = require('../../mongodbController');

            const _ref_productid = await checkObjectId(data._ref_productid,(err) => { if(err) { callback(err); return; } });

            const findProduct = await productModel.findOne(
                {
                    '_id': _ref_productid,
                    '_ref_storeid': _ref_storeid
                },
                (err) => { callback(err); return; }
            );

            if (!findProduct) { callback(new Error(`checkProductInventory: Product not found`)); return; }
            else {
                const findProductInventory = await inventoryModel.findOne(
                    {
                        '_ref_productid': findProduct._id,
                        '_ref_storeid': _ref_storeid,
                        '_ref_branchid': _ref_branchid,
                        'product_price': data.product_price,
                    },
                    (err) => { callback(err); return; }
                );

                if (!findProductInventory) { callback(new Error(`checkProductInventory: ProductInventory not found`)); return; }
                else {
                    callback(null);
                    return {
                        _ref_productid: String(data._ref_productid),
                        _ref_product_inventoryid: String(findProductInventory._id),
                        _ref_storeid: String(data._ref_storeid),
                        _ref_branchid: String(data._ref_branchid),
                        product_price: Number(data.product_price)
                    };
                }
            }
        }
        else if (typeof data._ref_product_inventoryid == 'string' && validateObjectId(data._ref_product_inventoryid)) {
            const { productModel, inventoryModel } = require('../../mongodbController');

            const _ref_product_inventoryid = await checkObjectId(data._ref_product_inventoryid,(err) => { if(err) { callback(err); return; } });

            const findProductInventory = await inventoryModel.findOne(
                {
                    '_id': _ref_product_inventoryid,
                    '_ref_storeid': _ref_storeid,
                    '_ref_branchid': _ref_branchid,
                    'product_price': data.product_price,
                },
                (err) => { callback(err); return; }
            );

            if (!findProductInventory) { callback(new Error(`checkProductInventory: ProductInventory not found`)); return; }
            else {
                const findProduct = await productModel.findOne(
                    {
                        '_id': findProductInventory._ref_productid,
                        '_ref_storeid': _ref_storeid
                    },
                    (err) => { callback(err); return; }
                );

                if (!findProduct) { callback(new Error(`checkProductInventory: Product not found`)); return; }
                else {
                    callback(null);
                    return {
                        _ref_productid: String(findProduct._id),
                        _ref_product_inventoryid: String(data._ref_product_inventoryid),
                        _ref_storeid: String(data._ref_storeid),
                        _ref_branchid: String(data._ref_branchid),
                        product_price: Number(data.product_price)
                    };
                }
            }
        }
        else { callback(new Error(`checkProductInventory: have other error`)); return; }
    }
};

module.exports = checkProductInventoryPrice;