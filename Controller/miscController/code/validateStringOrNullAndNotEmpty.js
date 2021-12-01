/**
 * misc Controller สำหรับ ตรวจรับ ค่า Null และ String (ที่ไม่ใช่ค่าว่าง) เท่านั้น
 * 
 ** หากผ่าน จะ return true
 ** หากไม่ผ่าน จะ return false
 */
const validate_StringOrNull_AndNotEmpty = (dataInput = null || String('')) => {
    const regA = /[\s|\ ]/ig
    
    if (dataInput !== null) {
        if (typeof dataInput != 'string') { return false; }
        else if (dataInput.replace(regA, '') == '') { return false; }
        else if (!dataInput) { return false; }
        else {
            return true;
        }
    }
    else {
        return true;
    }
};

module.exports = validate_StringOrNull_AndNotEmpty;