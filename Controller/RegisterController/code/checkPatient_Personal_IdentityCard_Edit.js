const checkPatient_Personal_IdentityCard_Edit = async (
    identity_card = {
        ctype: Boolean(),
        id: String()
    },
    _ref_patient_userid = '',
    _ref_storeid = '',
    callback = (err = new Error) => {}
) => {
    const controllerName = `checkPatient_Personal_IdentityCard_Edit`;

    const Retry_Max = 10;

    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty } = require('../../miscController');
    const { ObjectId, patientModel, patientPIDModel } = require('../../mongodbController');

    const MSG_ERROR_AT_STORE = `At Request Parameter <_ref_storeid>: (${_ref_storeid})`;
    const MSG_ERROR_AT_PATIENT_STORE = `At Request Parameter <_ref_patient_userid>: (${_ref_patient_userid}), <_ref_storeid>: (${_ref_storeid})`;

    if (typeof identity_card != 'object') { callback(new Error(`${controllerName}: <identity_card> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(_ref_patient_userid)) { callback(new Error(`${controllerName}: <_ref_patient_userid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(_ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid> must be String ObjectId`)); return; }
    else if (typeof identity_card.ctype != 'boolean') { callback(new Error(`${controllerName}: <identity_card.ctype> must be Boolean`)); return; }
    else if (!validate_String_AndNotEmpty(identity_card.id)) { callback(new Error(`${controllerName}: <identity_card.id> must be String and Not Empty`)); return; }
    else {
        const findCurrentPateintPID_From_patientModel = await patientModel.aggregate(
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
                    'phone_number': '$store.personal.phone_number',
                    'identity_card': '$store.personal.identity_card.id',
                  }
                }
            ],
            (err) => { if (err) { callback(err); return; } }
        );

        const findCurrentPateintPID_From_patientPIDModel = await patientPIDModel.findOne(
            {
                '_ref_patient_userid': ObjectId(_ref_patient_userid),
                '_ref_storeid': ObjectId(_ref_storeid),
            },
            {},
            (err) => { if (err) { callback(err); return; } }
        );

        if (!findCurrentPateintPID_From_patientModel) { callback(new Error(`${controllerName}: findCurrentPateintPID_From_patientModel have error during aggregate`)); return; }
        else if (findCurrentPateintPID_From_patientModel.length <= 0) { callback(new Error(`${controllerName}: findCurrentPateintPID_From_patientModel return not Found ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
        else if (findCurrentPateintPID_From_patientModel.length !== 1) { callback(new Error(`${controllerName}: findCurrentPateintPID_From_patientModel return more than 1 ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
        else if (!findCurrentPateintPID_From_patientModel[0].phone_number) { callback(new Error(`${controllerName}: findCurrentPateintPID_From_patientModel return not Found <phone_number> ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
        else if (!findCurrentPateintPID_From_patientPIDModel && findCurrentPateintPID_From_patientModel[0].identity_card !== null) { callback(new Error(`${controllerName}: findCurrentPateintPID_From_patientPIDModel return not Found ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
        else {
            if (String(findCurrentPateintPID_From_patientModel[0]._ref_patient_userid) !== _ref_patient_userid) { callback(new Error(`${controllerName}: <_ref_patient_userid>  Not Equal beetween <patientModel> (${findCurrentPateintPID_From_patientModel[0]._ref_patient_userid}) and <Req Parameter> (${_ref_patient_userid}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
            else if (String(findCurrentPateintPID_From_patientModel[0]._ref_storeid) !== _ref_storeid) { callback(new Error(`${controllerName}: <_ref_storeid>  Not Equal beetween <patientModel> (${findCurrentPateintPID_From_patientModel[0]._ref_storeid}) and <Req Parameter> (${_ref_storeid}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
            else {
                if (!findCurrentPateintPID_From_patientPIDModel && findCurrentPateintPID_From_patientModel[0].identity_card === null) {
                    let validated = true;
                    for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                        const findExistsPID_FROM_patientModel = await patientModel.findOne(
                            {
                                'store._storeid': ObjectId(_ref_storeid),
                                'store.personal.identity_card.id': identity_card.id
                            },
                            {},
                            (err) => { if (err) { callback(err); return; } }
                        );

                        if (findExistsPID_FROM_patientModel) { validated = false; callback(new Error(`${controllerName}: Req <identity_card.id> (${identity_card.id}) is Duplicated ${MSG_ERROR_AT_STORE}`)); return; }
                    }

                    if (!validated) { callback(`${controllerName}: validate failed`); return; }
                    else {
                        callback(null);
                        return {
                            isModify: true,
                            identity_card,
                        };
                    }
                }
                else if (findCurrentPateintPID_From_patientPIDModel && findCurrentPateintPID_From_patientModel[0].identity_card) {
                    if (String(findCurrentPateintPID_From_patientPIDModel._ref_patient_userid) !== _ref_patient_userid) { callback(new Error(`${controllerName}: <_ref_patient_userid>  Not Equal beetween <patientPIDModel> (${patientPIDModel._ref_patient_userid}) and <Req Parameter> (${_ref_patient_userid}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
                    else if (String(findCurrentPateintPID_From_patientPIDModel._ref_storeid) !== _ref_storeid) { callback(new Error(`${controllerName}: <_ref_storeid>  Not Equal beetween <patientPIDModel> (${patientPIDModel._ref_storeid}) and <Req Parameter> (${_ref_storeid}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
                    else {
                        if (String(findCurrentPateintPID_From_patientModel[0]._ref_patient_userid) !== String(findCurrentPateintPID_From_patientPIDModel._ref_patient_userid)) { callback(new Error(`${controllerName}: <_ref_patient_userid>  Not Equal beetween <patientModel> (${findCurrentPateintPID_From_patientModel[0]._ref_patient_userid}) and <patientPIDModel> (${findCurrentPateintPID_From_patientPIDModel._ref_patient_userid}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
                        else if (String(findCurrentPateintPID_From_patientModel[0]._ref_patient_userstoreid) !== String(findCurrentPateintPID_From_patientPIDModel._ref_patient_userstoreid)) { callback(new Error(`${controllerName}: <_ref_patient_userstoreid>  Not Equal beetween <patientModel> (${findCurrentPateintPID_From_patientModel[0]._ref_patient_userstoreid}) and <patientPIDModel> (${findCurrentPateintPID_From_patientPIDModel._ref_patient_userstoreid}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
                        else if (String(findCurrentPateintPID_From_patientModel[0]._ref_storeid) !== String(findCurrentPateintPID_From_patientPIDModel._ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid>  Not Equal beetween <patientModel> (${findCurrentPateintPID_From_patientModel[0]._ref_storeid}) and <patientPIDModel> (${findCurrentPateintPID_From_patientPIDModel._ref_storeid}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
                        else if (String(findCurrentPateintPID_From_patientModel[0].identity_card) !== String(findCurrentPateintPID_From_patientPIDModel.identity_card)) { callback(new Error(`${controllerName}: <identity_card>  Not Equal beetween <patientModel> (${findCurrentPateintPID_From_patientModel[0].identity_card}) and <patientPIDModel> (${findCurrentPateintPID_From_patientPIDModel.identity_card}) ${MSG_ERROR_AT_PATIENT_STORE}`)); return; }
                        else {
                            let validated = true;
                            if (findCurrentPateintPID_From_patientPIDModel.identity_card !== identity_card.id) {
                                for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                                    const findExistsPID_FROM_patientModel = await patientModel.findOne(
                                        {
                                            'store._storeid': ObjectId(_ref_storeid),
                                            'store.personal.identity_card.id': identity_card.id
                                        },
                                        {},
                                        (err) => { if (err) { callback(err); return; } }
                                    );
        
                                    const findExistsPID_FROM_patientPIDModel = await patientPIDModel.findOne(
                                        {
                                            '_ref_storeid': ObjectId(_ref_storeid),
                                            'identity_card': identity_card.id
                                        },
                                        {},
                                        (err) => { if (err) { callback(err); return; } }
                                    );
        
                                    if (findExistsPID_FROM_patientModel || findExistsPID_FROM_patientPIDModel) { validated = false; callback(new Error(`${controllerName}: Req <identity_card.id> (${identity_card.id}) is Duplicated ${MSG_ERROR_AT_STORE}`)); return; }
                                }

                                if (!validated) { callback(`${controllerName}: validate failed`); return; }
                                else {
                                    callback(null);
                                    return {
                                        isModify: true,
                                        identity_card,
                                    };
                                }
                            }
                            else {
                                callback(null);
                                return {
                                    isModify: false,
                                    identity_card,
                                };
                            }
                        }
                    }
                }
                else {
                    callback(new Error(`${controllerName}: Out of Rule`));
                    return;
                }
            }
        }
    }
};

module.exports = checkPatient_Personal_IdentityCard_Edit;