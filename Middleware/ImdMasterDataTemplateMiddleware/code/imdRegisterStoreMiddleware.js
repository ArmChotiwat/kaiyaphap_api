const Express = require("express");

/** @type {Express.RequestHandler} */
const imdRegisterStoreMiddleware = (req, res, next) => {

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    try {
        const payload = req.body;
        const { validate_String_AndNotEmpty, validatePhoneNumber, checkNull } = require('../../../Controller/miscController')

        if (!validate_String_AndNotEmpty(payload.name)) { ErrorJson.description.push(`Paratmer <name> mest be String and Not Empty`); }
        if (!validate_String_AndNotEmpty(payload.email)) { ErrorJson.description.push(`Paratmer <email> mest be String and Not Empty`); }
        if (!validate_String_AndNotEmpty(payload.phone_number)) { ErrorJson.description.push(`Paratmer <phone_number> mest be String and Not Empty`); }
        else {
            // if (!validatePhoneNumber(payload.phone_number)) { ErrorJson.description.push(`Paratmer <phone_number> mest be String and Not Empty`); }
        }
        if (typeof payload.address !== 'object' || checkNull(payload.address) === null) { ErrorJson.description.push(`Paratmer <address> mest be object and Not Empty`); }

        if (ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { next(); }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(400).json(ErrorJson).end();
    }
};


module.exports = imdRegisterStoreMiddleware;