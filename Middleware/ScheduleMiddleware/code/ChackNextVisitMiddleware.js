const Express = require('express');
/** @type {Express.RequestHandler} */
const Chack_Next_Visit_Middleware = async (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;
    const { storeid, branchid, patientid, scheduleid } = req.query;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        if (typeof storeid !== 'string' || storeid === '' || !validateObjectId(storeid)) { ErrorJson.description.push(`Paratmer <storeid> must be ObjectId String and Not Empty`); }
        if (typeof branchid !== 'string' || branchid === '' || !validateObjectId(branchid)) { ErrorJson.description.push(`Paratmer <branchid> must be ObjectId String and Not Empty`); }
        if (typeof patientid !== 'string' || patientid === '' || !validateObjectId(patientid)) { ErrorJson.description.push(`Paratmer <patientid> must be ObjectId String and Not Empty`); }
        if (typeof scheduleid !== 'string' || scheduleid === '' || !validateObjectId(scheduleid)) { ErrorJson.description.push(`Paratmer <scheduleid> must be ObjectId String and Not Empty`); }
        if (ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { next(); }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};

module.exports = Chack_Next_Visit_Middleware;