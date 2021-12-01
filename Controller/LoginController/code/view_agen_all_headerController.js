const view_agen_all_headerController = async (
    data = {
        _storeid: new String(''),
        _userid: new String(''),
        _branchid: new String(''),
    },
    callback = (err = new Err) => { }
) => {
    const hader = 'view_agen_all_headerController';
    const { validateObjectId, checkObjectId } = require('../../miscController');
    const { agentModel } = require('../../mongodbController')
    if (typeof data._storeid !== 'string' || data._storeid === '' || data._storeid === null || !validateObjectId(data._storeid) ||
        typeof data._userid !== 'string' || data._userid === '' || data._userid === null || !validateObjectId(data._userid) ||
        typeof data._branchid !== 'string' || data._branchid === '' || data._branchid === null || !validateObjectId(data._branchid)
    ) {
        callback(new Error(` ${hader} : data Error`));
        return;
    } else {
        const storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const userid = await checkObjectId(data._userid, (err) => { if (err) { callback(err); return; } });
        const branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
        const findAgent = await agentModel.aggregate(
            [
                {
                    '$match': {
                        '_id': userid,
                        'store._storeid': storeid,
                        'store.branch._branchid': branchid,
                        'store.user_status': true
                    }
                }, {
                    '$unwind': {
                        'path': '$store'
                    }
                }, {
                    '$match': {
                        '_id': userid,
                        'store._storeid': storeid,
                        'store.branch._branchid': branchid,
                        'store.user_status': true
                    }
                }, {
                    '$unwind': {
                        'path': '$store.branch'
                    }
                }, {
                    '$match': {
                        '_id': userid,
                        'store._storeid': storeid,
                        'store.branch._branchid': branchid,
                        'store.user_status': true
                    }
                }, {
                    '$project': {
                        '_id': 1,
                        'store._id': 1,
                        'store._storeid': 1,
                        'store.role': 1,
                        'store.roleAdminViewOnly': 1,
                        'store.branch': 1,
                        'store.user_status': 1,
                        'store.personal.first_name': 1,
                        'store.personal.last_name': 1,
                    }
                },
            ],
            (err) => { if (err) { callback(err); return; } }
        );

        if (!findAgent || findAgent.length === 0) { callback(new Error(`${hader} : findAgent Error`)); return; }
        else {
            const returnJson = {
                _agentid: findAgent[0].store._id,
                _role: findAgent[0].store.role,
                roleAdminViewOnly: findAgent[0].store.roleAdminViewOnly,
                firstname: findAgent[0].store.personal.first_name,
                lastname: findAgent[0].store.personal.last_name,
            }
            callback(null);
            return returnJson;
        }
    }
};
module.exports = view_agen_all_headerController;