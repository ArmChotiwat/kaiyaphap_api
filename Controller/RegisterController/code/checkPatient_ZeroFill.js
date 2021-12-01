const checkPatient_ZeroFill = async (incmentNumber = 1, widthZero = 6, callback = (err = new Error) => {}) => {
    const controllerName = `checkPatient_ZeroFill`;

    const moment = require('moment');
    const { validateNumber } = require('../../miscController');

    try {
        if (!validateNumber(incmentNumber) || incmentNumber <= 0) { callback(new Error(`${controllerName}: incmentNumber must be Number and morethan 0`)); return; }
        else if (!validateNumber(widthZero) || widthZero <= 0) { callback(new Error(`${controllerName}: incmentNumber must be Number and morethan 0`)); return; }
        else {
            const yearToday = moment().add(543, 'years').format('YY');
            const resultZerofill = Math.ceil(incmentNumber).toString().padStart(Math.ceil(widthZero), '0');
            return resultZerofill + "/" + yearToday;
        }
    } catch (error) {
        callback(error);
        return;
    }
};

module.exports = checkPatient_ZeroFill;