/**
 * Function => regExReplace_Refactor_Percent
 * 
 * Param => stringdata (String)
 * 
 * Return => (String)
 * 
 * เมื่อ % จะลบ WhiteSpace (เว้นวรรค) ด้านซ้าย ออกไป
 ** ผลลัพธ์ตัวอย่าง
 * (    %สวัสดี) => (%สวัสดี)
 * (สวัสดี%     ) => (สวัสดี%     )
 * (  %   สวัสดี%  ) => (%   สวัสดี%)
 */
const regExReplace_Refactor_Percent = (stringdata = new String('')) => {
    stringdata = stringdata.replace(new RegExp(/\s+\%/, 'g'), '%'); // Clear Whitespace if Detect /
    return stringdata;
};

module.exports = regExReplace_Refactor_Percent;