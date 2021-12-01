const Register_Patient_Edit_FullMiddleware = async (req, res, next) => {
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    const {
            validate_String_AndNotEmpty,
            validate_StringOrNull_AndNotEmpty,
            validateBirthDate,
            validateStrict_Number_OrNull,
            validateCitizenId_Thailand,
            validate_StringObjectId_NotNull,
            validatePhoneNumber
    } = require('../../../Controller/miscController');
    const { illnessCharacticModel, illnessModel, ObjectId, patientModel, patientPhoneNumberModel, patientPIDModel, agentModel } = require('../../../Controller/mongodbController');

    try {
        const payload = req.body;

        const Retry_Max = 10;

        let Original_ref_patient_userid;
        let Original_ref_patient_userstoreid;
        let Original_ref_storeid;
        let Original_phone_number;
        let Original_identity_card;

        if (!validate_StringObjectId_NotNull(payload._id)) { ErrorJson.description.push(`Param <_id> must be String ObjectId and Not Empty`); }
        if (!validate_StringObjectId_NotNull(payload.store[0]._storeid)) { ErrorJson.description.push(`Param <store[0]._storeid> must be String ObjectId and Not Empty`); }
        if (validate_StringObjectId_NotNull(payload._id) && validate_StringObjectId_NotNull(payload.store[0]._storeid)) {
            const findUserExists = await patientModel.aggregate(
                [
                    {
                      '$match': {
                        '_id': ObjectId(payload._id), 
                        'store._storeid': ObjectId(payload.store[0]._storeid)
                      }
                    }, {
                      '$unwind': {
                        'path': '$store'
                      }
                    }, {
                      '$match': {
                        '_id': ObjectId(payload._id), 
                        'store._storeid': ObjectId(payload.store[0]._storeid)
                      }
                    }, {
                      '$project': {
                        '_id': 0, 
                        '_ref_patient_userid': '$_id', 
                        '_ref_patient_userstoreid': '$store._id', 
                        '_ref_storeid': '$store._storeid', 
                        'phone_number': '$store.personal.phone_number',
                        'identity_card': '$store.personal.identity_card.id'
                      }
                    }
                ],
                (err) => { if (err) { throw err; } }
            );

            if (!findUserExists) { throw new Error(`Register_Patient_Save_FullMiddleware: findUserExists have error during aggregate`); }
            else if (findUserExists.length <= 0) { ErrorJson.description.push(`Param <_id> and <store[0]._storeid> are not found data`); }
            else if (findUserExists.length > 1) { throw new Error(`Register_Patient_Save_FullMiddleware: findUserExists return Length (${findUserExists.length}) morethan 1`); }
            else {
                Original_ref_patient_userid = ObjectId(findUserExists[0]._ref_patient_userid);
                Original_ref_patient_userstoreid = ObjectId(findUserExists[0]._ref_patient_userstoreid);
                Original_ref_storeid = ObjectId(findUserExists[0]._ref_storeid);
                Original_phone_number = String(findUserExists[0].phone_number);
                Original_identity_card = (findUserExists[0].identity_card === null) ? null:String(findUserExists[0].identity_card);
            }
        };
        if (typeof payload.store[0].personal != 'object') { ErrorJson.description.push(`Param <store[0].personal> must be Object`); }
        if (!validate_String_AndNotEmpty(payload.store[0].personal.pre_name)) { ErrorJson.description.push(`Param <store[0].personal.pre_name> must be String and Not Empty`); }
        if (validate_String_AndNotEmpty(payload.store[0].personal.pre_name) && payload.store[0].personal.pre_name != 'อื่นๆ' && payload.store[0].personal.special_prename !== null) { ErrorJson.description.push(`Param <store[0].personal.special_prename> must be Null, Due <store[0].personal.pre_name> is not อื่นๆ`); }
        if (validate_String_AndNotEmpty(payload.store[0].personal.pre_name) && payload.store[0].personal.pre_name == 'อื่นๆ' && !validate_String_AndNotEmpty(payload.store[0].personal.special_prename)) { ErrorJson.description.push(`Param <store[0].personal.special_prename> must be String and Not Empty, Due <store[0].personal.pre_name> is อื่นๆ`); }
        if (!validate_String_AndNotEmpty(payload.store[0].personal.first_name)) { ErrorJson.description.push(`Param <store[0].personal.first_name> must be String and Not Empty`); }
        if (!validate_String_AndNotEmpty(payload.store[0].personal.last_name)) { ErrorJson.description.push(`Param <store[0].personal.last_name> must be String and Not Empty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.nick_name)) { ErrorJson.description.push(`Param <store[0].personal.nick_name> must be String or Null and Not Empty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.gender)) { ErrorJson.description.push(`Param <store[0].personal.gender> must be String or Null and Not Empty`); }
        if (!validateBirthDate(payload.store[0].personal.birth_date)) { ErrorJson.description.push(`Param <store[0].personal.birth_date> must be String YYYY/MM/DD`); }
        if (!validateStrict_Number_OrNull(payload.store[0].personal.height)) { ErrorJson.description.push(`Param <store[0].personal.height> must be Number (morethan 0) or Null`); }
        if (validateStrict_Number_OrNull(payload.store[0].personal.height) && payload.store[0].personal.height !== null && payload.store[0].personal.height <= 0) { ErrorJson.description.push(`Param <store[0].personal.height> must be Number morethan 0, Due <store[0].personal.height> is Not Null`); }
        if (!validateStrict_Number_OrNull(payload.store[0].personal.weight)) { ErrorJson.description.push(`Param <store[0].personal.weight> must be Number (morethan 0) or Null`); }
        if (validateStrict_Number_OrNull(payload.store[0].personal.weight) && payload.store[0].personal.weight !== null && payload.store[0].personal.weight <= 0) { ErrorJson.description.push(`Param <store[0].personal.weight> must be Number morethan 0, Due <store[0].personal.weight> is Not Null`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.nationality)) { ErrorJson.description.push(`Param <store[0].personal.nationality> must be String or Null and Not Empty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.race)) { ErrorJson.description.push(`Param <store[0].personal.race> must be String or Null and Not Empty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.religion)) { ErrorJson.description.push(`Param <store[0].personal.religion> must be String or Null and Not Empty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.blood_type)) { ErrorJson.description.push(`Param <store[0].personal.blood_type> must be String or Null and Not Empty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.telephone_number)) { ErrorJson.description.push(`Param <store[0].personal.telephone_number> must be String or Null and Not Empty`); }
        if (!validatePhoneNumber(payload.store[0].personal.phone_number)) { ErrorJson.description.push(`Param <store[0].personal.phone_number> must be String or and Not Empty (Must Have 10 Digit Contains only 0 to 9)`); }
        else {
            if (Original_ref_patient_userid && Original_ref_patient_userstoreid && Original_ref_storeid && Original_phone_number) {
                for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                    if (Original_phone_number !== payload.store[0].personal.phone_number) {
                        const findPhoneNumberIsDuplicated_From_patientPhoneNumberModel = await patientPhoneNumberModel.findOne(
                            {
                                '_ref_storeid': Original_ref_storeid,
                                'phone_number': String(payload.store[0].personal.phone_number)
                            },
                            {},
                            (err) => { if (err) { throw err; } }
                        );

                        if (findPhoneNumberIsDuplicated_From_patientPhoneNumberModel) { ErrorJson.description.push(`Param <store[0].personal.phone_number> is duplicated in this <_ref_storeid/_storeid>, Due <store[0].personal.phone_number> is changed from original`); break; }
                    }
                    else {
                        const findPhoneNumber_From_patientPhoneNumberModel = await patientPhoneNumberModel.findOne(
                            {
                                '_ref_storeid': Original_ref_storeid,
                                '_ref_patient_userid': Original_ref_patient_userid,
                                '_ref_patient_userstoreid': Original_ref_patient_userstoreid,
                                'phone_number': Original_phone_number
                            },
                            {},
                            (err) => { if (err) { throw err; } }
                        );

                        if (!findPhoneNumber_From_patientPhoneNumberModel) { ErrorJson.description.push(`Param <store[0].personal.phone_number> is not found in this <_ref_storeid/_storeid>, Due <store[0].personal.phone_number> is not changed from original`); break; }
                    }
                }
            }
        }
        if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.email)) { ErrorJson.description.push(`Param <store[0].personal.email> must be String or Null and Not Empty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.status)) { ErrorJson.description.push(`Param <store[0].personal.status> must be String or Null and Not Empty`); }
        if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.occupation)) { ErrorJson.description.push(`Param <store[0].personal.occupation> must be String or Null and Not Empty`); }
        if (typeof payload.store[0].personal.identity_card != 'object') { ErrorJson.description.push(`Param <store[0].personal.identity_card> must be Object`); }
        if (typeof payload.store[0].personal.identity_card.ctype != 'boolean') { ErrorJson.description.push(`Param <store[0].personal.identity_card.ctype> must be Boolean`); }
        if (!validate_String_AndNotEmpty(payload.store[0].personal.identity_card.id)) { ErrorJson.description.push(`Param <store[0].personal.identity_card.ctype> must be String and Not Empty`); }
        else {
            if (Original_ref_patient_userid && Original_ref_patient_userstoreid && Original_ref_storeid && Original_identity_card) {
                for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                    if (Original_identity_card !== payload.store[0].personal.identity_card.id) {
                        const findPIDIsDuplicated_From_patientPIDModel = await patientPIDModel.findOne(
                            {
                                '_ref_storeid': Original_ref_storeid,
                                'identity_card': String(payload.store[0].personal.identity_card.id)
                            },
                            {},
                            (err) => { if (err) { throw err; } }
                        );

                        if (findPIDIsDuplicated_From_patientPIDModel) { ErrorJson.description.push(`Param <store[0].personal.identity_card.id> is duplicated in this <_ref_storeid/_storeid>, Due <store[0].personal.identity_card.id> is changed from original`); break; }
                    }
                    else {
                        const findPID_From_patientPIDModel = await patientPIDModel.findOne(
                            {
                                '_ref_storeid': Original_ref_storeid,
                                '_ref_patient_userid': Original_ref_patient_userid,
                                '_ref_patient_userstoreid': Original_ref_patient_userstoreid,
                                'identity_card': Original_identity_card
                            },
                            {},
                            (err) => { if (err) { throw err; } }
                        );

                        if (!findPID_From_patientPIDModel) { ErrorJson.description.push(`Param <store[0].personal.identity_card.id> is not found in this <_ref_storeid/_storeid>, Due <store[0].personal.identity_card.id> is not changed from original`); break; }
                    }
                }
            }
            else {
                if (!(Original_ref_patient_userid && Original_ref_patient_userstoreid && Original_ref_storeid && Original_identity_card === null)) {
                    throw new Error(`Register_Patient_Edit_FullMiddleware: Original_ref_patient_userid (${Original_ref_patient_userid}), Original_ref_patient_userstoreid (${Original_ref_patient_userstoreid}), Original_ref_storeid (${Original_ref_storeid}) one of these is Not Found, Due Original_identity_card (${Original_identity_card}) is Null`);
                }
            }
        }
        if (payload.store[0].personal.identity_card.ctype === true && !validateCitizenId_Thailand(payload.store[0].personal.identity_card.id)) { ErrorJson.description.push(`Param <store[0].personal.identity_card.id> must be 13 digits and Contains 0 To 9 and Not Start With 0, Due <store[0].personal.identity_card.ctype> is TRUE`); }
        
        if (typeof payload.store[0].personal.contract_card != 'object') { ErrorJson.description.push(`Param <store[0].personal.contract_card> must be Object`); }
        if (typeof payload.store[0].personal.contract_card == 'object') {
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_card.address_number)) { ErrorJson.description.push(`Param <store[0].personal.contract_card.address_number> must be String or Null and Not Empty`); }
            if (!validateStrict_Number_OrNull(payload.store[0].personal.contract_card.village_number)) { ErrorJson.description.push(`Param <store[0].personal.contract_card.village_number> must be Number or Null and Not Empty`); }
            if (validateStrict_Number_OrNull(payload.store[0].personal.contract_card.village_number) && payload.store[0].personal.contract_card.village_number !== null && payload.store[0].personal.contract_card.village_number <= 0) { ErrorJson.description.push(`Param <store[0].personal.contract_card.village_number> must be Number morethan 0, Due <store[0].personal.contract_card.village_number> is Not Null`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_card.village)) { ErrorJson.description.push(`Param <store[0].personal.contract_card.village> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_card.building)) { ErrorJson.description.push(`Param <store[0].personal.contract_card.building> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_card.alley)) { ErrorJson.description.push(`Param <store[0].personal.contract_card.alley> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_card.road)) { ErrorJson.description.push(`Param <store[0].personal.contract_card.road> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_card.province)) { ErrorJson.description.push(`Param <store[0].personal.contract_card.province> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_card.district)) { ErrorJson.description.push(`Param <store[0].personal.contract_card.district> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_card.sub_district)) { ErrorJson.description.push(`Param <store[0].personal.contract_card.sub_district> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_card.postcode)) { ErrorJson.description.push(`Param <store[0].personal.contract_card.postcode> must be String or Null and Not Empty`); }
        }

        if (typeof payload.store[0].personal.contract_present != 'object') { ErrorJson.description.push(`Param <store[0].personal.contract_present> must be Object`); }
        if (typeof payload.store[0].personal.contract_present == 'object') {
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_present.address_number)) { ErrorJson.description.push(`Param <store[0].personal.contract_present.address_number> must be String or Null and Not Empty`); }
            if (!validateStrict_Number_OrNull(payload.store[0].personal.contract_present.village_number)) { ErrorJson.description.push(`Param <store[0].personal.contract_present.village_number> must be Number or Null and Not Empty`); }
            if (validateStrict_Number_OrNull(payload.store[0].personal.contract_present.village_number) && payload.store[0].personal.contract_present.village_number !== null && payload.store[0].personal.contract_present.village_number <= 0) { ErrorJson.description.push(`Param <store[0].personal.contract_present.village_number> must be Number morethan 0, Due <store[0].personal.contract_present.village_number> is Not Null`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_present.village)) { ErrorJson.description.push(`Param <store[0].personal.contract_present.village> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_present.building)) { ErrorJson.description.push(`Param <store[0].personal.contract_present.building> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_present.alley)) { ErrorJson.description.push(`Param <store[0].personal.contract_present.alley> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_present.road)) { ErrorJson.description.push(`Param <store[0].personal.contract_present.road> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_present.province)) { ErrorJson.description.push(`Param <store[0].personal.contract_present.province> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_present.district)) { ErrorJson.description.push(`Param <store[0].personal.contract_present.district> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_present.sub_district)) { ErrorJson.description.push(`Param <store[0].personal.contract_present.sub_district> must be String or Null and Not Empty`); }
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_present.postcode)) { ErrorJson.description.push(`Param <store[0].personal.contract_present.postcode> must be String or Null and Not Empty`); }
        }

        if (typeof payload.store[0].personal.contract_emergency != 'object') { ErrorJson.description.push(`Param <store[0].personal.contract_emergency> must be Object`); }
        if (typeof payload.store[0].personal.contract_emergency == 'object') {            
            if (typeof payload.store[0].personal.contract_emergency.isenabled != 'boolean') { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data> must be Boolean`); }

            if (typeof payload.store[0].personal.contract_emergency.data != 'object') { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data> must be Object`); }
            else { // !payload.store[0].personal.contract_emergency.isenabled Fontend ของเจมส์
                if (typeof payload.store[0].personal.contract_emergency.data == 'object' && payload.store[0].personal.contract_emergency.isenabled === false) {
                    if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_emergency.data.address_number)) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.address_number> must be String or Null and Not Empty, Due <store[0].personal.contract_emergency.isenabled> is FALSE`); }
                    if (!validateStrict_Number_OrNull(payload.store[0].personal.contract_emergency.data.village_number)) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.village_number> must be Number or Null and Not Empty, Due <store[0].personal.contract_emergency.isenabled> is FALSE`); }
                    if (validateStrict_Number_OrNull(payload.store[0].personal.contract_emergency.data.village_number) && payload.store[0].personal.contract_emergency.data.village_number !== null && payload.store[0].personal.contract_emergency.data.village_number <= 0) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.village_number> must be Number morethan 0, Due <store[0].personal.contract_emergency.village_number> is Not Null, Due <store[0].personal.contract_emergency.isenabled> is FALSE`); }
                    if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_emergency.data.village)) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.village> must be String or Null and Not Empty, Due <store[0].personal.contract_emergency.isenabled> is FALSE`); }
                    if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_emergency.data.building)) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.building> must be String or Null and Not Empty, Due <store[0].personal.contract_emergency.isenabled> is FALSE`); }
                    if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_emergency.data.alley)) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.alley> must be String or Null and Not Empty, Due <store[0].personal.contract_emergency.isenabled> is FALSE`); }
                    if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_emergency.data.road)) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.road> must be String or Null and Not Empty, Due <store[0].personal.contract_emergency.isenabled> is FALSE`); }
                    if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_emergency.data.province)) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.province> must be String or Null and Not Empty, Due <store[0].personal.contract_emergency.isenabled> is FALSE`); }
                    if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_emergency.data.district)) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.district> must be String or Null and Not Empty, Due <store[0].personal.contract_emergency.isenabled> is FALSE`); }
                    if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_emergency.data.sub_district)) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.sub_district> must be String or Null and Not Empty, Due <store[0].personal.contract_emergency.isenabled> is FALSE`); }
                    if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.contract_emergency.data.postcode)) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.postcode> must be String or Null and Not Empty, Due <store[0].personal.contract_emergency.isenabled> is FALSE`); }
                }
                if (typeof payload.store[0].personal.contract_emergency.data == 'object' && payload.store[0].personal.contract_emergency.isenabled === true) {
                    if (payload.store[0].personal.contract_emergency.data.address_number !== null) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.address_number> must be Null, Due <store[0].personal.contract_emergency.isenabled> is TRUE`); }
                    if (payload.store[0].personal.contract_emergency.data.village_number !== null) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.village_number> must be Null, Due <store[0].personal.contract_emergency.isenabled> is TRUE`); }
                    if (payload.store[0].personal.contract_emergency.data.village !== null) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.village> must be Null, Due <store[0].personal.contract_emergency.isenabled> is TRUE`); }
                    if (payload.store[0].personal.contract_emergency.data.building !== null) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.building> must be Null, Due <store[0].personal.contract_emergency.isenabled> is TRUE`); }
                    if (payload.store[0].personal.contract_emergency.data.alley !== null) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.alley> must be Null, Due <store[0].personal.contract_emergency.isenabled> is TRUE`); }
                    if (payload.store[0].personal.contract_emergency.data.road !== null) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.road> must be Null, Due <store[0].personal.contract_emergency.isenabled> is TRUE`); }
                    if (payload.store[0].personal.contract_emergency.data.province !== null) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.province> must be Null, Due <store[0].personal.contract_emergency.isenabled> is TRUE`); }
                    if (payload.store[0].personal.contract_emergency.data.district !== null) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.district> must be Null, Due <store[0].personal.contract_emergency.isenabled> is TRUE`); }
                    if (payload.store[0].personal.contract_emergency.data.sub_district !== null) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.sub_district> must be Null, Due <store[0].personal.contract_emergency.isenabled> is TRUE`); }
                    if (payload.store[0].personal.contract_emergency.data.postcode !== null) { ErrorJson.description.push(`Param <store[0].personal.contract_emergency.data.postcode> must be Null, Due <store[0].personal.contract_emergency.isenabled> is TRUE`); }
                }
            }
        }

        if (typeof payload.store[0].personal.medication_privilege != 'object') { ErrorJson.description.push(`Param <store[0].personal.medication_privilege> must be Object`); }
        else {
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.medication_privilege.privilege_name)) { ErrorJson.description.push(`Param <store[0].personal.medication_privilege.privilege_name> must be String or Null and Not Empty`); }
        }

        if (typeof payload.store[0].personal.general_user_detail != 'object') { ErrorJson.description.push(`Param <store[0].personal.general_user_detail> must be Object`); }
        else {
            if (typeof payload.store[0].personal.general_user_detail.cigarette_acttivity != 'object') { ErrorJson.description.push(`Param <store[0].personal.general_user_detail.cigarette_acttivity> must be Object`); }
            else {
                if (typeof payload.store[0].personal.general_user_detail.cigarette_acttivity.answer != 'boolean') { ErrorJson.description.push(`Param <store[0].personal.general_user_detail.cigarette_acttivity> must be Boolean`); }
                if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.general_user_detail.cigarette_acttivity.detail)) { ErrorJson.description.push(`Param <store[0].personal.general_user_detail.cigarette_acttivity.detail> must be String or Null and Not Empty`); }
            }

            if (typeof payload.store[0].personal.general_user_detail.alcohol_acttivity != 'object') { ErrorJson.description.push(`Param <store[0].personal.general_user_detail.alcohol_acttivity> must be Object`); }
            else {
                if (typeof payload.store[0].personal.general_user_detail.alcohol_acttivity.answer != 'boolean') { ErrorJson.description.push(`Param <store[0].personal.general_user_detail.alcohol_acttivity> must be Boolean`); }
                if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.general_user_detail.alcohol_acttivity.detail)) { ErrorJson.description.push(`Param <store[0].personal.general_user_detail.alcohol_acttivity.detail> must be String or Null and Not Empty`); }
            }

            if (typeof payload.store[0].personal.general_user_detail.congenital_disease != 'object' || payload.store[0].personal.general_user_detail.congenital_disease.length < 0) { ErrorJson.description.push(`Param <store[0].personal.general_user_detail.congenital_disease> must be Array Object and Length of Array morethan or equal 0`); }
            else {
                for (let index = 0; index < payload.store[0].personal.general_user_detail.congenital_disease.length; index++) {
                    const element = payload.store[0].personal.general_user_detail.congenital_disease[index];
                    
                    if (!validate_StringObjectId_NotNull(element._illnesscharid)) { ErrorJson.description.push(`Param <store[0].personal.general_user_detail.congenital_disease[${index}]._illnesscharid> must be String ObjectId`); }
                    else {
                        if (validate_StringObjectId_NotNull(payload.store[0]._storeid)) {
                            const findCongenitalDisease = await illnessCharacticModel.findOne(
                                {
                                    '_id': ObjectId(element._illnesscharid),
                                    '_storeid': ObjectId(payload.store[0]._storeid)
                                },
                                {},
                                (err) => { if (err) { console.error(err); return; } }
                            );

                            if (!findCongenitalDisease) { ErrorJson.description.push(`Param <store[0].personal.general_user_detail.congenital_disease[${index}]._illnesscharid> findCongenitalDisease return not found FROM _illnesscharid (${element._illnesscharid}) AT _storeid (${payload.store[0]._storeid})`); }
                        }
                    }
                }
            }

            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.general_user_detail.drug_allergy)) { ErrorJson.description.push(`Param <store[0].personal.general_user_detail.drug_allergy> must be String or Null and Not Empty`); }
        }

        if (typeof payload.store[0].personal.illness_history != 'object' || payload.store[0].personal.illness_history.length < 0) { ErrorJson.description.push(`Param <store[0].personal.illness_history> must be Array Object and Length must morethan or equal 0`); }
        else {
            for (let index = 0; index < payload.store[0].personal.illness_history.length; index++) {
                const element = payload.store[0].personal.illness_history[index];
                
                if (!validate_StringObjectId_NotNull(element.id)) { ErrorJson.description.push(`Param <store[0].personal.illness_history[${index}].id> must be String ObjectId`); }
                else {
                    if (validate_StringObjectId_NotNull(payload.store[0]._storeid)) {
                        const findIllnessHistory = illnessModel.findOne(
                            {
                                '_id': ObjectId(element.id),
                                '_storeid': ObjectId(payload.store[0]._storeid)
                            },
                            {},
                            (err) => { if (err) { console.error(err); return; } }
                        );
                        
                        if (!findIllnessHistory) { ErrorJson.description.push(`Param <store[0].personal.general_user_detail.illness_history[${index}].id> findIllnessHistory return not found FROM id (${element.id}) AT _storeid (${payload.store[0]._storeid})`); }
                    }
                }

                if (!validateStrict_Number_OrNull(element.answer) && element.answer !== 1 && element.answer !== 2 && element.answer !== 3) { ErrorJson.description.push(`Param <store[0].personal.illness_history[${index}].answer> must be Number (1,2,3)`); }
                if (!validate_StringOrNull_AndNotEmpty(element.detail)) { ErrorJson.description.push(`Param <store[0].personal.illness_history[${index}].answer> must be String or Null and Not Empty`); }
            }
        }

        if (typeof payload.store[0].personal.referral != 'object') { ErrorJson.description.push(`Param <store[0].personal.referral> must be Object`); }
        else {
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.referral.referral_name)) { ErrorJson.description.push(`Param <store[0].personal.referral.referral_name> must be String or Null and Not Empty`); }
        }

        if (typeof payload.store[0].personal.vip_agent != 'object') { ErrorJson.description.push(`Param <store[0].personal.vip_agent> must be Object`); }
        else {
            if (!validate_StringOrNull_AndNotEmpty(payload.store[0].personal.vip_agent._agentid)) { ErrorJson.description.push(`Param <store[0].personal.vip_agent._agentid> must be String ObjectId or Null and Not Empty`); }
            else {
                if (validate_StringObjectId_NotNull(payload.store[0].personal.vip_agent._agentid) && validate_StringObjectId_NotNull(payload.store[0]._storeid) && validate_StringObjectId_NotNull(payload.store[0].register_from_branch)) {
                    const findAgent = await agentModel.findOne(
                        {
                            $or: [
                                {
                                    $and: [
                                        { '_id': ObjectId(payload.store[0].personal.vip_agent._agentid) },
                                        { 'store._storeid': ObjectId(payload.store[0]._storeid) }
                                    ]
                                },
                                {
                                    $and: [
                                        { 'store._id': ObjectId(payload.store[0].personal.vip_agent._agentid) },
                                        { 'store._storeid': ObjectId(payload.store[0]._storeid) }
                                    ]
                                },
                            ]
                        },
                        {},
                        (err) => { if (err) { console.error(err); return; } }
                    );

                    if (!findAgent) { ErrorJson.description.push(`Param <store[0].personal.vip_agent._agentid> findAgent return not found FROM <_agentid> (${payload.store[0].personal.vip_agent._agentid}) AT <_storeid> (${payload.store[0]._storeid})`); }
                }
            }
        }



        if (ErrorJson.description.length > 0) { res.status(ErrorJson.http_code).json(ErrorJson).end(); }
        else {
            next();
        }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push('Other Error');
        res.status(ErrorJson.http_code).json(ErrorJson).end();
    }
};

module.exports = Register_Patient_Edit_FullMiddleware;