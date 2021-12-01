/**
 * Middleware สำหรับ Route /masterdata/course/create
 * 
 * ทำหน้าที่ตรวจจับ JSON ที่ส่งเข้ามาด้วยเงื่อนไขดังต่อไปนี้
 * 
 ** name จะต้องเป็น String และไม่มีค่าว่าว่าง
 ** _ref_course_groupid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 ** price จะต้องเป็น Number ที่มีค่ามากกว่าหรือเท่ากับ 0 และไม่มีค่าว่าว่าง
 ** _storeid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 ** _branchid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 * 
 * ***หากทีการตรวจสอบแล้ว ไม่ถูกต้องตามเงื่อนไข จะส่ง Response Code 400 (Bad Request) ไป***
 * 
 */
const course_Save_Middleware = (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;

    const payload = req.body;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    if (typeof payload.name != 'string' || payload.name == '') {
        ErrorJson.description.push(`name must be String and Not Empty`);
    }
    if (typeof payload._ref_course_groupid != 'string' || payload._ref_course_groupid == '') {
        ErrorJson.description.push(`payload._ref_course_groupid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._ref_course_groupid)) {
            ErrorJson.description.push(`payload._ref_course_groupid Validate ObjectId return false`);
        }
    }
    if (typeof payload.price != 'number' || payload.price < 0) {
        ErrorJson.description.push(`payload.price must be Number and More than 0`);
    }
    if (typeof payload._storeid != 'string' || payload._storeid == '') {
        ErrorJson.description.push(`payload._storeid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._storeid)) {
            ErrorJson.description.push(`payload._storeid Validate ObjectId return false`);
        }
    }
    if (typeof payload._branchid != 'string' || payload._branchid == '') {
        ErrorJson.description.push(`payload._branchid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._branchid)) {
            ErrorJson.description.push(`payload._branchid Validate ObjectId return false`);
        }
    }
    // if (typeof payload.refactor_name != 'boolean') {
    //     ErrorJson.description.push(`payload.refactor_name must be Boolean`);
    // }

    if(ErrorJson.description.length > 0) {
        res.status(400).json(ErrorJson).end();
    }
    else {
        next();
    }
};


/**
 * Middleware สำหรับ Route PUT /masterdata/course/edit
 * 
 * ทำหน้าที่ตรวจจับ JSON ที่ส่งเข้ามาด้วยเงื่อนไขดังต่อไปนี้
 * 
 ** name จะต้องเป็น String และไม่มีค่าว่าว่าง
 ** _courseid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 ** _ref_course_groupid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 ** price จะต้องเป็น Number ที่มีค่ามากกว่าหรือเท่ากับ 0 และไม่มีค่าว่าว่าง
 ** _storeid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 ** _branchid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 * 
 * ***หากทีการตรวจสอบแล้ว ไม่ถูกต้องตามเงื่อนไข จะส่ง Response Code 400 (Bad Request) ไป***
 * 
 */
const course_Edit_Middleware = (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;

    const payload = req.body;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    if (typeof payload.name != 'string' || payload.name == '') {
        ErrorJson.description.push(`name must be String and Not Empty`);
    }
    if (typeof payload._courseid != 'string' || payload._courseid == '') {
        ErrorJson.description.push(`payload._courseid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._courseid)) {
            ErrorJson.description.push(`payload._courseid Validate ObjectId return false`);
        }
    }
    if (typeof payload._ref_course_groupid != 'string' || payload._ref_course_groupid == '') {
        ErrorJson.description.push(`payload._ref_course_groupid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._ref_course_groupid)) {
            ErrorJson.description.push(`payload._ref_course_groupid Validate ObjectId return false`);
        }
    }
    if (typeof payload.price != 'number' || payload.price < 0) {
        ErrorJson.description.push(`payload.price must be Number and More than 0`);
    }
    if (typeof payload._storeid != 'string' || payload._storeid == '') {
        ErrorJson.description.push(`payload._storeid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._storeid)) {
            ErrorJson.description.push(`payload._storeid Validate ObjectId return false`);
        }
    }
    if (typeof payload._branchid != 'string' || payload._branchid == '') {
        ErrorJson.description.push(`payload._branchid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._branchid)) {
            ErrorJson.description.push(`payload._branchid Validate ObjectId return false`);
        }
    }
    // if (typeof payload.refactor_name != 'boolean') {
    //     ErrorJson.description.push(`payload.refactor_name must be Boolean`);
    // }

    if(ErrorJson.description.length > 0) {
        res.status(400).json(ErrorJson).end();
    }
    else {
        next();
    }
};




/**
 * Middleware สำหรับ Route PATCH /masterdata/course/edit
 * 
 * ทำหน้าที่ตรวจจับ JSON ที่ส่งเข้ามาด้วยเงื่อนไขดังต่อไปนี้
 * 
 ** name จะต้องเป็น String และไม่มีค่าว่าว่าง
 ** _courseid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 ** _storeid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 ** _branchid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 * 
 * ***หากทีการตรวจสอบแล้ว ไม่ถูกต้องตามเงื่อนไข จะส่ง Response Code 400 (Bad Request) ไป***
 * 
 */
const course_Switch_Middleware = (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;

    const payload = req.body;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    if (typeof payload._courseid != 'string' || payload._courseid == '') {
        ErrorJson.description.push(`payload._courseid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._courseid)) {
            ErrorJson.description.push(`payload._courseid Validate ObjectId return false`);
        }
    }
    if (typeof payload._storeid != 'string' || payload._storeid == '') {
        ErrorJson.description.push(`payload._storeid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._storeid)) {
            ErrorJson.description.push(`payload._storeid Validate ObjectId return false`);
        }
    }
    if (typeof payload._branchid != 'string' || payload._branchid == '') {
        ErrorJson.description.push(`payload._branchid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._branchid)) {
            ErrorJson.description.push(`payload._branchid Validate ObjectId return false`);
        }
    }

    if(ErrorJson.description.length > 0) {
        res.status(400).json(ErrorJson).end();
    }
    else {
        next();
    }
};




/**
 * Middleware สำหรับ Route /masterdata/course/:storeid/:branchid
 * 
 * ทำหน้าที่ตรวจจับ JSON ที่ส่งเข้ามาด้วยเงื่อนไขดังต่อไปนี้
 * 
 ** _storeid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 ** _branchid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 * 
 * ***หากทีการตรวจสอบแล้ว ไม่ถูกต้องตามเงื่อนไข จะส่ง Response Code 400 (Bad Request) ไป***
 * 
 */
const course_View_Middleware = (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;

    const { storeid, branchid } = req.params;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    if (typeof storeid != 'string' || storeid == '') {
        ErrorJson.description.push(`_storeid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(storeid)) {
            ErrorJson.description.push(`_storeid Validate ObjectId return false`);
        }
    }
    if (typeof branchid != 'string' || branchid == '') {
        ErrorJson.description.push(`_branchid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(branchid)) {
            ErrorJson.description.push(`_branchid Validate ObjectId return false`);
        }
    }

    if(ErrorJson.description.length > 0) {
        res.status(400).json(ErrorJson).end();
    }
    else {
        next();
    }
};


module.exports = {
    course_Save_Middleware,
    course_Edit_Middleware,
    course_Switch_Middleware,
    course_View_Middleware,
};