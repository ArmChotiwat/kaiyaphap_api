/**
 * misc Controller สำหรับตรวจสอบ และเปรียบเทียบ DateTime ที่เป็น Object กับ Date **(YYYY-MM-DD)** ที่เป็น String และ Time **(HH:mm:ss)** ที่เป็น String
 * 
 ** หากผ่าน จะ return true
 ** หากไม่ผ่าน จะ return false
 */
const validateDateTime_Object_String = (
    ObjectDateTime = new Date(),
    StringDate = String(),
    StringTime = String()
) => {
    try {
        if (typeof StringDate != 'string') { return false; }
        else if (typeof StringTime != 'string') { return false; }
        else {
            const moment = require('moment');

            const format_StringDate = 'YYYY-MM-DD';
            const format_StringTime = 'HH:mm:ss';

            if (typeof ObjectDateTime == 'object') {
                if(!moment(ObjectDateTime).isValid()) { return false; }
                else if (!moment(StringDate, format_StringDate).isValid()) { return false; }
                else if (!moment(StringTime, format_StringTime).isValid()) { return false; }
                else if (!moment(StringDate + ' ' + StringTime, format_StringDate + ' ' + format_StringTime).isValid()) { return false; }
                else {
                    const ObjDateTime = moment(ObjectDateTime).format('YYYY-MM-DD HH:mm:ss');
                    const StringDateTime = moment(StringDate + ' ' + StringTime, format_StringDate + ' ' + format_StringTime).format('YYYY-MM-DD HH:mm:ss');
                    
                    if (ObjDateTime === StringDateTime) {
                        return true;
                    }
                    else { return false; }
                }
            }
            else if (typeof ObjectDateTime == 'string') { return false; }
            else { return false; }
        }
    } catch (error) {
        return false;
    }
};


/**
 * misc Controller สำหรับตรวจสอบ Date **(YYYY-MM-DD)** ที่เป็น String **(HH:mm:ss)** กับ Time ที่เป็น String
 * 
 ** หากผ่าน จะ return true
 ** หากไม่ผ่าน จะ return false
 */
const validateDateTime_String = (
    StringDate = String(),
    StringTime = String()
) => {
    try {
        if (typeof StringDate != 'string') { return false; }
        else if (typeof StringTime != 'string') { return false; }
        else {
            const moment = require('moment');

            const format_StringDate = 'YYYY-MM-DD';
            const format_StringTime = 'HH:mm:ss';

            if (!moment(StringDate, format_StringDate, true).isValid()) { return false; }
            else if (!moment(StringTime, format_StringTime, true).isValid()) { return false; }
            else if (!moment(StringDate + ' ' + StringTime, format_StringDate + ' ' + format_StringTime, true).isValid()) { return false; }
            else {
                return true;
            }
        }
    } catch (error) {
        return false;
    }
};


/**
 * misc Controller สำหรับตรวจสอบ Date **(YYYY-MM-DD)** ที่เป็น String
 * 
 ** หากผ่าน จะ return true
 ** หากไม่ผ่าน จะ return false
 */
const validateDate_String = (
    StringDate = String(),
) => {
    try {
        if (typeof StringDate != 'string') { return false; }
        else {
            const moment = require('moment');

            const format_StringDate = 'YYYY-MM-DD';

            if (!moment(StringDate, format_StringDate, true).isValid()) { return false; }
            else {
                return true;
            }
        }
    } catch (error) {
        return false;
    }
};


/**
 * misc Controller สำหรับตรวจสอบ Time **(HH:mm:ss)** ที่เป็น String
 * 
 ** หากผ่าน จะ return true
 ** หากไม่ผ่าน จะ return false
 */
const validateTime_String = (
    StringTime = String(),
) => {
    try {
        if (typeof StringTime != 'string') { return false; }
        else {
            const moment = require('moment');

            const format_StringTime = 'HH:mm:ss';

            if (!moment(StringTime, format_StringTime, true).isValid()) { return false; }
            else {
                return true;
            }
        }
    } catch (error) {
        return false;
    }
};

module.exports = {
    validateDateTime_Object_String,
    validateDateTime_String,
    validateDate_String,
    validateTime_String,
};