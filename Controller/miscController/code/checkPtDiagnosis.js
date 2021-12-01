/**
 * misc Controller สำหรับตรวจสอบ ObjectId ของ PtDiagnosis
 */
const checkPtDiagnosis = async (
    _ref_pt_diagnosisid = String(''),
    callback = (err = new Error) => { }
) => {
    const controllerName = `checkPtDiagnosis`;
    const { validateObjectId, checkObjectId } = require('../../miscController');
    if (typeof _ref_pt_diagnosisid != 'string' || !validateObjectId(_ref_pt_diagnosisid)) { callback(new Error(`${controllerName}: _ref_pt_diagnosisid must be String ObjectId`)); return; }
    else {
        const { tempPtDiagnosisModel } = require('../../mongodbController');

        const ObjectId_ref_pt_diagnosisid = await checkObjectId(_ref_pt_diagnosisid, (err) => { if (err) { callback(err); return; } });

        const findPtDiagnoisis = await tempPtDiagnosisModel.findById(ObjectId_ref_pt_diagnosisid, (err) => { if (err) { callback(err); return; } });
        if (!findPtDiagnoisis) { callback(`${controllerName}: findPtDiagnoisis return not found`); return; }
        else {
            return {
                _ref_pt_diagnosisid: ObjectId_ref_pt_diagnosisid,
                name: String(findPtDiagnoisis.name),
            };
        }
    }
};

module.exports = checkPtDiagnosis;