const checkAgentId = async (
  data = {
    _storeid: new String(''),
    _branchid: new String(''),
    _agentid: new String('')
  },
  callback = (err = new Error) => { }
) => {
  const mongodbController = require('../../mongodbController');
  const agentModel = mongodbController.agentModel;
  const checkObjectId = mongodbController.checkObjectId;

  if (typeof data != 'object') { callback(new Error(`checkAgentId: <data> must be Object`)); return; }
  else if (typeof data._storeid != 'string') { callback(new Error(`checkAgentId: <data._storeid> must be String and Not Empty`)); return; }
  else if (typeof data._branchid != 'string') { callback(new Error(`checkAgentId: <data._branchid> must be String and Not Empty`)); return; }
  else if (typeof data._agentid != 'string') { callback(new Error(`checkAgentId: <data._agentid> must be String and Not Empty`)); return; }
  else {
    const _agentid = await checkObjectId(data._agentid, (err) => { if (err) { callback(err); return; } });
    const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
    const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });


    const findAgent_Logic1 = await agentModel.aggregate(
      [
        {
          '$match': {
            '_id': _agentid,
            'store._storeid': _storeid,
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
            'store.user_status': true,
            'store.branch._branchid': _branchid
          }
        }
      ],
      (err) => { if (err) { callback(err); return; } }
    );

    if (findAgent_Logic1 && findAgent_Logic1.length === 1) {
      const mapData = {
        _agentid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic1[0]._id),
        _agentstoreid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic1[0].store._id),
        _storeid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic1[0].store._storeid),
        _branchid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic1[0].store.branch._branchid),
        pre_name: String(findAgent_Logic1[0].store.personal.pre_name),
        special_prename: !findAgent_Logic1[0].store.personal.special_prename ? null:String(findAgent_Logic1[0].store.personal.special_prename),
        first_name: String(findAgent_Logic1[0].store.personal.first_name),
        last_name: String(findAgent_Logic1[0].store.personal.last_name),
        role: Number(findAgent_Logic1[0].store.role),
      }
      callback(null);
      return mapData;
    }
    else if (findAgent_Logic1 && findAgent_Logic1.length === 0) {
      const findAgent_Logic2 = await agentModel.aggregate(
        [
          {
            '$match': {
              'store._id': _agentid,
              'store._storeid': _storeid,
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
              'store.user_status': true,
              'store.branch._branchid': _branchid,
            }
          }
        ],
        (err) => { if (err) { callback(err); return; } }
      );

      if (findAgent_Logic2 && findAgent_Logic2.length === 1) {
        const mapData = {
          _agentid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic2[0]._id),
          _agentstoreid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic2[0].store._id),
          _storeid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic2[0].store._storeid),
          _branchid: new mongodbController.mongoose.Types.ObjectId(findAgent_Logic2[0].store.branch._branchid),
          pre_name: String(findAgent_Logic2[0].store.personal.pre_name),
          special_prename: !findAgent_Logic2[0].store.personal.special_prename ? null:String(findAgent_Logic2[0].store.personal.special_prename),
          first_name: String(findAgent_Logic2[0].store.personal.first_name),
          last_name: String(findAgent_Logic2[0].store.personal.last_name),
          role: Number(findAgent_Logic2[0].store.role),
        }
        callback(null);
        return mapData;
      }
      else { callback(null); return; }
    }
    else { callback(null); return; }

  }

};

module.exports = checkAgentId;
