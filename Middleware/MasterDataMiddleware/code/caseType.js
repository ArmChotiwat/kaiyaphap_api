const ObjectId = require('mongoose').Types.ObjectId;


const Express = require("express");

/** @type {Express.RequestHandler} */
const caseTypeStoreMiddleware_save = (req, res, next) => {
    const payload = req.body;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        if(typeof payload._storeid != 'string' || payload._storeid == ''){ ErrorJson.description.push(`Paratmer <payload._storeid> mest be String and Not Empty`);}
        if(typeof payload._branchid != 'string' || payload._branchid == ''){ ErrorJson.description.push(`Paratmer <payload._branchid> mest be String and Not Empty`);}
        if(ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { 
            ObjectId(payload._storeid);
            ObjectId(payload._branchid);

            next(); 
        }
    } catch (error) {
        ErrorJson.description.push(`Other Error`);
        res.status(400).json(ErrorJson).end();
    }
};

/** @type {Express.RequestHandler} */
const caseTypeStoreMiddleware_view = (req, res, next) => {
    const { storeid, branchid } = req.params;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        if(typeof storeid != 'string' || storeid == ''){ ErrorJson.description.push(`Paratmer <storeid> mest be String and Not Empty`);}
        if(typeof branchid != 'string' || branchid == ''){ ErrorJson.description.push(`Paratmer <branchid> mest be String and Not Empty`);}
        if(ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { 
            ObjectId(storeid);
            ObjectId(branchid);

            next(); 
        }
    } catch (error) {
        ErrorJson.description.push(`Other Error`);
        res.status(400).json(ErrorJson).end();
    }
};


module.exports = {
    caseTypeStoreMiddleware_save,
    caseTypeStoreMiddleware_view,
};