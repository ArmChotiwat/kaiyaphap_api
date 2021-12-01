/**
 * Function => regExReplace_RefactorProductName_WhiteSpace
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
const regExReplace_RefactorProductName_WhiteSpace = (stringdata = new String('')) => {
    stringdata = stringdata.replace(/\s+\s/g, ' '); // Refactor WhiteSpace if Detect WhiteSpace
    stringdata = stringdata.replace(/^\s+|\s+$/g, ''); // Refactor Delete WhiteSpace if Detect WhiteSpace Begin and End of Text
    return stringdata;
};

module.exports = regExReplace_RefactorProductName_WhiteSpace;