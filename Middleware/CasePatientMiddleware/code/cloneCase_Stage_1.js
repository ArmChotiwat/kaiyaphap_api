const casePatinetCloneStage1Middleware = (req, res, next) => {
    const validateObjectId = require('../../../Controller/mongodbController').validateObjectId;
    const payload = req.body;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        /**
         * **JSON Playload In
         * - <_storeid>
         * - <_branchid>
         * - <_patientid>
         * - <_agentid> m_agent => 'store._id'
         * - <_casemainid> m_patient => '_id'
         * - <_casesubid>
         */
        if(typeof payload._storeid != 'string' || payload._storeid == '' || !validateObjectId(payload._storeid) ){ ErrorJson.description.push(`Paratmer <_storeid> mest be ObjectId String and Not Empty`);}
        if(typeof payload._branchid != 'string' || payload._branchid == '' || !validateObjectId(payload._branchid) ){ ErrorJson.description.push(`Paratmer <_branchid> mest be ObjectId String and Not Empty`);}
        if(typeof payload._agentid != 'string' || payload._agentid == '' || !validateObjectId(payload._agentid) ){ ErrorJson.description.push(`Paratmer <_agentid> mest be ObjectId String and Not Empty`);}
        if(typeof payload._patientid != 'string' || payload._patientid == '' || !validateObjectId(payload._patientid) ){ ErrorJson.description.push(`Paratmer <_patientid> mest be ObjectId String and Not Empty`);}
        if(typeof payload._casepatientid != 'string' || payload._casepatientid == '' || !validateObjectId(payload._casepatientid) ){ ErrorJson.description.push(`Paratmer <_casepatientid> mest be ObjectId String and Not Empty`);}

        if(ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { next(); }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};


module.exports = casePatinetCloneStage1Middleware;