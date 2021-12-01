const login_Agent_StoreBranch_PortalMiddleware = (req, res, next) => {
    const { validate_StringObjectId_NotNull } = require('../../../Controller/miscController');

    /**
     ** JSON => {
            "_ref_storeid": { type: StringObjectId },
            "_ref_branchid": { type: StringObjectId },
        }
    */
    const payload = req.body;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    if (!validate_StringObjectId_NotNull(payload._ref_storeid)) { ErrorJson.description.push(`Params <_ref_storeid> must be String ObjectId And Not Empty`); }
    if (!validate_StringObjectId_NotNull(payload._ref_branchid)) { ErrorJson.description.push(`Params <_ref_branchid> must be String ObjectId And Not Empty`); }

    if (ErrorJson.description.length > 0) { res.status(400).json(ErrorJson).end(); }
    else {
        next();
    }
};

module.exports = login_Agent_StoreBranch_PortalMiddleware;