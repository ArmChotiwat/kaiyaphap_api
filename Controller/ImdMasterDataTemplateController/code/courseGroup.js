/**
 * 
 * Controller สร้าง MasterData ของ Course/Package Group ให้สำหรับ IMD Potal ใช้งาน
 * 
 */
const template_CourseGroup_Save_Controller = async (
    data = {
        name: new String(''),
        _agentid: new String(''),
        imd_username: new String(''),
        refactor_name: false,
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const imd_username = 'kaiyaphap@imd.co.th';

    if (typeof data != 'object') {
        callback(new Error(`template_CourseGroup_Save_Controller: data must be Object`));
        return;
    }
    else if (typeof data.name != 'string' || data.name == '') {
        callback(new Error(`template_CourseGroup_Save_Controller: data.name must be String and Not Empty`));
        return;
    }
    else if (typeof data._agentid != 'string' || data._agentid == '') {
        callback(new Error(`template_CourseGroup_Save_Controller: data._agentid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._agentid)) {
        callback(new Error(`template_CourseGroup_Save_Controller: data._agentid Validate ObjectId return false`));
        return;
    }
    else if (typeof data.imd_username != 'string' || data.imd_username != imd_username) {
        callback(new Error(`template_CourseGroup_Save_Controller: data.imd_username must be IMD agent Account and Not Empty`));
        return;
    }
    else if (typeof data.refactor_name != 'boolean') {
        callback(new Error(`template_CourseGroup_Save_Controller: data.refactor_name must be Boolean`));
        return;
    }
    else {
        const _storeid = await miscController.checkObjectId('5ea003d688b7265b04296e2c', (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId('5ea003d688b7265b04296e2c', (err) => { if (err) { callback(err); return; } });
        const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if (err) { callback(err); return; } })

        const chkstoreId = await miscController.checkStoreBranch(
            {
                _storeid: _storeid.toString(),
                _branchid: _branchid.toString()
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkstoreId) { callback(new Error(`template_CourseGroup_Save_Controller: chkstoreId return false`)); return; }
        else {
            const chkAgentId = await miscController.checkAgentAdminId_StoreBranch(
                {
                    _storeid: _storeid.toString(),
                    _branchid: _branchid.toString(),
                    _agentid: _agentid.toString()
                },
                (err) => { if (err) { callback(err); return; } }
            );
            if (!chkAgentId) { callback(new Error(`template_CourseGroup_Save_Controller: chkAgentId return false`)); return; }
            else {
                const chkImdId = await miscController.checkImdAgentId(
                    {
                        _agentid: _agentid.toString(),
                        username: data.imd_username
                    },
                    (err) => { if (err) { callback(err); return; } }
                );
                if (!chkImdId) { callback(new Error(`template_CourseGroup_Save_Controller: chkImdId return false`)); return; }
                else {
                    const moment = require('moment');

                    const create_date = moment();
                    const create_date_string = create_date.format('YYYY-MM-DD');
                    const create_time_string = create_date.format('HH:mm:ss');

                    const modify_date = create_date;
                    const modify_date_string = create_date.format('YYYY-MM-DD');
                    const modify_time_string = create_date.format('HH:mm:ss');


                    const mapData = {

                        name: data.name, // Course/Package Group

                        run_number: null,

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

                        isused: false, // เปิดใช้งาน

                    };

                    const tempCourseGroupModel = require('../../mongodbController').tempCourseGroupModel;
                    const transactionSave = new tempCourseGroupModel(mapData);
                    let saveResult = await transactionSave.save().then(result => (result)).catch(err => { if (err) { callback(err); return; } });
                    if (!saveResult) { callback(new Error(`template_CourseGroup_Save_Controller: save have error`)); return; }
                    else {
                        const AutoIncrementTemplateCourseGroupModel = require('../../mongodbController').AutoIncrementTemplateCourseGroupModel;
                        const transactionAutoIncSave = new AutoIncrementTemplateCourseGroupModel();
                        const saveAutoIncResult = await transactionAutoIncSave.save().then(result => (result)).catch(err => { if (err) { callback(err); return; } });

                        if(!saveAutoIncResult) {
                            saveResult = await saveResult.deleteOne().then(result => (result)).catch(err => { if (err) { callback(err); return; } });
                            if(!saveResult) { callback(new Error(`template_CourseGroup_Save_Controller: save AtuoIncresement have error and cannot delete data`)); return; }
                            else { callback(new Error(`template_CourseGroup_Save_Controller: save AtuoIncresement have error`)); return; }
                        }
                        else {
                            transactionSave.run_number = saveAutoIncResult.seq;
                            transactionSave.isused = true;
                            saveResult = await transactionSave.save()
                                .then(result => (result))
                                .catch( async err => {
                                    if (err) { 
                                        saveResult = await saveResult.deleteOne().then(result => (result)).catch(err => { if (err) { callback(err); return; } });
                                        if(!saveResult) { callback(new Error(`template_CourseGroup_Save_Controller: update have error and cannot delete data`)); return; }
                                        else { callback(new Error(`template_CourseGroup_Save_Controller: update have error`)); return; }
                                    } 
                                }
                            );
                            if(!saveResult) { return; }
                            else { return saveResult; }
                        }
                        
                    }
                }
            }
        }
    }

};


/**
 * 
 * Controller แก้ไข MasterData ของ Course/Package Group ให้สำหรับ IMD Potal ใช้งาน
 * 
 */
const template_CourseGroup_Edit_Controller = async (
    data = {
        name: new String(''),
        _course_groupid: new String(''),
        _agentid: new String(''),
        imd_username: new String(''),
        refactor_name: false,
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const imd_username = 'kaiyaphap@imd.co.th';

    if (typeof data != 'object') {
        callback(new Error(`template_CourseGroup_Edit_Controller: data must be Object`));
        return;
    }
    else if (typeof data.name != 'string' || data.name == '') {
        callback(new Error(`template_CourseGroup_Edit_Controller: data.name must be String and Not Empty`));
        return;
    }
    else if (typeof data._course_groupid != 'string' || data._course_groupid == '') {
        callback(new Error(`template_CourseGroup_Edit_Controller: data._course_groupid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._course_groupid)) {
        callback(new Error(`template_CourseGroup_Edit_Controller: data._course_groupid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._agentid != 'string' || data._agentid == '') {
        callback(new Error(`template_CourseGroup_Edit_Controller: data._agentid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._agentid)) {
        callback(new Error(`template_CourseGroup_Edit_Controller: data._agentid Validate ObjectId return false`));
        return;
    }
    else if (typeof data.imd_username != 'string' || data.imd_username != imd_username) {
        callback(new Error(`template_CourseGroup_Edit_Controller: data.imd_username must be IMD agent Account and Not Empty`));
        return;
    }
    else if (typeof data.refactor_name != 'boolean') {
        callback(new Error(`template_CourseGroup_Edit_Controller: data.refactor_name must be Boolean`));
        return;
    }
    else {
        const _storeid = await miscController.checkObjectId('5ea003d688b7265b04296e2c', (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId('5ea003d688b7265b04296e2c', (err) => { if (err) { callback(err); return; } });
        const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if (err) { callback(err); return; } });
        const _course_groupid = await miscController.checkObjectId(data._course_groupid.toString(), (err) => { if (err) { callback(err); return; } })

        const chkstoreId = await miscController.checkStoreBranch(
            {
                _storeid: _storeid.toString(),
                _branchid: _branchid.toString()
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkstoreId) { callback(new Error(`template_CourseGroup_Edit_Controller: chkstoreId return false`)); return; }
        else {
            const chkAgentId = await miscController.checkAgentAdminId_StoreBranch(
                {
                    _storeid: _storeid.toString(),
                    _branchid: _branchid.toString(),
                    _agentid: _agentid.toString()
                },
                (err) => { if (err) { callback(err); return; } }
            );
            if (!chkAgentId) { callback(new Error(`template_CourseGroup_Edit_Controller: chkAgentId return false`)); return; }
            else {
                const chkImdId = await miscController.checkImdAgentId(
                    {
                        _agentid: _agentid.toString(),
                        username: data.imd_username
                    },
                    (err) => { if (err) { callback(err); return; } }
                );
                if (!chkImdId) { callback(new Error(`template_CourseGroup_Edit_Controller: chkImdId return false`)); return; }
                else {
                    const moment = require('moment');

                    const create_date = moment();
                    const create_date_string = create_date.format('YYYY-MM-DD');
                    const create_time_string = create_date.format('HH:mm:ss');

                    const modify_date = create_date;
                    const modify_date_string = create_date.format('YYYY-MM-DD');
                    const modify_time_string = create_date.format('HH:mm:ss');


                    const mapData = {

                        name: data.name, // การวินิจฉัยโรค

                        modify_date: modify_date,
                        modify_date_string: modify_date_string,
                        modify_time_string: modify_time_string,
                        _ref_agent_userid_modify: chkAgentId._agentid,
                        _ref_agent_userstoreid_modify: chkAgentId._agentstoreid,

                    };

                    const tempCourseGroupModel = require('../../mongodbController').tempCourseGroupModel;

                    const Retry_Max = 10;
                    let Retry_Count = 0;
                    while (Retry_Count < Retry_Max) {
                        Retry_Count = Retry_Count + 1;

                        let findResult = await tempCourseGroupModel.findOne(
                            {
                                '_id': _course_groupid
                            },
                            (err) => { if(err) { callback(err); return; } }
                        );
                        if(!findResult) { callback(new Error(`template_CourseGroup_Edit_Controller: findResult is not find _id => ${data._course_groupid}`)); return; }
                        else if (findResult.name == data.name) { callback(new Error(`template_CourseGroup_Edit_Controller: findResult.name is same as data.name`)); return; }
                        else {
                            findResult.name = mapData.name;
                            findResult.modify_date = mapData.modify_date;
                            findResult.modify_date_string = mapData.modify_date_string;
                            findResult.modify_time_string = mapData.modify_time_string;
                            findResult._ref_agent_userid_modify = mapData._ref_agent_userid_modify;
                            findResult._ref_agent_userstoreid_modify = mapData._ref_agent_userstoreid_modify;
    
                            const saveResult = await findResult.save().then(result => (result)).catch(err => { if (err) { return; } });
                            if(!saveResult) { continue; }
                            else {
                                callback(null);
                                return saveResult; // Process Sucessful
                            }
                        }
                    }

                    callback(new Error(`template_CourseGroup_Edit_Controller: Process Error`));
                    return;
                }
            }
        }
    }

};



/**
 * 
 * Controller เปิด-ปิด MasterData ของ Course/Package Group ให้สำหรับ IMD Potal ใช้งาน
 * 
 */
const template_CourseGroup_Switch_Controller = async (
    data = {
        _course_groupid: new String(''),
        _agentid: new String(''),
        imd_username: new String(''),
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const imd_username = 'kaiyaphap@imd.co.th';

    if (typeof data != 'object') {
        callback(new Error(`template_CourseGroup_Switch_Controller: data must be Object`));
        return;
    }
    else if (typeof data._course_groupid != 'string' || data._course_groupid == '') {
        callback(new Error(`template_CourseGroup_Switch_Controller: data._course_groupid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._course_groupid)) {
        callback(new Error(`template_CourseGroup_Switch_Controller: data._course_groupid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._agentid != 'string' || data._agentid == '') {
        callback(new Error(`template_CourseGroup_Switch_Controller: data._agentid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._agentid)) {
        callback(new Error(`template_CourseGroup_Switch_Controller: data._agentid Validate ObjectId return false`));
        return;
    }
    else if (typeof data.imd_username != 'string' || data.imd_username != imd_username) {
        callback(new Error(`template_CourseGroup_Switch_Controller: data.imd_username must be IMD agent Account and Not Empty`));
        return;
    }
    else {
        const _storeid = await miscController.checkObjectId('5ea003d688b7265b04296e2c', (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId('5ea003d688b7265b04296e2c', (err) => { if (err) { callback(err); return; } });
        const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if (err) { callback(err); return; } });
        const _course_groupid = await miscController.checkObjectId(data._course_groupid.toString(), (err) => { if (err) { callback(err); return; } })

        const chkstoreId = await miscController.checkStoreBranch(
            {
                _storeid: _storeid.toString(),
                _branchid: _branchid.toString()
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkstoreId) { callback(new Error(`template_CourseGroup_Switch_Controller: chkstoreId return false`)); return; }
        else {
            const chkAgentId = await miscController.checkAgentAdminId_StoreBranch(
                {
                    _storeid: _storeid.toString(),
                    _branchid: _branchid.toString(),
                    _agentid: _agentid.toString()
                },
                (err) => { if (err) { callback(err); return; } }
            );
            if (!chkAgentId) { callback(new Error(`template_CourseGroup_Switch_Controller: chkAgentId return false`)); return; }
            else {
                const chkImdId = await miscController.checkImdAgentId(
                    {
                        _agentid: _agentid.toString(),
                        username: data.imd_username
                    },
                    (err) => { if (err) { callback(err); return; } }
                );
                if (!chkImdId) { callback(new Error(`template_CourseGroup_Switch_Controller: chkImdId return false`)); return; }
                else {
                    const moment = require('moment');

                    const create_date = moment();
                    const create_date_string = create_date.format('YYYY-MM-DD');
                    const create_time_string = create_date.format('HH:mm:ss');

                    const modify_date = create_date;
                    const modify_date_string = create_date.format('YYYY-MM-DD');
                    const modify_time_string = create_date.format('HH:mm:ss');


                    const mapData = {

                        modify_date: modify_date,
                        modify_date_string: modify_date_string,
                        modify_time_string: modify_time_string,
                        _ref_agent_userid_modify: chkAgentId._agentid,
                        _ref_agent_userstoreid_modify: chkAgentId._agentstoreid,

                    };

                    const tempCourseGroupModel = require('../../mongodbController').tempCourseGroupModel;

                    const Retry_Max = 10;
                    let Retry_Count = 0;
                    while (Retry_Count < Retry_Max) {
                        Retry_Count = Retry_Count + 1;

                        let findResult = await tempCourseGroupModel.findOne(
                            {
                                '_id': _course_groupid
                            },
                            (err) => { if(err) { callback(err); return; } }
                        );
                        if(!findResult) { callback(new Error(`template_CourseGroup_Edit_Controller: findResult is not find _id => ${data._course_groupid}`)); return; }
                        else if (findResult.name == data.name) { callback(new Error(`template_CourseGroup_Switch_Controller: findResult.name is same as data.name`)); return; }
                        else {
                            findResult.isused = !findResult.isused;
                            findResult.modify_date = mapData.modify_date;
                            findResult.modify_date_string = mapData.modify_date_string;
                            findResult.modify_time_string = mapData.modify_time_string;
                            findResult._ref_agent_userid_modify = mapData._ref_agent_userid_modify;
                            findResult._ref_agent_userstoreid_modify = mapData._ref_agent_userstoreid_modify;
    
                            const saveResult = await findResult.save().then(result => (result)).catch(err => { if (err) { return; } });
                            if(!saveResult) { continue; }
                            else {
                                callback(null);
                                return saveResult; // Process Sucessful
                            }
                        }
                    }

                    callback(new Error(`template_CourseGroup_Switch_Controller: Process Error`));
                    return;
                }
            }
        }
    }

};



/**
 * 
 * Controller ดูข้อมูล MasterData ของ Course/Package Group ให้สำหรับ IMD Potal ใช้งาน
 * 
 */
const template_CourseGroup_View_Controller = async (
    data = {
        _agentid: new String(''),
        imd_username: new String(''),
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const imd_username = 'kaiyaphap@imd.co.th';

    if (typeof data != 'object') {
        callback(new Error(`template_CourseGroup_View_Controller: data must be Object`));
        return;
    }
    else if (typeof data._agentid != 'string' || data._agentid == '') {
        callback(new Error(`template_CourseGroup_View_Controller: data._agentid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!validateObjectId(data._agentid)) {
        callback(new Error(`template_CourseGroup_View_Controller: data._agentid Validate ObjectId return false`));
        return;
    }
    else if (typeof data.imd_username != 'string' || data.imd_username != imd_username) {
        callback(new Error(`template_CourseGroup_View_Controller: data.imd_username must be IMD agent Account and Not Empty`));
        return;
    }
    else {
        const _storeid = await miscController.checkObjectId('5ea003d688b7265b04296e2c', (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId('5ea003d688b7265b04296e2c', (err) => { if (err) { callback(err); return; } });
        const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if (err) { callback(err); return; } })

        const chkstoreId = await miscController.checkStoreBranch(
            {
                _storeid: _storeid.toString(),
                _branchid: _branchid.toString()
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkstoreId) { callback(new Error(`template_CourseGroup_Save_Controller: chkstoreId return false`)); return; }
        else {
            const chkAgentId = await miscController.checkAgentAdminId_StoreBranch(
                {
                    _storeid: _storeid.toString(),
                    _branchid: _branchid.toString(),
                    _agentid: _agentid.toString()
                },
                (err) => { if (err) { callback(err); return; } }
            );
            if (!chkAgentId) { callback(new Error(`template_CourseGroup_Save_Controller: chkAgentId return false`)); return; }
            else {
                const chkImdId = await miscController.checkImdAgentId(
                    {
                        _agentid: _agentid.toString(),
                        username: data.imd_username
                    },
                    (err) => { if (err) { callback(err); return; } }
                );
                if (!chkImdId) { callback(new Error(`template_CourseGroup_Save_Controller: chkImdId return false`)); return; }
                else {
                    const tempCourseGroupModel = require('../../mongodbController').tempCourseGroupModel;
                    const findResult = await tempCourseGroupModel.find(
                        {},
                        (err) => { if(err) { callback(err); return; } }
                    )
                    if(!findResult) { callback(new Error(`template_CourseGroup_Save_Controller: findResult have error`)); return; }
                    else { callback(null); return findResult; }
                }
            }
        }
    }
};

module.exports = {
    template_CourseGroup_Save_Controller,
    template_CourseGroup_Edit_Controller,
    template_CourseGroup_Switch_Controller,
    template_CourseGroup_View_Controller,
};