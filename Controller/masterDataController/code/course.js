/**
 * Controller สำหรับ บันทึก Course/Package ใช้สำหรับ Customer Portal
 */
const course_Save_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _ref_course_groupid: new String(''),
        name: new String(''),
        price: new Number(-1),
        refactor_name: new Boolean(false),
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;

    if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error('courseGroup_Save_Controller: data._storeid must be String And not Empty')); return; }
    else if (!validateObjectId(data._storeid)) { callback(new Error('courseGroup_Save_Controller: data._storeid Validate ObjectId return false')); return; }
    else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error('courseGroup_Save_Controller: data._branchid must be String And not Empty')); return; }
    else if (!validateObjectId(data._branchid)) { callback(new Error('courseGroup_Save_Controller: data._branchid Validate ObjectId return false')); return; }
    else if (typeof data._agentid != 'string' || data._agentid == '') { callback(new Error('courseGroup_Save_Controller: data._agentid must be String And not Empty')); return; }
    else if (!validateObjectId(data._agentid)) { callback(new Error('courseGroup_Save_Controller: data._agentid Validate ObjectId return false')); return; }
    else if (typeof data._ref_course_groupid != 'string' || data._ref_course_groupid == '') { callback(new Error('courseGroup_Save_Controller: data._ref_course_groupid must be String And not Empty')); return; }
    else if (!validateObjectId(data._ref_course_groupid)) { callback(new Error('courseGroup_Save_Controller: data._ref_course_groupid Validate ObjectId return false')); return; }
    else if (typeof data.name != 'string' || data.name == '') { callback(new Error('courseGroup_Save_Controller: data.name must be String And not Empty')); return; }
    else if (typeof data.price != 'number' || data.price < 0) { callback(new Error('courseGroup_Save_Controller: data.price must be Number And More than 0')); return; }
    else if (typeof data.refactor_name != 'boolean') { callback(new Error('courseGroup_Save_Controller: data.refactor_name must be Boolean')); return; }
    else {
        const checkObjectId = miscController.checkObjectId;
        const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
        const _agentid = await checkObjectId(data._agentid, (err) => { if (err) { callback(err); return; } });
        const _ref_course_groupid = await checkObjectId(data._ref_course_groupid, (err) => { if (err) { callback(err); return; } });
        const name = data.name;
        const price = data.price;

        const moment = require('moment');
        const create_date = moment();
        const create_date_string = create_date.format('YYYY-MM-DD');
        const create_time_string = create_date.format('HH:mm:ss');

        const modify_date = create_date;
        const modify_date_string = create_date.format('YYYY-MM-DD');
        const modify_time_string = create_date.format('HH:mm:ss');

        const checkStoreBranch = miscController.checkStoreBranch;
        const chkStoreBranch = await checkStoreBranch(
            {
                _storeid: _storeid.toString(),
                _branchid: _branchid.toString(),
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkStoreBranch) { callback(new Error(`courseGroup_Save_Controller: chkStoreBranch As Requested is Not found Or Have an error`)); return; }
        else {
            const chkAgentAdmin = await miscController.checkAgentAdminId_StoreBranch(
                {
                    _storeid: _storeid.toString(),
                    _branchid: _branchid.toString(),
                    _agentid: _agentid.toString(),
                },
                (err) => { if (err) { callback(err); return; } }
            );

            if (!chkAgentAdmin) { callback(new Error(`courseGroup_Save_Controller: chkAgentAdmin As Requested is Not found Or Have an error`)); return; }
            else {
                const checkCourseGroupId = miscController.checkCourseGroupId;
                const chkCourseGroup = await checkCourseGroupId(
                    {
                        _course_groupid: _ref_course_groupid.toString()
                    },
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!chkCourseGroup) { callback(new Error(`courseGroup_Save_Controller: chkCourseGroup As Requested is Not found Or Have an error _ref_course_groupid is ${data._ref_course_groupid}`)); return; }
                else {
                    const mapData = {
                        run_number: null,

                        name: name,
                        _ref_course_groupid: _ref_course_groupid,
                        price: price,

                        _ref_storeid: _storeid,
                        _ref_branchid: _branchid,

                        isused: false,
                        istruncated: false,

                        create_date: create_date,
                        create_date_string: create_date_string,
                        create_time_string: create_time_string,
                        _ref_agent_userid_create: chkAgentAdmin._agentid,
                        _ref_agent_userstoreid_create: chkAgentAdmin._agentstoreid,

                        modify_date: modify_date,
                        modify_date_string: modify_date_string,
                        modify_time_string: modify_time_string,
                        _ref_agent_userid_modify: chkAgentAdmin._agentid,
                        _ref_agent_userstoreid_modify: chkAgentAdmin._agentstoreid,
                    };

                    const mongodbController = require('../../mongodbController');

                    const courseModel = mongodbController.courseModel;
                    const transactionSave = new courseModel(mapData);
                    let saveResult = await transactionSave.save().then(result => (result)).catch(err => { if (err) { callback(err); return; } });

                    if (!saveResult) { callback(new Error(`courseGroup_Save_Controller: save document have error`)); return; }
                    else {
                        const AutoIncrementCourseGroupModel = mongodbController.AutoIncrementCourseGroupModel;
                        const transactionAutoIncSave = new AutoIncrementCourseGroupModel();
                        const saveAutoIncResult = await transactionAutoIncSave.save().then(result => (result)).catch(err => { if (err) { callback(err); return; } });

                        if (!saveAutoIncResult) {
                            saveResult = await saveResult.deleteOne().then(result => (result)).catch(err => { if (err) { callback(err); return; } });
                            if (!saveResult) { callback(new Error(`courseGroup_Save_Controller: save AtuoIncresement have error and cannot delete document`)); return; }
                            else { callback(new Error(`courseGroup_Save_Controller: save AtuoIncresement have error`)); return; }
                        }
                        else {
                            transactionSave.run_number = saveAutoIncResult.seq;
                            transactionSave.isused = true;
                            saveResult = await transactionSave.save()
                                .then(result => (result))
                                .catch(err => {
                                    if (err) {
                                        saveResult = saveResult.deleteOne().then(result => (result)).catch(err => { if (err) { callback(err); return; } });
                                        if (!saveResult) { callback(new Error(`courseGroup_Save_Controller: update have error and cannot delete data`)); return; }
                                        else { callback(new Error(`courseGroup_Save_Controller: update have error`)); return; }
                                    }
                                }
                                );
                            if (!saveResult) { return; }
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
 * Controller แก้ไข Course/Package ใช้สำหรับ Customer Portal
 * 
 */
const course_Edit_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _courseid: new String(''),
        name: new String(''),
        _ref_course_groupid: new String(''),
        price: new Number(-1),
        refactor_name: new Boolean(false),
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');

    if (typeof data != 'object') {
        callback(new Error(`course_Edit_Controller: data must be Object`));
        return;
    }
    else if (typeof data._storeid != 'string' || data._storeid == '') {
        callback(new Error(`course_Edit_Controller: data._storeid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!miscController.validateObjectId(data._storeid)) {
        callback(new Error(`course_Edit_Controller: data._storeid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._branchid != 'string' || data._branchid == '') {
        callback(new Error(`course_Edit_Controller: data._branchid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!miscController.validateObjectId(data._branchid)) {
        callback(new Error(`course_Edit_Controller: data._branchid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._agentid != 'string' || data._agentid == '') {
        callback(new Error(`course_Edit_Controller: data._agentid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!miscController.validateObjectId(data._agentid)) {
        callback(new Error(`course_Edit_Controller: data._agentid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._courseid != 'string' || data._courseid == '') {
        callback(new Error(`course_Edit_Controller: data._courseid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!miscController.validateObjectId(data._courseid)) {
        callback(new Error(`course_Edit_Controller: data._courseid Validate ObjectId return false`));
        return;
    }
    else if (typeof data.name != 'string' || data.name == '') {
        callback(new Error(`course_Edit_Controller: data._courseid me be String and Not Empty`));
        return;
    }
    else if (typeof data._ref_course_groupid != 'string' || data._ref_course_groupid == '') {
        callback(new Error(`course_Edit_Controller: data._ref_course_groupid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!miscController.validateObjectId(data._ref_course_groupid)) {
        callback(new Error(`course_Edit_Controller: data._ref_course_groupid Validate ObjectId return false`));
        return;
    }
    else if (typeof data.price != 'number' || data.price < 0) {
        callback(new Error(`course_Edit_Controller: data.price me be Number and more than 0`));
        return;
    }
    else if (typeof data.refactor_name != 'boolean') {
        callback(new Error(`course_Edit_Controller: data.refactor_name must be Boolean`));
        return;
    }
    else {
        const _storeid = await miscController.checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
        const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if (err) { callback(err); return; } });
        const _courseid = await miscController.checkObjectId(data._courseid.toString(), (err) => { if (err) { callback(err); return; } });
        const _ref_course_groupid = await miscController.checkObjectId(data._ref_course_groupid.toString(), (err) => { if (err) { callback(err); return; } });
        const name = data.name;
        const price = data.price;

        const checkStoreBranch = miscController.checkStoreBranch;
        const chkStoreBranch = await checkStoreBranch(
            {
                _storeid: _storeid.toString(),
                _branchid: _branchid.toString()
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkStoreBranch) { callback(new Error(`course_Edit_Controller: chkStoreBranch As Requested is Not found Or Have an error`)); return; }
        else {
            const chkAgentAdmin = await miscController.checkAgentAdminId_StoreBranch(
                {
                    _storeid: _storeid.toString(),
                    _branchid: _branchid.toString(),
                    _agentid: _agentid.toString(),
                },
                (err) => { if (err) { callback(err); return; } }
            );

            if (!chkAgentAdmin) { callback(new Error(`course_Edit_Controller: chkAgentAdmin As Requested is Not found Or Have an error`)); return; }
            else {
                const courseModel = require('../../mongodbController').courseModel;
                const findCourse = await courseModel.findById(
                    _courseid,
                    {},
                    (err) => { if (err) { callback(err); return; } }
                );
                if (!findCourse) { callback(new Error(`course_Edit_Controller: course/package not found`)); return; }
                else {
                    const checkCourseGroupId = miscController.checkCourseGroupId;
                    const chkCourseGroup = await checkCourseGroupId(
                        {
                            _course_groupid: _ref_course_groupid.toString()
                        },
                        (err) => { if (err) { callback(err); return; } }
                    );

                    if (!chkCourseGroup) { callback(new Error(`course_Edit_Controller: chkCourseGroup As Requested is Not found Or Have an error _ref_course_groupid is ${data._ref_course_groupid}`)); return; }
                    else {
                        const moment = require('moment');
                        const create_date = moment();
                        // const create_date_string = create_date.format('YYYY-MM-DD');
                        // const create_time_string = create_date.format('HH:mm:ss');

                        const modify_date = create_date;
                        const modify_date_string = create_date.format('YYYY-MM-DD');
                        const modify_time_string = create_date.format('HH:mm:ss');

                        for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {
                            let findResult = await courseModel.findOne(
                                {
                                    '_id': _courseid,
                                },
                                {},
                                (err) => { if (err) { callback(err); return; } }
                            );

                            if (!findResult) { callback(new Error(`course_Edit_Controller: course/package not found while prepare update`)); return; }
                            else {
                                findResult.name = name;
                                findResult._ref_course_groupid = _ref_course_groupid;
                                findResult.price = price;

                                findResult.modify_date = modify_date;
                                findResult.modify_date_string = modify_date_string;
                                findResult.modify_time_string = modify_time_string;
                                findResult._ref_agent_userid_modify = chkAgentAdmin._agentid;
                                findResult._ref_agent_userstoreid_modify = chkAgentAdmin._agentstoreid;

                                const updateResult = await findResult.save().then(result => (result)).catch(err => { if (err) { callback(err); return; } });

                                if (!updateResult) { continue; }
                                else { callback(null); return updateResult; }
                            }
                        }

                        callback(new Error(`course_Edit_Controller: have other error`));
                        return;
                    }
                }
            }
        }
    }

};



/**
 * 
 * Controller เปิด-ปิด Course/Package ใช้สำหรับ Customer Portal
 * 
 */
const course_Switch_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _courseid: new String(''),
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');

    if (typeof data != 'object') {
        callback(new Error(`course_Switch_Controller: data must be Object`));
        return;
    }
    else if (typeof data._storeid != 'string' || data._storeid == '') {
        callback(new Error(`course_Switch_Controller: data._storeid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!miscController.validateObjectId(data._storeid)) {
        callback(new Error(`course_Switch_Controller: data._storeid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._branchid != 'string' || data._branchid == '') {
        callback(new Error(`course_Switch_Controller: data._branchid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!miscController.validateObjectId(data._branchid)) {
        callback(new Error(`course_Switch_Controller: data._branchid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._agentid != 'string' || data._agentid == '') {
        callback(new Error(`course_Switch_Controller: data._agentid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!miscController.validateObjectId(data._agentid)) {
        callback(new Error(`course_Switch_Controller: data._agentid Validate ObjectId return false`));
        return;
    }
    else if (typeof data._courseid != 'string' || data._courseid == '') {
        callback(new Error(`course_Switch_Controller: data._courseid must be String ObjectId and Not Empty`));
        return;
    }
    else if (!miscController.validateObjectId(data._courseid)) {
        callback(new Error(`course_Switch_Controller: data._courseid Validate ObjectId return false`));
        return;
    }
    else {
        const _storeid = await miscController.checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
        const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if (err) { callback(err); return; } });
        const _courseid = await miscController.checkObjectId(data._courseid.toString(), (err) => { if (err) { callback(err); return; } });

        const checkStoreBranch = miscController.checkStoreBranch;
        const chkStoreBranch = await checkStoreBranch(
            {
                _storeid: _storeid.toString(),
                _branchid: _branchid.toString()
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkStoreBranch) { callback(new Error(`course_Switch_Controller: chkStoreBranch As Requested is Not found Or Have an error`)); return; }
        else {
            const chkAgentAdmin = await miscController.checkAgentAdminId_StoreBranch(
                {
                    _storeid: _storeid.toString(),
                    _branchid: _branchid.toString(),
                    _agentid: _agentid.toString(),
                },
                (err) => { if (err) { callback(err); return; } }
            );

            if (!chkAgentAdmin) { callback(new Error(`course_Switch_Controller: chkAgentAdmin As Requested is Not found Or Have an error`)); return; }
            else {
                const courseModel = require('../../mongodbController').courseModel;
                const findCourse = await courseModel.findById(
                    _courseid,
                    {},
                    (err) => { if (err) { callback(err); return; } }
                );
                if (!findCourse) { callback(new Error(`course_Switch_Controller: course/package not found`)); return; }
                else {
                    const moment = require('moment');
                    const create_date = moment();
                    // const create_date_string = create_date.format('YYYY-MM-DD');
                    // const create_time_string = create_date.format('HH:mm:ss');

                    const modify_date = create_date;
                    const modify_date_string = create_date.format('YYYY-MM-DD');
                    const modify_time_string = create_date.format('HH:mm:ss');

                    for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {
                        let findResult = await courseModel.findOne(
                            {
                                '_id': _courseid,
                            },
                            {},
                            (err) => { if (err) { callback(err); return; } }
                        );

                        if (!findResult) { callback(new Error(`course_Switch_Controller: course/package not found while prepare update`)); return; }
                        else {
                            findResult.isused = !findResult.isused;

                            const updateResult = await findResult.save().then(result => (result)).catch(err => { if (err) { callback(err); return; } });

                            if (!updateResult) { continue; }
                            else { callback(null); return updateResult; }
                        }
                    }

                    callback(new Error(`course_Switch_Controller: have other error/ have update error`));
                    return;
                }
            }
        }
    }

};



/**
 * 
 * Controller ดู Course/Package ใช้สำหรับ Customer Portal
 * 
 */
const course_View_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');

    if (typeof data != 'object') { callback(new Error(`course_View_Controller: data must be Object`)); return; }
    else if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`course_View_Controller: data._storeid must be String and Not Empty`)); return; }
    else if (!miscController.validateObjectId(data._storeid)) { callback(new Error(`course_View_Controller: data._storeid Validate ObjectId return false`)); return; }
    else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`course_View_Controller: data._branchid must be String and Not Empty`)); return; }
    else if (!miscController.validateObjectId(data._branchid)) { callback(new Error(`course_View_Controller: data._branchid Validate ObjectId return false`)); return; }
    else if (typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`course_View_Controller: data._agentid must be String and Not Empty`)); return; }
    else if (!miscController.validateObjectId(data._agentid)) { callback(new Error(`course_View_Controller: data._agentid Validate ObjectId return false`)); return; }
    else {
        const _storeid = await miscController.checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
        // const _agentid = await miscController.checkObjectId(data._agentid, (err) => { if (err) { callback(err); return; } });

        const chkAgentId = await miscController.checkAgentId(
            {
                _storeid: data._storeid,
                _branchid: data._branchid,
                _agentid: data._agentid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgentId) { callback(new Error(`course_View_Controller: chkAgentId Not Found`)); return; }
        else {
            const courseModel = require('../../mongodbController').courseModel;
            const findCourse = await courseModel.aggregate(
                [
                    {
                      '$match': {
                        '_ref_storeid': _storeid, 
                        '_ref_branchid': _branchid
                      }
                    }, {
                      '$lookup': {
                        'from': 't_course_group', 
                        'localField': '_ref_course_groupid', 
                        'foreignField': '_id', 
                        'as': 't_course_group_join'
                      }
                    }, {
                      '$match': {
                        't_course_group_join': {
                          '$size': 1
                        }
                      }
                    }, {
                      '$addFields': {
                        '_ref_course_group_name': {
                          '$arrayElemAt': [
                            '$t_course_group_join.name', 0
                          ]
                        }
                      }
                    }, {
                      '$project': {
                        't_course_group_join': 0
                      }
                    }, {
                      '$sort': {
                        '_id': 1
                      }
                    }
                ],
                (err) => { if(err) { callback(err); return; } }
            )

            if (!findCourse) { callback(new Error(`course_View_Controller: findCourse have some error`)); return; }
            else { callback(null); return findCourse; }
        }
    }
};

module.exports = {
    course_Save_Controller,
    course_Edit_Controller,
    course_Switch_Controller,
    course_View_Controller,
};