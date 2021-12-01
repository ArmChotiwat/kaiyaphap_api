/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const imdLoginMiddleware = (req, res, next) => {
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    /**
     * @type {{username: String, password: String}}
     */
    const payload = req.body;// payload.username payload.password
    
    try {
        const { validate_String_AndNotEmpty, validateEmail } = require('../../../Controller/miscController');

        if(!validate_String_AndNotEmpty(payload.username)){ ErrorJson.description.push(`Paratmer <username> must be String and Not Empty`); }
        else {
            if (!validateEmail(payload.username.toLowerCase())) { ErrorJson.description.push(`Paratmer <username> validattion return false`); }
        }
        if(!validate_String_AndNotEmpty(payload.password)){ ErrorJson.description.push(`Paratmer <password> must be String and Not Empty`);}

        if(ErrorJson.description.length != 0) {
            res.status(400).json(ErrorJson).end();
            return;
        }
        else {
            next();
            return;
        }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(400).json(ErrorJson).end();
        return;
    }
};


module.exports = imdLoginMiddleware;