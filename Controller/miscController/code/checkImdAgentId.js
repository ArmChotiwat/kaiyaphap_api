/**
 * 
 * ไว้สำหรับตรวจสอบ AgentId ของ Imd
 * 
 */
const checkImdAgentId = async (
    data = {
        _agentid: new String(''),
        username: new String('')
    },
    callback = (err = new Error) => {}
) => {
    const miscController = require('../../miscController');

    if(typeof data != 'object') { callback(new Error(`checkImdAgentId: data must be Object`)); return; }
    else if(typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`checkImdAgentId: data._agentid must be String Or ObjectId`)); return; }
    else if(typeof data.username != 'string' || data.username != 'kaiyaphap@imd.co.th') { callback(new Error(`checkImdAgentId: data.username must be String`)); return; }
    else if (!miscController.validateObjectId(data._agentid)) { callback(new Error(`checkImdAgentId: data._agentid Validate is return false`)); return; }
    else {
        const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if(err) { callback(err); return; } } );
        const _storeid = await miscController.checkObjectId('5ea003d688b7265b04296e2c', (err) => { if(err) { callback(err); return; } } );
        const _branchid = await miscController.checkObjectId('5ea003d688b7265b04296e2c', (err) => { if(err) { callback(err); return; } } );

        const agentModel = require('../../mongodbController').agentModel;

        const findImdAgent = await agentModel.find(
            {
                '_id': _agentid,
                'username': data.username,
                'store._storeid': _storeid,
                'store.branch._branchid': _branchid,
            },
            (err) => { if(err) { callback(err); return; } }
        );

        if(findImdAgent) {
            callback(null);
            return true;
        }
        else {
            callback(null);
            return false;
        }

    }
};

module.exports = checkImdAgentId;
