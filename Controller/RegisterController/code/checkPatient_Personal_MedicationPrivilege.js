const checkPatient_Personal_MedicationPrivilege = async (medication_privilege = { privilege_name: String() }, callback = (err = new Error) => {} ) => {
    const controllerName = `checkPatient_Personal_MedicationPrivilege`;

    const { validate_StringOrNull_AndNotEmpty } = require('../../miscController');

    if (typeof medication_privilege != 'object') { callback(new Error(`${controllerName}: <medication_privilege> must be Object`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(medication_privilege.privilege_name)) { callback(new Error(`${controllerName}: <medication_privilege.privilege_name> must be String Or Null and Not Empty`)); return; }
    else {
        callback(null);
        return {
            privilege_name: (medication_privilege.privilege_name === null) ? null:String(medication_privilege.privilege_name)
        };
    }
};

module.exports = checkPatient_Personal_MedicationPrivilege;