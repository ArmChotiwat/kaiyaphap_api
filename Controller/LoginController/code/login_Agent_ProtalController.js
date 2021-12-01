/**
 * Login Agent Portal - Get Jwt: Controller สำหรับ Login Agent - Agent Login Portal
 */
const login_Agent_ProtalController = async (
    data = {
        login_username: '',
        login_password: ''
    },
    callback = (err = new Error) => { }
) => {
    const controllerName = 'login_Agent_ProtalController';

    const { validate_String_AndNotEmpty, currentDateTime, chackEmail, validateEmail } = require('../../miscController');

    const JwtEncode = require('../../JwtController/index').jwtEncodeController;
    const { JWT_SECRET } = require('../../../Config/cfg_crypto');

    const { ObjectId, agentModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validateEmail(data.login_username)) { callback(new Error(`${controllerName}: <data.login_username> must be String and Not Empty or Fomat error`)); return; }
    else if (!validate_String_AndNotEmpty(data.login_password)) { callback(new Error(`${controllerName}: <data.login_password> must be String and Not Empty`)); return; }
    else {
        const email_name = await chackEmail(data.login_username, (err) => { if (err) { callback(err); return; } });
        const findLoginUsers = await agentModel.aggregate(
            [
                {
                    '$match': {
                        'username': email_name,
                        'password': data.login_password
                    }
                }
            ],
            (err) => { if (err) { callback(err); return; } }
        );

        if (!findLoginUsers) { callback(new Error(`${controllerName}: findLoginUsers have error durning aggregate`)); }
        else if (findLoginUsers.length === 0) { callback(null); return; }
        else if (findLoginUsers.length > 1) { callback(new Error(`${controllerName}: findLoginUsers return Length morethan 1 aggregate data`)); }
        else if (findLoginUsers.length !== 1) { callback(new Error(`${controllerName}: findLoginUsers return Length not equal 1 durning aggregate`)); }
        else {
            const currentTimeStamp = currentDateTime();

            const JwtData = {
                sub: String(findLoginUsers[0].username),
                iat: currentTimeStamp.currentDateTime_Object.valueOf(),
                exp: currentTimeStamp.currentDateTime_Object.add(3, 'minutes').valueOf(),
                _ref_agent_userid: String(findLoginUsers[0]._id),
            };

            const EncodeJwtData = JwtEncode(JwtData, JWT_SECRET);

            const returnJson = {
                _userid: ObjectId(findLoginUsers[0]._id),
                username: String(findLoginUsers[0].username),
                payload: EncodeJwtData,
            };

            return returnJson;
        }
    }
};

module.exports = login_Agent_ProtalController;