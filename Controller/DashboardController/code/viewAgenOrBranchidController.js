const view_agen_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
    }, callback = (err = new Err) => { }
) => {
    const hader = 'view_agen_Controller';
    if (typeof data._storeid !== 'string' || data._storeid === '' || data._storeid === null) {
        callback(new Error(` ${hader} : data Error`));
        return;
    } else {

        const checkObjectId = require('../../miscController').checkObjectId
        const storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const branchid = await checkObjectId(data._branchid, (err) => { if (err) { return; } });
        let match_branchid
        if (!branchid) {
            match_branchid = {}
        } else {
            match_branchid = { 'store.branch._branchid': branchid }
        }
        const mongodbController = require('../../mongodbController')

        const agentModel = await mongodbController.agentModel.aggregate(
            [
                { '$match': { 'store._storeid': storeid } },
                { '$unwind': { 'path': '$store' } },
                { '$unwind': { 'path': '$store.branch' } },
                { '$match': { 'store.role': 2 } },
                { '$match': match_branchid },
            ], (err) => { if (err) { callback(err); return; } })

        if (!agentModel) {
            callback(new Error(` ${hader} : _storeid : ${data._storeid} have not in agentModel`));
            return;
        } else if (agentModel.length === 0) {
            callback(null);
            return {
                _id: null,
                name: 'ไม่พบข้อมูล'
            }
        } else {
            let map = [];
            const length = agentModel.length
            for (let index = 0; index < length; index++) {
                map[index] = {
                    _id: agentModel[index].store._id,
                    name: agentModel[index].store.personal.first_name + ' ' + agentModel[index].store.personal.last_name
                }
            }
            return map
        }
    }

}
const view_branch_Controller = async (
    data = {
        _storeid: new String(''),
    }, callback = (err = new Err) => { }
) => {
    const hader = 'view_branch_Controller';
    if (typeof data._storeid !== 'string' || data._storeid === '' || data._storeid === null) {
        callback(new Error(` ${hader} : data Error`));
        return;
    }
    const checkObjectId = require('../../miscController').checkObjectId
    const storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
    const mongodbController = require('../../mongodbController')

    const storeModel = await mongodbController.storeModel.aggregate(
        [
            { '$match': { '_id': storeid } },
            { '$unwind': { 'path': '$branch' } },
        ]
    );
    if (!storeModel) {
        callback(new Error(` ${hader} :_storeid : ${data._storeid} have not in storeModel`));
        return;
    } else if (storeModel.length === 0) {
        callback(null);
        return {
            _id: null,
            name: 'ไม่พบข้อมูล'
        }
    } else {
        let map = [];
        const length = storeModel.length
        for (let index = 0; index < length; index++) {
            map[index] = {
                _id: storeModel[index].branch._id,
                name: storeModel[index].branch.name
            }
        }
        return map
    }
}
module.exports = { view_agen_Controller, view_branch_Controller };
