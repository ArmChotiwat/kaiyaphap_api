/**
 * Sub Controller สำหรับ ตรวจสอบ ข้อมูล Product ที่รับจาก JSON แล้ว Map ข้อมูลใหม่ไว้ใชกับ treatment_Save_Controller
 */
const Treatment_Save_ProductMapper_Controller = async (
    product_full = [
        {
            _ref_productid: '',
            product_price: -1,
            product_count: 0,
            product_remark: '',
        }
    ],
    callback = (err = new Error) => {}
) => {
    const controllerName = `Treatment_Save_ProductMapper_Controller`;

    const { validateObjectId, validate_StringOrNull_AndNotEmpty } = require('../../miscController');

    if (typeof product_full != 'object') { callback(new Error(`${controllerName}: product_full must be Array Object`)); return; }
    else if (product_full.length < 0) { callback(new Error(`${controllerName}: product_full must be Array Object and Length of Array must be morethan or equal 0`)); return; }
    else {
        if (product_full.length === 0) {
            callback(null);
            return {
                product_full: [],
                product: []
            };
        }
        else {
            for (let index = 0; index < product_full.length; index++) {
                const elementProductFull = product_full[index];
                
                if (typeof elementProductFull._ref_productid != 'string' || !validateObjectId(elementProductFull._ref_productid)) { callback(new Error(`${controllerName}: product_full[${index}]._ref_productid Must be String ObjectId`)); return; }
                if (typeof elementProductFull.product_price != 'number' || elementProductFull.product_price < 0) { callback(new Error(`${controllerName}: product_full[${index}].product_price Must be Number and morethan or equal 0`)); return; }
                if (typeof elementProductFull.product_count != 'number' || elementProductFull.product_count <= 0) { callback(new Error(`${controllerName}: product_full[${index}].product_count Must be Number and morethan 0`)); return; }
                if (!validate_StringOrNull_AndNotEmpty(elementProductFull.product_remark)) { callback(new Error(`${controllerName}: product_full[${index}].product_remark Must be String or Null and Not Empty`)); return; }
            }

            let map_product_full = [];
            for (let index = 0; index < product_full.length; index++) {
                const elementTmpProductFull = product_full[index];

                const searchProductFull_1st =  product_full.filter(
                    where => (
                        where._ref_productid === elementTmpProductFull._ref_productid
                    )
                );
                const searchProductFull_2nd = product_full.filter(
                    where => (
                        where._ref_productid === elementTmpProductFull._ref_productid &&
                        where.product_price === elementTmpProductFull.product_price
                    )
                );
                const searchProductFull_3rd = product_full.filter(
                    where => (
                        where._ref_productid === elementTmpProductFull._ref_productid &&
                        where.product_price === elementTmpProductFull.product_price &&
                        where.product_count === elementTmpProductFull.product_count
                    )
                );
                const searchProductFull_4th = product_full.filter(
                    where => (
                        where._ref_productid === elementTmpProductFull._ref_productid &&
                        where.product_price === elementTmpProductFull.product_price &&
                        where.product_count === elementTmpProductFull.product_count &&
                        where.product_remark === elementTmpProductFull.product_remark
                    )
                );

                if (searchProductFull_1st.length <= 0) { callback(new Error(`${controllerName}: product_full[${index}] searchProductFull_1st return not found`)); return; }
                else if (searchProductFull_2nd.length <= 0) { callback(new Error(`${controllerName}: product_full[${index}] searchProductFull_2nd return not found`)); return; }
                else if (searchProductFull_3rd.length <= 0) { callback(new Error(`${controllerName}: product_full[${index}] searchProductFull_3rd return not found`)); return; }
                else if (searchProductFull_1st.length !== searchProductFull_2nd.length) { callback(new Error(`${controllerName}: product_full[${index}] searchProductFull_1st Length ${searchProductFull_1st.length} and searchProductFull_2nd Length ${searchProductFull_2nd.length} is not equal`)); return; }
                else if (searchProductFull_4th.length !== 1) { callback(new Error(`${controllerName}: course_full[${index}] searchProductFull_4th Length ${searchProductFull_4th.length} not equal 1`)); return; }
                else {
                    const searchIn_map_product_full = map_product_full.filter(
                        where => (
                            where._ref_productid === searchProductFull_1st[0]._ref_productid &&
                            where.product_price === searchProductFull_1st[0].product_price
                        )
                    );
                    if (searchIn_map_product_full.length < 0) { callback(new Error(`${controllerName}: product_full[${index}] map data is error`)); return; }
                    else if (searchIn_map_product_full.length === 0) {
                        map_product_full.push(
                            {
                                _ref_productid: elementTmpProductFull._ref_productid,
                                product_price: elementTmpProductFull.product_price,
                                product_count: elementTmpProductFull.product_count
                            }
                        );
                    }
                    else {
                        const findUpdate_indexOf = map_product_full.findIndex(where => where._ref_productid === elementTmpProductFull._ref_productid && where.product_price === elementTmpProductFull.product_price);

                        if (findUpdate_indexOf < 0) { callback(new Error(`${controllerName}: product_full[${index}] update map data is error`)); return; }
                        else {
                            map_product_full[findUpdate_indexOf].product_count = map_product_full[findUpdate_indexOf].product_count + elementTmpProductFull.product_count
                        }
                    }
                }
            }

            callback(null);
            return {
                product_full,
                product: map_product_full
            };
        }
    }
};

module.exports = Treatment_Save_ProductMapper_Controller;
