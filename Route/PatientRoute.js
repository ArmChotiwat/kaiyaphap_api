const express = require('express');
const router = express.Router();
const { jwtDecode_Login_StoreBranchController } = require('../Controller/JwtController/index');


// Route => /patient2
router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);


// Route POST => /patient2/register/full
// เพิ่มเวชระเบียนผู้ป่วย (แบบเต็มรูปแบบ)
const Register_Patient_Save_FullMiddleware = require('../Middleware/RegisterMiddleware').Register_Patient_Save_FullMiddleware;
const Register_Patient_Save_FullController = require('../Controller/RegisterController').Register_Patient_Save_FullController;
router.post(
    '/register/full',
    Register_Patient_Save_FullMiddleware,
    async (req, res) => {
        try {
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload.store[0]._storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload.store[0].register_from_branch) { res.status(401).end(); }
            else {
                const saveResult = await Register_Patient_Save_FullController(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                        hn_ref: payload.store[0].hn_ref,
                        patientPersonalData: payload.store[0].personal
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!saveResult) { res.status(422).end(); }
                else {
                    res.status(201).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route PUT => /patient2/edit/full
// แก้ไขเวชระเบียนผู้ป่วย (แบบเต็มรูปแบบ)
const Register_Patient_Edit_FullMiddleware = require('../Middleware/RegisterMiddleware').Register_Patient_Edit_FullMiddleware;
const Register_Patient_Edit_FullController = require('../Controller/RegisterController').Register_Patient_Edit_FullController;
router.put(
    '/edit/full',
    Register_Patient_Edit_FullMiddleware,
    async (req, res) => {
        const { checkAgentId } = require('../Controller/miscController');

        const payload = req.body;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== payload.store[0]._storeid) { res.status(401).end(); }
        else {
            try {
                const findAgent = await checkAgentId(
                    {
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid)
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!findAgent) { res.status(401).end(); }
                else {
                    const updateResult = await Register_Patient_Edit_FullController(
                        {
                            _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                            _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                            _ref_agent_userid: String(jwtDecodeToekn._ref_agent_userid),
                            _ref_patient_userid: payload._id,
                            patientPersonalData: payload.store[0].personal
                        },
                        (err) => { if (err) { throw err; } }
                    );

                    if (!updateResult) { res.status(422).end(); }
                    else {
                        res.status(200).end();
                    }
                }
            } catch (error) {
                console.error(error);
                res.status(422).end();
            }
        }
    }
);

// Route POST => /patient2/register/quick
// เพิ่มเวชระเบียนผู้ป่วย (แบบด่วน)
const Register_Patient_Save_QuickMiddleware = require('../Middleware/RegisterMiddleware').Register_Patient_Save_QuickMiddleware;
const Register_Patient_Save_QuickController = require('../Controller/RegisterController').Register_Patient_Save_QuickController;
router.post(
    '/register/quick',
    Register_Patient_Save_QuickMiddleware,
    async (req, res) => {
        const { checkAgentId } = require('../Controller/miscController');
        /**
         ** JSON => {
                _ref_storeid: { type: ObjectId },
                _ref_branchid: { type: ObjectId },
                pre_name: { type: String },
                special_prename: { type: String OR Null },
                first_name: { type: String },
                last_name: { type: String },
                phone_number: { type: String },
            }
        ** Remark
            ** special_prename จะเป็น Null ก็ต่อมื่อ pre_name ไม่เป็นคำว่า "อื่นๆ"
        */
        const payload = req.body;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== payload._ref_storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== payload._ref_branchid) { res.status(401).end(); }
        else {
            try {
                const chkAgentId = await checkAgentId(
                    {
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgentId) { res.status(401).end(); }
                else {
                    const saveResult = await Register_Patient_Save_QuickController(
                        {
                            _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                            _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                            _ref_agent_userid: String(jwtDecodeToekn._ref_agent_userid),
                            pre_name: payload.pre_name,
                            special_prename: payload.special_prename,
                            first_name: payload.first_name,
                            last_name: payload.last_name,
                            phone_number: payload.phone_number
                        },
                        (err) => { if (err) { throw err; } }
                    );

                    if (!saveResult) { res.status(422).end(); }
                    else {
                        const sent_patientid = { patientid: String(saveResult._id) };
                        res.status(201).send(sent_patientid).end();
                    }
                }

            } catch (error) {
                console.error(error);
                res.status(422).end();
            }
        }
    }
);

// Route POST => /patient2/register/excel
// เพิ่มเวชระเบียนผู้ป่วย (Import Excel)
const Register_Patient_Save_ExcelMiddleware = require('../Middleware/RegisterMiddleware').Register_Patient_Save_ExcelMiddleware;
const Register_Patient_Save_ExcelController = require('../Controller/RegisterController').Register_Patient_Save_ExcelController;
router.post(
    '/register/excel',
    Register_Patient_Save_ExcelMiddleware,
    async (req, res) => {
        const { checkAgentId } = require('../Controller/miscController');

        const payload = req.body;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== payload.store[0]._storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== payload.store[0].register_from_branch) { res.status(401).end(); }
        else {
            try {
                const chkAgentId = await checkAgentId(
                    {
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgentId) { res.status(401).end(); }
                else {
                    const saveResult = await Register_Patient_Save_ExcelController(
                        {
                            _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                            _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                            _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                            hn_ref: payload.store[0].hn_ref,
                            patientPersonalData: payload.store[0].personal
                        },
                        (err) => { if (err) { throw err; } }
                    );

                    if (!saveResult) { res.status(422).end(); }
                    else {
                        res.status(201).end();
                    }
                }

            } catch (error) {
                console.error(error);
                res.status(422).end();
            }
        }
    }
);


// Route GET => /patient2/viewpatient
// ดูข้อมูลผู้ป่วย (รายบุคคล)
const view_Patient_DetailMiddleware = require('../Middleware/PatientMiddleware').view_Patient_DetailMiddleware;
const view_Patient_DetailController = require('../Controller/PatientController').view_Patient_DetailController;
router.get(
    '/viewpatient',
    view_Patient_DetailMiddleware,
    async (req, res) => {
        try {
            /**
             ** Query => {
                    "storeid": { typer: StringObjectId },
                    "patient_userid": { typer: StringObjectId },
                }
            */
            const { storeid, patient_userid } = req.query;

            const jwtDecode = jwtDecode_Login_StoreBranchController(req.header('authorization'));

            if (!jwtDecode) { res.status(401).end(); }
            else if (String(jwtDecode._ref_storeid) !== storeid) { res.status(401).end(); }
            else {
                const getResult = await view_Patient_DetailController(
                    {
                        _ref_storeid: String(jwtDecode._ref_storeid),
                        _ref_branchid: String(jwtDecode._ref_branchid),
                        _ref_agent_userid: String(jwtDecode._ref_agent_userid),
                        _ref_patient_userid: patient_userid
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



// Route POST => /patient2/search
// ค้นหาผู้ป่วย (List รายการ)
const search_Patient_ListMiddleware = require('../Middleware/PatientMiddleware').search_Patient_ListMiddleware;
const search_Patient_ListController = require('../Controller/PatientController').search_Patient_ListController;
router.post(
    '/search',
    search_Patient_ListMiddleware,
    async (req, res) => {
        try {
            const payload = req.body;

            const jwtDecode = jwtDecode_Login_StoreBranchController(req.header('authorization'));

            if (!jwtDecode) { res.status(401).end(); }
            else if (String(jwtDecode._ref_storeid) !== payload.storeid) { res.status(401).end(); }
            else {
                const getResult = await search_Patient_ListController(
                    {
                        _ref_storeid: payload.storeid,
                        user_status: payload.user_status,
                        idcard: payload.idcard,
                        email: payload.email,
                        pre_name: payload.pre_name,
                        first_name: payload.first_name,
                        last_name: payload.last_name,
                        hn: payload.hn,
                        homenumber: payload.homenumber,
                        alley: payload.alley,
                        village_number: payload.village_number,
                        village: payload.village,
                        building: payload.building,
                        province: payload.province,
                        district: payload.district,
                        subdistrict: payload.subdistrict,
                        postcode: payload.postcode,
                        phone_number: payload.phone_number,
                        hn_ref: payload.hn_ref,
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


module.exports = router;