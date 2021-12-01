const checkImd_Agent_Store_Data = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        email: '',
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'checkAgent_Store_Data';

    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty, validateEmail, checkStore, checkStoreBranch, chackEmail, currentDateTime }  = require('../../miscController');
    const { ObjectId, agentModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!validate_String_AndNotEmpty(data.email)) { callback(new Error(`${controllerName}: <data.email> must be String and Not Empty`)); return; }
    else if (!validateEmail(data.email)) { callback(new Error(`${controllerName}: <data.email> validateEmail return false`)); return; }
    else {
        const chkStore = await checkStore(
            {
                _storeid: data._ref_storeid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkStore) { callback(new Error(`${controllerName}: chkStore return not found`)); return; }
        else {

            const chkStoreBranch = await checkStoreBranch(
                {
                    _storeid: data._ref_storeid,
                    _branchid: data._ref_branchid,
                },
                (err) => { if (err) { callback(err); return; } }
            );

            if (!chkStoreBranch) { callback(new Error(`${controllerName}: <data._ref_branchid> chkStoreBranch return not found`)); return; }
            else {
                const checkAgentInStoreBranch = await agentModel.findOne(
                    {
                        'username': data.email,
                        // 'store._storeid': ObjectId(data._ref_storeid),
                        // 'store.branch._branchid': ObjectId(data._ref_branchid),
                    },
                    {},
                    (err) => { if (err) { callback(err); return; }}
                );

                if (checkAgentInStoreBranch) { callback(new Error(`${controllerName}: checkAgentInStoreBranch return found`)); return; }
                else {
                    const refactor_Email = await chackEmail(data.email, (err) => { if (err) callback(err); return; });

                    if (!refactor_Email) { callback(new Error(`${controllerName}: refactor_Email have error`)); return; }
                    else {
                        const MAP_DATA = {
                            _storeid: ObjectId(data._ref_storeid),
                            branch: [{_branchid: ObjectId(data._ref_branchid)}],
                            role: 1,
                            email: refactor_Email,
                            userRegisterDate: currentDateTime().currentDateTime_Object.format('YYYY-MM-DD'),
                            avatarUrl: null,
                            user_status: true,
                        };
    
                        callback(null);
                        return MAP_DATA;
                    }
                }
            }
        }
    }
};


module.exports = checkImd_Agent_Store_Data;