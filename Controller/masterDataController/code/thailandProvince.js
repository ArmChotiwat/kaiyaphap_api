const listAllProvinceThailand = async (callback = (err = new Error) => {}) => {
    const provinceModel = require('../../mongodbController').provinceModel;

    const provinceAllData = await provinceModel.find((err) => { if(err) { callback(err); return; } });
    if (!provinceAllData) {
        callback(null);
        return;
    }
    else {
        callback(null);
        return provinceAllData;
    }
};

module.exports = listAllProvinceThailand;