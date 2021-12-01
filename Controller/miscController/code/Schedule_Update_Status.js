/**
 * Misc Controller สำหรับ เปลี่ยนสถาะ คิว
 ** updateStatusMode = 1 => 'นัดหมายไว้'
 ** updateStatusMode = 2 => 'ยกเลิกนัด'
 ** updateStatusMode = 3 => 'รอรับการรักษา'
 ** updateStatusMode = 4 => 'รอชำระเงิน'
 ** updateStatusMode = 5 => 'เสร็จสิ้น'
 */
const Schedule_Update_Status = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_scheduleid: '',
        updateStatusMode: 0,
    },
    callback = (err = new Error) => { }
) => {
    const controllerName = `Schedule_Update_Status`;

    const validateObjectId = require('./validateObjectId');
    const validateStrict_Number_OrNull = require('./validateStrict_Number_OrNull');

    const Max_Mode = 5;

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (typeof data._ref_scheduleid != 'string' || !validateObjectId(data._ref_scheduleid)) { callback(new Error(`${controllerName}: <data._ref_scheduleid> must be String ObjectId`)); return; }
    else if (!validateStrict_Number_OrNull(data.updateStatusMode)) { callback(new Error(`${controllerName}: <data.updateStatusMode> must be Integer Number`)); return; }
    else if (typeof data.updateStatusMode != 'number' || Math.ceil(data.updateStatusMode) < 1 || Math.ceil(data.updateStatusMode) > Max_Mode) { callback(new Error(`${controllerName}: <data.updateStatusMode> must be Number 1 to ${Max_Mode}`)); return; }
    else {
        let updateStatusName = null;
        switch (Math.ceil(data.updateStatusMode)) {
            case 1:
                updateStatusName = 'นัดหมายไว้';
                break;
            case 2:
                updateStatusName = 'ยกเลิกนัด';
                break;
            case 3:
                updateStatusName = 'รอรับการรักษา';
                break;
            case 4:
                updateStatusName = 'รอชำระเงิน';
                break;
            case 5:
                updateStatusName = 'เสร็จสิ้น';
                break;
            default:
                updateStatusName = null;
                break;
        }

        if (!updateStatusName) { callback(new Error(`${controllerName}: updateStatusName have error`)); return; }
        else {
            const checkObjectId = require('./checkObjectId');

            const _ref_storeid = await checkObjectId(data._ref_storeid, (err) => { if (err) { callback(err); return; } });
            const _ref_branchid = await checkObjectId(data._ref_branchid, (err) => { if (err) { callback(err); return; } });
            const _ref_scheduleid = await checkObjectId(data._ref_scheduleid, (err) => { if (err) { callback(err); return; } });

            if (!_ref_storeid) { callback(new Error(`${controllerName}: checkObjectId "_ref_storeid" have error`)); return; }
            else if (!_ref_branchid) { callback(new Error(`${controllerName}: checkObjectId "_ref_branchid" have error`)); return; }
            else if (!_ref_scheduleid) { callback(new Error(`${controllerName}: checkObjectId "_ref_scheduleid" have error`)); return; }
            else {
                const { scheduleModel_Refactor } = require('../../mongodbController');

                const findSchedule = await scheduleModel_Refactor.findOne(
                    {
                        '_id': _ref_scheduleid,
                        '_ref_storeid': _ref_storeid,
                        '_ref_branchid': _ref_branchid,
                    },
                    {},
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!findSchedule) { callback(new Error(`${controllerName}: findSchedule return not found`)); return; }
                else {
                    const validateUpdate_Schedule = () => {
                        let current_StatusCode = 0;
                        switch (findSchedule.status) {
                            case 'นัดหมายไว้':
                                current_StatusCode = 1;
                                break;
                            case 'ยกเลิกนัด':
                                current_StatusCode = 2;
                                break;
                            case 'รอรับการรักษา':
                                current_StatusCode = 3;
                                break;
                            case 'รอชำระเงิน':
                                current_StatusCode = 4;
                                break;
                            case 'เสร็จสิ้น':
                                current_StatusCode = 5;
                                break;
                            default:
                                current_StatusCode = 0;
                                break;
                        }

                        if (current_StatusCode <= 0) { return false; }
                        else {
                            if (current_StatusCode === 1) { // current_StatusCode => นัดหมายไว้ (1) | data.updateStatusMode => ยกเลิกนัด (2), รอรับการรักษา (3)
                                if (data.updateStatusMode !== 2 && data.updateStatusMode !== 3) { return false }
                                else { return true; }
                            }
                            else if (current_StatusCode === 2) { // current_StatusCode => ยกเลิกนัด (2) | NO ALLOWED UPDATE!
                                return false;
                            }
                            else if (current_StatusCode === 3) {  // current_StatusCode => รอรับการรักษา (3) | data.updateStatusMode => รอชำระเงิน (4)
                                if (data.updateStatusMode !== 4) { return false; }
                                else { return true; }
                            }
                            else if (current_StatusCode === 4) { // current_StatusCode => รอชำระเงิน (4) | data.updateStatusMode => เสร็จสิ้น (5)
                                if (data.updateStatusMode !== 5) { return false; }
                                else { return true; }
                            }
                            else if (current_StatusCode === 5) { // current_StatusCode => เสร็จสิ้น (5) | NO ALLOWED UPDATE!
                                return false;
                            }
                            else { return false; }
                        }
                    };

                    if (!validateUpdate_Schedule()) { callback(new Error(`${controllerName}: validateUpdate_Schedule return false`)); return; }
                    else {
                        const updateTransaction = await scheduleModel_Refactor.updateOne(
                            {
                                '_id': _ref_scheduleid,
                                '_ref_storeid': _ref_storeid,
                                '_ref_branchid': _ref_branchid,
                            },
                            {
                                '$set': {
                                    'status': updateStatusName
                                }
                            },
                            (err) => { if (err) { callback(err); return; } }
                        ).then(result => true).catch(err => false);

                        if (!updateTransaction) { callback(new Error(`${controllerName}: findSchedule return not found`)); return; }
                        else {
                            callback(null);
                            return {
                                _ref_storeid: data._ref_storeid,
                                _ref_branchid: data._ref_branchid,
                                _ref_scheduleid: data._ref_scheduleid,
                                updateStatusMode: data.updateStatusMode,
                                updateStatusName: updateStatusName,
                            };
                        }
                    }
                }

            }
        }
    }
};

module.exports = Schedule_Update_Status;