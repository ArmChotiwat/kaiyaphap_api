const checkAgent_Personal_Data = async (
    personal = {
        pre_name: String(),
        special_prename: String(),
        first_name: String(),
        last_name: String(),
        gender: String(),
        birth_date: String(),
        telephone_number: String(),
        phone_number: String(),
        pflevel: String(),
        skill: [''],
    },
    _ref_storeid = '',
    callback = (err = new Error) => {}
) => {
    const controllerName = `checkAgent_Personal_Data`;

    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty, validate_StringOrNull_AndNotEmpty, validatePhoneNumber, regExReplace }  = require('../../miscController');

    if (typeof personal != 'object') { callback(new Error(`${controllerName}: <personal> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(_ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_String_AndNotEmpty(personal.pre_name)) { callback(new Error(`${controllerName}: <personal.pre_name> must be String and Not Empty`)); return; }
    else if (personal.pre_name == 'อื่นๆ' && !validate_String_AndNotEmpty(personal.special_prename)) { callback(new Error(`${controllerName}: <personal.special_prename> must be String and Not Empty Due <personal.pre_name> Selected Other`)); return; }
    else if (personal.pre_name != 'อื่นๆ' && personal.special_prename !== null) { callback(new Error(`${controllerName}: <personal.special_prename> must be Null Due <personal.pre_name> NOT Selected Other`)); return; }
    else if (!validate_String_AndNotEmpty(personal.first_name)) { callback(new Error(`${controllerName}: <personal.first_name> must be String and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(personal.last_name)) { callback(new Error(`${controllerName}: <personal.last_name> must be String and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.gender)) { callback(new Error(`${controllerName}: <personal.gender> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.birth_date)) { callback(new Error(`${controllerName}: <personal.birth_date> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.telephone_number)) { callback(new Error(`${controllerName}: <personal.telephone_number> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.phone_number)) { callback(new Error(`${controllerName}: <personal.phone_number> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.pflevel)) { callback(new Error(`${controllerName}: <personal.pflevel> must be String or Null and Not Empty`)); return; }
    else if (typeof personal.skill != 'object') { callback(new Error(`${controllerName}: <personal.skill> must be Object Array`)); return; }
    else if (personal.skill.length < 0) { callback(new Error(`${controllerName}: <personal.skill> must be Length of Object Array (${personal.skill.length}) more than or equal 0`)); return; }
    else {
        if (personal.telephone_number !== null) {
            if (!validate_String_AndNotEmpty(personal.telephone_number)) { callback(new Error(`${controllerName}: <personal.telephone_number> must be String and Not Empty, <personal.telephone_number> is Not Null`)); return; }
        }

        if (personal.phone_number !== null) {
            if (!validate_String_AndNotEmpty(personal.phone_number)) { callback(new Error(`${controllerName}: <personal.phone_number> must be String and Not Empty, <personal.telephone_number> is Not Null`)); return; }
            else {
                if (!validatePhoneNumber(personal.phone_number)) { callback(new Error(`${controllerName}: <personal.phone_number> validate return false`)); return; }
            }
        }

        if (personal.skill.length > 0) {
            for (let index = 0; index < personal.skill.length; index++) {
                const element = personal.skill[index];
                
                if (!validate_String_AndNotEmpty(element)) { callback(new Error(`${controllerName}: <personal.skill[${index}]> must be String or Null and Not Empty`)); return; }
            }
        }

        callback(null);
        return {
            pre_name: personal.pre_name,
            special_prename: personal.special_prename === null ? null:regExReplace.regEx_ClearWhiteSpaceStartEnd(regExReplace.regEx_OnlyOneWhiteSpace(personal.special_prename)),
            first_name: regExReplace.regEx_ClearWhiteSpaceStartEnd(regExReplace.regEx_OnlyOneWhiteSpace(personal.first_name)),
            last_name: regExReplace.regEx_ClearWhiteSpaceStartEnd(regExReplace.regEx_OnlyOneWhiteSpace(personal.last_name)),
            gender: personal.gender,
            birth_date: personal.birth_date,
            telephone_number: personal.telephone_number,
            phone_number: personal.phone_number,
            pflevel: personal.pflevel,
            skill: personal.skill,
        };
    }
};

module.exports = checkAgent_Personal_Data;