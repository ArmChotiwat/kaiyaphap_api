const express = require('express');
const router = express.Router();
const { jwtDecode_Login_StoreBranchController } = require('../Controller/JwtController/index');

router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);

// GET /report/raw/listpatients
const reportRaw_listPatinets = require('../Controller/reportRawController').reportRaw_listPatinets;
router.get(
    '/listpatients/:storeid/:datestart/:dateend',
    async (req, res) => {
        try {
            const { checkAgentId } = require('../Controller/miscController');

            const { storeid, datestart, dateend } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else {
                    const rpt_raw = await reportRaw_listPatinets(
                        {
                            _storeid: storeid,
                            datestart: datestart,
                            dateend: dateend,
                        },
                        (err) => { if (err) { throw err; } }
                    );

                    if (!rpt_raw) { res.status(422).end(); }
                    else {
                        res.status(200).json(rpt_raw).end();
                    }
                }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

module.exports = router;