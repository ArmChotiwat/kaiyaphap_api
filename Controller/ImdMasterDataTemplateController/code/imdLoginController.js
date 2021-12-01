/**
 * login เข้า เว็บผั่ง IMD 
 * @param {String} username
 * @param {String} password
 */
const imd_login_controller = async (
    username,
    password,
    callback = (err = new Error) => { }
) => {
    const controllerName = 'imd_login_controller';
    const SECRET = require('../../../Config/cfg_crypto').JWT_SECRET;
    const kaiyaphap_email = require('../../../Config/cfg_adminEmail').ADMINEMAIL;
    const { checkObjectId, validate_String_AndNotEmpty } = require('../../miscController');

    if (typeof kaiyaphap_email != 'string' && !validate_String_AndNotEmpty(kaiyaphap_email)) {
        callback(new Error(`${controllerName}: kaiyaphap_email => ADMINEMAIL Not Set please check file <Config/cfg_adminEmail>`));
        return;
    }
    else if (username !== kaiyaphap_email) {
        callback(null);
        return;
    }
    else {
        const jwt = require("jwt-simple");
        const moment = require('moment');
        const logLoginModel = require('../../../Model/LoginLogModel');
        const { agentModel } = require('../../mongodbController');

        const logLogin = async (agentid, username, jwtPayload, callback = (err = new Error) => { }) => {
            const check_agentid = await checkObjectId(agentid, (err) => { if (err) { callback(err); return; } });
            if (!check_agentid) {
                callback(new Error(`${controllerName} : check_agentid false`));
                return;
            } else {
                const payloadTemplate = {
                    _agentid: check_agentid,
                    username: username,
                    jwtToken: jwtPayload,
                    datetime: moment().valueOf(),
                };
                const logLoginTemplate = new logLoginModel(payloadTemplate);
                const save_logLoginTemplate = await logLoginTemplate.save()
                    .then(
                        (result) => { return result; }
                    )
                    .catch(
                        (err) => { callback(err); return; }
                    );
                if (!save_logLoginTemplate) {
                    callback(new Error(`${controllerName} : can't save logLoginTemplate`));
                    return;
                } else {
                    callback(null);
                    return save_logLoginTemplate;
                }
            }
        };

        const findLoginUsers = await agentModel.aggregate(
            [
                {
                    '$match': {
                        'username': username.toString(),
                        'password': password.toString()
                    }
                }
            ]
        );
        if (findLoginUsers.length === 1) {
            const payload = {
                _agentid: findLoginUsers[0]._id.toString(),
                sub: findLoginUsers[0].username,
                iat: moment().valueOf()
            };

            const returnJson = {
                _userid: findLoginUsers[0]._id.toString(),
                username: findLoginUsers[0].username.toString(),
                payload: jwt.encode(payload, SECRET)
            };

            const logLoginProc = await logLogin(findLoginUsers[0]._id.toString(), findLoginUsers[0].username.toString(), returnJson.payload.toString(), (err) => { if (err) { callback(err); return; } });
            
            if (!logLoginProc) {
                callback(null);
                return returnJson;
            }
            else {
                callback(null);
                return returnJson;
            }
        }
        else {
            callback(null);
            return;
        }
    }
}
module.exports = imd_login_controller;