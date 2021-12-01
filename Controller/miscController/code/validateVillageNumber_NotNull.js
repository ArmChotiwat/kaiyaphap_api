/**
 * Misc Controller สำหรับตรวจสอบ เลขหมู่บ้าน ที่เป็นค่า Null ไม่ได้
 ** ผ่าน (true)
 ** ไม่ผ่าน (false)
 */
const validateVillageNumber_NotNull = (inputData = 0) => {
    try {
        if (!Number.isInteger(inputData)) { return false; }
        else if (inputData <= 0) { return false; }
        else {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = validateVillageNumber_NotNull;