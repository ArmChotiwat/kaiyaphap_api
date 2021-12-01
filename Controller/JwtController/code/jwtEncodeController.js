/**
 * Jwt Encode สำหรับใช้งานทั่วไป
 */
const jwtEncodeController = (
    jwtData = {
        sub: '',
        iat: 0,
        exp: 0,
    },
    SECRET = ''
) => {
    const controllerName = 'jwtEncodeController';

    const { validate_String_AndNotEmpty, validateStrict_Number_OrNull, currentDateTime } = require('../../miscController');

    const JwtEncode = require('jwt-simple').encode;
    const JWT_SECRET = SECRET || require('../../../Config/cfg_crypto').JWT_SECRET;

    const currentTimeStamp = currentDateTime();

    try {
        if (typeof jwtData != 'object') { throw new Error(`${controllerName}: <jwtData> must be Object`); }
        else if (!validate_String_AndNotEmpty(jwtData.sub)) { throw new Error(`${controllerName}: <jwtData.sub> must be String and Not Empty`); }
        else if (!validateStrict_Number_OrNull(jwtData.iat)) { throw new Error(`${controllerName}: <jwtData.iat> must be Number and Not Empty`); }
        else if (!validateStrict_Number_OrNull(jwtData.exp)) { throw new Error(`${controllerName}: <jwtData.exp> must be Number and Not Empty`); }
        else if (jwtData.exp <= jwtData.iat) { throw new Error(`${controllerName}: <jwtData.exp> must more than or equal <jwtData.iat>`); }
        else if (jwtData.exp <= currentTimeStamp.currentDateTime_Object.valueOf()) { throw new Error(`${controllerName}: <jwtData.exp> is Expried`); }
        else {
            const EncodeJwtData = JwtEncode(jwtData, JWT_SECRET, 'HS512');
            
            return `Bearer ${EncodeJwtData}`;
        }
    } catch (error) {
        console.error(error);
        return;
    }
};

module.exports = jwtEncodeController;