/**
 * Middleare สำหรับ ดู ใบจ่ายยา Purchase Order (PO)
 */
const PurchaseOrder_View_ForStroeOrBbranch_Middleware = async (req, res, next) => {
    const { jwtDecode_Login_StoreBranchController } = require('../../../Controller/JwtController/index');
    const { checkAgentId } = require('../../../Controller/miscController');
    try {
        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        let ErrorJson = {
            http_code: 400,
            document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
            description: []
        };
        if (!jwtDecodeToekn) { res.status(401).end(); }

        const chkAgentId = await checkAgentId(
            {
                _storeid: String(jwtDecodeToekn._ref_storeid),
                _branchid: String(jwtDecodeToekn._ref_branchid),
                _agentid: String(jwtDecodeToekn._ref_agent_userid),
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgentId) { ErrorJson.description.push(`<chkAgentId> can't find`); }
        else {
            if (chkAgentId.role != 1) { ErrorJson.description.push(`<chkAgentId.role> munt be 2 (admin Only)`); }
        }

        if (ErrorJson.description.length != 0) {
            res.status(400).json(ErrorJson).end();
        } else {
            next();
        }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};

module.exports = PurchaseOrder_View_ForStroeOrBbranch_Middleware;