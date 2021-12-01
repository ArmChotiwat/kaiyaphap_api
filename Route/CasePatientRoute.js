const express = require('express');
const router = express.Router();
const { jwtDecodeData } = require('../Controller/miscController');
const checkCasePatientCaseType = require('../Controller/miscController').checkCasePatientCaseType;
const { jwtDecode_Login_StoreBranchController } = require('../Controller/JwtController/index');

// Route => /casepatient/

router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);

// Route => /casepatient/create
// สร้าง Case Patient (สร้างได้ 1 Case ต่อ 1 คิว)
const casePatinetCreateMiddleware = require('../Middleware/CasePatientMiddleware').casePatinetCreateMiddleware;
const casePatinetCreateValidateMiddleware = require('../Middleware/CasePatientMiddleware').casePatinetCreateValidateMiddleware;
const casePatinetCreateController = require('../Controller/CasePatientController').casePatinetCreateController;
router.post(
    '/create',
    casePatinetCreateMiddleware,
    casePatinetCreateValidateMiddleware,
    async (req, res) => {
        /**
         ** JSON => {
                "_storeid": { type: StringObjectId },
                "_branchid": { type: StringObjectId },
                "_patientid": { type: StringObjectId },
                "_agentid": { type: StringObjectId },
                "_ref_scheduleid": { type: StringObjectId },
                "_casemainid": { type: StringObjectId },
                "_casesubid": { type: StringObjectId }
            }
        */
        const payload = req.body;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
        else {
            const createCase = await casePatinetCreateController(
                {
                    _storeid: String(jwtDecodeToekn._ref_storeid),
                    _branchid: String(jwtDecodeToekn._ref_branchid),
                    _patientid: payload._patientid,
                    _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    _ref_scheduleid: payload._ref_scheduleid,
                    _casemainid: payload._casemainid,
                    _casesubid: payload._casesubid,
                },
                (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                }
            );
            if (!createCase) { res.status(422).end(); }
            else {
                res.status(201).json(createCase).end();
            }
        }
    }
);

