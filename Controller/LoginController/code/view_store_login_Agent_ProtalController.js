const view_store_login_Agent_ProtalController = async (
    data = {
        _userid: '',
    },
    callback = (err = new Err) => { }
) => {
    const hader = 'view_store_login_Agent_ProtalController';
    const { validateObjectId, checkObjectId } = require('../../miscController');
    const { agentModel } = require('../../mongodbController')
    if (
        typeof data._userid !== 'string' || data._userid === '' || data._userid === null || !validateObjectId(data._userid)
    ) {
        callback(new Error(` ${hader} : data Error`));
        return;
    } else {
        const userid = await checkObjectId(data._userid, (err) => { if (err) { callback(err); return; } });
        const findStoreUsers = await agentModel.aggregate(
            [
                {
                    '$match': {
                        '_id': userid
                    }
                }, {
                    '$unwind': {
                        'path': '$store'
                    }
                }, {
                    '$match': {
                        'store.user_status': true
                    }
                }, {
                    '$unwind': {
                        'path': '$store.branch'
                    }
                }, {
                    '$project': {
                        '_ref_agent_storeid': '$store._storeid',
                        '_ref_agent_branchid': '$store.branch._branchid'
                    }
                }, {
                    '$lookup': {
                        'from': 'm_stores',
                        'localField': '_ref_agent_storeid',
                        'foreignField': '_id',
                        'as': 'lookup_store'
                    }
                }, {
                    '$unwind': {
                        'path': '$lookup_store',
                        'includeArrayIndex': 'lookup_store_index',
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$match': {
                        'lookup_store_index': {
                            '$ne': null
                        }
                    }
                }, {
                    '$addFields': {
                        'chkStore': {
                            '$cmp': [
                                '$_ref_agent_storeid', '$lookup_store._id'
                            ]
                        }
                    }
                }, {
                    '$match': {
                        'chkStore': {
                            '$eq': 0
                        },
                        'lookup_store.isclosed' : false
                    }
                }, {
                    '$project': {
                        '_id': 0,
                        '_storeid': '$lookup_store._id',
                        'storename': '$lookup_store.name'
                    }
                }, {
                    '$sort': {
                        '_storeid': 1
                    }
                }
            ]
        );
        if (findStoreUsers.length === 0) {
            callback(new Error(` ${hader} : findStoreUsers Error`)); 
            return ; 
        }
        else {
            callback(null);
            return findStoreUsers;
        }
    }
};
module.exports = view_store_login_Agent_ProtalController;