/**
 * Controller สำหรับ เพิ่ม Product Group (กลุ่ม ของระเบียนสินค้า) Master Data ให้สำหรับ Customer Portal สาขาหลัก
 */
const productGroup_Save_Controller = async (
    data = {
        name: new String(''),
        _storeid: new String(''),
        _agentid: new String(''),
        refector_name: false,
    },
    callback = (err = new Error) => {}
) => {
    const miscController = require('../../miscController');

    if(typeof data != 'object') { callback(new Error(`productGroup_Save_Controller: data must be Object`)); return; }
    else if(typeof data.name != 'string' || data.name == '') { callback(new Error(`productGroup_Save_Controller: data.name must be String and Not Empty`)); return; }
    else if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`productGroup_Save_Controller: data._storeid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._storeid)) { callback(new Error(`productGroup_Save_Controller: data._storeid Validate ObjectId return false`)); return; }
    else if(typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`productGroup_Save_Controller: data._agentid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._agentid)) { callback(new Error(`productGroup_Save_Controller: data._agentid Validate ObjectId return false`)); return; }
    else if(typeof data.refector_name != 'boolean') { callback(new Error(`productGroup_Save_Controller: data.refector_name must be Boolean`)); return; }
    else {
        // const _storeid = await miscController.checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
        // const _agentid = await miscController.checkObjectId(data._agentid, (err) => { if(err) { callback(err); return; } });
        const name = data.name;

        const chkAgentAdmin = await miscController.checkAgentAdminId_StoreBranch(
            {
                _storeid: data._storeid,
                _branchid: data._storeid,
                _agentid: data._agentid
            },
            (err) => { if(err) { callback(err); return; } }
        );

        if(!chkAgentAdmin) { callback(new Error(`productGroup_Save_Controller: chkAgentAdmin return false (not found)`)); return; }
        else {
            const moment = require('moment');
            const create_date = moment();
            const create_date_string = create_date.format('YYYY-MM-DD');
            const create_time_string = create_date.format('HH:mm:ss');

            const modify_recent_date = create_date;
            const modify_recent_date_string = create_date.format('YYYY-MM-DD');
            const modify_recent_time_string = create_date.format('HH:mm:ss');

            const mapData = {
                name: name,

                _ref_storeid: chkAgentAdmin._storeid,
                
                create_date: create_date,
                create_date_string: create_date_string,
                create_time_string: create_time_string,
                _ref_agent_userid_create: chkAgentAdmin._agentid,
                _ref_agent_userstoreid_create: chkAgentAdmin._agentstoreid,

                modify_recent_date: modify_recent_date,
                modify_recent_date_string: modify_recent_date_string,
                modify_recent_time_string: modify_recent_time_string,
                _ref_agent_userid_modify_recent: chkAgentAdmin._agentid,
                _ref_agent_userstoreid_modify_recent: chkAgentAdmin._agentstoreid,

                run_number: null,

                isused: false,
                istruncated: false,
            };

            const productGroupModel = require('../../mongodbController').productGroupModel;
            const transactionSave = new productGroupModel(mapData);
            let saveResult = await transactionSave.save().then(result => (result)).catch(err => { if(err) { callback(err); return; } });

            if(!saveResult) { callback(new Error(`productGroup_Save_Controller: save Document is Error`)); return; }
            else {
                const AutoIncrementProductGroupModel = require('../../mongodbController').AutoIncrementProductGroupModel;
                const transactionAutoIncresement = new AutoIncrementProductGroupModel({_ref_storeid: chkAgentAdmin._storeid});
                const saveAutoIncresementResult = await transactionAutoIncresement.save().then(result => (result)).catch(err => { if(err) { callback(err); return; } });

                if(!saveAutoIncresementResult) {
                    const rollBackResult = await saveResult.deleteOne().then(result => (result)).catch(err => { if(err) { callback(err); return; } });
                    if(!rollBackResult) { callback(new Error(`productGroup_Save_Controller: AutoIncresement Have Error and cannot Rollback Product Group`)); return; }
                    else { callback(`productGroup_Save_Controller: AutoIncresement Have Error (Rollback Document is ok)`); return; }
                }
                else {
                    saveResult.isused = true;
                    saveResult.run_number = saveAutoIncresementResult.seq;

                    const updateResult = await saveResult.save().then(result => (result)).catch(err => { if(err) { callback(err); return; } });
                    if(!updateResult) {
                        const rollBackResult = await saveResult.deleteOne().then(result => (result)).catch(err => { if(err) { callback(err); return; } });
                        if(!rollBackResult) { callback(new Error(`productGroup_Save_Controller: Update Have Error and cannot Rollback Product Group`)); return; }
                        else { callback(`productGroup_Save_Controller: Update Have Error (Rollback Document is ok)`); return; }
                    }
                    else {
                        callback(null);
                        return updateResult;
                    }
                }
            }
        }
    }
};

