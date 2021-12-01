/** Controller สำหรับ เปิด-ปิด Case Type ของลูกค้า ตามร้าน/สาขา */
const switch_Agent_AdminController = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agentid: '',
    },
    callback = (err = new Error) => { }
) => {
    const controllerName = 'switch_Agent_AdminController'

    const { validate_StringObjectId_NotNull, checkAgentId } = require('../../miscController');
    const { agentModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
    else {
        const chkAgent = await checkAgentId(
            {
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid,
                _agentid: data._ref_agentid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        const find_agentModel = await agentModel.aggregate(
            [
                {
                  '$match': {
                    '_id': chkAgent._agentid
                  }
                }, {
                  '$unwind': {
                    'path': '$store', 
                    'includeArrayIndex': 'store_index', 
                    'preserveNullAndEmptyArrays': true
                  }
                }, {
                  '$unwind': {
                    'path': '$store.branch', 
                    'includeArrayIndex': 'store_branch_index', 
                    'preserveNullAndEmptyArrays': true
                  }
                }, {
                  '$match': {
                    '_id': chkAgent._agentid, 
                    'store._storeid': chkAgent._storeid, 
                    'store.branch._branchid': chkAgent._branchid
                  }
                }
              ],
              (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgent) { callback(new Error(`${controllerName}: Can't find chkAgent return not found`)); return; }
        if (!find_agentModel || find_agentModel.length === 0) { callback(new Error(`${controllerName}: Can't find find_agentModel return not found`)); return; }
        else {         
               
            const roleAdminViewOnly = find_agentModel[0].store.roleAdminViewOnly === true ? false : true
            const switch_agentAdmin = await agentModel.updateOne(
                {
                    "_id": chkAgent._agentid,
                    "store._storeid": chkAgent._storeid,
                    "store.branch._branchid": chkAgent._branchid
                },
                {
                    "store.$.roleAdminViewOnly": roleAdminViewOnly,
                },
                (errors) => {
                    if (errors) { return; }
                }
            );

            if (!switch_agentAdmin) {
                callback(new Error(`${controllerName} : ${controllerName} => seve file fall switch_agentAdmin`));
                return;
            } else {
                callback(null);
                return switch_agentAdmin;
            }


        }
    }
};


module.exports = switch_Agent_AdminController;