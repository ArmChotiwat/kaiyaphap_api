const checkImdAgent_Personal_Address = async (
    address = {
        homenumber: '',
        province: '',
        district: '',
        subdistrict: '',
        alley: '',
        village_number: 0,
        village: '',
        building: '',
        postcode: '',
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'checkImdAgent_Personal_Address';

    const { validate_StringOrNull_AndNotEmpty, validate_String_AndNotEmpty, validateStrict_Number_OrNull }  = require('../../miscController');

    if (address.alley === '') { address.alley = null }
    if (address.village_number === '') { address.village_number = null }
    if (address.village === '') { address.village = null }
    if (address.building === '') { address.building = null }

    if (typeof address != 'object') { callback(new Error(`${controllerName}: <address> must be Object`)); return; }
    else if (!validate_String_AndNotEmpty(address.homenumber)) { callback(new Error(`${controllerName}: <address.homenumber> must be String or Null and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(address.province)) { callback(new Error(`${controllerName}: <address.province> must be String or Null and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(address.district)) { callback(new Error(`${controllerName}: <address.district> must be String or Null and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(address.subdistrict)) { callback(new Error(`${controllerName}: <address.subdistrict> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(address.alley)) { callback(new Error(`${controllerName}: <address.alley> must be String or Null and Not Empty`)); return; }
    else if (!validateStrict_Number_OrNull(address.village_number)) { callback(new Error(`${controllerName}: <address.village_number> must be Integer Number or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(address.village)) { callback(new Error(`${controllerName}: <address.village> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(address.building)) { callback(new Error(`${controllerName}: <address.building> must be String or Null and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(address.postcode)) { callback(new Error(`${controllerName}: <address.postcode> must be String or Null and Not Empty`)); return; }
    else {
        callback(null);
        return {
            country: !address.province ? null:'Thailand',
            homenumber: address.homenumber,
            province: address.province,
            district: address.district,
            subdistrict: address.subdistrict,
            alley: address.alley,
            village_number: address.village_number,
            village: address.village,
            building: address.building,
            postcode: address.postcode,
        };
    }
};



module.exports = checkImdAgent_Personal_Address;