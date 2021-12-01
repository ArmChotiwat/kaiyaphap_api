/**
 * Misc Controller สำหรับ ตรวจสอบ Payload ที่เป็น String ObjectId
 ** ถ้าใช้ จะ return true
 ** ถ้าไม่ใช่ จะ return false
 */
const validate_StringObjectId_NotNull = (dataInput = '') => {
    const validateObjectId = require('./validateObjectId');
    const validate_String_AndNotEmpty = require('./validateStringAndNotEmpty');

    if (!validate_String_AndNotEmpty(dataInput) || !validateObjectId(dataInput)) { return false; }
    else {
        return true;
    }
};

module.exports = validate_StringObjectId_NotNull;