// จำนวนนัดหมายทั้งหมด (แยกตาม Store + Branch)
const countScheduleAllFilterByStoreWithBranchController = async (data = { _storeid: new String, _branchid: new String }, callback = (err = new Error) => { }) => {
    const scheduleModel_Refactor = require('../../mongodbController').scheduleModel_Refactor;
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const controllerName = 'countScheduleAllFilterByStoreWithBranchController';

    try {
        const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });

        if (!_storeid) { callback(new Error(`${controllerName}: <_storeid> have error during checkObjectId`)); return; }
        else if (!_branchid) { callback(new Error(`${controllerName}: <_branchid> have error during checkObjectId`)); return; }
        else {
            const findResult = await scheduleModel_Refactor.aggregate(
                [
                    {
                        '$match': {
                            '_ref_storeid': _storeid,
                            '_ref_branchid': _branchid
                        }
                    }, {
                        '$group': {
                            '_id': {
                                'status': '$status'
                            },
                            'countStatus': {
                                '$sum': 1
                            }
                        }
                    }, {
                        '$project': {
                            '_id': 0,
                            'status': '$_id.status',
                            'countStatus': '$countStatus'
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            if (!findResult) { callback(new Error(`${controllerName}: findResult have error during aggregate`)); return; }
            else if (findResult.length === 0) {
                const mapArr = [];
                const handleNullMapp = (name) => {
                    return {
                        status: name,
                        countStatus: 0
                    };
                };
                mapArr.push(handleNullMapp('นัดหมายไว้'), handleNullMapp('ยกเลิกนัด'), handleNullMapp('รอรับการรักษา'));
                callback(null);
                return mapArr;
            }
            else {
                const mapArr = [];
                const handleNullMapp = (name) => {
                    return {
                        status: name,
                        countStatus: 0
                    };
                };
                const AddSchedule = findResult.filter(where => where.status == 'นัดหมายไว้')[0] || handleNullMapp('นัดหมายไว้');
                const CancelSchedule = findResult.filter(where => where.status == 'ยกเลิกนัด')[0] || handleNullMapp('ยกเลิกนัด');
                const WaitTreatment = findResult.filter(where => where.status == 'รอรับการรักษา')[0] || handleNullMapp('รอรับการรักษา');
                mapArr.push(AddSchedule, WaitTreatment, CancelSchedule)
                callback(null);
                return mapArr;
            }
        }
    } catch (error) {
        callback(error);
        return;
    }
};


module.exports = countScheduleAllFilterByStoreWithBranchController;