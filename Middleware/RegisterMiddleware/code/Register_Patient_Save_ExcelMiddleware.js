const Register_Patient_Save_ExcelMiddleware = async (req, res, next) => {
    const { validate_String_AndNotEmpty, validate_StringOrNull_AndNotEmpty, validate_StringObjectId_NotNull, validateStrict_Number_OrNull, validateWeightHeight_OrNull, validateVillageNumber_OrNull, checkStoreBranch } = require('../../../Controller/miscController');
    const { ObjectId, patientPIDModel, patientPhoneNumberModel, illnessCharacticModel, illnessModel } = require('../../../Controller/mongodbController');

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    const Retry_Max = 10;

    const payload = req.body;

    try {
        if (typeof payload.store != 'object' || payload.store.length !== 1) { ErrorJson.description.push(`Param <store> must be Array Object and Length equal 1`); }
        else {
            const MSG_ROOT_JSON = `store[0]`
            const Payload_Store = payload.store[0];

            if (!validate_StringObjectId_NotNull(Payload_Store._storeid)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}._storeid> must be String ObjectId`); }
            if (!validate_StringObjectId_NotNull(Payload_Store.register_from_branch)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.register_from_branch> must be String ObjectId and Not Empty`); }
            if (validate_StringObjectId_NotNull(Payload_Store._storeid) && validate_StringObjectId_NotNull(Payload_Store.register_from_branch)) {
                const chkStoreBranch = await checkStoreBranch(
                    {
                        _storeid: Payload_Store._storeid,
                        _branchid: Payload_Store.register_from_branch
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkStoreBranch) { ErrorJson.description.push(`validate _ref_storeid: (${Payload_Store._storeid}), _ref_branchid: (${Payload_Store.register_from_branch}) failed`); }
            }
            if (!validate_StringOrNull_AndNotEmpty(Payload_Store.hn_ref)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.hn_ref> must be String or Null and Not Empty`); }
            if (typeof Payload_Store.personal != 'object') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal> must be Object`); }
            else {
                if (typeof Payload_Store.personal.identity_card != 'object') { ErrorJson.description.push(`Param <${MSG_ROOT_Personal_JSON}.personal.identity_card> must be Object`); }
                else {
                    if (typeof Payload_Store.personal.identity_card.ctype != 'boolean') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.identity_card.ctype> must be Boolean`); }
                    if (!validate_String_AndNotEmpty(Payload_Store.personal.identity_card.id)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.identity_card.id> must be String and Not Empty`); }
                    else {
                        if (validate_StringObjectId_NotNull(Payload_Store._storeid)) {
                            for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                                const checkPatientPIDExist = await patientPIDModel.findOne(
                                    {
                                        '_ref_storeid': ObjectId(Payload_Store._storeid),
                                        'identity_card': Payload_Store.personal.identity_card.id
                                    },
                                    {},
                                    (err) => { if (err) { throw err; } }
                                );
    
                                if (checkPatientPIDExist) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.identity_card.id> is exisis in this store`); break; }
                            }
                        }
                    }
                }
                if (!validate_String_AndNotEmpty(Payload_Store.personal.pre_name)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.pre_name> must be String and Not Empty`); }
                if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.special_prename)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.special_prename> must be String or Null and Not Empty`); }
                if (validate_StringOrNull_AndNotEmpty(Payload_Store.personal.pre_name) && Payload_Store.personal.pre_name == 'อื่นๆ' && Payload_Store.personal.special_prename === null) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.special_prename> must be Null, Due selected <${MSG_ROOT_JSON}.personal.pre_name> is other`); }
                if (validate_StringOrNull_AndNotEmpty(Payload_Store.personal.pre_name) && Payload_Store.personal.pre_name != 'อื่นๆ' && Payload_Store.personal.special_prename !== null) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.special_prename> must be String, Due selected <${MSG_ROOT_JSON}.personal.pre_name> is not other`); }
                if (!validate_String_AndNotEmpty(Payload_Store.personal.first_name)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.first_name> must be String and Not Empty`); }
                if (!validate_String_AndNotEmpty(Payload_Store.personal.last_name)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.last_name> must be String and Not Empty`); }
                if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.nick_name)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.nick_name> must be String or Null and Not Empty`); }
                if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.gender)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.gender> must be String or Null and Not Empty`); }
                if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.birth_date)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.birth_date> must be String or Null and Not Empty`); }
                if (!validateWeightHeight_OrNull(Payload_Store.personal.height)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.height> must be Number morethan 0 or Null`); }
                if (!validateWeightHeight_OrNull(Payload_Store.personal.weight)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.weight> must be Number morethan 0 or Null`); }
                if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.nationality)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.nationality> must be String or Null and Not Empty`); }
                if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.race)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.race> must be String or Null and Not Empty`); }
                if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.religion)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.religion> must be String or Null and Not Empty`); }
                if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.blood_type)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.blood_type> must be String or Null and Not Empty`); }
                if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.telephone_number)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.telephone_number> must be String or Null and Not Empty`); }
                if (!validate_String_AndNotEmpty(Payload_Store.personal.phone_number)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.phone_number> must be String and Not Empty`); }
                else {
                    if (validate_StringObjectId_NotNull(Payload_Store._storeid)) {
                        for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                            const checkPatientPhoneNumberExist = await patientPhoneNumberModel.findOne(
                                {
                                    '_ref_storeid': ObjectId(Payload_Store._storeid),
                                    'phone_number': Payload_Store.personal.phone_number
                                },
                                {},
                                (err) => { if (err) { throw err; } }
                            );
    
                            if (checkPatientPhoneNumberExist) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.phone_number> is exisis in this store`); break; }
                        }
                    }
                }
                if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.email)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.email> must be String or Null and Not Empty`); }
                if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.status)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.status> must be String or Null and Not Empty`); }
                if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.occupation)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.occupation> must be String or Null and Not Empty`); }

                if (typeof Payload_Store.personal.contract_card != 'object') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_card> must be Object`); }
                else {
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_card.address_number)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_card.address_number> must be String or Null and Not Empty`); }
                    if (!validateVillageNumber_OrNull(Payload_Store.personal.contract_card.village_number)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_card.village_number> must be Number or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_card.village)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_card.village> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_card.building)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_card.building> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_card.alley)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_card.alley> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_card.road)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_card.road> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_card.province)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_card.province> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_card.district)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_card.district> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_card.sub_district)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_card.sub_district> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_card.postcode)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_card.postcode> must be String or Null and Not Empty`); }
                }

                if (typeof Payload_Store.personal.contract_present != 'object') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_present> must be Object`); }
                else {
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_present.address_number)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_present.address_number> must be String or Null and Not Empty`); }
                    if (!validateVillageNumber_OrNull(Payload_Store.personal.contract_present.village_number)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_present.village_number> must be Number Integer or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_present.village)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_present.village> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_present.building)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_present.building> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_present.alley)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_present.alley> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_present.road)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_present.road> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_present.province)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_present.province> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_present.district)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_present.district> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_present.sub_district)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_present.sub_district> must be String or Null and Not Empty`); }
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_present.postcode)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_present.postcode> must be String or Null and Not Empty`); }
                }

                if (typeof Payload_Store.personal.contract_emergency != 'object') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency> must be Object`); }
                else {
                    if (typeof Payload_Store.personal.contract_emergency.isenabled != 'boolean') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> must be Boolean`); }
                    if (typeof Payload_Store.personal.contract_emergency.data != 'object') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data> must be Object`); }
                    if (Payload_Store.personal.contract_emergency.isenabled === !true) { // !payload.store[0].personal.contract_emergency.isenabled Fontend ของเจมส์
                        if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_emergency.data.address_number)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.address_number> must be String or Null and Not Empty, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is FALSE`); }
                        if (!validateVillageNumber_OrNull(Payload_Store.personal.contract_emergency.data.village_number)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.village_number> must be Number Integer or Null and Not Empty, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is FALSE`); }
                        if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_emergency.data.village)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.village> must be String or Null and Not Empty, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is FALSE`); }
                        if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_emergency.data.building)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.building> must be String or Null and Not Empty, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is FALSE`); }
                        if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_emergency.data.alley)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.alley> must be String or Null and Not Empty, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is FALSE`); }
                        if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_emergency.data.road)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.road> must be String or Null and Not Empty, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is FALSE`); }
                        if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_emergency.data.province)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.province> must be String or Null and Not Empty, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is FALSE`); }
                        if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_emergency.data.district)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.district> must be String or Null and Not Empty, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is FALSE`); }
                        if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_emergency.data.sub_district)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.sub_district> must be String or Null and Not Empty, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is FALSE`); }
                        if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.contract_emergency.data.postcode)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.postcode> must be String or Null and Not Empty, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is FALSE`); }
                    }
                    if (Payload_Store.personal.contract_emergency.isenabled === !false) { // !payload.store[0].personal.contract_emergency.isenabled Fontend ของเจมส์
                        if (Payload_Store.personal.contract_emergency.data.address_number !== null) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.address_number> must be Null, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is TRUE`); }
                        if (Payload_Store.personal.contract_emergency.data.village_number !== null) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.village_number> must be Null, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is TRUE`); }
                        if (Payload_Store.personal.contract_emergency.data.village !== null) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.village> must be Null, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is TRUE`); }
                        if (Payload_Store.personal.contract_emergency.data.building !== null) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.building> must be Null, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is TRUE`); }
                        if (Payload_Store.personal.contract_emergency.data.alley !== null) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.alley> must be Null, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is TRUE`); }
                        if (Payload_Store.personal.contract_emergency.data.road !== null) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.road> must be Null, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is TRUE`); }
                        if (Payload_Store.personal.contract_emergency.data.province !== null) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.province> must be Null, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is TRUE`); }
                        if (Payload_Store.personal.contract_emergency.data.district !== null) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.district> must be Null, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is TRUE`); }
                        if (Payload_Store.personal.contract_emergency.data.sub_district !== null) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.sub_district> must be Null, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is TRUE`); }
                        if (Payload_Store.personal.contract_emergency.data.postcode !== null) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.contract_emergency.data.postcode> must be Null, Due <${MSG_ROOT_JSON}.personal.contract_emergency.isenabled> is TRUE`); }
                    }
                    
                }

                if (typeof Payload_Store.personal.medication_privilege != 'object') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.medication_privilege> must be Object`); }
                else {
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.medication_privilege.privilege_name)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.medication_privilege.privilege_name> must be String or Null and Not Empty`); }
                }

                if (typeof Payload_Store.personal.general_user_detail != 'object') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.general_user_detail> must be Object`); }
                else {
                    if (typeof Payload_Store.personal.general_user_detail.cigarette_acttivity != 'object') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.general_user_detail.cigarette_acttivity> must be Object`); }
                    else {
                        if (typeof Payload_Store.personal.general_user_detail.cigarette_acttivity.answer != 'boolean') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.general_user_detail.cigarette_acttivity.answer> must be Boolean`); }
                        if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.general_user_detail.cigarette_acttivity.detail)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.general_user_detail.cigarette_acttivity.detail> must be String or Null and Not Empty`); }
                    }

                    if (typeof Payload_Store.personal.general_user_detail.alcohol_acttivity != 'object') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.general_user_detail.alcohol_acttivity> must be Object`); }
                    else {
                        if (typeof Payload_Store.personal.general_user_detail.alcohol_acttivity.answer != 'boolean') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.general_user_detail.alcohol_acttivity.answer> must be Boolean`); }
                        if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.general_user_detail.alcohol_acttivity.detail)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.general_user_detail.alcohol_acttivity.detail> must be String or Null and Not Empty`); }
                    }

                    if (typeof Payload_Store.personal.general_user_detail.congenital_disease != 'object' || Payload_Store.personal.general_user_detail.congenital_disease.length < 0) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.general_user_detail.congenital_disease> must be Array Object and Length Of Array morethan or equal 0`); }
                    else {
                        for (let index = 0; index < Payload_Store.personal.general_user_detail.congenital_disease.length; index++) {
                            const element = Payload_Store.personal.general_user_detail.congenital_disease[index];
                            if (!validate_StringObjectId_NotNull(element._illnesscharid)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.general_user_detail.congenital_disease[${index}]._illnesscharid> must be String ObjectId`); }
                            else {
                                if (validate_StringObjectId_NotNull(Payload_Store._storeid)) {
                                    const findCongenitalDisease = await illnessCharacticModel.findOne(
                                        {
                                            '_id': ObjectId(element._illnesscharid),
                                            '_storeid': ObjectId(Payload_Store._storeid)
                                        },
                                        {},
                                        (err) => { if (err) { console.error(err); return; } }
                                    );
        
                                    if (!findCongenitalDisease) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.general_user_detail.congenital_disease[${index}]._illnesscharid> findCongenitalDisease return not found FROM _illnesscharid (${element._illnesscharid}) AT _storeid (${Payload_Store._storeid})`); }
                                }
                            }
                        }
                    }

                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.general_user_detail.drug_allergy)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.general_user_detail.drug_allergy> must be String or Null and Not Empty`); }
                }

                if (typeof Payload_Store.personal.illness_history != 'object' || Payload_Store.personal.illness_history.length < 0) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.illness_history> must be Array Object and Length must morethan or equal 0`); }
                else {
                    for (let index = 0; index < Payload_Store.personal.illness_history.length; index++) {
                        const element = Payload_Store.personal.illness_history[index];
                        
                        if (!validate_StringObjectId_NotNull(element.id)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.illness_history[${index}].id> must be String ObjectId`); }
                        else {
                            if (validate_StringObjectId_NotNull(Payload_Store._storeid)) {
                                const findIllnessHistory = illnessModel.findOne(
                                    {
                                        '_id': ObjectId(element.id),
                                        '_storeid': ObjectId(Payload_Store._storeid)
                                    },
                                    {},
                                    (err) => { if (err) { console.error(err); return; } }
                                );
                                
                                if (!findIllnessHistory) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.general_user_detail.illness_history[${index}].id> findIllnessHistory return not found FROM id (${element.id}) AT _storeid (${Payload_Store._storeid})`); }
                            }
                        }

                        if (!validateStrict_Number_OrNull(element.answer) && element.answer !== 1 && element.answer !== 2 && element.answer !== 3) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.illness_history[${index}].answer> must be Number (1,2,3)`); }
                        if (!validate_StringOrNull_AndNotEmpty(element.detail)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.illness_history[${index}].answer> must be String or Null and Not Empty`); }
                    }
                }

                if (typeof Payload_Store.personal.referral != 'object') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.referral> must be Object`); }
                else {
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.referral.referral_name)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.referral.referral_name> must be String or Null and Not Empty`); }
                }

                if (typeof Payload_Store.personal.vip_agent != 'object') { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.vip_agent> must be Object`); }
                else {
                    if (!validate_StringOrNull_AndNotEmpty(Payload_Store.personal.vip_agent._agentid)) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.vip_agent._agentid> must be String ObjectId or Null and Not Empty`); }
                    else {
                        if (validate_StringObjectId_NotNull(Payload_Store.personal.vip_agent._agentid) && validate_StringObjectId_NotNull(Payload_Store._storeid) && validate_StringObjectId_NotNull(Payload_Store.register_from_branch)) {
                            const findAgent = await checkAgentId(
                                {
                                    _storeid: Payload_Store._storeid,
                                    _branchid: Payload_Store.register_from_branch,
                                    _agentid: Payload_Store.personal.vip_agent._agentid
                                },
                                (err) => { if (err) { console.error(err); return; } }
                            );

                            if (!findAgent) { ErrorJson.description.push(`Param <${MSG_ROOT_JSON}.personal.vip_agent._agentid> findAgent return not found FROM <_agentid> (${Payload_Store.personal.vip_agent._agentid}) AT <_storeid> (${Payload_Store._storeid}) <_branchid> (${Payload_Store.register_from_branch})`); }
                        }
                    }
                }
            }
            
        }

        if (ErrorJson.description.length > 0) { res.status(400).json(ErrorJson).end(); }
        else {
            next();
        }
        
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};

module.exports = Register_Patient_Save_ExcelMiddleware;