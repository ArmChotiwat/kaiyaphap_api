/**
 * ฟังชั่น จำจัดตัวเลขออก ตัวเลยทุกตัวจะถูกลบออก
 ** ถ้าผ่าน return ชุดข้อความที่ไม่มีตัวเลข
 ** ถ้าไม่ผ่าน return ;
 */
const regExReplace_SelectOnlyNumber_Not = (
    stringData = new String(''),
    callback = (err = new Error) => {}
) => {
    try {
        const oldString = stringData;
        const Reg_Exp_Only_Number = /[0123456789]/ig
        const newString = oldString.replace(Reg_Exp_Only_Number, '');
        callback(null);
        return newString;
    } catch (error) {
        callback(err);
        return;
    }
};

module.exports = regExReplace_SelectOnlyNumber_Not;