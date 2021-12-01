const checkStore = async (data = {_storeid: new String('')}, callback = (err = new Error) => {} ) => {

    const mongodbController = require('../../mongodbController');
    const storeModel = mongodbController.storeModel;
    const checkObjectId = mongodbController.checkObjectId;
    const validateObjectId = mongodbController.validateObjectId;
    
    if(typeof data != 'object') { callback(new Error('checkStore: <data> must be Object')); return; }
    else if(typeof data._storeid != 'string' || data._storeid == '') { callback('checkStore: <data._storeid> must be String and Not Empty'); return; }
    else if(!(validateObjectId(data._storeid))) { callback('checkStore: <data._storeid> Validate Failed'); return; }
    else {
        const _storeid = await checkObjectId(data._storeid, (err) => { callback(err); return; });
        const findStoreExists = await storeModel.find(
            {
                '_id': _storeid
            },
            (err) => {
                if(err) {
                    callback(err);
                    return;
                }
            }
        );
        if(!findStoreExists || findStoreExists.length != 1) { callback(null); return false; }
        else { callback(null); return true; }
    }
};

module.exports = checkStore;