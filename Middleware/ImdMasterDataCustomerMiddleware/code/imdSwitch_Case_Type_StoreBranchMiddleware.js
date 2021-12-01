/**
 * Middleware สำหรับ เปิด-ปิด Case Type ของลูกค้า ตามร้าน/สาขา
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const imdSwitch_Case_Type_StoreBranchMiddleware = (req, res, next) => {
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };

    const { validate_StringObjectId_NotNull } = require('../../../Controller/miscController');

    try {
        const { _ref_storeid, _ref_branchid, _ref_case_typeid } = req.body;

        if (!validate_StringObjectId_NotNull(_ref_storeid)) { ErrorJson.description.push(`Paratmer <_ref_storeid> must be String ObjectId`); }
        if (!validate_StringObjectId_NotNull(_ref_branchid)) { ErrorJson.description.push(`Paratmer <_ref_branchid> must be String ObjectId`); }
        if (!validate_StringObjectId_NotNull(_ref_case_typeid)) { ErrorJson.description.push(`Paratmer <_ref_case_typeid> must be String ObjectId`); }

        if (ErrorJson.description > 0) {
            res.status(400).json(ErrorJson).end();
            return;
        }
        else {
            next();
            return;
        }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        ErrorJson.http_code = 422;
        res.status(422).end();
        return;
    }
};


module.exports = imdSwitch_Case_Type_StoreBranchMiddleware;