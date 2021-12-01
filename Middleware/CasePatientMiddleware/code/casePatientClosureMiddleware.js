/**
 * Middleware สำหรับ Closure case ของ CasePatient เมื่อทำกระบวนการขั้นตอนต่างๆเสร็จเรียบร้อยเเล้ว 
 */
const case_Patient_Closure_Middleware = async (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };
    
    try {
       /**
             ** Paramter => {                                
                _ref_storeid: { type: StringObjectId },
                _ref_branchid: { type: StringObjectId },
                _ref_casepatientid: { type: StringObjectId },
             }
             */
        const payload = req.body;        
        if (typeof payload._ref_storeid != 'string' || !validateObjectId(payload._ref_storeid)) { ErrorJson.description.push(`Paratmer <_ref_storeid> must be String ObjectId`); }
        if (typeof payload._ref_branchid != 'string' || !validateObjectId(payload._ref_branchid)) { ErrorJson.description.push(`Paratmer <_ref_branchid> must be String ObjectId`); }
        if (typeof payload._ref_casepatientid != 'string' || !validateObjectId(payload._ref_casepatientid)) { ErrorJson.description.push(`Paratmer <_ref_casepatientid> must be String ObjectId`); }    

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


module.exports = case_Patient_Closure_Middleware;
