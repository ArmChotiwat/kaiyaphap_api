/**
 * misc Controller สำหรับตรวจสอบวันเกิด YYYY/MM/DD
 ** ผ่าน (true)
 ** ไม่ผ่าน (false)
 */
const validateBirthDate = (birthDateString = String('')) => {
    const moment = require('moment');

    try {
        if (typeof birthDateString != 'string' || birthDateString == '') { return false; }
        if (birthDateString.length != 10) { return false; }

        const splitCheck = (birthDateString.split('/').length === 3) ? true : false; // true is Valid, false is Not Valid
        const checkDate = moment(birthDateString, 'YYYY/MM/DD', true).isValid(); // true is Valid, false is Not Valid
        if (splitCheck && checkDate) { // BirthDate is Valid
            return true;
        } 
        else { return false; } // BirthDate is NOT Valid
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = validateBirthDate;