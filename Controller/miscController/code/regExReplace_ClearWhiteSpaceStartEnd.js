/**
 * Function => regExReplace_ClearWhiteSpaceStartEnd
 * 
 * Param => sd (String)
 * 
 * Return => (String)
 * 
 * เมื่อเจอเว้นวรรคหน้าและหลังข้อความ ลบ WhiteSpace หน้า-หลังข้อความ และบันทัดใหม่ออก
 ** ผลลัพธ์ตัวอย่าง
 * (สวัสดี สวัสดี) => (สวัสดี สวัสดี)
 * (     สวัสดี สวัสดี  ) => ( สวัสดี สวัสดี )
 * (สวัสดี  ) => (สวัสดี )
 * @param {String} stringdata
 */
const regExReplace_ClearWhiteSpaceStartEnd = (stringdata) => {
    const RegEx_Replace = /^\s+|\s+$/ig
    stringdata = stringdata.replace(RegEx_Replace, ''); // Refactor Delete WhiteSpace if Detect WhiteSpace Begin and End of Text
    return stringdata;
};

module.exports = regExReplace_ClearWhiteSpaceStartEnd;