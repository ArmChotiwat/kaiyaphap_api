/**
 * 
 * จะทำการตรวจสอบ ObjectId ที่เป็น String 
 ** ถ้าเป็น จะ <return true;> 
 ** ถ้าไม่เป็น จะ <return false;>
 * 
 */
const validateObjectId = (getData = new String('')) => {
    try {
        getData = getData.toString();
        const ObjectId = require('../../mongodbController').mongoose.Types.ObjectId;
        const doConvertData = ObjectId(getData);
        if(doConvertData) { return true; }
        else { return false; }
    } catch (error) {
        return false;
    }
};

module.exports = validateObjectId;