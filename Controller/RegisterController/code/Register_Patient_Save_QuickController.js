const Register_Patient_Save_QuickController = async (
    data = {
        _ref_agent_userid: '',
        _ref_storeid: '',
        _ref_branchid: '',
        pre_name: '',
        special_prename: '',
        first_name: '',
        last_name: '',
        phone_number: ''
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'Register_Patient_Save_QuickController';

    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty, validate_StringOrNull_AndNotEmpty, validatePhoneNumber, currentDateTime, checkAgentId, regExReplace  } = require('../../miscController');
    const { ObjectId, patientPhoneNumberModel, patientModel } = require('../../mongodbController');

    const registerPatientController_AutoIncresement = require('./registerPatientController_AutoIncresement');
    const checkPatient_ZeroFill = require('./checkPatient_ZeroFill');

    const Retry_Max = 10;

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_agent_userid)) { callback(new Error(`${controllerName}: <data._ref_agent_userid> must be String ObjectId and Not Empty`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId and Not Empty`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(data.pre_name)) { callback(new Error(`${controllerName}: <data.pre_name> must be String and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.special_prename)) { callback(new Error(`${controllerName}: <data.pre_name> must be String or Null and Not Empty`)); return; }
    else if (data.pre_name === 'อื่นๆ' && !validate_String_AndNotEmpty(data.special_prename)) { callback(new Error(`${controllerName}: <data.special_prename> must be String and Not Empty, Due <data.pre_name> is selected other`)); return; }
    else if (data.pre_name !== 'อื่นๆ' && data.special_prename !== null) { callback(new Error(`${controllerName}: <data.special_prename> must be Null, Due <data.pre_name> is not selected other`)); return; }
    else if (!validate_String_AndNotEmpty(data.first_name)) { callback(new Error(`${controllerName}: <data.first_name> must be String and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(data.last_name)) { callback(new Error(`${controllerName}: <data.last_name> must be String and Not Empty`)); return; }
    else if (!validate_String_AndNotEmpty(data.phone_number)) { callback(new Error(`${controllerName}: <data.phone_number> must be String and Not Empty`)); return; }
    else if (!validatePhoneNumber(data.phone_number)) { callback(new Error(`${controllerName}: <data.phone_number> must be String contains 0 to 9 and have 10 digits`)); return; }
    else {
        const chkAgent = await checkAgentId(
            {
                _agentid: data._ref_agent_userid,
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        const checkPatientPhoneNumberDuplicate = await patientPhoneNumberModel.findOne(
            {
                '_ref_storeid': ObjectId(data._ref_storeid),
                'phone_number': data.phone_number
            },
            {},
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgent) { callback(new Error(`${controllerName}: chkAgent return not found`)); return; }
        else if (checkPatientPhoneNumberDuplicate) { callback(new Error(`${controllerName}: checkPatientPhoneNumberDuplicate return found <phone_number> (${data.phone_number}) in <_ref_storeid> (${data._ref_storeid})`)); return; }
        else {
            const newPhoneNumberUnique = new patientPhoneNumberModel(
                {
                    '_ref_storeid': ObjectId(data._ref_storeid),
                    '_ref_patient_userid': null,
                    '_ref_patient_userstoreid': null,
                    'phone_number': data.phone_number
                }
            );

            const transactionNewPhoneNumberUniqueSave = await newPhoneNumberUnique.save().then(result => result).catch(err => { if (err) { callback(err); return; } });

            if (!transactionNewPhoneNumberUniqueSave) { callback(new Error(`${controllerName} transactionNewPhoneNumberUniqueSave have error`)); return; }
            else {
                const Rollback_newPhoneNumberUnique = async () => {
                    await patientPhoneNumberModel.findByIdAndDelete(transactionNewPhoneNumberUniqueSave._id, (err) => { if (err) { console.error(err); return; } });
                };

                const findDataExist_FROM_pateintModel = await patientModel.findOne(
                    {
                        'username': data.phone_number
                    },
                    {},
                    async (err) => { if (err) { await Rollback_newPhoneNumberUnique(); callback(err); return; } }
                );

                const currentTime = currentDateTime();
                let MAP_Patient_User = {
                    username: data.phone_number,
                    password: '12345678',
                    store: [
                        {
                            _id: ObjectId(),
                            _storeid: ObjectId(data._ref_storeid),
                            register_from_branch: ObjectId(data._ref_branchid),
                            hn: null,
                            userRegisterDate: currentTime.currentDateTime_Object.format("YYYY-MM-DD"),
                            create_date: currentTime.currentDateTime_Object,
                            create_date_string: currentTime.currentDate_String,
                            create_time_string: currentTime.currentTime_String,
                            user_status: true,
                            personal: {
                                pre_name: data.pre_name,
                                special_prename: data.special_prename,
                                first_name: regExReplace.regEx_ClearWhiteSpaceStartEnd(data.first_name),
                                last_name: regExReplace.regEx_ClearWhiteSpaceStartEnd(data.last_name),
                                phone_number: data.phone_number
                            }
                        }
                    ]
                };

                if (!findDataExist_FROM_pateintModel) { // NOT Found Data Username FROM patientModel
                    const GET_AutoIncresement_Patient = await registerPatientController_AutoIncresement(
                        {
                          _storeid: String(data._ref_storeid),
                          personal_idcard: data.phone_number
                        },
                        async (err) => { if (err) { await Rollback_newPhoneNumberUnique();  callback(err); return; } }
                    );

                    if (!GET_AutoIncresement_Patient) { await Rollback_newPhoneNumberUnique(); callback(new Error(`${controllerName}: <NOT findDataExist_FROM_pateintModel> GET_AutoIncresement_Patient have error`)); return; }
                    else {
                        const convert_HN = await checkPatient_ZeroFill(parseInt(GET_AutoIncresement_Patient.seq), 6, async (err) => { if (err) { await Rollback_newPhoneNumberUnique(); callback(err); return; } } );

                        if (!convert_HN) { await Rollback_newPhoneNumberUnique(); callback(new Error(`${controllerName}: <NOT findDataExist_FROM_pateintModel> convert_HN have error`)); return; }
                        else {
                            MAP_Patient_User.store[0].hn = convert_HN;

                            const createPatient = new patientModel(MAP_Patient_User);
                            const tansactionCreatePatientSave = await createPatient.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });

                            if (!tansactionCreatePatientSave) { await Rollback_newPhoneNumberUnique(); callback(new Error(`${controllerName}: <NOT findDataExist_FROM_pateintModel> tansactionCreatePatientSave have error`)); return; }
                            else {
                                const updatePhoneNumberUnique = await patientPhoneNumberModel.findByIdAndUpdate(
                                    transactionNewPhoneNumberUniqueSave._id,
                                    {
                                        $set: {
                                            '_ref_patient_userid': tansactionCreatePatientSave._id,
                                            '_ref_patient_userstoreid': tansactionCreatePatientSave.store[0]._id
                                        }
                                    },
                                    (err) => { if (err) { console.error(err); return; } }
                                );

                                if (!updatePhoneNumberUnique) {
                                    await patientModel.findOneAndDelete(tansactionCreatePatientSave._id, (err) => { if (err) { console.error(err); return; } });
                                    await Rollback_newPhoneNumberUnique();
                                    callback(new Error(`${controllerName}: <NOT findDataExist_FROM_pateintModel> updatePhoneNumberUnique have error`));
                                    return;
                                }
                                else {
                                    callback(null);
                                    return tansactionCreatePatientSave;
                                }
                            }
                        }
                    }
                }
                else { // Found Data Username FROM patientModel
                    const GET_AutoIncresement_Patient = await registerPatientController_AutoIncresement(
                        {
                          _storeid: String(data._ref_storeid),
                          personal_idcard: data.phone_number
                        },
                        async (err) => { if (err) { await Rollback_newPhoneNumberUnique();  callback(err); return; } }
                    );

                    
                    if (!GET_AutoIncresement_Patient) { await Rollback_newPhoneNumberUnique(); callback(new Error(`${controllerName}: <findDataExist_FROM_pateintModel> GET_AutoIncresement_Patient have error`)); return; }
                    else {
                        const convert_HN = await checkPatient_ZeroFill(parseInt(GET_AutoIncresement_Patient.seq), 6, async (err) => { if (err) { await Rollback_newPhoneNumberUnique(); callback(err); return; } } );

                        if (!convert_HN) { await Rollback_newPhoneNumberUnique(); callback(new Error(`${controllerName}: <findDataExist_FROM_pateintModel> convert_HN have error`)); return; }
                        else {
                            MAP_Patient_User.store[0].hn = convert_HN;

                            for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                                let GET_PatientData = await patientModel.findOne(
                                    {
                                        '_id': findDataExist_FROM_pateintModel._id
                                    },
                                    {},
                                    async (err) => { if (err) { await Rollback_newPhoneNumberUnique(); callback(err); return; } }
                                );
        
                                if (!GET_PatientData) { await Rollback_newPhoneNumberUnique(); callback(new Error(`${controllerName}: <findDataExist_FROM_pateintModel> GET_PatientData return not found from _ref_patient_userid (${findDataExist_FROM_pateintModel._id})`)); return; }
                                else {
                                    GET_PatientData.store.push(MAP_Patient_User.store[0]);
        
                                    const transactionPatientUpdate = await GET_PatientData.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });
        
                                    if (!transactionPatientUpdate) { continue; }
                                    else {

                                        const updatePhoneNumberUnique = await patientPhoneNumberModel.findByIdAndUpdate(
                                            transactionNewPhoneNumberUniqueSave._id,
                                            {
                                                $set: {
                                                    '_ref_patient_userid': transactionPatientUpdate._id,
                                                    '_ref_patient_userstoreid': MAP_Patient_User.store[0]._id
                                                }
                                            },
                                            (err) => { if (err) { console.error(err); return; } }
                                        );
        
                                        if (!updatePhoneNumberUnique) {
                                            await patientModel.updateOne(
                                                {
                                                    '_id': transactionPatientUpdate._id,
                                                    'store._id': MAP_Patient_User.store[0]._id
                                                },
                                                {
                                                    $pull: {
                                                        'store': {
                                                            '_id': MAP_Patient_User.store[0]._id
                                                        }
                                                    }
                                                },
                                                (err) => { if (err) { console.error(err); return; } }
                                            );
                                            
                                            await Rollback_newPhoneNumberUnique();
                                            callback(new Error(`${controllerName}: <NOT findDataExist_FROM_pateintModel> updatePhoneNumberUnique have error`));
                                            return;
                                        }
                                        else {
                                            callback(null);
                                            return transactionPatientUpdate;
                                        }
                                    }
                                }
                            }
        
                            await Rollback_newPhoneNumberUnique();
                            callback(new Error(`${controllerName}: <findDataExist_FROM_pateintModel transactionPatientUpdate Have Error Or Server is Busy`));
                            return;
                        }
                    }
                }
            }
        }
    }
};


module.exports = Register_Patient_Save_QuickController;