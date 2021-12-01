const Express = require('express');
/** @type {Express.RequestHandler} */
const view_Treatment_By_BodyChart_Middleware = async (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;
    const { _storeid } = req.query;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        if (typeof _storeid !== 'string' || _storeid === '' || !validateObjectId(_storeid)) { ErrorJson.description.push(`Paratmer <_storeid> must be ObjectId String and Not Empty`); }                        
        else { next(); }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};
module.exports = view_Treatment_By_BodyChart_Middleware;

