/**
 * Login Agent Portal - Check Jwt: Controller สำหรับตรวจสอบ Jwt ของ User Login Portal
 */
const login_Agent_PortalCheckController = async (
    jwtToken = '',
    callback = (err = new Error) => {}
) => {
    const controllerName = 'login_Agent_PortalCheckController';

    const { validate_String_AndNotEmpty, validate_StringObjectId_NotNull } = require('../../miscController');
    const { jwtDecodeController } = require('../../JwtController/index');

    const { ObjectId, agentModel } = require('../../mongodbController');
    
    try {
        if (!validate_String_AndNotEmpty(jwtToken)) { throw new Error(`${controllerName}: <jwtToken> must be String and Not Empty`); }
        else {
            const Result_jwtDecode = jwtDecodeController(jwtToken);

            if (!Result_jwtDecode) { throw new Error(`${controllerName}: Result_jwtDecode have error during doecode jwt`); }
            else {
                if (!validate_String_AndNotEmpty(Result_jwtDecode._ref_agent_userid)) { throw new Error(`${controllerName}: Result_jwtDecode._ref_agent_userid does not exist or does not String ObjectId, after decode jwt`); }
                else if (!validate_StringObjectId_NotNull(Result_jwtDecode._ref_agent_userid)) { throw new Error(`${controllerName}: Result_jwtDecode._ref_agent_userid does not String ObjectId, after decode jwt`); }
                else {
                    const findAgent = await agentModel.find(
                        {
                            '_id': ObjectId(Result_jwtDecode._ref_agent_userid),
                            'username': Result_jwtDecode.sub,
                        },
                        {},
                        (err) => { if (err) { throw err; } }
                    );

                    if (!findAgent) { throw new Error(`${controllerName}: findAgent have error during find document`); }
                    else if (findAgent.length !== 1) { throw new Error(`${controllerName}: findAgent return Length (${findAgent.length}) more than 1`); }
                    else {
                        callback(null);
                        return {
                            sub: String(Result_jwtDecode.usb),
                            iat: Number(Result_jwtDecode.iat),
                            exp: Number(Result_jwtDecode.exp),
                            _ref_agent_userid: ObjectId(Result_jwtDecode._ref_agent_userid)
                        };
                    }
                }
            }
        }

    } catch (error) {
        callback(error);
        return;
    }
};

module.exports = login_Agent_PortalCheckController;