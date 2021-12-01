const illnessCharacticMiddleware_save = async (req, res, next) => {
    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty } = require('../../../Controller/miscController');

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };

    try {
        const payload = req.body;
        if (!validate_StringObjectId_NotNull(payload._storeid)) { ErrorJson.description.push(`Parameter <_storeid> must be String ObjectId`); }
        if (!validate_String_AndNotEmpty(payload.name)) { ErrorJson.description.push(`Parameter <name> must be String ObjectId`); }
        if (ErrorJson.description.length !== 0) { res.status(ErrorJson.http_code).json(ErrorJson).end(); }
        else {
            next();
        }

    } catch (error) {
        console.error(error);
        res.status(400).end();
    }
}


module.exports = {
    illnessCharacticMiddleware_save,
};
