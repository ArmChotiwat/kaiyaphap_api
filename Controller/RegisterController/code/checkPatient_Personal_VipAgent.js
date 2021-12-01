const checkPatient_Personal_VipAgent = async (
    vip_agent = {
        _agentid: String()
    },
    _ref_storeid = '',
    _ref_branchid = '',
    callback = (err = new Error) => {} 
) => {
    const controllerName = `checkPatient_Personal_VipAgent`;

    const { validate_StringObjectId_NotNull } = require('../../miscController');
    const { ObjectId, agentModel } = require('../../mongodbController');

    if (typeof vip_agent != 'object') { callback(new Error(`${controllerName}: <vip_agent> must be Object`)); return; }
    else {
        if (vip_agent._agentid !== null) {
            if (!validate_StringObjectId_NotNull) { callback(new Error(`${controllerName}: <vip_agent._agentid> must be ObjectId or Null`)); return; }
            else {
                const findAgent = await agentModel.findOne(
                    {
                        $or: [
                            {
                                $and: [
                                    { '_id': ObjectId(vip_agent._agentid) },
                                    { 'store._storeid': ObjectId(_ref_storeid) }
                                ]
                            },
                            {
                                $and: [
                                    { 'store._id': ObjectId(vip_agent._agentid) },
                                    { 'store._storeid': ObjectId(_ref_storeid) }
                                ]
                            },
                        ]
                    },
                    {},
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!findAgent) { callback(new Error(`${controllerName}: findAgent return not found at <vip_agent._agentid> (${vip_agent._agentid})`)); return; }
            }
        }

        callback(null);
        return vip_agent;
    }
};

module.exports = checkPatient_Personal_VipAgent;