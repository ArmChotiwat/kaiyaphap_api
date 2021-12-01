/**
 * misc Controller สำหรับ ตรวจรับ ค่า String (ที่ไม่ใช่ค่าว่าง) เท่านั้น
 * 
 ** หากผ่าน จะ return true
 ** หากไม่ผ่าน จะ return false
 */
const validate_String_AndNotEmpty = (dataInput = '') => {
    const rega = /[\s|\ ]/ig
    if (typeof dataInput != 'string') { return false; }
    else if (dataInput.replace(rega, '') == '') { return false; }
    else if (!dataInput) { return false; }
    else {
        return true;
    }
};

module.exports = validate_String_AndNotEmpty;