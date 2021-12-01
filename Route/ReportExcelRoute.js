const express = require('express');
const router = express.Router();
const { jwtDecode_Login_StoreBranchController } = require('../Controller/JwtController/index');

router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);

// GET => /report/excel/listpatients/:storeid/:datestart/:dateend
const reportExcel_listPatinets = require('../Controller/reportExcelController').reportExcel_listPatinets;
router.get(
    '/listpatients/:storeid/:datestart/:dateend',
    async (req, res) => {
        try {
            const momnet = require('moment')();
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
                    const rpt_ExcelFileName = `Report_Patient_${momnet.format('MM')}${momnet.format('DD')}.xlsx`;

                    const rpt_ExcelOutput = await reportExcel_listPatinets(
                        {
                            _storeid: String(jwtDecodeToekn._ref_storeid),
                            datestart: datestart,
                            dateend: dateend,
                        },
                        (err) => { if (err) { throw err; } }
                    );

                    rpt_ExcelOutput.write(rpt_ExcelFileName, res.status(200));
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// GET => /report/excel/Schedule-Refactor/:datestart/:dateend
const reportXlsx_ScheduleModel_Refactor = require('../Controller/reportExcelController').reportXlsx_ScheduleModel_Refactor;
router.get(
    '/Schedule-Refactor/:datestart/:dateend',
    async (req, res) => {
        try {
            const momnet = require('moment')();
            const { checkAgentId } = require('../Controller/miscController');

            const { datestart, dateend } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
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
                    const rpt_ExcelFileName = `Report_Schedule_${momnet.format('MM')}${momnet.format('DD')}${momnet.format('YYYY')}.xlsx`;

                    const rpt_ExcelOutput = await reportXlsx_ScheduleModel_Refactor(
                        {
                            _storeid: String(jwtDecodeToekn._ref_storeid),
                            _branchid: String(jwtDecodeToekn._ref_branchid),
                            datestart: datestart,
                            dateend: dateend,
                        },
                        (err) => { if (err) { throw err; } }
                    );

                    rpt_ExcelOutput.write(rpt_ExcelFileName, res.status(200));
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

module.exports = router;