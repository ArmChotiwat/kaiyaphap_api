/**
 * JwtDecode Token สำหรับ JwtToken เข้าใช้ระบบ KYP
 */
const jwtDecode_Login_StoreBranchController = (jwtToken = '') => {
    const controllerName = 'jwtDecode_Login_StoreBranchController';

    const moment = require('moment');
    const { validate_String_AndNotEmpty, validateStrict_Number_OrNull, currentDateTime, validate_StringObjectId_NotNull } = require('../../miscController');
    const { ObjectId } = require('../../mongodbController');
    const JwtDecode = require('./jwtDecodeController');
    const JWT_SECRET_PORTAL = require('../../../Config/cfg_crypto').JWT_SECRET_PORTAL;

    try {
        const currentTimeStamp = currentDateTime();

        const JwtData = JwtDecode(jwtToken, JWT_SECRET_PORTAL);

        if (!JwtData) { throw new Error(`${controllerName}: jwtToken can not decode`); }
        else if (typeof JwtData != 'object') { throw new Error(`${controllerName}: JwtData have error during decode jwtToken`); }
        else if (!validate_String_AndNotEmpty(JwtData.sub)) { throw new Error(`${controllerName}: JwtData.sub have error during decode jwtToken`); }
        else if (!validateStrict_Number_OrNull(JwtData.iat)) { throw new Error(`${controllerName}: JwtData.iat have error during decode jwtToken`); }
        else if (moment(JwtData.iat).endOf('day').valueOf() !== moment(currentTimeStamp.currentDateTime_Object.format('YYYY-MM-DD'), 'YYYY-MM-DD', true).endOf('day').valueOf()) { throw new Error(`${controllerName}: JwtData.iat is not today`); }
        else if (JwtData.iat > currentTimeStamp.currentDateTime_Object.valueOf()) { throw new Error(`${controllerName}: JwtData.iat must lower than or equal currentTime (currentTimeStamp) during decode jwtToken`); }
        else if (!validateStrict_Number_OrNull(JwtData.exp)) { throw new Error(`${controllerName}: JwtData.exp have error during decode jwtToken`); }
        else if (JwtData.exp <= JwtData.iat) { throw new Error(`${controllerName}: JwtData.exp must more than or equal JwtData.iat, from decode jwtToken`); }
        else if (JwtData.exp <= currentTimeStamp.currentDateTime_Object.valueOf()) { throw new Error(`${controllerName}: JwtData.exp is Expried, from decode jwtToken`); }
        else if (!validate_StringObjectId_NotNull(JwtData._ref_storeid)) { throw new Error(`${controllerName}: JwtData._ref_storeid is not found or not String ObjectId, from decode jwtToken`); }
        else if (!validate_StringObjectId_NotNull(JwtData._ref_branchid)) { throw new Error(`${controllerName}: JwtData._ref_branchid is not found or not String ObjectId, from decode jwtToken`); }
        else if (!validate_StringObjectId_NotNull(JwtData._ref_agent_userid)) { throw new Error(`${controllerName}: JwtData._ref_agent_userid is not found or not String ObjectId, from decode jwtToken`); }
        else if (!validate_StringObjectId_NotNull(JwtData._ref_agent_userstoreid)) { throw new Error(`${controllerName}: JwtData._ref_agent_userstoreid is not found or not String ObjectId, from decode jwtToken`); }
        else if (isNaN(JwtData.role)) { throw new Error(`${controllerName}: JwtData.role is not found or not Integer Number, from decode jwtToken`); }
        else if (!Number.isInteger(JwtData.role)) { throw new Error(`${controllerName}: JwtData.role is not Integer Number, from decode jwtToken`); }
        else {
            return {
                sub: String(JwtData.sub),
                iat: Number(JwtData.iat),
                exp: Number(JwtData.exp),
                _ref_storeid: ObjectId(JwtData._ref_storeid),
                _ref_branchid: ObjectId(JwtData._ref_branchid),
                _ref_agent_userid: ObjectId(JwtData._ref_agent_userid),
                _ref_agent_userstoreid: ObjectId(JwtData._ref_agent_userstoreid),
                role: Number(JwtData.role),
            };
        }
    } catch (error) {
        console.error(error);
        return;
    }
};

module.exports = jwtDecode_Login_StoreBranchController;