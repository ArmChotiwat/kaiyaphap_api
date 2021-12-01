/**
 * Controller สำหรับ เปิด-ปิด สินค้าคงคลัง ตามสาขา
 */
const productInventory_Switch_Controller = async (
    data = {
        _ref_storeid: String(''),
        _ref_branchid: String(''),
        _ref_agentid: String(''),
        _ref_productid: String('')
    },
    callback = (err = new Error) => {}
) => {
    const { validateObjectId, checkStoreBranch, checkAgentAdminId_StoreBranch, checkProductInventory } = require('../../miscController');

    if (typeof data != 'object') { calllback(new Error(`product_Switch_Controller: data Must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`product_Switch_Controller: data._ref_storeid Must be String ObjectId`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`product_Switch_Controller: data._ref_agentid Must be String ObjectId`)); return; }
    else if (typeof data._ref_productid != 'string' || !validateObjectId(data._ref_productid)) { callback(new Error(`product_Switch_Controller: data._ref_productid Must be String ObjectId`)); return; }
    else {
        const chkStoreBranch = await checkStoreBranch(
            {
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid
            },
            (err) => { if(err) { callback(err); return; } }
        );
        
        if (!chkStoreBranch) { callback(new Error(`product_Switch_Controller: chkStoreBranch return not found`)); return; }
        else {
            const chkAgentAdminId_StoreBranch = await checkAgentAdminId_StoreBranch(
                {
                    _agentid: data._ref_agentid,
                    _storeid: data._ref_storeid,
                    _branchid: data._ref_branchid
                },
                (err) => { if(err) { callback(err); return; } }
            );
    
            if (!chkAgentAdminId_StoreBranch) { callback(new Error(`product_Switch_Controller: chkAgentAdminId_StoreBranch return not found`)); return; }
            else {
                const chkProductInventory = await checkProductInventory(
                    {
                        _ref_productid: data._ref_productid,
                        _ref_product_inventoryid: null,
                        _ref_storeid: data._ref_storeid,
                        _ref_branchid: data._ref_branchid,                    
                    },
                    (err) => { if(err) { callback(err); return; } }
                );

                if (!chkProductInventory) { callback(new Error(`product_Switch_Controller: chkProductInventory return not found`)); return; }
                else {
                    const { inventoryModel, checkObjectId } = require('../../mongodbController');

                    const _ref_product_inventoryid = await checkObjectId(chkProductInventory._ref_product_inventoryid, (err) => { if(err) { callback(err); return; } } );

                    const moment = require('moment');
                    const modify_date = moment();
                    const modify_date_string = modify_date.format('YYYY-MM-DD');
                    const modify_time_string = modify_date.format('HH:mm:ss');

                    const Retry_Max = 10;
                    for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                        let findInventory = await inventoryModel.findOne(
                            {
                                '_id': _ref_product_inventoryid
                            },
                            {},
                            (err) => { if(err) { callback(err); return; } }
                        );

                        if (!findInventory) { callback(new Error(`product_Switch_Controller: findInventory return not found`)); return; }
                        else {
                            findInventory.isused = !findInventory.isused;
                            findInventory.modify_date = modify_date;
                            findInventory.modify_date_string = modify_date_string;
                            findInventory.modify_time_string = modify_time_string;
                            findInventory._ref_agent_userid_modify_recent = chkAgentAdminId_StoreBranch._agentid;
                            findInventory._ref_agent_userstoreid_modify_recent = chkAgentAdminId_StoreBranch._agentstoreid;

                            const updateTransaction = await findInventory.save().then(result => (result)).catch(err => { if(err) { callback(err); return; } });

                            if (!updateTransaction) { continue; }
                            else {
                                callback(null);
                                return updateTransaction;
                            }
                        }
                    }

                    callback(new Error(`product_Switch_Controller: updateTransaction have Error or server is Busy`));
                    return;
                }
            }
        }
    }
};

module.exports = productInventory_Switch_Controller;