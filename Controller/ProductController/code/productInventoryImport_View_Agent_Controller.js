/**
 * Controller สำหรับ ดู รายชื่อ Admin/นักกายภาพ ที่ใช้งานอยู่ ตามสาขา
 * 
 * Route GET => /product/inventoryimport/viewagent/:storeid/:branchid
 */
const productInventoryImport_View_Agent_Controller = async (
    data = {
        _ref_storeid: String(''),
        _ref_branchid: String(''),
        _ref_agentid: String(''),
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `productInventoryImport_View_Agent_Controller`;
    const { validateObjectId, checkStoreBranch, checkAgentId, listAgent_StoreBranch } = require('../../miscController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!(await checkStoreBranch({_storeid: data._ref_storeid, _branchid: data._ref_branchid}, (err) => { if (err) { return; } }))) { callback(new Error(`${controllerName}: <data._ref_storeid> <data._ref_branchid> checkStoreBranch reutrn not found`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
    else if (!(await checkAgentId({_agentid: data._ref_agentid, _storeid: data._ref_storeid, _branchid: data._ref_branchid}, (err) => { if (err) { return; }}))) { callback(new Error(`${controllerName}: <data._ref_agentid> checkAgentId return not found`)); return; }
    else {
        const listAgentResult = await listAgent_StoreBranch(
            {
                _ref_storeid: data._ref_storeid,
                _ref_branchid: data._ref_branchid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!listAgentResult) { callback(new Error(`${controllerName}: listAgentResult have error`)); return; }
        else {
            callback(null);
            return listAgentResult;
        }
    }
};

module.exports = productInventoryImport_View_Agent_Controller;