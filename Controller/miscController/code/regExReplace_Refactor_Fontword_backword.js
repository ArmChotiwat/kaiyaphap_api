/**
 * Function => regExReplace_Refactor_WhiteSpace
 * 
 * Param => sd (String)
 * 
 * Return => (String)
 * 
 * เมื่อเจอเว้นวรรคหน้าและหลังข้อความ WhiteSpace หน้าและหลังข้อความออก โดยนับการขึ้นบรรทัดใหม่ด้วย แทนเป็น WhiteSpace 1 ครั้ง
 ** ผลลัพธ์ตัวอย่าง
 * (สวัสดี สวัสดี) => (สวัสดี สวัสดี)
 * (     สวัสดี สวัสดี  ) => ( สวัสดี สวัสดี )
 * (สวัสดี  ) => (สวัสดี )
 */
const regExReplace_Refactor_fontword_backword = (stringdata = new String('')) => {
    stringdata = stringdata.replace(new RegExp(/^\s+|\s+$/g), ''); // Refactor Delete WhiteSpace if Detect WhiteSpace Begin and End of Text
    stringdata = stringdata.replace(new RegExp(/^\-+|\-+$/g), ''); // Refactor Delete WhiteSpace if Detect WhiteSpace Begin and End of Text
    stringdata = stringdata.replace(new RegExp(/^\/+|\/+$/g), ''); // Refactor Delete WhiteSpace if Detect WhiteSpace Begin and End of Text
    stringdata = stringdata.replace(new RegExp(/^\.+/g), ''); // Refactor Delete WhiteSpace if Detect WhiteSpace Begin and End of Text
    stringdata = stringdata.replace(new RegExp(/^\,+|\,+$/g), ''); // Refactor Delete WhiteSpace if Detect WhiteSpace Begin and End of Text
    stringdata = stringdata.replace(new RegExp(/^\'+|\'+$/g), ''); // Refactor Delete WhiteSpace if Detect WhiteSpace Begin and End of Text
    return stringdata;
};

module.exports = regExReplace_Refactor_fontword_backword;