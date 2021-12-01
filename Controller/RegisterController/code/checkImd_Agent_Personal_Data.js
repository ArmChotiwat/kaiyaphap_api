const checkImd_Agent_Personal_Data = async (
    personal = {
        pre_name: String(),
        special_prename: String(),
        first_name: String(),
        last_name: String(),
        gender: String(),
        birth_date: String(),
        phone_number: String(),
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `checkImd_Agent_Personal_Data`;

    const moment = require('moment');
    const { validate_String_AndNotEmpty, validate_StringOrNull_AndNotEmpty, validatePhoneNumber, regExReplace }  = require('../../miscController');

    if (typeof personal != 'object') { callback(new Error(`${controllerName}: <personal> must be Object`)); return; }
    else if (!validate_String_AndNotEmpty(personal.pre_name)) { callback(new Error(`${controllerName}: <personal.pre_name> must be String and Not Empty`)); return; }
    // else if (personal.pre_name == 'อื่นๆ' && !validate_String_AndNotEmpty(personal.special_prename)) { callback(new Error(`${controllerName}: <personal.special_prename> must be String and Not Empty Due <personal.pre_name> Selected Other`)); return; }
    // else if (personal.pre_name != 'อื่นๆ' && personal.special_prename !== null) { callback(new Error(`${controllerName}: <personal.special_prename> must be Null Due <personal.pre_name> NOT Selected Other`)); return; }
    else if (!validate_String_AndNotEmpty(personal.first_name)) { callback(new Error(`${controllerName}: <personal.first_name> must be String and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(personal.last_name)) { callback(new Error(`${controllerName}: <personal.last_name> must be String and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(personal.gender)) { callback(new Error(`${controllerName}: <personal.gender> must be String and Not Empty`)); return; }
    else if (personal.gender !== 'ชาย' && personal.gender !== 'หญิง') { callback(new Error(`${controllerName}: <personal.gender> must be String [ชาย|หญิง] and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.birth_date)) { callback(new Error(`${controllerName}: <personal.birth_date> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.phone_number)) { callback(new Error(`${controllerName}: <personal.phone_number> must be String or Null and Not Empty`)); return; }
    else {
        if (personal.phone_number !== null) {
            if (!validate_String_AndNotEmpty(personal.phone_number)) { callback(new Error(`${controllerName}: <personal.phone_number> must be String and Not Empty, Due <personal.phone_number> is Not Null`)); return; }
            else {
                if (!validatePhoneNumber(personal.phone_number)) { callback(new Error(`${controllerName}: <personal.phone_number> validate return false`)); return; }
            }
        }

        if (personal.birth_date !== null) {
            const validateBirthDate = moment(personal.birth_date, 'YYYY-MM-DD', true).isValid();
            if (!validateBirthDate) {
                callback(new Error(`${controllerName}: <personal.birth_date> validate return false (YYYY-MM-DD)`));
            }
        }

        callback(null);
        return {
            pre_name: personal.pre_name,
            special_prename: (!personal.special_prename) ? null:regExReplace.regEx_ClearWhiteSpaceStartEnd(regExReplace.regEx_OnlyOneWhiteSpace(personal.special_prename)),
            first_name: regExReplace.regEx_ClearWhiteSpaceStartEnd(regExReplace.regEx_OnlyOneWhiteSpace(personal.first_name)),
            last_name: regExReplace.regEx_ClearWhiteSpaceStartEnd(regExReplace.regEx_OnlyOneWhiteSpace(personal.last_name)),
            gender: personal.gender,
            birth_date: personal.birth_date,
            telephone_number: null,
            phone_number: personal.phone_number,
            pflevel: null,
            skill: [],
        };
    }
};

module.exports = checkImd_Agent_Personal_Data;