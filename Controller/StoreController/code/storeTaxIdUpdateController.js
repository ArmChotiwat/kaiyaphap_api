const storeTaxId_Update_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        tax_id: new String(''),
        update_all: true
    },
    callback = (err = new Error) => {}
) => {
    if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`storeTaxId_Update_Controller: data._storeid must be String and Not Empty`)); return; }
    else if(typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`storeTaxId_Update_Controller: data._branchid must be String and Not Empty`)); return; }
    else if(typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`storeTaxId_Update_Controller: data._agentid must be String and Not Empty`)); return; }
    else if(typeof data.tax_id != 'string' || data.tax_id == '') { callback(new Error(`storeTaxId_Update_Controller: data.tax_id must be String and Not Empty`)); return; }
    else if(typeof data.update_all != 'boolean') { callback(new Error(`storeTaxId_Update_Controller: data.update_all must be Boolean`)); return; }
    else {
        const mongodbController = require('../../mongodbController');
        const miscController = require('../../miscController');
        
        const _storeid = await mongodbController.checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
        const _branchid = await mongodbController.checkObjectId(data._branchid, (err) => { if(err) { callback(err); return; } });
        const _agentid = await mongodbController.checkObjectId(data._agentid, (err) => { if(err) { callback(err); return; } });
        const tax_id = await miscController.validateTaxId({stringTaxid: data.tax_id, returnType: String }, (err) => { if(err) { callback(err); return; }}).taxId_With_NumberAndDash;

        if(typeof tax_id != 'string' || tax_id == '' || tax_id.length <= 0) { callback(new Error(`storeTaxId_Update_Controller: tax_id Error From data.tax_id = ${data.tax_id} to tax_id = ${tax_id}`)); return; }
        else {
            const chkStoreBranch = await miscController.checkStoreBranch({_storeid: data._storeid, _branchid: data._branchid}, (err) => { if(err) { callback(err); return; } });
            const chkAgnet = await miscController.checkAgentId({_storeid: data._storeid, _branchid: data._storeid, _agentid: data._agentid},(err) => { if(err) { callback(err); return; } });
            
            if(!chkStoreBranch) { callback(new Error(`storeTaxId_Update_Controller: Store/Branch Not Exists`)); return; }
            else if(!chkAgnet) { callback(new Error(`storeTaxId_Update_Controller: Agent Admin in Store/Main Branch Not Exists`)); return; }
            else {
                const chkAgentPermission = await mongodbController.agentModel.find({'_id': chkAgnet._agentid, 'store._id': chkAgnet._agentstoreid, 'store.role': 1}, (err) => { if(err) { callback(err); return; } });

                if(!chkAgentPermission || chkAgentPermission.length != 1) { callback(`storeTaxId_Update_Controller: chkAgentPermission Error`); return; }
                else {
                    if(data.update_all === true) {
                        const transactionUpdate = await mongodbController.storeModel.updateMany(
                            {
                                '_id': _storeid,
                            },
                            {
                                $set: {
                                    'address.tax_id': tax_id,
                                    'branch.$[].address.tax_id': tax_id
                                }
                            },
                            (err) => { if(err) { callback(err); return; } }
                        );

                        if(!transactionUpdate) { callback(`storeTaxId_Update_Controller: transactionUpdate <Update All = True> have Error`); return; }
                        else { callback(null); return transactionUpdate; }
                    }
                    else{
                        const transactionUpdate = await mongodbController.storeModel.updateOne(
                            {
                                '_id': _storeid,
                                'branch._id': _branchid
                            },
                            {
                                $set: {
                                    'address.tax_id': tax_id,
                                    'branch.$.address.tax_id': tax_id
                                }
                            },
                            (err) => { if(err) { callback(err); return; } }
                        );

                        if(!transactionUpdate) { callback(`storeTaxId_Update_Controller: transactionUpdate <Update All = False> have Error`); return; }
                        else { callback(null); return transactionUpdate; }
                    }
                }

            }
        }

    }
};

module.exports = storeTaxId_Update_Controller;