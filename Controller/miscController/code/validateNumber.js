/**
 * Misc Controller สำหรับตรวจค่า Number
 */
const validateNumber = (dataInput = Number(0) || String('') ) => {
    if (typeof dataInput == 'number') {
        return true;
    }
    else if (typeof dataInput == 'string') {
        if (!isNaN(dataInput)) {
            return true;
        }
        else { return false; }
    }
    else { return false; }
};

module.exports = validateNumber;