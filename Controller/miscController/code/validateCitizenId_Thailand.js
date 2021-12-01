/**
 * misc Controller สำหรับ ตรวจรหัสบัตรประชาชน ประเทศไทย
 * 
 * โดยมีตัวเลข 0 ถึง 9, หลักแรกไม่เป็น 0 และมีความยาว 13 หลัก
 ** ผ่าน (true)
 ** ไม่ผ่าน (false)
 */
const validateCitizenId_Thailand = (thailandCitizenID = String('')) => {
    const { validate_String_AndNotEmpty } = require('../../miscController');
    
    try {
        if (validate_String_AndNotEmpty(thailandCitizenID)) {
            const RegEx_Replace = /[0-9]/ig;

            if (thailandCitizenID.replace(RegEx_Replace, '') === '') {
                if (isNaN(parseInt(thailandCitizenID))) { return false; }
                else if (thailandCitizenID.length != 13) { return false; }
                else {
                    return true;
                }
            }
            else { return false; }
        }
        else { return false; }
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = validateCitizenId_Thailand;