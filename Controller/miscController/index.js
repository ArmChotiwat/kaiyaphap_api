const currentDateTime = require('./code/currentDateTime');
const checkObjectId = require('./code/checkObjectId');
const validateObjectId = require('./code/validateObjectId');
const checkStoreBranch = require('./code/checkStoreBranch');
const checkStore = require('./code/checkStore');
const zeroFill = require('./code/zeroFill');
const checkDateTime = require('./code/checkDateTime');
const checkDateTime_String = checkDateTime.checkDateTime_String;
const checkAgentId = require('./code/checkAgentId');
const checkAgentAdminId_StoreBranch = require('./code/checkAgentAdminId_StoreBranch');
const checkPatientId = require('./code/checkPatientId');
const checkImdAgentId = require('./code/checkImdAgentId');
const checkCasePatientProgress = require('./code/checkCasePatientProgress');
const checkCasePatientCaseType = require('./code/checkCasePatientCaseType');
const checkCourseGroupId = require('./code/checkCourseGroupId');
const regEx_SelectOnlyNumber = require('./code/regExReplace_SelectOnlyNumber');
const regEx_SelectOnlyThai = require('./code/regExReplace_SelectOnlyThai');
const regEx_SelectOnlyEng = require('./code/regExReplace_SelectOnlyEng');
const regEx_ClearWhiteSpace = require('./code/regExReplace_ClearWhiteSpace');
const regEx_ClearWhiteSpaceStartEnd = require('./code/regExReplace_ClearWhiteSpaceStartEnd');
const regEx_OnlyOneWhiteSpace = require('./code/regExReplace_OnlyOneWhiteSpace');
const regEx_Refactor_Bracket = require('./code/regExReplace_Refactor_Bracket');
const regEx_Refactor_Comma = require('./code/regExReplace_Refactor_Comma');
const regEx_Refactor_Dot = require('./code/regExReplace_Refactor_Dot');
const regEx_Refactor_Percent = require('./code/regExReplace_Refactor_Percent');
const regEx_Refactor_Slash = require('./code/regExReplace_Refactor_Slash');
const regEx_Refactor_WhiteSpace = require('./code/regExReplace_Refactor_WhiteSpace');
const regExReplace_RefactorProductName = require('./code/regExReplace_RefactorProductName');
const regExReplace_RefactorProductName_Before = require('./code/regExReplace_RefactorProductName_Before');
const regExReplace_RefactorProductName_Bracket = require('./code/regExReplace_RefactorProductName_Bracket');
const regExReplace_RefactorProductName_Comma = require('./code/regExReplace_RefactorProductName_Comma');
const regExReplace_RefactorProductName_Dot = require('./code/regExReplace_RefactorProductName_Dot');
const regExReplace_RefactorProductName_Slash = require('./code/regExReplace_RefactorProductName_Slash');
const regExReplace_RefactorProductName_WhiteSpace = require('./code/regExReplace_RefactorProductName_WhiteSpace');
const regExReplace_RefactorTreatmentRights = require('./code/regExReplace_RefactorTreatmentRights');
const regExReplace_RefactorTreatmentRights_Check = require('./code/regExReplace_RefactorTreatmentRights_Check');
const validateTaxId = require('./code/validateTaxId');
const { validateDateTime_Object_String, validateDateTime_String, validateDate_String, validateTime_String } = require('./code/validateDateTime');
const validate_StringOrNull_AndNotEmpty = require('./code/validateStringOrNullAndNotEmpty');
const jwtDecodeData = require('./code/jwtDecodeData');
const checkProduct = require('./code/checkProduct');
const checkProductInventory = require('./code/checkProductInventory');
const checkProductInventoryPrice = require('./code/checkProductInventoryPrice');
const checkCourse = require('./code/checkCourse');
const checkCoursePrice = require('./code/checkCoursePrice');
const checkCasePatientId_StoreBranch = require('./code/checkCasePatientId_StoreBranch');
const listAgent_StoreBranch = require('./code/listAgent_StoreBranch');
const checkPtDiagnosis = require('./code/checkPtDiagnosis');
const Schedule_Update_Status = require('./code/Schedule_Update_Status');
const Schedule_Check_Status = require('./code/Schedule_Check_Status');
const momentFormat = require('./code/momentFormat');
const checkTreatmentId = require('./code/checkTreatmentId');
const validate_String_AndNotEmpty = require('./code/validateStringAndNotEmpty');
const validateNumber = require('./code/validateNumber');
const validateStrict_Number_OrNull = require('./code/validateStrict_Number_OrNull');
const validate_StringObjectId_NotNull = require('./code/validateStringObjectId_NotNull');
const regExReplace_SelectOnlyNumber_Not = require('./code/regExReplace_SelectOnlyNumber_Not')
const regExReplace_SelectOnlyNumber = require('./code/regExReplace_SelectOnlyNumber')
const validate_patient_pid =require('./code/validatePatient_PID');
const validate_patient_phonenumber =require('./code/validatePatient_PhoneNumber');
const checkNull = require('./code/checkNull');
const validateBirthDate = require('./code/validateBirthDate');
const validateCitizenId_Thailand = require('./code/validateCitizenId_Thailand');
const validatePhoneNumber = require('./code/validatePhoneNumber');
const validateVillageNumber_OrNull = require('./code/validateVillageNumber_OrNull');
const validateVillageNumber_NotNull = require('./code/validateVillageNumber_NotNull');
const validateWeightHeight_OrNull = require('./code/validateWeightHeight_OrNull');
const validateSchedule_String_Time = require('./code/validateSchedule_String_Time');
const validateSchedule_String_Date = require('./code/validateSchedule_String_Date');
const validateEmail = require('./code/validateEmail');
const chackEmail = require('./code/chackEmail');
const chackEmailLowerCase = require('./code/chackEmailLowerCase');
const checkDirectorySize = require('./code/checkDirectorySize');

