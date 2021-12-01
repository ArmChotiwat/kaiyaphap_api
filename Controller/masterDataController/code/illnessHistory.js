const illnessHistoryController_save = async (data = { _storeid: new String, name: new String }, callback = (err = new Error) => {} ) => {
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const illnessModel = require('../../mongodbController').illnessModel;

    const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
    const name = data.name;
    const findDuplicate = await illnessModel.find(
        {
            '_storeid': _storeid,
            'name': name
        },
        (err) => { if(err) { callback(err); return; } }
    );
    if(findDuplicate.length != 0) { callback(new Error('illnessHistoryController => illnessHistoryController_save: data is duplicated OR database have error')); return; }
    else {
        const mapData = {
            '_storeid': _storeid,
            'name': name,
            'isused': true,
        }
        const modelTransaction = new illnessModel(mapData);
        await modelTransaction.save(
            (err, result) => {
                if(err)  { callback(err); return; }
            }
        );
        callback(null); 
        return modelTransaction;
    }
};

const illnessHistoryController_get = async (data = { _storeid: new String }, callback = (err = new Error) ) => {
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const illnessModel = require('../../mongodbController').illnessModel;
    if( typeof data._storeid != 'string' || data._storeid == '') { callback(new Error('IllnessHistoryController => illnessHistoryController_get: _storeid must be String and not Empty ')) }
    else {
        const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
        const illnessAllData = await illnessModel.find(
            {
            '_storeid': _storeid,
            'isused': true,
            }
        ).select({ _id: 1, name: 1, isused: 1 });
        const illMap = illnessAllData.map(x => ({ id: x._id, name: x.name, isused: x.isused }));
        if (illMap.length === 0 || !illnessAllData) {
            callback(null);
            return;
        }
        else {
            callback(null);
            return illMap;
        }
    }
};

const illnessHistoryController_All_get = async (data = { _storeid: new String }, callback = (err = new Error) ) => {
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const illnessModel = require('../../mongodbController').illnessModel;

    if( typeof data._storeid != 'string' || data._storeid == '') { callback(new Error('IllnessHistoryController => illnessHistoryController_get: _storeid must be String and not Empty ')) }
    else {
        const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
        const illnessAllData = await illnessModel.find(
            {
              '_storeid': _storeid,
            },
            (err) => { if(err) { callback(err); return; } }
          )
          .select({ _id: 1, name: 1, isused: 1 })
          .sort({_id: 1});
        if(!illnessAllData) { return []; }
        else {
            const illMap = illnessAllData.map(x => ({ id: x._id, name: x.name, isused: x.isused }));
            if (illMap.length === 0 || illnessAllData.length === 0) {
                callback(null); 
                return;
            }
            else {
                callback(null); 
                return illMap;
            }
        }
    }
};

const illnessHistoryController_put = async (
    data = {
        _storeid: new String,
        _ilnessHistoryid: new String,
        name: new String,
        isused: new Boolean
    },
    callback = (err = new Error) => {}
) => {
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const ObjectId = require('../../mongodbController').ObjectId;
    const illnessModel = require('../../mongodbController').illnessModel;

    if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error('illnessHistoryController => illnessHistoryController_put: _storeid must be String And not Empty')); return; }
    else if(typeof data._ilnessHistoryid != 'string' || data._ilnessHistoryid == '') { callback(new Error('illnessHistoryController => illnessHistoryController_put: _ilnessHistoryid must be String And not Empty')); return; }
    else if(typeof data.name != 'string' || data.name == '') { callback(new Error('illnessHistoryController => illnessHistoryController_put: name must be String And not Empty')); return; }
    else if(typeof data.isused != 'boolean') { callback(new Error('illnessHistoryController => illnessHistoryController_put: isused must be Boolean')); return; }
    else {
        const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
        const _ilnessHistoryid = await checkObjectId(data._ilnessHistoryid, (err) => { if(err) { callback(err); return; } });
        const name = data.name;
        const isused = data.isused;

        const findExists = await illnessModel.find(
            {
              '_id': _ilnessHistoryid,
              '_storeid': _storeid
            },
            (errors) => { if(errors) { callback(errors); return; } }
        );
        if(findExists.length <= 0) { callback(new Error('illnessHistoryController => illnessHistoryController_put: find data have error')); return; }
        else if (findExists.length > 1) { callback(new Error('illnessHistoryController => illnessHistoryController_put: find data have error')); return; }
        else {
            const mapData = {
                _storeid: data._storeid,
                _ilnessHistoryid: data._ilnessHistoryid,
                name: data.name,
                isused: data.isused
            }
            await illnessModel.updateOne(
                {
                    '_id': ObjectId(findExists[0]._id),
                    '_storeid': ObjectId(findExists[0]._storeid)
                },
                {
                '$set': {
                    'name': name,
                    'isused': isused
                }
                },
                (errors) => {
                    if(errors) { callback(errors); return; }
                }
            );
            callback(null); 
            return mapData;
        }
    }

};

const illnessHistoryController_Status_patch = async (data = { _storeid: new String, _ilnessHistoryid: new String, }, callback = (err = new Error) => {} ) => {
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const ObjectId = require('../../mongodbController').ObjectId;
    const illnessModel = require('../../mongodbController').illnessModel;
    
    if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error('illnessHistoryController => illnessHistoryController_Status_patch: _storeid must be String And not Empty')); return; }
    else if(typeof data._ilnessHistoryid != 'string' || data._ilnessHistoryid == '') { callback(new Error('illnessHistoryController => illnessHistoryController_Status_patch: _ilnessHistoryid must be String And not Empty')); return; }
    else {
        const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
        const _ilnessHistoryid = await checkObjectId(data._ilnessHistoryid, (err) => { if(err) { callback(err); return; } });
        const findExists = await illnessModel.findOne(
            {
                _id: ObjectId(_ilnessHistoryid),
                _storeid: ObjectId(_storeid)
            },
            (errors) => { if (errors) { callback(errors); return; } }
        );
        if (!findExists) { callback(new Error('illnessHistoryController => illnessHistoryController_Status_patch: requested not found')); return; }
        else {
            const updateResult = await illnessModel.updateOne(
                {
                    '_id': ObjectId(findExists._id),
                    '_storeid': ObjectId(findExists._storeid)
                },
                {
                    $set: { 'isused': !findExists.isused }
                },
                (errors) => {
                    if (errors) { callback(errors); return; }
                }
            );

            if(!updateResult) { return; }
            else {
                const mapData = {
                    _storeid: data._storeid,
                    _ilnessHistoryid: data._ilnessHistoryid,
                    name: findExists.name,
                    isused: findExists.isused
                };
    
                callback(null);
                return mapData;
            }
        }
    }
    
};

module.exports = {
    illnessHistoryController_save,
    illnessHistoryController_get,
    illnessHistoryController_All_get,
    illnessHistoryController_put,
    illnessHistoryController_Status_patch,
};