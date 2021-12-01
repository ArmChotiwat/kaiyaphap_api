/**
 * JwtLogin - Check Middleware สำหรับตรวจสอบ JwtToken ของการ Login ครั้งที่สอง (Login With Username/Password And Then Chose Store/Branch)
 */
const jwtLogin_Agent_StoreBranchMiddleware = (req, res, next) => {
    const { jwtDecodeController } = require('../../../Controller/JwtController/index');
    const { JWT_SECRET } = require('../../../Config/cfg_crypto');
    
    const Authorlization = req.header("Authorization");
    
    if (!Authorlization) { res.status(401).end(); }
    else {
        try {
            const jwtDecode_ = jwtDecodeController(Authorlization, JWT_SECRET);

            if (!jwtDecode_) { res.status(401).end(); }
            else {
                next();
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
};

module.exports = jwtLogin_Agent_StoreBranchMiddleware;