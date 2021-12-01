const schedule_Confirm_Controller = async (
    date = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _scheduleid: new String('')
    },
    callback = (err = new Error) => { }
) => {
    const header = 'schedule_Confirm_Controller';
    const { scheduleModel_Refactor } = require('../../mongodbController');
    const { checkObjectId, checkAgentId, validateObjectId } = require('../../miscController');
    if (
        !validateObjectId(date._storeid) ||
        !validateObjectId(date._branchid) ||
        !validateObjectId(date._agentid) ||
        !validateObjectId(date._scheduleid)
    ) {
        callback(new Error(`${header} : data Error`));
        return;
    } else {

        const scheduleid = await checkObjectId(date._scheduleid, (err) => { if (err) { callback(err); return; } });
        const storeid = await checkObjectId(date._storeid, (err) => { if (err) { callback(err); return; } });
        const branchid = await checkObjectId(date._branchid, (err) => { if (err) { callback(err); return; } });
        const find_chack_agent = await checkAgentId({ _storeid: date._storeid, _branchid: date._branchid, _agentid: date._agentid }, (err) => { if (err) { callback(err); return; } })

        if (find_chack_agent.role === 1) {
            const findSchedule = await scheduleModel_Refactor.aggregate(
                [
                    {
                        '$match': {
                            '_ref_storeid': storeid,
                            '_ref_branchid': branchid,
                            '_id': scheduleid,
                            'status': {
                                '$eq': 'นัดหมายไว้'
                            }
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );

            if (!findSchedule || findSchedule.length === 0 ) {
                callback(new Error(`${header} : can't find data in scheduleModel_Refactor`));
                return;
            }
            else {
                const updateTransaction = await scheduleModel_Refactor.updateOne(
                    {
                        "_id": scheduleid
                    },
                    {
                        "$set": {
                            "status": 'รอรับการรักษา'
                        }
                    }
                ).then(
                    result => { return result; }
                ).catch(
                    err => {
                        callback(err);
                        return;
                    }
                );
                if (!updateTransaction) {
                    callback(new Error(`${header} : can't update status in scheduleModel_Refactor`));
                    return;
                } else {
                    callback(null);
                    return updateTransaction;
                }
            }

        } else {
            callback(new Error(`${header} : admin olny`));
            return;
        }

    }
};
module.exports = schedule_Confirm_Controller