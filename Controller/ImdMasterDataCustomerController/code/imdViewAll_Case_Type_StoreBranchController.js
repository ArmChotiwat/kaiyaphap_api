/** Controller สำหรับ ดู Case Type ทั้งหมด ของลูกค้า ตามร้าน/สาขา */
const imdViewAll_Case_Type_StoreBranchController = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'imdViewAll_Case_Type_StoreBranchController'

    const { validate_StringObjectId_NotNull } = require('../../miscController');
    const { ObjectId, caseTypeModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else {
        const findResult = await caseTypeModel.find(
            {
                '_storeid': ObjectId(data._ref_storeid),
                '_branchid': ObjectId(data._ref_branchid)
            },
            {},
            (err) => { if (err) { callback(err); return; }}
        );

        if (!findResult) { callback(new Error(`${controllerName}: findResult have error`)); return; }
        else {
            callback(null);
            return findResult;
        }
    }
};


module.exports = imdViewAll_Case_Type_StoreBranchController;