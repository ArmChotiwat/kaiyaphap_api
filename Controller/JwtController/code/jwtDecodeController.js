const jwtEncodeController = (jwtToken = '', SECRET = '') => {
    const controllerName = 'jwtEncodeController';

    const moment = require('moment');
    const { validate_String_AndNotEmpty, validateStrict_Number_OrNull, currentDateTime } = require('../../miscController');

    const JwtDecode = require('jwt-simple').decode;
    const JWT_SECRET = SECRET || require('../../../Config/cfg_crypto').JWT_SECRET;

    const RegEx_Bearer = /Bearer /g;

    try {
        if (!validate_String_AndNotEmpty(jwtToken)) { throw new Error(`${controllerName}: <jwtToken> must be String and Not Empty`); }
        else if (jwtToken.match(RegEx_Bearer).length !== 1) { throw new Error(`${controllerName}: <jwtToken> Bearer verify error, Bearer must be One Word, Example:"Bearer <JwtToken>", Example:"Bearer Ax824.Has54.Ks4Ju"`); }
        else {
            const currentTimeStamp = currentDateTime();

            const cutJwtData = jwtToken.replace(RegEx_Bearer, '');

            const JwtData = JwtDecode(cutJwtData, JWT_SECRET, true, 'HS512');

            if (!JwtData) { throw new Error(`${controllerName}: jwtToken can not decode`); }
            else if (typeof JwtData != 'object') { throw new Error(`${controllerName}: JwtData have error during decode jwtToken`); }
            else if (!validate_String_AndNotEmpty(JwtData.sub)) { throw new Error(`${controllerName}: JwtData.sub have error during decode jwtToken`); }
            else if (!validateStrict_Number_OrNull(JwtData.iat)) { throw new Error(`${controllerName}: JwtData.iat have error during decode jwtToken`); }
            else if (moment(JwtData.iat).endOf('day').valueOf() !== moment(currentTimeStamp.currentDateTime_Object.format('YYYY-MM-DD'), 'YYYY-MM-DD', true).endOf('day').valueOf()) { throw new Error(`${controllerName}: JwtData.iat is not today`); }
            else if (JwtData.iat > currentTimeStamp.currentDateTime_Object.valueOf()) { throw new Error(`${controllerName}: JwtData.iat must lower than or equal currentTime (currentTimeStamp) during decode jwtToken`); }
            else if (!validateStrict_Number_OrNull(JwtData.exp)) { throw new Error(`${controllerName}: JwtData.exp have error during decode jwtToken`); }
            else if (JwtData.exp <= JwtData.iat) { throw new Error(`${controllerName}: JwtData.exp must more than or equal JwtData.iat, from decode jwtToken`); }
            else if (JwtData.exp <= currentTimeStamp.currentDateTime_Object.valueOf()) { throw new Error(`${controllerName}: JwtData.exp is Expried, from decode jwtToken`); }
            else {
                return JwtData;
            }
        }
    } catch (error) {
        console.error(error);
        return;
    }
};

module.exports = jwtEncodeController;