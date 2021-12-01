const Express = require('express');
/** @type {Express.RequestHandler} */
const store_Upload_Image_Middleware = async (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;
    const payload = req.body;
    const fileReq = req.files.file;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        if (typeof payload.storeid !== 'string' || payload.storeid === '' || !validateObjectId(payload.storeid)) { ErrorJson.description.push(`Paratmer <storeid> must be ObjectId String and Not Empty`); }
        if (typeof fileReq !== 'object' || fileReq === '') { ErrorJson.description.push(`Paratmer <file> must be file and Not Empty`); }
        // console.log(typeof fileReq.mimetype +' : '+ fileReq.mimetype);
        if (fileReq.mimetype !== 'image/png' && fileReq.mimetype !== 'image/jpeg' && fileReq.mimetype !== 'image/bmp' && fileReq.mimetype !== 'image/tiff' && fileReq.mimetype !== 'image/gif') {
            ErrorJson.description.push(`Paratmer <file> not support types file`);
        }   
        if (ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { next(); }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};

module.exports = store_Upload_Image_Middleware;