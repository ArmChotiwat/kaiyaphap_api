/**
 * Controller สำหรับ บันทึก-ปรับ ราคาสินค้าปัจจุบัน ตามสาขา
 */
const productInventoryPrice_Save_Controller = async (
    data = {
        _ref_storeid: String(''),
        _ref_branchid: String(''),
        _ref_agentid: String(''),
        run_number_inventoryimport_customize: String(''),
        run_number_inventoryimport_ref: String(''),
        _ref_productid: String(''),
        product_price: Number(''),
    },
    callback = (err = new Error) => { }) => {
    const miscController = require('../../miscController');

    if (
        typeof data._ref_branchid != 'string' || !miscController.validateObjectId(data._ref_branchid) ||
        typeof data._ref_storeid != 'string' || !miscController.validateObjectId(data._ref_storeid) ||
        !(await miscController.checkStoreBranch({ _storeid: data._ref_storeid, _branchid: data._ref_branchid }, (err) => { if (err) { callback(err); return; } })) ||
        typeof data._ref_agentid != 'string' || !miscController.validateObjectId(data._ref_agentid) ||
        !miscController.validate_StringOrNull_AndNotEmpty(data.run_number_inventoryimport_customize) ||
        !miscController.validate_StringOrNull_AndNotEmpty(data.run_number_inventoryimport_ref) ||
        typeof data._ref_productid != 'string' || !miscController.validateObjectId(data._ref_productid) ||
        typeof data.product_price != 'number' || data.product_price < 0
    ) {
        callback(new Error('productSavePrice_Controller: data Error'));
        return;
    }
    else {
        const chkAgentAdminId_StoreBranch = await miscController.checkAgentAdminId_StoreBranch(
            {
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid,
                _agentid: data._ref_agentid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgentAdminId_StoreBranch) { callback(new Error(`productSavePrice_Controller: chkAgentAdminId_StoreBranch return not found`)); return; }
        else {
            const chkProductInventory = await miscController.checkProductInventory(
                {
                    _ref_storeid: data._ref_storeid,
                    _ref_branchid: data._ref_branchid,
                    _ref_product_inventoryid: null,
                    _ref_productid: data._ref_productid
                },
                (err) => { if (err) { callback(err); return; } }
            );

            if (!chkProductInventory) { callback(new Error(`chkProductInventory: chkProductInventoryPrice return not found`)); return; }
            else {
                const mongodbController = require('../../mongodbController');
                const checkObjectId = mongodbController.checkObjectId;


                const create_date = miscController.currentDateTime();

                const _ref_productid = await checkObjectId(data._ref_productid, (err) => { if (err) { callback(err); return; } });
                const _ref_branchid = await checkObjectId(data._ref_branchid, (err) => { if (err) { callback(err); return; } });
                const _ref_storeid = await checkObjectId(data._ref_storeid, (err) => { if (err) { callback(err); return; } });

                let mapDataProduct = null;
                try {
                    mapDataProduct = {
                        _ref_productid: _ref_productid,
                        _ref_storeid: _ref_storeid,
                        _ref_branchid: _ref_branchid,

                        create_date: create_date.currentDateTime_Object,
                        create_date_string: create_date.currentDate_String,
                        create_time_string: create_date.currentTime_String,
                        _ref_agent_userid_create: chkAgentAdminId_StoreBranch._agentid,
                        _ref_agent_userstoreid_create: chkAgentAdminId_StoreBranch._agentstoreid,

                        run_number_inventoryimport: null,
                        run_number_inventoryimport_customize: data.run_number_inventoryimport_customize, // chackString('run_number_inventoryimport_customize', data.run_number_inventoryimport_customize),
                        run_number_inventoryimport_ref: data.run_number_inventoryimport_ref, // chackString('run_number_inventoryimport_ref', data.run_number_inventoryimport_ref),
                        isused: false,
                        istruncated: false,
                        product_price: data.product_price, // chack_product_price('product_price', data.product_price),
                    }
                } catch (error) {
                    callback(error);
                    return;
                }

                if (!mapDataProduct) { callback(new Error(`productSavePrice_Controller : not found mapproductSavePriccontroller Variable`)); return; }
                else {
                    const productInventoryPriceModel = require('../../mongodbController').productInventoryPriceModel;
                    const mapProductInventoryPriceModel = new productInventoryPriceModel(mapDataProduct);

                    const transactionSave = await mapProductInventoryPriceModel.save().then(result => (result)).catch(err => { callback(err); return; });
                    if (!transactionSave) {
                        callback(new Error(`productSavePrice_Controller : can't save mapproductSavePriccontroller`));
                        return;
                    }
                    else {
                        const ToAutoincrement = await productInventoryPriceModel.findOne(
                            {
                                '_id': transactionSave._id
                            },
                            (err) => { if (err) { callback(err); return; } }
                        );

                        if (!ToAutoincrement) {
                            await productInventoryPriceModel.deleteOne({ '_id': transactionSave._id }, (err) => { if (err) { callback(err); return; } });
                            callback(new Error(`productSavePrice_Controller : not match in data ProducPrice for AutoIncrementProducPrice`));
                            return;
                        }
                        else {
                            const AutoIncrementProductPrice = require('./AutoIncrementProductPrice').AutoIncrementProductPrice;

                            const aiCaseStore = await AutoIncrementProductPrice(
                                {
                                    _productid: mapDataProduct._ref_productid.toString(),
                                    _storeid: mapDataProduct._ref_storeid.toString(),
                                    _branchid: mapDataProduct._ref_branchid.toString(),
                                    data2: ToAutoincrement
                                },
                                (err) => { callback(err); return; }
                            );

                            if (!aiCaseStore) {
                                await productInventoryPriceModel.deleteOne({ '_id': transactionSave._id }, (err) => { if (err) { callback(err); return; } });
                                callback(new Error(`productSavePrice_Controller : aiCaseStore failed`));
                                return;
                            }
                            else {
                                const inventoryModel = mongodbController.inventoryModel;

                                let i = 1;
                                while (i <= 10) {
                                    i++;

                                    let Updata_product_price = await inventoryModel.findOne(
                                        {
                                            '_id': chkProductInventory._ref_product_inventoryid
                                        },
                                        (err) => { if (err) callback(err); return; }
                                    );

                                    if (!Updata_product_price) { await productInventoryPriceModel.deleteOne({ '_id': transactionSave._id }, (err) => { if (err) { callback(err); return; } }); callback(new Error(`productSavePrice_Controller: Updata_product_price return not found`)); return; }
                                    else {
                                        Updata_product_price.product_price = data.product_price;
                                        Updata_product_price.modify_recent_date = create_date.currentDateTime_Object;
                                        Updata_product_price.modify_recent_date_string = create_date.currentDate_String;
                                        Updata_product_price.modify_recent_time_string = create_date.currentTime_String;
                                        Updata_product_price._ref_agent_userid_modify_recent = chkAgentAdminId_StoreBranch._agentid;
                                        Updata_product_price._ref_agent_userstoreid_modify_recent = chkAgentAdminId_StoreBranch._agentstoreid;

                                        const updateResult = await Updata_product_price.save().then(result => (result)).catch(err => { return; });

                                        if (!updateResult) { continue; }
                                        else {
                                            callback(null);
                                            return updateResult; // Sucessfull
                                        }
                                    }
                                }

                                await productInventoryPriceModel.deleteOne({ '_id': transactionSave._id }, (err) => { if (err) { callback(err); return; } });
                                callback(new Error(`productSavePrice_Controller: updateResult failed or server is busy`));
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = productInventoryPrice_Save_Controller;