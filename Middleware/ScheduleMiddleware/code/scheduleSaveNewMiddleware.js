const Express = require('express');
/** @type {Express.RequestHandler} */
const schedule_Save_New_Middleware = async (req, res, next) => {
    const miscController = require('../../../Controller/miscController')    
    const payload = req.body;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        
        if (!miscController.validateObjectId(payload.storeid)) { ErrorJson.description.push(`Paratmer <storeid> must be ObjectId String and Not Empty`); }
        if (!miscController.validateObjectId(payload.branchid)) { ErrorJson.description.push(`Paratmer <branchid> must be ObjectId String and Not Empty`); }
        if (!miscController.validateObjectId(payload.patientid)) { ErrorJson.description.push(`Paratmer <patientid> must be ObjectId String and Not Empty`); }
        if (!miscController.validateObjectId(payload.agentid)) { ErrorJson.description.push(`Paratmer <agentid> must be ObjectId String and Not Empty`); }
        if (!miscController.validateDateTime.validateDate_String(payload.data_schedule.dateFrom_string)) { ErrorJson.description.push(`Paratmer <data_schedule.dateFrom_string> must be  String and Not Null Empty`); }
        if (!miscController.validateDateTime.validateTime_String(payload.data_schedule.timeFrom_string)) { ErrorJson.description.push(`Paratmer <data_schedule.timeFrom_string> must be  String and Not Null Empty`); }
        if (!miscController.validateDateTime.validateDate_String(payload.data_schedule.dateTo_string)) { ErrorJson.description.push(`Paratmer <data_schedule.dateTo_string> must be  String and Not Null Empty`); }
        if (!miscController.validateDateTime.validateTime_String(payload.data_schedule.timeTo_string)) { ErrorJson.description.push(`Paratmer <data_schedule.timeTo_string> must be  String and Not Null Empty`); }
        if (!miscController.validate_StringOrNull_AndNotEmpty(payload.data_schedule.detail)) { ErrorJson.description.push(`Paratmer <data_schedule.detail> must be  String or NULL and Not  Empty`); }

        if (ErrorJson.description.length != 0) {console.log(ErrorJson); res.status(400).json(ErrorJson).end(); }
        else { next(); }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};

module.exports = schedule_Save_New_Middleware;