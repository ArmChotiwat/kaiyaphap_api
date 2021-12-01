const viewCasePatientStoreBranchAgentMiddleware = (req, res, next) => {
    const { validateObjectId } = require('../../../Controller/miscController');
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };
    try {
        const { storeid, branchid, agentid, patientid } = req.params;
        if(typeof storeid != 'string' || !validateObjectId(storeid)){ ErrorJson.description.push(`Paratmer storeid mest be String aObjectId`); }
        if(typeof branchid != 'string' || !validateObjectId(branchid)){ ErrorJson.description.push(`Paratmer branchid mest be String ObjectId`); }
        if(typeof agentid != 'string' || !validateObjectId(agentid)){ ErrorJson.description.push(`Paratmer agentid mest be String ObjectId`); }
        if(typeof patientid != 'string' || !validateObjectId(patientid)){ ErrorJson.description.push(`Paratmer patientid mest be String ObjectId`); }
        if (ErrorJson.description.length !== 0) {
            res.status(ErrorJson.http_code).json(ErrorJson).end();
        }
        else {
            next();
        }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(ErrorJson.http_code).json(ErrorJson).end();
    }
}


module.exports = viewCasePatientStoreBranchAgentMiddleware;
