/**
 * Register Patient Controller
 * สำหรับ ลงทะเบียนผู้ป่วย แบบเต็มรูปแบบ
 */
const Register_Patient_Save_FullController = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agentid: '',
        hn_ref: '',
        patientPersonalData: {},
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `Register_Patient_Save_FullController`;

    const { validate_StringObjectId_NotNull, checkAgentId, validate_String_AndNotEmpty, validate_StringOrNull_AndNotEmpty, currentDateTime, regExReplace } = require('../../miscController');
    const { patientPIDModel, patientPhoneNumberModel, ObjectId, patientModel } = require('../../mongodbController');
    const registerPatientController_AutoIncresement = require('./registerPatientController_AutoIncresement');

    const nowDateTime = currentDateTime();
    
    const Retry_Max = 10;

    const checkPatient_Personal_Data = require('./checkPatient_Personal_Data');
    const checkPatient_Personal_IdentityCard = require('./checkPatient_Personal_IdentityCard');
    const checkPatient_Personal_ContractCard = require('./checkPatient_Personal_ContractCard');
    const checkPatient_Personal_ContractPresent = require('./checkPatient_Personal_ContractPresent');
    const checkPatient_Personal_ContractEmergency = require('./checkPatient_Personal_ContractEmergency');
    const checkPatient_Personal_MedicationPrivilege = require('./checkPatient_Personal_MedicationPrivilege');
    const checkPatient_Personal_GeneralUserDetail = require('./checkPatient_Personal_GeneralUserDetail');
    const checkPatient_Personal_IllnessHistory = require('./checkPatient_Personal_IllnessHistory');
    const checkPatient_Personal_Referral = require('./checkPatient_Personal_Referral');
    const checkPatient_Personal_VipAgent = require('./checkPatient_Personal_VipAgent');
    const checkPatient_ZeroFill = require('./checkPatient_ZeroFill');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(data.hn_ref)) { callback(new Error(`${controllerName}: <data.hn_ref> must be String or Null and Not Empty`)); return; }
    else if (typeof data.patientPersonalData != 'object') { callback(new Error(`${controllerName}: <data.patientPersonalData> must be Object`)); return; }
    else {
        const chkAgent = await checkAgentId(
            {
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid,
                _agentid: data._ref_agentid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgent) { callback(new Error(`${controllerName}: chkAgent return not found`)); return; }
        else if (!chkAgent.role) { callback(new Error(`${controllerName}: chkAgent.role return not found`)); return; }
        else if (chkAgent.role !== 1) { callback(new Error(`${controllerName}: chkAgent.role ${chkAgent.role} not equal 1 <Admin>`)); return; }
        else {
            const DoCheck_checkPatient_Personal = await checkPatient_Personal_Data(data.patientPersonalData, data._ref_storeid, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_IdentityCard = await checkPatient_Personal_IdentityCard(data.patientPersonalData.identity_card, data._ref_storeid, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_ContractCard = await checkPatient_Personal_ContractCard(data.patientPersonalData.contract_card, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_ContractPresent = await checkPatient_Personal_ContractPresent(data.patientPersonalData.contract_present, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_ContractEmergency = await checkPatient_Personal_ContractEmergency(data.patientPersonalData.contract_emergency, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_MedicationPrivilege = await checkPatient_Personal_MedicationPrivilege(data.patientPersonalData.medication_privilege, (err) => { if (err) { callback(err); return; } });
            const DoCheck_checkPatient_Personal_GeneralUserDetail = await checkPatient_Personal_GeneralUserDetail(data.patientPersonalData.general_user_detail, data._ref_storeid, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_IllnessHistory = await checkPatient_Personal_IllnessHistory(data.patientPersonalData.illness_history, data._ref_storeid, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_Referral = await checkPatient_Personal_Referral(data.patientPersonalData.referral, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_VipAgent = await checkPatient_Personal_VipAgent(data.patientPersonalData.vip_agent, data._ref_storeid, data._ref_branchid, (err) => { if (err) { callback(err); return; } } );

            if (!DoCheck_checkPatient_Personal) { callback(new Error(`${controllerName}: <data.patientPersonalData> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_IdentityCard) { callback(new Error(`${controllerName}: <data.patientPersonalData.identity_card> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_ContractCard) { callback(new Error(`${controllerName}: <data.patientPersonalData.contract_card> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_ContractPresent) { callback(new Error(`${controllerName}: <data.patientPersonalData.contract_present> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_ContractEmergency) { callback(new Error(`${controllerName}: <data.patientPersonalData.contract_emergency> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_MedicationPrivilege) { callback(new Error(`${controllerName}: <data.patientPersonalData.medication_privilege> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_GeneralUserDetail) { callback(new Error(`${controllerName}: <data.patientPersonalData.general_user_detail> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_IllnessHistory) { callback(new Error(`${controllerName}: <data.patientPersonalData.illness_history> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_Referral) { callback(new Error(`${controllerName}: <data.patientPersonalData.referral> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_VipAgent) { callback(new Error(`${controllerName}: <data.patientPersonalData.vip_agent> validated failed`)); return; }
            else {
                // Check _ Check Personal Identity Card ID
                // Check _ Check Personal Phone Number
                if (typeof data.patientPersonalData.identity_card != 'object') { callback(new Error(`${controllerName}: <data.patientPersonalData.identity_card> must be Object`)); return; }
                else if (typeof data.patientPersonalData.identity_card.ctype != 'boolean') { callback(new Error(`${controllerName}: <data.patientPersonalData.identity_card.ctype> must be Boolean`)); return; }
                else if (!validate_String_AndNotEmpty(data.patientPersonalData.identity_card.id)) { callback(new Error(`${controllerName}: <data.patientPersonalData.identity_card.id> must be String and Not Empty`)); return; }
                else if (!validate_String_AndNotEmpty(data.patientPersonalData.phone_number)) { callback(new Error(`${controllerName}: <data.patientPersonalData.phone_number> must be String and Not Empty`)); return; }
                else {

                    const findPatinetPID = await patientPIDModel.findOne(
                        {
                            _ref_storeid: ObjectId(data._ref_storeid),
                            identity_card: String(data.patientPersonalData.identity_card.id),
                        },
                        (err) => { if (err) { callback(err); return; } }
                    );

                    const findPatinetPhoneNumber = await patientPhoneNumberModel.findOne(
                        {
                            _ref_storeid: ObjectId(data._ref_storeid),
                            phone_number: String(data.patientPersonalData.phone_number)
                        },
                        (err) => { if (err) { callback(err); return; } }
                    );

                    if (findPatinetPID) { callback(new Error(`${controllerName}: findPatinetPID return found _ref_storeid: (${findPatinetPID._ref_storeid}), identity_card: (${findPatinetPID.identity_card})`)); return; }
                    else if (findPatinetPhoneNumber) { callback(new Error(`${controllerName}: findPatinetPhoneNumber return found _ref_storeid: (${findPatinetPhoneNumber._ref_storeid}), phone_number: (${findPatinetPhoneNumber.phone_number})`)); return; }
                    else {
                        // Save _ Check Personal Identity Card ID Data
                        const new_patientPID = new patientPIDModel(
                            {
                                _ref_storeid: ObjectId(data._ref_storeid), 
                                identity_card: String(data.patientPersonalData.identity_card.id),
                                _ref_patient_userid: null,
                                _ref_patient_userstoreid: null,
                            }
                        );
                        const transctionPatientPID_Save = await new_patientPID.save().then(result => result).catch(err => { if (err) { callback(err); return; } });

                        if (!transctionPatientPID_Save) { callback(new Error(`${controllerName}: transctionPatientPID_Save have error during Save the New Document`)); return; }
                        else {
                            const new_patientPhoneNumber = new patientPhoneNumberModel(
                                {
                                    _ref_storeid: ObjectId(data._ref_storeid), 
                                    phone_number: String(data.patientPersonalData.phone_number),
                                    _ref_patient_userid: null,
                                    _ref_patient_userstoreid: null,
                                }
                            );
                            const transctionPatientPhoneNumber_Save = await new_patientPhoneNumber.save().then(result => result).catch(err => { if (err) { callback(err); return; } });

                            // Save _ Check Personal Phone Number
                            if (!transctionPatientPhoneNumber_Save) {
                                await patientPIDModel.findByIdAndDelete(transctionPatientPID_Save._id, (err) => { console.error(err); return; });
                                callback(new Error(`${controllerName}: transctionPatientPhoneNumber_Save have error during Save the New Document`));
                                return;
                            }
                            else {
                                const Rollback_CheckPatientDocument = async () => {
                                    await patientPIDModel.findByIdAndDelete(transctionPatientPID_Save._id, (err) => { console.error(err); return; });
                                    await patientPhoneNumberModel.findByIdAndDelete(transctionPatientPhoneNumber_Save._id, (err) => { console.error(err); return; });
                                };

                                // MAP PatientPersonal Data
                                const MAP_Patient_Personal = {
                                    identity_card: DoCheck_checkPatient_Personal_IdentityCard,
                                    pre_name: DoCheck_checkPatient_Personal.pre_name,
                                    special_prename: DoCheck_checkPatient_Personal.special_prename,
                                    first_name: regExReplace.regEx_ClearWhiteSpaceStartEnd(DoCheck_checkPatient_Personal.first_name),
                                    last_name: regExReplace.regEx_ClearWhiteSpaceStartEnd(DoCheck_checkPatient_Personal.last_name),
                                    nick_name: DoCheck_checkPatient_Personal.nick_name,
                                    gender: DoCheck_checkPatient_Personal.gender,
                                    birth_date: DoCheck_checkPatient_Personal.birth_date,
                                    height: DoCheck_checkPatient_Personal.height,
                                    weight: DoCheck_checkPatient_Personal.weight,
                                    nationality: DoCheck_checkPatient_Personal.nationality,
                                    race: DoCheck_checkPatient_Personal.race,
                                    religion: DoCheck_checkPatient_Personal.religion,
                                    blood_type: DoCheck_checkPatient_Personal.blood_type,
                                    telephone_number: DoCheck_checkPatient_Personal.telephone_number,
                                    phone_number: DoCheck_checkPatient_Personal.phone_number,
                                    email: DoCheck_checkPatient_Personal.email,
                                    status: DoCheck_checkPatient_Personal.status,
                                    occupation: DoCheck_checkPatient_Personal.occupation,
                                    contract_card: DoCheck_checkPatient_Personal_ContractCard,
                                    contract_present: DoCheck_checkPatient_Personal_ContractPresent,
                                    contract_emergency: DoCheck_checkPatient_Personal_ContractEmergency,
                                    medication_privilege: DoCheck_checkPatient_Personal_MedicationPrivilege,
                                    general_user_detail: DoCheck_checkPatient_Personal_GeneralUserDetail,
                                    illness_history: DoCheck_checkPatient_Personal_IllnessHistory,
                                    referral: DoCheck_checkPatient_Personal_Referral,
                                    vip_agent: DoCheck_checkPatient_Personal_VipAgent,
                                };

                                let findUsernameExists = await patientModel.findOne(
                                    {
                                        'username': MAP_Patient_Personal.phone_number
                                    },
                                    {},
                                    async (err) => { if (err) { await Rollback_CheckPatientDocument(); callback(new Error(`${controllerName}: findUsernameExists have Error`)); return; } }
                                );

                                let MAP_Patient_User = {
                                    username: MAP_Patient_Personal.phone_number,
                                    password: '12345678',
                                    store:[
                                        {
                                            _storeid: ObjectId(data._ref_storeid),
                                            register_from_branch: ObjectId(data._ref_branchid),
                                            hn: null,
                                            hn_ref: data.hn_ref,
                                            userRegisterDate: nowDateTime.currentDateTime_Object.format('YYYY-MM-DD'),
                                            create_date: nowDateTime.currentDateTime_Object,
                                            create_date_string: nowDateTime.currentDate_String,
                                            create_time_string: nowDateTime.currentTime_String,
                                            user_status: true,
                                            personal: MAP_Patient_Personal
                                        }
                                    ]
                                };

                                if (!findUsernameExists) { // Username Of Patient Not Found
                                    const GET_AutoIncresement_Patient = await registerPatientController_AutoIncresement(
                                        {
                                          _storeid: String(MAP_Patient_User.store[0]._storeid),
                                          personal_idcard: MAP_Patient_User.store[0].personal.identity_card.id
                                        },
                                        (err) => { if (err) {  console.error(err); return; } }
                                    );

                                    if (!GET_AutoIncresement_Patient) { await Rollback_CheckPatientDocument(); callback(new Error(`${controllerName}: <NOT findUsernameExists> GET_AutoIncresement_Patient Have Error`)); return; }
                                    else {
                                        const convert_HN = await checkPatient_ZeroFill(parseInt(GET_AutoIncresement_Patient.seq), 6, (err) => { if (err) { console.error(err); return; } } );

                                        if (!convert_HN) { await Rollback_CheckPatientDocument(); callback(`${controllerName}: <NOT findUsernameExists> convert_HN have error `); return; }

                                        MAP_Patient_User.store[0].hn = convert_HN;

                                        const createPatient = new patientModel(MAP_Patient_User);
                                        const tansactionCreatePatientSave = await createPatient.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });

                                        if (!tansactionCreatePatientSave) { await Rollback_CheckPatientDocument(); callback(new Error(`${controllerName}: <NOT findUsernameExists> tansactionCreatePatientSave failed`)); return; }
                                        else {
                                            await patientPIDModel.findByIdAndUpdate(
                                                transctionPatientPID_Save._id,
                                                {
                                                    $set: {
                                                        '_ref_patient_userid': tansactionCreatePatientSave._id,
                                                        '_ref_patient_userstoreid': tansactionCreatePatientSave.store[0]._id
                                                    }
                                                },
                                                (err) => { if (err) { console.error(err); return; } }
                                            );
                                            await patientPhoneNumberModel.findByIdAndUpdate(
                                                transctionPatientPhoneNumber_Save._id,
                                                {
                                                    $set: {
                                                        '_ref_patient_userid': tansactionCreatePatientSave._id,
                                                        '_ref_patient_userstoreid': tansactionCreatePatientSave.store[0]._id
                                                    }
                                                },
                                                (err) => { if (err) { console.error(err); return; } }
                                            );

                                            callback(null);
                                            return tansactionCreatePatientSave;
                                        }
                                    }
                                }
                                else { // Username Of Patient Found
                                    const GET_AutoIncresement_Patient = await registerPatientController_AutoIncresement(
                                        {
                                          _storeid: String(MAP_Patient_User.store[0]._storeid),
                                          personal_idcard: MAP_Patient_User.store[0].personal.identity_card.id
                                        },
                                        (err) => { if (err) {  console.error(err); return; } }
                                    );

                                    if (!GET_AutoIncresement_Patient) { await Rollback_CheckPatientDocument(); callback(new Error(`${controllerName}: <findUsernameExists> GET_AutoIncresement_Patient Have Error`)); return; }
                                    else {
                                        const convert_HN = await checkPatient_ZeroFill(parseInt(GET_AutoIncresement_Patient.seq), 6, (err) => { if (err) { console.error(err); return; } } );
                                        if (!convert_HN) { await Rollback_CheckPatientDocument(); callback(`${controllerName}: <findUsernameExists> convert_HN have error `); return; }

                                        MAP_Patient_User.store[0].hn = convert_HN;

                                        let tansactionCreatePatientUpdate;
                                        for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                                            findUsernameExists = await patientModel.findOne(
                                                {
                                                    'username': MAP_Patient_Personal.phone_number
                                                },
                                                {},
                                                async (err) => { if (err) { await Rollback_CheckPatientDocument(); callback(new Error(`${controllerName}: findUsernameExists have Error`)); return; } }
                                            );
                                            findUsernameExists.store.push(MAP_Patient_User.store[0]);
                                            tansactionCreatePatientUpdate = await findUsernameExists.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });

                                            if (tansactionCreatePatientUpdate) { break; }
                                        }

                                        if (!tansactionCreatePatientUpdate) { await Rollback_CheckPatientDocument(); callback(new Error(`${controllerName}: <findUsernameExists> tansactionCreatePatientUpdate failed`)); return; }
                                        else {
                                            await patientPIDModel.findByIdAndUpdate(
                                                transctionPatientPID_Save._id,
                                                {
                                                    $set: {
                                                        '_ref_patient_userid': tansactionCreatePatientUpdate._id,
                                                        '_ref_patient_userstoreid': tansactionCreatePatientUpdate.store.filter(
                                                            where => (String(where._storeid) === data._ref_storeid)
                                                        )[0]._id
                                                    }
                                                },
                                                (err) => { if (err) { console.error(err); return; } }
                                            );
                                            await patientPhoneNumberModel.findByIdAndUpdate(
                                                transctionPatientPhoneNumber_Save._id,
                                                {
                                                    $set: {
                                                        '_ref_patient_userid': tansactionCreatePatientUpdate._id,
                                                        '_ref_patient_userstoreid': tansactionCreatePatientUpdate.store.filter(
                                                            where => (String(where._storeid) === data._ref_storeid)
                                                        )[0]._id
                                                    }
                                                },
                                                (err) => { if (err) { console.error(err); return; } }
                                            );

                                            callback(null);
                                            return tansactionCreatePatientUpdate;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};


module.exports = Register_Patient_Save_FullController;