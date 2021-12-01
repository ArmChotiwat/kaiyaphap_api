const checkBirthDateVaild = (birthDateString = new String('')) => {
  const moment = require('moment');
  if (typeof birthDateString != 'string' || birthDateString == '') { return false; }
  if (birthDateString.length != 10) { return false; }
  const splitCheck = (birthDateString.split('/').length === 3) ? true : false; // true is Valid, false is Not Valid
  const checkDate = moment(birthDateString, 'YYYY/MM/DD').isValid(); // true is Valid, false is Not Valid
  if (splitCheck && checkDate) { return true; } // BirthDate is Valid
  else { return false; } // BirthDate is NOT Valid
};

const registerPatinetMiddleware_save = async (req, res, next) => {
  const patientPhoneNumberModel = require('../../../Controller/mongodbController').patientPhoneNumberModel;
  const patientPIDModel = require('../../../Controller/mongodbController').patientPIDModel;
  const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty, checkObjectId,checkNull,validate_patient_phonenumber,validate_patient_pid } = require('../../../Controller/miscController')

  const checkThailandPersonalIdValid = (thaipersonalid = new String('')) => {
    if (typeof thaipersonalid != 'string' || thaipersonalid == '') {
      if (isNaN(parseInt(thaipersonalid))) { return false; }
      else if (thaipersonalid.length != 13) { return false; }
      else if (parseInt(thaipersonalid[0]) === 0) { return false; }
      else { return true; }
    }
  };
  try {

    let ErrorJson = {
      http_code: 400,
      document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
      description: []
    };

    const payload = req.body;
    if (!validate_StringObjectId_NotNull(payload.store[0]._storeid)) { ErrorJson.description.push(`<_storeid> must be String ObjectId and Not Empty`); }
    if (typeof payload.store[0].personal === 'object') { ErrorJson.description.push(`<personal> must be Object and Not Empty`); }
    if (!validate_String_AndNotEmpty(payload.store[0].personal.pre_name)) { ErrorJson.description.push(`<pre_name> must be String and Not Empty`); }
    if (!validate_String_AndNotEmpty(payload.store[0].personal.first_name)) { ErrorJson.description.push(`<first_name> must be String and Not Empty`); }
    if (!validate_String_AndNotEmpty(payload.store[0].personal.last_name)) { ErrorJson.description.push(`<last_name> must be String and Not Empty`); }
    if (!validate_String_AndNotEmpty(payload.store[0].personal.phone_number)) { ErrorJson.description.push(`<phone_number> must be String and Not Empty`); }
    if (!validate_String_AndNotEmpty(payload.store[0].personal.birth_date)) {
      if (!checkBirthDateVaild(payload.store[0].personal.birth_date)) { ErrorJson.description.push(`<birth_date> must be String and Not Empty`); }
    }
    if (typeof payload.store[0].personal.identity_card === 'object') {
      if (typeof payload.store[0].personal.identity_card.ctype != 'boolean') { ErrorJson.description.push(`<identity_card.ctype> must be String and Not Empty`); }
      if (!validate_String_AndNotEmpty(payload.store[0].personal.identity_card.id)) { ErrorJson.description.push(`<identity_card.id> must be String and Not Empty`); }
    } else {
      ErrorJson.description.push(`<identity_card> must Object and Not Empty`);
    }

    const _storeid = await checkObjectId(payload.store[0]._storeid, (err) => { if (err) { callback(err); return; } });
    if (await checkNull(payload.store[0].register_from_branch,(err) => { if (err) { callback(err); return; } })  !== null) {
      const validateObjectId_register_from_branch = await checkObjectId(payload.store[0].register_from_branch, (err) => { if (err) { callback(err); return; } });
      if (!validateObjectId_register_from_branch) { ErrorJson.description.push(`<register_from_branch> must be String ObjectId and Not Empty`); }
    }
    if (await checkNull(store[0].personal.identity_card.id,(err) => { if (err) { callback(err); return; } }) !== null) {
      const checkPersonalIdCardExists = await validate_patient_pid(_storeid, payload.store[0].personal.identity_card.id, (err) => { if (err) { callback(err); return; } })
      if (checkPersonalIdCardExists === false) { ErrorJson.description.push(`<patientPIDModel> can't identity_card`); }
    }
    if (await checkNull(payload.store[0].personal.phone_number,(err) => { if (err) { callback(err); return; } })  !== null) {
      const checkPhoneNumberExists = await validate_patient_phonenumber(_storeid, payload.store[0].personal.phone_number, (err) => { if (err) { callback(err); return; } })
      if (checkPhoneNumberExists === false) { ErrorJson.description.push(`<patientModel> can't phone_number`); }
    }
    

    if (ErrorJson.description.length != 0) {
      res.status(400).json(ErrorJson).end();
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

module.exports = registerPatinetMiddleware_save