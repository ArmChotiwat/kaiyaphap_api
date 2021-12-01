/**
 * ฟังชั่น ตรวจสอบ Email เป้นไปตามกฏของชื่อ Email หรือไม่ 
 ** ถ้า จริง return ture
 ** ถ้า ไม่จริง return false
 */
const validateEmail = (
    stringData = new String('')
) => {
    try {
        const oldString = stringData;
        const start_end_string_only = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi
        const found = oldString.match(start_end_string_only)
        if (!found) { return false; }
        else if (found.length !== 1) { return false; }
        else {
            return true
        }

    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = validateEmail;