/**
 * 
 * Controller สร้าง MasterData ของสิทธิ์การรักษา ให้สำหรับ Customer Potal (Store/Branch) ใช้งาน
 * 
 */
const treatmentRightsStore_Save_Controller = async (
    data = {
        name: new String(''),
        _agentid: new String(''),
        _storeid: new String(''),
        _branchid: new String(''),
        refactor_name: false
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;

    if (typeof data != 'object') {
        callback(new Error(`treatmentRightsStore_Save_Controller: data must be Object`));
        return;
    }
    else if (typeof data.name != 'string' || data.name == '') {
        callback(new Error(`treatmentRightsStore_Save_Controller: data.name must be String and Not Empty`));
        return;
    }
    else if (typeof data._agentid != 'string' || data._agentid == '') {
        callback(new Error(`treatmentRightsStore_Save_Controller: data._agentid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._agentid)) {
        callback(new Error(`treatmentRightsStore_Save_Controller: data._agentid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._storeid != 'string' || data._storeid == '') {
        callback(new Error(`treatmentRightsStore_Save_Controller: data._storeid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._storeid)) {
        callback(new Error(`treatmentRightsStore_Save_Controller: data._storeid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._branchid != 'string' || data._branchid == '') {
        callback(new Error(`treatmentRightsStore_Save_Controller: data._branchid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._branchid)) {
        callback(new Error(`treatmentRightsStore_Save_Controller: data._branchid Validate ObjectId return false`));
        return;
    }
    else if (typeof data.refactor_name != 'boolean') {
        callback(new Error(`treatmentRightsStore_Save_Controller: data.refactor_name must be Boolean`));
        return;
    }
    else {
        const _storeid = await miscController.checkObjectId(data._storeid.toString(), (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId(data._branchid.toString(), (err) => { if (err) { callback(err); return; } });
        const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if (err) { callback(err); return; } });

        const chkstoreId = await miscController.checkStoreBranch(
            {
                _storeid: _storeid.toString(),
                _branchid: _branchid.toString()
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkstoreId) { callback(new Error(`treatmentRightsStore_Save_Controller: chkstoreId return false`)); return; }
        else {
            const chkAgentId = await miscController.checkAgentAdminId_StoreBranch(
                {
                    _storeid: _storeid.toString(),
                    _branchid: _branchid.toString(),
                    _agentid: _agentid.toString()
                },
                (err) => { if (err) { callback(err); return; } }
            );
            if (!chkAgentId) { callback(new Error(`treatmentRights_Save_Controller: chkAgentId return false`)); return; }
            else {
                const moment = require('moment');

                const create_date = moment();
                const create_date_string = create_date.format('YYYY-MM-DD');
                const create_time_string = create_date.format('HH:mm:ss');

                const modify_date = create_date;
                const modify_date_string = create_date.format('YYYY-MM-DD');
                const modify_time_string = create_date.format('HH:mm:ss');


                const mapData = {

                    name: data.name, // สิทธิการรักษา

                    isused: true, // เปิดใช้งาน
                    istruncated: false, // โดนยกเลิกโดย Imd

                    _ref_storeid: chkAgentId._storeid, // Foreign Key Of <m_store>._id
                    _ref_branchid: chkAgentId._branchid, // Foreign Key Of <m_store>.branch._id

                    _ref_ttreatment_rightid: null, // Foreign Key Of <t_treatment_rights>

                    create_date: create_date,
                    create_date_string: create_date_string,
                    create_time_string: create_time_string,
                    _ref_agent_userid_create: chkAgentId._agentid,
                    _ref_agent_userstoreid_create: chkAgentId._agentstoreid,

                    modify_date: modify_date,
                    modify_date_string: modify_date_string,
                    modify_time_string: modify_time_string,
                    _ref_agent_userid_modify: chkAgentId._agentid,
                    _ref_agent_userstoreid_modify: chkAgentId._agentstoreid,

                };

                const treatmentRightsModel = require('../../mongodbController').treatmentRightsModel;
                const transactionSave = new treatmentRightsModel(mapData);
                const saveResult = await transactionSave.save().then(result => (result)).catch(err => { if (err) { callback(err); return; } });
                if (!saveResult) { return; }
                else {
                    return saveResult;
                }
            }
        }
    }

};



/**
 * 
 * Controller แก้ไข MasterData ของสิทธิ์การรักษา ให้สำหรับ Customer Potal (Store/Branch) ใช้งาน
 * 
 */
const treatmentRightsStore_Edit_Controller = async (
    data = {
        name: new String(''),
        _treatment_rightsid: new String(''),
        _agentid: new String(''),
        _storeid: new String(''),
        _branchid: new String(''),
        refactor_name: false
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;

    if (typeof data != 'object') {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data must be Object`));
        return;
    }
    else if (typeof data.name != 'string' || data.name == '') {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data.name must be String and Not Empty`));
        return;
    }
    else if (typeof data._treatment_rightsid != 'string' || data._treatment_rightsid == '') {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._treatment_rightsid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._treatment_rightsid)) {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._treatment_rightsid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._agentid != 'string' || data._agentid == '') {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._agentid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._agentid)) {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._agentid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._storeid != 'string' || data._storeid == '') {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._storeid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._storeid)) {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._storeid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._branchid != 'string' || data._branchid == '') {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._branchid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._branchid)) {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._branchid Validate ObjectId return false`));
        return;
    }
    else if (typeof data.refactor_name != 'boolean') {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data.refactor_name must be Boolean`));
        return;
    }
    else {
        const _treatment_rightsid = await miscController.checkObjectId(data._treatment_rightsid.toString(), (err) => { if (err) { callback(err); return; } });
        const _storeid = await miscController.checkObjectId(data._storeid.toString(), (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId(data._branchid.toString(), (err) => { if (err) { callback(err); return; } });
        const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if (err) { callback(err); return; } });

        const chkstoreId = await miscController.checkStoreBranch(
            {
                _storeid: _storeid.toString(),
                _branchid: _branchid.toString()
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkstoreId) { callback(new Error(`treatmentRightsStore_Edit_Controller: chkstoreId return false`)); return; }
        else {
            const chkAgentId = await miscController.checkAgentAdminId_StoreBranch(
                {
                    _storeid: _storeid.toString(),
                    _branchid: _branchid.toString(),
                    _agentid: _agentid.toString()
                },
                (err) => { if (err) { callback(err); return; } }
            );
            if (!chkAgentId) { callback(new Error(`treatmentRights_Save_Controller: chkAgentId return false`)); return; }
            else {
                const treatmentRightsModel = require('../../mongodbController').treatmentRightsModel;
                const find_TreatmentRightsModel = await treatmentRightsModel.findOne(
                    {
                        '_id': _treatment_rightsid,
                        '_ref_storeid': _storeid,
                        '_ref_branchid': _branchid
                    },
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!find_TreatmentRightsModel) { callback(new Error(`treatmentRightsStore_Edit_Controller: TreatmentRights not found _id:${data._treatment_rightsid}, _ref_storeid:${data._storeid}, _ref_branchid:${data._branchid}`)); return; }
                else {
                    const retry_count_max = 10;
                    let retry_count = 0;
                    while (retry_count != retry_count_max) {
                        retry_count = retry_count + 1;
                        
                        const moment = require('moment');

                        const create_date = moment();
                        const create_date_string = create_date.format('YYYY-MM-DD');
                        const create_time_string = create_date.format('HH:mm:ss');

                        const modify_date = create_date;
                        const modify_date_string = create_date.format('YYYY-MM-DD');
                        const modify_time_string = create_date.format('HH:mm:ss');


                        // const oldData = find_TreatmentRightsModel;
                        find_TreatmentRightsModel.name = data.name; // สิทธิการรักษา

                        find_TreatmentRightsModel.modify_date = modify_date;
                        find_TreatmentRightsModel.modify_date_string = modify_date_string;
                        find_TreatmentRightsModel.modify_time_string = modify_time_string;
                        find_TreatmentRightsModel._ref_agent_userid_modify = chkAgentId._agentid;
                        find_TreatmentRightsModel._ref_agent_userstoreid_modify = chkAgentId._agentstoreid;

                        const saveResult = await find_TreatmentRightsModel.save().then(result => (result)).catch(err => { if (err) { return; } });
                        if (!saveResult) { continue; }
                        else {
                            retry_count = retry_count_max;
                            callback(null);
                            return saveResult;
                        }
                    }
                }

            }
        }
    }

};



/**
 * 
 * Controller เปิด-ปิด MasterData ของสิทธิ์การรักษา ให้สำหรับ Customer Potal (Store/Branch) ใช้งาน
 * 
 */
const treatmentRightsStore_Disabled_Controller = async (
    data = {
        _treatment_rightsid: new String(''),
        _agentid: new String(''),
        _storeid: new String(''),
        _branchid: new String('')
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;

    if (typeof data != 'object') {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data must be Object`));
        return;
    }
    else if (typeof data._treatment_rightsid != 'string' || data._treatment_rightsid == '') {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._treatment_rightsid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._treatment_rightsid)) {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._treatment_rightsid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._agentid != 'string' || data._agentid == '') {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._agentid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._agentid)) {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._agentid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._storeid != 'string' || data._storeid == '') {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._storeid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._storeid)) {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._storeid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._branchid != 'string' || data._branchid == '') {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._branchid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._branchid)) {
        callback(new Error(`treatmentRightsStore_Edit_Controller: data._branchid Validate ObjectId return false`));
        return;
    }
    else {
        const _treatment_rightsid = await miscController.checkObjectId(data._treatment_rightsid.toString(), (err) => { if (err) { callback(err); return; } });
        const _storeid = await miscController.checkObjectId(data._storeid.toString(), (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId(data._branchid.toString(), (err) => { if (err) { callback(err); return; } });
        const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if (err) { callback(err); return; } });

        const chkstoreId = await miscController.checkStoreBranch(
            {
                _storeid: _storeid.toString(),
                _branchid: _branchid.toString()
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkstoreId) { callback(new Error(`treatmentRightsStore_Edit_Controller: chkstoreId return false`)); return; }
        else {
            const chkAgentId = await miscController.checkAgentAdminId_StoreBranch(
                {
                    _storeid: _storeid.toString(),
                    _branchid: _branchid.toString(),
                    _agentid: _agentid.toString()
                },
                (err) => { if (err) { callback(err); return; } }
            );
            if (!chkAgentId) { callback(new Error(`treatmentRights_Save_Controller: chkAgentId return false`)); return; }
            else {
                const treatmentRightsModel = require('../../mongodbController').treatmentRightsModel;
                const find_TreatmentRightsModel = await treatmentRightsModel.findOne(
                    {
                        '_id': _treatment_rightsid,
                        '_ref_storeid': _storeid,
                        '_ref_branchid': _branchid
                    },
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!find_TreatmentRightsModel) { callback(new Error(`treatmentRightsStore_Edit_Controller: TreatmentRights not found _id:${data._treatment_rightsid}, _ref_storeid:${data._storeid}, _ref_branchid:${data._branchid}`)); return; }
                else {
                    const retry_count_max = 10;
                    let retry_count = 0;
                    while (retry_count != retry_count_max) {
                        retry_count = retry_count + 1;
                        
                        const moment = require('moment');

                        const create_date = moment();
                        // const create_date_string = create_date.format('YYYY-MM-DD');
                        // const create_time_string = create_date.format('HH:mm:ss');

                        const modify_date = create_date;
                        const modify_date_string = create_date.format('YYYY-MM-DD');
                        const modify_time_string = create_date.format('HH:mm:ss');


                        // const oldData = find_TreatmentRightsModel;

                        find_TreatmentRightsModel.modify_date = modify_date;
                        find_TreatmentRightsModel.modify_date_string = modify_date_string;
                        find_TreatmentRightsModel.modify_time_string = modify_time_string;
                        find_TreatmentRightsModel._ref_agent_userid_modify = chkAgentId._agentid;
                        find_TreatmentRightsModel._ref_agent_userstoreid_modify = chkAgentId._agentstoreid;

                        find_TreatmentRightsModel.isused = !find_TreatmentRightsModel.isused;

                        const saveResult = await find_TreatmentRightsModel.save().then(result => (result)).catch(err => { if (err) { return; } });
                        if (!saveResult) { continue; }
                        else {
                            retry_count = retry_count_max;
                            callback(null);
                            return saveResult;
                        }
                    }
                }

            }
        }
    }

};




