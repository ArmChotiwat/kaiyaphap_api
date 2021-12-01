// Route => /purchaseorder
const express = require('express');
const router = express.Router();
const { jwtDecode_Login_StoreBranchController } = require('../Controller/JwtController/index');

router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);

// Route POST => /purchaseorder/create
// สร้าง Purchase Order (PO)
const PurchaseOrder_Save_Middleware = require('../Middleware/PurchaseOrderMiddleware').PurchaseOrder_Save_Middleware;
const PurchaseOrder_Save_Controller = require('../Controller/PurchaseOrderController').PurchaseOrder_Save_Controller;
router.post(
    '/create',
    PurchaseOrder_Save_Middleware,
    async (req, res) => {
        try {
            /**
             ** JSON => {
                    "_ref_storeid": { type: StringObjectId },
                    "_ref_branchid": { type: StringObjectId },
                    "_ref_treatmentid": { type: StringObjectId Or Null },
                    "discount_course_price": { type: Number more than or equal 0 },
                    "discount_product_price": { type: Number more than or equal 0 },
                    "paid_type": { type: String },
                    "course": [
                        {
                            "_ref_courseid": { type: StringObjectId },
                            "course_price": { type: Number more than or equal 0 },
                            "course_count": { type: Number more than 0 },
                            "course_remark": { type: String OR null },
                        }
                    ],
                    "product": [
                        {
                            "_ref_productid": { type: StringObjectId },
                            "product_price": { type: Number more than or equal 0 },
                            "product_count": { type: Number more than 0 },
                            "product_remark": { type: String OR null },s
                        }
                    ]
                }
            ** หมายเหตุ
                ** _ref_treatmentid ถ้าการสร้าง PO ครั้งนี้มาจาก Treatment จะต้องแนบ String ObjectId ของ Treatment มาด้วย
                ** _ref_treatmentid ถ้าการสร้าง PO ครั้งนี้มาจาก หน้า Couter จะต้องทำให้ _ref_treatmentid มีค่าเป็น null
                ** course หากเป็นรายการที่ได้มา Treatment ครั้งแรก หรือ Treatment ที่เป็น Next Visit ต้องมีอย่างน้อย 1 รายการ และ course สามารถซ้ำรายการได้หาก หมายเหตุ (course_remark) ไม่ซ้ำกัน
                ** course หากเป็นรายการที่มาจาก Couter (_ref_treatmentid === null) จะไม่มีการส่ง course มา
                ** product ซ้ำรายการได้หาก หมายเหตุ (product_remark) ไม่ซ้ำกัน
                ** product หากเป็นรายการที่มาจาก Couter (_ref_treatmentid === null) ต้องมีอย่างน้อย 1 รายการ และ product สามารถซ้ำรายการได้หาก หมายเหตุ (product_remark) ไม่ซ้ำกัน
                ** discount_course_price การกำหนดราคา ส่วนลด ของการรักษา นั้นจะต้องมีค่ามากกว่า หรือเท่ากับ 0 และต้องมีค่าน้อยกว่า หรือเท่ากับ ของราคารวมทั้งหมดของการรักษา
                ** discount_product_price การกำหนดราคา ส่วนลด ของอุปกรณ์ นั้นจะต้องมีค่ามากกว่า หรือเท่ากับ 0 และต้องมีค่าน้อยกว่า หรือเท่ากับ ของราคารวมทั้งหมดของอุปกรณ์
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._ref_storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._ref_branchid) { res.status(401).end(); }
            else {
                const moment = require('moment');
                const currentTimeStamp = moment();

                const saveResult = await PurchaseOrder_Save_Controller(
                    String(jwtDecodeToekn._ref_storeid),
                    String(jwtDecodeToekn._ref_branchid),
                    String(jwtDecodeToekn._ref_agent_userid),
                    payload._ref_treatmentid,
                    payload.discount_course_price,
                    payload.discount_product_price,
                    payload.paid_type,
                    currentTimeStamp,
                    payload.course,
                    payload.product,
                    (err) => { if (err) { throw err; } }
                );

                if (!saveResult) {
                    res.status(422).end();
                }
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


// Route GET => /purchaseorder/schedule/preview/:storeid/:branchid/:scheduleid
// ดู Treatment เพื่อทำ ใบจ่ายยา Purchase Order (PO)
const PurcasheOrder_ScheduleTreatment_Preview_Middleware = require('../Middleware/PurchaseOrderMiddleware').PurcasheOrder_ScheduleTreatment_Preview_Middleware;
const PurcasheOrder_ScheduleTreatment_Preview_Controller = require('../Controller/PurchaseOrderController').PurcasheOrder_ScheduleTreatment_Preview_Controller;
router.get(
    '/schedule/preview/:storeid/:branchid/:scheduleid',
    PurcasheOrder_ScheduleTreatment_Preview_Middleware,
    async (req, res) => {
        try {
            /**
             ** Parameter => {
                    "storeid": { type: StringObjectId },
                    "brancid": { type: StringObjectId },
                    "scheduleid": { type: StringObjectId },
                }
            */
            const { storeid, branchid, scheduleid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await PurcasheOrder_ScheduleTreatment_Preview_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _ref_scheduleid: scheduleid
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


// Route GET => /purchaseorder/view/:storeid/:branchid/:purcaseorderid
// ดู ใบจ่ายยา Purchase Order (PO)
const PurchaseOrder_View_Middleware = require('../Middleware/PurchaseOrderMiddleware').PurchaseOrder_View_Middleware;
const PurchaseOrder_View_Controller = require('../Controller/PurchaseOrderController').PurchaseOrder_View_Controller;
router.get(
    '/view/:storeid/:branchid/:purcaseorderid',
    PurchaseOrder_View_Middleware,
    async (req, res) => {
        try {
            /**
             ** Parameter => {
                    "storeid": { type: StringObjectId },
                    "brancid": { type: StringObjectId },
                    "purcaseorderid": { type: StringObjectId },
                }
            */
            const { storeid, branchid, purcaseorderid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await PurchaseOrder_View_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _ref_poid: purcaseorderid
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


// Route GET => /purchaseorder/viewforcounter/:storeid/:branchid/:purcaseorderid
// ดู ใบจ่ายยา Purchase Order (PO) fpr counter
const PurchaseOrder_View_forCounter_Middleware = require('../Middleware/PurchaseOrderMiddleware').PurchaseOrder_View_forCounter_Middleware
const PurchaseOrder_View_forCounter_Controller = require('../Controller/PurchaseOrderController').PurchaseOrder_View_forCounter_Controller;
router.get(
    '/viewforcounter/:storeid/:branchid/:purcaseorderid',
    PurchaseOrder_View_forCounter_Middleware,
    async (req, res) => {
        try {
            /**
             ** Parameter => {
                    "storeid": { type: StringObjectId },
                    "brancid": { type: StringObjectId },
                    "purcaseorderid": { type: StringObjectId },
                }
            */
            const { storeid, branchid, purcaseorderid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await PurchaseOrder_View_forCounter_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _ref_poid: purcaseorderid
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
            return;
        }
    }
);

// Route GET => /purchaseorder/view/po/store
// ดู ใบจ่ายยา Purchase Order (PO) all in store
const PurchaseOrder_View_ForStroeOrBbranch_Middleware = require('../Middleware/PurchaseOrderMiddleware').PurchaseOrder_View_ForStroeOrBbranch_Middleware
const PurchaseOrder_View_ForStroeOrBbranch_Controller = require('../Controller/PurchaseOrderController').PurchaseOrder_View_ForStroeOrBbranch_Controller;
router.get(
    '/view/po/store',
    PurchaseOrder_View_ForStroeOrBbranch_Middleware,
    async (req, res) => {
        try {

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else {
                const getResult = await PurchaseOrder_View_ForStroeOrBbranch_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
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
            return;
        }
    }
);

module.exports = router;