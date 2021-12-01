/**
 * Middleware สำหรับ Route POST => /masterdata/productgroup/create
 * 
 * ทำหน้าที่ตรวจจับ JSON ที่ส่งเข้ามาด้วยเงื่อนไขดังต่อไปนี้
 * 
 ** name จะต้องเป็น String และไม่มีค่าว่าว่าง
 ** _storeid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 * 
 * ***หากทีการตรวจสอบแล้ว ไม่ถูกต้องตามเงื่อนไข จะส่ง Response Code 400 (Bad Request) ไป***
 * 
 */
const productGroup_Save_Middleware = (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;

    const payload = req.body;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    if(typeof payload.name != 'string' || payload.name == '') {
        ErrorJson.description.push(`name must be String ObjectId and Not Empty`);
    }

    if (typeof payload._storeid != 'string' || payload._storeid == '') {
        ErrorJson.description.push(`_storeid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._storeid)) {
            ErrorJson.description.push(`_storeid Validate ObjectId return false`);
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
 * Middleware สำหรับ Route PUT => /masterdata/productgroup/edit
 * 
 * ทำหน้าที่ตรวจจับ JSON ที่ส่งเข้ามาด้วยเงื่อนไขดังต่อไปนี้
 * 
 ** name จะต้องเป็น String และไม่มีค่าว่าว่าง
 ** _product_groupid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 ** _storeid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 * 
 * ***หากทีการตรวจสอบแล้ว ไม่ถูกต้องตามเงื่อนไข จะส่ง Response Code 400 (Bad Request) ไป***
 * 
 */
const productGroup_Edit_Middleware = (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;

    const payload = req.body;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    if(typeof payload.name != 'string' || payload.name == '') {
        ErrorJson.description.push(`name must be String ObjectId and Not Empty`);
    }

    if (typeof payload._product_groupid != 'string' || payload._product_groupid == '') {
        ErrorJson.description.push(`_product_groupid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._storeid)) {
            ErrorJson.description.push(`_storeid Validate ObjectId return false`);
        }
    }

    if (typeof payload._storeid != 'string' || payload._storeid == '') {
        ErrorJson.description.push(`_storeid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._storeid)) {
            ErrorJson.description.push(`_storeid Validate ObjectId return false`);
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
 * Middleware สำหรับ Route PATCH => /masterdata/productgroup/edit
 * 
 * ทำหน้าที่ตรวจจับ JSON ที่ส่งเข้ามาด้วยเงื่อนไขดังต่อไปนี้
 * 
 ** _product_groupid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 ** _storeid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 * 
 * ***หากทีการตรวจสอบแล้ว ไม่ถูกต้องตามเงื่อนไข จะส่ง Response Code 400 (Bad Request) ไป***
 * 
 */
const productGroup_Switch_Middleware = (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;

    const payload = req.body;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    if (typeof payload._product_groupid != 'string' || payload._product_groupid == '') {
        ErrorJson.description.push(`_product_groupid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._storeid)) {
            ErrorJson.description.push(`_storeid Validate ObjectId return false`);
        }
    }

    if (typeof payload._storeid != 'string' || payload._storeid == '') {
        ErrorJson.description.push(`_storeid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(payload._storeid)) {
            ErrorJson.description.push(`_storeid Validate ObjectId return false`);
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
 * Middleware สำหรับ Route GET => /masterdata/productgroup/:storeid/:branchid
 * 
 * ทำหน้าที่ตรวจจับ Params ที่ส่งเข้ามาด้วยเงื่อนไขดังต่อไปนี้
 * 
 ** storeid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 ** branchid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 * 
 * ***หากทีการตรวจสอบแล้ว ไม่ถูกต้องตามเงื่อนไข จะส่ง Response Code 400 (Bad Request) ไป***
 * 
 */
const productGroup_View_Middleware = (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;

    const { storeid, branchid } = req.params;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    if (typeof storeid != 'string' || storeid == '') {
        ErrorJson.description.push(`Param _storeid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(storeid)) {
            ErrorJson.description.push(`Param _storeid Validate ObjectId return false`);
        }
    }
    if (typeof branchid != 'string' || branchid == '') {
        ErrorJson.description.push(`Param _branchid must be String ObjectId and Not Empty`);
    }
    else {
        if (!validateObjectId(branchid)) {
            ErrorJson.description.push(`Param _branchid Validate ObjectId return false`);
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
    productGroup_Save_Middleware,
    productGroup_Edit_Middleware,
    productGroup_Switch_Middleware,
    productGroup_View_Middleware,
};