// Route => /casepatient/view/:storeid/:branchid/:agentid/:patientid
const viewCasePatientStoreBranchAgentMiddleware = require('../Middleware/CasePatientMiddleware').viewCasePatientStoreBranchAgentMiddleware;
const viewCasePatientStoreBranchAgentController = require('../Controller/CasePatientController').viewCasePatientStoreBranchAgentController;
router.get(
    '/view/:storeid/:branchid/:agentid/:patientid',
    viewCasePatientStoreBranchAgentMiddleware,
    async (req, res) => {
        try {
            const { storeid, branchid, agentid, patientid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await viewCasePatientStoreBranchAgentController(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _patientid: patientid
                    },
                    (err) => { if (err) { res.status(422).end(); } }
                );

                if (!getResult) { res.status(200).end(); }
                else { res.status(200).json(getResult).end(); }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route => /casepatient/viewdetail/:storeid/:branchid/:agentid/:patientid/:casepatientid
const viewCasePatientStoreBranchAgentDetailMiddleware = require('../Middleware/CasePatientMiddleware').viewCasePatientStoreBranchAgentDetailMiddleware;
const viewCasePatientStoreBranchAgentDetailController = require('../Controller/CasePatientController').viewCasePatientStoreBranchAgentDetailController;
router.get(
    '/viewdetail/:storeid/:branchid/:agentid/:patientid/:casepatientid',
    viewCasePatientStoreBranchAgentDetailMiddleware,
    async (req, res) => {
        try {
            const { storeid, branchid, agentid, patientid, casepatientid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await viewCasePatientStoreBranchAgentDetailController(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _patientid: patientid,
                        _casepatientid: casepatientid
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!getResult) { res.status(200).end(); }
                else { res.status(200).json(getResult).end(); }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route => /casepatient/viewstage1/:storeid/:branchid/:agentid/:patientid
const casePatinetViewStage1LastestMiddleware = require('../Middleware/CasePatientMiddleware').casePatinetViewStage1LastestMiddleware;
const casePatinetViewStage1LastestController = require('../Controller/CasePatientController').casePatinetViewStage1LastestController;
router.get(
    '/viewstage1/:storeid/:branchid/:agentid/:patientid',
    casePatinetViewStage1LastestMiddleware,
    async (req, res) => {
        try {
            const { storeid, branchid, agentid, patientid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await casePatinetViewStage1LastestController(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _patientid: patientid
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!getResult) { res.status(200).end(); }
                else { res.status(200).json(getResult).end(); }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route => /casepatient/create/stage1
const casePatinetCreateStage1Middleware = require('../Middleware/CasePatientMiddleware').casePatinetCreateStage1Middleware;
const casePatinetCreateStage1Controller = require('../Controller/CasePatientController').casePatinetCreateStage1Controller;
router.post(
    '/create/stage1',
    casePatinetCreateStage1Middleware,
    async (req, res) => {
        try {
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
            else {
                const createCase_Stage_1 = await casePatinetCreateStage1Controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _patientid: payload._patientid,
                        _casepatientid: payload._casepatientid,
                        _data_stage_1: payload._data_stage_1
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!createCase_Stage_1) { res.status(422).end(); }
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

// Route => /casepatient/create/stage2
const casePatinetCreateStage2Middleware = require('../Middleware/CasePatientMiddleware').casePatinetCreateStage2Middleware;
const casePatinetCreateStage2Controller = require('../Controller/CasePatientController').casePatinetCreateStage2Controller;
router.post(
    '/create/stage2',
    casePatinetCreateStage2Middleware,
    async (req, res) => {
        try {
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
            else {
                const createCase_Stage_1 = await casePatinetCreateStage2Controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _patientid: payload._patientid,
                        _casepatientid: payload._casepatientid,
                        _data_stage_2: payload._data_stage_2,
                        _data_stage_2_neuro: payload._data_stage_2_neuro
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!createCase_Stage_1) { res.status(422).end(); }
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

// Route => /casepatient/create/stage3
const casePatinetCreateStage3Middleware = require('../Middleware/CasePatientMiddleware').casePatinetCreateStage3Middleware;
const casePatinetCreateStage3Controller = require('../Controller/CasePatientController').casePatinetCreateStage3Controller;
router.post(
    '/create/stage3',
    casePatinetCreateStage3Middleware,
    async (req, res) => {
        try {
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
            else {
                const createCase_Stage_3 = await checkCasePatientCaseType(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _patientid: payload._patientid,
                        _casepatientid: payload._casepatientid
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!createCase_Stage_3) { res.status(409).json({ error: `Check Case Type Failed` }).end(); }
                else {
                    if (!createCase_Stage_3._casepatientid || !createCase_Stage_3.main_prefix || !createCase_Stage_3.sub_prefix) { res.status(409).json({ error: `Some of these are not found in stage 3`, _casepatientid: createCase_Stage_3._casepatientid, main_prefix: createCase_Stage_3.main_prefix, sub_prefix: createCase_Stage_3.sub_prefix }).end(); }
                    else {
                        if (createCase_Stage_3.main_prefix === 'O' && createCase_Stage_3.sub_prefix === 'U') {
                            const saveData = await casePatinetCreateStage3Controller.Ortho.Upper(
                                {
                                    _storeid: String(jwtDecodeToekn._ref_storeid),
                                    _branchid: String(jwtDecodeToekn._ref_branchid),
                                    _agentid: String(jwtDecodeToekn._ref_agent_userid),
                                    _patientid: payload._patientid,
                                    _casepatientid: payload._casepatientid,
                                    _data_stage_3_OU: payload._data_stage_3
                                },
                                (err) => { if (err) { throw err; } }
                            );

                            if (!saveData) { res.status(422).end(); }
                            else { res.status(201).end(); }
                        }
                        else if (createCase_Stage_3.main_prefix === 'O' && createCase_Stage_3.sub_prefix === 'L') {
                            const saveData = await casePatinetCreateStage3Controller.Ortho.Lower(
                                {
                                    _storeid: String(jwtDecodeToekn._ref_storeid),
                                    _branchid: String(jwtDecodeToekn._ref_branchid),
                                    _agentid: String(jwtDecodeToekn._ref_agent_userid),
                                    _patientid: payload._patientid,
                                    _casepatientid: payload._casepatientid,
                                    _data_stage_3_OL: payload._data_stage_3
                                },
                                (err) => { if (err) { throw err; } }
                            );

                            if (!saveData) { res.status(422).end(); }
                            else { res.status(201).end(); }
                        }
                        else if (createCase_Stage_3.main_prefix === 'O' && createCase_Stage_3.sub_prefix === 'T') {
                            const saveData = await casePatinetCreateStage3Controller.Ortho.TrunkSpine(
                                {
                                    _storeid: String(jwtDecodeToekn._ref_storeid),
                                    _branchid: String(jwtDecodeToekn._ref_branchid),
                                    _agentid: String(jwtDecodeToekn._ref_agent_userid),
                                    _patientid: payload._patientid,
                                    _casepatientid: payload._casepatientid,
                                    _data_stage_3_OTS: payload._data_stage_3
                                },
                                (err) => { if (err) { throw err; } }
                            );

                            if (!saveData) { res.status(422).end(); }
                            else { res.status(201).end(); }
                        }
                        else if (createCase_Stage_3.main_prefix === 'O' && createCase_Stage_3.sub_prefix === 'G') {
                            const saveData = await casePatinetCreateStage3Controller.Ortho.General(
                                {
                                    _storeid: String(jwtDecodeToekn._ref_storeid),
                                    _branchid: String(jwtDecodeToekn._ref_branchid),
                                    _agentid: String(jwtDecodeToekn._ref_agent_userid),
                                    _patientid: payload._patientid,
                                    _casepatientid: payload._casepatientid,
                                    _data_stage_3_OG: payload._data_stage_3
                                },
                                (err) => { if (err) { throw err; } }
                            );

                            if (!saveData) { res.status(422).end(); }
                            else { res.status(201).end(); }
                        }
                        else { res.status(409).json({ error: `Case tyoe of <main_prefix> and <sub_prefix> is out of rule` }).end(); }
                    }
                }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// Route POST => /casepatient/create/stage3neuro
const casePatinetCreateStage3_Neuro_Middleware = require('../Middleware/CasePatientMiddleware').casePatinetCreateStage3NeuroMiddleware;
const casePatinetCreateStage3_Neuro_Controller = require('../Controller/CasePatientController').casePatinetCreateStage3_Neuro_Controller;
router.post(
    '/create/stage3neuro',
    casePatinetCreateStage3_Neuro_Middleware,
    async (req, res) => {
        try {
            const payload = req.body;            
            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else {
                const saveData = await casePatinetCreateStage3_Neuro_Controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _patientid: payload._patientid,
                        _casepatientid: payload._casepatientid,
                        _data_stage_3_neuro: payload.stage3data_nuero
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!saveData) { res.status(422).end(); }
                else { res.status(201).end(); }

            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// Route GET => /casepatient/viewcasestatus/:storeid/:branchid/:agentid/:patientid/:casepatient
// ดูสถาณะ Case, First Time Treatment of Case และ Nex Visit Treatment of Case
const casePatient_View_CaseStatus_Middleware = require('../Middleware/CasePatientMiddleware').casePatient_View_CaseStatus_Middleware;
const casePatient_View_CaseStatus_Controller = require('../Controller/CasePatientController').casePatient_View_CaseStatus_Controller;
router.get(
    '/viewcasestatus/:storeid/:branchid/:agentid/:patientid/:casepatient',
    casePatient_View_CaseStatus_Middleware,
    async (req, res) => {
        try {
            /**
             ** Paramter => {
                "storeid": { type: StringObjectId },
                "branchid": { type: StringObjectId },
                "agentid": { type: StringObjectId },
                "patientid": { type: StringObjectId },
                "casepatient": { type: StringObjectId },
             }
             */
            const { storeid, branchid, agentid, patientid, casepatient } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await casePatient_View_CaseStatus_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _ref_patientid: patientid,
                        _ref_casepatientid: casepatient
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!getResult) { res.status(200).end(); }
                else { res.status(200).json(getResult).end(); }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// Route GET => /view/relatedcasestatus?_ref_storeid&_ref_branchid&_ref_casepatientid&skip
// ดูสถาณะ ส่วน Treatment, Next Visit Treatment, Progression Note และ Purchase Order ของ CasePatient
const CasePatient_View_Related_Status_Middleware = require('../Middleware/CasePatientMiddleware').CasePatient_View_Related_Status_Middleware;
const CasePatient_View_Related_Status_Controller = require('../Controller/CasePatientController').CasePatient_View_Related_Status_Controller;
router.get(
    '/view/relatedcasestatus',
    CasePatient_View_Related_Status_Middleware,
    async (req, res) => {
        /**
         ** Query Params => {
                "_ref_storeid": { type: StringObjectId },
                "_ref_branchid": { type: StringObjectId },
                "_ref_casepatientid": { type: StringObjectId },
                "skip": { type: Number morethan or equal 0 },
            }
        */
        const { _ref_storeid, _ref_branchid, _ref_casepatientid, skip } = req.query;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== _ref_storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== _ref_branchid) { res.status(401).end(); }
        else {
            const getResult = await CasePatient_View_Related_Status_Controller(
                {
                    _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                    _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                    _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                    _ref_casepatientid: _ref_casepatientid,
                    skip: Math.ceil(Math.abs(Number(skip)))
                },
                (err) => { if (err) { console.error(err); return; } }
            );

            if (!getResult) { res.status(422).end(); }
            else {
                res.status(200).json(getResult).end();
            }
        }
    }
);

// Route => /casepatient/create/stage2/image
const casePatinetCreateCaseStage2_Image_Middleware = require('../Middleware/CasePatientMiddleware').case_PatinetCreateCase_Stage_2_Image_Middleware;
const casePatinetCreateCaseStage2_Image_Controller = require('../Controller/CasePatientController').casePatinetCreateCaseStage2ImageController;
router.post(
    '/create/stage2/image',
    casePatinetCreateCaseStage2_Image_Middleware,
    async (req, res) => {
        try {
            /**
             ** Paramter => {
                "_casepatientid": { type: StringObjectId },
                "file": {type : file}
             }
             */
            const payload = req.body;

            const authorlization = req.header("authorization");
            /**
             ** JWTToken => {
                    _agentid: { type: StringObjectId },
                }
            */
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);
            if (!jwtDecodeToekn) { res.status(401).end(); }
            else {
                const file = req.files
                const createCase_Stage_2 = await casePatinetCreateCaseStage2_Image_Controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _casepatientid: payload._casepatientid,
                        file: file
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!createCase_Stage_2) { res.status(422).end(); }
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

// Route => /casepatient/create/closure
const casePatientClosureController = require('../Controller/CasePatientController').casePatientClosureController;
router.post(
    '/create/closure',
    async (req, res) => {
        try {
            /**
             ** Paramter => {                                
                _ref_storeid: { type: StringObjectId },
                _ref_branchid: { type: StringObjectId },
                _ref_casepatientid: { type: StringObjectId },
             }
             */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._ref_storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._ref_branchid) { res.status(401).end(); }
            else {
                const casePatient_Closure = await casePatientClosureController(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _ref_casepatientid: payload._ref_casepatientid,
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!casePatient_Closure) { res.status(422).end(); }
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
module.exports = router;