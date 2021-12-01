/**
 * Misc - Controller สำหรับใช้ตรวจสอบ Agent ObjectId ที่มิสิทธิ์ เป็น Admin ประจำสาขา
 * 
 ** หากไม่เจอ จะ return เป็นค่าว่าง (undefinded)
 ** หากเจอ จะ return ค่า 
  *  _agentid
  *  _agentstoreid
  *  _storeid
  *  _branchid
 *
 */
const checkAgentAdminId_StoreBranch = async (
    data = {
        _storeid: new String(''), 
        _branchid: new String(''), 
        _agentid: new String('')
    },
    callback = (err = new Error) => {}
    ) => {
        const mongodbController = require('../../mongodbController');
        const agentModel = mongodbController.agentModel;
        const checkObjectId = mongodbController.checkObjectId;

        if(typeof data != 'object') { callback(new Error(`checkAgentId: <data> must be Object`)); return; }
        else if(typeof data._storeid != 'string') { callback(new Error(`checkAgentId: <data._storeid> must be String and Not Empty`)); return; }
        else if(typeof data._branchid != 'string') { callback(new Error(`checkAgentId: <data._branchid> must be String and Not Empty`)); return; }
        else if(typeof data._agentid != 'string') { callback(new Error(`checkAgentId: <data._agentid> must be String and Not Empty`)); return; }
        else {
            const _agentid = await checkObjectId(data._agentid, (err) => { if(err) { callback(err); return; } });
            const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
            const _branchid = await checkObjectId(data._branchid, (err) => { if(err) { callback(err); return; } });
            
            
            const findAgent_Logic1 = await agentModel.aggregate(
                [
                    {
                      '$match': {
                        '_id': _agentid, 
                        'store._storeid': _storeid, 
                        'store.role': 1,
                        'store.user_status': true, 
                        'store.branch._branchid': _branchid
                      }
                    }, {
                      '$unwind': {
                        'path': '$store'
                      }
                    }, {
                      '$unwind': {
                        'path': '$store.branch'
                      }
                    }, {
                      '$match': {
                        '_id': _agentid, 
                        'store._storeid': _storeid, 
                        'store.role': 1,
                        'store.user_status': true, 
                        'store.branch._branchid': _branchid
                      }
                    }
                ],
                (err) => { if(err) { callback(err); return; } }
            );

            if(findAgent_Logic1 && findAgent_Logic1.length === 1) {
                const mapData = {
                    _agentid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic1[0]._id),
                    _agentstoreid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic1[0].store._id),
                    _storeid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic1[0].store._storeid),
                    _branchid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic1[0].store.branch._branchid),
                }
                callback(null);
                return mapData;
            }
            else if(findAgent_Logic1 && findAgent_Logic1.length === 0) {
                const findAgent_Logic2 = await agentModel.aggregate(
                    [
                        {
                          '$match': {
                            'store._id': _agentid, 
                            'store._storeid': _storeid, 
                            'store.role': 1,
                            'store.user_status': true, 
                            'store.branch._branchid': _branchid,
                          }
                        }, {
                          '$unwind': {
                            'path': '$store'
                          }
                        }, {
                          '$unwind': {
                            'path': '$store.branch'
                          }
                        }, {
                          '$match': {
                            'store._id': _agentid, 
                            'store._storeid': _storeid, 
                            'store.role': 1,
                            'store.user_status': true, 
                            'store.branch._branchid': _branchid,
                          }
                        }
                    ],
                    (err) => { if(err) { callback(err); return; } }
                );

                if(findAgent_Logic2 && findAgent_Logic2.length === 1) {
                    const mapData = {
                        _agentid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic2[0]._id),
                        _agentstoreid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic2[0].store._id),
                        _storeid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic2[0].store._storeid),
                        _branchid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic2[0].store.branch._branchid),
                    }
                    callback(null);
                    return mapData;
                }
                else { callback(null); return; }
            }
            else { callback(null); return; }

        }

    };

module.exports = checkAgentAdminId_StoreBranch;
