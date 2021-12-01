const express = require('express');
const router = express.Router();
const jwtDecodeData = require('../Controller/miscController').jwtDecodeData;
const { jwtDecode_Login_StoreBranchController } = require('../Controller/JwtController/index');

// Route => /treatment
router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);

// Route POST => /treatment/create
// สร้าง ใบสั่งยา (Treatment)
const { treatment_Save_Middleware } = require('../Middleware/TreatmentMiddleware');
const { treatment_Save_Controller, Treatment_Save_CourseMapper_Controller, Treatment_Save_ProductMapper_Controller } = require('../Controller/treatmentController');
router.post(
    '/create',
    treatment_Save_Middleware,
    async function (req, res) {
        /**
         ** JSON => {
                "_ref_storeid": { type: StringObjectId }, // ObjectId ของ ร้าน
                "_ref_branchid": { type: StringObjectId }, // ObjectId ของ สาขา
                "_ref_casepatinetid": { type: StringObjectId }, // ObjectId ของ Case การรักษา
                "_ref_scheduleid": { type: StringObjectId }, // ObjectId ของ คิว
                "_ref_treatment_progressionnoteid": { type: StringObjectId Or Null }, // ObjectId ของ NextVisit
                "isnextvisited": { type: boolean }, // Treatment นี้เป็น NextVisit หรือไม่
                "discount_product_price": { type: Number morethan or equal 0}, // ราคา ส่วนลด Product
                "discount_course_price": { type: Number morethan or equal 0}, // ราคา ส่วนลด Course/Package
                "medical_certificate_th": { // ใบรับรองแพทย์ (ภาษาไทย)
                    "patient_name": { type: String Or Null }, // ชือผู้ป่วย (Free Text)
                    "agent_name": { type: String Or Null }, // นักกายภาพ (Free Text)
                    "detected_symptom": { type: String Or Null }, // อาการที่ตรวจภาพ (Free Text)
                    "pt_diagnosis": { type: String Or Null }, // ผลการตรวจวินิจฉัยทางกายภาพ (Free Text)
                    "treatment": { type: String Or Null }, // ได้รับการรักษาโดยการ (Free Text)
                },
                "medical_certificate_en": { // ใบรับรองแพทย์ (อังกฤษ)
                    "patient_name": { type: String Or Null }, // ชือผู้ป่วย (Free Text)
                    "agent_name": { type: String Or Null }, // นักกายภาพ (Free Text)
                    "detected_symptom": { type: String Or Null }, // อาการที่ตรวจภาพ (Free Text)
                    "pt_diagnosis": { type: String Or Null }, // ผลการตรวจวินิจฉัยทางกายภาพ (Free Text)
                    "treatment": { type: String Or Null }, // ได้รับการรักษาโดยการ (Free Text)
                },
                "product": [
                    {
                        _ref_productid: { type: StringObjectId }, // ObjectId ของ ระเบียนสินค้า
                        product_price: { type: Number More than Or Equal 0 }, // ราคา ของ สินค้า
                        product_count: { type: Number More than 0 }, // จำนวน ของ สินค้า
                        product_remark: { type: String or Null }, // หมายเหตุ ของ สินค้า
                    }
                ],
                "course": [
                    {
                        _ref_courseid: { type: StringObjectId }, // ObjectId ของ Course
                        course_price: { type: Number More than Or Equal 0 }, // ราคา ของ Course
                        course_count: { type: Number More than 0 }, // จำนวน ของ Course
                        course_remark: { type: String or Null }, // หมายเหตุ ของ Course
                    }
                ],
            }
         ** หมายเหตุ
                "_ref_treatment_progressionnoteid" ถ้าไม่มี ให้ใส่ null
                "product" สามารถไม่มีรายการได้ หากไม่มีรายการให้ส่ง "product": [] มา
                "course" ต้องมีรายการอย่างน้อย 1 รายการ
                "discount_product_price" การลดราคา Product ต้องมีค่ามากกว่า หรือเท่ากับ 0 และ จะต้องมีค่าน้อยกว่า หรือเท่ากับราคารวม ของ Product
                "discount_course_price" การลดราคา Course ต้องมีค่ามากกว่า หรือเท่ากับ 0 และ จะต้องมีค่าน้อยกว่า หรือเท่ากับราคารวม ของ Course
        */
        const payload = req.body;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== payload._ref_storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== payload._ref_branchid) { res.status(401).end(); }
        else {
            const mapCourseResult = await Treatment_Save_CourseMapper_Controller(payload.course, (err) => { if (err) { console.error(err); return; } });
            const mapProductResult = await Treatment_Save_ProductMapper_Controller(payload.product, (err) => { if (err) { console.error(err); return; } });

            if (!mapCourseResult || !mapProductResult) { res.status(422).end(); }
            else {
                const saveResult = await treatment_Save_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _ref_casepatinetid: payload._ref_casepatinetid,
                        _ref_scheduleid: payload._ref_scheduleid,
                        _ref_treatment_progressionnoteid: payload._ref_treatment_progressionnoteid,
                        isnextvisited: payload.isnextvisited,
                        discount_product_price: payload.discount_product_price,
                        discount_course_price: payload.discount_course_price,
                        medical_certificate_th: {
                            patient_name: payload.medical_certificate_th.patient_name,
                            agent_name: payload.medical_certificate_th.agent_name,
                            detected_symptom: payload.medical_certificate_th.detected_symptom,
                            pt_diagnosis: payload.medical_certificate_th.pt_diagnosis,
                            treatment: payload.medical_certificate_th.treatment,
                        },
                        medical_certificate_en: {
                            patient_name: payload.medical_certificate_en.patient_name,
                            agent_name: payload.medical_certificate_en.agent_name,
                            detected_symptom: payload.medical_certificate_en.detected_symptom,
                            pt_diagnosis: payload.medical_certificate_en.pt_diagnosis,
                            treatment: payload.medical_certificate_en.treatment,
                        },
                        course: mapCourseResult.course,
                        course_full: mapCourseResult.course_full,
                        product: mapProductResult.product,
                        product_full: mapProductResult.product_full
                    },
                    (err) => { if (err) { console.error(err); return; } }
                );

                if (!saveResult) { res.status(422).end(); }
                else {
                    res.status(201).json({_ref_treatmentid: saveResult.transactionSave_Treatment_Header._id}).end();
                }
            }
        }
    }
);

