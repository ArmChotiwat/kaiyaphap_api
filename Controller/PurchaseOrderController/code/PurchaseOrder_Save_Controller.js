/**
 * Controller หลัก สำหรับ สร้างใบ PurchaseOrder (PO)
 */
const PurchaseOrder_Save_Controller = async (
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
    const controllerName = `PurchaseOrder_Save_Controller`;

    const moment = require('moment');

    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const checkStoreBranch = miscController.checkStoreBranch;
    const validate_StringOrNull_AndNotEmpty = miscController.validate_StringOrNull_AndNotEmpty;

    const AutoIncrement_PurchaseOrder_Controller = require('./AutoIncrement_PurchaseOrder_Controller');

    if (typeof _ref_storeid != 'string' || !validateObjectId(_ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid> must be String ObjectId`)); return; }
    else if (typeof _ref_branchid != 'string' || !validateObjectId(_ref_branchid)) { callback(new Error(`${controllerName}: <_ref_branchid> must be String ObjectId`)); return; }
    else if (!(await checkStoreBranch({ _storeid: _ref_storeid, _branchid: _ref_branchid }, (err) => { if (err) { return; } }))) { callback(new Error(`${controllerName}: <_ref_storeid> <_ref_branchid> checkStoreBranch return not found`)); return; }
    else if (typeof discount_course_price != 'number' || discount_course_price < 0) { callback(new Error(`${controllerName}: <discount_course_price> must be Number morethan or equal 0`)); return; }
    else if (typeof discount_product_price != 'number' || discount_product_price < 0) { callback(new Error(`${controllerName}: <discount_product_price> must be Number morethan or equal 0`)); return; }
    else if (typeof paid_type != 'string' || !validate_StringOrNull_AndNotEmpty(paid_type)) { callback(new Error(`${controllerName}: paid_type`)); return; }
    else if (!moment(timeStamp).isValid()) { callback(new Error(`${controllerName}: <timeStamp> must be DateTime Object`)); return; }
    else if (typeof course != 'object' || course.length < 0) { callback(new Error(`${controllerName}: <course> must be Array`)); return; }
    else if (typeof product != 'object' || product.length < 0) { callback(new Error(`${controllerName}: <product> must be Array`)); return; }
    else {
        const currentDateTime = moment(timeStamp);

        if (_ref_treatmentid === null) {
            if (product.length <= 0) {}
            else {
                const PurchaseOrder_CouterPreProcess_Controller = require('./PurchaseOrder_CouterPreProcess_Controller');
                const processResult = await PurchaseOrder_CouterPreProcess_Controller(
                    {
                        _ref_storeid: _ref_storeid,
                        _ref_branchid: _ref_branchid,
                        _ref_agentid: _ref_agentid,
                        paid_type: paid_type,
                        timeStamp: currentDateTime,
                        product: product,
                        discount_product_price: discount_product_price,
                    },
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!processResult) {callback(new Error(`${controllerName}: processResult of Couter Purchase Order (_ref_treatmentid === null) have error`)); return; }
                else {
                    await AutoIncrement_PurchaseOrder_Controller(
                        {
                            _ref_poid: String(processResult._ref_poid),
                            _ref_storeid:_ref_storeid,
                            _ref_branchid:_ref_branchid,
                            timeStamp: currentDateTime
                        },
                        (err) => { if (err) { console.error(err); return; } }
                    );

                    callback(null);
                    return processResult;
                }
            }
        }
        else if (typeof _ref_treatmentid == 'string' && validateObjectId(_ref_treatmentid)) {
            if (course.length <= 0) {
                callback(new Error(`${controllerName}: course.length (${course.length}) must be more than 0 Due _ref_treatmentid is String ObjectId`));
                return;
            }
            else {
                const PurchaseOrder_TreatmentProcess_Controller = require('./PurchaseOrder_TreatmentPreProcess_Controller');
                const processResult = await PurchaseOrder_TreatmentProcess_Controller(
                    _ref_storeid,
                    _ref_branchid,
                    _ref_agentid,
                    _ref_treatmentid,
                    discount_course_price,
                    discount_product_price,
                    paid_type,
                    currentDateTime,
                    course,
                    product,
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!processResult) { callback(new Error(`${controllerName}: processResult of Treatment Purchase Order (_ref_treatmentid === ObjectId) have error`)); return; }
                else {
                    await AutoIncrement_PurchaseOrder_Controller(
                        {
                            _ref_poid: String(processResult._ref_poid),
                            _ref_storeid: _ref_storeid,
                            _ref_branchid: _ref_branchid,
                            timeStamp: currentDateTime
                        },
                        (err) => { if (err) { console.error(err); return; } }
                    );

                    callback(null);
                    return {
                        _ref_poid: processResult._ref_poid,
                    };
                }
            }
        }
        else {
            callback(new Error(`${controllerName}: have other error (out of condition _ref_treatmentid)`));
            return;
        }
    }
};

module.exports = PurchaseOrder_Save_Controller;