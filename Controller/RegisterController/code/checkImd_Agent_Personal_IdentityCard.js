const checkImd_Agent_Personal_IdentityCard = async (
    identity_card = {
        ctype: Boolean(),
        id: String()
    },
    callback = () => {}
) => {
    const controllerName = `checkImd_Agent_Personal_IdentityCard`;

    const { validate_String_AndNotEmpty, validateCitizenId_Thailand } = require('../../miscController');

    if (typeof identity_card != 'object') { callback(new Error(`${controllerName}: <identity_card> must be Object`)); return; }
    else if (typeof identity_card.ctype != 'boolean') { callback(new Error(`${controllerName}: <identity_card.ctype> must be Boolean`)); return; }
    else if (!validate_String_AndNotEmpty(identity_card.id)) { callback(new Error(`${controllerName}: <identity_card.id> must be String and Not Empty`)); return; }
    else {
        if (identity_card.ctype === true) {
            if (!validateCitizenId_Thailand(identity_card.id)) { callback(new Error(`${controllerName}: <identity_card.id> validate return false, due <identity_card.ctype> is true`)); return; }
        }

        callback(null);
        return {
            ctype: identity_card.ctype,
            id: identity_card.id,
        };
    }
};


module.exports = checkImd_Agent_Personal_IdentityCard;