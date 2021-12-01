/**
 * Function => regExReplace_Refactor_comma
 * 
 * Param => stringdata (String)
 * 
 * Return => (String)
 * 
 * เมื่อเจอลูกน้ำ จะลบ WhiteSpace (เว้นวรรค) ด้านซ้าย และด้านขวา ลูกน้ำออกไป แล้วเติมเพียงแค่ คอมม่า 
 ** ผลลัพธ์ตัวอย่าง
 * (สวัสดี,สวัสดี) => (สวัสดี, สวัสดี)
 * (สวัสดี ,สวัสดี) => (สวัสดี, สวัสดี)
 * (สวัสดี , ) => (สวัสดี,)
 */
const regExReplace_Refactor_Comma = (stringdata = new String('')) => {
    stringdata = stringdata.replace(new RegExp(' +\,', 'g'), ','); // Refactor Whitespace if Detect ,
    stringdata = stringdata.replace(new RegExp('\, +', 'g'), ', '); // Refactor Whitespace if Detect ,
    return stringdata;
};

module.exports = regExReplace_Refactor_Comma;