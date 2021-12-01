/**
 * misc Controller สำหรับ รับข้อมูล วัน/เวลา (Moment Libary) ดังนี้
 ** ***currentDateTime_Object*** คือ Object DateTime (Moment)
 ** ***currentDate_String*** คือ วัน ที่เป็น String => YYYY-MM-DD
 ** ***currentTime_String*** คือ เวลา ที่เป็น String => HH:mm:ss
 */
const currentDateTime = () => {
    const { UTC_Offset, Date_String, Time_String } = require('../../../Config/cfg_DateTime');
    const moment = require('moment');
    
    const currentDateTime_Object = moment().utcOffset(UTC_Offset);
    const currentDate_String = currentDateTime_Object.format(Date_String);
    const currentTime_String = currentDateTime_Object.format(Time_String);

    return {
        currentDateTime_Object,
        currentDate_String,
        currentTime_String
    }
};

module.exports = currentDateTime;