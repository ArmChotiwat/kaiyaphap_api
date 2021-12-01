const casePatinetViewStage1LastestMiddleware = (req, res, next) => {
    const validateObjectId = require('../../../Controller/mongodbController').validateObjectId;

    const { storeid, branchid, agentid, patientid } = req.params;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        /**
         * **Params In
         * - <storeid>
         * - <branchid>
         * - <patientid>
         * - <agentid> m_agent => 'store._id'
         * - <casemainid> m_patient => '_id'
         * - <casesubid>
         */
        if(typeof storeid != 'string' || storeid == '' || !validateObjectId(storeid) ){ ErrorJson.description.push(`Paratmer <_storeid> mest be ObjectId String and Not Empty`);}
        if(typeof branchid != 'string' || branchid == '' || !validateObjectId(branchid) ){ ErrorJson.description.push(`Paratmer <_branchid> mest be ObjectId String and Not Empty`);}
        if(typeof agentid != 'string' || agentid == '' || !validateObjectId(agentid) ){ ErrorJson.description.push(`Paratmer <_agentid> mest be ObjectId String and Not Empty`);}
        if(typeof patientid != 'string' || patientid == '' || !validateObjectId(patientid) ){ ErrorJson.description.push(`Paratmer <_patientid> mest be ObjectId String and Not Empty`);}
        

        if(ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { next(); }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};


module.exports = casePatinetViewStage1LastestMiddleware;