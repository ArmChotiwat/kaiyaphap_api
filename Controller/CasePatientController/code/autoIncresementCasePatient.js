const AutoIncrementCasePatientStore = async (data = { _storeid: new String('') }, callback = (err = new Error) => {}) => {
    const moment = require('moment');
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const checkStore = require('../../mongodbController').checkStore;
    const AutoIncrementCasePatientStoreModel = require('../../mongodbController').AutoIncrementCasePatientStoreModel;

    const currentTime = moment();
    const currentYear = currentTime.year();
    const currentMonth = currentTime.month() + 1;

    if(typeof data != 'object') { callback(new Error(`AutoIncrementCasePatientStore: data must be Object`)); return; }
    else if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`AutoIncrementCasePatientStore: data._storeid must be String and Not Empty`)); return; }
    else {
        const chkStore = await checkStore({_storeid: data._storeid}, (err) => { callback(err); return; });
        if(!chkStore) { callback(new Error('AutoIncrementCasePatientStore: _storeid NOT Found')); return; }
        else {
            const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
            const mapData = {
                _storeid: _storeid,
                year: currentYear,
                month: currentMonth,
            }
            const transactionSave = new AutoIncrementCasePatientStoreModel(mapData);
            const resultdata = await transactionSave.save()
                .then(
                    (result) => {  return result; }
                )
                .catch(
                    (err) => { callback(err); return; }
                );

            callback(null);
            return resultdata;
        }
    }
};

const AutoIncrementCasePatientStoreBranch = async (data = { _storeid: new String(''), _branchid: new String('') }, callback = (err = new Error) => {}) => {
    const moment = require('moment');
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const checkStoreBranch = require('../../mongodbController').checkStoreBranch;
    const AutoIncrementCasePatientBranchModel = require('../../mongodbController').AutoIncrementCasePatientBranchModel;

    const currentTime = moment();
    const currentYear = currentTime.year();
    const currentMonth = currentTime.month() + 1;

    if(typeof data != 'object') { callback(new Error(`AutoIncrementCasePatientStore: data must be Object`)); return; }
    else if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`AutoIncrementCasePatientStore: data._storeid must be String and Not Empty`)); return; }
    else if(typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`AutoIncrementCasePatientStore: data._branchid must be String and Not Empty`)); return; }
    else {
        const chkStoreBranch = await checkStoreBranch({ _storeid: data._storeid, _branchid: data._branchid }, (err) => { callback(err); return; });
        if(!chkStoreBranch) { callback(new Error('AutoIncrementCasePatientStore: _storeid/_branchid NOT Found')); return; }
        else {
            const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
            const _branchid = await checkObjectId(data._branchid, (err) => { if(err) { callback(err); return; } });
            const mapData = {
                _storeid: _storeid,
                _branchid: _branchid,
                year: currentYear,
                month: currentMonth,
            }
            const transactionSave = new AutoIncrementCasePatientBranchModel(mapData);
            const resultdata = await transactionSave.save()
                .then(
                    (result) => {  return result; }
                )
                .catch(
                    (err) => { callback(err); return; }
                );

            callback(null);
            return resultdata;
        }
    }
};


module.exports = {
    AutoIncrementCasePatientStore,
    AutoIncrementCasePatientStoreBranch,
};