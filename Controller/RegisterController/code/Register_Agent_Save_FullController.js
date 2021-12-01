const Register_Agent_Save_FullController = async (
    data = {
        _ref_storeid: '', // Jwt Agent
        _ref_branchid: '', // Jwt Agent
        _ref_agentid: '', // Jwt Agent
        agentData: {
            email: '',
            password: '', // m_agents.password
            agentStoreData: { // m_agents.store[]
                _storeid: '',
                personal: {},
            }
        },
    },
    callback = (err = new Error) => { }
) => {
    const controllerName = 'Register_Agent_Save_FullController';


    const { validate_StringObjectId_NotNull, checkAgentId, validate_String_AndNotEmpty, currentDateTime } = require('../../miscController');
    const { ObjectId, agentEmailModel, agentModel } = require('../../mongodbController');

    const checkAgent_Store_Data = require('./checkAgent_Store_Data');
    const checkAgent_Personal_Data = require('./checkAgent_Personal_Data');
    const checkAgent_Personal_IdentityCard = require('./checkAgent_Personal_IdentityCard');
    const checkAgent_Personal_Address = require('./checkAgent_Personal_Address');
    const checkAgent_Personal_EducatedHistory = require('./checkAgent_Personal_EducatedHistory');
    const checkAgent_Personal_Certificate = require('./checkAgent_Personal_Certificate');
    const checkAgent_Personal_WorkExpriance = require('./checkAgent_Personal_WorkExpriance');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
    else if (typeof data.agentData != 'object') { callback(new Error(`${controllerName}: <data.agentData> must be Object`)); return; }
    else if (!validate_String_AndNotEmpty(data.agentData.password)) { callback(new Error(`${controllerName}: <data.agentData.password> must be String and Not Empty`)); return; }
    else if (typeof data.agentData.agentStoreData != 'object') { callback(new Error(`${controllerName}: <data.agentData.agentStoreData> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data.agentData.agentStoreData._storeid)) { callback(new Error(`${controllerName}: <data.agentData.agentStoreData._storeid> must be String ObjectId`)); return; }
    else if (data._ref_storeid !== data.agentData.agentStoreData._storeid) { callback(new Error(`${controllerName}: <data._ref_storeid> (${data._ref_storeid}) must equal <data.agentData.agentStoreData._storeid> (${data.agentData.agentStoreData._storeid})`)); return; }
    else if (typeof data.agentData.agentStoreData.personal != 'object') { callback(new Error(`${controllerName}: <data.agentData.agentStoreData.personal> must be Object`)); return; }
    else {
        const chkAgent = await checkAgentId(
            {
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid,
                _agentid: data._ref_agentid,
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgent) { callback(new Error(`${controllerName}: chkAgent return not found`)); return; }
        else if (chkAgent.role !== 1) { callback(new Error(`${controllerName}: chkAgent.role (${chkAgent.role}) not equal 1`)); return; }
        else {
            const GET_Agent_StoreData = await checkAgent_Store_Data(
                {
                    _storeid: data._ref_storeid,
                    branch: [
                        {
                            _branchid: data._ref_branchid,
                        }
                    ],
                    email: data.agentData.email,
                },
                (err) => { if (err) { callback(err); return; } }
            );

            const GET_Agent_PersonalData = await checkAgent_Personal_Data(
                data.agentData.agentStoreData.personal,
                data._ref_storeid,
                (err) => { if (err) { callback(err); return; } }
            );

            const GET_Agent_IdentityCard = await checkAgent_Personal_IdentityCard(
                data.agentData.agentStoreData.personal.identity_card,
                (err) => { if (err) { callback(err); return; } }
            );

            const GET_Agent_Address = await checkAgent_Personal_Address(
                data.agentData.agentStoreData.personal.address,
                (err) => { if (err) { callback(err); return; } }
            );

            const GET_Agent_EducatedHistory = await checkAgent_Personal_EducatedHistory(
                data.agentData.agentStoreData.personal.educated_histroy,
                (err) => { if (err) { callback(err); return; } }
            );

            const GET_Agent_Certificate = await checkAgent_Personal_Certificate(
                data.agentData.agentStoreData.personal.certificate,
                (err) => { if (err) { callback(err); return; } }
            );

            const GET_Agent_WorkExpriance = await checkAgent_Personal_WorkExpriance(
                data.agentData.agentStoreData.personal.work_expriance,
                (err) => { if (err) { callback(err); return; } }
            );

            if (!GET_Agent_StoreData) { callback(new Error(`${controllerName}: GET_Agent_StoreData validate failed`)); return; }
            else if (!GET_Agent_PersonalData) { callback(new Error(`${controllerName}: GET_Agent_PersonalData validate failed`)); return; }
            else if (!GET_Agent_IdentityCard) { callback(new Error(`${controllerName}: GET_Agent_IdentityCard validate failed`)); return; }
            else if (!GET_Agent_Address) { callback(new Error(`${controllerName}: GET_Agent_Address validate failed`)); return; }
            else if (!GET_Agent_EducatedHistory) { callback(new Error(`${controllerName}: GET_Agent_EducatedHistory validate failed`)); return; }
            else if (!GET_Agent_Certificate) { callback(new Error(`${controllerName}: GET_Agent_Certificate validate failed`)); return; }
            else if (!GET_Agent_WorkExpriance) { callback(new Error(`${controllerName}: GET_Agent_WorkExpriance validate failed`)); return; }
            else {
                const MAP_New_Agent_User = {
                    username: GET_Agent_StoreData.email,
                    password: data.agentData.password,
                    isclosed: false,
                    store: [
                        {
                            _storeid: GET_Agent_StoreData._storeid,
                            branch: GET_Agent_StoreData.branch,
                            role: GET_Agent_StoreData.role,
                            userRegisterDate: GET_Agent_StoreData.userRegisterDate,
                            avatarUrl: GET_Agent_StoreData.avatarUrl,
                            email: GET_Agent_StoreData.email,
                            user_status: GET_Agent_StoreData.user_status,

                            personal: {
                                pre_name: GET_Agent_PersonalData.pre_name,
                                special_prename: GET_Agent_PersonalData.special_prename,
                                first_name: GET_Agent_PersonalData.first_name,
                                last_name: GET_Agent_PersonalData.last_name,
                                gender: GET_Agent_PersonalData.gender,
                                birth_date: GET_Agent_PersonalData.birth_date,
                                telephone_number: GET_Agent_PersonalData.telephone_number,
                                phone_number: GET_Agent_PersonalData.phone_number,
                                identity_card: GET_Agent_IdentityCard,
                                address: GET_Agent_Address,
                                educated_histroy: GET_Agent_EducatedHistory,
                                certificate: GET_Agent_Certificate,
                                work_expriance: GET_Agent_WorkExpriance,
                                pflevel: GET_Agent_PersonalData.pflevel,
                                skill: GET_Agent_PersonalData.skill,
                            }
                        }
                    ]
                };

                const findAgent = await agentModel.find(
                    {
                        username: MAP_New_Agent_User.store[0].email,
                    },
                    (err) => { if (err) { callback(err); return; } }
                );

                const findAgent_Email = await agentEmailModel.findOne(
                    {
                        _ref_storeid: ObjectId(data._ref_storeid),
                        _ref_branchid: ObjectId(data._ref_branchid),
                        email: MAP_New_Agent_User.store[0].email,
                    },
                    {},
                    (err) => { if (err) { callback(err); return; } }
                );

                const create_AgentEmail = async (cb = (errs = new Error ) => {}) => {
                    const agentEmailModel_Document = new agentEmailModel(
                        {
                            _ref_storeid: ObjectId(data._ref_storeid),
                            _ref_branchid: ObjectId(data._ref_branchid),
                            email: MAP_New_Agent_User.username,
                        }
                    );

                    const transactionSave = await agentEmailModel_Document.save().then(result => result).catch(err => { if (err) { cb(err); return;} } )

                    if (!transactionSave) { cb(new Error(`${controllerName}: create_AgentEmail => transactionSave have error`)); return; }
                    else {
                        cb(null);
                        return transactionSave;
                    }
                };

                const rollBack_AgentEmail = async (_ref_agentemailid = ObjectId(), cb = (errs = new Error) => {}) => {
                    await agentEmailModel.findByIdAndDelete(_ref_agentemailid, (err) => { if (err) { cb(err); } });

                    callback(null);
                    return;
                }

                if (findAgent.length === 0 && !findAgent_Email) { // หา User แล้วไม่มี
                    const Error_From = 'From findAgent return NOT_FOUND and findAgent_Email return NOT_FOUND';

                    const Do_Create_Agent_Email = await create_AgentEmail((err) => { if (err) { callback(err); return; } });

                    if (!Do_Create_Agent_Email) { callback(new Error(`${controllerName}: Do_Create_Agent_Email have error, ${Error_From}`)); return; }
                    else {
                        const agentModel_Document = new agentModel(MAP_New_Agent_User);

                        const transactionSave = await agentModel_Document.save().then(result => result).catch(err => { if (err) { console.error(err); return;} });

                        if (!transactionSave) {
                            await rollBack_AgentEmail(Do_Create_Agent_Email._id, (err) => { if (err) { console.error(err); } });
                            callback(new Error(`${controllerName}: create agent have error, ${Error_From}`));
                            return;
                        }
                        else {
                            callback(null);
                            return transactionSave;
                        }
                    }
                }
                else if (findAgent.length === 1) { // หา User มี และอยู่ใน Store
                    let Error_From = 'From findAgent return FOUND';

                    const findAgentStore = await agentModel.findOne(
                        {
                            '_id': findAgent[0]._id,
                            'store._storeid': ObjectId(data._ref_storeid),
                        },
                        (err) => { if (err) callback(err); return; }
                    );

                    const findAgentStoreBranch = await agentModel.findOne(
                        {
                            '_id': findAgent[0]._id,
                            'store.branch._branchid': ObjectId(data._ref_branchid),
                        },
                        (err) => { if (err) callback(err); return; }
                    );

                    if (!findAgentStore && !findAgentStoreBranch && !findAgent_Email) { 
                        Error_From += ' and findAgentStore return NOT_FOUND, findAgentStoreBranch return NOT_FOUND, findAgent_Email return NOT_FOUND';

                        const Do_Create_Agent_Email = await create_AgentEmail((err) => { if (err) { callback(err); return; } });

                        if (!Do_Create_Agent_Email) { callback(new Error(`${controllerName}: Do_Create_Agent_Email have error, ${Error_From}`)); return; }
                        else {
                            
                            const newDocument_AgentModel = new agentModel(MAP_New_Agent_User);
                            const transactionUpdate = await agentModel.findByIdAndUpdate(
                                findAgent[0]._id,
                                {
                                    $push: { "store": newDocument_AgentModel.store[0] }
                                }
                            ).then(result => result).catch(err => { if (err) { console.error(err); } });

                            if (!transactionUpdate) {
                                await rollBack_AgentEmail(Do_Create_Agent_Email._id, (err) => { if (err) { console.error(err); } });
                                callback(new Error(`${controllerName}: create agent have error, ${Error_From}`));
                                return;
                            }
                            else {
                                callback(null);
                                return transactionUpdate;
                            }
                        }
                    }
                    else if (findAgentStore && !findAgentStoreBranch && !findAgent_Email) { 
                        Error_From += ' and findAgentStore return FOUND, findAgentStoreBranch return NOT_FOUND, findAgent_Email return NOT_FOUND';

                        const Do_Create_Agent_Email = await create_AgentEmail((err) => { if (err) { callback(err); return; } });

                        if (!Do_Create_Agent_Email) { callback(new Error(`${controllerName}: Do_Create_Agent_Email have error, ${Error_From}`)); return; }
                        else {
                            
                            const newDocument_AgentModel = new agentModel(MAP_New_Agent_User);
                            const transactionUpdate = await agentModel.findOneAndUpdate(
                                {
                                    '_id': findAgent[0]._id,
                                    'store._storeid': ObjectId(data._ref_storeid),
                                },
                                {
                                    $push: { "store.$.branch": newDocument_AgentModel.store[0].branch[0] }
                                }
                            ).then(result => result).catch(err => { if (err) { console.error(err); } });

                            if (!transactionUpdate) {
                                await rollBack_AgentEmail(Do_Create_Agent_Email._id, (err) => { if (err) { console.error(err); } });
                                callback(new Error(`${controllerName}: create agent have error, ${Error_From}`));
                                return;
                            }
                            else {
                                callback(null);
                                return transactionUpdate;
                            }
                        }
                    }
                    else {
                        callback(new Error(`${controllerName}: findAgent_Email return found, ${Error_From}`));
                        return;
                    }
                }
                else {
                    callback(new Error(`${controllerName}: findAgent.length (${findAgent.length}) out of condition scpoe`));
                    return;
                }
            }
        }
    }
};



module.exports = Register_Agent_Save_FullController;