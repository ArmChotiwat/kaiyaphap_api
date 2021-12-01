/**
 * misc Controller สำหรับตรวจสอบ Date **(YYYY-MM-DD)** ที่เป็น String **(HH:mm:ss)** กับ Time ที่เป็น String (Promise)
 * 
 ** หากผ่าน จะ return Moment(datetime);
 ** หากไม่ผ่าน จะ callback(err); return;
 */
const checkDateTime_String = async (
    StringDate = String(),
    StringTime = String(),
    callback = (err = new Error) => {}
) => {
    try {
        if (typeof StringDate != 'string') { callback(new Error(`checkDateTime_String: type of StringDate muse be String`)); return; }
        else if (typeof StringTime != 'string') { callback(new Error(`checkDateTime_String: type of StringTime muse be String`)); return; }
        else {
            const moment = require('moment');

            const format_StringDate = 'YYYY-MM-DD';
            const format_StringTime = 'HH:mm:ss';

            if (!moment(StringDate, format_StringDate).isValid()) { callback(new Error(`checkDateTime_String: Validate StringDate failed`)); return; }
            else if (!moment(StringTime, format_StringTime).isValid()) { callback(new Error(`checkDateTime_String: Validate StringTime failed`)); return; }
            else if (!moment(StringDate + ' ' + StringTime, format_StringDate + ' ' + format_StringTime).isValid()) { callback(new Error(`checkDateTime_String: Validate StringDate StringTime failed`)); return; }
            else {
                const ObjectDateTime = moment(StringDate + ' ' + StringTime, format_StringDate + ' ' + format_StringTime);

                callback(null);
                return ObjectDateTime;
            }
        }
    } catch (error) {
        callback(err);
        return;
    }
};

module.exports = {
    checkDateTime_String,
};