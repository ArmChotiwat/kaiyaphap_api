const switch_Agent_AdminMiddleware = (req, res, next) => {
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
         * - <_ref_storeid>
         * - <_ref_branchid>
         * - <_ref_agentid>
         */
        if (!validateObjectId(payload._ref_storeid)) { ErrorJson.description.push(`Paratmer <_storeid> mest be ObjectId String and Not Empty`); }
        if (!validateObjectId(payload._ref_branchid)) { ErrorJson.description.push(`Paratmer <_branchid> mest be ObjectId String and Not Empty`); }
        if (!validateObjectId(payload._ref_agentid)) { ErrorJson.description.push(`Paratmer <_agentid> mest be ObjectId String and Not Empty`); }

        if (ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { next(); }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};


module.exports = switch_Agent_AdminMiddleware;