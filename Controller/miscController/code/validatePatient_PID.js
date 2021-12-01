/**
 * Misc Controller สำหรับ ตรวจสอบ PID (ปชช) หรือ เปอร์โทร ว่าที่อยู่ในระบบหรือไม่ 
 ** Ex => await validate_patient_pid(_storeid,identity_card,(err) => { if (err) { callback(err); return; } })
 ** ถ้ามีอย่เเล้ว จะ return false
 ** ถ้าไม่มี จะ return true
 */
const validate_patient_pid = async (
    _storeid = String(),
    identity_card = String(),
    callback = (err = new Error) => { }
) => {
    const checkObjectId = require('./checkObjectId')
    const storeid = await checkObjectId(_storeid, (err) => { if (err) { callback(err); return; } });
    if (!storeid) {
        callback(new Error(`_storeid`)); return;
    } else {
        const patientPIDModel = require('../../mongodbController').patientPIDModel;
        const checkPIDExists = await patientPIDModel.find(
            {
                '_ref_storeid': storeid,
                'identity_card': identity_card
            },
            {},
            (err) => { if (err) { callback(new Error(`find patientPIDModel Error`)); return; } }
        );

        if(checkPIDExists.length === 0){
            return true;
        }else{
            return false;
        }
    }
};

module.exports = validate_patient_pid;