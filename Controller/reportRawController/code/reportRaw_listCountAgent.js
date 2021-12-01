const reportRaw_listCountAgent = async (data = { _storeid: new String, _branchid: new String }, callback = (err = new Error) => {} ) => {
  const checkObjectId = require('../../mongodbController').checkObjectId;

  const agentModel = require('../../mongodbController').agentModel;

    const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { console.error(err); callback(err); return; } });
    const _branchid = await checkObjectId(data._branchid, (err) => { if(err) { console.error(err); callback(err); return; } });
    try {
        const getReport = await agentModel.aggregate(
            [
              {
                '$match': {
                  'store._storeid': _storeid,
                  'store.branch._branchid': _branchid
                }
              }, {
                '$unwind': {
                  'path': '$store'
                }
              }, {
                '$match': {
                  'store._storeid': _storeid,
                  'store.branch._branchid': _branchid,
                  'store.role': 2
                }
              }, {
                '$count': 'agentCount'
              }
            ]
        );

        callback(null);
        return getReport[0];
          
    } catch (error) {
        console.error(error);
        callback(error);
        return;
    }
};

module.exports = reportRaw_listCountAgent;