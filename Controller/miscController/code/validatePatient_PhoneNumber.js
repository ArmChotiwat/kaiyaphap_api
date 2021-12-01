/**
 * Misc Controller สำหรับ ตรวจสอบ เบอร์โทร ว่าที่อยู่ในระบบหรือไม่ 
 ** Ex => await validate_patient_phonenumber(_storeid,phone_number,(err) => { if (err) { callback(err); return; } })
 ** ถ้ามีอย่เเล้ว จะ return false
 ** ถ้าไม่มี จะ return true
 */
const validate_patient_phonenumber = async (
    _storeid = String(),
    phone_number = String(),
    callback = (err = new Error) => { }
) => {
    const checkObjectId = require('./checkObjectId')
    const storeid = await checkObjectId(_storeid, (err) => { if (err) { callback(err); return; } });
    if (!storeid) {
        callback(new Error(`_storeid`)); return;
    } else {
        const patientphonenumberModel = require('../../mongodbController').patientphonenumberModel;
        const checkPhoneNumberExists = await patientphonenumberModel.find(
            {
                '_ref_storeid': storeid,
                'phone_number': phone_number
            },
            {},
            (err) => { if (err) { callback(new Error(`find patientphonenumberModel Error`)); return; } }
        );
        if (checkPhoneNumberExists.length === 0) {
            return true;
        } else {
            return false;
        }
    }
};

module.exports = validate_patient_phonenumber;