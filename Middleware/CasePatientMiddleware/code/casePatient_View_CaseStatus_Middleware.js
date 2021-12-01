const casePatient_View_CaseStatus_Middleware = async (req, res, next) => {
    const { validateObjectId, checkStoreBranch } = require('../../../Controller/miscController');
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };
    try {
        /**
         ** Body Paramter => {
            "storeid": { type: StringObjectId },
            "branchid": { type: StringObjectId },
            "agentid": { type: StringObjectId },
            "patientid": { type: StringObjectId },
            "casepatient": { type: StringObjectId },
            }
        */
       const { storeid, branchid, agentid, patientid, casepatient } = req.params;

        if (typeof storeid != 'string' || !validateObjectId(storeid)) { ErrorJson.description.push(`Paratmer <_storeid> must be String and Not Empty`);  }
        if (typeof branchid != 'string' || !validateObjectId(branchid)) { ErrorJson.description.push(`Paratmer <_branchid> must be String and Not Empty`);  }
        if (!(await checkStoreBranch({ _storeid: storeid, _branchid: branchid }, (err) => { if (err) { return; } }))) { ErrorJson.description.push(`Paratmer <_storeid> <_branchid> checkStoreBranch return not found`);  }
        if (typeof agentid != 'string' || !validateObjectId(agentid)) { ErrorJson.description.push(`Paratmer <agentid> must be String and Not Empty`); }
        if (typeof patientid != 'string' || !validateObjectId(patientid)) { ErrorJson.description.push(`Paratmer <patientid> must be String and Not Empty`); }
        if (typeof casepatient != 'string' || !validateObjectId(casepatient)) { ErrorJson.description.push(`Paratmer <casepatient> must be String and Not Empty`); }

        if (ErrorJson.description.length != 0) {
            res.status(ErrorJson.http_code).json(ErrorJson).end();
        }
        else {
            next();
        }
        
    } catch (error) {
        console.error(error);
        ErrorJson.http_code = 422;
        ErrorJson.description.push(`Other Error`);
        
    }
}


module.exports = casePatient_View_CaseStatus_Middleware;
