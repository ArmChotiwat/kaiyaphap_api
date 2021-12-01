const treatmentStoreController_save = async ( data = { _storeid: new String, _branchid: new String, name: new String, price: new Number}, callback = (err = new Error) => {}) => {
  const checkObjectId = require('../../mongodbController').checkObjectId;
  const treatmentStoreModel = require('../../mongodbController').treatmentStoreModel;

    if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error('treatmentStoreController => treatmentStoreController_save: data._storeid must be String And not Empty')); return; }
    else if(typeof data._branchid != 'string' || data._branchid == '') { callback(new Error('treatmentStoreController => treatmentStoreController_save: data._branchid must be String And not Empty')); return; }
    else if(typeof data.name != 'string' || data.name == '') { callback(new Error('treatmentStoreController => treatmentStoreController_save: data.name must be String And not Empty')); return; }
    else if(typeof data.price != 'number') { callback(new Error('treatmentStoreController => treatmentStoreController_save: data.name must be Number And not Empty')); return; }
    else {
        const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
        const _branchid = await checkObjectId(data._branchid, (err) => { if(err) { callback(err); return; } });
        const name = data.name;
        const price = data.price;

        const mapData = {
            '_storeid': _storeid,
            '_branchid': _branchid,
            'name': name,
            'price': price,
            'isused': true
        }
        const treatmentStore = new treatmentStoreModel(mapData);
        await treatmentStore.save(
            (errors) => {
                if(errors) { callback(errors); return; }
            }
        );

        callback(null);
        return treatmentStore;
    }
};

const treatmentStoreController_get = async ( data = { _storeid: new String, _branchid: new String }, callback = (err = new Error) => {}) => {
  const checkObjectId = require('../../mongodbController').checkObjectId;
  const treatmentStoreModel = require('../../mongodbController').treatmentStoreModel;

    if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error('treatmentStoreController => treatmentStoreController_get: data._storeid must be String And not Empty')); return; }
    else if(typeof data._branchid != 'string' || data._branchid == '') { callback(new Error('treatmentStoreController => treatmentStoreController_get: data._branchid must be String And not Empty')); return; }
    else {
        const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
        const _branchid = await checkObjectId(data._branchid, (err) => { if(err) { callback(err); return; } });
        const getTreatmentStore = await treatmentStoreModel.find(
            {
              '_storeid': _storeid,
              '_branchid': _branchid
            },
            (errors) => {
              if(errors) { callback(errors); return; }
            }
        );
        if(getTreatmentStore.length === 0) { callback(null); return; }
        else { callback(null); return getTreatmentStore; }
    }
};


