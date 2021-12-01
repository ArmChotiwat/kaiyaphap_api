const checkCasePatientProgress = async (
    data = {
        _storeid: String(''),
        _branchid: String(''),
        // _agentid: String(''),
        _patientid: String(''),
        _casepatientid: String(''),
    },
    callback = (err = new Err) => {}
    ) => {
        if(typeof data != 'object') { callback(`checkCasePatientProgress: <data> must be Object`); }
        else if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`checkCasePatientProgress: <data._storeid> must be String and Not Empty`)); return; }
        else if(typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`checkCasePatientProgress: <data._branchid> must be String and Not Empty`)); return; }
        // else if(typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`checkCasePatientProgress: <data._agentid> must be String and Not Empty`)); return; }
        else if(typeof data._patientid != 'string' || data._patientid == '') { callback(new Error(`checkCasePatientProgress: <data._patientid> must be String and Not Empty`)); return; }
        else if(typeof data._casepatientid != 'string' || data._casepatientid == '') { callback(new Error(`checkCasePatientProgress: <data._casepatientid> must be String and Not Empty`)); return; }
        else {
            const mongodbController = require('../../mongodbController');
            const checkObjectId = require('../../mongodbController').checkObjectId;
            const ObjectId = mongodbController.ObjectId;
            const casePatientModel = mongodbController.casePatientModel;
            const casePatientPersonalDetailModel = mongodbController.casePatientPersonalDetailModel;
            const casePatientStage1Model = mongodbController.casePatientStage1Model;
            const casePatientStage2Model = mongodbController.casePatientStage2Model;
            const casePatientStage3Model = mongodbController.casePatientStage3Model;
            const treatmentModel = mongodbController.treatmentModel;

            const miscController = require('../../miscController');
            const checkAgentId = miscController.checkAgentId;
            const checkPatientId = miscController.checkPatientId;

            // const chkAgentId = await checkAgentId(
            //     {
            //         _agentid: data._agentid,
            //         _storeid: data._storeid,
            //         _branchid: data._branchid
            //     },
            //     (err) => { if(err) { callback(err); return; } }
            // );

            const chkPatientId = await checkPatientId(
                {
                    _patientid: data._patientid,
                    _storeid: data._storeid,
                    _branchid: data._branchid
                },
                (err) => { if(err) { callback(err); return; } }
            );

            let resultReport = {
                casePatientId: null,
                casePatientPersonalDetailId: null,
                casePatientStage1Id: null,
                casePatientStage2Id: null,
                casePatientStage3Id: null,
                casePatientFirstTimeTreatmentId: null,
            }



            const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
            const _branchid = await checkObjectId(data._branchid, (err) => { if(err) { callback(err); return; } });
            const _casepatientid = await checkObjectId(data._casepatientid, (err) => { if(err) { callback(err); return; } });

            const findCasePatient = await casePatientModel.find(
                {
                    '_id': _casepatientid,
                    '_ref_storeid': _storeid,
                    '_ref_branchid': _branchid,
                    // '_ref_agent_userid': chkAgentId._agentid,
                    '_ref_patient_userid': chkPatientId._patientid,
                },
                (err) => {
                    if(err) { callback(err); return; }
                }
            );
            if(findCasePatient && findCasePatient.length === 1) { resultReport.casePatientId = ObjectId(findCasePatient[0]._id) }
            else { callback(null); return resultReport; }

            const findcasePatientPersonalDetail = await casePatientPersonalDetailModel.find(
                {
                    '_ref_casepatinetid': findCasePatient[0]._id
                },
                (err) => { if(err) { callback(err); return; } }
            );
            if(findcasePatientPersonalDetail && findcasePatientPersonalDetail.length === 1) { resultReport.casePatientPersonalDetailId = ObjectId(findcasePatientPersonalDetail[0]._id) }

            const findcasePatientStage1 = await casePatientStage1Model.find(
                {
                    '_ref_casepatinetid': findCasePatient[0]._id
                },
                (err) => { if(err) { callback(err); return; } }
            );
            if(findcasePatientStage1 && findcasePatientStage1.length === 1) { resultReport.casePatientStage1Id = ObjectId(findcasePatientStage1[0]._id) }

            const findcasePatientStage2 = await casePatientStage2Model.find(
                {
                    '_ref_casepatinetid': findCasePatient[0]._id
                },
                (err) => { if(err) { callback(err); return; } }
            );
            if(findcasePatientStage2 && findcasePatientStage2.length === 1) { resultReport.casePatientStage2Id = ObjectId(findcasePatientStage2[0]._id) }

            const findcasePatientStage3 = await casePatientStage3Model.find(
                {
                    '_ref_casepatinetid': findCasePatient[0]._id
                },
                (err) => { if(err) { callback(err); return; } }
            );
            if(findcasePatientStage3 && findcasePatientStage3.length === 1) { resultReport.casePatientStage3Id = ObjectId(findcasePatientStage3[0]._id) }

            const findcasePatientFirstTimeTreatmentId = await treatmentModel.find(
                {
                    '_ref_casepatinetid': findCasePatient[0]._id,
                    '_ref_storeid': _storeid
                },
                (err) => { if (err) { callback(err); return; } }
            ).sort({_id: 1}).limit(1);
            if(findcasePatientFirstTimeTreatmentId && findcasePatientFirstTimeTreatmentId.length === 1) { resultReport.casePatientFirstTimeTreatmentId = ObjectId(findcasePatientFirstTimeTreatmentId[0]._id) }

            callback(null);
            return resultReport;
        }

    };

module.exports = checkCasePatientProgress;
