/**
 * Function => regExReplace_ClearWhiteSpace
 * 
 * Param => sd (String)
 * 
 * Return => (String)
 * 
 * เมื่อเจอเว้นวรรคหน้าและหลังข้อความ จะลบ WhiteSpace ข้อความ และบันทัดใหม่ออก
 ** ผลลัพธ์ตัวอย่าง
 * (สวัสดี สวัสดี) => (สวัสดีสวัสดี)
 * (     สวัสดี สวัสดี  ) => (สวัสดีสวัสดี)
 * (สวัสดี  ) => (สวัสดี)
 * @param {String} stringdata
 */
const regExReplace_ClearWhiteSpace = (stringdata) => {
    stringdata = stringdata.replace(/\s/g, '');
    return stringdata;
};

module.exports = regExReplace_ClearWhiteSpace;