const Express = require('express');
/** @type {Express.RequestHandler} */
const view_Image_Store_Middleware = async (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;
    const payload = req.params;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        if (typeof payload.storeid !== 'string' || payload.storeid === '' || !validateObjectId(payload.storeid)) { ErrorJson.description.push(`Paratmer <storeid> must be ObjectId String and Not Empty`); }
        if (typeof payload.branchid !== 'string' || payload.branchid === '' || !validateObjectId(payload.branchid)) { ErrorJson.description.push(`Paratmer <branchid> must be ObjectId String and Not Empty`); }

        if (ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { next(); }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};

module.exports = view_Image_Store_Middleware;