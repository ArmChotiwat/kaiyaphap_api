const RegisterImd_Agent_Save_FullController = async (
    data = {
        _ref_imd_agentid: '', // Jwt Imd Agent
        agentData: {
            email: '',
            password: '', // m_agents.password
            agentStoreData: { // m_agents.store[]
                _storeid: '',
                _branchid: '',
                personal: {},
            }
        },
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'Register_Imd_Agent_Save_FullController';

    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty } = require('../../miscController');
    const { ObjectId, agentEmailModel, agentModel } = require('../../mongodbController');

    const checkImd_Agent_Personal_Data = require('./checkImd_Agent_Personal_Data');
    const checkImd_Agent_Personal_IdentityCard = require('./checkImd_Agent_Personal_IdentityCard');
    const checkImdAgent_Personal_Address = require('./checkImdAgent_Personal_Address');
    const checkImd_Agent_Store_Data = require('./checkImd_Agent_Store_Data');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_imd_agentid)) { callback(new Error(`${controllerName}: <data._ref_imd_agentid> must be String ObjectId`)); return; }
    else if (typeof data.agentData != 'object') { callback(new Error(`${controllerName}: <data.agentData> must be Object`)); return; }
    else if (!validate_String_AndNotEmpty(data.agentData.password)) { callback(new Error(`${controllerName}: <data.agentData.password> must be String and Not Empty`)); return; }
    else if (typeof data.agentData.agentStoreData != 'object') { callback(new Error(`${controllerName}: <data.agentData.agentStoreData> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data.agentData.agentStoreData._storeid)) { callback(new Error(`${controllerName}: <data.agentData.agentStoreData._storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data.agentData.agentStoreData._branchid)) { callback(new Error(`${controllerName}: <data.agentData.agentStoreData._branchid> must be String ObjectId`)); return; }
    else if (typeof data.agentData.agentStoreData.personal != 'object') { callback(new Error(`${controllerName}: <data.agentData.agentStoreData.personal> must be Object`)); return; }
    else {
        const chkImdAgent = await agentModel.findOne(
            {
                '_id': ObjectId(data._ref_imd_agentid),
                'username': 'kaiyaphap@imd.co.th',
                'store._storeid': ObjectId('5ea003d688b7265b04296e2c'),
                'store.branch._branchid': ObjectId('5ea003d688b7265b04296e2c'),
                'store.role': 1,
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkImdAgent) { callback(new Error(`${controllerName}: chkImdAgent return not found`)); return; }
        else {
            const GET_checkImd_Agent_Store_Data = await checkImd_Agent_Store_Data(
                {
                    _ref_storeid: data.agentData.agentStoreData._storeid,
                    _ref_branchid: data.agentData.agentStoreData._branchid,
                    email: data.agentData.email,
                },
                (err) => { if (err) { callback(err); return; } }
            );

            const GET_checkImd_Agent_Personal_Data = await checkImd_Agent_Personal_Data(
                data.agentData.agentStoreData.personal,
                (err) => { if (err) { callback(err); return; } }
            );

            const GET_checkImd_Agent_Personal_IdentityCard = await checkImd_Agent_Personal_IdentityCard(
                data.agentData.agentStoreData.personal.identity_card,
                (err) => { if (err) { callback(err); return; } }
            );

            const GET_checkImdAgent_Personal_Address = await checkImdAgent_Personal_Address(
                data.agentData.agentStoreData.personal.address,
                (err) => { if (err) { callback(err); return; } }
            );

            if (!GET_checkImd_Agent_Store_Data) { callback(new Error(`${controllerName}: GET_checkImd_Agent_Store_Data have error`)); return; }
            else if (!GET_checkImd_Agent_Personal_Data) { callback(new Error(`${controllerName}: GET_checkImd_Agent_Personal_Data have error`)); return; }
            else if (!GET_checkImd_Agent_Personal_IdentityCard) { callback(new Error(`${controllerName}: GET_checkImd_Agent_Personal_IdentityCard have error`)); return; }
            else if (!GET_checkImdAgent_Personal_Address) { callback(new Error(`${controllerName}: GET_checkImdAgent_Personal_Address have error`)); return; }
            else {
                const MAP_Aagent_DATA = {
                    username: GET_checkImd_Agent_Store_Data.email,
                    password: data.agentData.password,
                    isclosed: false,
                    store: [
                        {
                            _storeid: GET_checkImd_Agent_Store_Data._storeid,
                            branch: GET_checkImd_Agent_Store_Data.branch,
                            role: GET_checkImd_Agent_Store_Data.role,
                            userRegisterDate: GET_checkImd_Agent_Store_Data.userRegisterDate,
                            avatarUrl: GET_checkImd_Agent_Store_Data.avatarUrl,
                            email: GET_checkImd_Agent_Store_Data.email,
                            user_status: GET_checkImd_Agent_Store_Data.user_status,
                            personal: {
                                pre_name: GET_checkImd_Agent_Personal_Data.pre_name,
                                special_prename: GET_checkImd_Agent_Personal_Data.special_prename,
                                first_name: GET_checkImd_Agent_Personal_Data.first_name,
                                last_name: GET_checkImd_Agent_Personal_Data.last_name,
                                gender: GET_checkImd_Agent_Personal_Data.gender,
                                birth_date: GET_checkImd_Agent_Personal_Data.birth_date,
                                telephone_number: GET_checkImd_Agent_Personal_Data.telephone_number,
                                phone_number: GET_checkImd_Agent_Personal_Data.phone_number,
                                identity_card: GET_checkImd_Agent_Personal_IdentityCard,
                                address: GET_checkImdAgent_Personal_Address,
                            }
                        }
                    ]
                };

                const findAgent = await agentModel.find(
                    {
                        username: MAP_Aagent_DATA.store[0].email,
                    },
                    (err) => { if (err) { callback(err); return; } }
                );

                const findAgent_Email = await agentEmailModel.findOne(
                    {
                        email: MAP_Aagent_DATA.store[0].email,
                    },
                    {},
                    (err) => { if (err) { callback(err); return; } }
                );

                const create_AgentEmail = async (cb = (errs = new Error ) => {}) => {
                    const agentEmailModel_Document = new agentEmailModel(
                        {
                            _ref_storeid: ObjectId(data.agentData.agentStoreData._storeid),
                            _ref_branchid: ObjectId(data.agentData.agentStoreData._branchid),
                            email: MAP_Aagent_DATA.username,
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
                        const agentModel_Document = new agentModel(MAP_Aagent_DATA);

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
                else {
                    callback(new Error(`${controllerName}: findAgent.length (${findAgent.length}) out of condition scpoe`));
                    return;
                }
            }
        }
    }
};



module.exports = RegisterImd_Agent_Save_FullController;