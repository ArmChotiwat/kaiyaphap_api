/**
 * Middleare สำหรับ ส่อง FirstTime/NextVisit Treatment
 */
const Treatment_Inspect_Middleware = (req, res, next) => {
    const { validateObjectId, validate_String_AndNotEmpty } = require('../../../Controller/miscController');
    try {
        /**
         ** Query Params => {
                "_ref_storeid": { type: StringObjectId },
                "_ref_branchid": { type: StringObjectId },
                "_ref_treatmentid": { type: StringObjectId },
            }
         */
        const { _ref_storeid, _ref_branchid, _ref_treatmentid } = req.query;

        let ErrorJson = {
            http_code: 400,
            document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
            description: []
        };

        if (!validate_String_AndNotEmpty(_ref_storeid) || !validateObjectId(_ref_storeid)) {
            ErrorJson.description.push(`<_ref_storeid> must be String ObjectId and Not Empty`);
        }

        if (!validate_String_AndNotEmpty(_ref_branchid)  || !validateObjectId(_ref_branchid)) {
            ErrorJson.description.push(`<_ref_branchid> must be String ObjectId and Not Empty`);
        }

        if (!validate_String_AndNotEmpty(_ref_treatmentid) || !validateObjectId(_ref_treatmentid)) {
            ErrorJson.description.push(`<_ref_treatmentid> must be String ObjectId and Not Empty`);
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

module.exports = Treatment_Inspect_Middleware;