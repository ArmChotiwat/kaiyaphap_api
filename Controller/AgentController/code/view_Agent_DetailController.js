/**
 * Controller สำหรับ ดูข้อมูล Agent (ตามร้านนั้น ๆ)
 */
const view_Agent_DetailController = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agent_userid: '',
        find_ref_agent_userid: '',
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'view_Agent_DetailController';

    const { validate_StringObjectId_NotNull } = require('../../miscController');
    const { ObjectId, agentModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_agent_userid)) { callback(new Error(`${controllerName}: <data._ref_agent_userid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data.find_ref_agent_userid)) { callback(new Error(`${controllerName}: <data.find_ref_agent_userid> must be String ObjectId`)); return; }
    else {
        const inspectAgent = await agentModel.aggregate(
            [
                {
                    '$match': {
                        '_id': ObjectId(data.find_ref_agent_userid),
                        'store._storeid': ObjectId(data._ref_storeid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store'
                    }
                }, {
                    '$match': {
                        '_id': ObjectId(data.find_ref_agent_userid),
                        'store._storeid': ObjectId(data._ref_storeid)
                    }
                }
            ],
            (err) => { if (err) { callback(err); return; } }
        );

        if (!inspectAgent) {}
        else if (inspectAgent.length === 0) {
            callback(null);
            return;
        }
        else if (inspectAgent.length !== 1 ) { callback(new Error(`${controllerName}: inspectAgent return Length (${inspectAgent.length}) more than 1`)); return; }
        else {
            callback(null);
            return inspectAgent[0];
        }

    }
};


module.exports = view_Agent_DetailController;