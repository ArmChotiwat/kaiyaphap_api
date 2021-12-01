const view_store_login_Agent_ProtalMiddleware = (req, res, next) => {
    const { validate_StringObjectId_NotNull } = require('../../../Controller/miscController');

    /**
     ** Query => {
            "userid": { type: StringObjectId },
        }
    */
    const { userid } = req.query;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    if (!validate_StringObjectId_NotNull(userid)) { ErrorJson.description.push(`Params <userid> must be String ObjectId`); }

    if (ErrorJson.description.length > 0) { res.status(400).json(ErrorJson).end(); }
    else {
        next();
    }
};

module.exports = view_store_login_Agent_ProtalMiddleware;