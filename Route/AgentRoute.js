const express = require('express');
const router = express.Router();
const { jwtDecode_Login_StoreBranchController } = require('../Controller/JwtController/index');


// Route => /agent2
router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);


// Route GET => /agent2/viewagent
// ดูข้อมูลนักกายภาพ (รายบุคคล)
const view_Agent_DetailMiddleware = require('../Middleware/AgentMiddleware').view_Agent_DetailMiddleware;
const view_Agent_DetailController = require('../Controller/AgentController').view_Agent_DetailController;
router.get(
    '/viewagent',
    view_Agent_DetailMiddleware,
    async (req, res) => {
        /**
         ** Query => {
                "storeid": { typer: StringObjectId },
                "find_agent_userid": { typer: StringObjectId },
            }
        */
        const { storeid, find_agent_userid } = req.query;

        try {
            const jwtDecode = jwtDecode_Login_StoreBranchController(req.header('authorization'));

            if (!jwtDecode) { res.status(401).end(); }
            else if (String(jwtDecode._ref_storeid) !== storeid) { res.status(401).end(); }
            else {
                const getResult = await view_Agent_DetailController(
                    {
                        _ref_storeid: String(jwtDecode._ref_storeid),
                        _ref_branchid: String(jwtDecode._ref_branchid),
                        _ref_agent_userid: String(jwtDecode._ref_agent_userid),
                        find_ref_agent_userid: find_agent_userid
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!getResult) { res.status(200).end(); }
                else {
                    res.status(200).json(getResult).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);



// Route POST => /agent2/search
// ค้นหาผู้ป่วย (List รายการ)
const search_Agent_ListMiddleware = require('../Middleware/AgentMiddleware').search_Agent_ListMiddleware;
const search_Agent_ListController = require('../Controller/AgentController').search_Agent_ListController;
router.post(
    '/search',
    search_Agent_ListMiddleware,
    async (req, res) => {
        try {
            const payload = req.body;

            const jwtDecode = jwtDecode_Login_StoreBranchController(req.header('authorization'));

            if (!jwtDecode) { res.status(401).end(); }
            else if (String(jwtDecode._ref_storeid) !== payload.storeid) { res.status(401).end(); }
            else {
                const getResult = await search_Agent_ListController(
                    {
                        _ref_storeid: String(jwtDecode._ref_storeid),
                        _ref_branchid: String(jwtDecode._ref_branchid),
                        user_status: payload.user_status,
                        idcard: payload.idcard,
                        email: payload.email,
                        pre_name: payload.pre_name,
                        first_name: payload.first_name,
                        last_name: payload.last_name,
                        homenumber: payload.homenumber,
                        alley: payload.alley,
                        village_number: payload.village_number,
                        village: payload.village,
                        building: payload.building,
                        province: payload.province,
                        district: payload.district,
                        subdistrict: payload.subdistrict,
                        postcode: payload.postcode,
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!getResult) { res.status(200).json([]).end(); }
                else {
                    res.status(200).json(getResult).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route POST => /agent2/register/full
// ลงทะเบียนนักกายภาพ (แบบเต็ม)
const Register_Agent_Save_FullMiddleware = require('../Middleware/RegisterMiddleware').Register_Agent_Save_FullMiddleware;
const Register_Agent_Save_FullController = require('../Controller/RegisterController').Register_Agent_Save_FullController;
router.post(
    '/register/full',
    Register_Agent_Save_FullMiddleware,
    async (req, res) => {
        try {
            const payload = req.body;

            const jwtDecode = jwtDecode_Login_StoreBranchController(req.header('authorization'));

            if (!jwtDecode) { res.status(401).end(); }
            else if (String(jwtDecode._ref_storeid) !== payload.store[0]._storeid) { res.status(401).end(); }
            else {
                const saveResult = await Register_Agent_Save_FullController(
                    {
                        _ref_storeid: String(jwtDecode._ref_storeid),
                        _ref_branchid: String(jwtDecode._ref_branchid),
                        _ref_agentid: String(jwtDecode._ref_agent_userid),
                        agentData: {
                            email: payload.store[0].email,
                            password: payload.password,
                            agentStoreData: {
                                _storeid: String(jwtDecode._ref_storeid),
                                personal: payload.store[0].personal
                            }
                        }
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!saveResult) { res.status(422).end(); }
                else {
                    res.status(201).json(saveResult).end();
                }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

module.exports = router;