module.exports = {
    currentDateTime,
    checkObjectId,
    validateObjectId,
    checkStoreBranch,
    checkStore,
    zeroFill,
    checkDateTime: {
        checkDateTime_String
    },
    checkAgentId,
    checkAgentAdminId_StoreBranch,
    checkPatientId,
    checkImdAgentId,
    checkCasePatientProgress,
    checkCasePatientCaseType,
    checkCourseGroupId,
    regExReplace_RefactorProductName: {
        RefactorProductName: regExReplace_RefactorProductName,
        regExReplace_RefactorProductName_Before,
        regExReplace_RefactorProductName_Bracket,
        regExReplace_RefactorProductName_Comma,
        regExReplace_RefactorProductName_Dot,
        regExReplace_RefactorProductName_Slash,
        regExReplace_RefactorProductName_WhiteSpace

    },
    regExReplace_RefactorTreatmentRights: {
        RefactorTreatmentRights: regExReplace_RefactorTreatmentRights,
        RefactorTreatmentRights_Check: {
            Check: regExReplace_RefactorTreatmentRights_Check.regExReplace_RefactorTreatmentRights_Check,
            Check_Bracket: regExReplace_RefactorTreatmentRights_Check.regExReplace_RefactorTreatmentRights_Check_Bracket,
        },
    },
    regExReplace_RefactorStore: {
        regExReplace_Refactor_StoreName: require('./code/regExReplace_Refactor_StoreName'),
    },
    regExReplace: {
        regEx_SelectOnlyNumber,
        regEx_SelectOnlyThai,
        regEx_SelectOnlyEng,
        regEx_ClearWhiteSpace,
        regEx_ClearWhiteSpaceStartEnd,
        regEx_OnlyOneWhiteSpace,
        regEx_Refactor_Bracket,
        regEx_Refactor_Comma,
        regEx_Refactor_Dot,
        regEx_Refactor_Percent,
        regEx_Refactor_Slash,
        regEx_Refactor_WhiteSpace,

    },
    validateTaxId,
    validateDateTime: {
        validateDateTime_Object_String,
        validateDateTime_String,
        validateDate_String,
        validateTime_String,
    },
    validate_StringOrNull_AndNotEmpty,
    jwtDecodeData,
    checkProduct,
    checkProductInventory,
    checkProductInventoryPrice,
    checkCourse,
    checkCoursePrice,
    checkCasePatientId_StoreBranch,
    listAgent_StoreBranch,
    checkPtDiagnosis,
    Schedule_Update_Status,
    Schedule_Check_Status,
    momentFormat,
    checkTreatmentId,
    validate_String_AndNotEmpty,
    validateNumber,
    validateStrict_Number_OrNull,
    validate_StringObjectId_NotNull,
    regExReplace_SelectOnlyNumber_Not,
    regExReplace_SelectOnlyNumber,
    validate_patient_pid,
    validate_patient_phonenumber,
    checkNull,
    validateBirthDate,
    validateCitizenId_Thailand,
    validatePhoneNumber,
    validateVillageNumber_OrNull,
    validateVillageNumber_NotNull,
    validateWeightHeight_OrNull,
    validateSchedule_String_Time,
    validateSchedule_String_Date,
    chackEmail,
    validateEmail,
    chackEmailLowerCase,
    checkDirectorySize,
};