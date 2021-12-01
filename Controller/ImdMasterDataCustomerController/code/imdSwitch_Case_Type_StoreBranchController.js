/** Controller สำหรับ เปิด-ปิด Case Type ของลูกค้า ตามร้าน/สาขา */
const imdSwitch_Case_Type_StoreBranchController = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_case_typeid: '',
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'imdSwitch_Case_Type_StoreBranchController'

    const { validate_StringObjectId_NotNull, currentDateTime } = require('../../miscController');
    const { ObjectId, caseTypeModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_case_typeid)) { callback(new Error(`${controllerName}: <data._ref_case_typeid> must be String ObjectId`)); return; }
    else {
        const currentTime = currentDateTime();

        const findResult = await caseTypeModel.findOne(
            {
                '_id': ObjectId(data._ref_case_typeid),
                '_storeid': ObjectId(data._ref_storeid),
                '_branchid': ObjectId(data._ref_branchid)
            },
            {},
            (err) => { if (err) { callback(err); return; }}
        );

        if (!findResult) { callback(new Error(`${controllerName}: findResult have error`)); return; }
        else {
            const update_isused = !Boolean(findResult.isused);

            const Retry_Max = 10;

            let Update_Passed = false;
            
            for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                let findResult_Update = await caseTypeModel.findOne(
                    {
                        '_id': ObjectId(data._ref_case_typeid),
                        '_storeid': ObjectId(data._ref_storeid),
                        '_branchid': ObjectId(data._ref_branchid)
                    },
                    {},
                    (err) => { if (err) { callback(err); return; }}
                );

                if (!findResult_Update) { callback(new Error(`${controllerName}: findResult_Update have error`)); return; }
                else {
                    findResult_Update.isused = update_isused;
                    findResult_Update.dateModify = currentTime.currentDateTime_Object;

                    const transactionUpdate = await findResult_Update.save().then(result => result).catch(err => { if (err) { return; } });

                    if (!transactionUpdate) { continue; }
                    else {
                        Update_Passed = true;
                        callback(null);
                        return transactionUpdate;
                    }
                }
            }

            if (!Update_Passed) {
                callback(new Error(`${controllerName}: database haver error during update or is busy`));
                return;
            }
            else {
                callback(null);
                return;
            }
        }
    }
};


module.exports = imdSwitch_Case_Type_StoreBranchController;