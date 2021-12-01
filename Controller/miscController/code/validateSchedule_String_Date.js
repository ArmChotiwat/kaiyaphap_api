/**
 * Misc Controller สำหรับตรวจสอบวันที่ ของ Add => Schedule (YYYY-MM-DD) (2020-09-06)
 */
const validateSchedule_String_Date = (dataInput = '') => {
    const validateStringAndNotEmpty = require('./validateStringAndNotEmpty');

    try {
        if (!validateStringAndNotEmpty(dataInput)) { return false; }
        else {
            if (dataInput.length !== 10) { return false; }
            else {
                const RegEx_Select_Dash = /\-/ig;
                const RegEx_Select_Number = /[0-9]/ig;

                for (let index = 0; index < dataInput.length; index++) {
                    const element = dataInput[index];

                    if (index >= 0 && index <= 3) { if (element.search(RegEx_Select_Number) !== 0) { return false; } }
                    else if (index == 4 || index == 7) { if (element.search(RegEx_Select_Dash) !== 0) { return false; } }
                    else if (index >= 5 && index <= 6) { if (element.search(RegEx_Select_Number) !== 0) { return false; } }
                    else if (index >= 8 && index <= 9) { if (element.search(RegEx_Select_Number) !== 0) { return false; } }
                    else { return false; }
                }

                const Replace_Dash = dataInput.replace(RegEx_Select_Dash, '');
                
                if (isNaN(Replace_Dash)) { return false; }
                else {
                    const Convert_To_Number = Number(Replace_Dash);

                    if (Convert_To_Number < 0) { return false; }
                    else if (!Number.isInteger(Convert_To_Number)) { return false; }
                    else {
                        const currentDate_Number = Number(require('moment')().format('YYYYMMDD'));

                        if (Convert_To_Number < currentDate_Number) { return false; }
                        else {
                            return true;
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = validateSchedule_String_Date;