/**
 * Controller สำหรับ แก้ไข Product Group (กลุ่ม ของระเบียนสินค้า) Master Data ให้สำหรับ Customer Portal สาขาหลัก
 */
const productGroup_Edit_Controller = async (
    data = {
        name: new String(''),
        _product_groupid: new String(''),
        _storeid: new String(''),
        _agentid: new String(''),
        refector_name: false,
    },
    callback = (err = new Error) => {}
) => {
    const miscController = require('../../miscController');

    if(typeof data != 'object') { callback(new Error(`productGroup_Edit_Controller: data must be Object`)); return; }
    else if(typeof data.name != 'string' || data.name == '') { callback(new Error(`productGroup_Edit_Controller: data.name must be String and Not Empty`)); return; }
    else if(typeof data._product_groupid != 'string' || data._product_groupid == '') { callback(new Error(`productGroup_Edit_Controller: data._product_groupid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._product_groupid)) { callback(new Error(`productGroup_Edit_Controller: data._product_groupid Validate ObjectId return false`)); return; }
    else if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`productGroup_Edit_Controller: data._storeid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._storeid)) { callback(new Error(`productGroup_Edit_Controller: data._storeid Validate ObjectId return false`)); return; }
    else if(typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`productGroup_Edit_Controller: data._agentid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._agentid)) { callback(new Error(`productGroup_Edit_Controller: data._agentid Validate ObjectId return false`)); return; }
    else if(typeof data.refector_name != 'boolean') { callback(new Error(`productGroup_Edit_Controller: data.refector_name must be Boolean`)); return; }
    else {
        const _product_groupid = await miscController.checkObjectId(data._product_groupid, (err) => { if(err) { callback(err); return; } });
        const _storeid = await miscController.checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
        const name = data.name;

        const chkAgentAdmin = await miscController.checkAgentAdminId_StoreBranch(
            {
                _storeid: data._storeid,
                _branchid: data._storeid,
                _agentid: data._agentid
            },
            (err) => { if(err) { callback(err); return; } }
        );

        if(!chkAgentAdmin) { callback(new Error(`productGroup_Edit_Controller: chkAgentAdmin return false (not found)`)); return; }
        else {
            const productGroupModel = require('../../mongodbController').productGroupModel;
            let findProductGroup = await productGroupModel.findOne(
                {
                    '_id': _product_groupid,
                    '_ref_storeid': _storeid
                },
                {},
                (err) => { if(err) { callback(err); return; }}
            );

            if(!findProductGroup) { callback(new Error(`productGroup_Edit_Controller: cannot found product group id: ${data._product_groupid} where in ${data._storeid}`)); return; }
            else {
                const moment = require('moment');
                const create_date = moment();
                // const create_date_string = create_date.format('YYYY-MM-DD');
                // const create_time_string = create_date.format('HH:mm:ss');

                const modify_recent_date = create_date;
                const modify_recent_date_string = create_date.format('YYYY-MM-DD');
                const modify_recent_time_string = create_date.format('HH:mm:ss');

                for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {
                    findProductGroup = await productGroupModel.findOne(
                        {
                            '_id': _product_groupid,
                            '_ref_storeid': _storeid
                        },
                        {},
                        (err) => { if(err) { callback(err); return; }}
                    );
                    if(!findProductGroup) { callback(new Error(`productGroup_Edit_Controller: cannot found product group id: ${data._product_groupid} where in ${data._storeid}`)); return; }
                    else {
                        findProductGroup.name = data.name;
                        findProductGroup.modify_recent_date = modify_recent_date;
                        findProductGroup.modify_recent_date_string = modify_recent_date_string;
                        findProductGroup.modify_recent_time_string = modify_recent_time_string;
                        findProductGroup._ref_agent_userid_modify_recent = chkAgentAdmin._agentid;
                        findProductGroup._ref_agent_userstoreid_modify_recent = chkAgentAdmin._agentstoreid;
                        
                        const updateResult = await findProductGroup.save().then(result => (result)).catch(err => { if(err) { callback(err); return; } });
                        if(!updateResult) { continue; }
                        else {
                            callback(null);
                            return updateResult;
                        }
                    }
                }
                
                callback(new Error(`productGroup_Edit_Controller: Have Other Error`));
                return;
            }
        }
    }
};


/**
 * Controller สำหรับ เปิด-ปิด Product Group (กลุ่ม ของระเบียนสินค้า) Master Data ให้สำหรับ Customer Portal สาขาหลัก
 */
const productGroup_Switch_Controller = async (
    data = {
        _product_groupid: new String(''),
        _storeid: new String(''),
        _agentid: new String(''),
    },
    callback = (err = new Error) => {}
) => {
    const miscController = require('../../miscController');

    if(typeof data != 'object') { callback(new Error(`productGroup_Switch_Controller: data must be Object`)); return; }
    else if(typeof data._product_groupid != 'string' || data._product_groupid == '') { callback(new Error(`productGroup_Switch_Controller: data._product_groupid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._product_groupid)) { callback(new Error(`productGroup_Switch_Controller: data._product_groupid Validate ObjectId return false`)); return; }
    else if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`productGroup_Switch_Controller: data._storeid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._storeid)) { callback(new Error(`productGroup_Switch_Controller: data._storeid Validate ObjectId return false`)); return; }
    else if(typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`productGroup_Switch_Controller: data._agentid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._agentid)) { callback(new Error(`productGroup_Switch_Controller: data._agentid Validate ObjectId return false`)); return; }
    else {
        const _product_groupid = await miscController.checkObjectId(data._product_groupid, (err) => { if(err) { callback(err); return; } });
        const _storeid = await miscController.checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });

        const chkAgentAdmin = await miscController.checkAgentAdminId_StoreBranch(
            {
                _storeid: data._storeid,
                _branchid: data._storeid,
                _agentid: data._agentid
            },
            (err) => { if(err) { callback(err); return; } }
        );

        if(!chkAgentAdmin) { callback(new Error(`productGroup_Switch_Controller: chkAgentAdmin return false (not found)`)); return; }
        else {
            const productGroupModel = require('../../mongodbController').productGroupModel;
            let findProductGroup = await productGroupModel.findOne(
                {
                    '_id': _product_groupid,
                    '_ref_storeid': _storeid
                },
                {},
                (err) => { if(err) { callback(err); return; }}
            );

            if(!findProductGroup) { callback(new Error(`productGroup_Switch_Controller: cannot found product group id: ${data._product_groupid} where in ${data._storeid}`)); return; }
            else {
                const moment = require('moment');
                const create_date = moment();
                // const create_date_string = create_date.format('YYYY-MM-DD');
                // const create_time_string = create_date.format('HH:mm:ss');

                const modify_recent_date = create_date;
                const modify_recent_date_string = create_date.format('YYYY-MM-DD');
                const modify_recent_time_string = create_date.format('HH:mm:ss');

                for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {
                    findProductGroup = await productGroupModel.findOne(
                        {
                            '_id': _product_groupid,
                            '_ref_storeid': _storeid
                        },
                        {},
                        (err) => { if(err) { callback(err); return; }}
                    );
                    if(!findProductGroup) { callback(new Error(`productGroup_Switch_Controller: cannot found product group id: ${data._product_groupid} where in ${data._storeid}`)); return; }
                    else {
                        findProductGroup.isused = !findProductGroup.isused;
                        findProductGroup.modify_recent_date = modify_recent_date;
                        findProductGroup.modify_recent_date_string = modify_recent_date_string;
                        findProductGroup.modify_recent_time_string = modify_recent_time_string;
                        findProductGroup._ref_agent_userid_modify_recent = chkAgentAdmin._agentid;
                        findProductGroup._ref_agent_userstoreid_modify_recent = chkAgentAdmin._agentstoreid;
                        
                        const updateResult = await findProductGroup.save().then(result => (result)).catch(err => { if(err) { callback(err); return; } });
                        if(!updateResult) { continue; }
                        else {
                            callback(null);
                            return updateResult;
                        }
                    }
                }
                
                callback(new Error(`productGroup_Switch_Controller: Have Other Error`));
                return;
            }
        }
    }
};


