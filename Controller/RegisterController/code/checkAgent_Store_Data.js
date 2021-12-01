const checkAgent_Store_Data = async (
    data = {
        _storeid: '',
        branch: [
            {
                _branchid: '',
            }
        ],
        email: '',
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'checkAgent_Store_Data';

    const { validate_StringObjectId_NotNull, validateStrict_Number_OrNull, validate_String_AndNotEmpty, validateEmail, checkStore, checkStoreBranch, chackEmail, currentDateTime }  = require('../../miscController');
    const { ObjectId, agentModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._storeid)) { callback(new Error(`${controllerName}: <data._storeid> must be String ObjectId`)); return; }
    else if (typeof data.branch != 'object') { callback(new Error(`${controllerName}: <data.branch> must be Array Object`)); return; }
    else if (data.branch.length < 1) { callback(new Error(`${controllerName}: <data.branch> must be Length of Array Object (${data.branch.length}) more than 0`)); return; }
    else if (!validate_String_AndNotEmpty(data.email)) { callback(new Error(`${controllerName}: <data.email> must be String and Not Empty`)); return; }
    else if (!validateEmail(data.email)) { callback(new Error(`${controllerName}: <data.email> validateEmail return false`)); return; }
    else {
        const chkStore = await checkStore(
            {
                _storeid: data._storeid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkStore) { callback(new Error(`${controllerName}: chkStore return not found`)); return; }
        else {
            for (let index = 0; index < data.branch.length; index++) {
                const element = data.branch[index];
                
                if (!validate_StringObjectId_NotNull(element._branchid)) { callback(new Error(`${controllerName}: <data.branch[${index}]._branchid> must be String ObjectId`)); return; }
                else {
                    const chkStoreBranch = await checkStoreBranch(
                        {
                            _storeid: data._storeid,
                            _branchid: element._branchid,
                        },
                        (err) => { if (err) { callback(err); return; } }
                    );

                    if (!chkStoreBranch) { callback(new Error(`${controllerName}: <data.branch[${index}]._branchid> chkStoreBranch return not found`)); return; }
                    else {
                        const checkAgentInStoreBranch = await agentModel.findOne(
                            {
                                'username': data.email,
                                'store._storeid': ObjectId(data._storeid),
                                'store.branch._branchid': ObjectId(element._branchid),
                            },
                            {},
                            (err) => { if (err) { callback(err); return; }}
                        );

                        if (checkAgentInStoreBranch) { callback(new Error(`${controllerName}: <data.branch[${index}]._branchid> checkAgentInStoreBranch return found`)); return; }
                    }
                }
            }

            const currnetTimeStamp = currentDateTime();
            const refactor_Email = await chackEmail(data.email, (err) => { if (err) callback(err); return; });
            const recator_Branch = data.branch.map(where => ({_branchid: ObjectId(where._branchid)}));


            const MAP_DATA = {
                _storeid: ObjectId(data._storeid),
                branch: recator_Branch,
                role: 2,
                email: refactor_Email,
                userRegisterDate: currnetTimeStamp.currentDateTime_Object.format('YYYY-MM-DD'),
                avatarUrl: null,
                user_status: true,
            };

            callback(null);
            return MAP_DATA;
        }
    }
};


module.exports = checkAgent_Store_Data;