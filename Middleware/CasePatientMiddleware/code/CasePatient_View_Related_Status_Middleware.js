/**
 * Middleware สำหรับ ดู Status ส่วน Treatment, Next Visit Treatment, Progression Note และ Purchase Order ของ CasePatient
 */
const CasePatient_View_Related_Status_Middleware = async (req, res, next) => {
    const { validateObjectId, validateNumber } = require('../../../Controller/miscController');

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };
    
    try {
        /**
         ** Query Params => {
                "_ref_storeid": { type: StringObjectId },
                "_ref_branchid": { type: StringObjectId },
                "_ref_casepatientid": { type: StringObjectId },
                "skip": { type: Number morethan or equal 0 },
            }
        */
        const { _ref_storeid, _ref_branchid, _ref_casepatientid, skip } = req.query;

        if (typeof _ref_storeid != 'string' || !validateObjectId(_ref_storeid)) { ErrorJson.description.push(`Paratmer <_ref_storeid> must be String ObjectId`); }
        if (typeof _ref_branchid != 'string' || !validateObjectId(_ref_branchid)) { ErrorJson.description.push(`Paratmer <_ref_branchid> must be String ObjectId`); }
        if (typeof _ref_casepatientid != 'string' || !validateObjectId(_ref_casepatientid)) { ErrorJson.description.push(`Paratmer <_ref_casepatientid> must be String ObjectId`); }
        if (typeof skip != 'string' || !validateNumber(skip) || Number(skip) < 0) { ErrorJson.description.push(`Paratmer <skip> must be Number morethan or equal 0`); }

        if (ErrorJson.description.length != 0) {
            res.status(ErrorJson.http_code).json(ErrorJson).end();
        }
        else {
            next();
        }
        
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
    }
}


module.exports = CasePatient_View_Related_Status_Middleware;
