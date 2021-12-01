const login_Agent_ProtalMiddleware = (req, res, next) => {
    const { validate_String_AndNotEmpty } = require('../../../Controller/miscController');

    /**
     ** JSON => {
            "username": { type: StringObjectId },
            "password": { type: StringObjectId },
        }
    */
    const payload = req.body;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    if (!validate_String_AndNotEmpty(payload.username)) { ErrorJson.description.push(`Params <username> must be String and Not Empty`); }
    if (!validate_String_AndNotEmpty(payload.password)) { ErrorJson.description.push(`Params <password> must be String and Not Empty`); }

    if (ErrorJson.description.length > 0) { res.status(400).json(ErrorJson).end(); }
    else {
        next();
    }
};

module.exports = login_Agent_ProtalMiddleware;