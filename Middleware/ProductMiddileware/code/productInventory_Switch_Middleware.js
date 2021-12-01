/**
 * Middleware สำหรับ เปิด-ปิด สินค้าคงคลัง ตามสาขา
 */
const productInventory_Switch_Middleware = (req, res, next) => {
    const { validateObjectId } = require('../../../Controller/mongodbController');
    try {
        /**
         ** JSON => {
                "_storeid": { type: StringObjectId },
                "_branchid": { type: StringObjectId },
                "_ref_productid": { type: StringObjectId },
            }
         */
        const payload = req.body;

        let ErrorJson = {
            http_code: 400,
            document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
            description: []
        };

        if (typeof payload._storeid != 'string' || !validateObjectId(payload._storeid)) {
            ErrorJson.description.push(`productInventory_Switch_Middleware <_storeid> mest be ObjectId String and Not Empty`);
        }

        if (typeof payload._branchid != 'string' || !validateObjectId(payload._branchid)) {
            ErrorJson.description.push(`productInventory_Switch_Middleware <_branchid> mest be ObjectId String and Not Empty`);
        }

        if (typeof payload._ref_productid != 'string' || !validateObjectId(payload._ref_productid)) {
            ErrorJson.description.push(`productInventory_Switch_Middleware <_ref_productid> mest be ObjectId String and Not Empty`);
        }

        if (ErrorJson.description.length != 0) {
            res.status(400).json(ErrorJson).end();
        } else {
            next();
        }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`productInventory_Switch_Middleware Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};
module.exports = productInventory_Switch_Middleware;