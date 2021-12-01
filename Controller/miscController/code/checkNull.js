/**
 * Misc Controller สำหรับ null 
 ** Ex => await checkNull(_null)
 ** ถ้าควรเป็น null จะ return null
 ** ถ้าไม่ควรเป็น null จะ return ค่าเดิมที่ส่งเข้ามา
 * @param {String|Number|null} _null
 */
const check_Null = async (
    _null,
    callback = (err = new Error) => { }
) => {
    try {
        const regA = /[\s|\ ]/ig
        if (_null === null) {
            return null;
        } else if (typeof _null == 'string') {
            if (_null === 'null') {
                return null;
            } else if (_null.replace(regA, '') == '') {
                return null;
            } else if (!_null) {
                return null;
            } else {
                return _null;
            }
        } else if (typeof _null == 'number') {
            return _null
        } else {
            return null;
        }
    } catch (error) {
        callback(error);
        return null;
    }

};

module.exports = check_Null;