/**
 * Middleware สำหรับ Route GET => /masterdata/ptdiagnosis/:storeid/:branchid
 * 
 * ทำหน้าที่ตรวจจับ JSON ที่ส่งเข้ามาด้วยเงื่อนไขดังต่อไปนี้
 * 
 ** _storeid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 ** _branchid จะต้องเป็น ObjectId ที่อยู่ในรูปแบบ String และไม่มีค่าว่าว่าง
 * 
 * ***หากทีการตรวจสอบแล้ว ไม่ถูกต้องตามเงื่อนไข จะส่ง Response Code 400 (Bad Request) ไป***
 * 
 */
const ptDiagnosis_View_Middleware = (req, res, next) => {
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
    ptDiagnosis_View_Middleware,
};