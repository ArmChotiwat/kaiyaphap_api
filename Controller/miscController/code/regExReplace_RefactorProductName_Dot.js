/**
 * Function => regExReplace_RefactorProductName_Dot
 * 
 * Param => stringdata (String)
 * 
 * Return => (String)
 * 
 * เมื่อเจอวงเล็บ จะลบ WhiteSpace (เว้นวรรค) ด้านซ้าย และด้านขวา ออกไป
 ** ผลลัพธ์ตัวอย่าง
 * (    .สวัสดี) => (.สวัสดี)
 * (สวัสดี.     ) => (สวัสดี.)
 * (  .   สวัสดี.  ) => (.สวัสดี.)
 */
const regExReplace_RefactorProductName_Dot = (stringdata = new String('')) => {
    stringdata = stringdata.replace(new RegExp(/ +\./, 'g'), '.'); // Clear Whitespace if Detect .
    stringdata = stringdata.replace(new RegExp(/\. +/, 'g'), '.'); // Clear Whitespace if Detect .
    return stringdata;
};

module.exports = regExReplace_RefactorProductName_Dot;