/**
 * Function => regExReplace_Refactor_Bracket
 * 
 * Param => stringdata (String)
 * 
 * Return => (String)
 * 
 * เมื่อเจอวงเล็บ จะลบ WhiteSpace (เว้นวรรค) ด้านซ้าย และด้านขวา ออกไป
 ** ผลลัพธ์ตัวอย่าง
 * (    สวัสดี) => (สวัสดี)
 * (สวัสดี     ) => (สวัสดี)
 * (     สวัสดี  ) => (สวัสดี)
 */
const regExReplace_Refactor_Bracket = (stringdata = new String('')) => {
    stringdata = stringdata.replace(new RegExp(/\( +/, 'g'), '('); // Refactor Whitespace if Detect (
    stringdata = stringdata.replace(new RegExp(/ +\)/, 'g'), ')'); // Refactor Whitespace if Detect )
    return stringdata;
};

module.exports = regExReplace_Refactor_Bracket;