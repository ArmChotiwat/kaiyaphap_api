const search_Agent_ListMiddleware = async (req, res, next) => {
    const payload = req.body;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    try {
        const { validate_StringObjectId_NotNull, checkAgentId } = require('../../../Controller/miscController');
        const { jwtDecode_Login_StoreBranchController } = require('../../../Controller/JwtController/index');

        if (!validate_StringObjectId_NotNull(payload.storeid)) { ErrorJson.description.push(`Param <storeid> must be String ObjectId`); }

        if (ErrorJson.description.length > 0) { res.status(400).json(ErrorJson).end(); return; }
        else {
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(req.header("authorization"));
            if (!jwtDecodeToekn) { res.status(401).end(); return; }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload.storeid) { res.status(401).end(); return; }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid)
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); return; }
                else {
                    next();
                }
            }
        }
        
    } catch (error) {
        console.error(error);
        ErrorJson.http_code = 422;
        ErrorJson.description.push(`Other Error`);
        res.status(422).end();
        return;
    }
};

module.exports = search_Agent_ListMiddleware;