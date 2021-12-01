/**
 * Middleware สำหรับ ดู รายชื่อ Admin/นักกายภาพ ที่ใช้งานอยู่ ตามสาขา
 * 
 * Route GET => /product/inventoryimport/viewagent/:storeid/:branchid
 */
const productInventoryImport_View_Agent_Middleware = (req, res, next) => {
    try {
        const middlewareName = `productInventoryImport_View_Agent_Middleware`;
        const validateObjectId = require('../../../Controller/miscController').validateObjectId;

        /**
         ** Params => {
                "storeid": { type: StringObjectId },
                "branchid": { type: StringObjectId },
            }
        */
       const { storeid, branchid } = req.params;
        
        let ErrorJson = {
            http_code: 400,
            document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
            description: []
        };

        if (typeof storeid != 'string' || !validateObjectId(storeid)) { ErrorJson.description.push(`${middlewareName}: Params <storeid> must be String ObjectId`); }

        if (typeof branchid != 'string' || !validateObjectId(branchid)) { ErrorJson.description.push(`${middlewareName}:Params <branchid> must be String ObjectId`); }

        if (ErrorJson.description.length != 0) {
            res.status(400).json(ErrorJson).end();
        } else {
            next();
        }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }

};

module.exports = productInventoryImport_View_Agent_Middleware;