const treatmentStoreController_put = async ( 
    data = { 
        _treatmentStoreid: new String,
        _storeid: new String, 
        _branchid: new String, 
        name: new String, 
        price: new Number,
        isused: new Boolean,
    }, 
    callback = (err = new Error) => {}) => {
      const checkObjectId = require('../../mongodbController').checkObjectId;
      const ObjectId = require('../../mongodbController').ObjectId;
      const treatmentStoreModel = require('../../mongodbController').treatmentStoreModel;

        if (typeof data._treatmentStoreid != 'string' || data._treatmentStoreid == '') { callback(new Error('treatmentStoreController => treatmentStoreController_put: data._treatmentStoreid must be String And not Empty')); return; }
        else if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error('treatmentStoreController => treatmentStoreController_put: data._storeid must be String And not Empty')); return; }
        else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error('treatmentStoreController => treatmentStoreController_put: data._branchid must be String And not Empty')); return; }
        else if (typeof data.name != 'string' || data.name == '') { callback(new Error('treatmentStoreController => treatmentStoreController_put: data.name must be String And not Empty')); return; }
        else if (typeof data.price != 'number' || data.price == null) { callback(new Error('treatmentStoreController => treatmentStoreController_put: data.price must be Number And not Null')); return; }
        else if (typeof data.isused != 'boolean' || data.isused == null) { callback(new Error('treatmentStoreController => treatmentStoreController_put: data.isused must be Boolean And not Null')); return; }
        else {
            const _treatmentStoreid = await checkObjectId(data._treatmentStoreid, (err) => { if(err) { callback(err); return; } });
            const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
            const _branchid = await checkObjectId(data._branchid, (err) => { if(err) { callback(err); return; } });
            const name = data.name;
            const price = data.price;
            const isused = data.isused;
            try {
                const findExists = await treatmentStoreModel.find(
                    {
                      '_id': _treatmentStoreid,
                      '_storeid': _storeid,
                      '_branchid': _branchid
                    },
                    (errors) => { if (errors) { callback(errors); return; } }
                  );
                  if (findExists.length <= 0) { callback(new Error('treatmentStoreController => treatmentStoreController_put: database not found as requested')); return; }
                  else if (findExists.length > 1) { callback(new Error('treatmentStoreController => treatmentStoreController_put: database not found as requested')); return; }
                  else {
                    await treatmentStoreModel.updateOne(
                      {
                        '_id': ObjectId(findExists[0]._id),
                        '_storeid': ObjectId(findExists[0]._storeid),
                        '_branchid': ObjectId(findExists[0]._branchid)
                      },
                      {
                        '$set': {
                          'name': data.name,
                          'price': data.price,
                          'isused': data.isused
                        }
                      },
                      (errors) => {
                        if (errors) { callback(errors); return; }
                      }
                    );

                    const mapData = {
                        _treatmentStoreid: data._treatmentStoreid,
                        _storeid: data._storeid,
                        _branchid: data._branchid,
                        name: findExists[0].name,
                        isused: findExists[0].isused,
                    };

                    callback(null);
                    return mapData;
                  }
            } catch (error) {
                callback(error);
                return;
            }
        }
};


const treatmentStoreController_Status_patch = async ( data = {_treatmentStoreid: new String, _storeid: new String, _branchid: new String }, callback = (err = new Error) => {}) => {
  if(typeof data._treatmentStoreid != 'string' || data._treatmentStoreid == '') { callback(new Error('treatmentStoreController => treatmentStoreController_Status_patch: data._treatmentStoreid must be String And not Empty')); return; }
  else if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error('treatmentStoreController => treatmentStoreController_Status_patch: data._storeid must be String And not Empty')); return; }
  else if(typeof data._branchid != 'string' || data._branchid == '') { callback(new Error('treatmentStoreController => treatmentStoreController_Status_patch: data._branchid must be String And not Empty')); return; }
  else {
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const ObjectId = require('../../mongodbController').ObjectId;
    const treatmentStoreModel = require('../../mongodbController').treatmentStoreModel;

    const _treatmentStoreid = await checkObjectId(data._treatmentStoreid, (err) => { if(err) { callback(err); return; } });
    const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
    const _branchid = await checkObjectId(data._branchid, (err) => { if(err) { callback(err); return; } });
    const findExists = await treatmentStoreModel.find(
      {
        '_id': _treatmentStoreid,
        '_storeid': _storeid,
        '_branchid': _branchid
      },
      (errors) => { if(errors) { callback(err); return; } }
    );
    if(findExists.length <= 0) { callback(new Error('treatmentStoreController => treatmentStoreController_Status_patch: database Error or Data is not Exist as Requested')); return; }
    else if (findExists.length > 1) { callback(new Error('treatmentStoreController => treatmentStoreController_Status_patch: database Error or Data is not Exist as Requested')); return; }
    else {
      
      await treatmentStoreModel.updateOne(
        {
          '_id': ObjectId(findExists[0]._id),
          '_storeid': ObjectId(findExists[0]._storeid),
          '_branchid': ObjectId(findExists[0]._branchid),
        },
        {
          '$set': { 'isused': !findExists[0].isused }
        },
        (errors) => {
          if(errors) { callback(errors); return; }
        }
      );

      const mapData = {
        _treatmentStoreid: data._treatmentStoreid,
        _storeid: data._storeid,
        _branchid: data._branchid,
        name: findExists[0].name,
        isused: !findExists[0].isused
      };

      callback(null);
      return mapData;
    }
  }

};




module.exports = {
    treatmentStoreController_save,
    treatmentStoreController_get,
    treatmentStoreController_put,
    treatmentStoreController_Status_patch,
};