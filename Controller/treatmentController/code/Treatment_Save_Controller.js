/**
 * Controller สร้าง (Treatment) ทำ ใบสั่งยา ครั้งแรก ตามเคสที่ยังไม่ได้สร้างใบสั่งยาครั้งแรก
 ** Agent ตามสาขา ใช้งานได้
 */
const treatment_Save_Controller = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agentid: '',
        _ref_casepatinetid: '',
        _ref_scheduleid: '',
        _ref_treatment_progressionnoteid: '',
        isnextvisited: true,
        discount_product_price: 0,
        discount_course_price: 0,
        medical_certificate_en: {
            patient_name: '',
            agent_name: '',
            detected_symptom: '',
            pt_diagnosis: '',
            treatment: '',
        },
        medical_certificate_th: {
            patient_name: '',
            agent_name: '',
            detected_symptom: '',
            pt_diagnosis: '',
            treatment: '',
        },
        product: [
            {
                _ref_productid: '',
                product_price: -1,
                product_count: -1
            }
        ],
        product_full: [
            {
                _ref_productid: '',
                product_price: -1,
                product_count: -1,
                product_remark: '',
            }
        ],
        course: [
            {
                _ref_courseid: '',
                course_price: -1,
                course_count: -1,
            }
        ],
        course_full: [
            {
                _ref_courseid: '',
                course_price: -1,
                course_count: -1,
                course_remark: '',
            }
        ],
    },
    callback = (err = new Error) => { }
) => {
    const controllerName = `treatment_Save_Controller`;

    const misicController = require('../../miscController');
    const validateObjectId = misicController.validateObjectId;
    const checkStoreBranch = misicController.checkStoreBranch;
    const checkObjectId = misicController.checkObjectId;
    const validate_StringOrNull_AndNotEmpty = misicController.validate_StringOrNull_AndNotEmpty;
    const Schedule_Check_Status = misicController.Schedule_Check_Status;
    const Schedule_Update_Status = misicController.Schedule_Update_Status;

    const mongodbController = require('../../mongodbController');
    const ObjectId = mongodbController.ObjectId;
    const treatment_ProgressionNoteModel = mongodbController.treatment_ProgressionNoteModel;
    const treatmentModel = mongodbController.treatmentModel;
    const treatmentDetailModel = mongodbController.treatmentDetailModel;
    const casePatientModel = mongodbController.casePatientModel;
    const archiveTreatmentModel = mongodbController.archiveTreatmentModel;
    const casePatient_StatusModel = mongodbController.casePatient_StatusModel;

    const productInventoryDecrese_Save = require('../../ProductController').productInventoryDecrese_Save;

    if (typeof data != 'object') { callback(new Error(`${controllerName}: data must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: data._ref_storeid must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: data._ref_branchid must be String ObjectId`)); return; }
    else if (!(await checkStoreBranch({ _storeid: data._ref_storeid, _branchid: data._ref_branchid }, (err) => { if (err) { callback(err); return; } }))) { callback(new Error(`${controllerName}: checkStoreBranch data._ref_storeid and data._ref_branchid reutrn not found`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: data._ref_agentid must be String ObjectId`)); return; }
    else if (typeof data._ref_casepatinetid != 'string' || !validateObjectId(data._ref_casepatinetid)) { callback(new Error(`${controllerName}: data._ref_casepatinetid must be String ObjectId`)); return; }
    else if (typeof data._ref_scheduleid != 'string' || !validateObjectId(data._ref_scheduleid)) { callback(new Error(`${controllerName}: data._ref_scheduleid must be String ObjectId`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data._ref_treatment_progressionnoteid)) { callback(new Error(`${controllerName}: data._ref_treatment_progressionnoteid must be String ObjectId or Null`)); return; }
    else if (typeof data.discount_product_price != 'number' || data.discount_product_price < 0) { callback(new Error(`${controllerName}: data.discount_price must be Number and more than or equal 0`)); return; }
    else if (typeof data.discount_course_price != 'number' || data.discount_course_price < 0) { callback(new Error(`${controllerName}: data.discount_course_price must be Number and more than or equal 0`)); return; }
    else if (typeof data.medical_certificate_en != 'object') { callback(new Error(`${controllerName}: data.medical_certificate_en must be Obejct`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.medical_certificate_en.patient_name)) { callback(new Error(`${controllerName}: data.medical_certificate_en.patient_name must be String Or Null and Not StringEmpty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.medical_certificate_en.agent_name)) { callback(new Error(`${controllerName}: data.medical_certificate_en.agent_name must be String Or Null and Not StringEmpty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.medical_certificate_en.detected_symptom)) { callback(new Error(`${controllerName}: data.medical_certificate_en.detected_symptom must be String Or Null and Not StringEmpty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.medical_certificate_en.pt_diagnosis)) { callback(new Error(`${controllerName}: data.medical_certificate_en.pt_diagnosis must be String Or Null and Not StringEmpty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.medical_certificate_en.treatment)) { callback(new Error(`${controllerName}: data.medical_certificate_en.treatment must be String Or Null and Not StringEmpty`)); return; }
    else if (typeof data.medical_certificate_th != 'object') { callback(new Error(`${controllerName}: data.medical_certificate_th must be Obejct`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.medical_certificate_th.patient_name)) { callback(new Error(`${controllerName}: data.medical_certificate_th.patient_name must be String Or Null and Not StringEmpty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.medical_certificate_th.agent_name)) { callback(new Error(`${controllerName}: data.medical_certificate_th.agent_name must be String Or Null and Not StringEmpty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.medical_certificate_th.detected_symptom)) { callback(new Error(`${controllerName}: data.medical_certificate_th.detected_symptom must be String Or Null and Not StringEmpty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.medical_certificate_th.pt_diagnosis)) { callback(new Error(`${controllerName}: data.medical_certificate_th.pt_diagnosis must be String Or Null and Not StringEmpty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.medical_certificate_th.treatment)) { callback(new Error(`${controllerName}: data.medical_certificate_th.treatment must be String Or Null and Not StringEmpty`)); return; }
    else if (typeof data.course != 'object') { callback(new Error(`${controllerName}: data.course must be Array and Length of array must more than 0`)); return; }
    else if (data.course.length < 0) { callback(new Error(`${controllerName}: data.course must Length of array more than or equal 0`)); return; }
    else if (typeof data.product_full != 'object') { callback(new Error(`${controllerName}: data.product_full must be Array and Length of array must more than or equal 0`)); return; }
    else if (data.product_full.length < 0) { callback(new Error(`${controllerName}: data.product_full must Length of array more than or equal 0`)); return; }
    else if (typeof data.course != 'object') { callback(new Error(`${controllerName}: data.course must be Array and Length of array must more than 0`)); return; }
    else if (data.course.length < 1) { callback(new Error(`${controllerName}: data.course must Length of array more than 0`)); return; }
    else if (typeof data.course_full != 'object') { callback(new Error(`${controllerName}: data.course_full must be Array and Length of array must more than 0`)); return; }
    else if (data.course_full.length < 1) { callback(new Error(`${controllerName}: data.course_full must Length of array more than 0`)); return; }
    else {
        let _ref_treatment_progressionnoteid = null;
        if (data._ref_treatment_progressionnoteid !== null) {
            if (!validateObjectId(data._ref_treatment_progressionnoteid)) { callback(new Error(`${controllerName}: data._ref_treatment_progressionnoteid must be String ObjectId or Null`)); return; }
            else {
                const findtreatment_ProgressionNote = await treatment_ProgressionNoteModel.findOne(
                    {
                        '_id': ObjectId(data._ref_treatment_progressionnoteid)
                    },
                    {},
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!findtreatment_ProgressionNote) { callback(new Error(`${controllerName}: findtreatment_ProgressionNote return not found`)); return; }
                else {
                    _ref_treatment_progressionnoteid = ObjectId(findtreatment_ProgressionNote._id)
                }
            }
        }
        else {
            const checkFirstTimeTreatment = await casePatient_StatusModel.findOne(
                {
                    '_ref_storeid': ObjectId(data._ref_storeid),
                    '_ref_branchid': ObjectId(data._ref_branchid),
                    '_ref_casepatientid': ObjectId(data._ref_casepatinetid),
                    'isnextvisited': false,
                },
                {},
                (err) => { if (err) { callback(err); return; } }
            );

            if (data.isnextvisited === false) {
                if (checkFirstTimeTreatment) { callback(new Error(`${controllerName}: checkFirstTimeTreatment return FOUND due requested to create FirstTime Treatment`)); return; }
            }
            else {
                if (!checkFirstTimeTreatment) { callback(new Error(`${controllerName}: checkFirstTimeTreatment return NOT FOUND Due requested to create NextVisit Treatment`)); return; }
                if (data._ref_treatment_progressionnoteid !== null) {
                    const findStatusTPGN = await casePatient_StatusModel.findOne(
                        {
                            _ref_casepatientid: ObjectId(data._ref_casepatinetid),
                            _ref_treatmentid: null,
                            _ref_treatment_progressionnoteid: ObjectId(data._ref_treatment_progressionnoteid),
                        },
                        {},
                        (err) => { if (err) { callback(err); return; } }
                    );

                    if (!findStatusTPGN) { callback(new Error(`${controllerName}: findStatusTPGN (Treatment Progression Note) return FOUND due requested to create NextVisit Treatment and have _ref_treatment_progressionnoteid`)); return; }
                }
            }
        }

        const _ref_scheduleid = await checkObjectId(data._ref_scheduleid, (err) => { if (err) { callback(err); return; } });
        const checkTreatmentExists = await treatmentModel.findOne(
            {
                '_ref_scheduleid': _ref_scheduleid,
            },
            {},
            (err) => { if (err) { callback(err); return; } }
        );
        if (checkTreatmentExists) { callback(new Error(`${controllerName}: checkTreatmentExists return found`)); return; }

        const chkSchedule = await Schedule_Check_Status(
            {
                _ref_storeid: data._ref_storeid,
                _ref_branchid: data._ref_branchid,
                _ref_scheduleid: data._ref_scheduleid
            },
            (err) => { if (err) { callback(err); return; } }
        );
        if (!chkSchedule) { callback(new Error(`${controllerName}: chkSchedule return not found`)); return; }

        const Update_Schedule_Status_W8_PO = async (cb = (err = new Error) => {}) => {
            const updateScheduleStatusResult = await Schedule_Update_Status(
                {
                    _ref_storeid: data._ref_storeid,
                    _ref_branchid: data._ref_branchid,
                    _ref_scheduleid: data._ref_scheduleid,
                    updateStatusMode: 4
                },
                (err) => { if (err) { cb(err); return; } }
            );
            if (!updateScheduleStatusResult) { cb(new Error(`${controllerName}: Update_Schedule_Status_W8_PO => updateScheduleStatusResult have error`)); return; }
            else {
                cb(null);
                return true;
            }
        };

        const Update_CasePatient_Status = async (_i_ref_treatmentid = ObjectId(), cb = (err = new Error) => {}) => {
            if (data.isnextvisited === false) {
                const MAP_ST_Casepatient = {
                    _ref_storeid: ObjectId(data._ref_storeid),
                    _ref_branchid: ObjectId(data._ref_branchid),
                    _ref_casepatientid: ObjectId(data._ref_casepatinetid),
                    _ref_treatmentid: ObjectId(_i_ref_treatmentid),
                    _ref_treatment_progressionnoteid: _ref_treatment_progressionnoteid,
                    _ref_poid: null,
                    isnextvisited: false,
                    isclosed: false,
                    istruncated: false,
                };
                const ST_CasepatientSave = new casePatient_StatusModel(MAP_ST_Casepatient);
                await ST_CasepatientSave.save().then(result => result).catch(err => { if (err) cb(err); });
            }
            else {
                if (_ref_treatment_progressionnoteid === null) {
                    const MAP_ST_Casepatient = {
                        _ref_storeid: ObjectId(data._ref_storeid),
                        _ref_branchid: ObjectId(data._ref_branchid),
                        _ref_casepatientid: ObjectId(data._ref_casepatinetid),
                        _ref_treatmentid: ObjectId(_i_ref_treatmentid),
                        _ref_treatment_progressionnoteid: _ref_treatment_progressionnoteid,
                        _ref_poid: null,
                        isnextvisited: true,
                        isclosed: false,
                        istruncated: false,
                    };
                    const ST_CasepatientSave = new casePatient_StatusModel(MAP_ST_Casepatient);
                    await ST_CasepatientSave.save().then(result => result).catch(err => { if (err) cb(err); });
                }
                else {
                    for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {
                        let findSTCasePatient = await casePatient_StatusModel.findOne(
                            {
                                '_ref_treatment_progressionnoteid': _ref_treatment_progressionnoteid,
                                '_ref_treatmentid': null,
                            },
                            {},
                            (err) => { if (err) { cb(err); return; } }
                        );

                        if (!findSTCasePatient) { continue; }
                        else {
                            findSTCasePatient._ref_treatmentid = ObjectId(_i_ref_treatmentid);
                            const updateSTCasePatientResult = await findSTCasePatient.save().then(result => result).catch(err => { if (err) { cb(err); return; } });

                            if (!updateSTCasePatientResult) { continue; }
                            else { break; }
                        }
                    }
                }
            }
        };

        const currentDateTime = misicController.currentDateTime();

        // Check Product <-> ProductFull
        let checkProductPassed = false;
        let productInventory = [];
        if (data.product.length !== 0 && data.product_full.length !== 0) {
            let checkProductPassedCount = 0;

            for (let index = 0; index < data.product_full.length; index++) {
                const elementProductFull = data.product_full[index];

                if (typeof elementProductFull._ref_productid != 'string' || !validateObjectId(elementProductFull._ref_productid)) { checkProductPassed = false; callback(new Error(`${controllerName}: data.product_full[${index}]._ref_productid must be String ObjectId`)); return; }
                else if (typeof elementProductFull.product_count != 'number' || elementProductFull.product_count < 0) { checkProductPassed = false; callback(new Error(`${controllerName}: data.product_full[${index}].product_count must be Number and more than or equal 0`)); return; }
                else if (typeof elementProductFull.product_price != 'number' || elementProductFull.product_price < 0) { checkProductPassed = false; callback(new Error(`${controllerName}: data.product_full[${index}].product_price must be Number and more than or equal 0`)); return; }
                else {
                    const filterCheckProduct = data.product.filter(where => (
                        where._ref_productid === elementProductFull._ref_productid &&
                        where.product_price === elementProductFull.product_price
                    ));

                    if (filterCheckProduct.length <= 0) { checkProductPassed = false; callback(new Error(`${controllerName}: data.product_full[${index}] not match in data.product`)); return; }
                    else {
                        const checkProductInventoryExists = await misicController.checkProductInventoryPrice(
                            {
                                _ref_storeid: data._ref_storeid,
                                _ref_branchid: data._ref_branchid,
                                _ref_productid: elementProductFull._ref_productid,
                                product_price: elementProductFull.product_price,

                                _ref_product_inventoryid: null
                            },
                            (err) => { if (err) { return; } }
                        );

                        if (!checkProductInventoryExists) { checkProductPassed = false; callback(new Error(`${controllerName}: data.product_full[${index}] not match checkProductInventoryPrice`)); return; }
                        else {
                            productInventory.push(checkProductInventoryExists);
                            checkProductPassedCount = checkProductPassedCount + 1;
                        }
                    }
                }
            }

            if (checkProductPassedCount !== data.product_full.length) { checkProductPassed = false; }
            else {
                checkProductPassed = true;
            }
        }
        else if (data.product.length === 0 && data.product_full.length === 0) { checkProductPassed = true; }
        else { checkProductPassed = false; callback(new Error(`${controllerName}: data.product and data.product_full pre process have error other`)); return; }

        // Check Course <-> CourseFull
        let checkCoursePassed = false;
        let courseInventory = [];
        if (data.course.length !== 0 && data.course_full.length !== 0) {
            let checkCoursePassedCount = 0;

            for (let index = 0; index < data.course_full.length; index++) {
                const elementCourseFull = data.course_full[index];

                if (typeof elementCourseFull._ref_courseid != 'string' || !validateObjectId(elementCourseFull._ref_courseid)) { checkCoursePassed = false; callback(new Error(`${controllerName}: data.course_full[${index}]._ref_courseid must be String ObjectId`)); return; }
                else if (typeof elementCourseFull.course_count != 'number' || elementCourseFull.course_count < 0) { checkCoursePassed = false; callback(new Error(`${controllerName}: data.course_full[${index}].course_count must be Number and more than or equal 0`)); return; }
                else if (typeof elementCourseFull.course_price != 'number' || elementCourseFull.course_price < 0) { checkCoursePassed = false; callback(new Error(`${controllerName}: data.course_full[${index}].course_price must be Number and more than or equal 0`)); return; }
                else {
                    const filterCheckCourse = data.course.filter(where => (
                        where._ref_courseid === elementCourseFull._ref_courseid &&
                        where.course_price === elementCourseFull.course_price
                    ));

                    if (filterCheckCourse.length <= 0) { checkCoursePassed = false; callback(new Error(`${controllerName}: data.course_full[${index}] not match in data.course`)); return; }
                    else {
                        const checkCourseExists = await misicController.checkCoursePrice(
                            {
                                _ref_courseid: elementCourseFull._ref_courseid,
                                _ref_storeid: data._ref_storeid,
                                _ref_branchid: data._ref_branchid,
                            },
                            (err) => { if (err) { return; } }
                        );

                        if (!checkCourseExists) { callback(new Error(`${controllerName}: data.course_full[${index}] not match in checkCourseExists`)); return; }
                        else if (checkCourseExists.course_price !== elementCourseFull.course_price) { callback(new Error(`${controllerName}: data.course_full[${index}] price not match`)); return; }
                        else {
                            courseInventory.push(checkCourseExists);
                            checkCoursePassedCount = checkCoursePassedCount + 1;
                        }
                    }
                }
            }

            if (checkCoursePassedCount !== data.course_full.length) { checkCoursePassed = false; }
            else {
                checkCoursePassed = true;
            }
        }
        else if (data.course.length === 0 && data.course_full.length === 0) { checkCoursePassed = false; }
        else { checkCoursePassed = false; callback(new Error(`${controllerName}: data.course and data.course_full pre process have error other`)); return; }

        // Check Agent
        const checkAgent = await misicController.checkAgentId(
            {
                _agentid: data._ref_agentid,
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        // Check Treatment (must not found)
        const _ref_casepatinetid = await checkObjectId(data._ref_casepatinetid, (err) => { if (err) { callback(err); return; } });
        // const checkCaseId_In_Treatment = await treatmentModel.find(
        //     {
        //         '_ref_casepatinetid': _ref_casepatinetid
        //     },
        //     {},
        //     (err) => { if (err) { callback(err); return; } }
        // );

        // Check CasePatient
        const checkCasePatient = await casePatientModel.findById(
            _ref_casepatinetid,
            (err) => { if (err) { callback(err); return; } }
        );

        const MAP_SUM_Product_Price = (data.product.length > 0) ? data.product.reduce((sum, where) => (sum + (where.product_price * where.product_count)), 0) : 0;
        const MAP_SUM_Course_Price = (data.course.length > 0) ? data.course.reduce((sum, where) => (sum + (where.course_price * where.course_count)), 0) : 0;
        
        const MAP_SUM_Price_Product_Course = MAP_SUM_Product_Price + MAP_SUM_Course_Price;

        const MAP_SUM_Discount_Product_Course = data.discount_product_price + data.discount_course_price;

        // 1st check Data Ref. Id
        if (MAP_SUM_Discount_Product_Course > MAP_SUM_Price_Product_Course) { callback(new Error(`${controllerName}: MAP_SUM_Discount_Product_Course (${MAP_SUM_Discount_Product_Course}) must lower than MAP_SUM_Price_Product_Course (${MAP_SUM_Price_Product_Course})`)); return; }
        else if (data.discount_product_price > MAP_SUM_Product_Price) { callback(new Error(`${controllerName}: data.discount_product_price (${data.discount_product_price}) must lower than MAP_SUM_Product_Price (${MAP_SUM_Product_Price})`)); return; }
        else if (data.discount_course_price > MAP_SUM_Course_Price) { callback(new Error(`${controllerName}: data.discount_course_price (${data.discount_course_price}) must lower than MAP_SUM_Course_Price (${MAP_SUM_Course_Price})`)); return; }
        else if (checkProductPassed === false) { callback(new Error(`${controllerName}: checkProductPassed return false`)); return; }
        else if (checkCoursePassed === false) { callback(new Error(`${controllerName}: checkCoursePassed return false`)); return; }
        else if (!checkAgent) { callback(new Error(`${controllerName}: checkAgent return not found`)); return; }
        else if (checkAgent.role !== 2) { callback(new Error(`${controllerName}: checkAgent return role ${checkAgent.role} due not equal 2`)); return; }
        // else if (!checkCaseId_In_Treatment || checkCaseId_In_Treatment.length <= 0) { callback(new Error(`${controllerName}: checkTreatment return not found`)); return; }
        else if (!checkCasePatient) { callback(new Error(`${controllerName}: checkCasePatient return not found`)); return; }
        else {
            // Create Treatment_Header Document
            const _ref_storeid = await checkObjectId(data._ref_storeid, (err) => { if (err) { callback(err); return; } });
            const _ref_branchid = await checkObjectId(data._ref_branchid, (err) => { if (err) { callback(err); return; } });

            const mapDataTreatment_Header = {
                run_number: null, // Run Number (Auto Incresement)
                _ref_treatment_progressionnoteid: _ref_treatment_progressionnoteid,
                _ref_casepatinetid: _ref_casepatinetid,
                _ref_scheduleid: _ref_scheduleid, // ObjectId คิว => ref: 'l_schedule.data._id'
                count_product_list: data.product.length, // จำนวนรายการสินค้าทั้งหมด
                price_product_list_total: MAP_SUM_Product_Price, // รวมราคาสินค้าทั้งหมด
                price_product_list_discount: data.discount_product_price, // ราคา ลดราคาสินค้า
                price_product_list_total_discount: MAP_SUM_Product_Price - data.discount_product_price, // รวมราคาสินค้า และลดราคาสินค้าทั้งหมด
                count_course_list: data.course.length, // จำนวนรายการ Course/Package ทั้งหมด
                price_course_list_total: MAP_SUM_Course_Price, // รวมราคา Course/Package ทั้งหมด
                price_course_list_discount: data.discount_course_price, // ราคา ลดราคาสินค้า
                price_course_list_total_discount: MAP_SUM_Course_Price - data.discount_course_price, // รวมราคาสินค้า และลดราคาสินค้าทั้งหมด
                price_total_before: MAP_SUM_Price_Product_Course, // ราคารวม สินค้า (Product) และการรักษา (Course/Package)
                price_discount: MAP_SUM_Discount_Product_Course, // ราคา ส่วนลดทั้งหมด
                price_total_after: MAP_SUM_Price_Product_Course - MAP_SUM_Discount_Product_Course, // ราคาสุทธิ (ราคารวมทั้งหมด-ราคาส่วนลดทั้งหมด)
                _ref_storeid: _ref_storeid, // ObjectId ร้าน => ref: 'm_store._id'
                _ref_branchid: _ref_branchid, // ObjectId สาขา => ref: 'm_store.branch._id'
                isclosed: false, // เปิดใช้งาน
                istruncated: false, // ปิดใช้งาน โดย Imd
                create_date: currentDateTime.currentDateTime_Object, // ObjectDateTime วัน-เวลาที่สร้าง
                create_date_string: currentDateTime.currentDate_String, // วันที่สร้าง (String) YYYY-MM-DD
                create_time_string: currentDateTime.currentTime_String, // เวลาที่สร้าง (String) HH:mm:ss
                _ref_agent_userid_create: checkAgent._agentid, // ObjectId _id ผู้สร้าง => ref: 'm_agents._id'
                _ref_agent_userstoreid_create: checkAgent._agentstoreid, // ObjectId store._id ผู้สร้าง => ref: 'm_agents.store._id'
                modify_date: currentDateTime.currentDateTime_Object, // ObjectDateTime วัน-เวลาที่แก้ไขล่าสุด
                modify_date_string: currentDateTime.currentDate_String, // วันที่แก้ไขล่าสุด (String) YYYY-MM-DD
                modify_time_string: currentDateTime.currentTime_String, // เวลาที่แก้ไขล่าสุด (String) HH:mm:ss
                _ref_agent_userid_modify: checkAgent._agentid, // ObjectId _id ผู้แก้ไขล่าสุด => ref: 'm_agents._id'
                _ref_agent_userstoreid_modify: checkAgent._agentstoreid, // ObjectId store._id ผู้แก้ไขล่าสุด => ref: 'm_agents.store._id'
                po_is_modified: false, // ถูกแก้ไขข้อมูล จากใบ PO
                medical_certificate_th: {
                    patient_name: data.medical_certificate_th.patient_name,
                    agent_name: data.medical_certificate_th.agent_name,
                    detected_symptom: data.medical_certificate_th.detected_symptom,
                    pt_diagnosis: data.medical_certificate_th.pt_diagnosis,
                    treatment: data.medical_certificate_th.treatment,
                },
                medical_certificate_en: {
                    patient_name: data.medical_certificate_en.patient_name,
                    agent_name: data.medical_certificate_en.agent_name,
                    detected_symptom: data.medical_certificate_en.detected_symptom,
                    pt_diagnosis: data.medical_certificate_en.pt_diagnosis,
                    treatment: data.medical_certificate_en.treatment,
                },
            };

            const mapNewTreatment_HeaderModel = new treatmentModel(mapDataTreatment_Header);
            const transactionSave_Treatment_Header = await mapNewTreatment_HeaderModel.save().then(result => result).catch(err => { if (err) { callback(err); return; } });

            if (!transactionSave_Treatment_Header) { callback(new Error(`${controllerName}: transactionSave_Treatment_Header failed`)); return; }
            else { // Create Product Treatment_Detail Document
                let product_Treatment_Detail_Document = [];

                for (let index = 0; index < data.product_full.length; index++) {
                    const elementProductFull = data.product_full[index];

                    const _ele_ref_productid = await checkObjectId(elementProductFull._ref_productid, (err) => { return; });

                    if (!_ele_ref_productid) { break; }
                    else {
                        const mapDataProductTreatment_Detail = {
                            run_number: null, // Run Number (Auto Incresement)
                            _ref_treatmentid: transactionSave_Treatment_Header._id,
                            _ref_casepatinetid: _ref_casepatinetid,
                            _ref_productid: _ele_ref_productid, // ObjectId => ref: 'm_product._id'
                            count_product: elementProductFull.product_count, // จำนวน สินค้า
                            price_product: elementProductFull.product_price, // ราคา สินค้า
                            price_product_total: elementProductFull.product_count * elementProductFull.product_price, // รวมราคา สินค้า
                            remark_product: elementProductFull.product_remark, // หมายเหตุของ สินค้า
                            _ref_courseid: null, // ObjectId Course/Package => ref: 'm_course._id'
                            count_course: 0, // ราคา Course/Package
                            price_course: 0, // ราคา Course/Package
                            price_course_total: 0, // รวมราคา Course/Package
                            remark_course: null, // หมายเหตุของ Course/Package
                            _ref_storeid: _ref_storeid, // ObjectId ร้าน => ref: 'm_store._id'
                            _ref_branchid: _ref_branchid, // ObjectId สาขา => ref: 'm_store.branch._id'
                            isused: false, // เปิดใช้งาน
                            istruncated: false, // ปิดใช้งาน โดย Imd
                            create_date: currentDateTime.currentDateTime_Object, // ObjectDateTime วัน-เวลาที่สร้าง
                            create_date_string: currentDateTime.currentDate_String, // วันที่สร้าง (String) YYYY-MM-DD
                            create_time_string: currentDateTime.currentTime_String, // เวลาที่สร้าง (String) HH:mm:ss
                            _ref_agent_userid_create: checkAgent._agentid, // ObjectId _id ผู้สร้าง => ref: 'm_agents._id'
                            _ref_agent_userstoreid_create: checkAgent._agentstoreid, // ObjectId store._id ผู้สร้าง => ref: 'm_agents.store._id'
                            modify_date: currentDateTime.currentDateTime_Object, // ObjectDateTime วัน-เวลาที่แก้ไขล่าสุด
                            modify_date_string: currentDateTime.currentDate_String, // วันที่แก้ไขล่าสุด (String) YYYY-MM-DD
                            modify_time_string: currentDateTime.currentTime_String, // เวลาที่แก้ไขล่าสุด (String) HH:mm:ss
                            _ref_agent_userid_modify: checkAgent._agentid, // ObjectId _id ผู้แก้ไขล่าสุด => ref: 'm_agents._id'
                            _ref_agent_userstoreid_modify: checkAgent._agentstoreid, // ObjectId store._id ผู้แก้ไขล่าสุด => ref: 'm_agents.store._id'
                            po_is_modified: false, // ถูกแก้ไขข้อมูล จากใบ PO   
                        };

                        const mapNewProductTreatment_DetailModel = new treatmentDetailModel(mapDataProductTreatment_Detail);
                        const transactionSave_ProductTreatment_Detail = await mapNewProductTreatment_DetailModel.save().then(result => result).catch(err => { if (err) { return; } });
                        if (!transactionSave_ProductTreatment_Detail) { break; }
                        else {
                            product_Treatment_Detail_Document.push(transactionSave_ProductTreatment_Detail);
                        }
                    }
                }

                if (product_Treatment_Detail_Document.length !== data.product_full.length) {
                    for (let index = 0; index < product_Treatment_Detail_Document.length; index++) {
                        const elementProductTreatmentDetailDoc = product_Treatment_Detail_Document[index];
                        await treatmentDetailModel.findByIdAndDelete(elementProductTreatmentDetailDoc._id, (err) => { if (err) { return; } });
                    }

                    await treatmentModel.findByIdAndDelete(transactionSave_Treatment_Header._id, (err) => { if (err) { return; } });

                    callback(new Error(`${controllerName}: transactionSave_ProductTreatment_Detail have a ploblem while saving a document`));
                    return;
                }
                else { // Create Course Treatment_Detail Document
                    let course_Treatment_Detail_Document = [];

                    for (let index = 0; index < data.course_full.length; index++) {
                        const elementCourseFull = data.course_full[index];

                        const _ele_ref_courseid = await checkObjectId(elementCourseFull._ref_courseid, (err) => { return; });

                        if (!_ele_ref_courseid) { break; }
                        else {
                            const mapDataCourseTreatment_Detail = {
                                run_number: null, // Run Number (Auto Incresement)
                                _ref_treatmentid: transactionSave_Treatment_Header._id,
                                _ref_casepatinetid: _ref_casepatinetid,
                                _ref_productid: null, // ObjectId => ref: 'm_product._id'
                                count_product: 0, // จำนวน สินค้า
                                price_product: 0, // ราคา สินค้า
                                price_product_total: 0, // รวมราคา สินค้า
                                remark_product: null, // หมายเหตุของ สินค้า
                                _ref_courseid: _ele_ref_courseid, // ObjectId Course/Package => ref: 'm_course._id'
                                count_course: elementCourseFull.course_count, // ราคา Course/Package
                                price_course: elementCourseFull.course_price, // ราคา Course/Package
                                price_course_total: elementCourseFull.course_count * elementCourseFull.course_price, // รวมราคา Course/Package
                                remark_course: elementCourseFull.course_remark, // หมายเหตุของ Course/Package
                                _ref_storeid: _ref_storeid, // ObjectId ร้าน => ref: 'm_store._id'
                                _ref_branchid: _ref_branchid, // ObjectId สาขา => ref: 'm_store.branch._id'
                                isused: false, // เปิดใช้งาน
                                istruncated: false, // ปิดใช้งาน โดย Imd
                                create_date: currentDateTime.currentDateTime_Object, // ObjectDateTime วัน-เวลาที่สร้าง
                                create_date_string: currentDateTime.currentDate_String, // วันที่สร้าง (String) YYYY-MM-DD
                                create_time_string: currentDateTime.currentTime_String, // เวลาที่สร้าง (String) HH:mm:ss
                                _ref_agent_userid_create: checkAgent._agentid, // ObjectId _id ผู้สร้าง => ref: 'm_agents._id'
                                _ref_agent_userstoreid_create: checkAgent._agentstoreid, // ObjectId store._id ผู้สร้าง => ref: 'm_agents.store._id'
                                modify_date: currentDateTime.currentDateTime_Object, // ObjectDateTime วัน-เวลาที่แก้ไขล่าสุด
                                modify_date_string: currentDateTime.currentDate_String, // วันที่แก้ไขล่าสุด (String) YYYY-MM-DD
                                modify_time_string: currentDateTime.currentTime_String, // เวลาที่แก้ไขล่าสุด (String) HH:mm:ss
                                _ref_agent_userid_modify: checkAgent._agentid, // ObjectId _id ผู้แก้ไขล่าสุด => ref: 'm_agents._id'
                                _ref_agent_userstoreid_modify: checkAgent._agentstoreid, // ObjectId store._id ผู้แก้ไขล่าสุด => ref: 'm_agents.store._id'
                                po_is_modified: false, // ถูกแก้ไขข้อมูล จากใบ PO   
                            };

                            const mapNewCourseTreatment_DetailModel = new treatmentDetailModel(mapDataCourseTreatment_Detail);
                            const transactionSave_CourseTreatment_Detail = await mapNewCourseTreatment_DetailModel.save().then(result => result).catch(err => { if (err) { callback(err); return; } });
                            if (!transactionSave_CourseTreatment_Detail) { break; }
                            else {
                                course_Treatment_Detail_Document.push(transactionSave_CourseTreatment_Detail);
                            }
                        }
                    }

                    if (course_Treatment_Detail_Document.length !== data.course_full.length) {
                        for (let index = 0; index < course_Treatment_Detail_Document.length; index++) {
                            const elementCourseTreatmentDetailDoc = course_Treatment_Detail_Document[index];
                            await treatmentDetailModel.findByIdAndDelete(elementCourseTreatmentDetailDoc._id, (err) => { if (err) { return; } });
                        }

                        for (let index = 0; index < product_Treatment_Detail_Document.length; index++) {
                            const elementProductTreatmentDetailDoc = product_Treatment_Detail_Document[index];
                            await treatmentDetailModel.findByIdAndDelete(elementProductTreatmentDetailDoc._id, (err) => { if (err) { return; } });
                        }

                        await treatmentModel.findByIdAndDelete(transactionSave_Treatment_Header._id, (err) => { if (err) { return; } });

                        callback(new Error(`${controllerName}: transactionSave_CourseTreatment_Detail have a ploblem while saving a document`));
                        return;
                    }
                    else { 
                        if (data.product.length != 0) { // Product Inventory Decrese
                            const mapNewProductInventoryDecese = data.product.map(
                                where => (
                                    {
                                        _ref_productid: where._ref_productid,
                                        _product_inventory_decrese_count: where.product_count,
                                        product_inventory_price: where.product_price,
                                    }
                                )
                            );

                            const productInventoryDecreseResult = await productInventoryDecrese_Save(
                                {
                                    _ref_storeid: data._ref_storeid,
                                    _ref_branchid: data._ref_branchid,
                                    _ref_agentid: data._ref_agentid,
                                    product: mapNewProductInventoryDecese
                                },
                                (err) => { if (err) { return; } }
                            );

                            if (!productInventoryDecreseResult || productInventoryDecreseResult.failedInventoryId.length !== 0 || mapNewProductInventoryDecese.length !== productInventoryDecreseResult.updatedInventoryId.length) {
                                for (let index = 0; index < course_Treatment_Detail_Document.length; index++) {
                                    const elementCourseTreatmentDetailDoc = course_Treatment_Detail_Document[index];
                                    await treatmentDetailModel.findByIdAndDelete(elementCourseTreatmentDetailDoc._id, (err) => { if (err) { return; } });
                                }

                                for (let index = 0; index < product_Treatment_Detail_Document.length; index++) {
                                    const elementProductTreatmentDetailDoc = product_Treatment_Detail_Document[index];
                                    await treatmentDetailModel.findByIdAndDelete(elementProductTreatmentDetailDoc._id, (err) => { if (err) { return; } });
                                }

                                await treatmentModel.findByIdAndDelete(transactionSave_Treatment_Header._id, (err) => { if (err) { return; } });

                                callback(new Error(`${controllerName}: productInventoryDecreseResult have a ploblem while update the decrese of product inventory document`));
                                return;
                            }
                            else {
                                if (data._ref_treatment_progressionnoteid !== null) {
                                    for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {              
                                        let findTreatmentProgressionNoteUpdate = await treatment_ProgressionNoteModel.findOne(
                                            {
                                                '_id': _ref_treatment_progressionnoteid
                                            },
                                            {},
                                            (err) => { if (err) { console.error(err); return; } }
                                        );
                                        
                                        if (!findTreatmentProgressionNoteUpdate) { continue; }
                                        else {
                                            findTreatmentProgressionNoteUpdate._ref_treatmentid = ObjectId(transactionSave_Treatment_Header._id)
                                        }
                                    }

                                    for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {              
                                        let findArchiveTreatmentUpdate = await archiveTreatmentModel.findOne(
                                            {
                                                '_ref_original_treatmentid': ObjectId(transactionSave_Treatment_Header._id)
                                            },
                                            {},
                                            (err) => { if (err) { console.error(err); return; } }
                                        );
                                        
                                        if (!findArchiveTreatmentUpdate) { continue; }
                                        else {
                                            findArchiveTreatmentUpdate._ref_treatment_progressionnoteid = _ref_treatment_progressionnoteid
                                        }
                                    }
                                }
                                // archiveTreatmentModel
                                await Update_Schedule_Status_W8_PO((err) => { if (err) { console.error(err); return; } });
                                await Update_CasePatient_Status(ObjectId(transactionSave_Treatment_Header._id),(err) => { if (err) { console.error(err); return; } });

                                callback(null);
                                return {
                                    transactionSave_Treatment_Header,
                                    product_Treatment_Detail_Document,
                                    course_Treatment_Detail_Document,
                                };
                            }
                        }
                        else {
                            if (data._ref_treatment_progressionnoteid !== null) {
                                for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {              
                                    let findTreatmentProgressionNoteUpdate = await treatment_ProgressionNoteModel.findOne(
                                        {
                                            '_id': _ref_treatment_progressionnoteid
                                        },
                                        {},
                                        (err) => { if (err) { console.error(err); return; } }
                                    );
                                    
                                    if (!findTreatmentProgressionNoteUpdate) { continue; }
                                    else {
                                        findTreatmentProgressionNoteUpdate._ref_treatmentid = ObjectId(transactionSave_Treatment_Header._id)
                                    }
                                }
                                
                                for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {              
                                    let findArchiveTreatmentUpdate = await archiveTreatmentModel.findOne(
                                        {
                                            '_ref_original_treatmentid': ObjectId(transactionSave_Treatment_Header._id)
                                        },
                                        {},
                                        (err) => { if (err) { console.error(err); return; } }
                                    );
                                    
                                    if (!findArchiveTreatmentUpdate) { continue; }
                                    else {
                                        findArchiveTreatmentUpdate._ref_treatment_progressionnoteid = _ref_treatment_progressionnoteid
                                    }
                                }
                            }
                            
                            await Update_Schedule_Status_W8_PO((err) => { if (err) { console.error(err); return; } });
                            await Update_CasePatient_Status(ObjectId(transactionSave_Treatment_Header._id), (err) => { if (err) { console.error(err); return; } });

                            callback(null);
                            return {
                                transactionSave_Treatment_Header,
                                product_Treatment_Detail_Document,
                                course_Treatment_Detail_Document,
                            };
                        }
                    }
                }
            }
        }
    }
};

module.exports = treatment_Save_Controller;