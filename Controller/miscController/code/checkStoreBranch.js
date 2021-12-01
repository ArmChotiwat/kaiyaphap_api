const checkStoreBranch = async (data = {_storeid: new String(''), _branchid: new String('')}, callback = (err = new Error) => {} ) => {

    const mongodbController = require('../../mongodbController');
    const storeModel = mongodbController.storeModel;
    const checkObjectId = mongodbController.checkObjectId;
    const validateObjectId = mongodbController.validateObjectId;

    if(typeof data != 'object') { callback(new Error('checkStoreBranch: <data> must be Object')); return; }
    else if(typeof data._storeid != 'string' || data._storeid == '') { callback('checkStoreBranch: <data._storeid> must be String and Not Empty'); return; }
    else if(!validateObjectId(data._storeid)) { callback('checkStoreBranch: <data._storeid> Validate Failed'); return; }
    else if(typeof data._branchid != 'string' || data._branchid == '') { callback('checkStoreBranch: <data._branchid> must be String and Not Empty'); return; }
    else if(!validateObjectId(data._branchid)) { callback('checkStoreBranch: <data._branchid> Validate Failed'); return; }
    else {
        const _storeid = await checkObjectId(data._storeid, (err) => { callback(err); return; });
        const _branchid = await checkObjectId(data._branchid, (err) => { callback(err); return; });
        const findStoreBranchExists = await storeModel.find(
            {
                '_id': _storeid,
                'branch._id': _branchid
            },
            (err) => {
                if(err) {
                    callback(err);
                    return;
                }
            }
        );
        if(!findStoreBranchExists || findStoreBranchExists.length != 1) { callback(null); return false; }
        else { callback(null); return true; }
    }
};

module.exports = checkStoreBranch;