const registerPatientController_AutoIncresement = async (data = { _storeid: new String, personal_idcard: new String }, callback = (err = new Error) => { }) => {
  if (typeof data._storeid != 'string') { callback(new Error('registerPatientController => registerPatientController_AutoIncresementFix: type of data._storeid must be String')); return; }
  else if (data._storeid == '') { callback(new Error('registerPatientController => registerPatientController_AutoIncresementFix: type of data._storeid must NOT Empty')); return; }
  else if (typeof data.personal_idcard != 'string') { callback(new Error('registerPatientController => registerPatientController_AutoIncresementFix: type of data.personal_idcard must be String')); return; }
  else if (data.personal_idcard == '') { callback(new Error('registerPatientController => registerPatientController_AutoIncresementFix: type of data.personal_idcard must NOT Empty')); return; }
  else {
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const AutoIncrementPatientModel = require('../../mongodbController').AutoIncrementPatientModel;

    const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
    const mapData = {
      _storeid: data._storeid,
      personal_idcard: data.personal_idcard
    };
    const transactionSave = new AutoIncrementPatientModel(mapData);
    const result_data = await transactionSave.save()
      .then(
        (result) => { return result; }
      )
      .catch(
        (err) => { callback(err); return; }
      );

    callback(null);
    return result_data;
  }
};

module.exports = registerPatientController_AutoIncresement;

// const registerPatientController_readExcelSave = async (filePayload, callback = (err) => { }) => {
//   const importMap = {
//     username: filePayload.Profile_phone_number,
//     password: '12345678',
//     store: [{
//       _storeid: this.storeID,
//       user_status: true,
//       hn_ref: filePayload.RefHN,
//       personal: {
//         identity_card: {
//           ctype: ctype,
//           id: filePayload.Profile_citizen_id,
//         },
//         pre_name: filePayload.Profile_prefix, // require backend
//         special_prename: filePayload.Profile_is_prefix, // require backend
//         first_name: filePayload.Profile_name, // require backend
//         last_name: filePayload.Profile_surname, // require backend
//         nick_name: filePayload.Profile_nickname,
//         gender: filePayload.Profile_gender,
//         birth_date: birthdateCell,
//         height: filePayload.Profile_height,
//         weight: filePayload.Profile_weight,
//         nationality: filePayload.Profile_nationality,
//         race: filePayload.Profile_believe_in,
//         religion: filePayload.Profile_religion,
//         blood_type: filePayload.Profile_blood_type,
//         phone_number: BFphone, // require backend
//         email: filePayload.Profile_email,

//         status: filePayload.Profile_status,
//         occupation: filePayload.Profile_career,
//         contract_card: {
//           address_number: filePayload.AddressCard_house_number,
//           village_number: filePayload.AddressCard_village_number,
//           village: filePayload.AddressCard_village,
//           building: filePayload.AddressCard_building,
//           alley: filePayload.AddressCard_alley,
//           road: filePayload.AddressCard_road,
//           province: filePayload.AddressCard_province,
//           district: filePayload.AddressCard_district,
//           sub_district: filePayload.AddressCard_sup_district,
//           postcode: filePayload.AddressCard_postal_code,
//         },
//         contract_present: {
//           address_number: filePayload.CurrentAddress_house_number,
//           village_number: filePayload.CurrentAddress_village_number,
//           village: filePayload.CurrentAddress_village,
//           building: filePayload.CurrentAddress_building,
//           alley: filePayload.CurrentAddress_alley,
//           road: filePayload.CurrentAddress_road,
//           province: filePayload.CurrentAddress_province,
//           district: filePayload.CurrentAddress_district,
//           sub_district: filePayload.CurrentAddress_sup_district,
//           postcode: filePayload.CurrentAddress_postal_code,
//         },
//         contract_emergency: {
//           isenabled: isenabled,
//           filePayload: {
//             personal_realationship: filePayload.Emergency_Relevance,
//             pre_name: filePayload.Emergency_prefix,
//             special_prename: filePayload.Emergency_is_prefix,
//             first_name: filePayload.Emergency_name,
//             last_name: filePayload.Emergency_surname,

//             address_number: filePayload.Emergency_village_number,
//             village_number: filePayload.Emergency_village_number,
//             village: filePayload.Emergency_village,
//             building: filePayload.Emergency_building,
//             alley: filePayload.Emergency_alley,
//             road: filePayload.Emergency_road,
//             province: filePayload.Emergency_province,
//             district: filePayload.Emergency_district,
//             sub_district: filePayload.Emergency_sup_district,
//             postcode: filePayload.Emergency_postal_code,

//             telephone_number: filePayload.Emergency_phone_number,
//             phone_number: filePayload.Emergency_phone_number,
//             email: filePayload.Emergency_email,
//           },
//         },

//         medication_privilege: {
//           privilege_name: '',
//         },

//         general_user_detail: {
//           cigarette_acttivity: {
//             answer: false,
//             detail: '',
//           },
//           alcohol_acttivity: {
//             answer: false,
//             detail: '',
//           },
//           congenital_disease: [],
//           drug_allergy: '',
//         },
//         illness_history: [],
//         referral: {
//           referral_name: '',
//         },
//         vip_agent: {
//           _agentid: null,
//         },
//       },
//     }],
//   };
// };

// const _zeroFill = (incmentNumber = Number, widthZero = Number || 6) => {
//   const moment = require('moment');
//   let yearToday = moment().add(543, 'years').format('YY');
//   let resultZerofill = incmentNumber.toString().padStart(widthZero, '0');
//   return resultZerofill + "/" + yearToday
// };

// const _replaceBitrhDay = (strBitrhday = new String('')) => {
//   if (strBitrhday == null) { return null; }
//   else if (strBitrhday == undefined) { return null; }
//   else if (strBitrhday == '') { return null; }
//   else if (typeof strBitrhday != 'string') { return null; }
//   else {
//     return strBitrhday;
//   };
// };