// Route POST => /treatment/progressionnote/create
// สร้าง Progression Note (ต้องสร้าง Treatment ที่เป็น Next Visit ก่อน)
const Treatment_ProgressionNote_Save_Middleware = require('../Middleware/TreatmentMiddleware').Treatment_ProgressionNote_Save_Middleware;
const Treatment_ProgressionNote_Save_Controller = require('../Controller/treatmentController').Treatment_ProgressionNote_Save_Controller;
router.post(
    '/progressionnote/create',
    Treatment_ProgressionNote_Save_Middleware,
    async (req, res) => {
        /**
         ** JSON => {
                        "_ref_storeid": { type: StringObjectId }, // ObjectId ของ ร้าน
                        "_ref_branchid": { type: StringObjectId }, // ObjectId ของ สาขา
                        "_ref_pateintid": { type: StringObjectId }, // ObjectId ของ ผู้ป่วย
                        "_ref_scheduleid": { type: StringObjectId }, // ObjectId ของ คิว
                        "_ref_casepatientid": { type: StringObjectId }, // ObjectId ของ Case Patient
                        "_ref_treatmentid": { type: StringObjectId or Null }, // ObjectId ของ Treatment
                        "diagnosis_file_type": { type: Number 0|1|2|3 }, // Number 0 - 3
                        "S": { type: String Or Null },
                        "O": { type: String Or Null },
                        "A": { type: String Or Null },
                        "P": { type: String Or Null },
                    }
            ** หมายเหตุ
                ** _ref_treatmentid ถ้ายังไม่ได้ทำ Treatment (NextVisit) ให้ส่ง ค่า null
        */
        const payload = req.body;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== payload._ref_storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== payload._ref_branchid) { res.status(401).end(); }
        else {
            const saveResult = await Treatment_ProgressionNote_Save_Controller(
                {
                    _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                    _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                    _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                    _ref_pateintid: payload._ref_pateintid,
                    _ref_scheduleid: payload._ref_scheduleid,
                    _ref_casepatientid: payload._ref_casepatientid,
                    _ref_treatmentid: payload._ref_treatmentid,
                    diagnosis_file_type: payload.diagnosis_file_type,
                    S: payload.S,
                    O: payload.O,
                    A: payload.A,
                    P: payload.P
                },
                (err) => { if (err) { console.error(err); return; } }
            );

            if (!saveResult) { res.status(422).end(); }
            else {
                res.status(201).json(saveResult).end();
            }
        }
    }
);


