/**
 * JwtLogin - Check Middleware สำหรับตรวจสอบ JwtToken ของการ Login ครั้งที่สอง (Login With Username/Password And Then Chose Store/Branch)
 ** มี Check Agent Store/Branch จากการ Decode jwtToken
 */
const jwtLogin_Agent_StoreBranchMiddleware = async (req, res, next) => {
    const { checkAgentId } = require('../../../Controller/miscController');
    const { jwtDecode_Login_StoreBranchController } = require('../../../Controller/JwtController/index');
    
    const Authorlization = req.header("Authorization");
    
    if (!Authorlization) { res.status(401).end(); }
    else {
        try {
            const jwtDecode = jwtDecode_Login_StoreBranchController(Authorlization);

            if (!jwtDecode) { res.status(401).end(); }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecode._ref_storeid),
                        _branchid: String(jwtDecode._ref_branchid),
                        _agentid: String(jwtDecode._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else {
                    next();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
};

module.exports = jwtLogin_Agent_StoreBranchMiddleware;