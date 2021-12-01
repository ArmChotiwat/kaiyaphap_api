const Express = require('express');
/** @type {Express.RequestHandler} */
const view_sellproductreport_Middleware = async (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;
    const { _storeid, todate } = req.query;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        if (typeof _storeid !== 'string' || _storeid === '' || !validateObjectId(_storeid)) { ErrorJson.description.push(`Paratmer <_storeid> must be ObjectId String and Not Empty`); }                
        if (typeof todate !== 'string' || todate === '' ) { ErrorJson.description.push(`Paratmer <todate> must be String and Not Empty`); }
        else { next(); }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};

module.exports = view_sellproductreport_Middleware;