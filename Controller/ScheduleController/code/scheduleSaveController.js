const schedule_Save_Controller = async (payload, callback = (err = new Error) => { }) => {
    header = 'schedule_Save_Controller';

    if (typeof payload !== 'object' || payload == '' || payload == null) {
        callback(new Error(`${header} : data Error`));
        return;
    } else {
        if (payload.data.status != 'นัดหมายไว้' && payload.data.status != 'รอรับการรักษา') {
            callback(new Error(`${header} : syntax status error`));
            return;
        } else {
            const { scheduleModel, patientModel } = require('../../mongodbController');
            const { checkObjectId, checkPatientId } = require('../../miscController');
            const WhiteSpace = require('../../miscController/code/regExReplace_RefactorProductName_WhiteSpace')
            const storeid = await checkObjectId(payload._storeid, (err) => { if (err) { callback(err); return; } });
            const barnchid = await checkObjectId(payload._barnchid, (err) => { if (err) { callback(err); return; } });
            const patientid = await checkObjectId(payload.data._patientid, (err) => { if (err) { callback(err); return; } });
            const agentid = await checkObjectId(payload.data._agentid, (err) => { if (err) { callback(err); return; } });
            const find_check_patientid = await checkPatientId({ _storeid: payload._storeid, _patientid: payload.data._patientid }, (err) => { if (err) { callback(err); return; } });

            const find_name_patient = await patientModel.aggregate(
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
                            'name': {
                                '$concat': [
                                    '$store.personal.first_name', ' ', '$store.personal.last_name'
                                ]
                            }
                        }
                    }
                ], (err) => { if (err) { callback(err); return; } }
            );
            if (find_name_patient.length === 0) {
                callback(new Error(`${header} : this patient(${payload.data._patientid}) can't find in patientModel`));
                return;
            } else {
                find_name_patient[0].name = WhiteSpace(find_name_patient[0].name)
                const findLocked = await scheduleModel.aggregate(
                    [
                        {
                            '$match': {
                                '_storeid': storeid,
                                '_barnchid': barnchid,
                            }
                        }, {
                            '$unwind': {
                                'path': '$data'
                            }
                        }, {
                            '$match': {
                                'data._patientid': patientid,
                                'data.date': payload.data.date,
                                'data.timeFrom': payload.data.timeFrom,
                                'data.timeTo': payload.data.timeTo,
                                '$or': [
                                    { 'data.status': 'นัดหมายไว้' }, { 'data.status': 'รอรับการรักษา' }
                                ]
                            }
                        }
                    ], (err) => { if (err) { callback(err); return; } }
                );
                if (findLocked.length != 0) {
                    callback(new Error(`${header} : this patient(${payload.data._patientid}) have data in scheduleModel`));
                    return;
                }
                else {
                    const findSchedule = await scheduleModel.findOne(
                        {
                            "_storeid": payload._storeid,
                            "_barnchid": payload._barnchid
                        },
                        {
                            "_id": 1
                        },
                        (errors) => {
                            if (errors) {
                                callback(new Error(`${header} : findSchedule Error`));
                                return;
                            };
                        }
                    );
                    if (!findSchedule) {
                        const mapData = {
                            _storeid: storeid,
                            _barnchid: barnchid,
                            data: [
                                {
                                    _agentid: agentid, // ObjectID ของ นักกายภาพ
                                    agentname: payload.data.agentname, // ชื่อ นักกายภาพ
                                    _patientid: patientid, // ObjectID ของ ผู้ป่วย
                                    patientnamge: find_name_patient[0].name, // ชื่อผู้ป่วย
                                    detail: payload.data.detail, // รายละเอียด
                                    status: payload.data.status, // สถาณะการทำงาน
                                    date: payload.data.date, // วันที่นัด
                                    timeFrom: payload.data.timeFrom, // เลลานัด
                                    timeTo: payload.data.timeTo // เลลานัด
                                }
                            ]
                        };
                        const transactionSave = new scheduleModel(mapData)
                        await transactionSave.save(
                            (errors) => {
                                if (errors) {
                                    callback(new Error(`${header} : scheduleModel Save Error`));
                                    return;
                                } else {
                                    callback(null);
                                    return transactionSave;
                                }
                            }
                        );
                    }
                    else {
                        const mapNewData = {
                            "_storeid": payload._storeid,
                            "_barnchid": payload._barnchid,
                            "data": {
                                "_agentid": payload.data._agentid, // ObjectID ของ นักกายภาพ
                                "agentname": payload.data.agentname, // ชื่อ นักกายภาพ
                                "_patientid": payload.data._patientid, // ObjectID ของ ผู้ป่วย
                                "patientnamge": find_name_patient[0].name, // ชื่อผู้ป่วย
                                "detail": payload.data.detail, // รายละเอียด
                                "status": payload.data.status, // สถาณะการทำงาน
                                "date": payload.data.date, // วันที่นัด
                                "timeFrom": payload.data.timeFrom, // เลลานัด
                                "timeTo": payload.data.timeTo // เลลานัด
                            }
                        };

                        // const checkFindData = await scheduleModel.find(
                        //     {
                        //         "_storeid": payload._storeid,
                        //         "_barnchid": payload._barnchid,
                        //             "data._agentid": payload.data._agentid, // ObjectID ของ นักกายภาพ
                        //             "data.agentname": payload.data.agentname, // ชื่อ นักกายภาพ
                        //             "data._patientid": payload.data._patientid, // ObjectID ของ ผู้ป่วย
                        //             "data.patientnamge": find_name_patient[0].name, // ชื่อผู้ป่วย
                        //             "data.detail": payload.data.detail, // รายละเอียด
                        //             "data.status": payload.data.status, // สถาณะการทำงาน
                        //             "data.date": payload.data.date, // วันที่นัด
                        //             "data.timeFrom": payload.data.timeFrom, // เลลานัด
                        //             "data.timeTo": payload.data.timeTo // เลลานัด
                        //     }
                        // );

                        const checkFindData = await scheduleModel.aggregate(
                            [
                                {
                                    '$match': {
                                        '_storeid': storeid,
                                        '_barnchid': barnchid
                                    }
                                }, {
                                    '$unwind': {
                                        'path': '$data'
                                    }
                                }, {
                                    '$match': {
                                        "_storeid": storeid,
                                        "_barnchid": barnchid,
                                        "data._agentid": agentid, // ObjectID ของ นักกายภาพ
                                        "data.agentname": payload.data.agentname, // ชื่อ นักกายภาพ
                                        "data._patientid": patientid, // ObjectID ของ ผู้ป่วย
                                        "data.patientnamge": find_name_patient[0].name, // ชื่อผู้ป่วย
                                        "data.detail": payload.data.detail, // รายละเอียด
                                        "data.status": payload.data.status, // สถาณะการทำงาน
                                        "data.date": payload.data.date, // วันที่นัด
                                        "data.timeFrom": payload.data.timeFrom, // เลลานัด
                                        "data.timeTo": payload.data.timeTo // เลลานัด
                                    }
                                }
                            ], (err) => { if (err) { callback(err); return; } }
                        );

                        if (checkFindData.length <= 0) { // ตรวจว่า ข้อมูลที่ส่งมาซ้ำหรือไม่ เพื่อป้องกันข้อมูลซ้ำ
                            await scheduleModel.findByIdAndUpdate(
                                findSchedule._id,
                                {
                                    "$push": {
                                        "data": mapNewData.data
                                    }
                                }
                            );
                            callback(null);
                            return checkFindData;
                        }
                        else {
                            callback(null);
                            return checkFindData;
                        }
                    }
                }
            }


        }
    }

}
module.exports = schedule_Save_Controller