// *** Route => /imd/agentdate-customer
const express = require('express');
const router = express.Router();
// const jwtDecodeData = require('../Controller/miscController').jwtDecodeData;

router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);

// Route PATCH => /imd/agentdate-customer/roleAdminViewOnly 
// เปิด-ปิด role ของ admin
const switch_Agent_AdminMiddleware = require('../Middleware/AgentMiddleware').switch_Agent_AdminMiddleware;
const switch_Agent_AdminController = require('../Controller/AgentController').switch_Agent_AdminController;
router.patch(
    '/roleAdminViewOnly',
    switch_Agent_AdminMiddleware,
    async (req, res) => {
        try {
            /**
             ** JSON => {
                    _ref_storeid: '',
                    _ref_branchid: '',
                    _ref_agentid: '',                    
                }
            */
            const { _ref_storeid, _ref_branchid, _ref_agentid } = req.body;
            const switchResult = await switch_Agent_AdminController(
                {
                    _ref_storeid: _ref_storeid,
                    _ref_branchid: _ref_branchid,
                    _ref_agentid: _ref_agentid,
                },
                (err) => { if (err) { throw err; } }
            );

            if (!switchResult) { res.status(422).end(); return; }
            else {
                res.status(200).end();
                return;
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
            return;
        }
    }
);

module.exports = router;