/**
 * Controller สำหรับ สร้าง ใบสินค้านำเข้า และนำเข้าในสินค้าคงคลัง
 */
const productInventoryImport_Save_Controller = async (
    data = {

        _ref_storeid: String(''),
        _ref_branchid: String(''),
        _ref_agentid: String(''),

        import_date_string: String(''),
        import_time_string: String(''),
        _ref_agentid_import: String(''),

        run_number_inventoryimport_customize: String(''),
        run_number_inventoryimport_ref: String(''),

        product: [
            {
                _ref_productid: String(''),
                inventoryimport_count: Number(-1),
                inventoryimport_price: Number(-1),
            }
        ],
    },
    callback = (err = new Error) => { }
) => {
    const controllerName = `productInventoryImport_Save_Controller`;
    const moment = require('moment');
    const miscController = require('../../miscController');
    const currentDateTime = miscController.currentDateTime();
    const validateObjectId = miscController.validateObjectId;
    const checkStoreBranch = miscController.checkStoreBranch;
    const validateDate_String = miscController.validateDateTime.validateDate_String;
    const validateTime_String = miscController.validateDateTime.validateTime_String;
    const validateDateTime_String = miscController.validateDateTime.validateDateTime_String;
    const validate_StringOrNull_AndNotEmpty = miscController.validate_StringOrNull_AndNotEmpty;
    const mongodbController = require('../../mongodbController');
    const inventoryModel = mongodbController.inventoryModel;

    if (typeof data != 'object') { callback(new Error(`${controllerName}: data must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: data._ref_storeid must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: data._ref_branchid must be String ObjectId`)); return; }
    else if (!(await checkStoreBranch({ _storeid: data._ref_storeid, _branchid: data._ref_branchid }, (err) => { if (err) { return; } }))) { callback(new Error(`${controllerName}: data._ref_storeid and data._ref_branchid not found`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: data._ref_agentid must be String ObjectId`)); return; }
    else if (typeof data._ref_agentid_import != 'string' || !validateObjectId(data._ref_agentid_import)) { callback(new Error(`${controllerName}: data._ref_agentid_import must be String ObjectId`)); return; }
    else if (typeof data.import_date_string != 'string' || !validateDate_String(data.import_date_string)) { callback(new Error(`${controllerName}: data.import_date_string must be String Date YYYY-MM-DD`)); return; }
    else if (typeof data.import_time_string != 'string' || !validateTime_String(data.import_time_string)) { callback(new Error(`${controllerName}: data.import_time_string must be String Time HH:mm:ss`)); return; }
    else if (!validateDateTime_String(data.import_date_string, data.import_time_string)) { callback(new Error(`${controllerName}: data.import_date_string and data.import_time_string must be String Date YYYY-MM-DD and Time HH:mm:ss`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.run_number_inventoryimport_customize)) { callback(new Error(`${controllerName}: data.run_number_inventoryimport_customize must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.run_number_inventoryimport_ref)) { callback(new Error(`${controllerName}: data.run_number_inventoryimport_ref must be String or Null and Not Empty`)); return; }
    else if (typeof data.product != 'object' || data.product.length <= 0) { callback(new Error(`${controllerName}: data.product must be Array`)); return; }
    else {
        const import_DateTime = await miscController.checkDateTime.checkDateTime_String(data.import_date_string, data.import_time_string, (err) => { if (err) { callback(err); return; } });
        if (!import_DateTime) { callback(new Error(`${controllerName}: convert data.import_date_string and data.import_time_string failed`)); return; }
        else {
            const import_Date_String = import_DateTime.format('YYYY-MM-DD');
            const import_Time_String = import_DateTime.format('HH:mm:ss');

            const chkAgentAdminId_StoreBranch = await miscController.checkAgentAdminId_StoreBranch(
                {
                    _storeid: data._ref_storeid,
                    _branchid: data._ref_branchid,
                    _agentid: data._ref_agentid
                },
                (err) => { if (err) { callback(err); return; } }
            );

            if (!chkAgentAdminId_StoreBranch) { callback(new Error(`${controllerName}: chkAgentAdminId_StoreBranch return not found data`)); return; }
            else {
                let chkImportAgentId = null;

                if (data._ref_agentid_import === null) {
                    chkImportAgentId = null;
                }
                else {
                    const doChkImportAgentId = await miscController.checkAgentId(
                        {
                            _agentid: data._ref_agentid_import,
                            _storeid: data._ref_storeid,
                            _branchid: data._ref_branchid
                        },
                        (err) => { if (err) { callback(err); return; } }
                    );

                    if (!doChkImportAgentId) { callback(new Error(`${controllerName}: doChkImportAgentId return not found data`)); return; }
                    else {
                        chkImportAgentId = doChkImportAgentId;
                    }
                }

                const checkProduct = miscController.checkProduct;

                let productPassed_1st = [];
                let productFailed_1st = [];

                for (let index = 0; index < data.product.length; index++) {
                    const elementProduct = data.product[index];

                    if (typeof elementProduct._ref_productid != 'string' || !validateObjectId(elementProduct._ref_productid)) { productFailed_1st.push(elementProduct); }
                    else if (typeof elementProduct.inventoryimport_count != 'number' || elementProduct.inventoryimport_count < 0) { productFailed_1st.push(elementProduct); }
                    else if (typeof elementProduct.inventoryimport_price != 'number' || elementProduct.inventoryimport_price < 0) { productFailed_1st.push(elementProduct); }
                    else { // 1st ตรวจระเบียนสินค้า
                        const findProduct = await checkProduct(
                            {
                                _ref_storeid: data._ref_storeid,
                                _ref_productid: elementProduct._ref_productid
                            },
                            (err) => { if (err) { return; } }
                        );

                        if (!findProduct) { productFailed_1st.push(elementProduct); }
                        else {
                            productPassed_1st.push(elementProduct);
                        }
                    }
                }

                if (productFailed_1st.length != 0) {
                    callback(new Error(`${controllerName}: 1st Process Data Prepare failed`));
                    return {
                        passedProduct: productPassed_1st,
                        failedProduct: productFailed_1st,
                    };
                }
                else { // 2nd ตรว Doucment ใน ProductInventory (สินค้าคงคลัง) ตามสาขา
                    const checkProductInventory = miscController.checkProductInventory;

                    let productPassed_2nd = []; // มีข้อมูลสินค้าคงคลังในสาขา
                    let productFailed_2nd = []; // ไม่มีข้อมูลสินค้าคงคลังในสาขา

                    for (let index = 0; index < productPassed_1st.length; index++) {
                        const elementProductInventory = productPassed_1st[index];

                        const findInventoryExists = await checkProductInventory(
                            {
                                _ref_storeid: data._ref_storeid,
                                _ref_branchid: data._ref_branchid,
                                _ref_productid: elementProductInventory._ref_productid,
                                _ref_product_inventoryid: null
                            },
                            (err) => { if (err) { return; } }
                        );

                        if (!findInventoryExists) { productFailed_2nd.push(elementProductInventory); }
                        else {
                            productPassed_2nd.push(elementProductInventory);
                        }
                    }

                    let productPassed_3rd = productPassed_2nd;
                    let productFailed_3rd = [];

                    let productPassed_newDocument_3rd = [];

                    if (productFailed_2nd.length != 0) { // 3rd สร้าง Inventory Document ตาม _ref_productid ที่ไม่มีข้อมูลสินค้าคงคลังในสาขา

                        for (let index = 0; index < productFailed_2nd.length; index++) {
                            const elementNewProductInventory = productFailed_2nd[index];

                            const mapNewProductInventory = {
                                _ref_productid: elementNewProductInventory._ref_productid, // ชื่อ-รหัสสินค้า Ref. OjectId จาก "_id" ของ m_product <ProductModel.js>
                                _ref_storeid: chkAgentAdminId_StoreBranch._storeid, // ชื่อ-รหัสร้าน Ref. ObjectId จาก "_id" ของ m_stores <StoreModel.js>
                                _ref_branchid: chkAgentAdminId_StoreBranch._branchid, // ชื่อ-รหัสสาขา Ref. ObjectId จาก "branch._id" ของ m_stores <StoreModel.js>
                                modify_recent_date: currentDateTime.currentDateTime_Object, // วันที่ และเวลาที่แก้ไขเอกสารล่าสุด (Date/Time)
                                modify_recent_date_string: currentDateTime.currentDate_String,// วันที่แก้ไขเอกสารล่าสุด (String)
                                modify_recent_time_string: currentDateTime.currentTime_String, // เวลาที่แก้ไขเอกสารล่าสุด (String)
                                _ref_agent_userid_modify_recent: chkAgentAdminId_StoreBranch._agentid, // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
                                _ref_agent_userstoreid_modify_recent: chkAgentAdminId_StoreBranch._agentstoreid, // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>
                                isused: true, // ปิดการใช้งาน
                                istruncated: false, // โดนยกเลิก โดย Imd
                                product_inventory_count: 0, // จำนวนสินค้าคงเหลือ
                                product_price: 0, // ราคาสินค้าปัจจุบัน
                            };

                            const mapNewProductInventoryModel = new inventoryModel(mapNewProductInventory);
                            const transactionNewProductInventorySave = await mapNewProductInventoryModel.save().then(result => (result)).catch(err => { if (err) { return; } });

                            if (!transactionNewProductInventorySave) { productFailed_3rd.push(elementNewProductInventory); }
                            else {
                                productPassed_3rd.push(elementNewProductInventory);
                                productPassed_newDocument_3rd.push(transactionNewProductInventorySave);
                            }
                        }
                    }

                    if (productFailed_3rd.length != 0) { // เรียกคืน (Rollback) Inventory Document ที่ได้สร้างไว้
                        for (let index = 0; index < productPassed_newDocument_3rd.length; index++) {
                            const elementPassedNewDocument = productPassed_newDocument_3rd[index];

                            await inventoryModel.findByIdAndDelete(elementPassedNewDocument._id).then(result => (result)).catch(err => { if (err) { return; } });
                        }

                        callback(new Error(`${controllerName}: 3rd Process Data Prepare failed`));
                        return {
                            passedProduct: productPassed_3rd,
                            failedProduct: productFailed_3rd,
                        };
                    }
                    else { // 4th Re-Validate ProductInventory Id
                        let productPassed_4th = productPassed_3rd;
                        let productFailed_4th = [];

                        let productInventoryIdPassed_4th = [];

                        for (let index = 0; index < productPassed_4th.length; index++) {
                            const elementReFindInventory = productPassed_4th[index];

                            const findInventoryExists_4th = await checkProductInventory(
                                {
                                    _ref_storeid: data._ref_storeid,
                                    _ref_branchid: data._ref_branchid,
                                    _ref_productid: elementReFindInventory._ref_productid,
                                    _ref_product_inventoryid: null
                                },
                                (err) => { if (err) { return; } }
                            );

                            if (!findInventoryExists_4th) { productFailed_4th.push(elementReFindInventory); }
                            else {
                                productInventoryIdPassed_4th.push(findInventoryExists_4th);
                            }
                        }

                        if (productFailed_4th.length != 0) {
                            callback(new Error(`${controllerName}: 4th Process Data Prepare failed`));
                            return {
                                passedProduct: productPassed_4th.filter(where => (productFailed_4th.filter(where2 => (where2._ref_productid === where._ref_productid)).length === 1)),
                                failedProduct: productFailed_4th,
                            };
                        }
                        else { // 5th Update Inventory
                            let productPassed_5th = [];
                            let productFailed_5th = [];

                            let productInventoryIdPassed_5th = [];

                            for (let index = 0; index < productInventoryIdPassed_4th.length; index++) {
                                const elementUpdateProductInventory = productInventoryIdPassed_4th[index];

                                let Retry_Count = 0;
                                const Retry_Max = 10;
                                while (Retry_Count <= 10) {
                                    Retry_Count++;

                                    let findProductInventory = await inventoryModel.findById(
                                        elementUpdateProductInventory._ref_product_inventoryid,
                                        (err) => { if (err) { return; } }
                                    );

                                    if (!findProductInventory) {
                                        productFailed_5th.push(productPassed_4th.filter(where => (where._ref_productid === elementUpdateProductInventory._ref_productid))[0]);
                                        break;
                                    }
                                    else {
                                        findProductInventory.product_inventory_count = findProductInventory.product_inventory_count + productPassed_4th.filter(where => (where._ref_productid === elementUpdateProductInventory._ref_productid))[0].inventoryimport_count;

                                        const updateProductInventoryResult = await findProductInventory.save().then(result => (result)).catch(err => { if (err) { return; } });

                                        if (!updateProductInventoryResult) { continue; }
                                        else { // Passed 5th
                                            productInventoryIdPassed_5th.push(updateProductInventoryResult);
                                            productPassed_5th.push(productPassed_4th.filter(where => (where._ref_productid === elementUpdateProductInventory._ref_productid))[0]);
                                            break;
                                        }
                                    }
                                }

                                if (Retry_Count > 10) {
                                    productFailed_5th.push(productPassed_4th.filter(where => (where._ref_productid === elementUpdateProductInventory._ref_productid))[0]);
                                }
                            }

                            if (productFailed_5th.length != 0) { // Rollback ProductInventory Update 5th
                                for (let index = 0; index < productInventoryIdPassed_5th.length; index++) {
                                    let elementRollback = productInventoryIdPassed_5th[index];

                                    let Retry_Count = 0;
                                    const Retry_Max = 10;
                                    while (Retry_Count <= 10) {
                                        Retry_Count++;

                                        let findProductInventory = await inventoryModel.findById(
                                            elementRollback._id,
                                            (err) => { if (err) { return; } }
                                        );

                                        if (!findProductInventory) { continue; }
                                        else {
                                            findProductInventory.product_inventory_count = findProductInventory.product_inventory_count + productPassed_4th.filter(where => (where._ref_productid === elementRollback._ref_productid))[0].inventoryimport_count;

                                            await findProductInventory.save().then(result => (result)).catch(err => { if (err) { return; } });
                                        }
                                    }
                                }

                                callback(new Error(`${controllerName}: 5th Process Data Update failed`));
                                return {
                                    passedProduct: productPassed_5th,
                                    failedProduct: productFailed_5th,
                                };
                            }
                            else { // 6th Create ProductInventoryImport Transacion Document
                                const inventoryImportModel = mongodbController.inventoryImportModel;

                                let productPassed_6th = [];
                                let productFailed_6th = [];

                                let productInventoryImportDocumentPassed_6th = [];

                                for (let index = 0; index < productInventoryIdPassed_5th.length; index++) {
                                    const elementCreateProductInventoryImport = productInventoryIdPassed_5th[index];

                                    const currentProduct = productPassed_5th.filter(where => (where._ref_productid === elementCreateProductInventoryImport._ref_productid.toString()))[0];

                                    const mapProductInventoryImportSave = {
                                        _ref_productid: elementCreateProductInventoryImport._ref_productid, // ชื่อ-รหัสสินค้า Ref. OjectId จาก "_id" ของ m_product <ProductModel.js>
                                        _ref_storeid: elementCreateProductInventoryImport._ref_storeid, // ชื่อ-รหัสร้าน Ref. ObjectId จาก "_id" ของ m_stores <StoreModel.js>
                                        _ref_branchid: elementCreateProductInventoryImport._ref_branchid, // ชื่อ-รหัสสาขา Ref. ObjectId จาก "branch._id" ของ m_stores <StoreModel.js>
                                        _ref_vendorid: null, // ชื่อ-รหัสผู้จำหน่าย Ref. ObjectId จาก "_id" ของ m_vendor <Product_VendorModel.js>
                                        create_date: currentDateTime.currentDateTime_Object, // วันที่ และเวลาที่สร้างเอกสาร (Date/Time)
                                        create_date_string: currentDateTime.currentDate_String, // วันที่สร้างเอกสาร (String)
                                        create_time_string: currentDateTime.currentTime_String, // เวลาที่สร้างเอกสาร (String)
                                        _ref_agent_userid_create: chkAgentAdminId_StoreBranch._agentid, // ชื่อ-รหัสผู้ที่สร้างเอกสาร <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
                                        _ref_agent_userstoreid_create: chkAgentAdminId_StoreBranch._agentstoreid, // ชื่อ-รหัสผู้ที่สร้างเอกสาร <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>
                                        modify_recent_date: currentDateTime.currentDateTime_Object, // วันที่ และเวลาที่แก้ไขเอกสารล่าสุด (Date/Time)
                                        modify_recent_date_string: currentDateTime.currentDate_String,// วันที่แก้ไขเอกสารล่าสุด (String)
                                        modify_recent_time_string: currentDateTime.currentTime_String, // เวลาที่แก้ไขเอกสารล่าสุด (String)
                                        _ref_agent_userid_modify_recent: chkAgentAdminId_StoreBranch._agentid, // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
                                        _ref_agent_userstoreid_modify_recent: chkAgentAdminId_StoreBranch._agentstoreid, // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>
                                        import_date: import_DateTime, // วันที่ และเวลาที่ซื้อ (Date/Time)
                                        import_date_string: import_Date_String, // วันที่ซื้อ (String)
                                        import_time_string: import_Time_String, // เวลาที่ซื้อ (String)
                                        _ref_agent_userid_import: (chkImportAgentId === null) ? null:chkImportAgentId._agentid, // ชื่อ-รหัสผู้ที่ซื้อ <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
                                        _ref_agent_userstoreid_import: (chkImportAgentId === null) ? null:chkImportAgentId._agentstoreid, // ชื่อ-รหัสผู้ที่ซื้อ <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>
                                        run_number_inventoryimport: null, // Running Number ของเอกสารนี้ นับ 1 เมื่อ _storeid, _branchid ซ้ำกัน Ref. <AutoIncrementProductStoreModel.js>, <AutoIncrementProductStoreRunnerModel.js>
                                        run_number_inventoryimport_customize: data.run_number_inventoryimport_customize, // เลขที่เองสารกำหนดเอง
                                        run_number_inventoryimport_ref: data.run_number_inventoryimport_ref, // เลขที่เอกสารอ้างอิง
                                        isused: false, // ปิดการใช้งาน
                                        istruncated: false, // โดนยกเลิก โดย Imd
                                        inventoryimport_count: currentProduct.inventoryimport_count, // จำนวนสินค้านำเข้า
                                        inventoryimport_price: currentProduct.inventoryimport_price, // ราคาสินค้านำเข้า
                                        inventoryimport_price_total: currentProduct.inventoryimport_count * currentProduct.inventoryimport_price, // ราคาสินค้านำเข้าทั้งหมด
                                    };
                                    
                                    const productInventoryImportSaveModel = new inventoryImportModel(mapProductInventoryImportSave);
                                    const transactionProductInventoryImportSave = await productInventoryImportSaveModel.save().then(result => (result)).catch(err => { if (err) { return; } });

                                    if (!transactionProductInventoryImportSave) { productFailed_6th.push(currentProduct); }
                                    else {
                                        productPassed_6th.push(currentProduct);
                                        productInventoryImportDocumentPassed_6th.push(transactionProductInventoryImportSave);
                                    }
                                }

                                if (productFailed_6th.length != 0) {
                                    for (let index = 0; index < productInventoryIdPassed_5th.length; index++) {
                                        const elementRollbackProductInventory = productInventoryIdPassed_5th[index];

                                        let Retry_Count = 0;
                                        const Retry_Max = 10;
                                        while (Retry_Count <= Retry_Max) {
                                            Retry_Count++;

                                            let findProductInventory = await inventoryModel.findById(elementRollbackProductInventory._id, (err) => { if (err) { return; } });

                                            if (!findProductInventory) { continue; }
                                            else {
                                                findProductInventory.product_inventory_count = findProductInventory.product_inventory_count - productPassed_5th.filter(where => (where._ref_productid === findProductInventory._ref_productid))[0].inventoryimport_count;

                                                await findProductInventory.save().then(result => (result)).catch(err => { if (err) { return; } });
                                            }
                                        }
                                        
                                    }

                                    for (let index = 0; index < productInventoryImportDocumentPassed_6th.length; index++) {
                                        const elementRollbackImportDocument = productInventoryImportDocumentPassed_6th[index];
                                        
                                        await inventoryImportModel.findByIdAndDelete(elementRollbackImportDocument._id, (err) => { if (err) { return; } });
                                    }

                                    callback(new Error(`${controllerName}: 6th Process Data Save failed`));
                                    return {
                                        passedProduct: productPassed_6th,
                                        failedProduct: productFailed_6th,
                                    };
                                }
                                else {
                                    callback(null);
                                    return {
                                        passedProduct: productPassed_6th,
                                        failedProduct: productFailed_6th,
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = productInventoryImport_Save_Controller;