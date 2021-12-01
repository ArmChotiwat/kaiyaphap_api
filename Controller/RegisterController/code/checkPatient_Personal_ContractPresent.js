const checkPatient_Personal_ContractPresent = async (
    contract_present = {
        address_number: String(),
        village_number: Number(),
        village: String(),
        building: String(),
        alley: String(),
        road: String(),
        province: String(),
        district: String(),
        sub_district: String(),
        postcode: String(),
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `checkPatient_Personal_ContractPresent`;

    const { validate_StringOrNull_AndNotEmpty, validateVillageNumber_OrNull } = require('../../miscController');

    if (typeof contract_present != 'object') { callback(new Error(`${controllerName}: <contract_present> must be Object`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_present.address_number)) { callback(new Error(`${controllerName}: <contract_present.address_number> must be String or Null and Not Empty`)); return; }
    else if (!validateVillageNumber_OrNull(contract_present.village_number)) { callback(new Error(`${controllerName}: <contract_present.village_number> must be Number morethan 0 or Null`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_present.village)) { callback(new Error(`${controllerName}: <contract_present.village> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_present.building)) { callback(new Error(`${controllerName}: <contract_present.building> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_present.alley)) { callback(new Error(`${controllerName}: <contract_present.alley> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_present.road)) { callback(new Error(`${controllerName}: <contract_present.road> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_present.province)) { callback(new Error(`${controllerName}: <contract_present.province> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_present.district)) { callback(new Error(`${controllerName}: <contract_present.district> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_present.sub_district)) { callback(new Error(`${controllerName}: <contract_present.sub_district> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_present.postcode)) { callback(new Error(`${controllerName}: <contract_present.postcode> must be String or Null and Not Empty`)); return; }
    else {
        callback(null);
        return contract_present;
    }
};

module.exports = checkPatient_Personal_ContractPresent;