(
    async () => {
        const moment = require('moment');
        const { mongoose, ObjectId, scheduleModel, scheduleModel_Refactor, agentModel, patientModel } = require('../Controller/mongodbController');
        try {
            const findData = await scheduleModel.find(
                {},
                {},
                (err) => { if (err) { throw err; } }
            );
            if (!findData) { throw new Error(`findData have error`) }
            else {
                for (let index = 0; index < findData.length; index++) {
                    const resultStoreBranch = findData[index];

                    const _ref_storeid = resultStoreBranch._storeid;
                    const _ref_branchid = resultStoreBranch._barnchid;

                    process.stdout.write(`Validate Data from Documents ${index + 1} ... of Documents ${findData.length}\n`);

                    if (resultStoreBranch.data) {
                        for (let loop = 0; loop < resultStoreBranch.data.length; loop++) {
                            process.stdout.write(`Data (${index+1}) Document processed ${loop+1} of ${resultStoreBranch.data.length}\r`);
                            

                            const resultStoreBranch_Schedule = resultStoreBranch.data[loop];

                            const _ref_scheduleid = resultStoreBranch_Schedule._id;
                            const _ref_agent_userstoreid = resultStoreBranch_Schedule._agentid;
                            const _ref_patient_userid = resultStoreBranch_Schedule._patientid;
                            const schedule_detail = resultStoreBranch_Schedule.detail;
                            const schedule_status = resultStoreBranch_Schedule.status;
                            const schedule_date_String = resultStoreBranch_Schedule.date;
                            const schedule_timeFrom_String = resultStoreBranch_Schedule.timeFrom;
                            const schedule_timeTo_String = resultStoreBranch_Schedule.timeTo;

                            const findAgent = await agentModel.aggregate(
                                [
                                    {
                                        '$match': {
                                            'store._id': _ref_agent_userstoreid,
                                            'store._storeid': _ref_storeid,
                                            'store.branch._branchid': _ref_branchid
                                        }
                                    }, {
                                        '$unwind': {
                                            'path': '$store'
                                        }
                                    }, {
                                        '$match': {
                                            'store._id': _ref_agent_userstoreid,
                                            'store._storeid': _ref_storeid,
                                            'store.branch._branchid': _ref_branchid
                                        }
                                    }, {
                                        '$unwind': {
                                            'path': '$store.branch'
                                        }
                                    }, {
                                        '$match': {
                                            'store.branch._branchid': _ref_branchid
                                        }
                                    }, {
                                        '$project': {
                                            '_id': 0,
                                            '_ref_agent_userid': '$_id',
                                            '_ref_agent_userstoreid': '$store._id',
                                            '_ref_storeid': '$store._storeid',
                                            '_ref_branchid': '$store.branch._branchid',
                                            'pre_name': '$store.personal.pre_name',
                                            'special_pre_name': {
                                                '$cond': {
                                                    'if': {
                                                        '$eq': [
                                                            '$store.personal.pre_name', 'อื่นๆ'
                                                        ]
                                                    },
                                                    'then': '$store.personal.special_prename',
                                                    'else': null
                                                }
                                            },
                                            'first_name': '$store.personal.first_name',
                                            'last_name': '$store.personal.last_name'
                                        }
                                    }
                                ],
                                (err) => { if (err) { throw err; } }
                            );

                            const findPatient = await patientModel.aggregate(
                                [
                                    {
                                        '$match': {
                                            '_id': _ref_patient_userid,
                                        }
                                    }, {
                                        '$unwind': {
                                            'path': '$store'
                                        }
                                    }, {
                                        '$match': {
                                            'store._storeid': _ref_storeid
                                        }
                                    }, {
                                        '$project': {
                                            '_id': 0,
                                            '_ref_patient_userid': '$_id',
                                            '_ref_patient_userstoreid': '$store._id',
                                            '_ref_storeid': '$store._storeid',
                                            'pre_name': '$store.personal.pre_name',
                                            'special_pre_name': {
                                                '$cond': {
                                                    'if': {
                                                        '$eq': [
                                                            '$store.personal.pre_name', 'อื่นๆ'
                                                        ]
                                                    },
                                                    'then': {
                                                        '$ifNull': [
                                                            '$store.personal.special_prename', null
                                                        ]
                                                    },
                                                    'else': null
                                                }
                                            },
                                            'first_name': '$store.personal.first_name',
                                            'last_name': '$store.personal.last_name'
                                        }
                                    }
                                ],
                                (err) => { if (err) { throw err; } }
                            );

                            if (!findAgent) { throw new Error(`findAgent have error during aggregate`); }
                            else if (!findPatient) { throw new Error(`findPatient have error during aggregate`); }
                            else {
                                if (findAgent.length === 1 && findPatient.length === 1) {
                                    const dataTableB = {
                                        Req_ref_storeid: String(_ref_storeid),
                                        Res_ref_storeid_Agent: String(findAgent[0]._ref_storeid),
                                        Res_ref_storeid_Patient: String(findPatient[0]._ref_storeid),

                                        Req_ref_branchid: String(_ref_branchid),
                                        Res_ref_branchid_Agent: String(findAgent[0]._ref_branchid),

                                        Res_ref_agent_userid: String(findAgent[0]._ref_agent_userid),

                                        Req_ref_agent_userstoreid: String(_ref_agent_userstoreid),
                                        Res_ref_agent_userstoreid: String(findAgent[0]._ref_agent_userstoreid),

                                        agent_pre_name: findAgent[0].pre_name,
                                        agent_special_pre_name: findAgent[0].special_pre_name,
                                        agent_first_name: findAgent[0].first_name,
                                        agent_last_name: findAgent[0].last_name,

                                        Req_ref_patient_userid : String(_ref_patient_userid),
                                        Res_ref_patient_userid: String(findPatient[0]._ref_patient_userid),
                                        Res_ref_patient_userstoreid: String(findPatient[0]._ref_patient_userstoreid),

                                        patient_pre_name: findPatient[0].pre_name,
                                        patient_special_pre_name: findPatient[0].special_pre_name,
                                        patient_first_name: findPatient[0].first_name,
                                        patient_last_name: findPatient[0].last_name,

                                        schedule_detail: (schedule_detail === null| schedule_detail == '') ? null:schedule_detail,
                                        schedule_status,
                                        
                                        schedule_date_String,
                                        schedule_timeFrom_String: `${schedule_timeFrom_String}:00`,
                                        schedule_timeTo_String: `${schedule_timeTo_String}:00`,

                                        schedule_dateFrom: moment(`${schedule_date_String} ${schedule_timeFrom_String}`, 'YYYY-MM-DD HH:mm').utcOffset("+7:00"),
                                        schedule_dateTo: moment(`${schedule_date_String} ${schedule_timeTo_String}`, 'YYYY-MM-DD HH:mm').utcOffset("+7:00"),
                                    };
                                    if (
                                        String(dataTableB.Req_ref_storeid) !== String(dataTableB.Res_ref_storeid_Agent)
                                        || String(dataTableB.Req_ref_storeid) !== String(dataTableB.Res_ref_storeid_Patient)
                                        || String(dataTableB.Res_ref_storeid_Agent) !== String(dataTableB.Res_ref_storeid_Patient)
                                        || String(dataTableB.Req_ref_branchid) !== String(dataTableB.Res_ref_branchid_Agent)
                                        || String(dataTableB.Req_ref_agent_userstoreid) !== String(dataTableB.Res_ref_agent_userstoreid)
                                        || String(dataTableB.Req_ref_patient_userid) !== String(dataTableB.Res_ref_patient_userid)
                                        
                                    ) { throw new Error(`Req/Res Compare are false`); }
                                    else {
                                        // console.table(dataTableB);
                                        const MAP_DATA_Schedule = {
                                            _id: _ref_scheduleid,
                                            _ref_storeid: ObjectId(dataTableB.Req_ref_storeid),
                                            _ref_branchid: ObjectId(dataTableB.Req_ref_branchid),
                                            _ref_agent_userid: ObjectId(dataTableB.Res_ref_agent_userid),
                                            _ref_agent_userstoreid: ObjectId(dataTableB.Res_ref_agent_userstoreid),
                                            agent_pre_name: dataTableB.agent_pre_name,
                                            agent_special_prename: dataTableB.agent_special_pre_name,
                                            agent_first_name: dataTableB.agent_first_name,
                                            agent_last_name: dataTableB.agent_last_name,
                                            _ref_patient_userid: ObjectId(dataTableB.Res_ref_patient_userid),
                                            _ref_patient_userstoreid: ObjectId(dataTableB.Res_ref_patient_userstoreid),
                                            patient_pre_name: dataTableB.patient_pre_name,
                                            patient_special_prename: dataTableB.patient_special_pre_name,
                                            patient_first_name: dataTableB.patient_first_name,
                                            patient_last_name: dataTableB.patient_last_name,

                                            create_date: moment(ObjectId(_ref_scheduleid).getTimestamp()).utcOffset("+7:00"),
                                            create_date_string: moment(ObjectId(_ref_scheduleid).getTimestamp()).utcOffset("+7:00").format("YYYY-MM-DD"),
                                            create_time_string: moment(ObjectId(_ref_scheduleid).getTimestamp()).utcOffset("+7:00").format("HH:mm:ss"),

                                            modify_date: moment(ObjectId(_ref_scheduleid).getTimestamp()),
                                            modify_date_string: moment(ObjectId(_ref_scheduleid).getTimestamp()).utcOffset("+7:00").format("YYYY-MM-DD"),
                                            modify_time_string: moment(ObjectId(_ref_scheduleid).getTimestamp()).utcOffset("+7:00").format("HH:mm:ss"),

                                            dateFrom: dataTableB.schedule_dateFrom,
                                            dateFrom_string: dataTableB.schedule_dateFrom.format("YYYY-MM-DD"),
                                            timeFrom_string: dataTableB.schedule_dateFrom.format("HH:mm:ss"),

                                            dateTo: dataTableB.schedule_dateTo,
                                            dateTo_string: dataTableB.schedule_dateTo.format("YYYY-MM-DD"),
                                            timeTo_string: dataTableB.schedule_dateTo.format("HH:mm:ss"),

                                            detail: dataTableB.schedule_detail,
                                            status: dataTableB.schedule_status
                                        };

                                        const newDocument_Schedule_Refactor = new scheduleModel_Refactor(MAP_DATA_Schedule);
                                        const validateDocument = newDocument_Schedule_Refactor.validateSync();
                                        if (validateDocument) {
                                            throw new Error(`scheduleModel_Refactor Validate return failed at _ref_storeid: ${String(_ref_storeid)}, _ref_branchid: ${String(_ref_branchid)}, _ref_scheduleid: ${_ref_scheduleid}`);
                                        }
                                        else {
                                            await newDocument_Schedule_Refactor.save().then(result => result).catch(err => { if (err) { throw err; } });
                                        }
                                    }
                                }
                                else {
                                    throw new Error(`Agent/Patient Not Found`);
                                }
                            }
                        }
                    }

                    process.stdout.clearLine();
                }

                console.log('\nMigrate Data passed!');
            }
        } catch (error) {
            console.log('\nMigrate Data failed');
            console.error(error);
        }
        finally {
            mongoose.disconnect();
        }
    }
)()