// Route GET => /treatment/progressionnote/view?_ref_storeid&_ref_branchid&_ref_casepatinetid&skip
// ดู Progression Note
const Treatment_ProgressionNote_View_Middleware = require('../Middleware/TreatmentMiddleware').Treatment_ProgressionNote_View_Middleware;
const Treatment_ProgressionNote_View_Controller = require('../Controller/treatmentController').Treatment_ProgressionNote_View_Controller;
router.get(
    '/progressionnote/view',
    Treatment_ProgressionNote_View_Middleware,
    async (req, res) => {
        /**
         ** Query Params => {
                "_ref_storeid": { type: StringObjectId },
                "_ref_branchid": { type: StringObjectId },
                "_ref_casepatinetid": { type: StringObjectId },
                "skip": { type: StringObjectId },
            }
         */
        const { _ref_storeid, _ref_branchid, _ref_casepatinetid, skip } = req.query;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== _ref_storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== _ref_branchid) { res.status(401).end(); }
        else {
            const getRsult = await Treatment_ProgressionNote_View_Controller(
                {
                    _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                    _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                    _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                    _ref_casepatinetid: String(_ref_casepatinetid),
                    skip: Number(skip)
                },
                (err) => { if (err) { console.error(err); return; } }
            );

            if (!getRsult) { res.status(422).end(); }
            else {
                res.status(200).json(getRsult).end();
            }
        }
    }
);


// Route GET => /treatment/progressionnote/inspect?_ref_storeid&_ref_branchid&_ref_treatment_progressionnoteid
// ส่อง Progression Note
const Treatment_ProgressionNote_Inspect_Middleware = require('../Middleware/TreatmentMiddleware').Treatment_ProgressionNote_Inspect_Middleware;
const Treatment_ProgressionNote_Inspect_Controller = require('../Controller/treatmentController').Treatment_ProgressionNote_Inspect_Controller;
router.get(
    '/progressionnote/inspect',
    Treatment_ProgressionNote_Inspect_Middleware,
    async (req, res) => {
        /**
         ** Query Params => {
                "_ref_storeid": { type: StringObjectId },
                "_ref_branchid": { type: StringObjectId },
                "_ref_treatment_progressionnoteid": { type: StringObjectId },
            }
         */
        const { _ref_storeid, _ref_branchid, _ref_treatment_progressionnoteid } = req.query;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== _ref_storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== _ref_branchid) { res.status(401).end(); }
        else {
            const getRsult = await Treatment_ProgressionNote_Inspect_Controller(
                {
                    _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                    _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                    _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                    _ref_treatment_progressionnoteid: String(_ref_treatment_progressionnoteid)
                },
                (err) => { if (err) { console.error(err); return; } }
            );

            if (!getRsult) { res.status(422).end(); }
            else {
                res.status(200).json(getRsult).end();
            }
        }
    }
);

// Route GET => /treatment/inspect?_ref_storeid&_ref_branchid&_ref_treatmentid
// ส่อง FirstTime/NextVisit Treatment
const Treatment_Inspect_Middleware = require('../Middleware/TreatmentMiddleware').Treatment_Inspect_Middleware;
const Treatment_Inspect_Controller = require('../Controller/treatmentController').Treatment_Inspect_Controller;
router.get(
    '/inspect',
    Treatment_Inspect_Middleware,
    async (req, res) => {
        /**
         ** Query Params => {
                "_ref_storeid": { type: StringObjectId },
                "_ref_branchid": { type: StringObjectId },
                "_ref_treatmentid": { type: StringObjectId },
            }
         */
        const { _ref_storeid, _ref_branchid, _ref_treatmentid } = req.query;

        const authorlization = req.header("authorization");
        const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

        if (!jwtDecodeToekn) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_storeid) !== _ref_storeid) { res.status(401).end(); }
        else if (String(jwtDecodeToekn._ref_branchid) !== _ref_branchid) { res.status(401).end(); }
        else {
            const getRsult = await Treatment_Inspect_Controller(
                {
                    _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                    _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                    _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                    _ref_treatmentid: String(_ref_treatmentid)
                },
                (err) => { if (err) { console.error(err); return; } }
            );

            if (!getRsult) { res.status(422).end(); }
            else {
                res.status(200).json(getRsult).end();
            }
        }
    }
);

// Route POST => /treatment/progressionnoteimge/create
// เพิ่ม Progression Note imge 
const Treatment_ProgressionNote_imge_Save_Controller = require('../Controller/treatmentController').Treatment_ProgressionNote_imge_Save_Controller;
router.post(
    '/progressionnoteimge/create',
    async (req, res) => {
        try {
            /**
             ** Paramter => {
                "_progressionnoteid": { type: StringObjectId },
                "file": {type : file}
             }
             */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else {
                const { checkAgentId } = require('../Controller/miscController');

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
                    const file = req.files;
                    const ProgressionNote = await Treatment_ProgressionNote_imge_Save_Controller(
                        {
                            _progressionnoteid: payload._progressionnoteid,
                            file: file
                        },
                        (err) => { if (err) { throw err; } }
                    );
                    if (!ProgressionNote) { res.status(422).end(); }
                    else {
                        res.status(201).end();
                    }
                }
            }
            
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

module.exports = router;