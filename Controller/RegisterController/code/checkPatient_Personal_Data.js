const checkPatient_Personal_Data = async (
    personal = {
        pre_name: String(),
        special_prename: String(),
        first_name: String(),
        last_name: String(),
        nick_name: String(),
        gender: String(),
        birth_date: String(),
        height: Number(),
        weight: Number(),
        nationality: String(),
        race: String(),
        religion: String(),
        blood_type: String(),
        telephone_number: String(),
        phone_number: String(),
        email: String(),
        status: String(),
        occupation: String(),
    },
    _ref_storeid = '',
    callback = (err = new Error) => {}
) => {
    const controllerName = `checkPatient_Personal_Data`;

    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty, validate_StringOrNull_AndNotEmpty, validatePhoneNumber, validateWeightHeight_OrNull, regExReplace }  = require('../../miscController');
    const { ObjectId, patientModel, patientPhoneNumberModel  } = require('../../mongodbController');

    if (typeof personal != 'object') { callback(new Error(`${controllerName}: <personal> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(_ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_String_AndNotEmpty(personal.pre_name)) { callback(new Error(`${controllerName}: <personal.pre_name> must be String and Not Empty`)); return; }
    else if (personal.pre_name == 'อื่นๆ' && !validate_String_AndNotEmpty(personal.special_prename)) { callback(new Error(`${controllerName}: <personal.special_prename> must be String and Not Empty Due <personal.pre_name> Selected Other`)); return; }
    else if (personal.pre_name != 'อื่นๆ' && personal.special_prename !== null) { callback(new Error(`${controllerName}: <personal.special_prename> must be Null Due <personal.pre_name> NOT Selected Other`)); return; }
    else if (!validate_String_AndNotEmpty(personal.first_name)) { callback(new Error(`${controllerName}: <personal.first_name> must be String and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(personal.last_name)) { callback(new Error(`${controllerName}: <personal.last_name> must be String and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.nick_name)) { callback(new Error(`${controllerName}: <personal.nick_name> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.gender)) { callback(new Error(`${controllerName}: <personal.gender> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.birth_date)) { callback(new Error(`${controllerName}: <personal.birth_date> must be String or Null and Not Empty`)); return; }
    else if (!validateWeightHeight_OrNull(personal.height)) { callback(new Error(`${controllerName}: <personal.height> must be Number morethan 0, or Null`)); return; }
    else if (!validateWeightHeight_OrNull(personal.weight)) { callback(new Error(`${controllerName}: <personal.weight> must be Number morethan 0, or Null`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.nationality)) { callback(new Error(`${controllerName}: <personal.nationality> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.race)) { callback(new Error(`${controllerName}: <personal.race> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.religion)) { callback(new Error(`${controllerName}: <personal.religion> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.blood_type)) { callback(new Error(`${controllerName}: <personal.blood_type> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.telephone_number)) { callback(new Error(`${controllerName}: <personal.telephone_number> must be String or Null and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(personal.phone_number)) { callback(new Error(`${controllerName}: <personal.phone_number> must be String and Not Empty`)); return; }
    else if (!validatePhoneNumber(personal.phone_number)) { callback(new Error(`${controllerName}: <personal.phone_number> validatePhoneNumber return false`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.email)) { callback(new Error(`${controllerName}: <personal.email> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.status)) { callback(new Error(`${controllerName}: <personal.status> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.occupation)) { callback(new Error(`${controllerName}: <personal.occupation> must be String or Null and Not Empty`)); return; }  
    else {
        const Rety_Max = 10;
        for (let Retry_Count = 0; Retry_Count < Rety_Max; Retry_Count++) {
            const findDuplicatePersonaPhoneNumber = await patientModel.findOne(
                {
                    'username': personal.phone_number,
                    'store._storeid': ObjectId(_ref_storeid),
                },
                {},
                (err) => { if (err) callback(err); return; }
            );

            const findPatinetPhoneNumber = await patientPhoneNumberModel.findOne(
                {
                    _ref_storeid: ObjectId(_ref_storeid),
                    phone_number: personal.phone_number
                },
                (err) => { if (err) { callback(err); return; } }
            );
            
            if (findDuplicatePersonaPhoneNumber) { callback(new Error(`${controllerName}: findDuplicatePersonaPhoneNumber return found at <_ref_storeid> (${_ref_storeid}), <personal.phone_number> (${personal.phone_number})`)); return; }
            if (findPatinetPhoneNumber) { callback(new Error(`${controllerName}: findPatinetPhoneNumber return found at <_ref_storeid> (${_ref_storeid}), <personal.phone_number> (${personal.phone_number})`)); return; }
        }

        personal.pre_name = regExReplace.regEx_ClearWhiteSpaceStartEnd(regExReplace.regEx_OnlyOneWhiteSpace(personal.pre_name));
        personal.special_prename = personal.special_prename === null ? null:regExReplace.regEx_ClearWhiteSpaceStartEnd(regExReplace.regEx_OnlyOneWhiteSpace(personal.special_prename));
        personal.first_name = regExReplace.regEx_ClearWhiteSpaceStartEnd(regExReplace.regEx_OnlyOneWhiteSpace(personal.first_name));
        personal.last_name = regExReplace.regEx_ClearWhiteSpaceStartEnd(regExReplace.regEx_OnlyOneWhiteSpace(personal.last_name));

        callback(null);
        return personal;
    }
};

module.exports = checkPatient_Personal_Data;