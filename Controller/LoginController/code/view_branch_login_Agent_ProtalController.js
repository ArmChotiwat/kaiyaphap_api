const view_branch_login_Agent_ProtalController = async (
    data = {
        _storeid: new String(''),
        _userid: new String(''),
    },
    callback = (err = new Err) => { }
) => {
    const hader = 'view_branch_login_Agent_ProtalController';
    const { validateObjectId, checkObjectId } = require('../../miscController');
    const { agentModel } = require('../../mongodbController')
    if (typeof data._storeid !== 'string' || data._storeid === '' || data._storeid === null || !validateObjectId(data._storeid) ||
        typeof data._userid !== 'string' || data._userid === '' || data._userid === null || !validateObjectId(data._userid)
    ) {
        callback(new Error(` ${hader} : data Error`));
        return;
    } else {
        const storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
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
                    '$unwind': {
                        'path': '$lookup_store.branch',
                        'includeArrayIndex': 'lookup_store_branch_index',
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$match': {
                        'lookup_store_branch_index': {
                            '$ne': null
                        }
                    }
                }, {
                    '$addFields': {
                        'chkStore': {
                            '$cmp': [
                                '$_ref_agent_storeid', '$lookup_store._id'
                            ]
                        },
                        'chkBranch': {
                            '$cmp': [
                                '$_ref_agent_branchid', '$lookup_store.branch._id'
                            ]
                        }
                    }
                }, {
                    '$match': {
                        'chkStore': {
                            '$eq': 0
                        },
                        'chkBranch': {
                            '$eq': 0
                        },
                        'lookup_store.isclosed' : false ,
                        'lookup_store.branch.isclosed' : false
                    }
                }, {
                    '$project': {
                        '_id': 0,
                        '_storeid': '$lookup_store._id',
                        '_branchid': '$lookup_store.branch._id',
                        'branchname': '$lookup_store.branch.name',
                        'phone_number': '$lookup_store.branch.phone_number',
                        'address': '$lookup_store.branch.address'
                    }
                }, {
                    '$match': {
                        '_storeid': storeid
                    }
                }, {
                    '$sort': {
                        '_storeid': 1,
                        '_branchid': 1
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
module.exports = view_branch_login_Agent_ProtalController;