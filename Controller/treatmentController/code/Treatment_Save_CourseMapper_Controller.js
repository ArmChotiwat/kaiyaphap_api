/**
 * Sub Controller สำหรับ ตรวจสอบ ข้อมูล Course/Package ที่รับจาก JSON แล้ว Map ข้อมูลใหม่ไว้ใชกับ treatment_Save_Controller
 */
const Treatment_Save_CourseMapper_Controller = async (
    course_full = [
        {
            _ref_courseid: '',
            course_price: -1,
            course_count: 0,
            course_remark: '',
        }
    ],
    callback = (err = new Error) => { }
) => {
    const controllerName = `Treatment_Save_CourseMapper_Controller`;

    const { validateObjectId, validate_StringOrNull_AndNotEmpty } = require('../../miscController');

    if (typeof course_full != 'object') { callback(new Error(`${controllerName}: course_full must be Array Object`)); return; }
    else if (course_full.length < 1) { callback(new Error(`${controllerName}: course_full must be Array Object and Length of Array must be morethan 0`)); return; }
    else {
        for (let index = 0; index < course_full.length; index++) {
            const elementCourseFull = course_full[index];

            if (typeof elementCourseFull._ref_courseid != 'string' || !validateObjectId(elementCourseFull._ref_courseid)) { callback(new Error(`${controllerName}: course_full[${index}]._ref_courseid Must be String ObjectId`)); return; }
            if (typeof elementCourseFull.course_price != 'number' || elementCourseFull.course_price < 0) { callback(new Error(`${controllerName}: course_full[${index}].course_price Must be Number and morethan or equal 0`)); return; }
            if (typeof elementCourseFull.course_count != 'number' || elementCourseFull.course_count <= 0) { callback(new Error(`${controllerName}: course_full[${index}].course_count Must be Number and morethan 0`)); return; }
            if (!validate_StringOrNull_AndNotEmpty(elementCourseFull.course_remark)) { callback(new Error(`${controllerName}: course_full[${index}].course_remark Must be String or Null and Not Empty`)); return; }
        }

        let map_course_full = [];
        for (let index = 0; index < course_full.length; index++) {
            const elementTmpProductFull = course_full[index];

            const searchCourseFull_1st = course_full.filter( // Return Length more than 0 and Equal searchCourseFull_2nd
                where => (
                    where._ref_courseid === elementTmpProductFull._ref_courseid
                )
            );
            const searchCourseFull_2nd = course_full.filter( // Return Length more than 0 and Equal searchCourseFull_1st
                where => (
                    where._ref_courseid === elementTmpProductFull._ref_courseid &&
                    where.course_price === elementTmpProductFull.course_price
                )
            );
            const searchCourseFull_3rd = course_full.filter(
                where => (
                    where._ref_courseid === elementTmpProductFull._ref_courseid &&
                    where.course_price === elementTmpProductFull.course_price &&
                    where.course_count === elementTmpProductFull.course_count
                )
            );
            const searchCourseFull_4th = course_full.filter(
                where => (
                    where._ref_courseid === elementTmpProductFull._ref_courseid &&
                    where.course_price === elementTmpProductFull.course_price &&
                    where.course_count === elementTmpProductFull.course_count &&
                    where.course_remark === elementTmpProductFull.course_remark
                )
            );

            if (searchCourseFull_1st.length <= 0) { callback(new Error(`${controllerName}: course_full[${index}] searchCourseFull_1st return not found`)); return; }
            else if (searchCourseFull_2nd.length <= 0) { callback(new Error(`${controllerName}: course_full[${index}] searchProductFull_2nd return not found`)); return; }
            else if (searchCourseFull_3rd.length <= 0) { callback(new Error(`${controllerName}: course_full[${index}] searchProductFull_3rd return not found`)); return; }
            else if (searchCourseFull_1st.length !== searchCourseFull_2nd.length) { callback(new Error(`${controllerName}: course_full[${index}] searchCourseFull_1st Length ${searchCourseFull_1st.length} and searchCourseFull_2nd Length ${searchCourseFull_2nd.length} is not equal`)); return; }
            else if (searchCourseFull_4th.length !== 1) { callback(new Error(`${controllerName}: course_full[${index}] searchCourseFull_4th Length ${searchCourseFull_4th.length} not equal 1`)); return; }
            else {
                const searchIn_map_course_full = map_course_full.filter(
                    where => (
                        where._ref_courseid === searchCourseFull_1st[0]._ref_courseid &&
                        where.course_price === searchCourseFull_1st[0].course_price
                    )
                );
                if (searchIn_map_course_full.length < 0) { callback(new Error(`${controllerName}: course_full[${index}] map data is error`)); return; }
                else if (searchIn_map_course_full.length === 0) {
                    map_course_full.push(
                        {
                            _ref_courseid: elementTmpProductFull._ref_courseid,
                            course_price: elementTmpProductFull.course_price,
                            course_count: elementTmpProductFull.course_count
                        }
                    );
                }
                else {
                    const findUpdate_indexOf = map_course_full.findIndex(where => where._ref_courseid === elementTmpProductFull._ref_courseid && where.course_price === elementTmpProductFull.course_price);

                    if (findUpdate_indexOf < 0) { callback(new Error(`${controllerName}: course_full[${index}] update map data is error`)); return; }
                    else {
                        map_course_full[findUpdate_indexOf].course_count = map_course_full[findUpdate_indexOf].course_count + elementTmpProductFull.course_count
                    }
                }
            }
        }

        callback(null);
        return {
            course_full: course_full,
            course: map_course_full
        };
    }
};

module.exports = Treatment_Save_CourseMapper_Controller;
