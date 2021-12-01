/**
 * 
 * Controller ดูข้อมูล MasterData ของวินิจฉัยโรค ให้สำหรับ Customer Potal ใช้งาน
 * 
 */
const ptDiagnosis_View_Controller = async (
    data = { 
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String('')
    }, 
    callback = (err = new Error)  => {}
) => {
    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;

    if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`ptDiagnosis_View_Controller: data._storeid must be StringObjectId and Not Empty`)); return; }
    else if(!validateObjectId(data._storeid)) { callback(new Error(`ptDiagnosis_View_Controller: data._storeid Validate is return false`)); return; }
    else if(typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`ptDiagnosis_View_Controller: data._branchid must be StringObjectId and Not Empty`)); return; }
    else if(!validateObjectId(data._branchid)){ callback(new Error(`ptDiagnosis_View_Controller: data._branchid Validate is return false`)); return; }
    else if(typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`ptDiagnosis_View_Controller: data._agentid must be StringObjectId and Not Empty`)); return; }
    else if(!validateObjectId(data._agentid)){ callback(new Error(`ptDiagnosis_View_Controller: data._agentid Validate is return false`)); return; }
    else {
        const _storeid = await miscController.checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
        const _branchid = await miscController.checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
        const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if (err) { callback(err); return; } });

        const chkstoreId = await miscController.checkStoreBranch(
            {
                _storeid: _storeid.toString(),
                _branchid: _branchid.toString()
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkstoreId) { callback(new Error(`ptDiagnosis_View_Controller: chkstoreId return false`)); return; }
        else {
            const chkAgentId = await miscController.checkAgentId(
                {
                    _storeid: _storeid.toString(),
                    _branchid: _branchid.toString(),
                    _agentid: _agentid.toString()
                },
                (err) => { if (err) { callback(err); return; } }
            );
            if (!chkAgentId) { callback(new Error(`ptDiagnosis_View_Controller: chkAgentId return false`)); return; }
            else {
                const tempPtDiagnosisModel = require('../../mongodbController').tempPtDiagnosisModel;
                const findResult = tempPtDiagnosisModel.find(
                    {
                        'isused': true
                    },
                    {
                        '_id': 1,
                        'name': 1,
                        'run_number': 1
                    },
                    (err) => { if(err) { callback(err); return; } }
                );

                if(!findResult) { callback(new Error(`ptDiagnosis_View_Controller: findResult Have an Error`)); return; }
                else {
                    callback(null);
                    return findResult;
                }
            }
        }
    }
};


module.exports = {
    ptDiagnosis_View_Controller,
};