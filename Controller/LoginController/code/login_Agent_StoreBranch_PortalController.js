const login_Agent_StoreBranch_PortalController = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        login_jwtToken: '',
        login_client_ip: ''
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'login_Agent_StoreBranch_PortalController';

    const { logCustomerLoginModel } = require('../../mongodbController');
    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty, checkStoreBranch, checkAgentId, currentDateTime } = require('../../miscController');
    const { jwtDecodeController, jwtEncodeController } = require('../../JwtController/index');
    const { JWT_SECRET, JWT_SECRET_PORTAL } = require('../../../Config/cfg_crypto');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!validate_String_AndNotEmpty(data.login_jwtToken)) { callback(new Error(`${controllerName}: <data.login_jwtToken> must be String and Not Empty`)); return; }
    else {
        const DecodeJwt = jwtDecodeController(data.login_jwtToken, JWT_SECRET);

        if (!DecodeJwt) { callback(new Error(`${controllerName}: cannot decode login_jwtToken`)); return; }
        else {
            if (!DecodeJwt._ref_agent_userid) { callback(new Error(`${controllerName}: cannot found DecodeJwt._ref_agent_userid during after decode jwt`)); return; }
            else {
                const chkStoreBranch = await checkStoreBranch(
                    {
                        _storeid: data._ref_storeid,
                        _branchid: data._ref_branchid
                    },
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!chkStoreBranch) {
                    callback(new Error(`${controllerName}: chkStoreBranch return not found`));
                    return;
                }
                else {
                    const checkAgent = await checkAgentId(
                        {
                            _storeid: data._ref_storeid,
                            _branchid: data._ref_branchid,
                            _agentid: DecodeJwt._ref_agent_userid
                        },
                        (err) => { if (err) { callback(err); return; } }
                    );

                    if (!checkAgent) {
                        callback(null);
                        return;
                    }
                    else if (String(checkAgent._agentid) !== DecodeJwt._ref_agent_userid) { callback(null); return; }
                    else {
                        const currentTimeStamp = currentDateTime();

                        const MAP_JWT = {
                            sub: DecodeJwt.sub,
                            iat: currentTimeStamp.currentDateTime_Object.valueOf(),
                            exp: currentTimeStamp.currentDateTime_Object.add(24, 'hours').valueOf(),
                            _ref_storeid: checkAgent._storeid,
                            _ref_branchid: checkAgent._branchid,
                            _ref_agent_userid: checkAgent._agentid,
                            _ref_agent_userstoreid: checkAgent._agentstoreid,
                            role: checkAgent.role,
                        };

                        const EncodeJwtData = jwtEncodeController(MAP_JWT, JWT_SECRET_PORTAL);

                        const returnJson = {
                            _userid: checkAgent._agentid,
                            _userstoreid: checkAgent._agentstoreid,
                            _storeid: checkAgent._storeid,
                            _branchid: checkAgent._branchid,
                            username: DecodeJwt.sub,
                            payload: EncodeJwtData,
                        };

                        const new_logCustomerLoginModel = new logCustomerLoginModel({
                            _ref_agent_userid: checkAgent._agentid,
                            _ref_agent_storeid: checkAgent._agentstoreid,
                            _ref_storeid: checkAgent._storeid,
                            _ref_branchid: checkAgent._branchid,
                            jwtToken: EncodeJwtData,
                            username: DecodeJwt.sub,
                            datetime: currentTimeStamp.currentDateTime_Object,
                            date_string: currentTimeStamp.currentDate_String,
                            time_string: currentTimeStamp.currentTime_String,
                            client_ip: typeof data.login_client_ip == 'string' ? data.login_client_ip:null
                        });
                        const trn_logCustomerLoginModel_Save = await new_logCustomerLoginModel.save().then(result => (result)).catch(err => { if (err) { callback(err); return; } });

                        if (!trn_logCustomerLoginModel_Save) { callback(new Error(`${controllerName}: trn_logCustomerLoginModel_Save have error`)); return; }
                        else {
                            callback(null);
                            return returnJson;
                        }
                    }
                }
            }
        }
    }
};

module.exports = login_Agent_StoreBranch_PortalController;