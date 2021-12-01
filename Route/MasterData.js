// Route => /masterdata
const express = require('express');
const router = express.Router();
const { jwtDecode_Login_StoreBranchController } = require('../Controller/JwtController/index');


// Route => /masterdata/casetype/:storeid/:branchid
const caseTypeStoreMiddleware_view = require('../Middleware/MasterDataMiddleware').caseTypeStoreMiddleware_view;
const caseTypeStoreController_view = require('../Controller/masterDataController').caseTypeStoreController_view;
router.get(
    '/casetype/:storeid/:branchid',
    caseTypeStoreMiddleware_view,
    async (req, res) => {
        const { storeid, branchid } = req.params;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
        else {
            try {
                const getData = await caseTypeStoreController_view(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid)
                    },
                    (err) => { if (err) { throw err; } }
                );
                
                if (!getData) { res.status(422).end(); }
                else {
                    res.status(200).json(getData).end();
                }

            } catch (error) {
                console.error(error);
                res.status(422).end();
            }
        }
    }
);


// Route GET => /masterdata/time
router.get(
    '/time',
    (req, res) => {
        try {
            const moment = require('moment');
            
            const now_moment = moment();

            const returnJSON = {
                current_date: now_moment,
                current_date_string: now_moment.format('YYYY/MM/DD'),
                current_time_string: now_moment.format('HH:mm:ss')
            };
            
            if (!returnJSON) { res.status(422).end(); }
            else {
                res.status(200).json(returnJSON).end();
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route POST => /masterdata/treatmentrights/create
const treatmentRightsStoreMiddleware_save = require('../Middleware/MasterDataMiddleware').treatmentRightsStoreMiddleware_save;
const treatmentRightsStoreController_save = require('../Controller/masterDataController').treatmentRightsStoreController_save;
router.post(
    '/treatmentrights/create',
    treatmentRightsStoreMiddleware_save,
    async (req, res) => {
        /**
         ** JSON => {
                "name": { type: String },
                "_storeid": { type: StringObjectId },
                "_branchid": { type: StringObjectId },
            }
        */
        const payload = req.body;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
        else {
            try {
                const saveResult = await treatmentRightsStoreController_save(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        name: payload.name,
                        refactor_name: false
                    },
                    (err) => { if (err) { throw err; } }
                );
    
                if (!saveResult) { res.status(422).end(); }
                else {
                    res.status(201).end();
                }
            } catch (error) {
                console.error(error);
                res.status(422).end();
            }
        }
    }
);

// Route PUT => /masterdata/treatmentrights/edit
const treatmentRightsStoreMiddleware_edit = require('../Middleware/MasterDataMiddleware').treatmentRightsStoreMiddleware_edit;
const treatmentRightsStoreController_edit = require('../Controller/masterDataController').treatmentRightsStoreController_edit;
router.put(
    '/treatmentrights/edit',
    treatmentRightsStoreMiddleware_edit,
    async (req, res) => {
        /**
         ** JSON => {
                "name": { type: String },
                "_treatment_rightsid": { type: StringObjectId },
                "_storeid": { type: StringObjectId },
                "_branchid": { type: StringObjectId },
            }
        */
        const payload = req.body;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
        else {
            try {
                const saveResult = await treatmentRightsStoreController_edit(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _treatment_rightsid: payload._treatment_rightsid,
                        name: payload.name,
                        refactor_name: false
                    },
                    (err) => { if (err) { throw err; } }
                );
    
                if (!saveResult) { res.status(422).end(); }
                else {
                    res.status(200).end();
                }

            } catch (error) {
                console.error(error);
                res.status(422).end();
            }
        }
    }
);


// Route PATCH => /masterdata/treatmentrights/edit
const treatmentRightsStoreMiddleware_disabled = require('../Middleware/MasterDataMiddleware').treatmentRightsStoreMiddleware_disabled;
const treatmentRightsStoreController_disabled = require('../Controller/masterDataController').treatmentRightsStoreController_disabled;
router.patch(
    '/treatmentrights/edit',
    treatmentRightsStoreMiddleware_disabled,
    async (req, res) => {
        /**
         ** JSON => {
                "_treatment_rightsid": { type: StringObjectId },
                "_storeid": { type: StringObjectId },
                "_branchid": { type: StringObjectId },
            }
        */
        const payload = req.body;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
        else {
            try {
                const saveResult = await treatmentRightsStoreController_disabled(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _treatment_rightsid: payload._treatment_rightsid,
                    },
                    (err) => { if (err) { throw err; } }
                );
    
                if (!saveResult) { res.status(422).end(); }
                else {
                    res.status(200).end();
                }
            } catch (error) {
                console.error(error);
                res.status(422).end();
            }
        }
    }
);


// Route GET => /masterdata/treatmentrights/:storeid/:branchid
const treatmentRightsStoreMiddleware_view = require('../Middleware/MasterDataMiddleware').treatmentRightsStoreMiddleware_view;
const treatmentRightsStoreController_view = require('../Controller/masterDataController').treatmentRightsStoreController_view;
router.get(
    '/treatmentrights/:storeid/:branchid',
    treatmentRightsStoreMiddleware_view,
    async (req, res) => {
        try {
            /**
             ** Params => {
                    storeid: { type: StringObjectId },
                    branchid: { type: StringObjectId },
                }
            */
            const { storeid, branchid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await treatmentRightsStoreController_view(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );
                
                if (!getResult) { res.status(422).end(); }
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


// Route GET => /masterdata/ptdiagnosis/:storeid/:branchid
const ptDiagnosisStoreMiddleware_view = require('../Middleware/MasterDataMiddleware').ptDiagnosisStoreMiddleware_view;
const ptDiagnosisController_view = require('../Controller/masterDataController').ptDiagnosisController_view;
router.get(
    '/ptdiagnosis/:storeid/:branchid',
    ptDiagnosisStoreMiddleware_view,
    async (req, res) => {
        try {
            /*
            Params => {
                storeid: { type: StringObjectId },
                branchid: { type: StringObjectId },
            }
            */
            const { storeid, branchid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await ptDiagnosisController_view(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!getResult) { res.status(422).end(); }
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


// Route GET => /masterdata/coursegroup/:storeid/:branchid
const courseGroupStoreMiddleware_view = require('../Middleware/MasterDataMiddleware').courseGroupStoreMiddleware_view;
const courseGroupController_view = require('../Controller/masterDataController').courseGroupController_view;
router.get(
    '/coursegroup/:storeid/:branchid',
    courseGroupStoreMiddleware_view,
    async (req, res) => {
        try {
            /*
                Params => {
                    storeid: { type: StringObjectId },
                    branchid: { type: StringObjectId },
                }
            */
            const { storeid, branchid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await courseGroupController_view(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!getResult) { res.status(422).end(); }
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



// Route POST => /masterdata/course/create
const courseMiddleware_save = require('../Middleware/MasterDataMiddleware').courseMiddleware_save;
const courseController_save = require('../Controller/masterDataController').courseController_save;
router.post(
    '/course/create',
    courseMiddleware_save,
    async (req, res) => {
        try {
            /*
                JSON => {
                    "name": { type: String },
                    "_ref_course_groupid": { type: StringObjectId },
                    "price": { type: Number มากกว่า หรือเท่ากับ 0 }
                    "_storeid": { type: StringObjectId },
                    "_branchid": { type: StringObjectId },
                }
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
            else {
                const saveResult = await courseController_save(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        name: payload.name,
                        refactor_name: false,
                        _ref_course_groupid: payload._ref_course_groupid,
                        price: payload.price,
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

// Route PUT => /masterdata/course/edit
const courseMiddleware_edit = require('../Middleware/MasterDataMiddleware').courseMiddleware_edit;
const courseController_edit = require('../Controller/masterDataController').courseController_edit;
router.put(
    '/course/edit',
    courseMiddleware_edit,
    async (req, res) => {
        try {
            /*
                JSON => {
                    "_courseid": { type: StringObjectId },
                    "name": { type: String },
                    "_ref_course_groupid": { type: StringObjectId },
                    "price": { type: Number มากกว่า หรือเท่ากับ 0 },
                    "_storeid": { type: StringObjectId },
                    "_branchid": { type: StringObjectId },
                }
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
            else {
                const editResult = await courseController_edit(
                    {
                        _courseid: payload._courseid,
                        name: payload.name,
                        _ref_course_groupid: payload._ref_course_groupid,
                        price: payload.price,

                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _storeid: payload._storeid,
                        _branchid: payload._branchid,

                        refactor_name: false
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!editResult) { res.status(422).end(); }
                else {
                    res.status(200).json(editResult).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route PATCH => /masterdata/course/edit
const courseMiddleware_switch = require('../Middleware/MasterDataMiddleware').courseMiddleware_switch;
const courseController_switch = require('../Controller/masterDataController').courseController_switch;
router.patch(
    '/course/edit',
    courseMiddleware_switch,
    async (req, res) => {
        try {
            /*
                JSON => {
                    "_courseid": { type: StringObjectId },
                    "_storeid": { type: StringObjectId },
                    "_branchid": { type: StringObjectId },
                }
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
            else {
                const switchResult = await courseController_switch(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _courseid: payload._courseid,
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!switchResult) { res.status(422).end(); }
                else {
                    res.status(200).json(switchResult).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route GET => /masterdata/course/:storeid/:branchid
const courseMiddleware_view = require('../Middleware/MasterDataMiddleware').courseMiddleware_view;
const courseController_view = require('../Controller/masterDataController').courseController_view;
router.get(
    '/course/:storeid/:branchid',
    courseMiddleware_view,
    async (req, res) => {
        try {
            /*
                Params => {
                    storeid: { type: StringObjectId },
                    branchid: { type: StringObjectId },
                }
            */
            const { storeid, branchid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await courseController_view(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!getResult) { res.status(422).end(); }
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

// Route POST => /masterdata/productgroup/create
const productGroupMiddleware_save = require('../Middleware/MasterDataMiddleware').productGroupMiddleware_save;
const productGroupController_save = require('../Controller/masterDataController').productGroupController_save;
router.post(
    '/productgroup/create',
    productGroupMiddleware_save,
    async (req, res) => {
        try {
            /*
                JSON => {
                    "name": { type: String },
                    "_storeid": { type: StringObjectId },
                }
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else {
                const saveResult = await productGroupController_save(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        name: payload.name,
                        refector_name: false,
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!saveResult) { res.status(422).end(); }
                else { res.status(201).json(saveResult).end(); }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// Route PUT => /masterdata/productgroup/edit
const productGroupMiddleware_edit = require('../Middleware/MasterDataMiddleware').productGroupMiddleware_edit;
const productGroupController_edit = require('../Controller/masterDataController').productGroupController_edit;
router.put(
    '/productgroup/edit',
    productGroupMiddleware_edit,
    async (req, res) => {
        try {
            /*
                JSON => {
                    "name": { type: String },
                    "_product_groupid": { type: StringObjectId },
                    "_storeid": { type: StringObjectId },
                }
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else {
                const editResult = await productGroupController_edit(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        name: payload.name,
                        _product_groupid: payload._product_groupid,
                        refector_name: false,
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!editResult) { res.status(422).end(); }
                else {
                    res.status(200).json(editResult).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route PATCH => /masterdata/productgroup/edit
const productGroupMiddleware_switch = require('../Middleware/MasterDataMiddleware').productGroupMiddleware_switch;
const productGroupController_switch = require('../Controller/masterDataController').productGroupController_switch;
router.patch(
    '/productgroup/edit',
    productGroupMiddleware_switch,
    async (req, res) => {
        try {
            /*
                JSON => {
                    "_product_groupid": { type: StringObjectId },
                    "_storeid": { type: StringObjectId },
                }
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else {
                const editResult = await productGroupController_switch(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _product_groupid: payload._product_groupid,
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!editResult) { res.status(422).end(); }
                else { res.status(200).json(editResult).end(); }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// Route GET => /masterdata/productgroup/:storeid/:branchid
// ดู Product Group ทั้งหมด (เฉพาะที่เปิดใช้งานเท่านั้น)
const productGroupMiddleware_view = require('../Middleware/MasterDataMiddleware').productGroupMiddleware_view;
const productGroupController_view = require('../Controller/masterDataController').productGroupController_view;
router.get(
    '/productgroup/:storeid/:branchid',
    productGroupMiddleware_view,
    async (req, res) => {
        try {
            /*
                Params => {
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId },
                }
            */
            const { storeid, branchid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await productGroupController_view(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!getResult) { res.status(422).end(); }
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


// Route GET => /masterdata/productgroup/viewall/:storeid/:branchid
// ดู Product Group ทั้งหมด รวม เปิด-ปิด การใช้งานไปด้วย
// const productGroupMiddleware_view = require('../Middleware/MasterDataMiddleware').productGroupMiddleware_view;
const productGroupController_viewall = require('../Controller/masterDataController').productGroupController_viewall;
router.get(
    '/productgroup/viewall/:storeid/:branchid',
    productGroupMiddleware_view,
    async (req, res) => {
        try {
            /*
                Params => {
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId },
                }
            */
            const { storeid, branchid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await productGroupController_viewall(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!getResult) { res.status(422).end(); }
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


// Route => /masterdata/illness-history
const MasterData_Sub_IllnessHistoryRoute = require('./MasterData_SubRoute/MasterData_IllnessHistoryRoute');
router.use(
    '/illness-history',
    MasterData_Sub_IllnessHistoryRoute
);


module.exports = router;