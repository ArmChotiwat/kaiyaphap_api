/**
 * Middleare สำหรับ ดู ใบจ่ายยา Purchase Order (PO)
 */
const PurchaseOrder_View_Middleware = (req, res, next) => {
    const { validateObjectId } = require('../../../Controller/mongodbController');
    try {
        /**
         ** Parameter => {
                "storeid": { type: StringObjectId },
                "brancid": { type: StringObjectId },
                "purcaseorderid": { type: StringObjectId },
            }
         */
        const { storeid, branchid, purcaseorderid } = req.params;

        let ErrorJson = {
            http_code: 400,
            document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
            description: []
        };

        if (typeof storeid != 'string' || !validateObjectId(storeid)) {
            ErrorJson.description.push(`<storeid> must be String ObjectId and Not Empty`);
        }

        if (typeof branchid != 'string' || !validateObjectId(branchid)) {
            ErrorJson.description.push(`<branchid> must be String ObjectId and Not Empty`);
        }

        if (typeof purcaseorderid != 'string' || !validateObjectId(purcaseorderid)) {
            ErrorJson.description.push(`<purcaseorderid> must be String ObjectId and Not Empty`);
        }

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

module.exports = PurchaseOrder_View_Middleware;