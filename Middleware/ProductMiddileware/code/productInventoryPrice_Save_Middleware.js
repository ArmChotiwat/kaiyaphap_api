/**
 * Middleware สำหรับ บันทึก-ปรับ ราคาสินค้าปัจจุบัน ตามสาขา
 */
const productInventoryPrice_Save_Middleware = (req, res, next) => {
    try {
        const middlewareName = `productInventoryPrice_Save_Middleware`;
        const validateObjectId = require('../../../Controller/miscController').validateObjectId;
        const validate_StringOrNull_AndNotEmpty = require('../../../Controller/miscController').validate_StringOrNull_AndNotEmpty;

        /**
         ** JSON => {
                "_storeid": { type: StringObjectId }, // ObjectId ร้าน
                "_branchid": { type: StringObjectId }, // ObjectId สาขา
                "_ref_productid": { type: StringObjectId }, // ObjectId ระเบียนสินค้า
                "product_price": { type: Number morethan or equal 0 }, // ราคาสินค้าปัจจุบัน
                "run_number_inventoryimport_customize": { type: String Or null }, // เลขที่เองสารกำหนดเอง โดย User
                "run_number_inventoryimport_ref": { type: String Or null }, // เลขที่เอกสารอ้างอิง โดย User
            }
        */
        const payload = req.body;
        
        let ErrorJson = {
            http_code: 400,
            document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
            description: []
        };

        if (typeof payload._storeid != 'string' || !validateObjectId(payload._storeid)) { ErrorJson.description.push(`${middlewareName}: _storeid must be String ObjectId`); }

        if (typeof payload._branchid != 'string' || !validateObjectId(payload._branchid)) { ErrorJson.description.push(`${middlewareName}: _branchid must be String ObjectId`); }

        if (typeof payload._ref_productid != 'string' || !validateObjectId(payload._ref_productid)) { ErrorJson.description.push(`${middlewareName}: _ref_productid must be String ObjectId`); }

        if (typeof payload.product_price != 'number' || payload.product_price < 0) { ErrorJson.description.push(`${middlewareName}: product_price must be Number and morethan or equal 0`); }

        if (!validate_StringOrNull_AndNotEmpty(payload.run_number_inventoryimport_customize)) { ErrorJson.description.push(`${middlewareName}: run_number_inventoryimport_customize must be String or Null and Not Empty`); }

        if (!validate_StringOrNull_AndNotEmpty(payload.run_number_inventoryimport_ref)) { ErrorJson.description.push(`${middlewareName}: run_number_inventoryimport_ref must be String or Null and Not Empty`); }

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

module.exports = productInventoryPrice_Save_Middleware;