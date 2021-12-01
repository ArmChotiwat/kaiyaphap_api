const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment');
const checkDateVaild = (getDateString = new String(''), dateFormat = 'YYYY-MM-DD') => {
    if(typeof getDateString != 'string' || getDateString == '') { return false; }
    if(getDateString.length != 10) { return false; }
    const splitCheck = (getDateString.split('-').length === 3) ? true:false; // true is Valid, false is Not Valid
    const checkDate = moment(getDateString, dateFormat).isValid(); // true is Valid, false is Not Valid
    if(splitCheck && checkDate) { return true; } // Date is Valid
    else { return false; } // Date is NOT Valid
};

const Express = require("express");

/** @type {Express.RequestHandler} */
const patientRegisterInStoreTimelineMiddleware = (req, res, next) => {
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };
    try {
        const { storeid, rdate } = req.params;
        if(typeof storeid != 'string' || storeid == ''){ ErrorJson.description.push(`Paratmer storeid mest be String and Not Empty`); res.status(400).json(ErrorJson).end(); }
        else if (typeof rdate != 'string' || rdate == '') { ErrorJson.description.push(`Paratmer rdate mest be String and Not Empty`); res.status(400).json(ErrorJson).end(); }
        else if(!checkDateVaild(rdate)) { ErrorJson.description.push(`Paratmer rdate mest be is not valid`); res.status(400).json(ErrorJson).end(); }
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


module.exports = patientRegisterInStoreTimelineMiddleware;
