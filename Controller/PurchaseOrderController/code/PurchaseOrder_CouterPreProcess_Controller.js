/**
 * Controller สำหรับ สร้างใบ PO หน้า Couter (ไม่ได้ผ่าน Treatment)
 */
const PurchaseOrder_CouterPreProcess_Controller = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agentid: '',
        paid_type: '',
        timeStamp: new Date(),
        product: [
            {
                _ref_productid: '',
                product_price: -1,
                product_count: 0,
                product_remark: null,
            }
        ],
        discount_product_price: 0,
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `PurchaseOrder_CouterPreProcess_Controller`;

    const moment = require('moment');

    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const checkAgentId = miscController.checkAgentId;
    const checkProductInventoryPrice = miscController.checkProductInventoryPrice;
    const validate_StringOrNull_AndNotEmpty = miscController.validate_StringOrNull_AndNotEmpty;

    const mongodbController = require('../../mongodbController');
    const inventoryModel = mongodbController.inventoryModel;
    const purchaseOrderModel = mongodbController.purchaseOrderModel;
    const purchaseOrderDetailModel = mongodbController.purchaseOrderDetailModel;
    const ObjectId = mongodbController.mongoose.Types.ObjectId;

    const mapReduce_ProductData = require('./mapReduce_ProductData');

    const { productInventoryDecrese_Save } = require('../../ProductController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
    else if (typeof data.paid_type != 'string' || !validate_StringOrNull_AndNotEmpty(data.paid_type)) { callback(new Error(`${controllerName}: <data.paid_type> must be String and NOT Empty`)); return; }
    else if (!moment(data.timeStamp).isValid()) { callback(new Error(`${controllerName}: <data.timeStamp> must be DateTime Object`)); return; }
    else if (typeof data.product != 'object' || data.product.length <= 0) { callback(new Error(`${controllerName}: <data.product> must be Array and Length of array must more than 0`)); return; }
    else if (typeof data.discount_product_price != 'number' && data.discount_product_price < 0) { callback(new Error(`${controllerName}: <data.discount_product_price> must be number more than or equal 0`)); return; }
    else {
        const currnetTime = miscController.momentFormat(data.timeStamp);

        const checkAdminId = await checkAgentId(
            {
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid,
                _agentid: data._ref_agentid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        const mapReduce_Product = await mapReduce_ProductData(
            data.product,
            (err) => { if (err) { callback(err); return; } }
        );

        if (!checkAdminId) { callback(new Error(`${controllerName}: checkAdminId return not found`)); return; }
        else if (checkAdminId.role !== 1) { callback(new Error(`${controllerName}: checkAdminId.role (${checkAdminId.role}) not equal 1`)); return; }
        else if (!mapReduce_Product) { callback(new Error(`${controllerName}: mapReduce_Product have error`)); return; }
        else { // Check Invenroty
            let validatedInventory = [];

            for (let index = 0; index < mapReduce_Product.productTreatmentDetail.length; index++) {
                const elementProduct = mapReduce_Product.productTreatmentDetail[index];

                const checkInventory = await checkProductInventoryPrice(
                    {
                        _ref_storeid: data._ref_storeid,
                        _ref_branchid: data._ref_branchid,
                        _ref_product_inventoryid: null,
                        _ref_productid: elementProduct._ref_productid,
                        product_price: elementProduct.product_price,
                    },
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!checkInventory) { callback(new Error(`${controllerName}: checkInventory [${index}] return not found`)); return; }
                else {
                    const findInventoryLeft = await inventoryModel.findById(
                        checkInventory._ref_product_inventoryid,
                        {},
                        (err) => { if (err) { callback(err); return; } }
                    );

                    if (!findInventoryLeft) { callback(new Error(`${controllerName}: findInventoryLeft [${index}] return not found`)); return; }
                    else if (!findInventoryLeft.product_inventory_count) { callback(new Error(`${controllerName}: findInventoryLeft.product_inventory_count [${index}] return not found`)); return; }
                    else if (findInventoryLeft.product_inventory_count < elementProduct.product_count) { callback(new Error(`${controllerName}: findInventoryLeft.product_inventory_count (${findInventoryLeft.product_inventory_count}) is lower than request product[${index}].product_count ${elementProduct.product_count}`)); return; }
                    else {
                        validatedInventory.push(
                            {
                                _ref_productid: checkInventory._ref_productid,
                                _ref_product_inventoryid: checkInventory._ref_product_inventoryid,
                                _ref_storeid: checkInventory._ref_storeid,
                                _ref_branchid: checkInventory._ref_branchid,
                                product_price: checkInventory.product_price,
                                product_decreasement_count: elementProduct.product_count,
                            }
                        );
                        continue;
                    }
                }
            }

            if (validatedInventory.length !== mapReduce_Product.productTreatmentDetail.length) { callback(new Error(`${controllerName}: validatedInventory.length (${validatedInventory.length}) not equal (Request Product) mapReduce_Product.productTreatmentDetail.length (${mapReduce_Product.productTreatmentDetail.length})`)); return; }
            else { // Create PO Header
                const total_product_price = mapReduce_Product.productTreatmentDetail.reduce((sumValue, currentValue) => (sumValue + (currentValue.product_count * currentValue.product_price)), 0);
                const mapData_new_POHearder = {
                    run_number: null,
                    _ref_treatmentid: null,
                    _ref_casepatinetid: null,
                    count_product_list: mapReduce_Product.productTreatmentDetail.length,
                    price_product_list_total: total_product_price,
                    price_product_list_discount: data.discount_product_price,
                    price_product_list_total_discount: total_product_price - data.discount_product_price,
                    price_total_before: total_product_price,
                    price_discount: data.discount_product_price,
                    price_total_after: total_product_price - data.discount_product_price,
                    count_course_list: 0,
                    price_course_list_total: 0,
                    _ref_storeid: checkAdminId._storeid,
                    _ref_branchid: checkAdminId._branchid,
                    create_date: currnetTime.DateTimeObject,
                    create_date_string: currnetTime.Date_String,
                    create_time_string: currnetTime.Time_String,
                    _ref_agent_userid_create: checkAdminId._agentid,
                    _ref_agent_userstoreid_create: checkAdminId._agentstoreid,
                    modify_date: currnetTime.DateTimeObject,
                    modify_date_string: currnetTime.Date_String,
                    modify_time_string: currnetTime.Time_String,
                    _ref_agent_userid_modify: checkAdminId._agentid,
                    _ref_agent_userstoreid_modify: checkAdminId._agentstoreid,
                    paid_type: data.paid_type,
                    ispaid: true,
                    isclosed: false,
                    istruncated: false,
                };
    
                const new_PO_HeaderModel = new purchaseOrderModel(mapData_new_POHearder);
                const transactionPOHeaderSave = await new_PO_HeaderModel.save().then(result => result).catch(err => { if (err) { callback(err); return; } });
    
                if (!transactionPOHeaderSave) { callback(new Error(`${controllerName}: transactionPOHeaderSave have error`)); return; }
                else { // Create PO Detail
                    const Rollback_POHeader = async (callback = (err = new Error) => {}) => {
                        const deletePOHeaderResult = await purchaseOrderModel.findByIdAndDelete(
                            transactionPOHeaderSave,
                            (err) => { if (err) { callback(err); return; } }
                        );
                        if (!deletePOHeaderResult) { callback(new Error(`${controllerName}: Rollback_POHeader => deletePOHeaderResult have error`)); return false; }
                        else { callback(null); return true; }
                    };
    
                    let PODetail_Created = [];
    
                    const Rollback_PODetail = async (callback = (err = new Error) => {}) => {
                        for (let index = 0; index < PODetail_Created.length; index++) {
                            const elementPDC = PODetail_Created[index];
                            const deletePODetailResult = await purchaseOrderDetailModel.findByIdAndDelete(
                                elementPDC._id,
                                (err) => { if (err) { callback(err); return; } }
                            );
                            if (!deletePODetailResult) { callback(new Error(`${controllerName}: Rollback_PODetail => deletePODetailResult product [${index}] have error`)); return false; }
                            else {
                                continue;
                            }
                        }
                        callback(null);
                        return true;
                    };
    
                    // Create Product PO Detail
                    for (let index = 0; index < mapReduce_Product.productTreatmentDetail_Full.length; index++) {
                        const elementProduct = mapReduce_Product.productTreatmentDetail_Full[index];
    
                        const mapData_new_PODetail = {
                            run_number: null,
                            _ref_poid: transactionPOHeaderSave._id,
                            _ref_treatmentid: mapData_new_POHearder._ref_treatmentid,
                            _ref_casepatinetid: mapData_new_POHearder._ref_casepatinetid,
                            _ref_productid: elementProduct._ref_productid,
                            product_count: elementProduct.product_count,
                            product_price: elementProduct.product_price,
                            product_price_total: elementProduct.product_count * elementProduct.product_price,
                            product_remark: elementProduct.remark_product,
                            _ref_courseid: null,
                            course_count: 0,
                            course_price: 0,
                            course_price_total: 0,
                            course_remark: null,
                            _ref_storeid: mapData_new_POHearder._ref_storeid,
                            _ref_branchid: mapData_new_POHearder._ref_branchid,
                            create_date: mapData_new_POHearder.create_date,
                            create_date_string: mapData_new_POHearder.create_date_string,
                            create_time_string: mapData_new_POHearder.create_time_string,
                            _ref_agent_userid_create: mapData_new_POHearder._ref_agent_userid_create,
                            _ref_agent_userstoreid_create: mapData_new_POHearder._ref_agent_userstoreid_create,
                            modify_date: mapData_new_POHearder.modify_date,
                            modify_date_string: mapData_new_POHearder.modify_date_string,
                            modify_time_string: mapData_new_POHearder.modify_time_string,
                            _ref_agent_userid_modify: mapData_new_POHearder._ref_agent_userid_modify,
                            _ref_agent_userstoreid_modify: mapData_new_POHearder._ref_agent_userstoreid_modify,
                            ispaid: mapData_new_POHearder.ispaid,
                            isclosed: mapData_new_POHearder.isclosed,
                            istruncated: mapData_new_POHearder.istruncated,
                        };
    
                        const new_PO_DetailModel = new purchaseOrderDetailModel(mapData_new_PODetail);
                        const transactionPODetailSave = await new_PO_DetailModel.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });
    
                        if (!transactionPODetailSave) {
                            await Rollback_POHeader((err) => { if (err) { console.error(err); } });
                            await Rollback_PODetail((err) => { if (err) { console.error(err); } });
                            callback(new Error(`${controllerName}: transactionPODetailSave have error at product[${index}]`));
                            return;
                        }
                        else {
                            PODetail_Created.push(transactionPODetailSave);
                            continue;
                        }
                    }
    
                    if (mapReduce_Product.productTreatmentDetail_Full.length !== PODetail_Created.length) {
                        await Rollback_POHeader((err) => { if (err) { console.error(err); } });
                        await Rollback_PODetail((err) => { if (err) { console.error(err); } });
                        callback(new Error(`${controllerName}: mapReduce_Product.productTreatmentDetail_Full.length (${mapReduce_Product.productTreatmentDetail_Full.length}) not equal PODetail_Created.length (${PODetail_Created.length})`));
                        return;
                    }
                    else {    
                        const InventoryDeceasementResult = await productInventoryDecrese_Save(
                            {
                                _ref_storeid: String(checkAdminId._storeid),
                                _ref_branchid: String(checkAdminId._branchid),
                                _ref_agentid: String(checkAdminId._agentid),
                                product: data.product.map(
                                    where => (
                                        {
                                            _ref_productid: where._ref_productid,
                                            product_inventory_price: where.product_price,
                                            _product_inventory_decrese_count: where.product_count
                                        }
                                    )
                                ),
                            },
                            (err) => { if (err) { console.error(err); return; } }
                        );

                        if (!InventoryDeceasementResult) {
                            await Rollback_POHeader((err) => { if (err) { console.error(err); } });
                            await Rollback_PODetail((err) => { if (err) { console.error(err); } });
                            callback(new Error(`${controllerName}: InventoryDeceasementResult have Error`));
                            return;
                        }
                        else if (InventoryDeceasementResult.failedInventoryId.length !== 0) {
                            await Rollback_POHeader((err) => { if (err) { console.error(err); } });
                            await Rollback_PODetail((err) => { if (err) { console.error(err); } });
                            callback(new Error(`${controllerName}: InventoryDeceasementResult have Error result of InventoryDeceasementResult.failedInventoryId.length (${InventoryDeceasementResult.failedInventoryId.length})`));
                            return;
                        }
                        else {
                            callback(null);
                            return {
                                _ref_poid: ObjectId(transactionPOHeaderSave._id),
                            };
                        }
                    }
                }
            }
        }
        
    }
};

module.exports = PurchaseOrder_CouterPreProcess_Controller;