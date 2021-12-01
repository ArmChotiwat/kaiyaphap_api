const reportXlsx_ScheduleModel_Refactor = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        datestart: new String(''),
        dateend: new String(''),
    },
    callback = (err = new Error) => { }) => {
    const momnet = require('moment');
    const excel4node = require('excel4node');
    const checkObjectId = require('../../mongodbController').checkObjectId;

    const scheduleModel_Refactor = require('../../mongodbController').scheduleModel_Refactor;

    // const thday = new Array("อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์");
    // const thmonth = new Array("มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม");
    if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error('reportExcelController => reportXlsx_ScheduleModel_Refactor: data._storeid is not String or is String or os Empty')); return; }
    else {
        let match
        if (data.datestart.length === 10 && data.dateend.length === 10) {
            match = {
                '$gte': momnet(data.datestart, 'YYYY-MM-DD', true).format('YYYY-MM-DD'), '$lte': momnet(data.dateend, 'YYYY-MM-DD', true).format('YYYY-MM-DD')
            }
        } else if (data.datestart.length !== 10 && data.dateend.length === 10) {
            match = {
                '$gte': momnet('1000-01-01', 'YYYY-MM-DD', true).format('YYYY-MM-DD'), '$lte': momnet(data.dateend, 'YYYY-MM-DD', true).format('YYYY-MM-DD')
            }
        } else if (data.datestart.length === 10 && data.dateend.length !== 10) {
            match = {
                '$gte': momnet(data.datestart, 'YYYY-MM-DD', true).format('YYYY-MM-DD'), '$lte': momnet().format('YYYY-MM-DD')
            }
        } else {
            match = {
                '$lte': momnet().format('YYYY-MM-DD')
            }
        }

        const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(new Error('reportExcelController => reportXlsx_ScheduleModel_Refactor: data._storeid cannot convert to ObjectId')); console.error(err); return; } });
        const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(new Error('reportExcelController => reportXlsx_ScheduleModel_Refactor: data._branchid cannot convert to ObjectId')); console.error(err); return; } });
        // const now = new Date()
        // const theTodayYear = (now.getFullYear() + 543);
        // const theTodayMonth = thmonth[now.getMonth()];
        // const theTodayDay = now.getDate();
        // const theTodayDayDesc = thday[now.getDay()];
        const getReport = await scheduleModel_Refactor.aggregate(
            [
                {
                    '$match': {
                        '_ref_storeid': _storeid,
                        '_ref_branchid': _branchid,
                        'dateFrom_string': match
                    }
                }, {
                    '$lookup': {
                        'from': 'm_patients',
                        'localField': '_ref_patient_userid',
                        'foreignField': '_id',
                        'as': 'patinetDetail'
                    }
                }, {
                    '$unwind': {
                        'path': '$patinetDetail'
                    }
                }, {
                    '$unwind': {
                        'path': '$patinetDetail.store'
                    }
                }, {
                    '$match': {
                        'patinetDetail.store._storeid': _storeid
                    }
                }, {
                    '$lookup': {
                        'from': 'm_agents',
                        'localField': '_ref_agent_userstoreid',
                        'foreignField': 'store._id',
                        'as': 'agentDetail'
                    }
                }, {
                    '$unwind': {
                        'path': '$agentDetail'
                    }
                }, {
                    '$unwind': {
                        'path': '$agentDetail.store'
                    }
                }, {
                    '$match': {
                        'agentDetail.store._storeid': _storeid
                    }
                }, {
                    '$addFields': {
                        'hn': '$patinetDetail.store.hn',
                        'patient_prename': '$patinetDetail.store.personal.pre_name',
                        'patient_special_prename': '$patinetDetail.store.personal.special_prename',
                        'agent_prename': '$agentDetail.store.personal.pre_name',
                        'agent_special_prename': '$agentDetail.store.personal.special_prename',
                        'agentname': {
                            '$concat': [
                                'คุณ ', '$agentDetail.store.personal.first_name', ' ', '$agentDetail.store.personal.last_name'
                            ]
                        },
                        'patientnamge': {
                            '$concat': [
                                'คุณ ', '$patinetDetail.store.personal.first_name', ' ', '$patinetDetail.store.personal.last_name'
                            ]
                        }
                    }
                }, {
                    '$sort': {
                        'dateFrom_string': 1
                    }
                }, {
                    '$match': {
                        '_ref_storeid': _storeid,
                        '_ref_branchid': _branchid,
                        'dateFrom_string': match
                    }
                }, {
                    '$sort': {
                        'dateFrom': 1
                    }
                }, {
                    '$project': {
                        '_id': null,
                        'agentname': '$agentname',
                        'patientnamge': '$patientnamge',
                        'detail': '$detail',
                        'date': '$dateFrom_string',
                        'time': {
                            '$concat': [
                                '$timeFrom_string', '-', '$timeTo_string'
                            ]
                        },
                        'hn': '$hn'
                    }
                }
            ]
        );
        try {

            const checkNull = async (date = '') => {
                if (date === null || !date || date === '') {
                    return 'ไม่ระบุ'
                } else {
                    return date
                }
            }

            let wBook = new excel4node.Workbook();
            let wSheet = wBook.addWorksheet('Sheet1');

            let new_date_start = match.$gte == '1000-01-01' || !match.$gte ? '-' : match.$gte
            wSheet.cell(1, 1).string('จาก : ' + new_date_start);
            wSheet.cell(1, 2).string('ถึง : ' + match.$lte);
            // Start Header
            wSheet.cell(2, 1).string('ลำดับ');
            wSheet.cell(2, 2).string('HN');
            wSheet.cell(2, 3).string('ชื่อ-นามสกุล ผู้นัดหมาย');
            wSheet.cell(2, 4).string('ชื่อ-นามสกุล นักกายภาพ');
            wSheet.cell(2, 5).string('ว/ด/ป ที่นัดหมาย');
            wSheet.cell(2, 6).string('เวลานัดหมาย');
            wSheet.cell(2, 7).string('รายละเอียด');
            // End Header

            // Start Render Detail      
            if (getReport.length > 0) {
                for (let idxData = 0; idxData < getReport.length; idxData++) {
                    const elementData = getReport[idxData];
                    const rowsData = idxData + 3;

                    wSheet.cell(rowsData, 1).string('' + (idxData + 1));
                    wSheet.cell(rowsData, 2).string('' + elementData.hn);
                    wSheet.cell(rowsData, 3).string('' + elementData.patientnamge);
                    wSheet.cell(rowsData, 4).string('' + elementData.agentname);
                    wSheet.cell(rowsData, 5).string('' + elementData.date);
                    wSheet.cell(rowsData, 6).string('' + elementData.time);
                    wSheet.cell(rowsData, 7).string('' + await checkNull(elementData.detail));
                }
            } else {
                wSheet.cell(3, 1).string('' + 'ไม่พบข้อมูล');
                wSheet.cell(3, 2).string('' + '-');
                wSheet.cell(3, 3).string('' + '-');
                wSheet.cell(3, 4).string('' + '-');
                wSheet.cell(3, 5).string('' + '-');
                wSheet.cell(3, 6).string('' + '-');
                wSheet.cell(3, 7).string('' + '-');
            }
            // End Render Detail
            return wBook;
        } catch (error) {
            console.error(error);
            callback(error);
            return;
        }
    }
};

module.exports = reportXlsx_ScheduleModel_Refactor;