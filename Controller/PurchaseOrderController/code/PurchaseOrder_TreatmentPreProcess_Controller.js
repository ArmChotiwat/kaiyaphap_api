/**
 * Sub Controller สำหรับ ยุบรวมข้อมูล Course/Package ที่ซ้ำกัน
 */
const mapReduce_CourseData = async (
    courseDetail = [
        {
            _ref_courseid: '',
            course_price: 0,
            course_count: 0,
            course_remark: null
        }
    ],
    callback = (err = new Error) => { }
) => {
    const controllerName = `PurchaseOrder_TreatmentPreProcess_Controller => mapReduce_CourseData`;

    if (typeof courseDetail != 'object' || courseDetail.length <= 0) { callback(new Error(`${controllerName}: courseDetail must be array and length morethan 0`)); return; }
    else {
        const { validateObjectId, validate_StringOrNull_AndNotEmpty } = require('../../miscController');

        let courseDetailValidated = [];

        for (let index = 0; index < courseDetail.length; index++) {
            const elementCourseDetail = courseDetail[index];

            if (typeof elementCourseDetail._ref_courseid != 'string' || !validateObjectId(elementCourseDetail._ref_courseid)) { callback(new Error(`${controllerName}: courseDetail[${index}]._ref_productid must be String ObjectId`)); return; }
            else if (typeof elementCourseDetail.course_price != 'number' || elementCourseDetail.course_price < 0) { callback(new Error(`${controllerName}: courseDetail[${index}].course_price must be number and morethan or equal 0`)); return; }
            else if (typeof elementCourseDetail.course_count != 'number' || elementCourseDetail.course_count <= 0) { callback(new Error(`${controllerName}: courseDetail[${index}].course_count must be number and morethan 0`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(elementCourseDetail.course_remark)) { callback(new Error(`${controllerName}: courseDetail[${index}].course_remark must be String or Null`)); return; }
            else {
                const checkCDIndex = courseDetailValidated.findIndex(
                    where => (
                        where._ref_courseid === elementCourseDetail._ref_courseid &&
                        where.course_remark === elementCourseDetail.course_remark
                    )
                );

                if (checkCDIndex == -1) {
                    courseDetailValidated.push(elementCourseDetail);
                }
                else {
                    if (courseDetailValidated[checkCDIndex].course_price == elementCourseDetail.course_price) {
                        courseDetailValidated[checkCDIndex].course_count = courseDetailValidated[checkCDIndex].course_count + elementCourseDetail.course_count;
                    }
                    else { callback(new Error(`${controllerName}: data reduce mapper failed courseDetail[${index}].price_course ${elementCourseDetail.course_price} not equal prodcutTreatmentDetailValidated[${checkCDIndex}].price_course ${courseDetailValidated[checkCDIndex].course_price}`)); return; }
                }
            }
        }

        if (courseDetailValidated.length <= 0) { callback(new Error(`${controllerName}: prodcutTreatmentDetailValidated processing failed`)); return; }
        else {
            callback(null);
            return {
                courseDetail: courseDetailValidated.map(
                    where => (
                        {
                            _ref_courseid: String(where._ref_courseid),
                            course_price: Number(where.course_price),
                            course_count: Number(where.course_count)
                        }
                    )
                ),
                courseDetail_Full: courseDetail.map(
                    where => (
                        {
                            _ref_courseid: String(where._ref_courseid),
                            course_price: Number(where.course_price),
                            course_count: Number(where.course_count),
                            course_remark: (typeof where.course_remark == 'string' || where.course_remark === null) ? where.course_remark : null
                        }
                    )
                )
            };
        }
    }
};


/**
 * Sub Controller สำหรับหา inventoryid
 */
const checkProductId = async (
    _ref_storeid = '',
    _ref_branchid = '',
    product = [
        {
            _ref_productid: '',
            product_price: 0,
            product_count: 0,
        }
    ],
    callback = (err = new Error) => { }
) => {
    const controllerName = `PurchaseOrder_TreatmentPreProcess_Controller => checkProduct`;

    const validateObjectId = require('../../miscController').validateObjectId;

    if (typeof _ref_storeid != 'string' || !validateObjectId(_ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid> must be String ObjectId`)); return; }
    else if (typeof _ref_branchid != 'string' || !validateObjectId(_ref_branchid)) { callback(new Error(`${controllerName}: <_ref_branchid> must be String ObjectId`)); return; }
    else if (product.length === 0) { callback(new Error(`${controllerName}: length of product must morethan 0`)); return; }
    else {
        const { checkProductInventoryPrice } = require('../../miscController');

        let vaildProduct = [];

        for (let index = 0; index < product.length; index++) {
            const elementProduct = product[index];

            if (typeof elementProduct._ref_productid != 'string' || !validateObjectId(elementProduct._ref_productid)) { callback(new Error(`${controllerName}: product[${index}]._ref_productid must be String ObjectId`)); return; }
            else if (typeof elementProduct.product_price != 'number' || elementProduct.product_price < 0) { callback(new Error(`${controllerName}: product[${index}].product_price must be Number and morethan or equal 0`)); return; }
            else if (typeof elementProduct.product_count != 'number' || elementProduct.product_count <= 0) { callback(new Error(`${controllerName}: product[${index}].product_price must be Number and morethan 0`)); return; }
            else {
                const chkProduct = await checkProductInventoryPrice(
                    {
                        _ref_storeid: _ref_storeid,
                        _ref_branchid: _ref_branchid,
                        _ref_productid: elementProduct._ref_productid,
                        _ref_product_inventoryid: null,
                        product_price: elementProduct.product_price
                    },
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!chkProduct) { callback(new Error(`${controllerName}: product[${index}] chkProduct return not found`)); return; }
                else {
                    vaildProduct.push(
                        {
                            _ref_productid: elementProduct._ref_productid,
                            _ref_product_inventoryid: chkProduct._ref_product_inventoryid,
                            product_price: elementProduct.product_price,
                            product_count: elementProduct.product_count,
                        }
                    );
                }
            }
        }

        if (vaildProduct.length != product.length) { callback(new Error(`${controllerName}: <product> must be Array`)); return; }
        else {
            callback(null);
            return vaildProduct;
        }
    }
};


/**
 * Sub Controller สำหรับจัดการข้อมูล Product ที่เข้ามา และ Product ใน Treatment
 */
const compare_TreatmentProduct_And_RequestedProduct = async (
    _ref_storeid = '',
    _ref_branchid = '',
    _ref_treatmentid = '',
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
    const controllerName = `PurchaseOrder_TreatmentPreProcess_Controller => compare_TreatmentProduct_And_RequestedProduct`;

    const { validateObjectId } = require('../../miscController');

    if (typeof _ref_storeid != 'string' || !validateObjectId(_ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid> must be String ObjectId`)); return; }
    else if (typeof _ref_branchid != 'string' || !validateObjectId(_ref_branchid)) { callback(new Error(`${controllerName}: <_ref_branchid> must be String ObjectId`)); return; }
    else if (typeof _ref_treatmentid != 'string' || !validateObjectId(_ref_treatmentid)) { callback(new Error(`${controllerName}: <_ref_treatmentid> must be String ObjectId`)); return; }
    else if (product.length < 0) { callback(new Error(`${controllerName}: length of product must morethan or equal 0`)); return; }
    else {
        const { checkObjectId, treatmentModel, treatmentDetailModel } = require('../../mongodbController');

        const mapReduce_ProductData = require('./mapReduce_ProductData');

        const ObjectId_ref_treatmentid = await checkObjectId(_ref_treatmentid, (err) => { if (err) { callback(err); return; } });
        const ObjectId_ref_storeid = await checkObjectId(_ref_storeid, (err) => { if (err) { callback(err); return; } });
        const ObjectId_ref_branchid = await checkObjectId(_ref_branchid, (err) => { if (err) { callback(err); return; } });

        const productDoRemap = await mapReduce_ProductData(product, (err) => { if (err) { callback(err); return; } });

        const findTreatment = await treatmentModel.findOne(
            {
                '_id': ObjectId_ref_treatmentid,
                '_ref_storeid': ObjectId_ref_storeid,
                '_ref_branchid': ObjectId_ref_branchid,
            },
            {},
            (err) => { if (err) { callback(err); return; } }
        );

        const findTreatmentDetail = await treatmentDetailModel.find(
            {
                '_ref_storeid': ObjectId_ref_storeid,
                '_ref_branchid': ObjectId_ref_branchid,
                '_ref_treatmentid': ObjectId_ref_treatmentid,
                '_ref_productid': { $ne: null },
                '_ref_courseid': null,
            },
            {},
            (err) => { if (err) { callback(err); return; } }
        );

        if (!productDoRemap) { callback(new Error(`${controllerName}: product mapReduce_ProductData return have error`)); return; }
        else if (!findTreatment) { callback(new Error(`${controllerName}: product findTreatment return not found`)); return; }
        else if (!findTreatmentDetail) { callback(new Error(`${controllerName}: product findTreatmentDetail return not found`)); return; }
        else {
            const productRequestedReduce = productDoRemap.productTreatmentDetail;
            const productRequestedFull = productDoRemap.productTreatmentDetail_Full;

            if (findTreatmentDetail.length === 0) { // Not Have Any Product Found in TreatmentDetail
                if (productRequestedReduce.length === 0) { // findTreatmentDetail.length === 0 && product.length === 0
                    callback(null);
                    return {
                        request_Product: [],
                        exits_Product: [],
                        increase_Product: [],
                        decrease_Product: [],
                    };
                }
                else { // findTreatmentDetail.length === 0 && product.length > 0
                    const chkProductId = await checkProductId(
                        _ref_storeid,
                        _ref_branchid,
                        productRequestedReduce.map(
                            where => ({
                                _ref_productid: where._ref_productid,
                                product_price: where.product_price,
                                product_count: where.product_count,
                                remark_product: where.remark_product
                            })
                        ),
                        (err) => { if (err) { callback(err); return; } }
                    );

                    if (!chkProductId) { callback(new Error(`${controllerName}: product chkProductId return not found`)); return; }
                    else if (productRequestedReduce.length !== chkProductId.length) { callback(new Error(`${controllerName}: length of product (${productRequestedReduce.length}) and length of chkProductId (${chkProductId.length}) are not equal`)); return; }
                    else {
                        callback(null);
                        return {
                            request_Product: productRequestedReduce,
                            exits_Product: [],
                            increase_Product: chkProductId,
                            decrease_Product: [],
                        };
                    }
                }
            }
            else { // Have Any Product Found in TreatmentDetail
                if (productRequestedReduce.length === 0) { // findTreatmentDetail.length > 0 && product.length === 0
                    const chkInventoryTreatDetaiId = await checkProductId(
                        _ref_storeid,
                        _ref_branchid,
                        await mapReduce_ProductData(
                            findTreatmentDetail.map(
                                where => ({
                                    _ref_productid: String(where._ref_productid),
                                    product_price: Number(where.price_product),
                                    product_count: Number(where.count_product),
                                    product_remark: where.remark_product,
                                })
                            ),
                            (err) => { if (err) { callback(err); return; } }
                        ).then(result => result.productTreatmentDetail),
                        (err) => { if (err) { callback(err); return; } }
                    );


                    if (!chkInventoryTreatDetaiId) { callback(new Error(`${controllerName}: product chkProductId return not found`)); return; }
                    else {
                        callback(null);
                        return {
                            request_Product: [],
                            exits_Product: findTreatmentDetail.map(
                                where => ({
                                    _ref_productid: String(where._ref_productid),
                                    _ref_product_inventoryid: String(where._id),
                                    product_price: Number(where.price_product),
                                    product_count: Number(where.count_product),
                                    remark_product: (typeof where.remark_product == 'string') ? String(where.remark_product) : null
                                })
                            ),
                            increase_Product: [],
                            decrease_Product: chkInventoryTreatDetaiId,
                        };
                    }
                }
                else { // findTreatmentDetail.length > 0 && product.length > 0
                    const chkReqProductId = await checkProductId(
                        _ref_storeid,
                        _ref_branchid,
                        productRequestedReduce,
                        (err) => { if (err) { callback(err); return; } }
                    );

                    if (!chkReqProductId) { callback(new Error(`${controllerName}: chkReqProductId return not found`)); return; }
                    if (chkReqProductId.length != productRequestedReduce.length) { callback(new Error(`${controllerName}: length of chkReqProductId (${chkReqProductId.length}) not equal product.length (${productRequestedReduce.length})`)); return; }
                    else {
                        const reMapTreatmentDetailProduct = findTreatmentDetail.map(
                            where => ({
                                _ref_productid: String(where._ref_productid),
                                product_price: Number(where.price_product),
                                product_count: Number(where.count_product),
                                product_remark: (where.remark_product == null) ? null:where.remark_product
                            })
                        );
                        let productTreatmentDetail = await checkProductId(
                            _ref_storeid,
                            _ref_branchid,
                            await mapReduce_ProductData(
                                reMapTreatmentDetailProduct,
                                (err) => { if (err) { callback(err); return; } }
                            ).then(result => result.productTreatmentDetail),
                            (err) => { if (err) { callback(err); return; } }
                        );

                        if (!productTreatmentDetail) { callback(new Error(`${controllerName}: productTreatmentDetail map process error`)); return; }
                        else { // Map ProductTreatmentDetail And RequestedProduct (Considered RequestedProduct as Main Piority)
                            let productIncreasement = []; // PO จ่ายออก อีก ...
                            let productDecreasement = []; // PO คืนลง Inventory ...

                            for (let index = 0; index < chkReqProductId.length; index++) { // RequestedProduct
                                const elementReqProduct = chkReqProductId[index];

                                const findReqProductInProductTreatmentDetail = productTreatmentDetail.filter( // Check RequestedProduct is Duplicated ProductTreatmentDetail
                                    where => (where._ref_product_inventoryid === elementReqProduct._ref_product_inventoryid)
                                );

                                const findProudctIncrementDuplicated = productIncreasement.findIndex(where => (where._ref_product_inventoryid === elementReqProduct._ref_product_inventoryid));
                                const findProudctDecrementDuplicated = productDecreasement.findIndex(where => (where._ref_product_inventoryid === elementReqProduct._ref_product_inventoryid)); 

                                if (findReqProductInProductTreatmentDetail.length === 0) { // RequestedProduct NOT Duplicated ProductTreatmentDetail
                                    // จ่ายออก อีก ...
                                    if (findProudctIncrementDuplicated === -1) {
                                        productIncreasement.push(elementReqProduct);
                                        continue;
                                    }
                                    else {
                                        productIncreasement[findProudctIncrementDuplicated].product_count = productIncreasement[findProudctIncrementDuplicated].product_count + elementReqProduct.product_count;
                                        continue;
                                    }
                                }
                                else if (findReqProductInProductTreatmentDetail.length > 0) { // RequestedProduct IS Duplicated ProductTreatmentDetail
                                    const reduct_Count_RequestedProduct = chkReqProductId.reduce(
                                        (sumValue, currentValue) => {
                                            if (currentValue._ref_product_inventoryid === elementReqProduct._ref_product_inventoryid) {
                                                return sumValue + currentValue.product_count
                                            }
                                            else { return sumValue; }
                                        },
                                        0
                                    );
                                    const reduce_Count_ProductTreatmentDetail = findReqProductInProductTreatmentDetail.reduce((sumValue, currentValue) => (sumValue + currentValue.product_count), 0);

                                    if (reduct_Count_RequestedProduct > reduce_Count_ProductTreatmentDetail) { // จ่ายออก อีก ...
                                        if (findProudctIncrementDuplicated === -1) {
                                            productIncreasement.push(
                                                {
                                                    _ref_productid: elementReqProduct._ref_productid,
                                                    _ref_product_inventoryid: elementReqProduct._ref_product_inventoryid,
                                                    product_price: elementReqProduct.product_price,
                                                    product_count: elementReqProduct.product_count,
                                                }
                                            );
                                            continue;
                                        }
                                        else {
                                            productIncreasement[findProudctIncrementDuplicated].product_count = productIncreasement[findProudctIncrementDuplicated].product_count + (reduct_Count_RequestedProduct - reduce_Count_ProductTreatmentDetail);
                                            continue;
                                        }
                                    }
                                    else if (reduct_Count_RequestedProduct < reduce_Count_ProductTreatmentDetail) { // คืนลง Inventory ...
                                        if (findProudctDecrementDuplicated === -1) {
                                            productDecreasement.push(
                                                {
                                                    _ref_productid: elementReqProduct._ref_productid,
                                                    _ref_product_inventoryid: elementReqProduct._ref_product_inventoryid,
                                                    product_price: elementReqProduct.product_price,
                                                    product_count: elementReqProduct.product_count,
                                                }
                                            );
                                            continue;
                                        }
                                        else {
                                            productDecreasement[findProudctDecrementDuplicated].product_count = productDecreasement[findProudctDecrementDuplicated].product_count + (reduce_Count_ProductTreatmentDetail - reduct_Count_RequestedProduct);
                                        }
                                    }
                                    else { continue; }
                                }
                                else { callback(new Error(`${controllerName}: filter of findReqProductInProductTreatmentDetail return error`)); return; }
                            }

                            for (let index = 0; index < productTreatmentDetail.length; index++) { // Treatment Detail
                                const elementTreatmentDetailProduct = productTreatmentDetail[index];
                                const findDuplicated = chkReqProductId.filter(where => (where._ref_product_inventoryid ===  elementTreatmentDetailProduct._ref_product_inventoryid));

                                const findProudctDecrementDuplicated = productDecreasement.findIndex(where => (where._ref_product_inventoryid === elementTreatmentDetailProduct._ref_product_inventoryid));

                                if (findDuplicated.length === 0) {
                                    if (findProudctDecrementDuplicated === -1) {
                                        productDecreasement.push(
                                            {
                                                _ref_productid: elementTreatmentDetailProduct._ref_productid,
                                                _ref_product_inventoryid: elementTreatmentDetailProduct._ref_product_inventoryid,
                                                product_price: elementTreatmentDetailProduct.product_price,
                                                product_count: elementTreatmentDetailProduct.product_count,
                                            }
                                        );
                                        continue;
                                    }
                                    else {
                                        productDecreasement[findProudctDecrementDuplicated].product_count = productDecreasement[findProudctDecrementDuplicated].product_count + elementTreatmentDetailProduct.product_count;
                                    }
                                }
                                else {
                                    continue;
                                }
                            }

                            callback(null);
                            return {
                                request_Product: productRequestedFull,
                                exits_Product: findTreatmentDetail.map(
                                    where => ({
                                        _ref_productid: String(where._ref_productid),
                                        _ref_product_inventoryid: String(where._id),
                                        product_price: Number(where.price_product),
                                        product_count: Number(where.count_product),
                                        remark_product: (typeof where.remark_product == 'string') ? String(where.remark_product) : null
                                    })
                                ),
                                increase_Product: productIncreasement,
                                decrease_Product: productDecreasement,
                            };
                        }
                    }
                }
            }
        }
    }
};


/**
 * Sub Controller สำหรับ update/archive Treatment และ สร้างใบ PO ของ Treatment
 */
const updateTreatment_And_Create_PO = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agetntid: '',
        _ref_treatmentid: '',
        discount_course_price: 0,
        discount_product_price: 0,
        paid_type: '',
        timeStamp: new Date(),
        course: [
            {
                _ref_courseid: '',
                course_price: 0,
                course_count: 0,
                course_remark: null
            }
        ],
        product: [
            {
                _ref_productid: '',
                product_price: 0,
                product_count: 0,
                product_remark: null,
            }
        ],
    },
    callback = (err = new Error) => { }
) => {
    const controllerName = `PurchaseOrder_TreatmentPreProcess_Controller => updateTreatment_And_Create_PO`;

    const moment = require('moment');

    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const checkAgentId = miscController.checkAgentId;
    const validate_StringOrNull_AndNotEmpty = miscController.validate_StringOrNull_AndNotEmpty;

    const mongodbController = require('../../mongodbController');
    const checkObjectId = mongodbController.checkObjectId;
    const treatmentModel = mongodbController.treatmentModel;
    const treatmentDetailModel = mongodbController.treatmentDetailModel
    const archiveTreatmentModel = mongodbController.archiveTreatmentModel;
    const archiveTreatmentDetailModel = mongodbController.archiveTreatmentDetailModel;
    const purchaseOrderModel = mongodbController.purchaseOrderModel;
    const purchaseOrderDetailModel = mongodbController.purchaseOrderDetailModel;
    const ObjectId = mongodbController.mongoose.Types.ObjectId;

    const mapReduce_ProductData = require('./mapReduce_ProductData');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (typeof data._ref_agetntid != 'string' || !validateObjectId(data._ref_agetntid)) { callback(new Error(`${controllerName}: <data._ref_agetntid> must be String ObjectId`)); return; }
    else if (typeof data._ref_treatmentid != 'string' || !validateObjectId(data._ref_treatmentid)) { callback(new Error(`${controllerName}: <data._ref_treatmentid> must be String ObjectId`)); return; }
    else if (typeof data.discount_course_price != 'number' || data.discount_course_price < 0) { callback(new Error(`${controllerName}: <data.discount_course_price> must be Number morethan or equal 0`)); return; }
    else if (typeof data.discount_product_price != 'number' || data.discount_product_price < 0) { callback(new Error(`${controllerName}: <data.discount_product_price> must be Number morethan or equal 0`)); return; }
    else if (typeof data.paid_type != 'string' || !validate_StringOrNull_AndNotEmpty(data.paid_type)) { callback(new Error(`${controllerName}: <data.paid_type> must be String and Not Empty`)); return; }
    else if (!moment(data.timeStamp).isValid()) { callback(new Error(`${controllerName}: <data.timeStamp> must be DateTime Object`)); return; }
    else {
        const _ref_storeid = await checkObjectId(data._ref_storeid, (err) => { if (err) { callback(err); return; } });
        const _ref_branchid = await checkObjectId(data._ref_branchid, (err) => { if (err) { callback(err); return; } });
        const _ref_treatmentid = await checkObjectId(data._ref_treatmentid, (err) => { if (err) { callback(err); return; } });

        const modifyDate = moment(data.timeStamp);
        const modifyStringDate = modifyDate.format('YYYY-MM-DD');
        const modifyStringTime = modifyDate.format('HH:mm:ss');

        const SUM_PriceCourse = (data.course.length === 0) ? 0:data.course.reduce((sumValue, currentValue) => (sumValue + (currentValue.course_price * currentValue.course_count)), 0);
        const SUM_PriceProduct = (data.product.length === 0) ? 0:data.product.reduce((sumValue, currentValue) => (sumValue + (currentValue.product_price * currentValue.product_count)), 0);
        const SUM_PriceCourse_PriceProduct = SUM_PriceCourse + SUM_PriceProduct;
        const SUM_Discount = data.discount_course_price + data.discount_product_price;

        const mapReduceProduct = await mapReduce_ProductData(data.product, (err) => { if (err) { callback(err); return; } });

        const mapReduceCourse = await mapReduce_CourseData(data.course, (err) => { if (err) { callback(err); return; } });

        const chkAgentId = await checkAgentId(
            {
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid,
                _agentid: data._ref_agetntid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        const findOriginalTreatment = await treatmentModel.find(
            {
                '_id': _ref_treatmentid,
                '_ref_storeid': _ref_storeid,
                '_ref_branchid': _ref_branchid
            },
            {},
            (err) => { if (err) { callback(err); return; } }
        );

        const findOriginalTreatmentDetail = await treatmentDetailModel.find(
            {
                '_ref_treatmentid': _ref_treatmentid,
                '_ref_storeid': _ref_storeid,
                '_ref_branchid': _ref_branchid
            },
            {},
            (err) => { if (err) { callback(err); return; } }
        );

        if (data.discount_course_price > SUM_PriceCourse) { callback(new Error(`${controllerName}: <data.discount_course_price> (${data.discount_course_price}) must lowerthan or equal <SUM_PriceCourse> (${SUM_PriceCourse})`)); return; }
        else if (data.discount_product_price > SUM_PriceProduct) { callback(new Error(`${controllerName}: <data.discount_product_price> (${data.discount_product_price}) must lowerthan or equal <SUM_PriceProduct> (${SUM_PriceProduct})`)); return; }
        else if (!mapReduceProduct) { callback(new Error(`${controllerName}: mapReduceProduct failed`)); return; }
        else if (!mapReduceCourse) { callback(new Error(`${controllerName}: mapReduceCourse failed`)); return; }
        else if (!chkAgentId) { callback(new Error(`${controllerName}: chkAgentId return not found`)); return; }
        else if (!findOriginalTreatment) { callback(new Error(`${controllerName}: findOriginalTreatment return not found`)); return; }
        else if (findOriginalTreatment.length !== 1) { callback(new Error(`${controllerName}: findOriginalTreatment return more than 1 document`)); return; }
        else if (!findOriginalTreatmentDetail) { callback(new Error(`${controllerName}: findOriginalTreatmentDetail return not found`)); return; }
        else { // Create Archive Treatment
            const mapArchiveTreatment = {
                _ref_original_treatmentid: findOriginalTreatment[0]._id,

                run_number: findOriginalTreatment[0].run_number,
                _ref_treatment_progressionnoteid: findOriginalTreatment[0]._ref_treatment_progressionnoteid,
                _ref_casepatinetid: findOriginalTreatment[0]._ref_casepatinetid,
                count_product_list: findOriginalTreatment[0].count_product_list,
                price_product_list_total: findOriginalTreatment[0].price_product_list_total,
                price_product_list_discount: findOriginalTreatment[0].price_product_list_discount,
                price_product_list_total_discount: findOriginalTreatment[0].price_product_list_total_discount,
                count_course_list: findOriginalTreatment[0].count_course_list,
                price_course_list_total: findOriginalTreatment[0].price_course_list_total,
                price_course_list_discount: findOriginalTreatment[0].price_course_list_discount,
                price_course_list_total_discount: findOriginalTreatment[0].price_course_list_total_discount,
                price_total_before: findOriginalTreatment[0].price_total_before,
                price_discount: findOriginalTreatment[0].price_discount,
                price_total_after: findOriginalTreatment[0].price_total_after,
                _ref_storeid: findOriginalTreatment[0]._ref_storeid,
                _ref_branchid: findOriginalTreatment[0]._ref_branchid,
                isclosed: findOriginalTreatment[0].isclosed,
                istruncated: findOriginalTreatment[0].istruncated,
                create_date: findOriginalTreatment[0].create_date,
                create_date_string: findOriginalTreatment[0].create_date_string,
                create_time_string: findOriginalTreatment[0].create_time_string,
                _ref_agent_userid_create: findOriginalTreatment[0]._ref_agent_userid_create,
                _ref_agent_userstoreid_create: findOriginalTreatment[0]._ref_agent_userstoreid_create,
                modify_date: findOriginalTreatment[0].modify_date,
                modify_date_string: findOriginalTreatment[0].modify_date_string,
                modify_time_string: findOriginalTreatment[0].modify_time_string,
                _ref_agent_userid_modify: findOriginalTreatment[0]._ref_agent_userid_modify,
                _ref_agent_userstoreid_modify: findOriginalTreatment[0]._ref_agent_userstoreid_modify,
                po_is_modified: findOriginalTreatment[0].po_is_modified,
                po_modifier_ref_poid: findOriginalTreatment[0].po_modifier_ref_poid,
                medical_certificate_th: findOriginalTreatment[0].medical_certificate_th,
                medical_certificate_en: findOriginalTreatment[0].medical_certificate_en
            };

            const archiveTreatmentSaveModel = new archiveTreatmentModel(mapArchiveTreatment);
            const transactionArchiveTreatmentSave = await archiveTreatmentSaveModel.save().then(result => result).catch(err => { if (err) { callback(err); return; } });

            if (!transactionArchiveTreatmentSave) { callback(new Error(`${controllerName}: transactionArchiveTreatmentSave have error`)); return; }
            else { // Create Archive Treatment Detail
                let savedArchiveTreatmentDetailDocument = [];

                const RollBack_ArchiveTreatment = async (callback = (err = new Error) => { }) => {
                    await archiveTreatmentModel.findByIdAndDelete(transactionArchiveTreatmentSave._id, (err) => { if (err) { callback(err); return; } });
                    callback(null);
                    return true;
                };

                const Rollback_ArchiveTreatmentDetail = async (callback = (err = new Error) => { }) => {
                    for (let index = 0; index < savedArchiveTreatmentDetailDocument.length; index++) {
                        const elementSATDD = savedArchiveTreatmentDetailDocument[index];
                        await archiveTreatmentDetailModel.findByIdAndDelete(elementSATDD._id, (err) => { if (err) { callback(err); return; } });
                    }
                    callback(null);
                    return true;
                };

                for (let index = 0; index < findOriginalTreatmentDetail.length; index++) {
                    const elementOriginalTreatmentDetail = findOriginalTreatmentDetail[index];

                    const mapArchiveTreatmentDetail = {
                        _ref_archive_treatmentid: transactionArchiveTreatmentSave._id, // Ar_Treatment _id
                        _ref_original_treatmentid: elementOriginalTreatmentDetail._ref_treatmentid, // Trreatment _id
                        _ref_original_treatmentdetailid: elementOriginalTreatmentDetail._id, // TrreatmentDetail _id

                        run_number: elementOriginalTreatmentDetail.run_number,
                        _ref_treatmentid: elementOriginalTreatmentDetail._ref_treatmentid,
                        _ref_casepatinetid: elementOriginalTreatmentDetail._ref_casepatinetid,
                        _ref_productid: elementOriginalTreatmentDetail._ref_productid,
                        count_product: elementOriginalTreatmentDetail.count_product,
                        price_product: elementOriginalTreatmentDetail.price_product,
                        price_product_total: elementOriginalTreatmentDetail.price_product_total,
                        remark_product: elementOriginalTreatmentDetail.remark_product,
                        _ref_courseid: elementOriginalTreatmentDetail._ref_courseid,
                        count_course: elementOriginalTreatmentDetail.count_course,
                        price_course: elementOriginalTreatmentDetail.price_course,
                        price_course_total: elementOriginalTreatmentDetail.price_course_total,
                        remark_course: elementOriginalTreatmentDetail.remark_course,
                        _ref_storeid: elementOriginalTreatmentDetail._ref_storeid,
                        _ref_branchid: elementOriginalTreatmentDetail._ref_branchid,
                        isused: elementOriginalTreatmentDetail.isused,
                        istruncated: elementOriginalTreatmentDetail.istruncated,
                        create_date: elementOriginalTreatmentDetail.create_date,
                        create_date_string: elementOriginalTreatmentDetail.create_date_string,
                        create_time_string: elementOriginalTreatmentDetail.create_time_string,
                        _ref_agent_userid_create: elementOriginalTreatmentDetail._ref_agent_userid_create,
                        _ref_agent_userstoreid_create: elementOriginalTreatmentDetail._ref_agent_userstoreid_create,
                        modify_date: elementOriginalTreatmentDetail.modify_date,
                        modify_date_string: elementOriginalTreatmentDetail.modify_date_string,
                        modify_time_string: elementOriginalTreatmentDetail.modify_time_string,
                        _ref_agent_userid_modify: elementOriginalTreatmentDetail._ref_agent_userid_modify,
                        _ref_agent_userstoreid_modify: elementOriginalTreatmentDetail._ref_agent_userstoreid_modify,
                        po_is_modified: elementOriginalTreatmentDetail.po_is_modified,
                        po_modifier_ref_poid: elementOriginalTreatmentDetail.po_modifier_ref_poid,
                    };

                    const archiveTreatmentDetailSaveModel = new archiveTreatmentDetailModel(mapArchiveTreatmentDetail);
                    const transactionArchiveTreatmentDetailSave = await archiveTreatmentDetailSaveModel.save().then(result => result).catch(err => { if (err) { callback(err); return; } });

                    if (!transactionArchiveTreatmentDetailSave) {
                        await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                        await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                        callback(new Error(`${controllerName}: transactionArchiveTreatmentDetailSave have error`));
                        return;
                    }
                    else {
                        savedArchiveTreatmentDetailDocument.push(transactionArchiveTreatmentDetailSave);
                        continue;
                    }
                }

                if (findOriginalTreatmentDetail.length !== savedArchiveTreatmentDetailDocument.length) {
                    await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                    await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                    callback(new Error(`${controllerName}: findOriginalTreatmentDetail.length (${findOriginalTreatmentDetail.length}) not equal savedArchiveTreatmentDetailDocument.length (${savedArchiveTreatmentDetailDocument.length})`));
                    return;
                }
                else { // Create PurchaseOrder (PO)
                    const mapNewPOHeader = { // map Data for Create PO Header
                        run_number: null,
                        _ref_casepatinetid: findOriginalTreatment[0]._ref_casepatinetid,
                        _ref_treatmentid: _ref_treatmentid,
                        count_product_list: (mapReduceProduct.productTreatmentDetail_Full.length === 0) ? 0:mapReduceProduct.productTreatmentDetail.length,
                        price_product_list_total: (mapReduceProduct.productTreatmentDetail_Full.length === 0) ? 0:mapReduceProduct.productTreatmentDetail_Full.reduce((sumValue, currentValue) => (sumValue + (currentValue.product_count * currentValue.product_price)), 0),
                        price_product_list_discount: data.discount_product_price, // ราคา ลดราคาสินค้า
                        price_product_list_total_discount: SUM_PriceProduct - data.discount_product_price, // รวมราคาสินค้า และลดราคาสินค้าทั้งหมด
                        count_course_list: mapReduceCourse.courseDetail.length,
                        price_course_list_total: mapReduceCourse.courseDetail_Full.reduce((sumValue, currentValue) => (sumValue + (currentValue.course_count * currentValue.course_price)), 0),
                        price_course_list_discount: data.discount_course_price, // ราคา ลดราคาสินค้า
                        price_course_list_total_discount: SUM_PriceCourse - data.discount_course_price, // รวมราคาสินค้า และลดราคาสินค้าทั้งหมด
                        price_total_before: SUM_PriceCourse_PriceProduct,
                        price_discount: SUM_Discount,
                        price_total_after: SUM_PriceCourse_PriceProduct - SUM_Discount,
                        _ref_storeid: _ref_storeid,
                        _ref_branchid: _ref_branchid,
                        create_date: modifyDate,
                        create_date_string: modifyStringDate,
                        create_time_string: modifyStringTime,
                        _ref_agent_userid_create: chkAgentId._agentid,
                        _ref_agent_userstoreid_create: chkAgentId._agentstoreid,
                        modify_date: modifyDate,
                        modify_date_string: modifyStringDate,
                        modify_time_string: modifyStringTime,
                        _ref_agent_userid_modify: chkAgentId._agentid,
                        _ref_agent_userstoreid_modify: chkAgentId._agentstoreid,
                        paid_type: data.paid_type,
                        ispaid: true,
                        isclosed: false,
                        istruncated: false,
                    };

                    const purchaseOrderSaveModel = new purchaseOrderModel(mapNewPOHeader);
                    const transactionPurchaseOrderSave = await purchaseOrderSaveModel.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });

                    if (!transactionPurchaseOrderSave) {
                        await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                        await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                        callback(new Error(`${controllerName}: transactionPurchaseOrderSave have error`));
                        return;
                    }
                    else { // Create PurchaseOrderDetail (PO Detail)
                        let savedPurchaseOrderDetailDocument = [];

                        const RollBack_PurchaseOrder = async (callback = (err = new Error) => { }) => {
                            await purchaseOrderModel.findByIdAndDelete(transactionPurchaseOrderSave._id, (err) => { if (err) { callback(err); return; } });
                            callback(null);
                            return true;
                        };

                        const RollBack_PurchaseOrderDetail = async (callback = (err = new Error) => { }) => {
                            for (let index = 0; index < savedPurchaseOrderDetailDocument.length; index++) {
                                const elementPODD = savedPurchaseOrderDetailDocument[index];
                                await purchaseOrderDetailModel.findByIdAndDelete(elementPODD._id, (err) => { if (err) { callback(err); return; } });
                            }
                            callback(null);
                            return true;
                        };

                        // Create Product PO Detail
                        for (let index = 0; index < mapReduceProduct.productTreatmentDetail_Full.length; index++) {
                            const elementPurchaseOrderDetail = mapReduceProduct.productTreatmentDetail_Full[index];

                            const ele_ref_productid = await checkObjectId(elementPurchaseOrderDetail._ref_productid, (err) => { if (err) { console.error(err); return; } });

                            if (!ele_ref_productid) { break; }
                            else {
                                const mapNewPODetail = { // map Data for Create PO Detail
                                    run_number: null,
                                    _ref_poid: transactionPurchaseOrderSave._id,
                                    _ref_treatmentid: mapNewPOHeader._ref_treatmentid,
                                    _ref_casepatinetid: mapNewPOHeader._ref_casepatinetid,
                                    _ref_productid: ele_ref_productid,
                                    product_count: elementPurchaseOrderDetail.product_count,
                                    product_price: elementPurchaseOrderDetail.product_price,
                                    product_price_total: elementPurchaseOrderDetail.product_count * elementPurchaseOrderDetail.product_price,
                                    product_remark: elementPurchaseOrderDetail.remark_product,
                                    _ref_courseid: null,
                                    course_count: 0,
                                    course_price: 0,
                                    course_price_total: 0,
                                    course_remark: null,
                                    _ref_storeid: mapNewPOHeader._ref_storeid,
                                    _ref_branchid: mapNewPOHeader._ref_branchid,
                                    create_date: mapNewPOHeader.create_date,
                                    create_date_string: mapNewPOHeader.create_date_string,
                                    create_time_string: mapNewPOHeader.create_time_string,
                                    _ref_agent_userid_create: mapNewPOHeader._ref_agent_userid_create,
                                    _ref_agent_userstoreid_create: mapNewPOHeader._ref_agent_userstoreid_create,
                                    modify_date: mapNewPOHeader.modify_date,
                                    modify_date_string: mapNewPOHeader.modify_date_string,
                                    modify_time_string: mapNewPOHeader.modify_time_string,
                                    _ref_agent_userid_modify: mapNewPOHeader._ref_agent_userid_modify,
                                    _ref_agent_userstoreid_modify: mapNewPOHeader._ref_agent_userstoreid_modify,
                                    ispaid: mapNewPOHeader.ispaid,
                                    isclosed: mapNewPOHeader.isclosed,
                                    istruncated: mapNewPOHeader.istruncated,
                                };
    
                                const purchaseOrderDetailSaveModel = new purchaseOrderDetailModel(mapNewPODetail);
                                const transactionPurchaseDetailOrderSave = await purchaseOrderDetailSaveModel.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });
    
                                if (!transactionPurchaseDetailOrderSave) {
                                    await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                                    await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                                    await RollBack_PurchaseOrder((err) => { if (err) { console.error(err); } });
                                    await RollBack_PurchaseOrderDetail((err) => { if (err) { console.error(err); } });
                                    callback(new Error(`${controllerName}: transactionPurchaseDetailOrderSave have error`));
                                    return;
                                }
                                else {
                                    savedPurchaseOrderDetailDocument.push(transactionPurchaseDetailOrderSave);
                                }
                            }
                        }

                        // Create Course PO Detail
                        for (let index = 0; index < mapReduceCourse.courseDetail_Full.length; index++) {
                            const elementPurchaseOrderDetail = mapReduceCourse.courseDetail_Full[index];

                            const ele_ref_productid = await checkObjectId(elementPurchaseOrderDetail._ref_productid, (err) => { if (err) { console.error(err); return; } });

                            if (!ele_ref_productid) { break; }
                            else {
                                const mapNewPODetail = { // map Data for Create PO Detail
                                    run_number: null,
                                    _ref_poid: transactionPurchaseOrderSave._id,
                                    _ref_treatmentid: mapNewPOHeader._ref_treatmentid,
                                    _ref_casepatinetid: mapNewPOHeader._ref_casepatinetid,
                                    _ref_productid: null,
                                    product_count: null,
                                    product_price: 0,
                                    product_price_total: 0,
                                    product_remark: null,
                                    _ref_courseid: elementPurchaseOrderDetail._ref_courseid,
                                    course_count: elementPurchaseOrderDetail.course_count,
                                    course_price: elementPurchaseOrderDetail.course_price,
                                    course_price_total: elementPurchaseOrderDetail.course_count * elementPurchaseOrderDetail.course_price,
                                    course_remark: elementPurchaseOrderDetail.course_remark,
                                    _ref_storeid: mapNewPOHeader._ref_storeid,
                                    _ref_branchid: mapNewPOHeader._ref_branchid,
                                    create_date: mapNewPOHeader.create_date,
                                    create_date_string: mapNewPOHeader.create_date_string,
                                    create_time_string: mapNewPOHeader.create_time_string,
                                    _ref_agent_userid_create: mapNewPOHeader._ref_agent_userid_create,
                                    _ref_agent_userstoreid_create: mapNewPOHeader._ref_agent_userstoreid_create,
                                    modify_date: mapNewPOHeader.modify_date,
                                    modify_date_string: mapNewPOHeader.modify_date_string,
                                    modify_time_string: mapNewPOHeader.modify_time_string,
                                    _ref_agent_userid_modify: mapNewPOHeader._ref_agent_userid_modify,
                                    _ref_agent_userstoreid_modify: mapNewPOHeader._ref_agent_userstoreid_modify,
                                    ispaid: mapNewPOHeader.ispaid,
                                    isclosed: mapNewPOHeader.isclosed,
                                    istruncated: mapNewPOHeader.istruncated,
                                };
    
                                const purchaseOrderDetailSaveModel = new purchaseOrderDetailModel(mapNewPODetail);
                                const transactionPurchaseDetailOrderSave = await purchaseOrderDetailSaveModel.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });
    
                                if (!transactionPurchaseDetailOrderSave) {
                                    await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                                    await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                                    await RollBack_PurchaseOrder((err) => { if (err) { console.error(err); } });
                                    await RollBack_PurchaseOrderDetail((err) => { if (err) { console.error(err); } });
                                    callback(new Error(`${controllerName}: transactionPurchaseDetailOrderSave have error`));
                                    return;
                                }
                                else {
                                    savedPurchaseOrderDetailDocument.push(transactionPurchaseDetailOrderSave);
                                }
                            }
                        }

                        if (mapReduceProduct.productTreatmentDetail_Full.length + mapReduceCourse.courseDetail_Full.length !== savedPurchaseOrderDetailDocument.length) {
                            await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                            await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                            await RollBack_PurchaseOrder((err) => { if (err) { console.error(err); } });
                            await RollBack_PurchaseOrderDetail((err) => { if (err) { console.error(err); } });
                            callback(new Error(`${controllerName}: length of savedPurchaseOrderDetailDocument (${savedPurchaseOrderDetailDocument.length}) not equal length of product (${mapReduceProduct.productTreatmentDetail_Full.length}) as Requested have`));
                            return;
                        }
                        else { // Update Treatment Document
                            const RollBack_OriginalTreatment = async (callback = (err = new Error) => { }) => {
                                let findOriginalTreatment = await treatmentModel.findOne(mapArchiveTreatment._ref_original_treatmentid, {}, (err) => { if (err) { callback(err); return; } });

                                if (!findOriginalTreatment) {
                                    const RollBack_OriginalTreatmentModel = new treatmentModel(
                                        {
                                            _id: mapArchiveTreatment._ref_original_treatmentid,
                                            run_number: mapArchiveTreatment.run_number,
                                            _ref_casepatinetid: mapArchiveTreatment._ref_casepatinetid,
                                            count_product_list: mapArchiveTreatment.count_product_list,
                                            price_product_list_total: mapArchiveTreatment.price_product_list_total,
                                            price_product_list_discount: mapArchiveTreatment.price_product_list_discount, // ราคา ลดราคาสินค้า
                                            price_product_list_total_discount: mapArchiveTreatment.price_product_list_total_discount, // รวมราคาสินค้า และลดราคาสินค้าทั้งหมด
                                            count_course_list: mapArchiveTreatment.count_course_list,
                                            price_course_list_total: mapArchiveTreatment.price_course_list_total,
                                            price_course_list_discount: mapArchiveTreatment.price_course_list_discount, // ราคา ลดราคาสินค้า
                                            price_course_list_total_discount: mapArchiveTreatment.price_course_list_total_discount, // รวมราคาสินค้า และลดราคาสินค้าทั้งหมด
                                            price_total_before: mapArchiveTreatment.price_total_before, // ราคารวม สินค้า (Product) และการรักษา (Course/Package)
                                            price_discount: mapArchiveTreatment.price_discount, // ราคา ส่วนลดทั้งหมด
                                            price_total_after: mapArchiveTreatment.price_total_after, // ราคาสุทธิ (ราคารวมทั้งหมด-ราคาส่วนลดทั้งหมด)
                                            _ref_storeid: mapArchiveTreatment._ref_storeid,
                                            _ref_branchid: mapArchiveTreatment._ref_branchid,
                                            isclosed: mapArchiveTreatment.isclosed,
                                            istruncated: mapArchiveTreatment.istruncated,
                                            create_date: mapArchiveTreatment.create_date,
                                            create_date_string: mapArchiveTreatment.create_date_string,
                                            create_time_string: mapArchiveTreatment.create_time_string,
                                            _ref_agent_userid_create: mapArchiveTreatment._ref_agent_userid_create,
                                            _ref_agent_userstoreid_create: mapArchiveTreatment._ref_agent_userstoreid_create,
                                            modify_date: mapArchiveTreatment.modify_date,
                                            modify_date_string: mapArchiveTreatment.modify_date_string,
                                            modify_time_string: mapArchiveTreatment.modify_time_string,
                                            _ref_agent_userid_modify: mapArchiveTreatment._ref_agent_userid_modify,
                                            _ref_agent_userstoreid_modify: mapArchiveTreatment._ref_agent_userstoreid_modify,
                                            po_is_modified: mapArchiveTreatment.po_is_modified,
                                            po_modifier_ref_poid: mapArchiveTreatment.po_modifier_ref_poid,
                                            medical_certificate_th: mapArchiveTreatment.medical_certificate_th,
                                            medical_certificate_en: mapArchiveTreatment.medical_certificate_en,
                                        }
                                    );

                                    await RollBack_OriginalTreatmentModel.save((err) => { if (err) { callback(err); return; } });
                                    callback(null);
                                    return true;
                                }
                                else {
                                    findOriginalTreatment.run_number = mapArchiveTreatment.run_number;
                                    findOriginalTreatment._ref_casepatinetid = mapArchiveTreatment._ref_casepatinetid;
                                    findOriginalTreatment.count_product_list = mapArchiveTreatment.count_product_list;
                                    findOriginalTreatment.price_product_list_total = mapArchiveTreatment.price_product_list_total;
                                    findOriginalTreatment.count_course_list = mapArchiveTreatment.count_course_list;
                                    findOriginalTreatment.price_course_list_total = mapArchiveTreatment.price_course_list_total;
                                    findOriginalTreatment.price_total_before = mapArchiveTreatment.price_total_before;
                                    findOriginalTreatment.price_discount = mapArchiveTreatment.price_discount;
                                    findOriginalTreatment.price_total_after = mapArchiveTreatment.price_total_after;
                                    findOriginalTreatment._ref_storeid = mapArchiveTreatment._ref_storeid;
                                    findOriginalTreatment._ref_branchid = mapArchiveTreatment._ref_branchid;
                                    findOriginalTreatment.isused = mapArchiveTreatment.isused;
                                    findOriginalTreatment.istruncated = mapArchiveTreatment.istruncated;
                                    findOriginalTreatment.create_date = mapArchiveTreatment.create_date;
                                    findOriginalTreatment.create_date_string = mapArchiveTreatment.create_date_string;
                                    findOriginalTreatment.create_time_string = mapArchiveTreatment.create_time_string;
                                    findOriginalTreatment._ref_agent_userid_create = mapArchiveTreatment._ref_agent_userid_create;
                                    findOriginalTreatment._ref_agent_userstoreid_create = mapArchiveTreatment._ref_agent_userstoreid_create;
                                    findOriginalTreatment.modify_date = mapArchiveTreatment.modify_date;
                                    findOriginalTreatment.modify_date_string = mapArchiveTreatment.modify_date_string;
                                    findOriginalTreatment.modify_time_string = mapArchiveTreatment.modify_time_string;
                                    findOriginalTreatment._ref_agent_userid_modify = mapArchiveTreatment._ref_agent_userid_modify;
                                    findOriginalTreatment._ref_agent_userstoreid_modify = mapArchiveTreatment._ref_agent_userstoreid_modify;
                                    findOriginalTreatment.po_is_modified = mapArchiveTreatment.po_is_modified;
                                    findOriginalTreatment.po_modifier_ref_poid = mapArchiveTreatment.po_modifier_ref_poid;
                                    findOriginalTreatment.medical_certificate_th = mapArchiveTreatment.medical_certificate_th;
                                    findOriginalTreatment.medical_certificate_en = mapArchiveTreatment.medical_certificate_en;

                                    await findOriginalTreatment.save((err) => { if (err) { callback(err); } });
                                    callback(null);
                                    return true;
                                }
                            };

                            let updateOriginalTreatment = await treatmentModel.findOne(
                                {
                                    '_id': _ref_treatmentid,
                                    '_ref_storeid': _ref_storeid,
                                    '_ref_branchid': _ref_branchid
                                },
                                {},
                                (err) => { if (err) { callback(err); return; } }
                            );

                            if (!updateOriginalTreatment) {
                                await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                                await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                                await RollBack_PurchaseOrder((err) => { if (err) { console.error(err); } });
                                await RollBack_PurchaseOrderDetail((err) => { if (err) { console.error(err); } });
                                callback(new Error(`${controllerName}: updateOriginalTreatment return not found`));
                                return;
                            }
                            else {
                                updateOriginalTreatment.count_product_list = mapReduceProduct.productTreatmentDetail.length;
                                updateOriginalTreatment.price_product_list_total = mapReduceProduct.productTreatmentDetail_Full.reduce((sumValue, currentValue) => (sumValue + (currentValue.product_count * currentValue.product_price)), 0);
                                updateOriginalTreatment.price_product_list_discount = mapNewPOHeader.price_product_list_discount, // ราคา ลดราคาสินค้า
                                updateOriginalTreatment.price_product_list_total_discount = mapNewPOHeader.price_product_list_total_discount, // รวมราคาสินค้า และลดราคาสินค้าทั้งหมด
                                updateOriginalTreatment.count_course_list = mapReduceCourse.courseDetail.length;
                                updateOriginalTreatment.price_course_list_total = mapReduceCourse.courseDetail_Full.reduce((sumValue, currentValue) => (sumValue + (currentValue.course_count * currentValue.course_price)), 0);
                                updateOriginalTreatment.price_course_list_discount = mapNewPOHeader.price_course_list_discount, // ราคา ลดราคาสินค้า
                                updateOriginalTreatment.price_course_list_total_discount = mapNewPOHeader.price_course_list_total_discount, // รวมราคาสินค้า และลดราคาสินค้าทั้งหมด
                                updateOriginalTreatment.price_total_before = SUM_PriceCourse_PriceProduct;
                                updateOriginalTreatment.price_discount = mapNewPOHeader.price_discount;
                                updateOriginalTreatment.price_total_after = mapNewPOHeader.price_total_after;
                                updateOriginalTreatment.modify_date = modifyDate;
                                updateOriginalTreatment.modify_date_string = modifyStringDate;
                                updateOriginalTreatment.modify_time_string = modifyStringTime;
                                updateOriginalTreatment._ref_agent_userid_modify = chkAgentId._agentid;
                                updateOriginalTreatment._ref_agent_userstoreid_modify = chkAgentId._agentstoreid;
                                updateOriginalTreatment.po_is_modified = true;
                                if (!updateOriginalTreatment.po_modifier_ref_poid || updateOriginalTreatment.po_modifier_ref_poid === null) {
                                    updateOriginalTreatment.po_modifier_ref_poid = [
                                        {
                                            _ref_poid: transactionPurchaseOrderSave._id,
                                            _ref_archive_treatmentid: transactionArchiveTreatmentSave._id,
                                            modify_date: modifyDate,
                                            modify_date_string: modifyStringDate,
                                            modify_time_string: modifyStringTime,
                                            _ref_agent_userid_modify: chkAgentId._agentid,
                                            _ref_agent_userstoreid_modify: chkAgentId._agentstoreid
                                        }
                                    ]
                                }
                                else {
                                    updateOriginalTreatment.po_modifier_ref_poid.push(
                                        {
                                            _ref_poid: transactionPurchaseOrderSave._id,
                                            _ref_archive_treatmentid: transactionArchiveTreatmentSave._id,
                                            modify_date: modifyDate,
                                            modify_date_string: modifyStringDate,
                                            modify_time_string: modifyStringTime,
                                            _ref_agent_userid_modify: chkAgentId._agentid,
                                            _ref_agent_userstoreid_modify: chkAgentId._agentstoreid
                                        }
                                    )
                                }

                                const updateOriginalTreatmentResult = await updateOriginalTreatment.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });

                                if (!updateOriginalTreatmentResult) {
                                    await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                                    await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                                    await RollBack_PurchaseOrder((err) => { if (err) { console.error(err); } });
                                    await RollBack_PurchaseOrderDetail((err) => { if (err) { console.error(err); } });
                                    await RollBack_OriginalTreatment((err) => { if (err) { console.error(err); } });
                                    callback(new Error(`${controllerName}: updateOriginalTreatment update data failed found`));
                                    return;
                                }
                                else { // Update Treatment Detail Document
                                    let reCreateTreatmentDetailDocument = [];

                                    const findOriginalTreatmentDetail = await treatmentDetailModel.find(
                                        {
                                            '_ref_treatmentid': _ref_treatmentid
                                        },
                                        {},
                                        (err) => { if (err) { console.error(err); } }
                                    );

                                    const RollBack_reCreateTreatmentDetail = async (callback = (err = new Error) => { }) => {
                                        for (let index = 0; index < reCreateTreatmentDetailDocument.length; index++) {
                                            const elementReCreateTDD = reCreateTreatmentDetailDocument[index];
                                            await treatmentDetailModel.findByIdAndDelete(elementReCreateTDD._id, (err) => { if (err) { callback(err); return; } });
                                        }
                                        callback(null);
                                        return true;
                                    };

                                    const createProductTreatmentDetail = async (callback = (err = new Error) => { }) => {
                                        for (let index = 0; index < mapReduceProduct.productTreatmentDetail_Full.length; index++) {
                                            const elementProductTDF = mapReduceProduct.productTreatmentDetail_Full[index];
                                            const mapNewProductTDF = {
                                                run_number: null,
                                                _ref_treatmentid: updateOriginalTreatmentResult._id,
                                                _ref_casepatinetid: updateOriginalTreatmentResult._ref_casepatinetid,
                                                _ref_productid: elementProductTDF._ref_productid,
                                                count_product: elementProductTDF.product_count,
                                                price_product: elementProductTDF.product_price,
                                                price_product_total: elementProductTDF.product_count * elementProductTDF.product_price,
                                                remark_product: elementProductTDF.remark_product,
                                                _ref_courseid: null,
                                                count_course: 0,
                                                price_course: 0,
                                                price_course_total: 0,
                                                remark_course: null,
                                                _ref_storeid: updateOriginalTreatmentResult._ref_storeid,
                                                _ref_branchid: updateOriginalTreatmentResult._ref_branchid,
                                                isused: updateOriginalTreatmentResult.isused,
                                                istruncated: updateOriginalTreatmentResult.istruncated,
                                                create_date: updateOriginalTreatmentResult.create_date,
                                                create_date_string: updateOriginalTreatmentResult.create_date_string,
                                                create_time_string: updateOriginalTreatmentResult.create_time_string,
                                                _ref_agent_userid_create: updateOriginalTreatmentResult._ref_agent_userid_create,
                                                _ref_agent_userstoreid_create: updateOriginalTreatmentResult._ref_agent_userstoreid_create,
                                                modify_date: updateOriginalTreatmentResult.modify_date,
                                                modify_date_string: updateOriginalTreatmentResult.modify_date_string,
                                                modify_time_string: updateOriginalTreatmentResult.modify_time_string,
                                                _ref_agent_userid_modify: updateOriginalTreatmentResult._ref_agent_userid_modify,
                                                _ref_agent_userstoreid_modify: updateOriginalTreatmentResult._ref_agent_userstoreid_modify,
                                                po_is_modified: updateOriginalTreatmentResult.po_is_modified
                                            };

                                            const productTreatmentDetailReCreateSaveModel = new treatmentDetailModel(mapNewProductTDF);
                                            const transactionProductTreatmentDetailReCreateSave = await productTreatmentDetailReCreateSaveModel.save().then(result => result).catch(err => { if (err) { callback(err); return; } });

                                            if (!transactionProductTreatmentDetailReCreateSave) { callback(new Error(`${controllerName}: transactionProductTreatmentDetailReCreateSave have Error at mapReduceCourse.courseDetail_Full[${index}]`)); return; }
                                            else {
                                                reCreateTreatmentDetailDocument.push(transactionProductTreatmentDetailReCreateSave);
                                                continue;
                                            }
                                        }
                                        callback(null);
                                        return true;
                                    };

                                    const createCourseTreatmentDetail = async (callback = (err = new Error) => { }) => {
                                        for (let index = 0; index < mapReduceCourse.courseDetail_Full.length; index++) {
                                            const elementCourseTDF = mapReduceCourse.courseDetail_Full[index];
                                            const mapNewCourseTDF = {
                                                run_number: null,
                                                _ref_treatmentid: updateOriginalTreatmentResult._id,
                                                _ref_casepatinetid: updateOriginalTreatmentResult._ref_casepatinetid,
                                                _ref_productid: null,
                                                count_product: 0,
                                                price_product: 0,
                                                price_product_total: 0,
                                                remark_product: null,
                                                _ref_courseid: elementCourseTDF._ref_courseid,
                                                count_course: elementCourseTDF.course_count,
                                                price_course: elementCourseTDF.course_price,
                                                price_course_total: elementCourseTDF.course_price * elementCourseTDF.course_count,
                                                remark_course: elementCourseTDF.course_remark,
                                                _ref_storeid: updateOriginalTreatmentResult._ref_storeid,
                                                _ref_branchid: updateOriginalTreatmentResult._ref_branchid,
                                                isused: updateOriginalTreatmentResult.isused,
                                                istruncated: updateOriginalTreatmentResult.istruncated,
                                                create_date: updateOriginalTreatmentResult.create_date,
                                                create_date_string: updateOriginalTreatmentResult.create_date_string,
                                                create_time_string: updateOriginalTreatmentResult.create_time_string,
                                                _ref_agent_userid_create: updateOriginalTreatmentResult._ref_agent_userid_create,
                                                _ref_agent_userstoreid_create: updateOriginalTreatmentResult._ref_agent_userstoreid_create,
                                                modify_date: updateOriginalTreatmentResult.modify_date,
                                                modify_date_string: updateOriginalTreatmentResult.modify_date_string,
                                                modify_time_string: updateOriginalTreatmentResult.modify_time_string,
                                                _ref_agent_userid_modify: updateOriginalTreatmentResult._ref_agent_userid_modify,
                                                _ref_agent_userstoreid_modify: updateOriginalTreatmentResult._ref_agent_userstoreid_modify,
                                                po_is_modified: updateOriginalTreatmentResult.po_is_modified,
                                            };

                                            const courseTreatmentDetailReCreateSaveModel = new treatmentDetailModel(mapNewCourseTDF);
                                            const transactionCourseTreatmentDetailReCreateSave = await courseTreatmentDetailReCreateSaveModel.save().then(result => result).catch(err => { if (err) { callback(err); return; } });
                                            if (!transactionCourseTreatmentDetailReCreateSave) { callback(new Error(`${controllerName}: transactionCourseTreatmentDetailReCreateSave have Error at mapReduceCourse.courseDetail_Full[${index}]`)); return; }
                                            else {
                                                reCreateTreatmentDetailDocument.push(transactionCourseTreatmentDetailReCreateSave);
                                                continue;
                                            }
                                        }
                                        callback(null);
                                        return true;
                                    };

                                    const doReCreateProduct = await createProductTreatmentDetail((err) => { if (err) { console.error(err); return; } });
                                    const doReCreateCourse = await createCourseTreatmentDetail((err) => { if (err) { console.error(err); return; } });

                                    if (!doReCreateProduct) {
                                        await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                                        await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                                        await RollBack_PurchaseOrder((err) => { if (err) { console.error(err); } });
                                        await RollBack_PurchaseOrderDetail((err) => { if (err) { console.error(err); } });
                                        await RollBack_OriginalTreatment((err) => { if (err) { console.error(err); } });
                                        await RollBack_reCreateTreatmentDetail((err) => { if (err) { console.error(err); } });
                                        callback(new Error(`${controllerName}: createProductTreatmentDetail save data failed`));
                                        return;
                                    }
                                    else if (!doReCreateCourse) {
                                        await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                                        await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                                        await RollBack_PurchaseOrder((err) => { if (err) { console.error(err); } });
                                        await RollBack_PurchaseOrderDetail((err) => { if (err) { console.error(err); } });
                                        await RollBack_OriginalTreatment((err) => { if (err) { console.error(err); } });
                                        await RollBack_reCreateTreatmentDetail((err) => { if (err) { console.error(err); } });
                                        callback(new Error(`${controllerName}: createCourseTreatmentDetail save data failed`));
                                        return;
                                    }
                                    else if (reCreateTreatmentDetailDocument.length !== (mapReduceProduct.productTreatmentDetail_Full.length + mapReduceCourse.courseDetail_Full.length)) {
                                        await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                                        await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                                        await RollBack_PurchaseOrder((err) => { if (err) { console.error(err); } });
                                        await RollBack_PurchaseOrderDetail((err) => { if (err) { console.error(err); } });
                                        await RollBack_OriginalTreatment((err) => { if (err) { console.error(err); } });
                                        await RollBack_reCreateTreatmentDetail((err) => { if (err) { console.error(err); } });
                                        callback(new Error(`${controllerName}: reCreateTreatmentDetailDocument.length (${reCreateTreatmentDetailDocument.length}) is not equal mapReduceProduct.productTreatmentDetail_Full.length (${mapReduceProduct.productTreatmentDetail_Full.length}) + mapReduceCourse.courseDetail_Full.length (${mapReduceCourse.courseDetail_Full.length})`));
                                        return;
                                    }
                                    else {
                                        let removeOriginalTreatmentDetail = [];

                                        const Rollback_removeOriginalTreatmentDetail = async (callback = (err = new Error) => { }) => {
                                            for (let index = 0; index < removeOriginalTreatmentDetail.length; index++) {
                                                const elementRemoveOTD = removeOriginalTreatmentDetail[index];
                                                const newModelOTD = new treatmentDetailModel(elementRemoveOTD);
                                                await newModelOTD.save((err) => { if (err) { callback(err); return; } });
                                            }
                                            callback(null);
                                            return true;
                                        };


                                        if (!findOriginalTreatmentDetail) {
                                            await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                                            await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                                            await RollBack_PurchaseOrder((err) => { if (err) { console.error(err); } });
                                            await RollBack_PurchaseOrderDetail((err) => { if (err) { console.error(err); } });
                                            await RollBack_OriginalTreatment((err) => { if (err) { console.error(err); } });
                                            await RollBack_reCreateTreatmentDetail((err) => { if (err) { console.error(err); } });
                                            callback(new Error(`${controllerName}: findOriginalTreatmentDetail return not found`));
                                            return;
                                        }
                                        else {
                                            for (let index = 0; index < findOriginalTreatmentDetail.length; index++) {
                                                const elementOTD = findOriginalTreatmentDetail[index];
                                                const removeOriginalTreatmentDetailResult = await treatmentDetailModel.findByIdAndDelete(elementOTD._id, (err) => { if (err) { console.error(err); return false; } }).then(result => true);
                                                if (!removeOriginalTreatmentDetailResult) {
                                                    await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                                                    await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                                                    await RollBack_PurchaseOrder((err) => { if (err) { console.error(err); } });
                                                    await RollBack_PurchaseOrderDetail((err) => { if (err) { console.error(err); } });
                                                    await RollBack_OriginalTreatment((err) => { if (err) { console.error(err); } });
                                                    await RollBack_reCreateTreatmentDetail((err) => { if (err) { console.error(err); } });
                                                    await Rollback_removeOriginalTreatmentDetail((err) => { if (err) { console.error(err); } });
                                                    callback(new Error(`${controllerName}: removeOriginalTreatmentDetailResult [${index}] have error`));
                                                    return;
                                                }
                                                else {
                                                    removeOriginalTreatmentDetail.push(elementOTD);
                                                    continue;
                                                }
                                            }

                                            if (findOriginalTreatmentDetail.length !== removeOriginalTreatmentDetail.length) {
                                                await RollBack_ArchiveTreatment((err) => { if (err) { console.error(err); } });
                                                await Rollback_ArchiveTreatmentDetail((err) => { if (err) { console.error(err); } });
                                                await RollBack_PurchaseOrder((err) => { if (err) { console.error(err); } });
                                                await RollBack_PurchaseOrderDetail((err) => { if (err) { console.error(err); } });
                                                await RollBack_OriginalTreatment((err) => { if (err) { console.error(err); } });
                                                await RollBack_reCreateTreatmentDetail((err) => { if (err) { console.error(err); } });
                                                await Rollback_removeOriginalTreatmentDetail((err) => { if (err) { console.error(err); } });
                                                callback(new Error(`${controllerName}: findOriginalTreatmentDetail.length (${findOriginalTreatmentDetail.length}) not equal removeOriginalTreatmentDetail.length (${removeOriginalTreatmentDetail.length})`));
                                                return;
                                            }
                                            else {
                                                callback(null);
                                                return {
                                                    _ref_poid: ObjectId(transactionPurchaseOrderSave._id),
                                                };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};


/**
 * Controller สำหรับ สร้างใบ PO ของ Treatment
 */
const PurchaseOrder_TreatmentProcess_Controller = async (
    _ref_storeid = '',
    _ref_branchid = '',
    _ref_agentid = '',
    _ref_treatmentid = '',
    discount_course_price = 0,
    discount_product_price = 0,
    paid_type = '',
    timeStamp = new Date(),
    course = [
        {
            _ref_courseid: '',
            course_price: 0,
            course_count: 0,
            course_remark: null
        }
    ],
    product = [
        {
            _ref_productid: '',
            product_price: 0,
            product_count: 0,
            product_remark: null,
        }
    ],
    callback = (err = new Error) => { }
) => {
    const controllerName = `PurchaseOrder_TreatmentPreProcess_Controller`;

    const moment = require('moment');

    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const checkStoreBranch = miscController.checkStoreBranch;
    const checkObjectId = miscController.checkObjectId;
    const Schedule_Update_Status = miscController.Schedule_Update_Status;
    const validate_StringOrNull_AndNotEmpty = miscController.validate_StringOrNull_AndNotEmpty;

    const { productInventoryDecrese_Save, productInventoryIncrese_Save } = require('../../ProductController');

    if (typeof _ref_storeid != 'string' || !validateObjectId(_ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid> must be String ObjectId`)); return; }
    else if (typeof _ref_branchid != 'string' || !validateObjectId(_ref_branchid)) { callback(new Error(`${controllerName}: <_ref_branchid> must be String ObjectId`)); return; }
    else if (!(await checkStoreBranch({ _storeid: _ref_storeid, _branchid: _ref_branchid }, (err) => { if (err) { return; } }))) { callback(new Error(`${controllerName}: <_ref_storeid> <_ref_branchid> checkStoreBranch return not found`)); return; }
    else if (typeof _ref_treatmentid != 'string' || !validateObjectId(_ref_treatmentid)) { callback(new Error(`${controllerName}: <_ref_treatmentid> must be String ObjectId`)); return; }
    else if (typeof discount_course_price != 'number' || discount_course_price < 0) { callback(new Error(`${controllerName}: <discount_course_price> must be number and morethan or  equal 0`)); return; }
    else if (typeof discount_product_price != 'number' || discount_product_price < 0) { callback(new Error(`${controllerName}: <discount_product_price> must be number and morethan or  equal 0`)); return; }
    else if (typeof paid_type != 'string' || !validate_StringOrNull_AndNotEmpty(paid_type)) { callback(new Error(`${controllerName}: <paid_type> must be String and Not Empty`)); return; }
    else if (!moment(timeStamp).isValid()) { callback(new Error(`${controllerName}: timeStamp>must be DateTime Object`)); return; }
    else if (typeof course != 'object' || course.length <= 0) { callback(new Error(`${controllerName}: <course> must be Array and Length of array must more than 0`)); return; }
    else if (typeof product != 'object' || product.length < 0) { callback(new Error(`${controllerName}: <product> must be Array`)); return; }
    else {
        const mongodbController = require('../../mongodbController');
        const ObjectId = mongodbController.ObjectId;
        const treatmentModel = mongodbController.treatmentModel;
        const inventoryModel = mongodbController.inventoryModel;
        const casePatient_StatusModel = mongodbController.casePatient_StatusModel;

        const currentDateTime = moment(timeStamp);

        const findTreatment = await treatmentModel.findById(
            _ref_treatmentid,
            (err) => { if (err) { callback(err); return; } }
        );

        const SUM_PriceCourse = course.reduce((sumValue, currentValue) => (sumValue + (currentValue.course_price * currentValue.course_count)), 0);
        const SUM_PriceProduct = (product.length === 0) ? 0:product.reduce((sumValue, currentValue) => (sumValue + (currentValue.product_price * currentValue.product_count)), 0);
        // const SUM_PriceCourse_PriceProduct = SUM_PriceCourse + SUM_PriceProduct;

        if (!findTreatment) { callback(new Error(`${controllerName}: findTreatment return not found`)); return; }
        else if (discount_course_price > SUM_PriceCourse) { callback(new Error(`${controllerName}: discount_course_price (${discount_course_price}) must lower than or equal the total of SUM_PriceCourse (${SUM_PriceCourse})`)); return; }
        else if (discount_product_price > SUM_PriceProduct) { callback(new Error(`${controllerName}: discount_product_price (${discount_product_price}) must lower than or equal the total of SUM_PriceProduct (${SUM_PriceProduct})`)); return; }
        else {
            const _ref_scheduleid = await checkObjectId(String(findTreatment._ref_scheduleid), (err) => { if (err) { callback(err); return; } });

            const productPreProcess = await compare_TreatmentProduct_And_RequestedProduct(
                _ref_storeid,
                _ref_branchid,
                _ref_treatmentid,
                product,
                (err) => { if (err) { callback(err); return; } }
            );

            const findTreatmentInSTCasePatient = await casePatient_StatusModel.findOne(
                {
                    '_ref_treatmentid': ObjectId(_ref_treatmentid)
                },
                {},
                (err) => { if (err) { callback(err); return; } }
            );

            if (!_ref_scheduleid) { callback(new Error(`${controllerName}: _ref_scheduleid cannot convert to ObjectId`)); return; }
            else if (!findTreatmentInSTCasePatient) { callback(new Error(`${controllerName}: findTreatmentInSTCasePatient return not found`)); return; }
            else if (!productPreProcess) { callback(new Error(`${controllerName}: compare_TreatmentProduct_And_RequestedProduct have error`)); return; }
            else { // Check Product for Decrease/Increase 
                const Update_CasePatient_Status = async (_poid = Object(), cb = (err = new Error) => {}) => {
                    if (typeof _poid == 'object') {
                        for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {
                            const findStatusTPGN = await casePatient_StatusModel.findOne(
                                {
                                    '_id': ObjectId(findTreatmentInSTCasePatient._id)
                                },
                                {},
                                (err) => { if (err) { callback(err); return; } }
                            );
    
                            if (!findStatusTPGN) { continue; }
                            else {
                                findStatusTPGN._ref_poid = _poid;

                                const updateSTCasePatientResult = await findStatusTPGN.save().then(result => result).catch(err => { if (err) { cb(err); return; } });

                                if (!updateSTCasePatientResult) { continue; }
                                else { break; }
                            }
                        }
                    }
                };

                if (productPreProcess.request_Product.length === 0) {
                    if (productPreProcess.exits_Product.length > 0) { // productPreProcess.request_Product.length === 0 && productPreProcess.exits_Product.length > 0
                        let productTransactionResult = 0; // Must be Equal 2
                        let inventoryUpdateIncreaseData = [];
                        let inventoryUpdateDecreaseData = [];

                        const Rollback_UpdateInventoryIncrease = async (callback = (err = new Error) => {}) => {
                            for (let index = 0; index < inventoryUpdateIncreaseData.length; index++) {
                                const elementInventory = inventoryUpdateIncreaseData[index];
                                const ele_ref_product_inventoryid = await checkObjectId(elementInventory._ref_product_inventoryid, (err) => { if (err) { callback(err); return; } });
                                if (!ele_ref_product_inventoryid) { continue; }
                                else {
                                    const Retry_Max = 10;
                                    for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                                        let findInventory = await inventoryModel.findById(ele_ref_product_inventoryid, (err) => { if (err) { callback(err); return; } });
                                        if (!findInventory) { continue; }
                                        else {
                                            findInventory.product_inventory_count = findInventory.product_inventory_count - elementInventory.product_count;
                                            const updateResult = await findInventory.save().then(result => result).catch(err => { if (err) { callback(err); return; } });
                                            if (!updateResult) { continue; }
                                            else { break; }
                                        }
                                    }
                                }
                            }
                            callback(null);
                            return true;
                        };

                        const Rollback_UpdateInventoryDecrease = async (callback = (err = new Error) => {}) => {
                            for (let index = 0; index < inventoryUpdateDecreaseData.length; index++) {
                                const elementInventory = inventoryUpdateDecreaseData[index];
                                const ele_ref_product_inventoryid = await checkObjectId(elementInventory._ref_product_inventoryid, (err) => { if (err) { callback(err); return; } });
                                if (!ele_ref_product_inventoryid) { continue; }
                                else {
                                    const Retry_Max = 10;
                                    for (let Retry_Count = 0; Retry_Count < Retry_Count; Retry_Count++) {
                                        let findInventory = await inventoryModel.findById(ele_ref_product_inventoryid, (err) => { if (err) { callback(err); return; } });
                                        if (!findInventory) { continue; }
                                        else {
                                            findInventory.product_inventory_count = findInventory.product_inventory_count + elementInventory.product_count;
                                            const updateResult = await findInventory.save().then(result => result).catch(err => { if (err) { callback(err); return; } });
                                            if (!updateResult) { continue; }
                                            else { break; }
                                        }
                                    }
                                }
                            }
                            callback(null);
                            return true;
                        };

                        if (productPreProcess.increase_Product.length > 0) {
                            const inventoryDecreaseResult = await productInventoryDecrese_Save(
                                {
                                    _ref_storeid: _ref_storeid,
                                    _ref_branchid: _ref_branchid,
                                    _ref_agentid: _ref_agentid,
                                    product: productPreProcess.increase_Product.map(
                                        where => (
                                            {
                                                _ref_productid: where._ref_productid,
                                                product_inventory_price: where.product_price,
                                                _product_inventory_decrese_count: where.product_count
                                            }
                                        )
                                    ),
                                },
                                (err) => { if (err) { productTransactionResult--; console.error(err); return; } }
                            );

                            if (!inventoryDecreaseResult || inventoryDecreaseResult.failedInventoryId.length !== 0) {
                                await Rollback_UpdateInventoryIncrease((err) => { if (err) { console.error(err); } });
                                await Rollback_UpdateInventoryDecrease((err) => { if (err) { console.error(err); } });
                                productTransactionResult--;
                                callback(new Error(`${controllerName}: inventoryDecreaseResult have error`));
                                return;
                            }
                            else {
                                inventoryUpdateDecreaseData.push(inventoryDecreaseResult.updatedInventoryId);
                                productTransactionResult++;
                            }
                        }
                        else {
                            productTransactionResult++;
                        }

                        if (productPreProcess.decrease_Product.length > 0) {
                            const inventoryIncreaseResult = await productInventoryIncrese_Save(
                                {
                                    _ref_storeid: _ref_storeid,
                                    _ref_branchid: _ref_branchid,
                                    _ref_agentid: _ref_agentid,
                                    product: productPreProcess.decrease_Product.map(
                                        where => (
                                            {
                                                _ref_productid: where._ref_productid,
                                                product_inventory_price: where.product_price,
                                                product_inventory_decrese_count: where.product_count
                                            }
                                        )
                                    ),
                                },
                                (err) => { if (err) { productTransactionResult--; console.error(err); return; } }
                            );

                            if (!inventoryIncreaseResult || inventoryIncreaseResult.failedInventoryId.length !== 0) {
                                await Rollback_UpdateInventoryIncrease((err) => { if (err) { console.error(err); } });
                                await Rollback_UpdateInventoryDecrease((err) => { if (err) { console.error(err); } });
                                productTransactionResult--;
                                callback(new Error(`${controllerName}: inventoryIncreaseResult have error`));
                                return;
                            }
                            else {
                                inventoryUpdateIncreaseData.push(inventoryIncreaseResult.updatedInventoryId);
                                productTransactionResult++;
                            }
                        }
                        else {
                            productTransactionResult++;
                        }

                        if (productTransactionResult !== 2) { callback(new Error(`${controllerName}: productTransactionResult (${productTransactionResult}) not equal 2`)); return; }
                        else {
                            const purchaseOrderProcessResult = await updateTreatment_And_Create_PO(
                                {
                                    _ref_storeid: _ref_storeid,
                                    _ref_branchid: _ref_branchid,
                                    _ref_agetntid: _ref_agentid,
                                    _ref_treatmentid: _ref_treatmentid,
                                    discount_course_price: discount_course_price,
                                    discount_product_price: discount_product_price,
                                    paid_type: paid_type,
                                    timeStamp: currentDateTime,
                                    course: course,
                                    product: product
                                },
                                (err) => { if (err) { console.error(err); return; } }
                            );

                            if (!purchaseOrderProcessResult) {
                                await Rollback_UpdateInventoryIncrease((err) => { if (err) { console.error(err); } });
                                await Rollback_UpdateInventoryDecrease((err) => { if (err) { console.error(err); } });
                                callback(new Error(`${controllerName}: purchaseOrderProcessResult have error`));
                                return;
                            }
                            else {
                                await Schedule_Update_Status(
                                    {
                                        _ref_storeid: _ref_storeid,
                                        _ref_branchid: _ref_branchid,
                                        _ref_scheduleid: String(_ref_scheduleid),
                                        updateStatusMode: 5
                                    },
                                    (err) => { if (err) { console.error(err); } }
                                );
                                await Update_CasePatient_Status(purchaseOrderProcessResult._ref_poid, (err) = { if (err) { console.error(err); } });

                                callback(null);
                                return purchaseOrderProcessResult;
                            }
                        }
                    }
                    else { // productPreProcess.request_Product.length === 0 && productPreProcess.exits_Product.length <= 0

                        const purchaseOrderProcessResult = await updateTreatment_And_Create_PO(
                            {
                                _ref_storeid: _ref_storeid,
                                _ref_branchid: _ref_branchid,
                                _ref_agetntid: _ref_agentid,
                                _ref_treatmentid: _ref_treatmentid,
                                discount_course_price: discount_course_price,
                                discount_product_price: discount_product_price,
                                paid_type: paid_type,
                                timeStamp: currentDateTime,
                                course: course,
                                product: product
                            },
                            (err) => { if (err) { callback(err); return; } }
                        );

                        if (!purchaseOrderProcessResult) { callback(`${controllerName}: purchaseOrderProcessResult have error`); return; }
                        else {
                            await Schedule_Update_Status(
                                {
                                    _ref_storeid: _ref_storeid,
                                    _ref_branchid: _ref_branchid,
                                    _ref_scheduleid: String(_ref_scheduleid),
                                    updateStatusMode: 5
                                },
                                (err) => { if (err) { console.error(err); } }
                            );
                            await Update_CasePatient_Status(purchaseOrderProcessResult._ref_poid, (err) = { if (err) { console.error(err); } });

                            callback(null);
                            return purchaseOrderProcessResult;
                        }
                    }
                }
                else { // productPreProcess.request_Product.length > 0
                    let productTransactionResult = 0; // Must be Equal 2
                    let inventoryUpdateIncreaseData = [];
                    let inventoryUpdateDecreaseData = [];

                    const Rollback_UpdateInventoryIncrease = async (callback = (err = new Error) => {}) => {
                        for (let index = 0; index < inventoryUpdateIncreaseData.length; index++) {
                            const elementInventory = inventoryUpdateIncreaseData[index];
                            const ele_ref_product_inventoryid = await checkObjectId(elementInventory._ref_product_inventoryid, (err) => { if (err) { callback(err); return; } });
                            if (!ele_ref_product_inventoryid) { continue; }
                            else {
                                const Retry_Max = 10;
                                for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                                    let findInventory = await inventoryModel.findById(ele_ref_product_inventoryid, (err) => { if (err) { callback(err); return; } });
                                    if (!findInventory) { continue; }
                                    else {
                                        findInventory.product_inventory_count = findInventory.product_inventory_count - elementInventory.product_count;
                                        const updateResult = await findInventory.save().then(result => result).catch(err => { if (err) { callback(err); return; } });
                                        if (!updateResult) { continue; }
                                        else { break; }
                                    }
                                }
                            }
                        }
                        callback(null);
                        return true;
                    };

                    const Rollback_UpdateInventoryDecrease = async (callback = (err = new Error) => {}) => {
                        for (let index = 0; index < inventoryUpdateDecreaseData.length; index++) {
                            const elementInventory = inventoryUpdateDecreaseData[index];
                            const ele_ref_product_inventoryid = await checkObjectId(elementInventory._ref_product_inventoryid, (err) => { if (err) { callback(err); return; } });
                            if (!ele_ref_product_inventoryid) { continue; }
                            else {
                                const Retry_Max = 10;
                                for (let Retry_Count = 0; Retry_Count < Retry_Count; Retry_Count++) {
                                    let findInventory = await inventoryModel.findById(ele_ref_product_inventoryid, (err) => { if (err) { callback(err); return; } });
                                    if (!findInventory) { continue; }
                                    else {
                                        findInventory.product_inventory_count = findInventory.product_inventory_count + elementInventory.product_count;
                                        const updateResult = await findInventory.save().then(result => result).catch(err => { if (err) { callback(err); return; } });
                                        if (!updateResult) { continue; }
                                        else { break; }
                                    }
                                }
                            }
                        }
                        callback(null);
                        return true;
                    };

                    if (productPreProcess.exits_Product.length === 0) { // productPreProcess.request_Product.length > 0 && productPreProcess.exits_Product.length === 0
                        if (productPreProcess.increase_Product.length > 0) {
                            const inventoryDecreaseResult = await productInventoryDecrese_Save(
                                {
                                    _ref_storeid: _ref_storeid,
                                    _ref_branchid: _ref_branchid,
                                    _ref_agentid: _ref_agentid,
                                    product: productPreProcess.increase_Product.map(
                                        where => (
                                            {
                                                _ref_productid: where._ref_productid,
                                                product_inventory_price: where.product_price,
                                                _product_inventory_decrese_count: where.product_count
                                            }
                                        )
                                    ),
                                },
                                (err) => { if (err) { productTransactionResult--; callback(err); return; } }
                            );

                            if (!inventoryDecreaseResult) { productTransactionResult--; callback(`${controllerName}: inventoryDecreaseResult have error`); return; }
                            else {
                                productTransactionResult++;
                                inventoryUpdateDecreaseData.concat(
                                    productPreProcess.increase_Product.map(
                                        where => (
                                            {
                                                _ref_productid: where._ref_productid,
                                                _ref_product_inventoryid: where._ref_product_inventoryid,
                                                product_inventory_price: where.product_price,
                                                product_inventory_decrese_count: where.product_count
                                            }
                                        )
                                    )
                                );
                            }
                        }
                        else {
                            productTransactionResult++;
                        }

                        if (productPreProcess.decrease_Product.length > 0) {
                            const inventoryIncreaseResult = await productInventoryIncrese_Save(
                                {
                                    _ref_storeid: _ref_storeid,
                                    _ref_branchid: _ref_branchid,
                                    _ref_agentid: _ref_agentid,
                                    product: productPreProcess.decrease_Product.map(
                                        where => (
                                            {
                                                _ref_productid: where._ref_productid,
                                                product_inventory_price: where.product_price,
                                                product_inventory_decrese_count: where.product_count
                                            }
                                        )
                                    ),
                                },
                                (err) => { if (err) { productTransactionResult--; callback(err); return; } }
                            );

                            if (!inventoryIncreaseResult) { productTransactionResult--; callback(`${controllerName}: inventoryIncreaseResult have error`); return; }
                            else {
                                productTransactionResult++;
                                inventoryUpdateIncreaseData.concat(
                                    productPreProcess.decrease_Product.map(
                                        where => (
                                            {
                                                _ref_productid: where._ref_productid,
                                                _ref_product_inventoryid: where._ref_product_inventoryid,
                                                product_inventory_price: where.product_price,
                                                product_inventory_decrese_count: where.product_count
                                            }
                                        )
                                    )
                                );
                            }
                        }
                        else {
                            productTransactionResult++;
                        }
                    }
                    else { // productPreProcess.request_Product.length > 0 && productPreProcess.exits_Product.length > 0
                        if (productPreProcess.increase_Product.length > 0) {
                            const inventoryDecreaseResult = await productInventoryDecrese_Save(
                                {
                                    _ref_storeid: _ref_storeid,
                                    _ref_branchid: _ref_branchid,
                                    _ref_agentid: _ref_agentid,
                                    product: productPreProcess.increase_Product.map(
                                        where => (
                                            {
                                                _ref_productid: where._ref_productid,
                                                product_inventory_price: where.product_price,
                                                _product_inventory_decrese_count: where.product_count
                                            }
                                        )
                                    ),
                                },
                                (err) => { if (err) { productTransactionResult--; callback(err); return; } }
                            );

                            if (!inventoryDecreaseResult) { productTransactionResult--; callback(`${controllerName}: inventoryDecreaseResult have error`); return; }
                            else {
                                productTransactionResult++;
                                inventoryUpdateDecreaseData.concat(
                                    productPreProcess.increase_Product.map(
                                        where => (
                                            {
                                                _ref_productid: where._ref_productid,
                                                _ref_product_inventoryid: where._ref_product_inventoryid,
                                                product_inventory_price: where.product_price,
                                                product_inventory_decrese_count: where.product_count
                                            }
                                        )
                                    )
                                );
                            }
                        }
                        else {
                            productTransactionResult = productTransactionResult + 1;
                        }
                        if (productPreProcess.decrease_Product.length > 0) {
                            const inventoryIncreaseResult = await productInventoryIncrese_Save(
                                {
                                    _ref_storeid: _ref_storeid,
                                    _ref_branchid: _ref_branchid,
                                    _ref_agentid: _ref_agentid,
                                    product: productPreProcess.decrease_Product.map(
                                        where => (
                                            {
                                                _ref_productid: where._ref_productid,
                                                product_inventory_price: where.product_price,
                                                product_inventory_decrese_count: where.product_count
                                            }
                                        )
                                    ),
                                },
                                (err) => { if (err) { productTransactionResult--; console.error(err); return; } }
                            );

                            if (!inventoryIncreaseResult) { productTransactionResult--; callback(`${controllerName}: inventoryIncreaseResult have error`); return; }
                            else {
                                const concat_inventoryUpdateIncreaseData = productPreProcess.decrease_Product.map(
                                    where => (
                                        {
                                            _ref_productid: where._ref_productid,
                                            _ref_product_inventoryid: where._ref_product_inventoryid,
                                            product_inventory_price: where.product_price,
                                            product_inventory_decrese_count: where.product_count
                                        }
                                    )
                                );
                                concat_inventoryUpdateIncreaseData.forEach(element => {
                                    inventoryUpdateIncreaseData.push(element);
                                });
                                productTransactionResult++;
                            }
                        }
                        else {
                            productTransactionResult++;
                        }
                    }

                    if (productTransactionResult < 2) {
                        await Rollback_UpdateInventoryIncrease((err) => { if (err) { console.error(err); } });
                        await Rollback_UpdateInventoryDecrease((err) => { if (err) { console.error(err); } });
                        callback(new Error(`${controllerName}: productTransactionResult value (${productTransactionResult}) that is must be equal or morethan 2`)); 
                        return;
                    }
                    else {
                        const purchaseOrderProcessResult = await updateTreatment_And_Create_PO(
                            {
                                _ref_storeid: _ref_storeid,
                                _ref_branchid: _ref_branchid,
                                _ref_agetntid: _ref_agentid,
                                _ref_treatmentid: _ref_treatmentid,
                                discount_course_price: discount_course_price,
                                discount_product_price: discount_product_price,
                                paid_type: paid_type,
                                timeStamp: currentDateTime,
                                course: course,
                                product: product
                            },
                            (err) => { if (err) { console.error(err); return; } }
                        );

                        if (!purchaseOrderProcessResult) {
                            await Rollback_UpdateInventoryIncrease((err) => { if (err) { console.error(err); } });
                            await Rollback_UpdateInventoryDecrease((err) => { if (err) { console.error(err); } });
                            callback(new Error(`${controllerName}: purchaseOrderProcessResult have error`));
                            return;
                        }
                        else {
                            await Schedule_Update_Status(
                                {
                                    _ref_storeid: _ref_storeid,
                                    _ref_branchid: _ref_branchid,
                                    _ref_scheduleid: String(_ref_scheduleid),
                                    updateStatusMode: 5
                                },
                                (err) => { if (err) { console.error(err); } }
                            );
                            await Update_CasePatient_Status(purchaseOrderProcessResult._ref_poid, (err) = { if (err) { console.error(err); } });

                            callback(null);
                            return {
                                _ref_poid: purchaseOrderProcessResult._ref_poid,
                            };
                        }
                    }
                }
            }
        }
    }
};


module.exports = PurchaseOrder_TreatmentProcess_Controller;