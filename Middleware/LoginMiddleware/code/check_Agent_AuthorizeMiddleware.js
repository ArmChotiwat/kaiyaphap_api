const check_Agent_AuthorizeMiddleware = (req, res, next) => {
    /**
     ** JSON => {
            "userid": { type: StringObjectId },
            "agentid": { type: StringObjectId },
            "storeid": { type: StringObjectId },
            "branchid": { type: StringObjectId },
        }
     */
    const payload = req.body;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    try {
        const { validate_StringObjectId_NotNull } = require('../../../Controller/miscController');
        const { jwtDecode_Login_StoreBranchController } = require('../../../Controller/JwtController/index');

        let RequireValidate = true;

        if (!validate_StringObjectId_NotNull(payload.storeid)) { ErrorJson.description.push(`Parameter <storeid> must be String ObjectId`); RequireValidate = false; }
        if (!validate_StringObjectId_NotNull(payload.branchid)) { ErrorJson.description.push(`Parameter <branchid> must be String ObjectId`); RequireValidate = false; }
        if (!validate_StringObjectId_NotNull(payload.userid)) { ErrorJson.description.push(`Parameter <userid> must be String ObjectId`); RequireValidate = false; }
        if (!validate_StringObjectId_NotNull(payload.agentid)) { ErrorJson.description.push(`Parameter <agentid> must be String ObjectId`); RequireValidate = false; }

        if (RequireValidate) {
            const decodeJwt = jwtDecode_Login_StoreBranchController(req.header("authorization"));

            if (!decodeJwt) { res.status(401).end(); }
            else if (String(decodeJwt._ref_storeid) !== payload.storeid) { res.status(401).end(); }
            else if (String(decodeJwt._ref_branchid) !== payload.branchid) { res.status(401).end(); }
            else if (String(decodeJwt._ref_agent_userid) !== payload.userid) { res.status(401).end(); }
            else if (String(decodeJwt._ref_agent_userstoreid) !== payload.agentid) { res.status(401).end(); }
            else {
                next();
            }
        }
        else {
            res.status(400).json(ErrorJson).end();
        }

    } catch (error) {
        console.error(error);

        ErrorJson.description.push(`Other Error`);
        ErrorJson.http_code = 422;

        res.status(ErrorJson.http_code).end();
    }
};

module.exports = check_Agent_AuthorizeMiddleware;