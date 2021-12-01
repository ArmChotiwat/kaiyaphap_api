const Express = require('express');
/** @type {Express.RequestHandler} */
const view_Schedule_Middleware = async (req, res, next) => {
    const miscController = require('../../../Controller/miscController')    
    const { storeid, branchid, tabledate } = req.query;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        
        if (!miscController.validateObjectId(storeid)) { ErrorJson.description.push(`Paratmer <storeid> must be ObjectId String and Not Empty`); }
        if (!miscController.validateObjectId(branchid)) { ErrorJson.description.push(`Paratmer <branchid> must be ObjectId String and Not Empty`); }
        if (!miscController.validateDateTime.validateDate_String(tabledate)) { ErrorJson.description.push(`Paratmer <tabledate> must be  String date Fomat`); }
      
        if (ErrorJson.description.length != 0) {console.log(ErrorJson); res.status(400).json(ErrorJson).end(); }
        else { next(); }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};

module.exports = view_Schedule_Middleware;