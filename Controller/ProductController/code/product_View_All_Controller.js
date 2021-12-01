/**
 * Controller สำหรับ ดู (View) ระเบียนสินค้า (Product)
 */
const product_View_All_Controller = async (
    data = {
        _ref_storeid: String(''),
        _ref_branchid: String(''),
        _ref_agentid: String('')
    },
    callback = (err = new Error) => {}
) => {
    const { validateObjectId, checkAgentId } = require('../../miscController');

    if (typeof data != 'object') { callback(new Error(`product_View_All_Controller: data Must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`product_View_All_Controller: data._ref_storeid Must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`product_View_All_Controller: data._ref_branchid Must be String ObjectId`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`product_View_All_Controller: data._ref_agentid Must be String ObjectId`)); return; }
    else {
        const chkAgentId = await checkAgentId(
            {
                _agentid: data._ref_agentid,
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid
            },
            (err) => { if(err) { callback(err); return; } }
        );

        if (!chkAgentId) { callback(new Error(`product_View_All_Controller: chkAgentId return false, undifined`)); return; }
        else {
            const { productModel, checkObjectId } = require('../../mongodbController');

            const _ref_storeid = await checkObjectId(data._ref_storeid, (err) => { if(err) { callback(err); return; } });

            const findResult = await productModel.find(
                {
                    '_ref_storeid': _ref_storeid
                },
                {},
                (err) => { if(err) { callback(err); return; } }
            ).sort({'_id': 1});

            if (!findResult) { callback(new Error(`product_View_All_Controller: findResult have error, not found`)); return; }
            else {
                callback(null);
                return findResult;
            }
        }
    }
};

module.exports = product_View_All_Controller;