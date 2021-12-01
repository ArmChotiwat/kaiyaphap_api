const checkPatient_Personal_Referral = async (referral = { referral_name: String() }, callback = (err = new Error) => {} ) => {
    const controllerName = `checkPatient_Personal_Referral`;

    const { validate_StringOrNull_AndNotEmpty } = require('../../miscController');

    if (typeof referral != 'object') { callback(new Error(`${controllerName}: <referral> must be Object`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(referral.referral_name)) { callback(new Error(`${controllerName}: <medication_privilege.privilege_name> must be String Or Null and Not Empty`)); return; }
    else {
        callback(null);
        return {
            referral_name: (referral.referral_name === null) ? null:String(referral.referral_name)
        };
    }
};

module.exports = checkPatient_Personal_Referral;