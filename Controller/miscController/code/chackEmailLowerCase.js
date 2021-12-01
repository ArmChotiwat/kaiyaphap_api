/**
 * ฟังชั่น แปลง Email ให้เป็น ตัวอักษรพิมพ์ เล็กทั้งหมด 
 ** ถ้า จริง return email อักษรพิมพ์เล็ก 
 ** ถ้า ไม่จริง return;
 */
const chackEmailLowerCase = async (getData = '', callback = (err = new Error) => { }) => {
    try {
        const validateStringAndNotEmpty = require('./validateStringAndNotEmpty')
        if (!validateStringAndNotEmpty(getData)) {callback(new Error(`must be String and Not Empty`)); return;}
        else{
            let Email_name = getData.toLowerCase()
            if(Email_name){
                callback(null);
                return Email_name;
            }else{
                callback(new Error(`getData to Lower Case error`));
                return;
            }
        }
    } catch (error) {
        callback(error);
        return;
    }
};

module.exports = chackEmailLowerCase;