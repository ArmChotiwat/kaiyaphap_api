/**
 * Controller สำหรับ สร้าง ระเบียนสินค้า
 */
const product_Save_Controller = async (
    data = {
        _storeid: String(''),
        _agentid: String(''),
        product_name: String(''),
        product_serial: String(''),
        product_category: String(''),
        product_brand: String(''),
        product_main_version: String(''),
        product_sub_version: String(''),
        _ref_product_groupid: '',

    },
    callback = (err = new Error) => { }) => {

    const mongodbController = require('../../mongodbController');
    const checkObjectId = mongodbController.checkObjectId;
    const { checkAgentAdminId_StoreBranch } = require('../../miscController');
    const agentModel = mongodbController.agentModel;
    const productModel = mongodbController.productModel;
    const storeModel = mongodbController.storeModel;

    if (
        typeof data._storeid != 'string' || data._storeid == '' ||
        typeof data._agentid != 'string' || data._agentid == '' ||
        typeof data.product_name != 'string' || data.product_name == ''
    ) {
        callback(new Error('data Error'));
        return;
    }
    else {
        const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const _agentid = await checkObjectId(data._agentid, (err) => { if (err) { callback(err); return; } });
        const _ref_product_groupid = (data._ref_product_groupid === null) ?  null : await checkObjectId(data._ref_product_groupid, (err) => { if (err) { callback(err); return; } });

        const chkAgentAdminId_StoreBranch = await checkAgentAdminId_StoreBranch(
            {
                _agentid: data._agentid,
                _storeid: data._storeid,
                _branchid: data._storeid
            },
            (err) => { if(err) callback(err); return; }
        );

        const findProduct = await productModel.findOne({ 'product_name': data.product_name, }, (err) => { if (err) { callback(err); return; } });
        const chackStroeID = await storeModel.findOne({ '_id': data._storeid }, (err) => { if (err) { callback(err); return; } });
        if (!chkAgentAdminId_StoreBranch) {
            callback(new Error(`ProductSaveController: Agent Not Found`));
            return;
        } else if (findProduct != null) {
            callback(new Error(`ProductSaveController: not use Productname : ${data.product_name}`));
            return;
        } else if (!chackStroeID) {
            callback(new Error(`chack StroeID: StroeID Not Found`));
            return;
        } else {

            const cleanData = require('../../miscController').regExReplace_RefactorProductName;
            const chackString = require('./mapStringAndNull');
            let mapDataProduct = null;
            const moment = require('moment');
            const create_date = moment();
            const create_date_string = create_date.format('YYYY-MM-DD');
            const create_time_string = create_date.format('HH:mm:ss');

            const modify_date = create_date;
            const modify_date_string = create_date.format('YYYY-MM-DD');
            const modify_time_string = create_date.format('HH:mm:ss');

            const mapProduct_product_name = () => {
                if (typeof data.product_name == 'string' && data.product_name != '' && data.product_name != null) {
                    const chackProductName = chackString('product_name', data.product_name);
                    if (chackProductName != null) {
                        const product_name = cleanData.RefactorProductName(data.product_name);
                        return product_name.toString();
                    }

                }
                else {
                    throw new Error(`product_name: must be String and Not Empty and not null`);
                }
            };

            const cleanDataProductSerial = () => {
                if (data.product_serial !== null) {
                    let ProductSerial = require('../../miscController/code/regExReplace_RefactorBasic')(data.product_serial);
                    ProductSerial = ProductSerial.replace(new RegExp(/[^A-Z|0-9|\-]|^\-+|\-+$/g), '');
                    ProductSerial = require('../../miscController/code/regExReplace_Refactor_Fontword_backword')(ProductSerial);
                    return ProductSerial;
                }
                else { return null; }
            }

            try {
                mapDataProduct = {
                    _ref_storeid: chkAgentAdminId_StoreBranch._storeid,

                    create_date: create_date,
                    create_date_string: create_date_string,
                    create_time_string: create_time_string,

                    modify_date: modify_date,
                    modify_date_string: modify_date_string,
                    modify_time_string: modify_time_string,
                    
                    _ref_agent_userid_create: chkAgentAdminId_StoreBranch._agentid, // (mapProduct._ref_agent_userid_create, (err) => { if (err) { callback(err); return; } }),
                    _ref_agent_userstoreid_create: chkAgentAdminId_StoreBranch._agentstoreid,

                    _ref_agent_userid_modify: chkAgentAdminId_StoreBranch._agentid,
                    _ref_agent_userstoreid_modify: chkAgentAdminId_StoreBranch._agentstoreid,

                    run_number_product: null,

                    isused: false, // ปิดการใช้งาน required
                    istruncated: false, // โดนยกเลิก โดย Imd required

                    product_name: data.product_name, // mapProduct_product_name(), // ชื่อสินค้า required 
                    product_serial: data.product_serial, // cleanDataProductSerial(), // รหัสสินค้า
                    product_category: data.product_category, // ประเภทสินค้า 
                    product_brand: data.product_brand, // chackString('product_brand', data.product_brand), // ยี่ห้องสินค้า
                    product_main_version: data.product_main_version, // chackString('product_main_version', data.product_main_version), // รุ่นสินค้า
                    product_sub_version: data.product_sub_version, // chackString('product_sub_version', data.product_sub_version), // รุ่นย่อยสินค้า
                    _ref_product_groupid: _ref_product_groupid, // กลุ่มสินค้า ref: <m_product_group._id>
                }

            } catch (error) {
                callback(error);
                return;
            }
            if (mapDataProduct) {
                const mapProductcontroller = mongodbController.productModel;
                const mapProductcontrollers = new mapProductcontroller(mapDataProduct);

                const transactionSave = await mapProductcontrollers.save()
                    .then(
                        result => { return result; }
                    )
                    .catch(
                        err => {
                            callback(err);
                            return;
                        }
                    );
                if (!transactionSave) {
                    callback(`ProductSavePriceController : can't save mapproductSavePriccontroller`);
                    return;
                } else {
                    const ToAutoincrement = await mapProductcontroller.findOne(
                        {
                            '_id': transactionSave._id
                        },
                        (err) => { if (err) { callback(err); return; } }
                    );
                    if (!ToAutoincrement) {
                        callback(' ProductSavePriceController : not match in data Produc for AutoIncrementProduc');
                    } else {
                        const AutoIncrementProduct = require('./AutoIncrementProduct').AutoIncrementProduct;
                        const aiCaseStore = await AutoIncrementProduct(
                            {
                                _storeid: mapDataProduct._ref_storeid.toString(),
                                data2: ToAutoincrement
                            }, (err) => { callback(err); return; });
                    }
                }
                callback(null);
                return transactionSave;
            } else {
                callback(`mapProduct : not found mapDataProduct Variable`);
                return;
            }

        }


    }
};

module.exports = product_Save_Controller;