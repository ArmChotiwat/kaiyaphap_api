const viewCasePatientStoreBranchAgentDetailMiddleware = (req, res, next) => {
    const { validate_String_AndNotEmpty, validateObjectId} = require('../../../Controller/miscController');

    const validateObjectIdPayload = (input) => {
        if (!validate_String_AndNotEmpty(input) || !validateObjectId(input)) { return false; }
        else {
            return true;
        }
    };

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };
    try {
        const { storeid, branchid, agentid, patientid, casepatientid } = req.params;
        
        if(!validateObjectIdPayload(storeid)){ ErrorJson.description.push(`Paratmer storeid mest be String and Not Empty`); }
        if(!validateObjectIdPayload(branchid)){ ErrorJson.description.push(`Paratmer branchid mest be String and Not Empty`); }
        if(!validateObjectIdPayload(agentid)){ ErrorJson.description.push(`Paratmer agentid mest be String and Not Empty`); }
        if(!validateObjectIdPayload(patientid)){ ErrorJson.description.push(`Paratmer patientid mest be String and Not Empty`); }
        if(!validateObjectIdPayload(casepatientid)){ ErrorJson.description.push(`Paratmer casepatientid mest be String and Not Empty`); }
        
        if (ErrorJson.description.length !== 0) { res.status(ErrorJson.http_code).json(ErrorJson).end(); }
        else {
            next();
        }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(ErrorJson.http_code).json(ErrorJson).end();
    }
}


module.exports = viewCasePatientStoreBranchAgentDetailMiddleware;
