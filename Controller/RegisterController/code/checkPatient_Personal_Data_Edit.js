const checkPatient_Personal = async (
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
    _ref_patient_userid = '',
    _ref_storeid = '',
    callback = (err = new Error) => {}
) => {
    const controllerName = `checkPatient_Personal`;

    const Retry_Max = 10;

    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty, validate_StringOrNull_AndNotEmpty, validateStrict_Number_OrNull, validatePhoneNumber }  = require('../../miscController');
    const { ObjectId, patientModel, patientPhoneNumberModel  } = require('../../mongodbController');

    const MSG_ERROR_AT_STORE = `At Request Parameter <_ref_storeid>: (${_ref_storeid})`;
    const MSG_ERROR_AT_PATIENT_STORE = `At Request Parameter <_ref_patient_userid>: (${_ref_patient_userid}), <_ref_storeid>: (${_ref_storeid})`;

    if (typeof personal != 'object') { callback(new Error(`${controllerName}: <personal> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(_ref_patient_userid)) { callback(new Error(`${controllerName}: <_ref_patient_userid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(_ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_String_AndNotEmpty(personal.pre_name)) { callback(new Error(`${controllerName}: <personal.pre_name> must be String and Not Empty`)); return; }
    else if (personal.pre_name == 'อื่นๆ' && !validate_String_AndNotEmpty(personal.special_prename)) { callback(new Error(`${controllerName}: <personal.special_prename> must be String and Not Empty Due <personal.pre_name> Selected Other`)); return; }
    else if (personal.pre_name != 'อื่นๆ' && personal.special_prename !== null) { callback(new Error(`${controllerName}: <personal.special_prename> must be Null Due <personal.pre_name> NOT Selected Other`)); return; }
    else if (!validate_String_AndNotEmpty(personal.first_name)) { callback(new Error(`${controllerName}: <personal.first_name> must be String and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(personal.last_name)) { callback(new Error(`${controllerName}: <personal.last_name> must be String and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.nick_name)) { callback(new Error(`${controllerName}: <personal.nick_name> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.gender)) { callback(new Error(`${controllerName}: <personal.gender> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(personal.birth_date)) { callback(new Error(`${controllerName}: <personal.birth_date> must be String or Null and Not Empty`)); return; }
    else if (!validateStrict_Number_OrNull(personal.height)) { callback(new Error(`${controllerName}: <personal.height> must be Number morethan 0, or Null`)); return; }
    else if (personal.height !== null && personal.height <= 0) { callback(new Error(`${controllerName}: <personal.height> must be Morethan 0 Due <personal.height> is Not Null`)); return; }
    else if (!validateStrict_Number_OrNull(personal.weight)) { callback(new Error(`${controllerName}: <personal.weight> must be Number morethan 0, or Null`)); return; }
    else if (personal.weight !== null && personal.weight <= 0) { callback(new Error(`${controllerName}: <personal.weight> must be Morethan 0 Due <personal.weight> is Not Null`)); return; }
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
        const findCurrentPateintPhoneNumber_From_patientModel = await patientModel.aggregate(
            [
                {
                  '$match': {
                    '_id': ObjectId(_ref_patient_userid), 
                    'store._storeid': ObjectId(_ref_storeid)
                  }
                }, {
                  '$unwind': {
                    'path': '$store'
                  }
                }, {
                  '$match': {
                    '_id': ObjectId(_ref_patient_userid), 
                    'store._storeid': ObjectId(_ref_storeid)
                  }
                }, {
                  '$project': {
                    '_id': 0, 
                    '_ref_patient_userid': '$_id', 
                    '_ref_patient_userstoreid': '$store._id', 
                    '_ref_storeid': '$store._storeid', 
                    'phone_number': '$store.personal.phone_number'
                  }
                }
            ],
            (err) => { if (err) { callback(err); return; } }
        );

        const findCurrentPateintPhoneNumber_From_patientPhoneNumberModel = await patientPhoneNumberModel.findOne(
            {
                '_ref_patient_userid': ObjectId(_ref_patient_userid),
                '_ref_storeid': ObjectId(_ref_storeid),
            },
            {},
            (err) => { if (err) { callback(err); return; } }
        );

        if (!findCurrentPateintPhoneNumber_From_patientModel) { callback(new Error(`${controllerName}: findCurrentPateintPhoneNumber_From_patientModel have error during aggregate`)); return; }
        else if (findCurrentPateintPhoneNumber_From_patientModel.length <= 0) { callback(new Error(`${controllerName}: findCurrentPateintPhoneNumber_From_patientModel return not found`)); return; }
        else if (findCurrentPateintPhoneNumber_From_patientModel.length !== 1) { callback(new Error(`${controllerName}: findCurrentPateintPhoneNumber_From_patientModel return Length Not Equal 1 (${findCurrentPateintPhoneNumber_From_patientModel.length})`)); return; }
        else if (!findCurrentPateintPhoneNumber_From_patientPhoneNumberModel) { callback(new Error(`${controllerName}: findCurrentPateintPhoneNumber_From_patientPhoneNumberModel return not Found ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
        else {
            if (String(findCurrentPateintPhoneNumber_From_patientModel[0]._ref_patient_userid) !== _ref_patient_userid) { callback(new Error(`${controllerName}: <_ref_patient_userid>  Not Equal beetween <patientModel> (${findCurrentPateintPhoneNumber_From_patientModel[0]._ref_patient_userid}) and <Req Parameter> (${_ref_patient_userid}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
            else if (String(findCurrentPateintPhoneNumber_From_patientModel[0]._ref_storeid) !== _ref_storeid) { callback(new Error(`${controllerName}: <_ref_storeid>  Not Equal beetween <patientModel> (${findCurrentPateintPhoneNumber_From_patientModel[0]._ref_storeid}) and <Req Parameter> (${_ref_storeid}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
            else {
                if (String(findCurrentPateintPhoneNumber_From_patientModel[0]._ref_patient_userid) !== String(findCurrentPateintPhoneNumber_From_patientPhoneNumberModel._ref_patient_userid)) { callback(new Error(`${controllerName}: <_ref_patient_userid>  Not Equal beetween <patientModel> (${findCurrentPateintPhoneNumber_From_patientModel[0]._ref_patient_userid}) and <patientPIDModel> (${findCurrentPateintPhoneNumber_From_patientPhoneNumberModel._ref_patient_userid}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
                else if (String(findCurrentPateintPhoneNumber_From_patientModel[0]._ref_patient_userstoreid) !== String(findCurrentPateintPhoneNumber_From_patientPhoneNumberModel._ref_patient_userstoreid)) { callback(new Error(`${controllerName}: <_ref_patient_userstoreid>  Not Equal beetween <patientModel> (${findCurrentPateintPhoneNumber_From_patientModel[0]._ref_patient_userstoreid}) and <patientPIDModel> (${findCurrentPateintPhoneNumber_From_patientPhoneNumberModel._ref_patient_userstoreid}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
                else if (String(findCurrentPateintPhoneNumber_From_patientModel[0]._ref_storeid) !== String(findCurrentPateintPhoneNumber_From_patientPhoneNumberModel._ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid>  Not Equal beetween <patientModel> (${findCurrentPateintPhoneNumber_From_patientModel[0]._ref_storeid}) and <patientPIDModel> (${findCurrentPateintPhoneNumber_From_patientPhoneNumberModel._ref_storeid}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
                else if (String(findCurrentPateintPhoneNumber_From_patientModel[0].phone_number) !== String(findCurrentPateintPhoneNumber_From_patientPhoneNumberModel.phone_number)) { callback(new Error(`${controllerName}: <phone_number>  Not Equal beetween <patientModel> (${findCurrentPateintPhoneNumber_From_patientModel[0].phone_number}) and <patientPIDModel> (${findCurrentPateintPhoneNumber_From_patientPhoneNumberModel.phone_number}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
                else {
                    if (findCurrentPateintPhoneNumber_From_patientPhoneNumberModel.phone_number !== personal.phone_number) {
                        let validated = true;

                        for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                            const findExistsPhoneNumber_FROM_patientModel = await patientModel.findOne(
                                {
                                    'store._storeid': ObjectId(_ref_storeid),
                                    'store.personal.personal.phone_number': personal.phone_number
                                },
                                {},
                                (err) => { if (err) { callback(err); return; } }
                            );

                            const findExistsPhoneNumber_FROM_patientPhoneNumberModel = await patientPhoneNumberModel.findOne(
                                {
                                    '_ref_storeid': ObjectId(_ref_storeid),
                                    'phone_number': personal.phone_number
                                },
                                {},
                                (err) => { if (err) { callback(err); return; } }
                            );

                            if (findExistsPhoneNumber_FROM_patientModel || findExistsPhoneNumber_FROM_patientPhoneNumberModel) { validated = false; callback(new Error(`${controllerName}: <personal.phone_number> (${personal.phone_number}) is Duplicated ${MSG_ERROR_AT_STORE}`)); return; }
                        }

                        if (!validated) { callback(`${controllerName}: validate failed`); return; }
                        else {
                            callback(null);
                            return {
                                isModify: true,
                                personal,
                            };
                        }
                    }
                    else {
                        callback(null);
                        return {
                            isModify: false,
                            personal,
                        };
                    }
                }
            }
        }
    }
};

module.exports = checkPatient_Personal;