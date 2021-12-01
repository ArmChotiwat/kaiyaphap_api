// *** Route => /imd/report/raw
const express = require('express');
const router = express.Router();

const patientRawReportController = require('../Controller/ImdReportRawController').patientRawReportController;
const patientRawReportMiddleware = require('../Middleware/ImdReportRawMiddleware').patientRawReportMiddleware;

router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);

const patientRegisterInStoreTimelineController = patientRawReportController.patientRegisterInStoreTimelineController;
const patientRegisterInStoreTimelineMiddleware = patientRawReportMiddleware.patientRegisterInStoreTimelineMiddleware;
router.get( // GET => /imd/report/raw/patient/registertimeline/:storeid/:rdate ### rdate is "YYYY-MM-DD" "2020-05-26"
    '/patient/registertimeline/:storeid/:rdate',
    patientRegisterInStoreTimelineMiddleware,
    async (req, res) => {
        const { storeid, rdate } = req.params;
        const getResult = await patientRegisterInStoreTimelineController(
            {
                _storeid: storeid,
                getDate: rdate
            },
            (err) => { if (err) { console.log(err); res.status(422).end(); } }
        );
        if (!getResult) { res.status(200).end(); }
        else { res.status(200).json(getResult).end(); }
    }
);

const countPatientInStoreController = patientRawReportController.countPatientInStoreController;
const countPatientInStoreMiddleware = patientRawReportMiddleware.countPatientInStoreMiddleware;
router.get( // GET => /imd/report/raw/patient/count/:storeid
    '/patient/count/:storeid',
    countPatientInStoreMiddleware,
    async (req, res) => {
        const { storeid } = req.params;
        const getResult = await countPatientInStoreController(
            {
                _storeid: storeid
            },
            (err) => { if (err) { console.log(err); res.status(422).end(); } }
        );
        if (!getResult) { res.status(200).end(); }
        else { res.status(200).json(getResult[0]).end(); }
    }
);

const countPatientInStoreFilterByGenderController = patientRawReportController.countPatientInStoreFilterByGenderController;
router.get( // GET => /imd/report/raw/patient/count/:storeid/:gender ### gender is "0" = ชาย, "1" = หญิง
    '/patient/count/:storeid/:gender',
    async (req, res) => {
        const { storeid, gender } = req.params;
        const getResult = await countPatientInStoreFilterByGenderController(
            {
                _storeid: storeid,
                getGender: parseInt(gender)
            },
            (err) => { if (err) { console.log(err); res.status(422).end(); } }
        );
        if (!getResult) { res.status(200).end(); }
        else { res.status(200).json(getResult[0]).end(); }
    }
);

const countAgePatientStoreController = patientRawReportController.countAgePatientStoreController;
router.get( // GET => /imd/report/raw/patient/agecount/:storeid
    '/patient/agecount/:storeid',
    async (req, res) => {
        const { storeid } = req.params;
        const getResult = await countAgePatientStoreController(
            {
                _storeid: storeid
            },
            (err) => { if (err) { console.error(err); res.status(422).end(); } }
        );
        if (!getResult) { res.status(200).end(); }
        else { res.status(200).json(getResult).end(); }
    }
);

const countScheduleAllFilterByStoreController = patientRawReportController.countScheduleAllFilterByStoreController;
router.get( // GET => /imd/report/raw/schedule/count/:storeid
    '/schedule/count/:storeid',
    async (req, res) => {
        const { storeid } = req.params;
        const getResult = await countScheduleAllFilterByStoreController(
            {
                _storeid: storeid
            },
            (err) => { if (err) { console.error(err); res.status(422).end(); } }
        );
        if (!getResult) { res.status(200).end(); }
        else { res.status(200).json(getResult).end(); }
    }
);

const countScheduleAllFilterByStoreAndMonthController = patientRawReportController.countScheduleAllFilterByStoreAndMonthController
router.get( // GET => /imd/report/raw/schedule/count/:storeid/:rdate ### rdate is "YYYY-MM-DD" "2020-05-26"
    '/schedule/count/:storeid/:rdate',
    async (req, res) => {
        const { storeid, rdate } = req.params;
        const getResult = await countScheduleAllFilterByStoreAndMonthController(
            {
                _storeid: storeid,
                getDate: rdate
            },
            (err) => { if (err) { console.log(err); res.status(422).end(); } }
        );
        if (!getResult) { res.status(200).end(); }
        else { res.status(200).json(getResult).end(); }
    }
);


const countScheduleAllFilterByStoreWithBranchController = patientRawReportController.countScheduleAllFilterByStoreWithBranchController;
router.get( // GET => /imd/report/raw/schedulebranch/count/:storeid/:branchid
    '/schedulebranch/count/:storeid/:branchid',
    async (req, res) => {
        const { storeid, branchid } = req.params;
        const getResult = await countScheduleAllFilterByStoreWithBranchController(
            {
                _storeid: storeid,
                _branchid: branchid
            },
            (err) => { if (err) { console.error(err); res.status(422).end(); } }
        );
        if (!getResult) { res.status(200).end(); }
        else { res.status(200).json(getResult).end(); }
    }
);


const countScheduleAllFilterByStoreWithBranchAndMonthController = patientRawReportController.countScheduleAllFilterByStoreWithBranchAndMonthController;
router.get( // GET => /imd/report/raw/schedulebranch/count/:storeid/:branchid/:rdate ### rdate is "YYYY-MM-DD" "2020-05-26"
    '/schedulebranch/count/:storeid/:branchid/:rdate',
    async (req, res) => {
        const { storeid, branchid, rdate } = req.params;
        const getResult = await countScheduleAllFilterByStoreWithBranchAndMonthController(
            {
                _storeid: storeid,
                _branchid: branchid,
                getDate: rdate
            },
            (err) => { if (err) { console.log(err); res.status(422).end(); } }
        );
        if (!getResult) { res.status(200).end(); }
        else { res.status(200).json(getResult).end(); }
    }
);

const countRevinueStoreAndCountVisitController = patientRawReportController.countRevinueStoreAndCountVisitController;
router.get( // GET => /imd/report/raw/visit/count/:storeid/:rdate ### rdate is "YYYY-MM-DD" "2020-05-26"
    '/visit/count/:storeid/:rdate',
    async (req, res) => {
        const { storeid, rdate } = req.params;
        const getResult = await countRevinueStoreAndCountVisitController(
            {
                _storeid: storeid,
                getDate: rdate
            },
            (err) => { if (err) { console.log(err); res.status(422).end(); } }
        );
        if (!getResult) { res.status(200).end(); }
        else { res.status(200).json(getResult).end(); }
    }
);

const sumRevinueStoreForIncomeController = patientRawReportController.sumRevinueStoreForIncomeController;
router.get( // GET => /imd/report/raw/revinue/income/:storeid/:rdate ### rdate is "YYYY-MM-DD" "2020-05-26"
    '/revinue/income/:storeid/:rdate',
    async (req, res) => {
        const { storeid, rdate } = req.params;
        const getResult = await sumRevinueStoreForIncomeController(
            {
                _storeid: storeid,
                getDate: rdate
            },
            (err) => { if (err) { console.log(err); res.status(422).end(); } }
        );
        if (!getResult) { res.status(200).end(); }
        else { res.status(200).json(getResult).end(); }
    }
);
module.exports = router;