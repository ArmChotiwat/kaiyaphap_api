const listAllAmphureThailand = async (callback = (err = new Error) => {}) => {
    const amphureModel = require('../../mongodbController').amphureModel;
    
    const amphureAllData = await amphureModel.find((err) => { if(err) { callback(err); return; } });
    if (!amphureAllData) {
        callback(null);
        return;
    }
    else {
        callback(null);
        return amphureAllData;
    }
};

module.exports = listAllAmphureThailand;