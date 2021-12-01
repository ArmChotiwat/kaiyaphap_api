const checkPatient_Personal_IdentityCard = async (
    identity_card = {
        ctype: Boolean(),
        id: String()
    },
    _ref_storeid = '',
    callback = (err = new Error) => {}
) => {
    const controllerName = `checkPatient_Personal_IdentityCard`;

    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty } = require('../../miscController');
    const { ObjectId, patientModel, patientPIDModel } = require('../../mongodbController');

    if (typeof identity_card != 'object') { callback(new Error(`${controllerName}: <identity_card> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(_ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid> must be String ObjectId`)); return; }
    else if (typeof identity_card.ctype != 'boolean') { callback(new Error(`${controllerName}: <identity_card.ctype> must be Boolean`)); return; }
    else if (!validate_String_AndNotEmpty(identity_card.id)) { callback(new Error(`${controllerName}: <identity_card.id> must be String and Not Empty`)); return; }
    else {
        const Retry_Max = 10;
            for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                const findDuplicatePersonalIdCard = await patientModel.findOne(
                    {
                        'store._storeid': ObjectId(_ref_storeid),
                        'store.personal.identity_card.id': identity_card.id
                    },
                    {},
                    (err) => { if (err) callback(err); return; }
                );

                const findPatinetPID = await patientPIDModel.findOne(
                    {
                        '_ref_storeid': ObjectId(_ref_storeid),
                        'identity_card': identity_card.id
                    },
                    (err) => { if (err) { callback(err); return; } }
                );

                if (findDuplicatePersonalIdCard) { callback(new Error(`${controllerName}: findDuplicatePersonalIdCard return found at <identity_card.id> (${identity_card.id})`)); return; }
                if (findPatinetPID) { callback(new Error(`${controllerName}: findPatinetPID return found at <identity_card.id> (${identity_card.id})`)); return; }
            }

        callback(null);
        return identity_card;
    }
};

module.exports = checkPatient_Personal_IdentityCard;