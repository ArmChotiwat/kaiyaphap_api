/**
 * Controller สำหรับใช้ บันทึก สินค้านำเข้า เพื่อนำเข้าสินค้ามาในสินค้าคงคลัง
 */
const productInventory_Save_Controller = async (
    data = {
        _ref_productid: new String(''), // ชื่อ-รหัสสินค้า Ref. ObjectId จาก "_id" ของ m_product <ProductModel.js>
        _ref_storeid: new String(''), // ชื่อ-รหัสร้าน Ref. ObjectId จาก "_id" ของ m_stores <StoreModel.js>
        _ref_branchid: new String(''), // ชื่อ-รหัสสาขา Ref. ObjectId จาก "branch._id" ของ m_stores <StoreModel.js>
        _ref_agent_userid_modify_recent: new String(''), // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
        _ref_agent_userstoreid_modify_recent: new String(''), // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>
        inventoryimport_count: new Number(''), // จำนวนสินค้าคงเหลือ
        modify_date: new Date()
    },
    callback = (err = new Error) => { }) => {
    const mongodbController = require('../../mongodbController');
    const inventoryModel = mongodbController.inventoryModel;

    if (
        typeof data._ref_productid != 'string' || data._ref_productid == '' ||
        typeof data._ref_storeid != 'string' || data._ref_storeid == '' ||
        typeof data._ref_branchid != 'string' || data._ref_branchid == '' ||
        typeof data._ref_agent_userid_modify_recent != 'string' || data._ref_agent_userid_modify_recent == '' ||
        typeof data._ref_agent_userstoreid_modify_recent != 'string' || data._ref_agent_userstoreid_modify_recent == '' ||
        
        typeof data.inventoryimport_count != 'number' || data.inventoryimport_count < 0
    ) {
        callback(new Error('productInventory_Save_Controller: data Error'));
        return;
    } 
    else {
        const checkObjectId = mongodbController.checkObjectId;
        const _ref_productid = await checkObjectId(data._ref_productid, (err) => { if (err) { callback(err); return; } });
        const _ref_storeid = await checkObjectId(data._ref_storeid, (err) => { if (err) { callback(err); return; } });
        const _ref_branchid = await checkObjectId(data._ref_branchid, (err) => { if (err) { callback(err); return; } });
        const _ref_agent_userid_modify_recent = await checkObjectId(data._ref_agent_userid_modify_recent, (err) => { if (err) { callback(err); return; } });
        const _ref_agent_userstoreid_modify_recent = await checkObjectId(data._ref_agent_userstoreid_modify_recent, (err) => { if (err) { callback(err); return; } });

        data.modify_date = (!data.modify_date) ? new Date():data.modify_date

        // const ckackNumber = require('./mapNumberMoreEqueal0AndNull')
        // const chackString = require('./mapStringAndNull');

        // const map_ref = (dataName = '', dataInput = '') => {
        //     if (typeof dataName != 'string' || dataName == '' || dataName == null) {
        //         throw new Error(` dataname ${dataName}: must be String and Not Empty`);
        //     }
        //     if (dataInput != null && dataInput != '') {
        //         if (typeof dataInput == 'string') {
        //             const data = chackString(dataName, dataInput);
        //             return data;
        //         }
        //     } else {
        //         throw new Error(`${dataName}: Not Empty and not null`);
        //     }
        // };
        // const map_number = (dataName = '', dataInput = '') => {
        //     if (typeof dataName != 'string' || dataName == '' || dataName == null) {
        //         throw new Error(` dataname ${dataName}: must be String and Not Empty`);
        //     }
        //     if (dataInput != null && dataInput != '') {
        //         if (typeof dataInput == 'number') {
        //             const data = ckackNumber(dataName, dataInput);
        //             return data;
        //         }
        //     } else {
        //         throw new Error(`${dataName}: Not Empty and not null`);
        //     }
        // };
        // const map_product_inventory_count = () => {
        //     if (typeof data.inventoryimport_count != 'number' || data.inventoryimport_count == '' || data.inventoryimport_count == null) {
        //         callback(new Error(` inventoryimport_count : ${data.inventoryimport_count} must be Number and not emty and not null`))
        //         return;
        //     } else {
        //         return data.inventoryimport_count;
        //     }
        // };
        const moment = require('moment');
        const modify_recent_date = moment(data.modify_date);
        const modify_recent_date_string = modify_recent_date.format('YYYY-MM-DD');
        const modify_recent_time_string = modify_recent_date.format('HH:mm:ss');

        const findInventory = await inventoryModel.findOne(
            {
                '_ref_productid': _ref_productid,
                '_ref_storeid': _ref_storeid,
                '_ref_branchid': _ref_branchid

            }, (err) => { if (err) callback(err); return; }
        );
        if (findInventory) {
            let Retry_Count = 0;
            const Retry_Max = 10
            while (Retry_Count <= Retry_Max) {
                Retry_Count++;

                let Updata_product_inventory_count = await inventoryModel.findOne(
                    {
                        '_id': findInventory._id
                    }, (err) => { if (err) { return; } }
                );

                if (!Updata_product_inventory_count) { callback(new Error(`productInventory_Save_Controller: Updata_product_inventory_count return not found data`)); return; }
                else {
                    Updata_product_inventory_count.product_inventory_count = Updata_product_inventory_count.product_inventory_count + data.inventoryimport_count;

                    Updata_product_inventory_count.modify_recent_date = modify_recent_date; // วันที่ และเวลาที่แก้ไขเอกสารล่าสุด (Date/Time)
                    Updata_product_inventory_count.modify_recent_date_string = modify_recent_date_string;// วันที่แก้ไขเอกสารล่าสุด (String)
                    Updata_product_inventory_count.modify_recent_time_string = modify_recent_time_string; // เวลาที่แก้ไขเอกสารล่าสุด (String)
                    Updata_product_inventory_count._ref_agent_userid_modify_recent = _ref_agent_userid_modify_recent; // map_ref('_ref_agent_userid_modify_recent', data._ref_agent_userid_modify_recent), // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
                    Updata_product_inventory_count._ref_agent_userstoreid_modify_recent = _ref_agent_userstoreid_modify_recent; // map_ref('_ref_agent_userstoreid_modify_recent', data._ref_agent_userstoreid_modify_recent), // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>
                    
                    const updateProductInventoryCountResult = await Updata_product_inventory_count.save().then(result => (result)).catch(err => { if(err) { return; } });

                    if (!updateProductInventoryCountResult) { continue; }
                    else {
                        callback(null);
                        return updateProductInventoryCountResult;
                    }
                }
            }

            if (Retry_Count >= 10) { callback(new Error(`productInventory_Save_Controller: updateProductInventoryCountResult update Stock failed Or server is Busy`)); return; }
        } 
        else {            
            let mapDataInventory = null;
            try {
                mapDataInventory = {
                    _ref_productid: _ref_productid, // map_ref('_ref_productid', data._ref_productid), // ชื่อ-รหัสสินค้า Ref. OjectId จาก "_id" ของ m_product <ProductModel.js>
                    _ref_storeid: _ref_storeid, // map_ref('_ref_storeid', data._ref_storeid), // ชื่อ-รหัสร้าน Ref. ObjectId จาก "_id" ของ m_stores <StoreModel.js>
                    _ref_branchid: _ref_branchid, // map_ref('_ref_branchid', data._ref_branchid), // ชื่อ-รหัสสาขา Ref. ObjectId จาก "branch._id" ของ m_stores <StoreModel.js>
                    modify_recent_date: modify_recent_date, // วันที่ และเวลาที่แก้ไขเอกสารล่าสุด (Date/Time)
                    modify_recent_date_string: modify_recent_date_string,// วันที่แก้ไขเอกสารล่าสุด (String)
                    modify_recent_time_string: modify_recent_time_string, // เวลาที่แก้ไขเอกสารล่าสุด (String)
                    _ref_agent_userid_modify_recent: _ref_agent_userid_modify_recent, // map_ref('_ref_agent_userid_modify_recent', data._ref_agent_userid_modify_recent), // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userid/_agentid> Ref. ObjectId จาก "_id" ของ m_agents <AgentModel.js>
                    _ref_agent_userstoreid_modify_recent: _ref_agent_userstoreid_modify_recent, // map_ref('_ref_agent_userstoreid_modify_recent', data._ref_agent_userstoreid_modify_recent), // ชื่อ-รหัสผู้ที่แก้ไขเอกสารล่าสุด <_userstoreid/_agentstoreid> Ref. ObjectId จาก "store._id" ของ m_agents <AgentModel.js>
                    
                    isused: false, // ปิดการใช้งาน
                    istruncated: false, // โดนยกเลิก โดย Imd
                    
                    product_inventory_count: data.inventoryimport_count, // map_number('inventoryimport_count', data.inventoryimport_count), // จำนวนสินค้าคงเหลือ
                    product_price: 0, // ราคาสินค้าปัจจุบัน
                }
            } catch (error) {
                callback(error);
                return;
            }

            if (mapDataInventory) {
                const inventoryModelSave = new inventoryModel(mapDataInventory);

                const transactionSave = await inventoryModelSave.save().then(result => (result)).catch(err => { callback(err); return; } );

                if (!transactionSave) {
                    callback(new Error(`productInventory_Save_Controller : cannot save product Inventory`));
                    return;
                } 
                else {
                    const ToAutoincrement = await inventoryModel.findOne(
                        {
                            '_id': transactionSave._id
                        },
                        (err) => { if (err) { callback(err); return; } }
                    );
                    if (!ToAutoincrement) {
                        await transactionSave.deleteOne((err) => { if(err) { callback(err); return; } });

                        callback(new Error('productInventory_Save_Controller : not match in data inventory for AutoIncrementInventory'));
                        return;
                    }
                    else {
                        const AutoIncrementInventory = require('./AutoIncrementInventory').AutoIncrementInventory;

                        const aiCaseStore = await AutoIncrementInventory(
                            {
                                _storeid: data._ref_storeid,
                                _branchid: data._ref_branchid,
                                data2: ToAutoincrement
                            },
                            (err) => { callback(err); return; }
                        );

                        if (!aiCaseStore) {
                            await transactionSave.deleteOne((err) => { if(err) { callback(err); return; } });
                            callback(new Error('productInventory_Save_Controller : not match in data inventory for AutoIncrementInventory'));
                            return;
                        }
                        else {
                            callback(null);
                            return transactionSave;
                        }
                    }
                }
            }
            else {
                callback(`productInventory_Save_Controller: new mapDataInventory failed`);
                return;
            }
        }
    }
};

module.exports = productInventory_Save_Controller;