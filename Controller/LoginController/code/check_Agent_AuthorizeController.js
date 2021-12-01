const check_Agent_AuthorizeController = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agent_userid: '',
        _ref_agent_userstoreid: '',
        jwtToken_AgentStoreBranch: '',
    },
    callback = (err = new Error) => { }
) => {
    const controllerName = '';

    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty } = require('../../miscController');
    const { jwtDecode_Login_StoreBranchController } = require('../../JwtController/index');
    const { agentModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_agent_userid)) { callback(new Error(`${controllerName}: <data._ref_agent_userid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_agent_userstoreid)) { callback(new Error(`${controllerName}: <data._ref_agent_userstoreid> must be String ObjectId`)); return; }
    else if (!validate_String_AndNotEmpty(data.jwtToken_AgentStoreBranch)) { callback(new Error(`${controllerName}: <data.jwtToken_AgentStoreBranch> must be String Jwt and Not Empty`)); return; }
    else {
        const decodeJwt = jwtDecode_Login_StoreBranchController(data.jwtToken_AgentStoreBranch);

        if (!decodeJwt) { callback(new Error(`${controllerName}: decode jwt failed`)); return; }
        else if (String(decodeJwt._ref_storeid) !== data._ref_storeid) { callback(new Error(`${controllerName}: _ref_storeid not match`)); return; }
        else if (String(decodeJwt._ref_branchid) !== data._ref_branchid) { callback(new Error(`${controllerName}: _ref_branchid not match`)); return; }
        else if (String(decodeJwt._ref_agent_userid) !== data._ref_agent_userid) { callback(new Error(`${controllerName}: _ref_agent_userid not match`)); return; }
        else if (String(decodeJwt._ref_agent_userstoreid) !== data._ref_agent_userstoreid) { callback(new Error(`${controllerName}: _ref_agent_userstoreid not match`)); return; }
        else {
            const checkAuthorize = await agentModel.aggregate(
                [
                    {
                        '$match': {
                            '_id': decodeJwt._ref_agent_userid
                        }
                    }, {
                        '$project': {
                            '_id': 1,
                            'store._id': 1,
                            'store._storeid': 1,
                            'store.branch': 1,
                            'store.user_status': 1
                        }
                    }, {
                        '$unwind': {
                            'path': '$store'
                        }
                    }, {
                        '$match': {
                            'store._id': decodeJwt._ref_agent_userstoreid,
                            'store._storeid': decodeJwt._ref_storeid,
                            'store.user_status': true,
                        }
                    }, {
                        '$unwind': {
                            'path': '$store.branch'
                        }
                    }, {
                        '$match': {
                            'store.branch._branchid': decodeJwt._ref_branchid
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );

            if (!checkAuthorize) { callback(new Error(`${controllerName}: checkAuthorize have error during aggregate`)); return; }
            else if (checkAuthorize.length > 1) { callback(new Error(`${controllerName}: checkAuthorize return Length (${checkAuthorize.length}) more than 1`)); return; }
            else if (checkAuthorize.length === 0) {
                callback(null);
                return;
            }
            else {
                callback(null);
                return decodeJwt;
            }
        }
    }
};

module.exports = check_Agent_AuthorizeController;