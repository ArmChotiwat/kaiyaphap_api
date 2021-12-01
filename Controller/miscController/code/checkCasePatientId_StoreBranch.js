/**
 * misc Controller สำหรับยืนยัน CasePatientId ตามสาขา
 ** หากใช่ จะ return ***_ref_storeid, _ref_branchid, _ref_casepatientid*** ที่เป็น ***String***
 ** หากไม่ใช่ จะ return ***null***
 */
const checkCasePatientId_StoreBranch = async (
    _ref_storeid = '',
    _ref_branchid = '',
    _ref_casepatientid = '',
    callback = (err = new Error) => {}
) => {
    const controllerName = `checkCasePatientId_StoreBranch`;
    const { validateObjectId, checkObjectId } = require('../../miscController');

    if (typeof _ref_storeid != 'string' || !validateObjectId(_ref_storeid)) { callback(new Error(`${controllerName}: _ref_storeid must be String ObjectId`)); return; }
    else if (typeof _ref_branchid != 'string' || !validateObjectId(_ref_branchid)) { callback(new Error(`${controllerName}: _ref_branchid must be String ObjectId`)); return; }
    else if (typeof _ref_casepatientid != 'string' || !validateObjectId(_ref_casepatientid)) { callback(new Error(`${controllerName}: _ref_casepatientid must be String ObjectId`)); return; }
    else {
        const { casePatientModel } = require('../../mongodbController');

        const ObjectId_ref_storeid = await checkObjectId(_ref_storeid, (err) => { if (err) { callback(err); return; } });
        const ObjectId_ref_branchid = await checkObjectId(_ref_branchid, (err) => { if (err) { callback(err); return; } });
        const ObjectId_ref_casepatientid = await checkObjectId(_ref_casepatientid, (err) => { if (err) { callback(err); return; } });

        const findCasePatient = await casePatientModel.findOne(
            {
                '_id': ObjectId_ref_casepatientid,
                '_ref_storeid': ObjectId_ref_storeid,
                '_ref_branchid': ObjectId_ref_branchid
            },
            {},
            (err) => { if (err) { callback(err); return; } }
        );

        if (!findCasePatient) {
            callback(null);
            return null;
        }
        else {
            callback(null);
            return {
                _ref_storeid: _ref_storeid,
                _ref_branchid: _ref_branchid,
                _ref_casepatientid: _ref_casepatientid
            };
        }
    }
};

module.exports = checkCasePatientId_StoreBranch;