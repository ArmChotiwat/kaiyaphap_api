/**
 * Middleare สำหรับ ดู Progression Note
 */
const Treatment_ProgressionNote_View_Middleware = (req, res, next) => {
    const { validateObjectId } = require('../../../Controller/mongodbController');
    try {
        /**
         ** Query Params => {
                "_ref_storeid": { type: StringObjectId },
                "_ref_branchid": { type: StringObjectId },
                "_ref_casepatinetid": { type: StringObjectId },
                "skip": { type: StringObjectId },
            }
         */
        const { _ref_storeid, _ref_branchid, _ref_casepatinetid, skip } = req.query;

        let ErrorJson = {
            http_code: 400,
            document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
            description: []
        };

        if (typeof _ref_storeid != 'string' || !validateObjectId(_ref_storeid)) {
            ErrorJson.description.push(`<_ref_storeid> must be String ObjectId and Not Empty`);
        }

        if (typeof _ref_branchid != 'string' || !validateObjectId(_ref_branchid)) {
            ErrorJson.description.push(`<_ref_branchid> must be String ObjectId and Not Empty`);
        }

        if (typeof _ref_casepatinetid != 'string' || !validateObjectId(_ref_casepatinetid)) {
            ErrorJson.description.push(`<_ref_casepatinetid> must be String ObjectId and Not Empty`);
        }

        if (isNaN(Number(skip))) {
            ErrorJson.description.push(`<skip> must be Number morethan or equal 0`);
        }
        else {
            if (Number(skip) < 0) {
                ErrorJson.description.push(`<skip> must be Number morethan or equal 0`);
            }
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

module.exports = Treatment_ProgressionNote_View_Middleware;