/**
 * Controller สำหรับ เปิด-ปิด Product Group (กลุ่ม ของระเบียนสินค้า) Master Data ให้สำหรับ Customer Portal สาขาหลัก
 */
const productGroup_View_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
    },
    callback = (err = new Error) => {}
) => {
    const miscController = require('../../miscController');

    if(typeof data != 'object') { callback(new Error(`productGroup_View_Controller: data must be Object`)); return; }
    else if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`productGroup_View_Controller: data._storeid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._storeid)) { callback(new Error(`productGroup_View_Controller: data._storeid Validate ObjectId return false`)); return; }
    else if(typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`productGroup_View_Controller: data._branchid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._branchid)) { callback(new Error(`productGroup_View_Controller: data._branchid Validate ObjectId return false`)); return; }
    else if(typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`productGroup_View_Controller: data._agentid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._agentid)) { callback(new Error(`productGroup_View_Controller: data._agentid Validate ObjectId return false`)); return; }
    else {
        const checkAgentId = require('../../miscController').checkAgentId;

        const chkAgentId = await checkAgentId(
            {
                _storeid: data._storeid,
                _branchid: data._branchid,
                _agentid: data._agentid,
            },
            (err) => { if(err) { callback(err); return; } }
        );

        if(!chkAgentId) { callback(new Error('productGroup_View_Controller: chkAgentId return false')); return; }
        else {
            const productGroupModel = require('../../mongodbController').productGroupModel;

            const findResult = await productGroupModel.find(
                {
                    '_ref_storeid': chkAgentId._storeid,
                    'isused': true
                },
                {},
                (err) => { if(err) { callback(err); return; } }
            );

            if(!findResult) { callback(new Error(`productGroup_View_Controller: findResult have Error`)); return; }
            else { callback(null); return findResult; }
        }
    }
};


/**
 * Controller สำหรับ เปิด-ปิด Product Group (กลุ่ม ของระเบียนสินค้า) Master Data ให้สำหรับ Customer Portal สาขาหลัก
 */
const productGroup_ViewAll_Controller = async (
    data = {
        _storeid: '',
        _branchid: '',
        _agentid: '',
    },
    callback = (err = new Error) => {}
) => {
    const miscController = require('../../miscController');

    if(typeof data != 'object') { callback(new Error(`productGroup_View_Controller: data must be Object`)); return; }
    else if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`productGroup_View_Controller: data._storeid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._storeid)) { callback(new Error(`productGroup_View_Controller: data._storeid Validate ObjectId return false`)); return; }
    else if(typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`productGroup_View_Controller: data._branchid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._branchid)) { callback(new Error(`productGroup_View_Controller: data._branchid Validate ObjectId return false`)); return; }
    else if(typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`productGroup_View_Controller: data._agentid must be String ObjectId and Not Empty`)); return; }
    else if(!miscController.validateObjectId(data._agentid)) { callback(new Error(`productGroup_View_Controller: data._agentid Validate ObjectId return false`)); return; }
    else {
        const checkAgentId = require('../../miscController').checkAgentId;

        const chkAgentId = await checkAgentId(
            {
                _storeid: data._storeid,
                _branchid: data._branchid,
                _agentid: data._agentid,
            },
            (err) => { if(err) { callback(err); return; } }
        );

        if(!chkAgentId) { callback(new Error('productGroup_View_Controller: chkAgentId return false')); return; }
        else {
            const productGroupModel = require('../../mongodbController').productGroupModel;

            const findResult = await productGroupModel.find(
                {
                    '_ref_storeid': chkAgentId._storeid
                },
                {},
                (err) => { if(err) { callback(err); return; } }
            );

            if(!findResult) { callback(new Error(`productGroup_View_Controller: findResult have Error`)); return; }
            else { callback(null); return findResult; }
        }
    }
};

module.exports = {
    productGroup_Save_Controller,
    productGroup_Edit_Controller,
    productGroup_Switch_Controller,
    productGroup_View_Controller,
    productGroup_ViewAll_Controller,
};