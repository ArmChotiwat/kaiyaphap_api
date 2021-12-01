const Express = require('express');
/** @type {Express.RequestHandler} */
const storeTaxId_Update_Middleware = async (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;
    const payload = req.body;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        if(typeof payload._storeid != 'string' || payload._storeid == '' || !validateObjectId(payload._storeid) ){ ErrorJson.description.push(`Paratmer <_storeid> must be ObjectId String and Not Empty`);}
        if(typeof payload._branchid != 'string' || payload._branchid == '' || !validateObjectId(payload._branchid) ){ ErrorJson.description.push(`Paratmer <_branchid> must be ObjectId String and Not Empty`);}
        if(typeof payload._agentid != 'string' || payload._agentid == '' || !validateObjectId(payload._agentid) ){ ErrorJson.description.push(`Paratmer <_agentid> must be ObjectId String and Not Empty`);}
        if(typeof payload.tax_id != 'string' || payload.tax_id == ''){ ErrorJson.description.push(`Paratmer <tax_id> must be ObjectId String and Not Empty`); }
        else {
            const validateTaxId = require('../../../Controller/miscController').validateTaxId;

            const doValidateTaxId = await validateTaxId(
                {
                    stringTaxid: payload.tax_id,
                    returnType: Boolean
                },
                (err) => { if(err) { console.error(err); ErrorJson.description.push(`Paratmer <tax_id> Validate have Error`); } }
            );
            if(!doValidateTaxId) { ErrorJson.description.push(`Paratmer <tax_id> Validate Return False`); }
        }

        if(ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { next(); }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};

module.exports = storeTaxId_Update_Middleware;