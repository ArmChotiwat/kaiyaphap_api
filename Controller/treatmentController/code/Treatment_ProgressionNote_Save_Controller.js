const Treatment_ProgressionNote_Save_Controller = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agentid: '',
        _ref_pateintid: '',
        _ref_scheduleid: '',
        _ref_casepatientid: '',
        _ref_treatmentid: '',
        diagnosis_file_type: 0,
        S: '',
        O: '',
        A: '',
        P: '',
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `Treatment_ProgressionNote_Save_Controller`;

    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const validate_StringOrNull_AndNotEmpty = miscController.validate_StringOrNull_AndNotEmpty;
    const checkAgentId = miscController.checkAgentId;
    const checkPatientId = miscController.checkPatientId;
    const checkCasePatientId_StoreBranch= miscController.checkCasePatientId_StoreBranch;
    const Schedule_Check_Status = miscController.Schedule_Check_Status;
    const validateNumber = miscController.validateNumber;
    const currentTime = miscController.currentDateTime();

    const { ObjectId, treatmentModel, treatment_ProgressionNoteModel, casePatient_StatusModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
    else if (typeof data._ref_pateintid != 'string' || !validateObjectId(data._ref_pateintid)) { callback(new Error(`${controllerName}: <data._ref_pateintid> must be String ObjectId`)); return; }
    else if (typeof data._ref_scheduleid != 'string' || !validateObjectId(data._ref_scheduleid)) { callback(new Error(`${controllerName}: <data._ref_scheduleid> must be String ObjectId`)); return; }
    else if (typeof data._ref_casepatientid != 'string' || !validateObjectId(data._ref_casepatientid)) { callback(new Error(`${controllerName}: <data._ref_casepatientid> must be String ObjectId`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data._ref_treatmentid)) { callback(new Error(`${controllerName}: <data._ref_treatmentid> must be String ObjectId or Null`)); return; }
    else if (!validateNumber(data.diagnosis_file_type)) { callback(new Error(`${controllerName}: <diagnosis_file_type> must be Number and Reage 0-3`)); return; }
    else if (!(Math.ceil(data.diagnosis_file_type) >= 0 && Math.ceil(data.diagnosis_file_type) <= 3)) { callback(new Error(`${controllerName}: <diagnosis_file_type> must be Number of Reage 0-3`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.S)) { callback(new Error(`${controllerName}: <data.S> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.O)) { callback(new Error(`${controllerName}: <data.O> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.A)) { callback(new Error(`${controllerName}: <data.A> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.P)) { callback(new Error(`${controllerName}: <data.P> must be String or Null and Not Empty`)); return; }
    else {

        data.diagnosis_file_type = Math.ceil(data.diagnosis_file_type);

        let _ref_treatmentid = null;
        let _ref_STCasePatientid = null;
        if (data._ref_treatmentid !== null) {
            if (typeof data._ref_treatmentid != 'string' && !validateObjectId(data._ref_treatmentid)) { callback(new Error(`${controllerName}: <data._ref_treatmentid> must be String ObjectId or Nll`)); return; }
            else {
                const findTreatment = await treatmentModel.findOne(
                    {
                        '_id': ObjectId(data._ref_treatmentid),
                        '_ref_casepatinetid': ObjectId(data._ref_casepatientid)
                    },
                    {},
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!findTreatment) { callback(new Error(`${controllerName}: findTreatment at _id:${data._ref_treatmentid} and at _ref_casepatinetid:${data._ref_casepatientid} return not found`)); return; }
                else {
                    const findST_CasePatient = await casePatient_StatusModel.findOne(
                        {
                            _ref_storeid: ObjectId(data._ref_storeid),
                            _ref_branchid: ObjectId(data._ref_branchid),
                            _ref_casepatientid: ObjectId(data._ref_casepatientid),
                            _ref_treatmentid: ObjectId(data._ref_treatmentid),
                            isnextvisited: true
                        },
                        {},
                        (err) => { if (err) { callback(err); return; } }
                    );

                    if (!findST_CasePatient) { callback(new Error(`${controllerName}: findST_CasePatient return not found`)); return; }
                    else {
                        _ref_treatmentid = ObjectId(data._ref_treatmentid);
                        _ref_STCasePatientid = ObjectId(findST_CasePatient._id);
                    }
                }
            }
        }

        const Update_STCasePatient_Status = async (_pgnid = ObjectId(), cb = (err = new Error) => {}) => {
            if (typeof _pgnid == 'object') {
                if (typeof _ref_treatmentid == 'object' && validateObjectId(String(_ref_treatmentid)) && typeof _ref_STCasePatientid == 'object' && validateObjectId(String(_ref_STCasePatientid))) {
                    for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {
                        let findCasePatientStatus = await casePatient_StatusModel.findOne(
                            {
                                '_id': _ref_STCasePatientid
                            },
                            {},
                            (err) => { if (err) { cb(err); return; } }
                        );
    
                        if (!findCasePatientStatus) { continue; }
                        else {
                            findCasePatientStatus._ref_treatmentid = _ref_treatmentid;
                            findCasePatientStatus._ref_treatment_progressionnoteid = _pgnid;
    
                            const transactionSTCasePatientUpdate = await findCasePatientStatus.save().then(result => result).catch(err => { if (err) { cb(err); return; } });
    
                            if (!transactionSTCasePatientUpdate) { continue; }
                            else {
                                break;
                            }
                        }
                    }
                }
                else if (_ref_treatmentid === null && _ref_STCasePatientid === null) {
                    const mapNew_STCasePatient = {
                        _ref_storeid: ObjectId(data._ref_storeid),
                        _ref_branchid: ObjectId(data._ref_branchid),
                        _ref_casepatientid: ObjectId(data._ref_casepatientid),
                        _ref_treatmentid: null,
                        _ref_treatment_progressionnoteid: _pgnid,
                        _ref_poid: null,
                        isnextvisited: true,
                        isclosed: false,
                        istruncated: false
                    };

                    const newSTCasePatient = new casePatient_StatusModel(mapNew_STCasePatient);
                    await newSTCasePatient.save().then(result => result).catch(err => { if (err) { cb(err); return; } });
                }
                else {
                    cb(new Error(`${controllerName}: Update_STCasePatient_Status Out of Rule _ref_treatmentid: (${_ref_treatmentid}), _ref_STCasePatientid (${_ref_STCasePatientid})`));
                    return;
                }
            }
            else {
                callback(new Error(`${controllerName}: Update_STCasePatient_Status _pgnid (${_pgnid}) must be Object`));
                return;
            }
        };


        const chkAgentId = await checkAgentId(
            {
                _agentid: data._ref_agentid,
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        const chkPatientId = await checkPatientId(
            {
                _patientid: data._ref_pateintid,
                _storeid: data._ref_storeid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        const chkSchedule = await Schedule_Check_Status(
            {
                _ref_scheduleid: data._ref_scheduleid,
                _ref_storeid: data._ref_storeid,
                _ref_branchid: data._ref_branchid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        const chkCasePatient = await checkCasePatientId_StoreBranch(
            data._ref_storeid,
            data._ref_branchid,
            data._ref_casepatientid,
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgentId) { callback(new Error(`${controllerName}: chkAgentId return not found`)); return; }
        else if (chkAgentId.role !== 2) { callback(new Error(`${controllerName}: chkAgentId.role (${chkAgentId.role}) not equal 2 <Terrapiss People>`)); return; }
        else if (!chkPatientId) { callback(new Error(`${controllerName}: chkPatientId return not found`)); return; }
        else if (!chkSchedule) { callback(new Error(`${controllerName}: chkSchedule return not found`)); return; }
        else if (chkSchedule.statusMode !== 3 && chkSchedule.statusMode !== 4 && chkSchedule.statusMode !== 5) { callback(new Error(`${controllerName}: chkSchedule.statusMode (${chkSchedule.statusMode}) not equal 3 or 4 <W8ing 4 treatment> or 5 <finished>`)); return; }
        else if (!chkCasePatient) { callback(new Error(`${controllerName}: chkCasePatient return not found`)); return; }
        else {
            const map_New_Treatment_ProgressionNote = {
                run_number: null,
                _ref_scheduleid: ObjectId(chkSchedule._ref_scheduleid),
                _ref_casepatinetid: ObjectId(chkCasePatient._ref_casepatientid),
                _ref_treatmentid: _ref_treatmentid,
                _ref_patient_userid: chkPatientId._patientid,
                _ref_patient_userstoreid: chkPatientId._patientstoreid,
                _ref_storeid: chkAgentId._storeid,
                _ref_branchid: chkAgentId._branchid,
                S: data.S,
                O: data.O,
                A: data.A,
                P: data.P,
                create_date: currentTime.currentDateTime_Object,
                create_date_string: currentTime.currentDate_String,
                create_time_string: currentTime.currentTime_String,
                _ref_agent_userid_create: chkAgentId._agentid,
                _ref_agent_userstoreid_create: chkAgentId._agentstoreid,
                modify_date: currentTime.currentDateTime_Object,
                modify_date_string: currentTime.currentDate_String,
                modify_time_string: currentTime.currentTime_String,
                _ref_agent_userid_modify: chkAgentId._agentid,
                _ref_agent_userstoreid_modify: chkAgentId._agentstoreid,
                diagnosis_file_type: data.diagnosis_file_type,
            };

            const newTreatmentProgressionNoteModel = new treatment_ProgressionNoteModel(map_New_Treatment_ProgressionNote);
            const transactionTreatmentProgressionNoteSave = await newTreatmentProgressionNoteModel.save().then(result => result).catch(err => { if (err) { callback(err); return; } });

            if (!transactionTreatmentProgressionNoteSave) { callback(new Error(`${controllerName}: transactionTreatmentProgressionNoteSave have error`)); return; }
            else {
                if (data._ref_treatmentid !== null) {
                    for (let Retry_Count = 0; Retry_Count < 10; Retry_Count++) {
                        let findTreatmentUpdate = await treatmentModel.findOne(
                            {
                                '_id': ObjectId(data._ref_treatmentid)
                            },
                            {},
                            (err) => { if (err) { console.error(err); return; } }
                        );
    
                        if (!findTreatmentUpdate) { continue; }
                        else {
                            findTreatmentUpdate._ref_treatment_progressionnoteid = ObjectId(transactionTreatmentProgressionNoteSave._id)
    
                            const transactionTreatmentUpdate = await findTreatmentUpdate.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });
    
                            if (!transactionTreatmentUpdate) { continue; }
                            else {
                                break;
                            }
                        }
                    }
                }

                await Update_STCasePatient_Status(ObjectId(transactionTreatmentProgressionNoteSave._id), (err) => { if (err) { console.error(err); } });

                callback(null);
                return {
                    _ref_teatment_progressionnoteid: ObjectId(transactionTreatmentProgressionNoteSave._id),
                    _ref_scheduleid: ObjectId(chkSchedule._ref_scheduleid),
                    _ref_casepatinetid: ObjectId(chkCasePatient._ref_casepatientid),
                };
            }
        }
    }
};

module.exports = Treatment_ProgressionNote_Save_Controller;