/**
 * 
 * Controller ดูข้อมูล MasterData ของสิทธิ์การรักษา ให้สำหรับ Customer Potal (Store/Branch) ใช้งาน
 * 
 */
const treatmentRightsStore_View_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;

    if (typeof data != 'object') {
        callback(new Error(`treatmentRightsStore_View_Controller: data must be Object`));
        return;
    }
    else if (typeof data._agentid != 'string' || data._agentid == '') {
        callback(new Error(`treatmentRightsStore_View_Controller: data._agentid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._agentid)) {
        callback(new Error(`treatmentRightsStore_View_Controller: data._agentid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._storeid != 'string' || data._storeid == '') {
        callback(new Error(`treatmentRightsStore_View_Controller: data._storeid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._storeid)) {
        callback(new Error(`treatmentRightsStore_View_Controller: data._storeid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._branchid != 'string' || data._branchid == '') {
        callback(new Error(`treatmentRightsStore_View_Controller: data._branchid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._branchid)) {
        callback(new Error(`treatmentRightsStore_View_Controller: data._branchid Validate ObjectId return false`));
        return;
    }
    else {
        const _storeid = await miscController.checkObjectId(data._storeid.toString(), (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId(data._branchid.toString(), (err) => { if (err) { callback(err); return; } });
        const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if (err) { callback(err); return; } });

        const chkstoreId = await miscController.checkStoreBranch(
            {
                _storeid: _storeid.toString(),
                _branchid: _branchid.toString()
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkstoreId) { callback(new Error(`treatmentRightsStore_View_Controller: chkstoreId return false`)); return; }
        else {
            const chkAgentId = await miscController.checkAgentId(
                {
                    _storeid: _storeid.toString(),
                    _branchid: _branchid.toString(),
                    _agentid: _agentid.toString()
                },
                (err) => { if (err) { callback(err); return; } }
            );
            if (!chkAgentId) { callback(new Error(`treatmentRightsStore_View_Controller: chkAgentId return false`)); return; }
            else {
                const treatmentRightsModel = require('../../mongodbController').treatmentRightsModel;

                const find_TreatmentRights = await treatmentRightsModel.find(
                    {
                        '_ref_storeid': _storeid,
                        '_ref_branchid': _branchid,
                        'istruncated': false,
                    },
                    {
                        '_id': 1,
                        'name': 1,
                        'isused': 1,
                    },
                    (err) => {
                        if (err) { callback(err); return; }
                    }
                );

                if (!find_TreatmentRights) { callback(new Error(`treatmentRightsStore_View_Controller: Find document have other error`)); return; }
                else {
                    callback(null);
                    return find_TreatmentRights;
                }
            }
        }
    }
};


module.exports = {
    treatmentRightsStore_Save_Controller,
    treatmentRightsStore_Edit_Controller,
    treatmentRightsStore_Disabled_Controller,
    treatmentRightsStore_View_Controller,
};