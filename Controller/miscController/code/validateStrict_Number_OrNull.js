/**
 * 
 * Misc Controller - ตรวจสอบ Number
 ** ถ้าเป็น จะ <return true;> 
 ** ถ้าไม่เป็น จะ <return false;>
 * 
 */
const validateStrict_Number_OrNull = (dataInput = Number(0) || null) => {
    if (dataInput === null) {
        return true;
    }
    else {
        if (typeof dataInput == 'number') {
            return true;
        }
        else { return false; }
    }
};


module.exports = validateStrict_Number_OrNull;