/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const schedule_Edit_Middleware = async (req, res, next) => {
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty, checkAgentId, currentDateTime } = require('../../../Controller/miscController');
    const moment = require('moment');

    try {
        /**
         * @typedef {Object} data_schedule_type
         * @property {String} dateFrom_string - YYYY-MM-DD
         * @property {String} timeFrom_string - HH:mm:ss
         * @property {String} dateTo_string - YYYY-MM-DD
         * @property {String} timeTo_string - HH:mm:ss
         * @property {String} detail
         * 
         * @typedef {Object} schedule_Edit_Middleware_Type
         * @property {String} _ref_storeid - String ObjectId
         * @property {String} _ref_branchid - String ObjectId
         * @property {String} _ref_scheduleid - String ObjectId
         * @property {String} _ref_agent_userstoreid - String ObjectId
         * @property {data_schedule_type} data_schedule
         */

        /** @type schedule_Edit_Middleware_Type */
        const payload = req.body;

        if (!validate_StringObjectId_NotNull(payload._ref_storeid)) { ErrorJson.description.push(`Paratmer <_ref_storeid> must be String ObjectId and Not Empty`); }
        if (!validate_StringObjectId_NotNull(payload._ref_branchid)) { ErrorJson.description.push(`Paratmer <_ref_branchid> must be String ObjectId and Not Empty`); }
        if (!validate_StringObjectId_NotNull(payload._ref_scheduleid)) { ErrorJson.description.push(`Paratmer <_ref_scheduleid> must be String ObjectId and Not Empty`); }
        if (!validate_StringObjectId_NotNull(payload._ref_agent_userstoreid)) { ErrorJson.description.push(`Paratmer <_ref_agent_userstoreid> must be String ObjectId and Not Empty`); }

        if (validate_StringObjectId_NotNull(payload._ref_storeid) && validate_StringObjectId_NotNull(payload._ref_branchid) && validate_StringObjectId_NotNull(payload._ref_agent_userstoreid)) {
            const chkTerapist = await checkAgentId(
                {
                    _storeid: String(payload._ref_storeid),
                    _branchid: String(payload._ref_branchid),
                    _agentid: String(payload._ref_agent_userstoreid),
                },
                (err) => { if (err) { throw err; } }
            );

            if (!chkTerapist || chkTerapist.role !== 2) { res.status(401).end(); return; }
        }

        if (typeof payload.data_schedule != 'object') { ErrorJson.description.push(`Paratmer <data_schedule> must be Object`); }
        else {
            const currentDateOnly = moment(currentDateTime().currentDate_String, 'YYYY-MM-DD', true);
            const data_schedule = payload.data_schedule;

            if (!validate_String_AndNotEmpty(data_schedule.dateFrom_string)) { ErrorJson.description.push(`Paratmer <data_schedule.dateFrom_string> must be String "YYYY-MM-DD" and Not Empty`); }
            if (!validate_String_AndNotEmpty(data_schedule.timeFrom_string)) { ErrorJson.description.push(`Paratmer <data_schedule.timeFrom_string> must be String "HH:mm:ss" and Not Empty`); }
            if (validate_String_AndNotEmpty(data_schedule.dateFrom_string) && validate_String_AndNotEmpty(data_schedule.timeFrom_string)) {
                if (!(moment(`${data_schedule.dateFrom_string}`, 'YYYY-MM-DD', true).isValid())) { ErrorJson.description.push(`Paratmer <data_schedule.dateFrom_string> must be String "YYYY-MM-DD"`); }
                if (!(moment(`${data_schedule.timeFrom_string}`, 'HH:mm:ss', true).isValid())) { ErrorJson.description.push(`Paratmer <data_schedule.timeFrom_string> must be String "HH:mm:ss"`); }
                
                if (moment(`${data_schedule.dateFrom_string}`, 'YYYY-MM-DD', true).isValid() && moment(`${data_schedule.timeFrom_string}`, 'HH:mm:ss', true).isValid()) {
                    if (!(moment(`${data_schedule.dateFrom_string} ${data_schedule.timeFrom_string}`, 'YYYY-MM-DD HH:mm:ss', true).isValid())) {
                        ErrorJson.description.push(`Paratmer <data_schedule.dateFrom_string> must be String "YYYY-MM-DD"`);
                        ErrorJson.description.push(`Paratmer <data_schedule.timeFrom_string> must be String "HH:mm:ss"`);
                    }
                    else {
                        if (moment(`${data_schedule.dateFrom_string} ${data_schedule.timeFrom_string}`, 'YYYY-MM-DD HH:mm:ss', true).valueOf() < currentDateOnly.valueOf()) {
                            ErrorJson.description.push(`Paratmer <data_schedule.dateFrom_string> Date Must Greater than or Equal Current Date`);
                        }
                    }
                }
            }

            if (!validate_String_AndNotEmpty(data_schedule.dateTo_string)) { ErrorJson.description.push(`Paratmer <data_schedule.dateTo_string> must be String "YYYY-MM-DD" and Not Empty`); }
            if (!validate_String_AndNotEmpty(data_schedule.timeTo_string)) { ErrorJson.description.push(`Paratmer <data_schedule.timeTo_string> must be String "HH:mm:ss" and Not Empty`); }
            if (validate_String_AndNotEmpty(data_schedule.dateTo_string) && validate_String_AndNotEmpty(data_schedule.timeTo_string)) {
                if (!(moment(`${data_schedule.dateTo_string}`, 'YYYY-MM-DD', true).isValid())) { ErrorJson.description.push(`Paratmer <data_schedule.dateTo_string> must be String "YYYY-MM-DD"`); }
                if (!(moment(`${data_schedule.timeTo_string}`, 'HH:mm:ss', true).isValid())) { ErrorJson.description.push(`Paratmer <data_schedule.timeTo_string> must be String "HH:mm:ss"`); }
                
                if (moment(`${data_schedule.dateTo_string}`, 'YYYY-MM-DD', true).isValid() && moment(`${data_schedule.timeTo_string}`, 'HH:mm:ss', true).isValid()) {
                    if (!(moment(`${data_schedule.dateTo_string} ${data_schedule.timeTo_string}`, 'YYYY-MM-DD HH:mm:ss', true).isValid())) {
                        ErrorJson.description.push(`Paratmer <data_schedule.dateTo_string> must be String "YYYY-MM-DD"`);
                        ErrorJson.description.push(`Paratmer <data_schedule.timeTo_string> must be String "HH:mm:ss"`);
                    }
                    else {
                        if (moment(`${data_schedule.dateTo_string} ${data_schedule.timeTo_string}`, 'YYYY-MM-DD HH:mm:ss', true).valueOf() < currentDateOnly.valueOf()) {
                            ErrorJson.description.push(`Paratmer <data_schedule.dateTo_string> Date Must Greater than or Equal Current Date`);
                        }
                    }
                }
            }

            if (moment(`${data_schedule.dateFrom_string} ${data_schedule.timeFrom_string}`, 'YYYY-MM-DD HH:mm:ss', true).isValid() && moment(`${data_schedule.dateTo_string}`, 'YYYY-MM-DD', true).isValid() && moment(`${data_schedule.timeTo_string}`, 'HH:mm:ss', true).isValid()) {
                if (moment(`${data_schedule.dateFrom_string} ${data_schedule.timeFrom_string}`, 'YYYY-MM-DD HH:mm:ss', true).valueOf() > moment(`${data_schedule.dateTo_string} ${data_schedule.timeTo_string}`, 'YYYY-MM-DD HH:mm:ss', true)) {
                    ErrorJson.description.push(`Paratmer <data_schedule.timeFrom_string> Must Lower than or Equal Paratmer <data_schedule.dateTo_string>`);
                }
            }
        }

        if (ErrorJson.description.length > 0) { res.status(400).json(ErrorJson).end(); return; }
        else {
            next();
            return;
        }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        ErrorJson.http_code = 422;
        res.status(422).json(ErrorJson).end();
        return;
    }
};


module.exports = schedule_Edit_Middleware;