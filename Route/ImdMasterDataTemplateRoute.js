// *** Route => /imd/masterdatatemplate
const express = require('express');
const router = express.Router();
const jwtDecodeData = require('../Controller/miscController').jwtDecodeData;

router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);

// Route => /imd/masterdatatemplate/casemaintype
const caseTypeSaveMiddleware = require('../Middleware/ImdMasterDataTemplateMiddleware').caseTypeSaveMiddleware;
const caseTypeController_save = require('../Controller/ImdMasterDataTemplateController').caseTypeController_save;
router.post(
    '/casemaintype',
    caseTypeSaveMiddleware,
    async (req, res) => {
        const payload = req.body;
        const savedata = await caseTypeController_save(
            {
                mainname: payload.mainname,
                prefix: payload.prefix
            },
            (err) => { 
                if(err) { 
                    res.status(422).end();
                } 
            }
        );
        if(savedata) {
            if(savedata === 'name_exists') { res.status(200).end(); }
            else { res.status(201).end(); }
        }
    }
);

const caseTypeController_view = require('../Controller/ImdMasterDataTemplateController').caseTypeController_view;
router.get(
    '/casemaintype',
    async (req, res) => {
        const getAllData = await caseTypeController_view(
            (err) => {
                if(err) {
                    res.status(422).end();
                }
            }
        );
        
        res.status(200).json(getAllData).end();
    }
);


// Route => /imd/masterdatatemplate/casesubtype
const caseSubTypeSaveMiddleware = require('../Middleware/ImdMasterDataTemplateMiddleware').caseSubTypeSaveMiddleware;
const caseSubTypeController_save = require('../Controller/ImdMasterDataTemplateController').caseSubTypeController_save;
router.post(
    '/casesubtype',
    caseSubTypeSaveMiddleware,
    async (req, res) => {
        const payload = req.body;
        const savedata = await caseSubTypeController_save(
            {
                mainname: payload.mainname,
                subname: payload.subname,
                prefix: payload.prefix
            },
            (err) => { 
                if(err) { 
                    res.status(422).end();
                } 
            }
        );
        if(savedata) {
            if(savedata === 'main_type_not_exists') { res.status(200).end(); }
            else if(savedata === 'sub_type_exists') { res.status(200).end(); }
            else { res.status(201).end(); }
        }
    }
);


// Route => /imd/masterdatatemplate/casetype/create
const caseTypeStoreMiddleware_save = require('../Middleware/MasterDataMiddleware').caseTypeStoreMiddleware_save;
const caseTypeStoreController_save = require('../Controller/masterDataController').caseTypeStoreController_save;
router.post(
    '/casetype/create',
    caseTypeStoreMiddleware_save,
    async (req, res) => {
        const payload = req.body;
        await caseTypeStoreController_save(
            {
                _storeid: payload._storeid,
                _branchid: payload._branchid
            },
            (error) => {
                if(error) {
                    res.status(422).end();
                }
            }
        );
        res.status(201).end();
    }
);


// Route => /imd/masterdatatemplate/treatmentrights
/*
const treatmentRights_Save_Controller = require('../Controller/ImdMasterDataTemplateController').treatmentRights_Save_Controller;
router.post(
    '/treatmentrights',
    async (req, res) => {
        const payload = req.body;
        const saveResult = await treatmentRights_Save_Controller(
            {
                name: payload.name,
                _agentid: '5e869c3dc893665810a4b555',
                refactor_name: true
            },
            (err) => { if(err) { console.error(err); res.status(422).end(); } }
        );
        if(!saveResult) { res.status(500).end(); }
        else { res.status(200).json(saveResult).end(); }
    }
);
*/


// Route POST => /imd/masterdatatemplate/ptdiagnosis/create
const templatePtDiagnosisController_save = require('../Controller/ImdMasterDataTemplateController').templatePtDiagnosisController_save;
router.post(
    '/ptdiagnosis/create',
    async (req, res) => {
        /*
            JSON => {
                "name": { type: String },
            },
            JWTToken => {
                _agentid: { type: StringObjectId },
                username: { type: String }
            }
        */
        const authorlization = req.header("authorization");
        const payload = req.body;

        const jwtDecodeToekn = jwtDecodeData(authorlization);
        // const jwtDecodeToekn = { _agentid: '5e869c3dc893665810a4b555', username: 'kaiyaphap@imd.co.th' };

        if(!jwtDecodeToekn) { res.status(401).end(); }
        else {
            const saveResult = await templatePtDiagnosisController_save(
                {
                    name: payload.name,
                    _agentid: jwtDecodeToekn._agentid,
                    imd_username: jwtDecodeToekn.username,
                    refactor_name: false
                },
                (err) => { if(err) { console.error(err); res.status(422).end(); } }
            );
            if(!saveResult) { res.status(422).end(); }
            else { res.status(201).json(saveResult).end(); }
        }
    }
);


