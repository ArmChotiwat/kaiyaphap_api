/**
 * 
 * ใช้สำหรับ ตรวจสอบ Course/Package Group ใน Imd Master Data
 * 
 ** หากมี จะ rteurn ข้อมูลออกมาก
 ** หากไม่มี จะ return ไม่มีข้อมูลออกมาก (undefined)
 * 
 */
const checkCourseGroupId = async (
    data = {
        _course_groupid: new String('')
    },
    callback = (err = new Error) => {}
) => {
    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    
    if(typeof data._course_groupid != 'string') { callback(new Error(`checkCourseGroupId: data._course_groupid must be String ObjectId`)); return; }
    else if(!validateObjectId(data._course_groupid)) { callback(new Error(`checkCourseGroupId: data._course_groupid ObjectId validate return false`)); return; }
    else {
        const checkObjectId = miscController.checkObjectId;
        const _course_groupid = await checkObjectId(data._course_groupid, (err) => { if(err) { callback(err); return; } });

        const mongodbController = require('../../mongodbController');
        const tempCourseGroupModel = mongodbController.tempCourseGroupModel;
        const findResult = tempCourseGroupModel.findById(
            _course_groupid,
            {},
            (err) => { if(err) { callback(err); return; } }
        );

        if(!findResult) { callback(null); return; }
        else {
            callback(null);
            return {
                _id: findResult._id,
                name: findResult.name,
                run_number: findResult.run_number,
                create_date: findResult.create_date,
                create_date_string: findResult.create_date_string,
                create_time_string: findResult.create_time_string,
                _ref_agent_userid_create: findResult._ref_agent_userid_create,
                _ref_agent_userstoreid_create: findResult._ref_agent_userstoreid_create,
                modify_date: findResult.modify_date,
                modify_date_string: findResult.modify_date_string,
                modify_time_string: findResult.modify_time_string,
                _ref_agent_userid_modify: findResult._ref_agent_userid_modify,
                _ref_agent_userstoreid_modify: findResult._ref_agent_userstoreid_modify,
                isused: findResult.isused,
                __v: findResult.__v,
            };
        }

    }
};

module.exports = checkCourseGroupId;