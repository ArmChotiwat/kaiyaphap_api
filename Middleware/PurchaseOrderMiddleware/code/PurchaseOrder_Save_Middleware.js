/**
 * Middleare สำหรับ Route สร้างใบ PurchaseOrder (PO)
 */
const PurchaseOrder_Save_Middleware = (req, res, next) => {
    const { validateObjectId, validate_StringOrNull_AndNotEmpty } = require('../../../Controller/miscController');
    try {
        /**
         ** JSON => {
                "_ref_storeid": { type: StringObjectId },
                "_ref_branchid": { type: StringObjectId },
                "_ref_treatmentid": { type: StringObjectId Or Null },
                "discount_course_price": { type: Number more than or equal 0 },
                "discount_product_price": { type: Number more than or equal 0 },
                "paid_type": { type: String },
                "course": [
                    {
                        "_ref_courseid": { type: StringObjectId },
                        "course_price": { type: Number more than or equal 0 },
                        "course_count": { type: Number more than 0 },
                        "course_remark": { type: String OR null },
                    }
                ],
                "product": [
                    {
                        "_ref_productid": { type: StringObjectId },
                        "product_price": { type: Number more than or equal 0 },
                        "product_count": { type: Number more than 0 },
                        "product_remark": { type: String OR null },s
                    }
                ]
            }
         ** หมายเหตุ
            ** _ref_treatmentid ถ้าการสร้าง PO ครั้งนี้มาจาก Treatment จะต้องแนบ String ObjectId ของ Treatment มาด้วย
            ** _ref_treatmentid ถ้าการสร้าง PO ครั้งนี้มาจาก หน้า Couter จะต้องทำให้ _ref_treatmentid มีค่าเป็น null
            ** course หากเป็นรายการที่ได้มา Treatment ครั้งแรก หรือ Treatment ที่เป็น Next Visit ต้องมีอย่างน้อย 1 รายการ และ course สามารถซ้ำรายการได้หาก หมายเหตุ (course_remark) ไม่ซ้ำกัน
            ** course หากเป็นรายการที่มาจาก Couter (_ref_treatmentid === null) จะไม่มีการส่ง course มา
            ** product ซ้ำรายการได้หาก หมายเหตุ (product_remark) ไม่ซ้ำกัน
            ** product หากเป็นรายการที่มาจาก Couter (_ref_treatmentid === null) ต้องมีอย่างน้อย 1 รายการ และ product สามารถซ้ำรายการได้หาก หมายเหตุ (product_remark) ไม่ซ้ำกัน
            ** discount_course_price การกำหนดราคา ส่วนลด ของการรักษา นั้นจะต้องมีค่ามากกว่า หรือเท่ากับ 0 และต้องมีค่าน้อยกว่า หรือเท่ากับ ของราคารวมทั้งหมดของการรักษา
            ** discount_product_price การกำหนดราคา ส่วนลด ของอุปกรณ์ นั้นจะต้องมีค่ามากกว่า หรือเท่ากับ 0 และต้องมีค่าน้อยกว่า หรือเท่ากับ ของราคารวมทั้งหมดของอุปกรณ์
        */
        const payload = req.body;

        let ErrorJson = {
            http_code: 400,
            document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
            description: []
        };

        if (typeof payload._ref_storeid != 'string' || !validateObjectId(payload._ref_storeid)) {
            ErrorJson.description.push(`<_ref_storeid> must be String ObjectId and Not Empty`);
        }

        if (typeof payload._ref_branchid != 'string' || !validateObjectId(payload._ref_branchid)) {
            ErrorJson.description.push(`<_ref_branchid> must be String ObjectId and Not Empty`);
        }

        // if (typeof payload._ref_agentid != 'string' || !validateObjectId(payload._ref_agentid)) {
        //     ErrorJson.description.push(`<_ref_agentid> must be String ObjectId and Not Empty`);
        // }

        if (typeof payload.paid_type != 'string' || !validate_StringOrNull_AndNotEmpty(payload.paid_type)) {
            ErrorJson.description.push(`<paid_type> must be String ObjectId and Not Empty`);
        }

        if (payload._ref_treatmentid !== null) {
            if (typeof payload._ref_treatmentid != 'string' || !validateObjectId(payload._ref_treatmentid)) {
                ErrorJson.description.push(`<_ref_treatmentid> must be String ObjectId`);
            }
        }
        // else { // PO Couter (WIP)
        //     ErrorJson.description.push(`<_ref_treatmentid> must be String ObjectId Due null data is Woriking in process`);
        // }

        let SUM_Course_Price = 0;
        if (typeof payload.course !== 'object' && payload.course.length <= 0) {
            ErrorJson.description.push(`<course> must be Array and Length morethan 0`);
        }
        else {
            for (let index = 0; index < payload.course.length; index++) {
                const elementCourse = payload.course[index];

                if (typeof elementCourse._ref_courseid != 'string' || !validateObjectId(elementCourse._ref_courseid)) {
                    ErrorJson.description.push(`<course[${index}]._ref_courseid> must be String ObjectId`);
                }
                if (typeof elementCourse.course_price != 'number' || elementCourse.course_price < 0) {
                    ErrorJson.description.push(`<course[${index}].course_price> must be Number and morethan or equal 0`);
                }
                else if (typeof elementCourse.course_count != 'number' || elementCourse.course_count <= 0) {
                    ErrorJson.description.push(`<course[${index}].course_count> must be Number and morethan 0`);
                }
                else {
                    SUM_Course_Price += elementCourse.course_price * elementCourse.course_count;
                }
                if (elementCourse.course_remark !== null) {
                    if (typeof elementCourse.course_remark != 'string' || elementCourse.course_remark == '') {
                        ErrorJson.description.push(`<course[${index}].course_remark> must be String or Null and Not Empty`);
                    }
                }
            }
        }
        
        let SUM_Product_Price = 0;
        if (typeof payload.product !== 'object' && payload.product.length < 0) {
            ErrorJson.description.push(`<product> must be Array and Length morethan or equal 0`);
        }
        else {
            for (let index = 0; index < payload.product.length; index++) {
                const elementProduct = payload.product[index];

                if (typeof elementProduct._ref_productid != 'string' || !validateObjectId(elementProduct._ref_productid)) {
                    ErrorJson.description.push(`<product[${index}]._ref_productid> must be String ObjectId`);
                }
                if (typeof elementProduct.product_price != 'number' || elementProduct.product_price < 0) {
                    ErrorJson.description.push(`<product[${index}].product_price> must be Number and morethan or equal 0`);
                }
                else if (typeof elementProduct.product_count != 'number' || elementProduct.product_count <= 0) {
                    ErrorJson.description.push(`<product[${index}].product_count> must be Number and morethan 0`);
                }
                else {
                    SUM_Product_Price += elementProduct.product_price * elementProduct.product_count;
                }
                if (elementProduct.product_remark !== null) {
                    if (typeof elementProduct.product_remark != 'string' || elementProduct.product_remark == '') {
                        ErrorJson.description.push(`<product[${index}].product_remark> must be String or Null and Not Empty`);
                    }
                }
            }
        }

        if (typeof payload.discount_course_price != 'number' || payload.discount_course_price < 0) {
            ErrorJson.description.push(`<discount_course_price> must be Number morethan or equal 0`);
        }
        else {
            if (payload.discount_course_price > SUM_Course_Price) {
                ErrorJson.description.push(`<discount_course_price> (${payload.discount_course_price}) must be Number lowerthan or equal the total price of course (${SUM_Course_Price})`);
            }
        }

        if (typeof payload.discount_product_price != 'number' || payload.discount_product_price < 0) {
            ErrorJson.description.push(`<discount_product_price> must be Number morethan or equal 0`);
        }
        else {
            if (payload.discount_product_price > SUM_Product_Price) {
                ErrorJson.description.push(`<discount_product_price> (${payload.discount_product_price}) must be Number lowerthan or equal the total price of product (${SUM_Product_Price})`);
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

module.exports = PurchaseOrder_Save_Middleware;