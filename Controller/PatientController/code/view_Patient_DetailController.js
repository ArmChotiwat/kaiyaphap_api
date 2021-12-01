/**
 * Controller สำหรับ รายละเอียดทั้งหมด ของผู้ป่วยที่ร้องขอไว้ (_ref_patientid) ในร้าน (_ref_storeid)
 */
const view_Patient_DetailController = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agent_userid: '',
        _ref_patient_userid: '',
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'view_Patient_DetailController';

    const { validate_StringObjectId_NotNull } = require('../../miscController');
    const { ObjectId, patientModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_agent_userid)) { callback(new Error(`${controllerName}: <data._ref_agent_userid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_patient_userid)) { callback(new Error(`${controllerName}: <data._ref_patient_userid> must be String ObjectId`)); return; }
    else {
        const inpsectPatient = await patientModel.aggregate(
            [
                {
                    '$match': {
                        '_id': ObjectId(data._ref_patient_userid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store'
                    }
                }, {
                    '$match': {
                        'store._storeid': ObjectId(data._ref_storeid)
                    }
                }
            ],
            (err) => { if (err) { callback(err); return; } }
        );

        if (!inpsectPatient) { callback(new Error(`${controllerName}: inpsectPatient have error during aggregate`)); return; }
        else if (inpsectPatient.length === 0) {
            callback(null);
            return;
        }
        else if (inpsectPatient.length !== 1 ) { callback(new Error(`${controllerName}: inpsectPatient return Length (${inpsectPatient.length}) more than 1`)); return; }
        else {
            inpsectPatient[0].store.personal.referral = await inpsectPatient[0].store.personal.referral || {};
            inpsectPatient[0].store.personal.referral.referral_name = await inpsectPatient[0].store.personal.referral.referral_name || '';
            inpsectPatient[0].store.personal.vip_agent = await inpsectPatient[0].store.personal.vip_agent || {};
            inpsectPatient[0].store.personal.vip_agent._agentid = await inpsectPatient[0].store.personal.vip_agent._agentid || '';

            callback(null);
            return inpsectPatient[0];
        }
    }
};

module.exports = view_Patient_DetailController;