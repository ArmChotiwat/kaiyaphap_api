/**
 * Misc Controller สำหรับ ตรวจสอบค่า น้ำหนัก หรือส่วนสูง (เป็นค่า Null ได้)
 ** ผ่าน (true)
 ** ไม่ผ่าน (false)
 */
const validateWeightHeight_OrNull = (dataInput = 0) => {
    try {
        if (dataInput === null) {
            return true;
        }
        else if (typeof dataInput != 'number') { return false; }
        else if (dataInput <= 0) { return false; }
        else {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = validateWeightHeight_OrNull;