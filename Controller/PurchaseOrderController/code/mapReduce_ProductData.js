/**
 * Sub Controller สำหรับ ยุบรวมข้อมูล Product ที่ซ้ำกัน
 */
const mapReduce_ProductData = async (
    product = [
        {
            _ref_productid: '',
            product_price: 0,
            product_count: 0,
            product_remark: null
        }
    ],
    callback = (err = new Error) => { }
) => {
    const controllerName = `PurchaseOrder_TreatmentPreProcess_Controller => mapReduce_TreatmentDetail`;

    if (typeof product != 'object' || product.length < 0) { callback(new Error(`${controllerName}: product must be array and length equal 0`)); return; }
    else if (product.length === 0) {
        callback(null);
        return {
            productTreatmentDetail: [],
            productTreatmentDetail_Full: []
        };
    }
    else {
        const { validateObjectId, validate_StringOrNull_AndNotEmpty } = require('../../miscController');

        let prodcutTreatmentDetailValidated = [];

        for (let index = 0; index < product.length; index++) {
            const elementProductTreatmentDetail = product[index];

            if (typeof elementProductTreatmentDetail._ref_productid != 'string' || !validateObjectId(elementProductTreatmentDetail._ref_productid)) { callback(new Error(`${controllerName}: productTreatmentDetail[${index}]._ref_productid must be String ObjectId`)); return; }
            else if (typeof elementProductTreatmentDetail.product_price != 'number' || elementProductTreatmentDetail.product_price < 0) { callback(new Error(`${controllerName}: productTreatmentDetail[${index}].product_price must be number and morethan or equal 0`)); return; }
            else if (typeof elementProductTreatmentDetail.product_count != 'number' || elementProductTreatmentDetail.product_count <= 0) { callback(new Error(`${controllerName}: productTreatmentDetail[${index}].product_count must be number and morethan 0`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(elementProductTreatmentDetail.product_remark)) { callback(new Error(`${controllerName}: productTreatmentDetail[${index}].remark_product must be String or Null`)); return; }
            else {
                const checkPTDIndex = prodcutTreatmentDetailValidated.findIndex(
                    where => (
                        where._ref_productid === elementProductTreatmentDetail._ref_productid
                    )
                );

                if (checkPTDIndex == -1) {
                    prodcutTreatmentDetailValidated.push(elementProductTreatmentDetail);
                }
                else {
                    if (prodcutTreatmentDetailValidated[checkPTDIndex].product_price == elementProductTreatmentDetail.product_price) {
                        prodcutTreatmentDetailValidated[checkPTDIndex].product_count = prodcutTreatmentDetailValidated[checkPTDIndex].product_count + elementProductTreatmentDetail.product_count;
                    }
                    else { callback(new Error(`${controllerName}: data reduce mapper failed productTreatmentDetail[${index}].price ${elementProductTreatmentDetail.product_price} not equal prodcutTreatmentDetailValidated[${checkPTDIndex}].price ${prodcutTreatmentDetailValidated[checkPTDIndex].product_price}`)); return; }
                }
            }
        }

        if (prodcutTreatmentDetailValidated.length <= 0) { callback(new Error(`${controllerName}: prodcutTreatmentDetailValidated processing failed`)); return; }
        else {
            callback(null);
            return {
                productTreatmentDetail: prodcutTreatmentDetailValidated.map(
                    where => (
                        {
                            _ref_productid: String(where._ref_productid),
                            product_price: Number(where.product_price),
                            product_count: Number(where.product_count)
                        }
                    )
                ),
                productTreatmentDetail_Full: product.map(
                    where => (
                        {
                            _ref_productid: String(where._ref_productid),
                            product_price: Number(where.product_price),
                            product_count: Number(where.product_count),
                            remark_product: (typeof where.product_remark == 'string') ? where.product_remark : null
                        }
                    )
                )
            };
        }
    }
};

module.exports = mapReduce_ProductData;