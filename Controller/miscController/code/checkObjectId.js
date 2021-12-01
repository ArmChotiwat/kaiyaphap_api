/**
 ** ตั่วอย่างการใช้
 ** const ex = await checkObjectId(data, (err) => { if (err) { callback(err); return; } });
 */
const checkObjectId = async (getData, callback = (err = new Error) => { }) => {
    try {
        const mongoose = require('../../mongodbController').mongoose;
        const checkObjId = mongoose.Types.ObjectId(getData);
        callback(null);
        return checkObjId;
    } catch (error) {
        callback(error);
        return;
    }
};

module.exports = checkObjectId;