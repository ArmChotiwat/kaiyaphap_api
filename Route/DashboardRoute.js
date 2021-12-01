const express = require('express');
const router = express.Router();
const { jwtDecode_Login_StoreBranchController } = require('../Controller/JwtController/index');

// Route => /dashboard/
router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);

// Route => /dashboard/view/
const View_Dashboard_Middleware = require('../Middleware/DashboardMiddleware/code/ViewDashboardMiddleware')
const View_Dashboard_Controller = require('../Controller/DashboardController/index').View_Dashboard_Controller

router.get(
    '/view',
    View_Dashboard_Middleware,
    async (req, res) => {
        try {
            /**
             ** Paramter => {
                    "_storeid": { type: StringObjectId },
                    "_branchid": { type: StringObjectId },
                    "todate": { type: Number },
                }
             */
            const { storeid, branchid, todate } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else {
                const getResult = await View_Dashboard_Controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: branchid,
                        todate: todate,
                    },
                    (err) => { if (err) { throw err } }
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

// Route => /dashboard/viewtoprevenues/
const view_revenues_visitor_Middleware = require('../Middleware/DashboardMiddleware/code/viewrevenuesMiddleware')
const view_revenues_visitor_controller = require('../Controller/DashboardController').view_revenues_Controller;
router.get(
    '/viewtoprevenues/',
    view_revenues_visitor_Middleware,
    async (req, res) => {
        try {
            /**
             ** Paramter => {
                    "_storeid": { type: StringObjectId },
                    "_branchid": { type: StringObjectId },
                    "Year": { type: String },
                    "Month": { type: String },
                    "r_or_v": { type: String }, 0 คือ revenues 1 visitor
                }
             */
            const { _storeid, _branchid, r_or_v, Year, Month } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== _storeid) { res.status(401).end(); }
            else {
                const getResult = await view_revenues_visitor_controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: _branchid, // ค่าเริ่มต้นเป็นค่า null 
                        Year: Year,
                        Month: Month,
                        r_or_v: r_or_v // 0 is revenues , 1 is visitor
                    },
                    (err) => { if (err) { throw err } }
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

// Route GET => /dashboard/viewsellproductreport/
const view_sellproductreport_Middleware = require('../Middleware/DashboardMiddleware/code/viewSellProductReportMiddleware')
const view_sellproductreport_Controller = require('../Controller/DashboardController/code/viewSellProductReportController');
router.get(
    '/viewsellproductreport',
    view_sellproductreport_Middleware,
    async (req, res) => {
        try {
            /**
             ** Paramter => {
                    "_storeid": { type: StringObjectId },
                    "_branchid": { type: StringObjectId },
                    todate: { type: String}, '0' or '1'  0 == YTD , 1 == MTD  
                }
             */
            const { _storeid, _branchid, todate } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== _storeid) { res.status(401).end(); }
            else {
                const sellproductreport = await view_sellproductreport_Controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: _branchid, // ค่าเริ่มต้นเป็นค่า null 
                        todate: todate,
                    },
                    (err) => { if (err) { throw err; } }
                );
    
                if (!sellproductreport) { res.status(200).end(); }
                else {
                    res.status(200).json(sellproductreport).end();
                }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// Route GET => /dashboard/viewtherapistdashboard
const view_Therapist_Dashboard_Middleware = require('../Middleware/DashboardMiddleware/code/viewTherapistDashboardMiddleware')
const view_Therapist_Dashboard_Controller = require('../Controller/DashboardController/code/viewTherapistDashboardController');
router.get(
    '/viewtherapistdashboard',
    view_Therapist_Dashboard_Middleware,
    async (req, res) => {
        try {
            /**
             ** Paramter => {
                    "_storeid": { type: StringObjectId },
                    "_branchid": { type: StringObjectId },
                    todate: { type: String}, '0' or '1'  0 == YTD , 1 == MTD  
                }
             */
            const { _storeid, _branchid, todate } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== _storeid) { res.status(401).end(); }
            else {
                const Therapist = await view_Therapist_Dashboard_Controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: _branchid, // ค่าเริ่มต้นเป็นค่า null 
                        todate: todate,
                    },
                    (err) => { if (err) { throw err; } }
                );
    
                if (!Therapist) { res.status(200).end(); }
                else {
                    res.status(200).json(Therapist).end();
                }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// Route GET => /dashboard/viewrevenuespt
const view_revenues_By_PT_Middleware = require('../Middleware/DashboardMiddleware/code/viewrevenuesByPTMiddleware')
const viewrevenues_By_PT_Controller = require('../Controller/DashboardController/code/viewrevenuesByPTController');
router.get(
    '/viewrevenuespt',
    view_revenues_By_PT_Middleware,
    async (req, res) => {
        try {
            /**
             ** Paramter => {
                    "_storeid": { type: StringObjectId },
                    "_branchid": { type: StringObjectId },
                    "_agent_userid" : { type: StringObjectId },
                    todate: { type: String}, '0' or '1'  0 == YTD , 1 == MTD  
                }
             */
            const { _storeid, _branchid, todate, _agent_userid } = req.query;
            const Therapist = await viewrevenues_By_PT_Controller(
                {
                    _storeid: _storeid,
                    _branchid: _branchid, // ค่าเริ่มต้นเป็นค่า null 
                    _agent_userid: _agent_userid,
                    todate: todate,
                },
                (err) => { if (err) { throw err; } }
            );

            if (!Therapist) { res.status(200).end(); }
            else { res.status(200).json(Therapist).end(); }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// Route GET => /dashboard/viewagennameandagenid
const view_agen_Controller = require('../Controller/DashboardController/code/viewAgenOrBranchidController').view_agen_Controller;
router.get(
    '/viewagennameandagenid',
    async (req, res) => {
        try {
            /**
             ** Paramter => {
                    "_storeid": { type: StringObjectId }
                    "_branchid": { type: StringObjectId }
                }
             */
            const { _storeid,_branchid } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== _storeid) { res.status(401).end(); }
            else {
                const Therapist = await view_agen_Controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid:_branchid
                    },
                    (err) => { if (err) { throw err; } }
                );
    
                if (!Therapist) { res.status(200).end(); }
                else {
                    res.status(200).json(Therapist).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// Route GET => /dashboard/viewbranchnameandbranchid
const view_branch_Controller = require('../Controller/DashboardController/code/viewAgenOrBranchidController').view_branch_Controller;
router.get(
    '/viewbranchnameandbranchid',
    async (req, res) => {
        try {
            /**
             ** Paramter => {
                    "_storeid": { type: StringObjectId }
                }
             */
            const { _storeid } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== _storeid) { res.status(401).end(); }
            else {
                const Therapist = await view_branch_Controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid)
                    },
                    (err) => { if (err) { throw err; } }
                );
    
                if (!Therapist) { res.status(200).end(); }
                else {
                    res.status(200).json(Therapist).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

//Route GET => /dashboard/viewstock
const view_Stock_Middleware = require('../Middleware/DashboardMiddleware/code/viewStockMiddleware')
const view_Stock_Controller = require('../Controller/DashboardController/code/viewStockController');
router.get(
    '/viewstock',
    view_Stock_Middleware,
    async (req, res) => {
        try {
            /**
               ** Paramter => {
                      "_storeid": { type: StringObjectId },
                      "_branchid": { type: StringObjectId },
                      "product_category" : { type: StringObjectId },
                      "year": { type: String}, ' 2020 '
                  }
               */
            const { _storeid, _branchid, product_category, year } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== _storeid) { res.status(401).end(); }
            else {
                const Therapist = await view_Stock_Controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: _branchid, // ค่าเริ่มต้นเป็นค่า null 
                        _ref_product_groupid: product_category,
                        year: year
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!Therapist) { res.status(200).end(); }
                else {
                    res.status(200).json(Therapist).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

//Route GET => /dashboard/treatmentbybodychart
const view_Treatment_By_BodyChart_Middleware = require('../Middleware/DashboardMiddleware/code/viewTreatmentByBodyChartMiddleware')
const view_Treatment_By_BodyChart_Controller = require('../Controller/DashboardController/code/viewTreatmentByBodyChartController');
router.get(
    '/treatmentbybodychart',
    view_Treatment_By_BodyChart_Middleware,
    async (req, res) => {
        try {
            /**
               ** Paramter => {
                      "_storeid": { type: StringObjectId },
                      "_branchid": { type: StringObjectId },
                      "Year" : { type: String },' 2020 '
                      "Month": { type: String}, ' 08 '
                  }
               */
            const { _storeid, _branchid, Year, Month } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== _storeid) { res.status(401).end(); }
            else {
                const Therapist = await view_Treatment_By_BodyChart_Controller(
                    {
                        _storeid: _storeid,
                        _branchid: _branchid, // ค่าเริ่มต้นเป็นค่า null 
                        Year: Year,
                        Month: Month
                    },
                    (err) => { if (err) { throw err; } }
                );
    
                if (!Therapist) { res.status(200).end(); }
                else {
                    res.status(200).json(Therapist).end();
                }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);
module.exports = router;