// Route PUT => /imd/masterdatatemplate/ptdiagnosis/edit
const templatePtDiagnosisController_edit = require('../Controller/ImdMasterDataTemplateController').templatePtDiagnosisController_edit;
router.put(
    '/ptdiagnosis/edit',
    async (req, res) => {
        /*
            JSON => {
                "name": { type: Srting },
                "_pt_diagnosisid": { type: StringObjectId },
            },
            JWTToken => {
                _agentid: { type: StringObjectId },
                imd_username: { type: String }
            }
        */
        const authorlization = req.header("authorization");
        const payload = req.body;

        const jwtDecodeToekn = jwtDecodeData(authorlization);
        // const jwtDecodeToekn = { _agentid: '5e869c3dc893665810a4b555', username: 'kaiyaphap@imd.co.th' };

        if(!jwtDecodeToekn) { res.status(401).end(); }
        else {
            const editResult = await templatePtDiagnosisController_edit(
                {
                    name: payload.name,
                    _pt_diagnosisid: payload._pt_diagnosisid,
                    _agentid: jwtDecodeToekn._agentid,
                    imd_username: jwtDecodeToekn.username,
                    refactor_name: false
                },
                (err) => { if(err) { console.error(err); res.status(422).end(); } }
            );
            if(!editResult) { res.status(422).end(); }
            else { res.status(201).json(editResult).end(); }
        }
    }
);


// Route PATCH => /imd/masterdatatemplate/ptdiagnosis/edit
const templatePtDiagnosisController_switch = require('../Controller/ImdMasterDataTemplateController').templatePtDiagnosisController_switch;
router.patch(
    '/ptdiagnosis/edit',
    async (req, res) => {
        /*
            JSON => {
                "_pt_diagnosisid": { type: StringObjectId },
            },
            JWTToken => {
                _agentid: { type: StringObjectId },
                imd_username: { type: String }
            }
        */
        const authorlization = req.header("authorization");
        const payload = req.body;

        const jwtDecodeToekn = jwtDecodeData(authorlization);
        // const jwtDecodeToekn = { _agentid: '5e869c3dc893665810a4b555', username: 'kaiyaphap@imd.co.th' };

        if(!jwtDecodeToekn) { res.status(401).end(); }
        else {
            const editResult = await templatePtDiagnosisController_switch(
                {
                    _pt_diagnosisid: payload._pt_diagnosisid,
                    _agentid: jwtDecodeToekn._agentid,
                    imd_username: jwtDecodeToekn.username
                },
                (err) => { if(err) { console.error(err); res.status(422).end(); } }
            );
            if(!editResult) { res.status(422).end(); }
            else { res.status(201).json(editResult).end(); }
        }
    }
);

// Route GET => /imd/masterdatatemplate/ptdiagnosis
const templatePtDiagnosisController_view = require('../Controller/ImdMasterDataTemplateController').templatePtDiagnosisController_view;
router.get(
    '/ptdiagnosis',
    async (req, res) => {
        /*
            JWTToken => {
                _agentid: { type: StringObjectId },
                username: { type: String }
            }
        */
        const authorlization = req.header("authorization");
        const payload = req.body;

        const jwtDecodeToekn = jwtDecodeData(authorlization);
        // const jwtDecodeToekn = { _agentid: '5e869c3dc893665810a4b555', username: 'kaiyaphap@imd.co.th' };

        if(!jwtDecodeToekn) { res.status(401).end(); }
        else {
            const getResult = await templatePtDiagnosisController_view(
                {
                    _agentid: jwtDecodeToekn._agentid,
                    imd_username: jwtDecodeToekn.username,
                },
                (err) => { if(err) { console.error(err); res.status(422).end(); } }
            );
            if(!getResult) { res.status(422).end(); }
            else { res.status(200).json(getResult).end(); }
        }
    }
);


