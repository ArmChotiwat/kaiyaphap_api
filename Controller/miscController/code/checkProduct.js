/**
 * Misc Controller ใช้สำหรับ ตรวจหาระเบียนสินค้า
 */
const checkProduct = async (
    data = {
        _ref_productid: String(''),
        _ref_storeid: String(''),
    },
    callback = (err = new Error) => { }
) => {
    const { validateObjectId } = require('..');

    if (typeof data != 'object') { callback(new Error(`checkProduct: data must be Object`)); return; }
    else if (typeof data._ref_productid != 'string' || !validateObjectId(data._ref_productid)) { callback(new Error(`checkProduct: data._ref_productid must be String ObjectId`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`checkProduct: data._ref_storeid must be String ObjectId`)); return; }
    else {
        const { checkObjectId } = require('..');
        const { productModel } = require('../../mongodbController');

        const _ref_storeid = await checkObjectId(data._ref_storeid, (err) => { if (err) { callback(err); return; } });
        const _ref_productid = await checkObjectId(data._ref_productid, (err) => { if (err) { callback(err); return; } });

        const findProduct = await productModel.findOne(
            {
                '_id': _ref_productid,
                '_ref_storeid': _ref_storeid
            },
            (err) => { callback(err); return; }
        );

        if (!findProduct) { callback(new Error(`checkProduct: Product not found`)); return; }
        else {
            callback(null);
            return {
                _ref_productid: String(data._ref_productid),
                _ref_storeid: String(data._ref_storeid),
            };
        }
    }
};

module.exports = checkProduct;