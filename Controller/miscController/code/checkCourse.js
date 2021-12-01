/**
 * Misc Controller ใช้สำหรับ ตรวจหา Course/Package
 */
const checkCourse = async (
    data = {
        _ref_courseid: String(''),
        _ref_storeid: String(''),
        _ref_branchid: String('')
    },
    callback = (err = new Error) => {}
) => {
    const { validateObjectId, checkObjectId } = require('..');

    if (typeof data != 'object') { callback(new Error(`checkCourse: data must be Object`)); return; }
    else if (typeof data._ref_courseid != 'string' || !validateObjectId(data._ref_courseid)) { callback(new Error(`checkCourse: data._ref_courseid must be String ObjectId`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`checkCourse: data._ref_storeid must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`checkCourse: data._ref_branchid must be String ObjectId`)); return; }
    else {
        const { courseModel } = require('../../mongodbController');

        const _ref_courseid = await checkObjectId(data._ref_courseid,(err) => { if(err) { callback(err); return; } });
        const _ref_storeid = await checkObjectId(data._ref_storeid,(err) => { if(err) { callback(err); return; } });
        const _ref_branchid = await checkObjectId(data._ref_branchid,(err) => { if(err) { callback(err); return; } });

        const findCourse = await courseModel.findOne(
            {
                '_id': _ref_courseid,
                '_ref_storeid': _ref_storeid,
                '_ref_branchid': _ref_branchid
            },
            (err) => { if(err) { callback(err); return; } }
        );

        if(!findCourse) { callback(new Error(`checkCourse: course not found in _ref_storeid/_ref_branchid`)); }
        else {
            callback(null);
            return {
                _ref_courseid: String(data._ref_courseid),
                _ref_storeid: String(data._ref_storeid),
                _ref_branchid: String(data._ref_branchid)
            };
        }
    }
};

module.exports = checkCourse;