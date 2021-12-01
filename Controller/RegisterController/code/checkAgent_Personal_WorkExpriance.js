const checkAgent_Personal_WorkExpriance = async (
    work_expriance = [
        {
            location: '',
            year: '',
            description: '',
        }
    ],
    callback = (err = new Error) => {}
) => {
    const controllerName = 'checkAgent_Personal_WorkExpriance';

    const { validate_StringOrNull_AndNotEmpty }  = require('../../miscController');

    if (typeof work_expriance != 'object') { callback(new Error(`${controllerName}: <work_expriance> must be Array Object`)); return; }
    else if (work_expriance.length < 0) { callback(new Error(`${controllerName}: <work_expriance> must be length of Array Object (${work_expriance.length}) more than or equal 0`)); return; }
    else {
        for (let index = 0; index < work_expriance.length; index++) {
            const element = work_expriance[index];

            if (!validate_StringOrNull_AndNotEmpty(element.location)) { callback(new Error(`${controllerName}: <work_expriance[${index}].location> must be String or Null and Not Empty`)); return; }
            if (!validate_StringOrNull_AndNotEmpty(element.year)) { callback(new Error(`${controllerName}: <work_expriance[${index}].year> must be String or Null and Not Empty`)); return; }
            if (!validate_StringOrNull_AndNotEmpty(element.description)) { callback(new Error(`${controllerName}: <work_expriance[${index}].description> must be String or Null and Not Empty`)); return; }
        }

        callback(null);
        return work_expriance.map(
            where => ({
                location: where.location,
                year: where.year,
                description: where.description,
            })
        );
    }
};



module.exports = checkAgent_Personal_WorkExpriance;