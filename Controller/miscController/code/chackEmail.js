/**
 * ฟังชั่น แปลง Email ให้เป็น ตัวอักษรพิมพ์ เล็กทั้งหมด 
 ** ถ้า จริง return email อักษรพิมพ์เล็ก 
 ** ถ้า ไม่จริง return;
 */
const chackEmail = async (getData = '', callback = (err = new Error) => { }) => {
    try {        
        const validateEmail = require('./validateEmail')
        const chack_Email_befor = validateEmail(getData)
        if (chack_Email_befor === false) { callback(new Error(`Fomat Email Error`)); return; }
        else {
            let Email_name = getData.toLowerCase()
            const chack_Email_after = validateEmail(Email_name)
            if (chack_Email_after === true) {
                callback(null);
                return Email_name;
            } else {
                callback(new Error(`Email To Lower Case fales`))
                return;
            }
        }
    } catch (error) {
        callback(error);
        return;
    }
};

module.exports = chackEmail;