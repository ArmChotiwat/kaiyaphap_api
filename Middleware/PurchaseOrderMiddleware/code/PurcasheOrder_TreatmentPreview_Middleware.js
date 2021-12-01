/**
 * Middleare สำหรับ ดู Treatment เพื่อทำ ใบจ่ายยา Purchase Order (PO)
 */
const PurcasheOrder_ScheduleTreatment_Preview_Middleware = (req, res, next) => {
    const { validateObjectId } = require('../../../Controller/mongodbController');
    try {
        /**
         ** Parameter => {
                "storeid": { type: StringObjectId },
                "brancid": { type: StringObjectId },
                "scheduleid": { type: StringObjectId },
            }
         */
        const { storeid, branchid, scheduleid } = req.params;

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

        if (typeof scheduleid != 'string' || !validateObjectId(scheduleid)) {
            ErrorJson.description.push(`<scheduleid> must be String ObjectId and Not Empty`);
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

module.exports = PurcasheOrder_ScheduleTreatment_Preview_Middleware;