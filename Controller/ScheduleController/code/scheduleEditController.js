const schedule_Edit_Controller = async (
    date = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _scheduleid: new String(''),
        data_schedule: new Object('')
    },
    callback = (err = new Error) => { }
) => {
    const header = 'schedule_Edit_Controller';
    const { scheduleModel_Refactor } = require('../../mongodbController');
    const { checkObjectId, checkAgentId, validateObjectId, validateSchedule_String_Date, validateDateTime, validate_String_AndNotEmpty, checkNull } = require('../../miscController');
    if (
        !validateObjectId(date._storeid) ||
        !validateObjectId(date._branchid) ||
        !validateObjectId(date._agentid) ||
        !validateObjectId(date._scheduleid) ||
        !validateSchedule_String_Date(date.data_schedule.dateFrom_string) ||
        !validateSchedule_String_Date(date.data_schedule.dateTo_string) ||
        !validateDateTime.validateTime_String(date.data_schedule.timeFrom_string) ||
        !validateDateTime.validateTime_String(date.data_schedule.timeTo_string)
    ) {
        callback(new Error(`${header} : data Error`));
        return;
    } else {

        const WhiteSpace = require('../../miscController/code/regExReplace_RefactorProductName_WhiteSpace')
        const moment = require('moment');
        const storeid = await checkObjectId(date._storeid, (err) => { if (err) { callback(err); return; } });
        const barnchid = await checkObjectId(date._branchid, (err) => { if (err) { callback(err); return; } });
        const scheduleid = await checkObjectId(date._scheduleid, (err) => { if (err) { callback(err); return; } });
        const find_chack_agent = await checkAgentId({ _storeid: date._storeid, _branchid: date._branchid, _agentid: date._agentid }, (err) => { if (err) { callback(err); return; } })

        const find_scheduleModel_Refactor = await scheduleModel_Refactor.aggregate(
            [
                {
                    '$match': {
                        '_id': scheduleid,
                        '_ref_storeid': storeid,
                        '_ref_branchid': barnchid,
                        'status': {
                            '$eq': 'นัดหมายไว้'
                        }
                    }
                }
            ], (err) => { if (err) { callback(err); return; } }
        );

        if (find_scheduleModel_Refactor.length !== 1 || !find_scheduleModel_Refactor) {
            callback(new Error(`${header} : this patient(${date._scheduleid}) can't find in scheduleModel_Refactor`));
            return;
        } else {

            const regex = async (data = new String('')) => {
                if (data !== null && date != '') {
                    const new_date = WhiteSpace(data);
                    return new_date;
                } else {
                    const chack_null = await checkNull(data)
                    return chack_null;
                }
            }

            const date_time_from = moment(date.data_schedule.dateFrom_string + ' ' + date.data_schedule.timeFrom_string);
            const date_time_to = moment(date.data_schedule.dateTo_string + ' ' + date.data_schedule.timeTo_string);
            const date_time_from_after = moment.utc(date.data_schedule.dateFrom_string + ' ' + date.data_schedule.timeFrom_string).utcOffset('+07:00');
            const date_time_to_after = moment.utc(date.data_schedule.dateTo_string + ' ' + date.data_schedule.timeTo_string).utcOffset('+07:00');

            if (find_scheduleModel_Refactor[0]._ref_agent_userid !== find_chack_agent._agentid) {
                find_scheduleModel_Refactor[0]._ref_agent_userid = find_chack_agent._agentid;
                find_scheduleModel_Refactor[0]._ref_agent_userstoreid = find_chack_agent._agentstoreid;
                find_scheduleModel_Refactor[0].agent_special_prename = await regex(find_chack_agent.special_prename);
                find_scheduleModel_Refactor[0].agent_last_name = await regex(find_chack_agent.last_name);
                find_scheduleModel_Refactor[0].agent_first_name = await regex(find_chack_agent.first_name);
                find_scheduleModel_Refactor[0].agent_pre_name = await regex(find_chack_agent.pre_name);
            }

            if (find_scheduleModel_Refactor[0].dateFrom !== date_time_from_after) {
                find_scheduleModel_Refactor[0].dateFrom = date_time_from_after
                find_scheduleModel_Refactor[0].dateFrom_string = date_time_from.format('YYYY-MM-DD')
                find_scheduleModel_Refactor[0].timeFrom_string = date_time_from.format('HH:mm')
            }

            if (find_scheduleModel_Refactor[0].dateTo !== date_time_to_after) {
                find_scheduleModel_Refactor[0].dateTo = date_time_to_after
                find_scheduleModel_Refactor[0].dateTo_string = date_time_to.format('YYYY-MM-DD')
                find_scheduleModel_Refactor[0].timeTo_string = date_time_to.format('HH:mm')
            }

            const check_detall = await regex(date.data_schedule.detail);
            if (find_scheduleModel_Refactor[0].detail !== check_detall) {
                find_scheduleModel_Refactor[0].detail = check_detall;
            }

            find_scheduleModel_Refactor[0].modify_date = moment()
            find_scheduleModel_Refactor[0].modify_date_string = moment().format('YYYY-MM-DD')
            find_scheduleModel_Refactor[0].modify_time_string = moment().format('HH:mm')

            // console.log(date._scheduleid);

            const transactionUpdate = await scheduleModel_Refactor.findByIdAndUpdate(
                find_scheduleModel_Refactor[0]._id,
                {
                    $set: {
                        _ref_agent_userid: find_scheduleModel_Refactor[0]._ref_agent_userid,
                        _ref_agent_userstoreid: find_scheduleModel_Refactor[0]._ref_agent_userstoreid,
                        agent_pre_name: find_scheduleModel_Refactor[0].agent_pre_name,
                        agent_special_prename: find_scheduleModel_Refactor[0].agent_special_prename,
                        agent_first_name: find_scheduleModel_Refactor[0].agent_first_name,
                        agent_last_name: find_scheduleModel_Refactor[0].agent_last_name,
                        modify_date: find_scheduleModel_Refactor[0].modify_date,
                        modify_date_string: find_scheduleModel_Refactor[0].modify_date_string,
                        modify_time_string: find_scheduleModel_Refactor[0].modify_time_string,
                        dateFrom: find_scheduleModel_Refactor[0].dateFrom,
                        dateFrom_string: find_scheduleModel_Refactor[0].dateFrom_string,
                        timeFrom_string: find_scheduleModel_Refactor[0].timeFrom_string,
                        dateTo: find_scheduleModel_Refactor[0].dateTo,
                        dateTo_string: find_scheduleModel_Refactor[0].dateTo_string,
                        timeTo_string: find_scheduleModel_Refactor[0].timeTo_string,
                        detail: find_scheduleModel_Refactor[0].detail,
                    }
                }, (err) => { if (err) { callback(err); return; } }
            )        
            if (!transactionUpdate) {
                callback(new Error(`${header} : scheduleModel_Refactor Edit Error`));
                return;
            } else {
                callback(null);
                return transactionUpdate;
            }
        }
    }
};

module.exports = schedule_Edit_Controller