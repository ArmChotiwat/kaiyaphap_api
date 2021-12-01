const listAllDistrictThailand = async (callback = (err = new Error) => {}) => {
    const districtModel = require('../../mongodbController').districtModel;

    const districtAllData = await districtModel.find((err) => { if(err) { callback(err); return; } });
    if (!districtAllData) {
        callback(null);
        return;
    }
    else {
        callback(null);
        return districtAllData;
    }
};

module.exports = listAllDistrictThailand;