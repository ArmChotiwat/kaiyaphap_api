/**
 * Misc Controller สำหรับ ตรวจสอบหมายเลขโทรศัพท์มือถือ 
 * 
 * โดยจะต้องมีแค่ ตัวเลข 0 ถึง 9 และมีความยาว 10 หลัก
 ** ผ่าน (true)
 ** ไม่ผ่าน (false)
 */
const validatePhoneNumber = (phone_number = '') => {
    const validateStringAndNotEmpty = require('./validateStringAndNotEmpty');

    if (!validateStringAndNotEmpty) { return false; }
    else {
        const RegEx_Replace = /[0-9]/ig;

        if (phone_number.replace(RegEx_Replace, '') === '') {
            if (phone_number.length === 10) {
                return true;
            }
            else { return false; }
        }
        else { return false; }
    }
};

module.exports = validatePhoneNumber;