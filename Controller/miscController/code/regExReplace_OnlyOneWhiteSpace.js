/**
 * Function => regExReplace_OnlyOneWhiteSpace
 * 
 * Param => sd (String)
 * 
 * Return => (String)
 * 
 * เปลี่ยน WhiteSpace และบรรทัดใหม่ เป็น WhiteSpace 1 ครั้ง
 ** ผลลัพธ์ตัวอย่าง
 * (สวัสดี สวัสดี) => (สวัสดี สวัสดี)
 * (     สวัสดี สวัสดี  ) => ( สวัสดี สวัสดี )
 * (สวัสดี  ) => (สวัสดี )
 */
const regExReplace_OnlyOneWhiteSpace = (stringdata = new String('')) => {
    stringdata = stringdata.replace(new RegExp(/\s+\s/, 'g'), ' '); // Refactor to WhiteSpace if Detect WhiteSpace and new line
    return stringdata;
};

module.exports = regExReplace_OnlyOneWhiteSpace;