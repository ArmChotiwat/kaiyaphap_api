/**
 * เป็น Sub Controller ใช้กับ Controller productInventoryDecrese_Save
 * เพื่อ ยืนยันสินค้าคงคลัง ในสาขา
 */
const productInventoryDecrese_Validate = async (
    data = {
        _ref_productid: new String(''),
        product_inventory_price: -1,      
        _ref_storeid: new String(''),
        _ref_branchid: new String(''),
        _ref_agentid: new String(''),
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');

    if (typeof data != 'object') { callback(new Error(`productInventoryDecrese: data must be Object`)); return; }
    else if (typeof data._ref_productid != 'string' || data._ref_productid == '') { callback(new Error(`productInventoryDecrese: data._ref_productid must be String ObjectId Or null`)); return; }
    else if (!miscController.validateObjectId(data._ref_productid)) { callback(new Error(`productInventoryDecrese: data._ref_productid Validate ObjectId return false`)); return; }
    else if (typeof data.product_inventory_price != 'number' || data.product_inventory_price < 0) { callback(new Error(`productInventoryDecrese: data.product_inventory_price must be Number and `)); return; }
    else if (typeof data._ref_agentid != 'string' || data._ref_agentid == '') { callback(new Error(`productInventoryDecrese: data._ref_agentid must be String ObjectId Or null`)); return; }
    else if (!miscController.validateObjectId(data._ref_agentid)) { callback(new Error(`productInventoryDecrese: data._ref_agentid Validate ObjectId return false`)); return; }
    else if (typeof data._ref_storeid != 'string' || data._ref_storeid == '') { callback(new Error(`productInventoryDecrese: data._ref_storeid must be String ObjectId and Not Empty`)); return; }
    else if (!miscController.validateObjectId(data._ref_storeid)) { callback(new Error(`productInventoryDecrese: data._ref_storeid Validate ObjectId return false`)); return; }
    else if (typeof data._ref_branchid != 'string' || data._ref_branchid == '') { callback(new Error(`productInventoryDecrese: data._ref_branchid must be String ObjectId and Not Empty`)); return; }
    else if (!miscController.validateObjectId(data._ref_branchid)) { callback(new Error(`productInventoryDecrese: data._ref_branchid Validate ObjectId return false`)); return; }
    else {
        const chkAgentId = await miscController.checkAgentId(
            {
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid,
                _agentid: data._ref_agentid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgentId) { callback(new Error(`productInventoryDecrese: AdminId: ${data._ref_agentid} In Store: ${data._ref_storeid} At Branch: ${data._ref_branchid} is not found`)); return; }
        else {
            const _ref_storeid = await miscController.checkObjectId(data._ref_storeid, (err) => { if (err) { callback(err); return; } });
            const _ref_branchid = await miscController.checkObjectId(data._ref_branchid, (err) => { if (err) { callback(err); return; } });
            const _ref_productid = await miscController.checkObjectId(data._ref_productid, (err) => { if (err) { callback(err); return; } });

            const mongodbController = require('../../mongodbController');
            const productModel = mongodbController.productModel;
            const findProduct = await productModel.findOne(
                {
                    '_id': _ref_productid,
                    '_ref_storeid': _ref_storeid,
                },
                {},
                (err) => { callback(err); return; }
            );

            if (!findProduct) { callback(new Error(`productInventoryDecrese: ProductId: ${data._ref_productid} In Store: ${data._ref_storeid} is not found`)); return; }
            else {
                const inventoryModel = mongodbController.inventoryModel;
                const findProductInventory = await inventoryModel.findOne(
                    {
                        '_ref_productid': _ref_productid,
                        '_ref_storeid': _ref_storeid,
                        '_ref_branchid': _ref_branchid,
                        'product_price': data.product_inventory_price,
                    },
                    {},
                    (err) => { callback(err); return; }
                );

                if (!findProductInventory) { callback(new Error(`productInventoryDecrese: Inventory ProductId: ${data._ref_productid} In Store: ${data._ref_storeid} is not found`)); return; }
                else {
                    callback(null);
                    return {
                        _ref_productid: String(data._ref_productid),
                        _ref_product_inventoryid: String(findProductInventory._id),
                        product_inventory_price: Number(data.product_inventory_price),
                    };
                }
            }
        }
    }
};

/**
 * เป๋น Sub Controller ใช้กับ Controller productInventoryDecrese_Save
 * เพื่อ ปรับ Stock ในสินค้าคงคลัง หากสินค้าใดผิดพลาด จะ Rollback สินค้าที่ Update คืนให้
 */
const productInventoryDecrese_Update = async (
    data = [
        {
            _ref_productid: String(''),
            _ref_product_inventoryid: String(''),
            product_inventory_price: Number(0),
            _product_inventory_decrese_count: Number(0),
        }
    ],
    callback = (err = new Error) => {}
) => {
    if(typeof data != 'object' || data.length < 1) { callback(new Error(`productInventoryDecrese_Update: data must be Array and length more than 0`)); return; }
    else {
        const validateObjectId = require('../../miscController').validateObjectId;
        const inventoryModel = require('../../mongodbController').inventoryModel;

        let updatedInventoryId = []; // มี Inventory และมีการปรับลด เรียบร้อยแล้ว
        let failedInventoryId = []; // Inventory มีปัญหา
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (typeof element._ref_product_inventoryid != 'string' || !validateObjectId(element._ref_product_inventoryid)) { failedInventoryId.push(element); break; }
            else if (typeof element._product_inventory_decrese_count != 'number' || element._product_inventory_decrese_count <= 0) { failedInventoryId.push(element); break; }
            else { // Update Process
                let Retry_Count = 0;
                const Retry_Max = 10;
                while (Retry_Count < Retry_Max && failedInventoryId.length === 0) {
                    Retry_Count = Retry_Count + 1;

                    let findInventory = await inventoryModel.findOne(
                        {
                            '_id': element._ref_product_inventoryid
                        },
                        {},
                        (err) => { if(err) { return; } }
                    );
    
                    if(!findInventory) { failedInventoryId.push(element); break; }
                    else {
                        if(findInventory.product_inventory_count < element._product_inventory_decrese_count) { failedInventoryId.push(element); break; } // Current Stock must more than Or Equal Req Decrese Stock
                        else {
                            findInventory.product_inventory_count = findInventory.product_inventory_count - element._product_inventory_decrese_count;

                            const updateResult = await findInventory.save().then(result => (result)).catch(err => { if(err) { return; } });

                            if(!updateResult) { continue; }
                            else { updatedInventoryId.push(element); break; }
                        }
                    }
                }

                if(Retry_Count >= Retry_Max) { failedInventoryId.push(element); break; }
                else if (failedInventoryId.length != 0) { break; }
                else { continue; }
            }
        }

        if(failedInventoryId.length != 0 && updatedInventoryId.length != 0) { // Rollback All Updated Inventory Stock if Some Inventory have update failed
            for (let index = 0; index < updatedInventoryId.length; index++) {
                const element = updatedInventoryId[index];

                let Retry_Count = 0;
                const Retry_Max = 10;
                while (Retry_Count < Retry_Max) {
                    let findInventory = await inventoryModel.findOne(
                        {
                            '_id': element._ref_product_inventoryid,
                        },
                        {},
                        (err) => { if(err) { return; } }
                    );

                    if(!findInventory) { continue; }
                    else {
                        findInventory.product_inventory_count = findInventory.product_inventory_count + element._product_inventory_decrese_count;

                        const updateResult = await findInventory.save().then(result => (result)).catch(err => { if(err) { return; } });

                        if(!updateResult) { continue; }
                        else { break; }
                    }
                }
            }

            callback(new Error(`productInventoryDecrese_Update: some product have error please check your product`));
            return { updatedInventoryId, failedInventoryId };
        }
        else {
            callback(null);
            return { updatedInventoryId, failedInventoryId };
        }
    }
};

/**
 * Controller สำหรับ การตัด Stock ของ สินค้าคงคลัง
 * หากสินค้าใดผิดพลาด จะ Rollback สินค้าที่ Update คืนให้
 * สามารถใช้กับ Agent id ตามสาขา
 */
const productInventoryDecrese_Save = async (
    data = {
        _ref_storeid: String(''),
        _ref_branchid: String(''),
        _ref_agentid: String(''),
        product: [
            {
                _ref_productid: String(''),
                product_inventory_price: Number(-1),
                _product_inventory_decrese_count: Number(0),
            },
        ],
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');

    if (typeof data != 'object') { callback(new Error(`productInventoryDecrese_Save: data must be Object`)); return; }
    else if (typeof data._ref_agentid != 'string' || !miscController.validateObjectId(data._ref_agentid)) { callback(new Error(`productInventoryDecrese_Save: data._ref_agentid must be String ObjectId and Not Empty`)); return; }
    else if (typeof data._ref_storeid != 'string' || !miscController.validateObjectId(data._ref_storeid)) { callback(new Error(`productInventoryDecrese_Save: data._ref_storeid must be String ObjectId and Not Empty`)); return; }
    else if (typeof data._ref_branchid != 'string' || !miscController.validateObjectId(data._ref_branchid)) { callback(new Error(`productInventoryDecrese_Save: data._ref_branchid must be String ObjectId and Not Empty`)); return; }
    else if (typeof data.product != 'object' || data.product.length < 1) { callback(new Error(`productInventoryDecrese_Save: data.product must be Array and Length more than 0`)); return; }
    else {
        let passedValidatData = [];
        let failedValidateData = [];

        for (let index = 0; index < data.product.length; index++) {
            const element = data.product[index];
            
            if(typeof element._ref_productid != 'string' || !miscController.validateObjectId(element._ref_productid)) { callback(new Error(`productInventoryDecrese_Save: data.product[${index}]._ref_productid => ${element._ref_productid} must be String ObjectId and Not Empty`)); return; }
            else if (typeof element._product_inventory_decrese_count != 'number' || element._product_inventory_decrese_count < 0) { callback(new Error(`productInventoryDecrese_Save: data.product[${index}]._product_inventory_decrese_count => ${element._product_price} must be Number and morethan Or Equal 0`)); return; }
            else if (typeof element.product_inventory_price != 'number' || element.product_inventory_price < 0) { callback(new Error(`productInventoryDecrese_Save: data.product[${index}].product_inventory_price => ${element._product_inventory_decrese_count} must be Number morethan or equal 0`)); return; }
            else {
                const validateProduct = await productInventoryDecrese_Validate(
                    {
                        _ref_productid: element._ref_productid,
                        product_inventory_price: element.product_inventory_price,
                        _ref_storeid: data._ref_storeid,
                        _ref_branchid: data._ref_branchid,
                        _ref_agentid: data._ref_agentid,
                    },
                    (err) => { 
                        if(err) {
                            failedValidateData.push(
                                {
                                    _ref_productid: element._ref_productid,
                                    product_inventory_price: element.product_inventory_price
                                }
                            );
                            return;
                        }
                    }
                );

                if(!validateProduct) {
                    failedValidateData.push(
                        {
                            _ref_productid: element._ref_productid,
                            product_inventory_price: element.product_inventory_price
                        }
                    );
                }
                else {
                    passedValidatData.push(
                        {
                            _ref_productid: validateProduct._ref_productid,
                            _ref_product_inventoryid: validateProduct._ref_product_inventoryid,
                            product_inventory_price: validateProduct.product_inventory_price,
                            _product_inventory_decrese_count: element._product_inventory_decrese_count,
                        }
                    );
                }
            }
        }

        if(passedValidatData.length != data.product.length) { callback(new Error(`productInventoryDecrese_Save: validateProduct Not Match`)); return; }
        else {
            const mapPassedProductData = passedValidatData.map(
                where => (
                    {
                        _ref_productid: where._ref_productid,
                        _ref_product_inventoryid: where._ref_product_inventoryid,
                        product_inventory_price: where.product_inventory_price,
                        _product_inventory_decrese_count: where._product_inventory_decrese_count,
                    }
                )
            );
            const updateResult = await productInventoryDecrese_Update(
                mapPassedProductData,
                (err) => { if(err) { callback(err); return; } }
            );

            if (!updateResult) { callback(`productInventoryDecrese_Save: update stock failed`); return; }
            else if (updateResult.failedInventoryId.length > 0) { callback(`productInventoryDecrese_Save: update some stock have error`); return updateResult; }
            else {
                callback(null);
                return updateResult;
            }
        }
    }
};

module.exports = productInventoryDecrese_Save;