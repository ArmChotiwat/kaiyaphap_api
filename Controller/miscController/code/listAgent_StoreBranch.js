/**
 * misc Controller สำหรับ รวบรวมรายชื่อ Admin ***(role: 1)*** และ นักกายภาพ ***(role: 2)*** ที่ใช้งานอยู่ ตามสาขา
 ** ถ้าหาจอ จะ list รายการใน agent_list
 ** ถ้าหาไม่เจอใครเลย agent_list จะเป็น []
 */
const listAgent_StoreBranch = async (
    data = {
        _ref_storeid: String(''),
        _ref_branchid: String(''),
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `listAgent_StoreBranch`;
    const { validateObjectId, checkStoreBranch } = require('../../miscController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!(await checkStoreBranch({_storeid: data._ref_storeid, _branchid: data._ref_branchid}, (err) => { if (err) { return; } }))) { callback(new Error(`${controllerName}: <data._ref_storeid> <data._ref_branchid> checkStoreBranch reutrn not found`)); return; }
    else {
        const { checkObjectId, agentModel } = require('../../mongodbController');

        const _ref_storeid = await checkObjectId(data._ref_storeid, (err) => { if (err) { callback(err); return; } });
        const _ref_branchid = await checkObjectId(data._ref_branchid, (err) => { if (err) { callback(err); return; } });

        if (!_ref_storeid) { callback(new Error(`${controllerName}: data._ref_storeid convert to ObjectId failed`)); return; }
        else if (!_ref_branchid) { callback(new Error(`${controllerName}: data._ref_branchid convert to ObjectId failed`)); return; }
        else {
            const getResult = await agentModel.aggregate(
                [
                    {
                      '$match': {
                        'store._storeid': _ref_storeid, 
                        'store.branch._branchid': _ref_branchid, 
                        'store.user_status': true
                      }
                    }, {
                      '$unwind': {
                        'path': '$store'
                      }
                    }, {
                      '$match': {
                        'store._storeid': _ref_storeid, 
                        'store.branch._branchid': _ref_branchid, 
                        'store.user_status': true
                      }
                    }, {
                      '$project': {
                        '_id': 0, 
                        '_agentid': '$_id', 
                        '_agentstoreid': '$store._id', 
                        'pre_name': '$store.personal.pre_name', 
                        'special_prename': "$store.personal.special_prename",
                        'first_name': '$store.personal.first_name', 
                        'last_name': '$store.personal.last_name', 
                        'role': '$store.role'
                      }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );

            if (!getResult) { callback(new Error(`${controllerName}: getResult have error`)); return; }
            else {
                const mapData = {
                    _ref_storeid: data._ref_storeid,
                    _ref_branchid: data._ref_branchid,
                    agent_list: (getResult.length <= 0 || !getResult) ? []:getResult.map(
                        where => (
                            {
                                _agentid: String(where._agentid),
                                _agentstoreid: String(where._agentstoreid),
                                pre_name: String(where.pre_name),
                                special_prename: (!where.special_prename || where.special_prename === '') ? null : String(where.special_prename),
                                first_name: String(where.first_name),
                                last_name: String(where.last_name),
                                role: Number(where.role),
                            }
                        )
                    ),
                };

                callback(null);
                return mapData;
            }
        }
    }
};

module.exports = listAgent_StoreBranch;