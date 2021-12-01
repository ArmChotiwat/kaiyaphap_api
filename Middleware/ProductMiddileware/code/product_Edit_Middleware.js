/**
 * Middleare สำหรับ Route แก้ไข ระเบียนสินค้า
 */
const product_Edit_Middleware = (req, res, next) => {
    const { validate_StringObjectId_NotNull } = require('../../../Controller/miscController');
    try {
        /**
         ** JSON => {
                "_storeid": { type: StringObjectId },
                "_ref_productid": { type: StringObjectId },
                "product_name": { type: String },
                "product_serial": { type: String OR null },
                "product_category": { type: String OR null },
                "product_brand": { type: String OR null },
                "product_main_version": { type: String OR null },
                "product_sub_version": { type: String OR null },
            }
         */
        const payload = req.body;

        let ErrorJson = {
            http_code: 400,
            document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
            description: []
        };

        if (!validate_StringObjectId_NotNull(payload._storeid)) {
            ErrorJson.description.push(`Parameter <_storeid> mest be ObjectId String and Not Empty`);
        }

        if (!validate_StringObjectId_NotNull(payload._ref_productid)) {
            ErrorJson.description.push(`Parameter <_ref_productid> mest be ObjectId String and Not Empty`);
        }

        if (typeof payload.product_name != 'string' || payload.product_name == '') {
            ErrorJson.description.push(`Parameter <product_name> must be string and Not Empty and Not null `);
        }

        if (payload.product_serial !== null) {
            if (typeof payload.product_serial != 'string') {
                ErrorJson.description.push(`Parameter <product_serial> must be String or Null and Not Empty`);
            } else if (payload.product_serial == '') {
                ErrorJson.description.push(`Parameter <product_serial> must be String or Null and Not Empty`);
            } else {

            }
        }
        if (payload.product_category !== null) {
            if (typeof payload.product_category != 'string') {
                ErrorJson.description.push(`Parameter <product_category> must be String or Null and Not Empty`);

            } else if (payload.product_category == '') {
                ErrorJson.description.push(`Parameter <product_category> must be String or Null and Not Empty`);
            } else {

            }
        }
        if (payload.product_brand !== null) {
            if (typeof payload.product_brand != 'string') {
                ErrorJson.description.push(`Parameter <product_brand> must be String or Null and Not Empty`);

            } else if (payload.product_brand == '') {
                ErrorJson.description.push(`Parameter <product_brand> must be String or Null and Not Empty`);
            } else {

            }
        }
        if (payload.product_main_version !== null) {
            if (typeof payload.product_main_version != 'string') {
                ErrorJson.description.push(`Parameter <product_main_version> must be String or Null and Not Empty`);

            } else if (payload.product_main_version == '') {
                ErrorJson.description.push(`Parameter <product_main_version> must be String or Null and Not Empty`);
            } else {

            }
        }
        if (payload.product_sub_version !== null) {
            if (typeof payload.product_sub_version != 'string') {
                ErrorJson.description.push(`Parameter <product_sub_version> must be String or Null and Not Empty`);

            } else if (payload.product_sub_version == '') {
                ErrorJson.description.push(`Parameter <product_sub_version> must be String or Null and Not Empty`);
            } else {

            }
        }
        if (payload._ref_product_groupid !== null) {
            if (!validate_StringObjectId_NotNull(payload._ref_product_groupid)) {
                ErrorJson.description.push(`Parameter <_ref_product_groupid> mest be ObjectId String and Not Empty`);
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
module.exports = product_Edit_Middleware;