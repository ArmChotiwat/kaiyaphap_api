const checkAgent_Personal_EducatedHistory = async (
    educated_histroy = [
        {
            deegree: '',
            faculty: '',
            educatedYear: '',
            university: '',
        }
    ],
    callback = (err = new Error) => {}
) => {
    const controllerName = 'checkAgent_Personal_EducateaHistory';

    const { validate_String_AndNotEmpty }  = require('../../miscController');

    if (typeof educated_histroy != 'object') { callback(new Error(`${controllerName}: <educated_histroy> must be Array Object`)); return; }
    else if (educated_histroy.length < 0) { callback(new Error(`${controllerName}: <educated_histroy> must be length of Array Object (${educated_histroy.length}) more than or equal 0`)); return; }
    else {
        for (let index = 0; index < educated_histroy.length; index++) {
            const element = educated_histroy[index];

            if (!validate_String_AndNotEmpty(element.deegree)) { callback(new Error(`${controllerName}: <educated_histroy[${index}].deegree> must be String and Not Empty`)); return; }
            if (!validate_String_AndNotEmpty(element.faculty)) { callback(new Error(`${controllerName}: <educated_histroy[${index}].faculty> must be String and Not Empty`)); return; }
            if (!validate_String_AndNotEmpty(element.educatedYear)) { callback(new Error(`${controllerName}: <educated_histroy[${index}].educatedYear> must be String and Not Empty`)); return; }
            if (!validate_String_AndNotEmpty(element.university)) { callback(new Error(`${controllerName}: <educated_histroy[${index}].university> must be String and Not Empty`)); return; }
        }

        callback(null);
        return educated_histroy.map(
            where => ({
                deegree: where.deegree,
                faculty: where.faculty,
                educatedYear: where.educatedYear,
                university: where.university,
            })
        );
    }
};



module.exports = checkAgent_Personal_EducatedHistory;