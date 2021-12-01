/**
 * Misc Controller สำหรับตรวจสอบ เลขหมู่บ้าน ที่สำามารถเป็นค่า Null ได้
 ** ผ่าน (true)
 ** ไม่ผ่าน (false)
 */
const validateVillageNumber_OrNull = (inputData = 0) => {
    try {
        if (inputData === null) {
            return true;
        }
        else if (!Number.isInteger(inputData)) { return false; }
        else if (inputData <= 0) { return false; }
        else {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = validateVillageNumber_OrNull;