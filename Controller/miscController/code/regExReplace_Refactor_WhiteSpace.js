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
const regExReplace_Refactor_WhiteSpace = (stringdata = new String('')) => {
    const RegExp_WhiteSpace = /\s+\s/g;
    const RegExp_WhiteSpace_Begin_end = /^\s+|\s+$/g;
    stringdata = stringdata.replace(RegExp_WhiteSpace, ' '); // Refactor WhiteSpace if Detect WhiteSpace
    stringdata = stringdata.replace(RegExp_WhiteSpace_Begin_end, ''); // Refactor Delete WhiteSpace if Detect WhiteSpace Begin and End of Text
    return stringdata;
};

module.exports = regExReplace_Refactor_WhiteSpace;