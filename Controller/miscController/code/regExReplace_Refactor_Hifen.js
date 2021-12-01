/**
 * Function => regExReplace_Refactor_Hifen
 * 
 * Param => stringdata (String)
 * 
 * Return => (String)
 * 
 * เมื่อเจอ - จะลบ WhiteSpace ด้านซ้าย และด้านขวา ออกไป
 ** ผลลัพธ์ตัวอย่าง
 * (    -สวัสดี) => (-สวัสดี)
 * (สวัสดี-     ) => (สวัสดี-)
 * (  -   สวัสดี-  ) => (-สวัสดี-)
 */
const regExReplace_Refactor_Hifen = (stringdata = new String('')) => {
    stringdata = stringdata.replace(new RegExp(/ +\-/g),'-'); // Clear Whitespace if Detect /
    stringdata = stringdata.replace(new RegExp(/\- +/g),'-'); // Clear Whitespace if Detect /
    return stringdata;
};

module.exports = regExReplace_Refactor_Hifen;