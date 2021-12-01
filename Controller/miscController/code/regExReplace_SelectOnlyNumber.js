/**
 * ฟังชั่น กำจัดข้อความที่ไม่ใช่ ตัวเลขออก 
 ** ถ้าผ่าน return ชุดข้อความที่เป็นเฉพาะตัวเลข  
 ** ถ้าไม่ผ่าน return ;
 */
const regExReplace_SelectOnlyNumber = (
    stringData = new String(''),
    callback = (err = new Error) => {}
) => {
    try {
        const oldString = stringData;
        const Reg_Exp_Only_Number = /[^0123456789]/ig
        const newString = oldString.replace(Reg_Exp_Only_Number, '');
        callback(null);
        return newString;
    } catch (error) {
        callback(err);
        return;
    }
};

module.exports = regExReplace_SelectOnlyNumber;