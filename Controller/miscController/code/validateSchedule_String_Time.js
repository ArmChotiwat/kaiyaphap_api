/**
 * misc Controller สำหรับตรวจสอบเวลา ของ Add => Schedule (HH:mm) (7:09)
 */
const validateSchedule_String_Time = (dataInput = '') => {
    const validateStringAndNotEmpty = require('./validateStringAndNotEmpty');

    try {
        if (!validateStringAndNotEmpty(dataInput)) { return false; }
        else {
            if (dataInput.length !== 4 && dataInput.length !== 5) { return false; }
            else {
                const RegEx_Find_Colon = /\:/ig;
                const RegEx_Select_Number = /[0-9]/ig;

                if (dataInput.length === 4) {
                    for (let index = 0; index < dataInput.length; index++) {
                        const element = dataInput[index];
                        switch (index) {
                            case 0:
                                if (element.search(RegEx_Select_Number) !== 0) { return false; }
                                break;
                            case 1:
                                if (element.search(RegEx_Find_Colon) !== 0) { return false; }
                                break;
                            case 2:
                                if (element.search(RegEx_Select_Number) !== 0) { return false; }
                                break;
                            case 3:
                                if (element.search(RegEx_Select_Number) !== 0) { return false; }
                                break;
                            default:
                                return false;
                        }
                    }
                    if (dataInput.search(RegEx_Find_Colon) !== 1) { return false; }
                    else if (dataInput.match(RegEx_Find_Colon).length !== 1) { return false; }
                    else {
                        const Replace_String = dataInput.replace(RegEx_Find_Colon, '');

                        if (isNaN(Replace_String)) { return false; }
                        else {
                            const String_To_Number =  Number(Replace_String);

                            if (String_To_Number < 0) { return false; }
                            else if (!Number.isInteger(String_To_Number)) { return false; }
                            else {
                                return true;
                            }
                        }
                    }
                }
                else if (dataInput.length === 5) {
                    for (let index = 0; index < dataInput.length; index++) {
                        const element = dataInput[index];
                        switch (index) {
                            case 0:
                                if (element.search(RegEx_Select_Number) !== 0) { return false; }
                                break;
                            case 1:
                                if (element.search(RegEx_Select_Number) !== 0) { return false; }
                                break;
                            case 2:
                                if (element.search(RegEx_Find_Colon) !== 0) { return false; }
                                break;
                            case 3:
                                if (element.search(RegEx_Select_Number) !== 0) { return false; }
                                break;
                            case 4:
                                if (element.search(RegEx_Select_Number) !== 0) { return false; }
                                break;
                            default:
                                return false;
                        }
                    }
                    if (dataInput.search(RegEx_Find_Colon) !== 2) { return false; }
                    else if (dataInput.match(RegEx_Find_Colon).length !== 1) { return false; }
                    else {
                        const Replace_String = dataInput.replace(RegEx_Find_Colon, '');

                        if (isNaN(Replace_String)) { return false; }
                        else {
                            const String_To_Number =  Number(Replace_String);

                            if (String_To_Number < 0) { return false; }
                            else if (!Number.isInteger(String_To_Number)) { return false; }
                            else {
                                return true;
                            }
                        }
                    }
                }
                else { return false; }
            }
        }
        
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = validateSchedule_String_Time;