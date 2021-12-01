/**
 * Controller สำหรับ ดู สินค้าคงคลัง (ทั้งหมด) ตามสาขา
 */
const productInventory_StoreBranch_View_All_Controller = async (
    data = {
        _ref_storeid: String(''),
        _ref_branchid: String(''),
        _ref_agentid: String('')
    },
    callback = (err = new Error) => {}
) => {
    const miscController = require('../../miscController');

    if (typeof data != 'object') { callback(new Error(`productInventory_StoreBranch_View_All_Controller: data Must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !miscController.validateObjectId(data._ref_storeid)) { callback(new Error(`productInventory_StoreBranch_View_All_Controller: data._ref_storeid Must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !miscController.validateObjectId(data._ref_branchid)) { callback(new Error(`productInventory_StoreBranch_View_All_Controller: data._ref_branchid Must be String ObjectId`)); return; }
    else if (typeof data._ref_agentid != 'string' || !miscController.validateObjectId(data._ref_agentid)) { callback(new Error(`productInventory_StoreBranch_View_All_Controller: data._ref_agentid Must be String ObjectId`)); return; }
    else {
        const chkStoreBranch = await miscController.checkStoreBranch(
            {
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid
            },
            (err) => { callback(err); return; }
        );

        if (!chkStoreBranch) { callback(new Error(`productInventory_StoreBranch_View_All_Controller: chkStoreBranch return not found`)); }
        else {
            const chkAgentId = await miscController.checkAgentId(
                {
                    _storeid: data._ref_storeid,
                    _branchid: data._ref_branchid,
                    _agentid: data._ref_agentid
                },
                (err) => { callback(err); return; }
            );

            if (!chkAgentId) { callback(new Error(`productInventory_StoreBranch_View_All_Controller: chkAgentId return not found`)); }
            else {
                const { inventoryModel } = require('../../mongodbController');

                const findInventoryStoreBranch = await inventoryModel.aggregate(
                    [
                        {
                          '$match': {
                            '_ref_storeid': chkAgentId._storeid, 
                            '_ref_branchid': chkAgentId._branchid, 
                            'istruncated': false
                          }
                        }, {
                          '$lookup': {
                            'from': 'm_product', 
                            'localField': '_ref_productid', 
                            'foreignField': '_id', 
                            'as': 'product_data'
                          }
                        }, {
                          '$match': {
                            'product_data': {
                              '$size': 1
                            }, 
                            'product_data._ref_storeid': chkAgentId._storeid,
                            'product_data.istruncated': false
                          }
                        }, {
                          '$unwind': {
                            'path': '$product_data'
                          }
                        }, {
                          '$sort': {
                            '_id': 1
                          }
                        }
                    ],
                    (err) => { callback(err); return; }
                );

                if (!findInventoryStoreBranch) { callback(new Error(`productInventory_StoreBranch_View_All_Controller: findInventoryStoreBranch have error`)); }
                else {
                    callback(null);
                    return findInventoryStoreBranch;
                }
            }
        }
    }
    
};

module.exports = productInventory_StoreBranch_View_All_Controller;