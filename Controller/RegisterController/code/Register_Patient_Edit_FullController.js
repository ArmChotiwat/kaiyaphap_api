/**
 * Register Patient Controller
 * สำหรับ แก้ไข เบียนผู้ป่วย แบบเต็มรูปแบบ
 */
const Register_Patient_Edit_FullController = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agent_userid: '',
        _ref_patient_userid: '',
        patientPersonalData: {},
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `Register_Patient_Edit_FullController`;

    const { validate_StringObjectId_NotNull, checkAgentId, currentDateTime, regExReplace } = require('../../miscController');
    const { patientPIDModel, patientPhoneNumberModel, ObjectId, patientModel } = require('../../mongodbController');

    const nowDateTime = currentDateTime();
    
    const Retry_Max = 10;

    const checkPatient_Personal_Data_Edit = require('./checkPatient_Personal_Data_Edit');
    const checkPatient_Personal_IdentityCard_Edit = require('./checkPatient_Personal_IdentityCard_Edit');
    const checkPatient_Personal_ContractCard = require('./checkPatient_Personal_ContractCard');
    const checkPatient_Personal_ContractPresent = require('./checkPatient_Personal_ContractPresent');
    const checkPatient_Personal_ContractEmergency = require('./checkPatient_Personal_ContractEmergency');
    const checkPatient_Personal_MedicationPrivilege = require('./checkPatient_Personal_MedicationPrivilege');
    const checkPatient_Personal_GeneralUserDetail = require('./checkPatient_Personal_GeneralUserDetail');
    const checkPatient_Personal_IllnessHistory = require('./checkPatient_Personal_IllnessHistory');
    const checkPatient_Personal_Referral = require('./checkPatient_Personal_Referral');
    const checkPatient_Personal_VipAgent = require('./checkPatient_Personal_VipAgent');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_agent_userid)) { callback(new Error(`${controllerName}: <data._ref_agent_userid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_patient_userid)) { callback(new Error(`${controllerName}: <data._ref_patient_userid> must be String ObjectId`)); return; }
    else if (typeof data.patientPersonalData != 'object') { callback(new Error(`${controllerName}: <data.patientPersonalData> must be Object`)); return; }
    else {
        const chkAgent = await checkAgentId(
            {
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid,
                _agentid: data._ref_agent_userid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgent) { callback(new Error(`${controllerName}: chkAgent return not found`)); return; }
        else if (!chkAgent.role) { callback(new Error(`${controllerName}: chkAgent.role return not found`)); return; }
        else if (chkAgent.role !== 1) { callback(new Error(`${controllerName}: chkAgent.role ${chkAgent.role} not equal 1 <Admin>`)); return; }
        else {
            let DoCheck_checkPatient_Personal_Edit = await checkPatient_Personal_Data_Edit(data.patientPersonalData, data._ref_patient_userid, data._ref_storeid, (err) => { if (err) { callback(err); return; } } );
            let DoCheck_checkPatient_Personal_IdentityCard_Edit = await checkPatient_Personal_IdentityCard_Edit(data.patientPersonalData.identity_card, data._ref_patient_userid, data._ref_storeid, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_ContractCard = await checkPatient_Personal_ContractCard(data.patientPersonalData.contract_card, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_ContractPresent = await checkPatient_Personal_ContractPresent(data.patientPersonalData.contract_present, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_ContractEmergency = await checkPatient_Personal_ContractEmergency(data.patientPersonalData.contract_emergency, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_MedicationPrivilege = await checkPatient_Personal_MedicationPrivilege(data.patientPersonalData.medication_privilege, (err) => { if (err) { callback(err); return; } });
            const DoCheck_checkPatient_Personal_GeneralUserDetail = await checkPatient_Personal_GeneralUserDetail(data.patientPersonalData.general_user_detail, data._ref_storeid, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_IllnessHistory = await checkPatient_Personal_IllnessHistory(data.patientPersonalData.illness_history, data._ref_storeid, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_Referral = await checkPatient_Personal_Referral(data.patientPersonalData.referral, (err) => { if (err) { callback(err); return; } } );
            const DoCheck_checkPatient_Personal_VipAgent = await checkPatient_Personal_VipAgent(data.patientPersonalData.vip_agent, data._ref_storeid, data._ref_branchid, (err) => { if (err) { callback(err); return; } } );

            if (!DoCheck_checkPatient_Personal_Edit) { callback(new Error(`${controllerName}: <data.patientPersonalData> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_IdentityCard_Edit) { callback(new Error(`${controllerName}: <data.patientPersonalData.identity_card> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_ContractCard) { callback(new Error(`${controllerName}: <data.patientPersonalData.contract_card> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_ContractPresent) { callback(new Error(`${controllerName}: <data.patientPersonalData.contract_present> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_ContractEmergency) { callback(new Error(`${controllerName}: <data.patientPersonalData.contract_emergency> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_MedicationPrivilege) { callback(new Error(`${controllerName}: <data.patientPersonalData.medication_privilege> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_GeneralUserDetail) { callback(new Error(`${controllerName}: <data.patientPersonalData.general_user_detail> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_IllnessHistory) { callback(new Error(`${controllerName}: <data.patientPersonalData.illness_history> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_Referral) { callback(new Error(`${controllerName}: <data.patientPersonalData.referral> validated failed`)); return; }
            else if (!DoCheck_checkPatient_Personal_VipAgent) { callback(new Error(`${controllerName}: <data.patientPersonalData.vip_agent> validated failed`)); return; }
            else {
                const findOriginalPatient = await patientModel.aggregate(
                    [
                        {
                            '$match': {
                            '_id': ObjectId(data._ref_patient_userid), 
                            'store._storeid': ObjectId(data._ref_storeid)
                            }
                        }, {
                            '$unwind': {
                            'path': '$store'
                            }
                        }, {
                            '$match': {
                            '_id': ObjectId(data._ref_patient_userid),  
                            'store._storeid': ObjectId(data._ref_storeid)
                            }
                        }
                    ],
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!findOriginalPatient) { callback(new Error(`${controllerName}: findOriginalPatient have error during aggregate`)); return; }
                else if (findOriginalPatient.length <= 0) { callback(new Error(`${controllerName}: findOriginalPatient return not found`)); return; }
                else if (findOriginalPatient.length !== 1) { callback(new Error(`${controllerName}: findOriginalPatient Length (${findOriginalPatient.length}) not equal 1`)); return; }
                else if (!findOriginalPatient[0].store.personal.phone_number) { callback(new Error(`${controllerName}: findOriginalPatient return not found store[0].personal.phone_number`)); return; }
                else if (!findOriginalPatient[0].store.personal.identity_card) { callback(new Error(`${controllerName}: findOriginalPatient return not found store[0].personal.identity_card`)); return; }
                else {
                    let findOriginalPatinetPID;
                    if (findOriginalPatient[0].store.personal.identity_card.id) {
                        findOriginalPatinetPID = await patientPIDModel.findOne(
                            {
                                '_ref_storeid': ObjectId(data._ref_storeid),
                                '_ref_patient_userid': ObjectId(data._ref_patient_userid),
                                '_ref_patient_userstoreid': findOriginalPatient[0].store._id,
                                'identity_card': findOriginalPatient[0].store.personal.identity_card.id,
                            },
                            (err) => { if (err) { callback(err); return; } }
                        );
                    }

                    const findOriginalPatinetPhoneNumber = await patientPhoneNumberModel.findOne(
                        {
                            '_ref_storeid': ObjectId(data._ref_storeid),
                            '_ref_patient_userid': ObjectId(data._ref_patient_userid),
                            '_ref_patient_userstoreid': findOriginalPatient[0].store._id,
                            'phone_number': findOriginalPatient[0].store.personal.phone_number,
                        },
                        (err) => { if (err) { callback(err); return; } }
                    );

                    if (!findOriginalPatinetPID && findOriginalPatient[0].store.personal.identity_card.id) { callback(new Error(`${controllerName}: findOriginalPatinetPID return not found, Due <findOriginalPatient[0].store.personal.identity_card.id> is Not Null`)); return; }
                    else if (!findOriginalPatinetPhoneNumber) { callback(new Error(`${controllerName}: findOriginalPatinetPhoneNumber return not found`)); return; }
                    else {
                        let Unqiue_PatientPhoneNumberId;
                        const Rollback_Unqiue_PatientPhoneNumber = async () => {
                            if (Unqiue_PatientPhoneNumberId) {
                                await patientPhoneNumberModel.findByIdAndDelete(Unqiue_PatientPhoneNumberId, (err) => { if (err) { console.error(err); return; }});
                            }
                        };
                        const Update_Unqiue_PatientPhoneNumber = async () => {
                            if (Unqiue_PatientPhoneNumberId) {
                                await patientPhoneNumberModel.findByIdAndUpdate(
                                    Unqiue_PatientPhoneNumberId,
                                    {
                                        $set: {
                                            '_ref_patient_userid': findOriginalPatient[0]._id,
                                            '_ref_patient_userstoreid': findOriginalPatient[0].store._id
                                        }
                                    },
                                    (err) => { if (err) { console.error(err); return; } }
                                );
                                await patientPhoneNumberModel.findByIdAndDelete(findOriginalPatinetPhoneNumber._id, (err) => { if (err) { console.error(err); return; } });
                            }
                        };
                        let Unqiue_PatientPersonalIdentityId;
                        const Rollback_Unqiue_PatientPersonalIdentity = async () => {
                            if (Unqiue_PatientPersonalIdentityId) {
                                await patientPIDModel.findByIdAndDelete(Unqiue_PatientPersonalIdentityId, (err) => { if (err) { console.error(err); return; }});
                            }
                        };
                        const Update_Unqiue_PatientPersonalIdentity = async () => {
                            if (Unqiue_PatientPersonalIdentityId) {
                                await patientPIDModel.findByIdAndUpdate(
                                    Unqiue_PatientPersonalIdentityId,
                                    {
                                        $set: {
                                            '_ref_patient_userid': findOriginalPatient[0]._id,
                                            '_ref_patient_userstoreid': findOriginalPatient[0].store._id
                                        }
                                    },
                                    (err) => { if (err) { console.error(err); return; } }
                                );
                                if (findOriginalPatinetPID) {
                                    await patientPIDModel.findByIdAndDelete(findOriginalPatinetPID._id, (err) => { if (err) { console.error(err); return; } });
                                }
                            }
                        };

                        // Create Phone Number Unique
                        if (DoCheck_checkPatient_Personal_Edit.isModify === true) {
                            const new_patientPhoneNumber = new patientPhoneNumberModel(
                                {
                                    _ref_storeid: ObjectId(data._ref_storeid), 
                                    phone_number: String(DoCheck_checkPatient_Personal_Edit.personal.phone_number),
                                    _ref_patient_userid: null,
                                    _ref_patient_userstoreid: null,
                                }
                            );

                            const transctionPatientPhoneNumber_Save = await new_patientPhoneNumber.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });

                            if (!transctionPatientPhoneNumber_Save) {
                                await Rollback_Unqiue_PatientPhoneNumber();
                                await Rollback_Unqiue_PatientPersonalIdentity();
                                callback(new Error(`${controllerName}: transctionPatientPhoneNumber_Save have error`));
                                return;
                            }
                            else {
                                Unqiue_PatientPhoneNumberId = transctionPatientPhoneNumber_Save._id;
                            }
                        }                
                        
                        // Create Personal Identity Unique
                        if (DoCheck_checkPatient_Personal_IdentityCard_Edit.isModify === true) {
                            const new_patientPersonalIdentity = new patientPIDModel(
                                {
                                    _ref_storeid: ObjectId(data._ref_storeid), 
                                    identity_card: String(DoCheck_checkPatient_Personal_IdentityCard_Edit.identity_card.id),
                                    _ref_patient_userid: null,
                                    _ref_patient_userstoreid: null,
                                }
                            );

                            const transctionPatientPersonalIdentity_Save = await new_patientPersonalIdentity.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });

                            if (!transctionPatientPersonalIdentity_Save) {
                                await Rollback_Unqiue_PatientPhoneNumber();
                                await Rollback_Unqiue_PatientPersonalIdentity();
                                callback(new Error(`${controllerName}: transctionPatientPersonalIdentity_Save have error`));
                                return;
                            }
                            else {
                                Unqiue_PatientPersonalIdentityId = transctionPatientPersonalIdentity_Save._id;
                            }
                        }

                        const MAP_Patient_Personal = {
                            identity_card: (DoCheck_checkPatient_Personal_IdentityCard_Edit.isModify === true) ? DoCheck_checkPatient_Personal_IdentityCard_Edit.identity_card:findOriginalPatient[0].store.personal.identity_card,
                            pre_name: DoCheck_checkPatient_Personal_Edit.personal.pre_name,
                            special_prename: DoCheck_checkPatient_Personal_Edit.personal.special_prename,
                            first_name: regExReplace.regEx_ClearWhiteSpaceStartEnd(DoCheck_checkPatient_Personal_Edit.personal.first_name),
                            last_name: regExReplace.regEx_ClearWhiteSpaceStartEnd(DoCheck_checkPatient_Personal_Edit.personal.last_name),
                            nick_name: DoCheck_checkPatient_Personal_Edit.personal.nick_name,
                            gender: DoCheck_checkPatient_Personal_Edit.personal.gender,
                            birth_date: DoCheck_checkPatient_Personal_Edit.personal.birth_date,
                            height: DoCheck_checkPatient_Personal_Edit.personal.height,
                            weight: DoCheck_checkPatient_Personal_Edit.personal.weight,
                            nationality: DoCheck_checkPatient_Personal_Edit.personal.nationality,
                            race: DoCheck_checkPatient_Personal_Edit.personal.race,
                            religion: DoCheck_checkPatient_Personal_Edit.personal.religion,
                            blood_type: DoCheck_checkPatient_Personal_Edit.personal.blood_type,
                            telephone_number: DoCheck_checkPatient_Personal_Edit.personal.telephone_number,
                            phone_number: (DoCheck_checkPatient_Personal_Edit.isModify === true) ? DoCheck_checkPatient_Personal_Edit.personal.phone_number:findOriginalPatient[0].store.personal.phone_number,
                            email: DoCheck_checkPatient_Personal_Edit.personal.email,
                            status: DoCheck_checkPatient_Personal_Edit.personal.status,
                            occupation: DoCheck_checkPatient_Personal_Edit.personal.occupation,
                            contract_card: DoCheck_checkPatient_Personal_ContractCard,
                            contract_present: DoCheck_checkPatient_Personal_ContractPresent,
                            contract_emergency: DoCheck_checkPatient_Personal_ContractEmergency,
                            medication_privilege: DoCheck_checkPatient_Personal_MedicationPrivilege,
                            general_user_detail: DoCheck_checkPatient_Personal_GeneralUserDetail,
                            illness_history: DoCheck_checkPatient_Personal_IllnessHistory,
                            referral: DoCheck_checkPatient_Personal_Referral,
                            vip_agent: DoCheck_checkPatient_Personal_VipAgent,
                        };

                        const updatePersonalData = await patientModel.updateOne(
                            {
                                '_id': ObjectId(findOriginalPatient[0]._id),
                                'store._id': ObjectId(findOriginalPatient[0].store._id)
                            },
                            {
                                '$set': {
                                    'store.$.personal': MAP_Patient_Personal
                                }
                            },
                            async (err) => {
                                if (err) {
                                    await Rollback_Unqiue_PatientPhoneNumber();
                                    await Rollback_Unqiue_PatientPersonalIdentity();
                                    callback(err);
                                    return;
                                }
                            }
                        );


                        if (!updatePersonalData) {
                            await Rollback_Unqiue_PatientPhoneNumber();
                            await Rollback_Unqiue_PatientPersonalIdentity();
                            callback(new Error(`${controllerName} updatePersonalData Have Error`));
                            return;
                        }
                        else {
                            
                            await Update_Unqiue_PatientPhoneNumber();
                            await Update_Unqiue_PatientPersonalIdentity();

                            const RE_Get_Patient = await patientModel.aggregate(
                                [
                                    {
                                        '$match': {
                                            '_id': ObjectId(data._ref_patient_userid), 
                                            'store._storeid': ObjectId(data._ref_storeid)
                                        }
                                    }, {
                                        '$unwind': {
                                            'path': '$store'
                                        }
                                    }, {
                                        '$match': {
                                            '_id': ObjectId(data._ref_patient_userid),  
                                            'store._storeid': ObjectId(data._ref_storeid)
                                        }
                                    }
                                ],
                                (err) => { if (err) { console.error(err); return; } }
                            );
        
                            callback(null);
                            return RE_Get_Patient;
                        }
                    }
                }
            }
        }
    }
};


module.exports = Register_Patient_Edit_FullController;