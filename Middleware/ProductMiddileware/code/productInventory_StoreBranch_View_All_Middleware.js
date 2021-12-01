/**
 * Middleare สำหรับ Route ดู สินค้าคงคลัง (ทั้งหมด) ตามสาขา
 */
const productInventory_StoreBranch_View_All_Middleware = (req, res, next) => {
    const { validateObjectId } = require('../../../Controller/mongodbController');
    /**
     ** JSON => {
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

    if (typeof storeid != 'string' || !validateObjectId(storeid)) {
        ErrorJson.description.push(`productInventory_StoreBranch_View_All_Middleware <storeid> must be String ObjectId`);
    }

    if (typeof branchid != 'string' || !validateObjectId(branchid)) {
        ErrorJson.description.push(`productInventory_StoreBranch_View_All_Middleware <branchid> must be String ObjectId`);
    }

    if (ErrorJson.description.length != 0) {
        res.status(400).json(ErrorJson).end();
    } else {
        next();
    }
};
module.exports = productInventory_StoreBranch_View_All_Middleware;