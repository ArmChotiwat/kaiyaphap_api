/**
 * Controller สำหรับ แก้ไข ระเบียนสินค้า
 */
const prodcut_Edit_Controller = async (
    data = {
        _ref_storeid: String(''),
        _ref_agentid: String(''),
        _ref_productid: String(''),
        product_name: String(''),
        product_serial: String(''),
        product_category: String(''),
        product_brand: String(''),
        product_main_version: String(''),
        product_sub_version: String(''),
        _ref_product_groupid: '',
    },
    callback = (err = new Error) => {}
) => {
    const { validateObjectId, checkAgentAdminId_StoreBranch, validate_StringOrNull_AndNotEmpty } = require('../../miscController');

    if (typeof data != 'object') { callback(new Error(`prodcut_Edit_Controller: data Must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`prodcut_Edit_Controller: data._ref_storeid Must be String ObjectId`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`prodcut_Edit_Controller: data._ref_agentid Must be String ObjectId`)); return; }
    else if (typeof data._ref_productid != 'string' || !validateObjectId(data._ref_productid)) { callback(new Error(`prodcut_Edit_Controller: data._ref_productid Must be String ObjectId`)); return; }
    else if (typeof data.product_name != 'string' || data.product_name == '') { callback(new Error(`prodcut_Edit_Controller: data._ref_branchid Must be String and Not Empty`)); return; }
    else {
        if (data.product_serial !== null) {
            if (typeof data.product_serial != 'string' || data.product_serial == '') { callback(new Error(`prodcut_Edit_Controller: data.product_serial Must be String or Null and Not Empty`)); return; }
        }
        if (data.product_category !== null) {
            if (typeof data.product_category != 'string' || data.product_category == '') { callback(new Error(`prodcut_Edit_Controller: data.product_category Must be String or Null and Not Empty`)); return; }
        }
        if (data.product_category !== null) {
            if (typeof data.product_category != 'string' || data.product_category == '') { callback(new Error(`prodcut_Edit_Controller: data.product_category Must be String or Null and Not Empty`)); return; }
        }
        if (data.product_brand !== null) {
            if (typeof data.product_brand != 'string' || data.product_brand == '') { callback(new Error(`prodcut_Edit_Controller: data.product_brand Must be String or Null and Not Empty`)); return; }
        }
        if (data.product_main_version !== null) {
            if (typeof data.product_main_version != 'string' || data.product_main_version == '') { callback(new Error(`prodcut_Edit_Controller: data.product_main_version Must be String or Null and Not Empty`)); return; }
        }
        if (data.product_sub_version !== null) {
            if (typeof data.product_sub_version != 'string' || data.product_sub_version == '') { callback(new Error(`prodcut_Edit_Controller: data.product_sub_version Must be String or Null and Not Empty`)); return; }
        }
        if (data._ref_product_groupid !== null) {
            if (!validate_StringOrNull_AndNotEmpty(data._ref_product_groupid) || !validateObjectId(data._ref_product_groupid)) { callback(new Error(`prodcut_Edit_Controller: data._ref_product_groupid Must be String ObjectId or Null`)); return; }
        }

        const chkAgentAdminId_StoreBranch = await checkAgentAdminId_StoreBranch(
            {
                _agentid: data._ref_agentid,
                _storeid: data._ref_storeid,
                _branchid: data._ref_storeid
            },
            (err) => { if(err) { callback(err); return; } }
        );

        const { productModel, checkObjectId } = require('../../mongodbController');

        const _ref_productid = await checkObjectId(data._ref_productid, (err) => { if(err) { callback(err); return; } });
        const _ref_storeid = await checkObjectId(data._ref_storeid, (err) => { if(err) { callback(err); return; } });
        
        for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {
            let findProduct = await productModel.findOne(
                {
                    '_id': _ref_productid,
                    '_ref_storeid': _ref_storeid
                },
                {},
                (err) => { if(err) { callback(err); return; } }
            );

            if (!findProduct) { callback(`prodcut_Edit_Controller: findProduct return not found`); return; }
            else {
                findProduct.product_name = data.product_name;
                findProduct.product_serial = data.product_serial;
                findProduct.product_category = data.product_category;
                findProduct.product_brand = data.product_brand;
                findProduct.product_main_version = data.product_main_version;
                findProduct.product_sub_version = data.product_sub_version;
                findProduct._ref_product_groupid = (data._ref_product_groupid === null) ? null:await checkObjectId(data._ref_product_groupid, (err) => { if(err) { callback(err); return; } });

                const transactionUpdate = await findProduct.save({ validateModifiedOnly: true }).then(result => (result)).catch(errors => { if (errors) { return; } });

                if (!transactionUpdate) { continue; }
                else { 
                    callback(null); 
                    return transactionUpdate; 
                }
            }
        }

        callback(new Error(`prodcut_Edit_Controller: update process have other error Or server is busy`));
        return;
    }
};

module.exports = prodcut_Edit_Controller;