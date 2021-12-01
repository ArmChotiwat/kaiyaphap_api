const checkPatient_Personal_ContractCard = async (
    contract_card = {
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
    const controllerName = `checkPatient_Personal_ContractCard`;

    const { validate_StringOrNull_AndNotEmpty, validateVillageNumber_OrNull } = require('../../miscController');

    if (typeof contract_card != 'object') { callback(new Error(`${controllerName}: <contract_card> must be Object`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_card.address_number)) { callback(new Error(`${controllerName}: <contract_card.address_number> must be String or Null and Not Empty`)); return; }
    else if (!validateVillageNumber_OrNull(contract_card.village_number)) { callback(new Error(`${controllerName}: <contract_card.village_number> must be Number Integer morethan 0 or Null`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_card.village)) { callback(new Error(`${controllerName}: <contract_card.village> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_card.building)) { callback(new Error(`${controllerName}: <contract_card.building> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_card.alley)) { callback(new Error(`${controllerName}: <contract_card.alley> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_card.road)) { callback(new Error(`${controllerName}: <contract_card.road> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_card.province)) { callback(new Error(`${controllerName}: <contract_card.province> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_card.district)) { callback(new Error(`${controllerName}: <contract_card.district> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_card.sub_district)) { callback(new Error(`${controllerName}: <contract_card.sub_district> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(contract_card.postcode)) { callback(new Error(`${controllerName}: <contract_card.postcode> must be String or Null and Not Empty`)); return; }
    else {
        callback(null);
        return contract_card;
    }
};

module.exports = checkPatient_Personal_ContractCard;