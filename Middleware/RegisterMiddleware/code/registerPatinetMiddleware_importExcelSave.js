const checkBirthDateVaild = (birthDateString = new String('')) => {
  const moment = require('moment');
  if (typeof birthDateString != 'string' || birthDateString == '') { return false; }
  if (birthDateString.length != 10) { return false; }
  const splitCheck = (birthDateString.split('/').length === 3) ? true : false; // true is Valid, false is Not Valid
  const checkDate = moment(birthDateString, 'YYYY/MM/DD').isValid(); // true is Valid, false is Not Valid
  if (splitCheck && checkDate) { return true; } // BirthDate is Valid
  else { return false; } // BirthDate is NOT Valid
};
const registerPatinetMiddleware_importExcelSave = async (req, res, next) => {
  const { checkObjectId, validate_patient_pid, validate_patient_phonenumber,validate_String_AndNotEmpty,checkNull } = require('../../../Controller/miscController')
  const _storeid = await checkObjectId(payload.store[0]._storeid, (err) => { if (err) { callback(err); return; } });

  const payload = req.body;
  const ErrorJson = {
    http_code: 400,
    document_code: 40020100301,
    description: []
  };
  if (typeof payload.username != 'string' || payload.username == '') {
    ErrorJson.description.push(`username must be String and is NOT Empty`)
  }
  if (typeof payload.store[0]._storeid != 'string' || payload.store[0]._storeid == '') {
    ErrorJson.description.push(`store._storeid must be String and is NOT Empty`)
  }
  if (typeof payload.store[0].personal != 'object') {
    ErrorJson.description.push(`store.personal must be Object`)
  }
  if (typeof payload.store[0].personal.pre_name != 'string' || payload.store[0].pre_name == '') {
    ErrorJson.description.push(`store.personal.pre_name must be String and is NOT Empty`)
  }
  if (typeof payload.store[0].personal.first_name != 'string' || payload.store[0].first_name == '') {
    ErrorJson.description.push(`store.personal.first_name must be String and is NOT Empty`)
  }
  if (typeof payload.store[0].personal.last_name != 'string' || payload.store[0].last_name == '') {
    ErrorJson.description.push(`store.personal.last_name must be String and is NOT Empty`)
  }
  if (typeof payload.store[0].personal.birth_date == 'string' && payload.store[0].personal.birth_date != '') {
    if (checkBirthDateVaild(payload.store[0].personal.birth_date) === false) {
      ErrorJson.description.push(`store.personal.birth_date is not valid 'YYYY/MM/DD' => 2020/05/01 `)
    }
  }
  if (typeof payload.store[0].personal.identity_card === 'object') {
    if (typeof payload.store[0].personal.identity_card.ctype != 'boolean') { ErrorJson.description.push(`<identity_card.ctype> must be String and Not Empty`); }
    if (!validate_String_AndNotEmpty(payload.store[0].personal.identity_card.id)) { ErrorJson.description.push(`<identity_card.id> must be String and Not Empty`); }
  } else {
    ErrorJson.description.push(`<identity_card> must Object and Not Empty`);
  }
  if (!validate_String_AndNotEmpty(payload.store[0].personal.phone_number)) { ErrorJson.description.push(`<phone_number> must be String and Not Empty`); }

  if (ErrorJson.description.length !== 0) {
    res.status(400).json(ErrorJson).end()
  }
  else {

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
  }


};
module.exports = registerPatinetMiddleware_importExcelSave