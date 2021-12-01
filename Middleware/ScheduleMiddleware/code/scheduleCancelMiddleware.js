const Express = require('express');
/** @type {Express.RequestHandler} */
const schedule_Cancel_Middleware = async (req, res, next) => {
    const miscController = require('../../../Controller/miscController')    
    const payload = req.body;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        if (!miscController.validateObjectId(payload._ref_storeid)) { ErrorJson.description.push(`Paratmer <_ref_storeid> must be ObjectId String and Not Empty`); }
        if (!miscController.validateObjectId(payload._ref_branchid)) { ErrorJson.description.push(`Paratmer <_ref_branchid> must be ObjectId String and Not Empty`); }
        if (!miscController.validateObjectId(payload._ref_scheduleid)) { ErrorJson.description.push(`Paratmer <_ref_scheduleid> must be ObjectId String and Not Empty`); }     
      
        if (ErrorJson.description.length != 0) {console.log(ErrorJson); res.status(400).json(ErrorJson).end(); }
        else { next(); }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};

module.exports = schedule_Cancel_Middleware;