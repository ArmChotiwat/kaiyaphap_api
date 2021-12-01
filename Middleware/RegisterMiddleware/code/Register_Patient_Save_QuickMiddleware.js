const Register_Patient_Save_QuickMiddleware = async (req, res, next) => {

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    const { validate_StringOrNull_AndNotEmpty, validate_String_AndNotEmpty, validate_StringObjectId_NotNull, validatePhoneNumber, checkStoreBranch } = require('../../../Controller/miscController');
    const { ObjectId, patientPhoneNumberModel } = require('../../../Controller/mongodbController');
    /**
     ** JSON => {
            _ref_storeid: { type: ObjectId },
            _ref_branchid: { type: ObjectId },
            pre_name: { type: String },
            special_prename: { type: String OR Null },
            first_name: { type: String },
            last_name: { type: String },
            phone_number: { type: String },
        }
     ** Remark
        ** special_prename จะเป็น Null ก็ต่อมื่อ pre_name ไม่เป็นคำว่า "อื่นๆ"
    */
    const payload = req.body;

    try {
        let validateStoreBranch = false;

        if (!validate_StringObjectId_NotNull(payload._ref_storeid)) { ErrorJson.description.push(`Param <_ref_storeid> must be String ObjectId and Not Empty`) }
        if (!validate_StringObjectId_NotNull(payload._ref_branchid)) { ErrorJson.description.push(`Param <_ref_branchid> must be String ObjectId and Not Empty`) }
        if (validate_StringObjectId_NotNull(payload._ref_storeid) && validate_StringObjectId_NotNull(payload._ref_branchid)) {
            if (!(await checkStoreBranch({_storeid: payload._ref_storeid, _branchid: payload._ref_branchid}, (err) => { if (err) { console.error(err); return; } }))) { ErrorJson.description.push(`Param <_ref_storeid> <_ref_branchid> not found data`) }
            else {
                validateStoreBranch = true;
            }
        }
        if (!validate_String_AndNotEmpty(payload.pre_name)) { ErrorJson.description.push(`Param <pre_name> must be String and Not Empty`) }
        if (!validate_StringOrNull_AndNotEmpty(payload.special_prename)) { ErrorJson.description.push(`Param <special_prename> must be String and Not Empty`) }
        if (payload.pre_name === 'อื่นๆ' && !validate_String_AndNotEmpty(payload.special_prename)) { ErrorJson.description.push(`Param <special_prename> must be String and Not Empty, Due <payload.pre_name> is selected other`) }
        if (payload.pre_name !== 'อื่นๆ' && payload.special_prename !== null) { ErrorJson.description.push(`Param <special_prename> must be Null, Due <payload.pre_name> is not selected other`) }
        if (!validate_String_AndNotEmpty(payload.first_name)) { ErrorJson.description.push(`Param <first_name> must be String and Not Empty`) }
        if (!validate_String_AndNotEmpty(payload.last_name)) { ErrorJson.description.push(`Param <last_name> must be String and Not Empty`) }
        if (!validate_String_AndNotEmpty(payload.phone_number)) { ErrorJson.description.push(`Param <phone_number> must be String contains 0 to 9 and have 10 digits`) }
        if (validate_String_AndNotEmpty(payload.phone_number) && !validatePhoneNumber(payload.phone_number)) { ErrorJson.description.push(`Param <phone_number> must be String contains 0 to 9 and have 10 digits`) }
        if (validateStoreBranch && validate_String_AndNotEmpty(payload.phone_number) && validate_String_AndNotEmpty(payload.phone_number)) {
            const checkPatientPhoneNumberExist = await patientPhoneNumberModel.findOne(
                {
                    '_ref_storeid': ObjectId(payload._ref_storeid),
                    'phone_number': payload.phone_number
                },
                (err) => { if (err) { throw err; } }
            );

            if (checkPatientPhoneNumberExist) { ErrorJson.description.push(`Param <phone_number> is duplicated in this store`) }
        }

        if (ErrorJson.description.length > 0) { res.status(400).json(ErrorJson).end(); }
        else {
            next();
        }
    } catch (error) {
        console.log(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }

};

module.exports = Register_Patient_Save_QuickMiddleware;