const moment = require("moment");

/**
 * Misc - Controller สำหรับแปลง Moment ให้มีรูปแบบดังนี้
 * 
 ** DateTimeObject = Moment Object
 ** Date_String = 'YYYY-MM-DD'
 ** Time_String = 'HH:mm:ss'
 */
const momentFormat = (momentData = moment()) => {
    if (!moment(momentData).isValid()) { momentData = moment(); }
    return {
        DateTimeObject: momentData,
        Date_String: momentData.format('YYYY-MM-DD'),
        Time_String: momentData.format('HH:mm:ss')
    }
};

module.exports = momentFormat;