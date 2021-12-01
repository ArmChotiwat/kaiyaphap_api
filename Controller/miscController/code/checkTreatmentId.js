/**
 * Misc - Controller สำหรับ ตรวจสอบ/ดู Treatment Id
 */
const checkTreatmentId = async (
    data = {
        _storeid: '',
        _branchid: '',
        _treatmentid: '',
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `checkTreatment`;

    const validateObjectId = require('./validateObjectId');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (typeof data._storeid != 'string' || !validateObjectId(data._storeid)) { callback(new Error(`${controllerName}: <data._storeid> must be String ObjectId`)); return; }
    else if (typeof data._branchid != 'string' || !validateObjectId(data._branchid)) { callback(new Error(`${controllerName}: <data._branchid> must be String ObjectId`)); return; }
    else if (typeof data._treatmentid != 'string' || !validateObjectId(data._treatmentid)) { callback(new Error(`${controllerName}: <data._treatmentid> must be String ObjectId`)); return; }
    else {
        const checkObjectId = require('./checkObjectId');

        const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
        const _treatmentid = await checkObjectId(data._treatmentid, (err) => { if (err) { callback(err); return; } });

        if (!_storeid) { callback(new Error(`${controllerName}: checkObjectId(data._storeid) have error`)); return; }
        else if (!_branchid) { callback(new Error(`${controllerName}: checkObjectId(data._branchid) have error`)); return; }
        else if (!_treatmentid) { callback(new Error(`${controllerName}: checkObjectId(data._treatmentid) have error`)); return; }
        else {
            const { ObjectId, treatmentModel } = require('../../mongodbController');
            const moment = require('moment');

            const findTreatmetnResult = await treatmentModel.findOne(
                {
                    '_id': _treatmentid,
                    '_ref_storeid': _storeid,
                    '_ref_branchid': _branchid,
                },
                {},
                (err) => { if (err) { callback(err); return; } }
            );

            if (!findTreatmetnResult) { callback(new Error(`${controllerName} findTreatmetnResult return not found`)); return; }
            else {
                callback(null);
                return {
                    _ref_treatmentid: ObjectId(findTreatmetnResult._id),

                    _ref_storeid: ObjectId(findTreatmetnResult._storeid),
                    _ref_branchid:  ObjectId(findTreatmetnResult._ref_branchid),

                    _ref_casepatinetid: ObjectId(findTreatmetnResult._ref_casepatinetid),

                    _ref_scheduleid: ObjectId(findTreatmetnResult._ref_scheduleid),
                };
            }
        }
    }
};

module.exports = checkTreatmentId;