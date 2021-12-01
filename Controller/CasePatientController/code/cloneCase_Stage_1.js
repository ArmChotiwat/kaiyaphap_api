const casePatinetCloneStage1Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _patientid: new String(''),
        _casepatientid: new String('')
    },
    callback = (err = new Err) => {}
    ) => {
        if(typeof data != 'object') { callback(new Error(`casePatinetCloneStage1Controller: <data> must be Object`)); }
        else if(typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`casePatinetCloneStage1Controller: <data._storeid> must be String and Not Empty`)); return; }
        else if(typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`casePatinetCloneStage1Controller: <data._branchid> must be String and Not Empty`)); return; }
        else if(typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`casePatinetCloneStage1Controller: <data._agentid> must be String and Not Empty`)); return; }
        else if(typeof data._patientid != 'string' || data._patientid == '') { callback(new Error(`casePatinetCloneStage1Controller: <data._patientid> must be String and Not Empty`)); return; }
        else if(typeof data._casepatientid != 'string' || data._casepatientid == '') { callback(new Error(`casePatinetCloneStage1Controller: <data._casepatientid> must be String and Not Empty`)); return; }
        else {
            const moment = require('moment');
            const miscController = require('../../miscController');
            const checkCasePatientProgress = miscController.checkCasePatientProgress;
            const mongodbController = require('../../mongodbController');

            const create_date = moment();
            const create_date_string = create_date.format('YYYY-MM-DD');
            const create_time_string = create_date.format('HH:mm:ss');

            const modify_date = create_date;
            const modify_date_string = create_date.format('YYYY-MM-DD');
            const modify_time_string = create_date.format('HH:mm:ss');

            const chkCaseProgress = await checkCasePatientProgress(
                {
                    _storeid: data._storeid,
                    _branchid: data._branchid,
                    _agentid: data._agentid,
                    _patientid: data._patientid,
                    _casepatientid: data._casepatientid
                },
                (err) => { if(err) { callback(err); return; } }
            );            
            if(!chkCaseProgress.casePatientId) {
                callback(new Error('casePatinetCloneStage1Controller: data-casePatientId-not-exists'));
                return;
            }
            else if(!chkCaseProgress.casePatientPersonalDetailId) {
                callback(new Error('casePatinetCloneStage1Controller: data-casePatientPersonalDetailId-not-exists'));
                return;
            }
            else if(chkCaseProgress.casePatientStage1Id) {
                callback(new Error('casePatinetCloneStage1Controller: data-casePatientStage1Id-exists'));
                return;
            }
            else {
                const findSourceCasePatientForClone = await mongodbController.casePatientModel.aggregate(
                    [
                        {
                          '$match': {
                            '_ref_storeid': mongodbController.mongoose.Types.ObjectId(data._storeid), 
                            '_ref_branchid': mongodbController.mongoose.Types.ObjectId(data._branchid), 
                            '_ref_patient_userid': mongodbController.mongoose.Types.ObjectId(data._patientid), 
                            'istruncated': false
                          }
                        }, {
                          '$sort': {
                            'create_date': -1
                          }
                        }, {
                          '$lookup': {
                            'from': 'l_casepatient_stage_1', 
                            'localField': '_id', 
                            'foreignField': '_ref_casepatinetid', 
                            'as': 'stage1'
                          }
                        }, {
                          '$match': {
                            'stage1': {
                              '$size': 1
                            }
                          }
                        }, {
                          '$limit': 1
                        }
                    ],
                    (err) => { if(err) { callback(err); return; } }
                );

                if(!findSourceCasePatientForClone || findSourceCasePatientForClone.length != 1) { callback(new Error(`casePatinetCloneStage1Controller: Source Case as Requested are Not Found`)); return; }
                else {
                    const mapStage1 = {
                        _ref_casepatinetid: chkCaseProgress.casePatientId,
                        
                        create_date: create_date,
                        create_date_string: create_date_string,
                        create_time_string: create_time_string,
                        
                        modify_date: modify_date,
                        modify_date_string: modify_date_string,
                        modify_time_string: modify_time_string,

                        stage1data: {
                            medicine_take: findSourceCasePatientForClone[0].medicine_take,
                            injury_history: findSourceCasePatientForClone[0].injury_history,
                            physical_examination: findSourceCasePatientForClone[0].physical_examination,
                            surgery_history: findSourceCasePatientForClone[0].surgery_history,
                            caution: findSourceCasePatientForClone[0].caution,
                            congenital_disease: (findSourceCasePatientForClone[0].cautioncongenital_disease.length === 0 || !findSourceCasePatientForClone[0].cautioncongenital_disease) ? []: findSourceCasePatientForClone[0].cautioncongenital_disease.map(where => ({_ref_illnesscharid: where._ref_illnesscharid, name: where.name})),
                            drug_allergy: findSourceCasePatientForClone[0].drug_allergy,
                            illness_history: (findSourceCasePatientForClone[0].illness_history.length === 0 || !findSourceCasePatientForClone[0].illness_history) ? []: findSourceCasePatientForClone[0].illness_history.map(where => ({_ref_illnesscharid: where._ref_illnesscharid, name: where.name, answer: where.answer, detail: where.detail})),
                        }
                    }

                    const stage1Model = new mongodbController.casePatientStage1Model(mapStage1);

                    const transactionSave = await stage1Model.save()
                            .then(
                                result => { return result; }
                            )
                            .catch(
                                err => {
                                    callback(err);
                                    return;
                                }
                            );

                    if(!transactionSave) { callback(new Error(`casePatinetCloneStage1Controller: transactionSave have error`)); return; }
                    else {
                        callback(null);
                        return transactionSave;
                    }
                }
            }
        }
    };

module.exports = casePatinetCloneStage1Controller;