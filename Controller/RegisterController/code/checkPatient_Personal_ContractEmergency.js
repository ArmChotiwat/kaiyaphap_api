const checkPatient_Personal_ContractEmergency = async (
    contract_emergency = {
        isenabled: Boolean(),
        data: {
            personal_realationship: String(),
            pre_name: String(),
            special_prename: String(),
            first_name: String(),
            last_name: String(),
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
            telephone_number: String(),
            phone_number: String(),
            email: String(),
        }
    }, 
    callback = (err = new Error) => {}
) => {
    const controllerName = `checkPatient_Personal_ContractEmergency`;

    if (typeof contract_emergency != 'object') { callback(`${controllerName}: <contract_emergency> must be Object`); }
    else if (typeof contract_emergency.isenabled != 'boolean') { callback(`${controllerName}: <contract_emergency.isenabled> must be Boolean`); }
    else if (typeof contract_emergency.data != 'object') { callback(`${controllerName}: <contract_emergency.data> must be Object`); }
    else {
        const { validate_String_AndNotEmpty, validate_StringOrNull_AndNotEmpty, validateVillageNumber_OrNull } = require('../../miscController');

        if (contract_emergency.isenabled) {
            if (contract_emergency.data.personal_realationship !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.personal_realationship> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.pre_name !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.pre_name> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.special_prename !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.special_prename> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.first_name !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.first_name> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.last_name !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.last_name> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.address_number !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.address_number> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.village_number !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.village_number> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.village !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.village> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.building !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.building> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.alley !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.alley> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.road !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.road> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.province !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.province> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.district !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.district> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.sub_district !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.sub_district> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.postcode !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.postcode> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.telephone_number !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.telephone_number> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.phone_number !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.phone_number> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else if (contract_emergency.data.email !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.email> must be or Null Due <contract_emergency.isenabled> is True`)); return; }
            else {
                callback(null);
                return {
                    isenabled: true,
                    data: {
                        personal_realationship: null,
                        pre_name: null,
                        special_prename: null,
                        first_name: null,
                        last_name: null,
                        address_number: null,
                        village_number: null,
                        village: null,
                        building: null,
                        alley: null,
                        road: null,
                        province: null,
                        district: null,
                        sub_district: null,
                        postcode: null,
                        telephone_number: null,
                        phone_number: null,
                        email: null,
                    }
                };
            }
        }
        else {
            if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.personal_realationship)) { callback(new Error(`${controllerName}: <contract_emergency.data.personal_realationship> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.pre_name)) { callback(new Error(`${controllerName}: <contract_emergency.data.pre_name> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (contract_emergency.data.pre_name == 'อื่นๆ' && !validate_String_AndNotEmpty(contract_emergency.data.special_prename)) { callback(new Error(`${controllerName}: <contract_emergency.data.special_prename> must be String or Null and Not Empty Due <contract_emergency.data.pre_name> Selected Other, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (contract_emergency.data.pre_name != 'อื่นๆ' && contract_emergency.data.special_prename !== null) { callback(new Error(`${controllerName}: <contract_emergency.data.special_prename> must be Null Due <contract_emergency.data.pre_name> NOT Selected Other, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.first_name)) { callback(new Error(`${controllerName}: <contract_emergency.data.first_name> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.last_name)) { callback(new Error(`${controllerName}: <contract_emergency.data.last_name> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.address_number)) { callback(new Error(`${controllerName}: <contract_emergency.data.address_number> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validateVillageNumber_OrNull(contract_emergency.data.village_number)) { callback(new Error(`${controllerName}: <contract_emergency.data.village_number> must be Number Integer morethan 0, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.village)) { callback(new Error(`${controllerName}: <contract_emergency.data.village> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.building)) { callback(new Error(`${controllerName}: <contract_emergency.data.building> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.alley)) { callback(new Error(`${controllerName}: <contract_emergency.data.alley> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.road)) { callback(new Error(`${controllerName}: <contract_emergency.data.road> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.province)) { callback(new Error(`${controllerName}: <contract_emergency.data.province> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.district)) { callback(new Error(`${controllerName}: <contract_emergency.data.district> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.sub_district)) { callback(new Error(`${controllerName}: <contract_emergency.data.sub_district> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.postcode)) { callback(new Error(`${controllerName}: <contract_emergency.data.postcode> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.telephone_number)) { callback(new Error(`${controllerName}: <contract_emergency.data.telephone_number> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.phone_number)) { callback(new Error(`${controllerName}: <contract_emergency.data.phone_number> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(contract_emergency.data.email)) { callback(new Error(`${controllerName}: <contract_emergency.data.email> must be String or Null and Not Empty, Due <contract_emergency.isenabled> is FALSE`)); return; }
            else {
                callback(null);
                return {
                    isenabled: false,
                    data: {
                        personal_realationship: (contract_emergency.data.personal_realationship === null) ? null:String(contract_emergency.data.personal_realationship),
                        pre_name: String(contract_emergency.data.pre_name),
                        special_prename: (contract_emergency.data.special_prename === null) ? null:String(contract_emergency.data.special_prename),
                        first_name: (contract_emergency.data.first_name === null) ? null:String(contract_emergency.data.first_name),
                        last_name: (contract_emergency.data.last_name === null) ? null:String(contract_emergency.data.last_name),
                        address_number: (contract_emergency.data.address_number === null) ? null:String(contract_emergency.data.address_number),
                        village_number: (contract_emergency.data.village_number === null) ? null:Number(contract_emergency.data.village_number),
                        village: (contract_emergency.data.village === null) ? null:String(contract_emergency.data.village),
                        building: (contract_emergency.data.building === null) ? null:String(contract_emergency.data.building),
                        alley: (contract_emergency.data.alley === null) ? null:String(contract_emergency.data.alley),
                        road: (contract_emergency.data.road === null) ? null:String(contract_emergency.data.road),
                        province: (contract_emergency.data.province === null) ? null:String(contract_emergency.data.province),
                        district: (contract_emergency.data.district === null) ? null:String(contract_emergency.data.district),
                        sub_district: (contract_emergency.data.sub_district === null) ? null:String(contract_emergency.data.sub_district),
                        postcode: (contract_emergency.data.postcode === null) ? null:String(contract_emergency.data.postcode),
                        telephone_number: (contract_emergency.data.telephone_number === null) ? null:String(contract_emergency.data.telephone_number),
                        phone_number: (contract_emergency.data.phone_number === null) ? null:String(contract_emergency.data.phone_number),
                        email: (contract_emergency.data.email === null) ? null:String(contract_emergency.data.email),
                    }
                };
            }
        }
    }
};

module.exports = checkPatient_Personal_ContractEmergency;