// Route POST => /imd/masterdatatemplate/coursegroup/create
const templateCourseGroupController_save = require('../Controller/ImdMasterDataTemplateController').templateCourseGroupController_save;
router.post(
    '/coursegroup/create',
    async (req, res) => {
        /*
            JSON => {
                "name": { type: String },
            },
            JWTToken => {
                _agentid: { type: StringObjectId },
                username: { type: String }
            }
        */
        const authorlization = req.header("authorization");
        const payload = req.body;

        const jwtDecodeToekn = jwtDecodeData(authorlization);
        // const jwtDecodeToekn = { _agentid: '5e869c3dc893665810a4b555', username: 'kaiyaphap@imd.co.th' };

        if(!jwtDecodeToekn) { res.status(401).end(); }
        else {
            const saveResult = await templateCourseGroupController_save(
                {
                    name: payload.name,
                    _agentid: jwtDecodeToekn._agentid,
                    imd_username: jwtDecodeToekn.username,
                    refactor_name: false
                },
                (err) => { if(err) { console.error(err); res.status(422).end(); } }
            );
            if(!saveResult) { res.status(422).end(); }
            else { res.status(201).json(saveResult).end(); }
        }
    }
);


// Route PUT => /imd/masterdatatemplate/coursegroup/edit
const templateCourseGroupController_edit = require('../Controller/ImdMasterDataTemplateController').templateCourseGroupController_edit;
router.put(
    '/coursegroup/edit',
    async (req, res) => {
        /*
            JSON => {
                "name": { type: Srting },
                "_course_groupid": { type: StringObjectId },
            },
            JWTToken => {
                _agentid: { type: StringObjectId },
                imd_username: { type: String }
            }
        */
        const authorlization = req.header("authorization");
        const payload = req.body;

        const jwtDecodeToekn = jwtDecodeData(authorlization);
        // const jwtDecodeToekn = { _agentid: '5e869c3dc893665810a4b555', username: 'kaiyaphap@imd.co.th' };

        if(!jwtDecodeToekn) { res.status(401).end(); }
        else {
            const editResult = await templateCourseGroupController_edit(
                {
                    name: payload.name,
                    _course_groupid: payload._course_groupid,
                    _agentid: jwtDecodeToekn._agentid,
                    imd_username: jwtDecodeToekn.username,
                    refactor_name: false
                },
                (err) => { if(err) { console.error(err); res.status(422).end(); } }
            );
            if(!editResult) { res.status(422).end(); }
            else { res.status(201).json(editResult).end(); }
        }
    }
);


// Route PATCH => /imd/masterdatatemplate/coursegroup/edit
const templateCourseGroupController_switch = require('../Controller/ImdMasterDataTemplateController').templateCourseGroupController_switch;
router.patch(
    '/coursegroup/edit',
    async (req, res) => {
        /*
            JSON => {
                "_course_groupid": { type: StringObjectId },
            },
            JWTToken => {
                _agentid: { type: StringObjectId },
                imd_username: { type: String }
            }
        */
        const authorlization = req.header("authorization");
        const payload = req.body;

        const jwtDecodeToekn = jwtDecodeData(authorlization);
        // const jwtDecodeToekn = { _agentid: '5e869c3dc893665810a4b555', username: 'kaiyaphap@imd.co.th' };

        if(!jwtDecodeToekn) { res.status(401).end(); }
        else {
            const editResult = await templateCourseGroupController_switch(
                {
                    _course_groupid: payload._course_groupid,
                    _agentid: jwtDecodeToekn._agentid,
                    imd_username: jwtDecodeToekn.username
                },
                (err) => { if(err) { console.error(err); res.status(422).end(); } }
            );
            if(!editResult) { res.status(422).end(); }
            else { res.status(201).json(editResult).end(); }
        }
    }
);

// Route GET => /imd/masterdatatemplate/coursegroup
const templateCourseGroupController_view = require('../Controller/ImdMasterDataTemplateController').templateCourseGroupController_view;
router.get(
    '/coursegroup',
    async (req, res) => {
        /*
            JWTToken => {
                _agentid: { type: StringObjectId },
                username: { type: String }
            }
        */
        const authorlization = req.header("authorization");
        const payload = req.body;

        const jwtDecodeToekn = jwtDecodeData(authorlization);
        // const jwtDecodeToekn = { _agentid: '5e869c3dc893665810a4b555', username: 'kaiyaphap@imd.co.th' };

        if(!jwtDecodeToekn) { res.status(401).end(); }
        else {
            const getResult = await templateCourseGroupController_view(
                {
                    _agentid: jwtDecodeToekn._agentid,
                    imd_username: jwtDecodeToekn.username,
                },
                (err) => { if(err) { console.error(err); res.status(422).end(); } }
            );
            if(!getResult) { res.status(422).end(); }
            else { res.status(200).json(getResult).end(); }
        }
    }
);


module.exports = router;