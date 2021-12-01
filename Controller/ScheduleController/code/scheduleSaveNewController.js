const schedule_Save_New_Controller = async (
    date = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _patientid: new String(''),
        data_schedule: new Object('')
    },
    callback = (err = new Error) => { }
) => {
    header = 'schedule_Save_New_Controller';
    const { patientModel, scheduleModel_Refactor } = require('../../mongodbController');
    const { checkObjectId, checkPatientId, checkAgentId, validateObjectId, validateSchedule_String_Date, validateDateTime, validate_String_AndNotEmpty, checkNull } = require('../../miscController');
    if (
        !validateObjectId(date._storeid) ||
        !validateObjectId(date._branchid) ||
        !validateObjectId(date._agentid) ||
        !validateObjectId(date._patientid) ||
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
        const find_check_patientid = await checkPatientId({ _storeid: date._storeid, _patientid: date._patientid }, (err) => { if (err) { callback(err); return; } });
        const find_chack_agent = await checkAgentId({ _storeid: date._storeid, _branchid: date._branchid, _agentid: date._agentid }, (err) => { if (err) { callback(err); return; } })

        const findPatient = await patientModel.aggregate(
            [
                {
                    '$unwind': {
                        'path': '$store'
                    }
                }, {
                    '$match': {
                        '_id': find_check_patientid._patientid,
                        'store._id': find_check_patientid._patientstoreid,
                        'store._storeid': find_check_patientid._storeid
                    }
                }, {
                    '$project': {
                        'pre_name': '$store.personal.pre_name',
                        'special_prename': '$store.personal.special_prename',
                        'first_name': '$store.personal.first_name',
                        'last_name': '$store.personal.last_name',
                        'patient_userid': '$_id',
                        'patient_userstoreid': '$store._id',
                        '_ref_storeid': '$store._storeid'
                    }
                }
            ], (err) => { if (err) { callback(err); return; } }
        );
        if (findPatient.length === 0) {
            callback(new Error(`${header} : this patient(${_patientid}) can't find in patientModel`));
            return;
        } else {
            const date_time_from = moment(date.data_schedule.dateFrom_string + ' ' + date.data_schedule.timeFrom_string);
            const date_time_to = moment(date.data_schedule.dateTo_string + ' ' + date.data_schedule.timeTo_string);
            const date_time_from_after = moment.utc(date.data_schedule.dateFrom_string + ' ' + date.data_schedule.timeFrom_string).utcOffset('+07:00');
            const date_time_to_after = moment.utc(date.data_schedule.dateTo_string + ' ' + date.data_schedule.timeTo_string).utcOffset('+07:00');

            const regex = async (data = new String('')) => {
                if (data != null && date != '') {
                    const new_date = WhiteSpace(data);                    
                    return new_date;
                } else {
                    const chack_null = await checkNull(data)
                    return chack_null;
                }
            }

            const mapData = {
                _ref_storeid: storeid, // ObjectId ร้าน
                _ref_branchid: barnchid, // ObjectId สาขา ของร้าน
                _ref_agent_userid: find_chack_agent._agentid, // ObjectId ของ Agent => ref: m_agents._id
                _ref_agent_userstoreid: find_chack_agent._agentstoreid, // ObjectId ของ Agent ใน Store => ref:  m_agents.store[]._id
                agent_pre_name: await regex(find_chack_agent.pre_name), // ชื่อนำหน้า Agent => ref: m_agents.store[].personal.pre_name ตาม Store นั้น ๆ
                agent_special_prename: await regex(find_chack_agent.special_prename), // ชื่อพิเศษ Agent => ref: m_agents.store[].personal.special_prename ตาม Store นั้น ๆ
                agent_first_name: await regex(find_chack_agent.first_name), // ชื่อจริง Agent => ref: m_agents.store[].personal.first_name ตาม Store นั้น ๆ
                agent_last_name: await regex(find_chack_agent.last_name), // ชื่อสกุล Agent => ref: m_agents.store[].personal.last_name ตาม Store นั้น ๆ

                _ref_patient_userid: findPatient[0].patient_userid, // ObjectId ของ Patient => ref: m_patients._id
                _ref_patient_userstoreid: findPatient[0].patient_userstoreid, // ObjectId ของ Patient ใน Store => ref:  m_patients.store[]._id
                patient_pre_name: await regex(findPatient[0].pre_name), // ชื่อนำหน้า Patient => ref: m_patients.store[].personal.pre_name ตาม Store นั้น ๆ
                patient_special_prename: await regex(findPatient[0].special_prename), // ชื่อพิเศษ Patient => ref: m_patients.store[].personal.special_prename ตาม Store นั้น ๆ
                patient_first_name: await regex(findPatient[0].first_name), // ชื่อจริง Patient => ref: m_patients.store[].personal.first_name ตาม Store นั้น ๆ
                patient_last_name: await regex(findPatient[0].last_name), // ชื่อสกุล Patient => ref: m_patients.store[].personal.last_name ตาม Store นั้น ๆ

                create_date: moment(), // Date Object ที่สร้างเอกสาร
                create_date_string: moment().format('YYYY-MM-DD'), // YYYY-MM-DD ที่สร้างเอกสาร
                create_time_string: moment().format('HH:mm:ss'), // HH:mm:ss ที่สร้างเอกสาร

                modify_date: moment(), // Date Object ที่แก้ไขเอกสาร
                modify_date_string: moment().format('YYYY-MM-DD'), // YYYY-MM-DD ที่แก้ไขเอกสาร
                modify_time_string: moment().format('HH:mm:ss'), // YYYY-MM-DD ที่แก้ไขเอกสาร

                dateFrom: date_time_from_after, // Date Object เวลานัด (เริ่ม)
                dateFrom_string: date_time_from.format('YYYY-MM-DD'), // YYYY-MM-DD เวลานัด (เริ่ม)
                timeFrom_string: date_time_from.format('HH:mm'), // HH:mm:ss เวลานัด (เริ่ม)

                dateTo: date_time_to_after, // Date Object เวลานัด (สิ้นสุด)
                dateTo_string: date_time_to.format('YYYY-MM-DD'), // YYYY-MM-DD เวลานัด (สิ้นสุด)
                timeTo_string: date_time_to.format('HH:mm'), // HH:mm:ss เวลานัด (สิ้นสุด)

                detail: await checkNull(date.data_schedule.detail), // รายละเอียด (บันทึก Free Text)

                status: 'นัดหมายไว้'
            };

            const transaction_scheduleModel = new scheduleModel_Refactor(mapData);
            const transactionSave = await transaction_scheduleModel.save()
                .then(
                    result => { return result; }
                )
                .catch(
                    err => {
                        callback(err);
                        return;
                    }
                );

            if (!transactionSave) {
                callback(new Error(`${header} : scheduleModel Save Error`));
                return;
            } else {
                callback(null);
                return transactionSave;
            }
        }
    }
};
module.exports = schedule_Save_New_Controller