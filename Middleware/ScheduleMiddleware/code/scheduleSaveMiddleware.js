const Express = require('express');
/** @type {Express.RequestHandler} */
const schedule_Save_Middleware = async (req, res, next) => {
    const miscController = require('../../../Controller/miscController')
    const moment = require('moment');
    const validateObjectId = miscController.validateObjectId;
    const validate_String_AndNotEmpty = miscController.validate_String_AndNotEmpty
    const validateDate_String = require('../../../Controller/miscController/code/validateDateTime').validateDate_String
    const validateSchedule_String_Time = require('../../../Controller/miscController/code/validateSchedule_String_Time')
    const checkObjectId = miscController.checkObjectId
    const mongodbController = require('../../../Controller/mongodbController')
    const payload = req.body;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        if (typeof payload._storeid !== 'string' || payload._storeid === '' || !validateObjectId(payload._storeid)) { ErrorJson.description.push(`Paratmer <_storeid> must be ObjectId String and Not Empty`); }
        if (typeof payload._barnchid !== 'string' || payload._barnchid === '' || !validateObjectId(payload._barnchid)) { ErrorJson.description.push(`Paratmer <_barnchid> must be ObjectId String and Not Empty`); }
        if (typeof payload.data._patientid !== 'string' || payload.data._patientid === '' || !validateObjectId(payload.data._patientid)) { ErrorJson.description.push(`Paratmer <_patientid> must be ObjectId String and Not Empty`); }
        if (typeof payload.data._agentid !== 'string' || payload.data._agentid === '' || !validateObjectId(payload.data._agentid)) { ErrorJson.description.push(`Paratmer <_agentid> must be ObjectId String and Not Empty`); }
        if (typeof payload.data.status !== 'string' || !validate_String_AndNotEmpty(payload.data.status)) { ErrorJson.description.push(`Paratmer <status> can't use ${payload.data.status}`); }
        if (typeof payload.data.detail !== 'string') { ErrorJson.description.push(`Paratmer <detail> must be String and Not Empty`); }
        if (typeof payload.data.date !== 'string' || !validateDate_String(payload.data.date)) {
            ErrorJson.description.push(`Paratmer <date> must be String and Not Empty`);
        } else if (miscController.validateSchedule_String_Date(payload.data.date) === false) {
            ErrorJson.description.push(`Paratmer <date> must be present date or future date`);
        }
        if (typeof payload.data.timeFrom !== 'string' || !validate_String_AndNotEmpty(payload.data.timeFrom)) {
            ErrorJson.description.push(`Paratmer <timeFrom> must be String and Not Empty`);
        } else if (validateSchedule_String_Time(payload.data.timeFrom) === false) {
            ErrorJson.description.push(`Paratmer <timeFrom> must be present time or future time`);
        }
        if (typeof payload.data.timeTo !== 'string' || !validate_String_AndNotEmpty(payload.data.timeTo)) { ErrorJson.description.push(`Paratmer <timeTo> must be String and Not Empty`); }
        if (typeof payload.data.agentname !== 'string' || !validate_String_AndNotEmpty(payload.data.agentname)) { ErrorJson.description.push(`Paratmer <agentname> must be String and Not Empty`); }
        if (ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { next(); }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};

module.exports = schedule_Save_Middleware;