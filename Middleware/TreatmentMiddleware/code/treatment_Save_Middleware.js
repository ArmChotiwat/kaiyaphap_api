/**
 * Middleware สร้าง (Treatment) ทำ ใบสั่งยา ครั้งแรก ตามเคสที่ยังไม่ได้สร้างใบสั่งยาครั้งแรก
 * Route POST => /treatment/create
 */
const treatment_Save_Middleware = async (req, res, next) => {
    const { validateObjectId, checkProductInventory, checkCourse, checkCoursePrice, validate_StringOrNull_AndNotEmpty } = require('../../../Controller/miscController');
    const { ObjectId, treatmentModel, treatment_ProgressionNoteModel, casePatient_StatusModel } = require('../../../Controller/mongodbController');

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
                "_ref_treatment_progressionnoteid" ถ้าไม่มีให้ใส่ null
                "product" สามารถไม่มีรายการได้ หากไม่มีรายการให้ส่ง "product": [] มา
                "course" ต้องมีรายการอย่างน้อย 1 รายการ
                "discount_product_price" การลดราคา Product ต้องมีค่ามากกว่า หรือเท่ากับ 0 และ จะต้องมีค่าน้อยกว่า หรือเท่ากับราคารวม ของ Product
                "discount_course_price" การลดราคา Course ต้องมีค่ามากกว่า หรือเท่ากับ 0 และ จะต้องมีค่าน้อยกว่า หรือเท่ากับราคารวม ของ Course
    */
    const payload = req.body;
    // console.log(payload);

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };

    if (typeof payload._ref_storeid != 'string' || !validateObjectId(payload._ref_storeid)) { ErrorJson.description.push(`Paratmer _ref_storeid must be ObjectId String`); }
    if (typeof payload._ref_branchid != 'string' || !validateObjectId(payload._ref_branchid)) { ErrorJson.description.push(`Paratmer _ref_branchid must be ObjectId String`); }
    if (typeof payload._ref_casepatinetid != 'string' || !validateObjectId(payload._ref_casepatinetid)) { ErrorJson.description.push(`Paratmer _ref_casepatinetid must be ObjectId String`); }
    if (typeof payload._ref_scheduleid != 'string' || !validateObjectId(payload._ref_scheduleid)) { ErrorJson.description.push(`Paratmer _ref_scheduleid must be ObjectId String`); }
    if (typeof payload.isnextvisited != 'boolean') { ErrorJson.description.push(`Paratmer isnextvisited must be Boolean`); }
    else {
        const findDuplicateSchedule = await treatmentModel.findOne(
            {
                '_ref_scheduleid': ObjectId(payload._ref_scheduleid),
            },
            {},
            (err) => { if (err) { ErrorJson.description.push(`Paratmer findDuplicateSchedule have error`); console.error(err); return; } }
        );

        if (findDuplicateSchedule) {
            ErrorJson.description.push(`Paratmer _ref_scheduleid Is duplicated`);
        }
    }
    if (!validate_StringOrNull_AndNotEmpty(payload._ref_treatment_progressionnoteid)) { ErrorJson.description.push(`Paratmer _ref_treatment_progressionnoteid must be ObjectId String or Null`); }
    else {
        if (payload._ref_treatment_progressionnoteid !== null) {
            if (!validateObjectId(payload._ref_treatment_progressionnoteid)) { ErrorJson.description.push(`Paratmer _ref_treatment_progressionnoteid must be ObjectId String when not Null`); }
            else {
                const findTreatment_ProgressionNote = await treatment_ProgressionNoteModel.findOne(
                    {
                        '_id': ObjectId(payload._ref_treatment_progressionnoteid)
                    },
                    {},
                    (err) => { if (err) { ErrorJson.description.push(`Paratmer findTreatment_ProgressionNote have error`); console.error(err); return; } }
                );

                if (!findTreatment_ProgressionNote) {
                    ErrorJson.description.push(`Paratmer _ref_treatment_progressionnoteid not found`);
                }
            }
        }
    }
    

    if (typeof payload.medical_certificate_en != 'object') { ErrorJson.description.push(`Paratmer payload.medical_certificate_en must be Obejct`); }
    else {
        if (!validate_StringOrNull_AndNotEmpty(payload.medical_certificate_en.patient_name)) { ErrorJson.description.push(`Paratmer payload.medical_certificate_en.patient_name must be String Or Null and Not StringEmpty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.medical_certificate_en.agent_name)) { ErrorJson.description.push(`Paratmer payload.medical_certificate_en.agent_name must be String Or Null and Not StringEmpty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.medical_certificate_en.detected_symptom)) { ErrorJson.description.push(`Paratmer payload.medical_certificate_en.detected_symptom must be String Or Null and Not StringEmpty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.medical_certificate_en.pt_diagnosis)) { ErrorJson.description.push(`Paratmer payload.medical_certificate_en.pt_diagnosis must be String Or Null and Not StringEmpty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.medical_certificate_en.treatment)) { ErrorJson.description.push(`Paratmer payload.medical_certificate_en.treatment must be String Or Null and Not StringEmpty`); }
    }
    
    if (typeof payload.medical_certificate_th != 'object') { ErrorJson.description.push(`Paratmer payload.medical_certificate_th must be Obejct`); }
    else {
        if (!validate_StringOrNull_AndNotEmpty(payload.medical_certificate_th.patient_name)) { ErrorJson.description.push(`Paratmer payload.medical_certificate_th.patient_name must be String Or Null and Not StringEmpty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.medical_certificate_th.agent_name)) { ErrorJson.description.push(`Paratmer payload.medical_certificate_th.agent_name must be String Or Null and Not StringEmpty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.medical_certificate_th.detected_symptom)) { ErrorJson.description.push(`Paratmer payload.medical_certificate_th.detected_symptom must be String Or Null and Not StringEmpty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.medical_certificate_th.pt_diagnosis)) { ErrorJson.description.push(`Paratmer payload.medical_certificate_th.pt_diagnosis must be String Or Null and Not StringEmpty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.medical_certificate_th.treatment)) { ErrorJson.description.push(`Paratmer payload.medical_certificate_th.treatment must be String Or Null and Not StringEmpty`); }
    }

    let SUM_Product_Price = 0;
    if (typeof payload.product != 'object') { ErrorJson.description.push(`Paratmer product must be Array Object and Length or Array morethan or equal 0`); }
    else {
        if (payload.product.length < 0) { ErrorJson.description.push(`Paratmer product must be Array Object and Length or Array morethan or equal 0`); }
        else {
            if (payload.product.length > 0) {
                for (let index = 0; index < payload.product.length; index++) {
                    const elementProduct = payload.product[index];

                    if (typeof elementProduct.product_count != 'number' || elementProduct.product_count <= 0) { ErrorJson.description.push(`Paratmer product[${index}].product_count must be Number and More than 0`); }
                    if (typeof elementProduct.product_price != 'number' || elementProduct.product_price < 0) { ErrorJson.description.push(`Paratmer product[${index}].product_price must be Number and More than or equal 0`); }
                    if (!validate_StringOrNull_AndNotEmpty(elementProduct.product_remark)) { ErrorJson.description.push(`Paratmer product[${index}].product_remark must be String or Null and Not Empty`); }

                    if (typeof elementProduct._ref_productid != 'string' || !validateObjectId(elementProduct._ref_productid)) { ErrorJson.description.push(`Paratmer product[${index}].ref_productid must be ObjectId String`); }
                    else {
                        const chkProductInventory = await checkProductInventory(
                            {
                                _ref_productid: elementProduct._ref_productid,
                                _ref_product_inventoryid: null,
                                _ref_storeid: payload._ref_storeid,
                                _ref_branchid: payload._ref_branchid
                            },
                            (err) => { if (err) { return; } }
                        );
                        if (!chkProductInventory) { ErrorJson.description.push(`Paratmer product[${index}].ref_productid not found in _ref_storeid, _ref_branchid`); }
                        else {
                            SUM_Product_Price += elementProduct.product_price*elementProduct.product_count;
                        }
                    }
                }
            }
        }
    }

    if (typeof payload.discount_product_price != 'number' || payload.discount_product_price < 0) {
        ErrorJson.description.push(`Paratmer discount_product_price must be Number and morethan or equal 0`);
    }
    else {
        if (payload.discount_product_price > SUM_Product_Price) { 
            ErrorJson.description.push(`Paratmer discount_product_price (${payload.discount_product_price}) must lower than Total Price of Product (${SUM_Product_Price})`);
        }
    }

    let SUM_Course_Price = 0;
    if (typeof payload.course != 'object') { ErrorJson.description.push(`Paratmer course must be Array Object and Length or Array morethan 1`); }
    else {
        if (payload.course.length < 1) { ErrorJson.description.push(`Paratmer course must be Array Object and Length or Array morethan 1`); }
        else {
            for (let index = 0; index < payload.course.length; index++) {
                const elementCourse = payload.course[index];

                if (typeof elementCourse.course_count != 'number' || elementCourse.course_count <= 0) { ErrorJson.description.push(`Paratmer course[${index}].course_count must be Number and More than 0`); }
                if (!validate_StringOrNull_AndNotEmpty(elementCourse.course_remark)) { ErrorJson.description.push(`Paratmer course[${index}].course_remark must be String or Null and Not Empty`); }

                if (typeof elementCourse._ref_courseid != 'string' || !validateObjectId(elementCourse._ref_courseid)) { ErrorJson.description.push(`Paratmer course[${index}]._ref_courseid must be ObjectId String`); }
                else {
                    const chkCourse = await checkCourse(
                        {
                            _ref_courseid: elementCourse._ref_courseid,
                            _ref_storeid: payload._ref_storeid,
                            _ref_branchid: payload._ref_branchid
                        },
                        (err) => { if (err) { return; } }
                    );
                    if (!chkCourse) { ErrorJson.description.push(`Paratmer course[${index}]._ref_courseid not found in _ref_storeid, _ref_branchid`); }
                }

                if (typeof elementCourse.course_price != 'number' || elementCourse.course_price < 0) { ErrorJson.description.push(`Paratmer course[${index}].course_price must be Number and More than or equal 0`); }
                else {
                    const chkCoursePrice = await checkCoursePrice(
                        {
                            _ref_courseid: elementCourse._ref_courseid,
                            _ref_storeid: payload._ref_storeid,
                            _ref_branchid: payload._ref_branchid
                        },
                        (err) => { if (err) { return; } }
                    );
                    if (!chkCoursePrice) { ErrorJson.description.push(`Paratmer course[${index}]._ref_courseid not found in _ref_storeid, _ref_branchid`); }
                    else {
                        if (chkCoursePrice.course_price != elementCourse.course_price) { ErrorJson.description.push(`Paratmer course[${index}].course_price not match as requested`); }
                        else {
                            SUM_Course_Price += elementCourse.course_price*elementCourse.course_count;
                        }
                    }
                }
            }
        }
    }

    if (typeof payload.discount_course_price != 'number' || payload.discount_course_price < 0) {
        ErrorJson.description.push(`Paratmer discount_course_price must be Number and morethan or equal 0`);
    }
    else {
        if (payload.discount_course_price > SUM_Course_Price) { 
            ErrorJson.description.push(`Paratmer discount_course_price (${payload.discount_course_price}) must lower than Total Price of Product (${SUM_Product_Price})`);
        }
    }


    const { checkAgentId } = require('../../../Controller/miscController');
    const { jwtDecode_Login_StoreBranchController } = require('../../../Controller/JwtController/index');
    const authorlization = req.header("authorization");
    /**
     ** JWTToken => {
            _agentid: { type: StringObjectId },
        }
    */
    const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);
    // const jwtDecodeToekn = { _agentid: '5e869c3dc893665810a4b555' };

    if (!jwtDecodeToekn || !jwtDecodeToekn._ref_agent_userid) { res.status(401).end(); return; }
    else {
        const chkAgentId = await checkAgentId(
            {
                _agentid: String(jwtDecodeToekn._ref_agent_userid), 
                _storeid: payload._ref_storeid, 
                _branchid: payload._ref_branchid
            }, 
            (err) => { if (err) { console.error(err); return; } }
        );

        if (!chkAgentId) { res.status(401).end(); return; }
        else if (chkAgentId.role !== 2) { res.status(401).end(); return; }
        else {
            if (validateObjectId(payload._ref_storeid) && validateObjectId(payload._ref_branchid) && validateObjectId(payload._ref_casepatinetid) && validateObjectId(payload._ref_scheduleid) && validateObjectId(payload._ref_treatment_progressionnoteid)) {
                let validateOwner = false;
                
                const Retry_Max = 10;
                for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                    const findExistsTreatment = await casePatient_StatusModel.findOne(
                        {
                            '_ref_casepatientid': ObjectId(payload._ref_casepatinetid),
                            '_ref_treatmentid': null,
                            '_ref_treatment_progressionnoteid': ObjectId(payload._ref_treatment_progressionnoteid),
                            '_ref_storeid': ObjectId(payload._ref_storeid),
                            '_ref_branchid': ObjectId(payload._ref_branchid),
                            'isnextvisited': true
                        },
                        {},
                        (err) => { if (err) { console.error(err); return; } }
                    );

                    const validateProgressionNoteOwner = await treatment_ProgressionNoteModel.findOne(
                        {
                            '_id': ObjectId(payload._ref_treatment_progressionnoteid),
                            '_ref_scheduleid': ObjectId(payload._ref_scheduleid),
                            '_ref_casepatinetid': ObjectId(payload._ref_casepatinetid),
                            '_ref_storeid': ObjectId(payload._ref_storeid),
                            '_ref_branchid': ObjectId(payload._ref_branchid),
                            '_ref_agent_userid_create': chkAgentId._agentid,
                            '_ref_agent_userstoreid_create': chkAgentId._agentstoreid
                        },
                        {},
                        (err) => { if (err) { console.error(err); return; } }
                    );

                    if (findExistsTreatment) {
                        if (validateProgressionNoteOwner) {
                            validateOwner = true;
                            break;
                        }
                    } 
                }

                if (!validateOwner) { ErrorJson.description.push(`ProgressionNote validate owner failed`); }
            }
        }
    }

    if (ErrorJson.description.length > 0) { res.status(400).json(ErrorJson).end(); }
    else { next(); }

};


module.exports = treatment_Save_Middleware;
