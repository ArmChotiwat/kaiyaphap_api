// *** Route => /login
const express = require('express');
const router = express.Router();

// const requireJWTAuth = require("../Middleware/jwt");
const { jwtLogin_AgentMiddleware, jwtLogin_Agent_StoreBranchMiddleware } = require('../Middleware/JwtMiddleware');
// router.use(requireJWTAuth);

router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);

// Route POST => /login/agent
// Stage 1 => Login User
const login_Agent_ProtalMiddleware = require('../Middleware/LoginMiddleware').login_Agent_ProtalMiddleware;
const login_Agent_ProtalController = require('../Controller/LoginController').login_Agent_ProtalController;
router.post(
    '/agent',
    login_Agent_ProtalMiddleware,
    async function (req, res) {
        /**
         ** JSON => {
                "username": { type: StringObjectId },
                "password": { type: StringObjectId },
            }
        */
        const payload = req.body;

        try {

            const { chackEmailLowerCase } = require('../Controller/miscController');
            const mail_username = await chackEmailLowerCase(payload.username, (err) => { if (err) { throw err; } })
            const Do_Login = await login_Agent_ProtalController(
                {
                    login_username: mail_username,
                    login_password: payload.password
                },
                (err) => { if (err) { throw err; } }
            );

            if (!Do_Login) { res.status(401).json({ errors: "login failed" }).end(); }
            else {
                res.status(200).send(Do_Login).end();
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// Route GET => /login/viewstore/:userid
// Stage 2 => Login User -> Choose Store
const view_store_login_Agent_ProtalMiddleware = require('../Middleware/LoginMiddleware').view_store_login_Agent_ProtalMiddleware;
const view_store_login_Agent_ProtalController = require('../Controller/LoginController').view_store_login_Agent_ProtalController;
router.get(
    '/viewstore',
    jwtLogin_AgentMiddleware,
    view_store_login_Agent_ProtalMiddleware,
    async (req, res) => {
        try {
            /**
             ** Query => {
                    "userid": { type: StringObjectId },
                }
            */
            const { userid } = req.query;
            const getResult = await view_store_login_Agent_ProtalController(
                {
                    _userid: userid

                }, (err) => { if (err) { throw err; } }
            );
            if (!getResult) {
                res.status(422).end();
            }
            else {
                res.status(200).json(getResult).end();
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }

    }
);

// Route GET => /login/viewbranch/:storeid
// Stage 3 => Login User -> Choose Store -> Choose Branch
const view_branch_login_Agent_ProtalMiddleware = require('../Middleware/LoginMiddleware').view_branch_login_Agent_ProtalMiddleware;
const view_branch_login_Agent_ProtalController = require('../Controller/LoginController').view_branch_login_Agent_ProtalController;
router.get(
    '/viewbranch',
    jwtLogin_AgentMiddleware,
    view_branch_login_Agent_ProtalMiddleware,
    async (req, res) => {
        try {
            /**
             ** Query => {
                    "userid": { type: StringObjectId },
                    "storeid": { type: StringObjectId },
                }
            */
            const { userid, storeid } = req.query;
            const getResult = await view_branch_login_Agent_ProtalController(
                {
                    _userid: userid,
                    _storeid: storeid,

                }, (err) => { if (err) { throw err; } }
            );
            if (!getResult) { res.status(422).end(); }
            else {
                res.status(200).json(getResult).end();
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }

    }
);

// Route POST => /login/portal
// Stage 4 => Login User -> Choose Store -> Choose Branch -> Do Login Store/Branch
const login_Agent_StoreBranch_PortalMiddleware = require('../Middleware/LoginMiddleware').login_Agent_StoreBranch_PortalMiddleware;
const login_Agent_StoreBranch_PortalController = require('../Controller/LoginController').login_Agent_StoreBranch_PortalController;
router.post(
    '/portal',
    jwtLogin_AgentMiddleware,
    login_Agent_StoreBranch_PortalMiddleware,
    async (req, res) => {
        try {
            /**
             ** JSON => {
                    "_ref_storeid": { type: StringObjectId },
                    "_ref_branchid": { type: StringObjectId },
                }
            */
            const payload = req.body;

            const Do_Login = await login_Agent_StoreBranch_PortalController(
                {
                    _ref_storeid: payload._ref_storeid,
                    _ref_branchid: payload._ref_branchid,
                    login_jwtToken: req.header("Authorization"),
                    login_client_ip: typeof req.header("x-forwarded-for") == 'string' ? req.header("x-forwarded-for"):null,
                }, (err) => { if (err) { throw err; } }
            );
            if (!Do_Login) { res.status(422).end(); }
            else {
                res.status(200).json(Do_Login).end();
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }

    }
);

// Route get => /login/viewprotal
const view_agen_all_headerMiddleware = require('../Middleware/LoginMiddleware').view_agen_all_headerMiddleware;
const view_agen_all_headerController = require('../Controller/LoginController').view_agen_all_headerController;
router.get(
    '/viewportal',
    jwtLogin_Agent_StoreBranchMiddleware,
    view_agen_all_headerMiddleware,
    async (req, res) => {
        try {
            /**
             ** Query => {
                    "userid": { type: StringObjectId },
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId },
                }
            */
            const { userid, storeid, branchid } = req.query;
            const getResult = await view_agen_all_headerController(
                {
                    _userid: userid,
                    _storeid: storeid,
                    _branchid: branchid,

                }, (err) => { if (err) { throw err; } }
            );
            if (!getResult) { res.status(422).end(); }
            else {
                res.status(200).json(getResult).end();
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }

    }
);


// Route POST => /login/check/authorize
// Check User Exists
const check_Agent_AuthorizeMiddleware = require('../Middleware/LoginMiddleware').check_Agent_AuthorizeMiddleware;
const check_Agent_AuthorizeController = require('../Controller/LoginController').check_Agent_AuthorizeController;
router.post(
    '/check/authorize',
    check_Agent_AuthorizeMiddleware,
    async (req, res) => {
        try {
            /**
             ** JSON => {
                    "userid": { type: StringObjectId },
                    "agentid": { type: StringObjectId },
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId },
                }
            */
            const payload = req.body;

            const getResult = await check_Agent_AuthorizeController(
                {
                    _ref_storeid: payload.storeid,
                    _ref_branchid: payload.branchid,
                    _ref_agent_userid: payload.userid,
                    _ref_agent_userstoreid: payload.agentid,
                    jwtToken_AgentStoreBranch: req.header("authorization"),
                },
                (err) => { if (err) { throw err; } }
            );

            if (!getResult) { res.status(401).end(); }
            else {
                res.status(200).end();
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


module.exports = router;