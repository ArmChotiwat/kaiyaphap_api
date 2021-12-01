const ObjectId = require('mongoose').Types.ObjectId;


const Express = require("express");

/** @type {Express.RequestHandler} */
const countPatientInStoreMiddleware = (req, res, next) => {
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };
    try {
        const { storeid, rdate } = req.params;
        if(typeof storeid != 'string' || storeid == ''){ ErrorJson.description.push(`Paratmer storeid mest be String and Not Empty`); res.status(400).json(ErrorJson).end(); }
        else {
            ObjectId(storeid);
            next();
        }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(400).json(ErrorJson).end();
    }
}


module.exports = countPatientInStoreMiddleware;
