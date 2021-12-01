const mongoose = require('../Config/Engine_mongodb').mongoose;
// const url = process.env.MONGODB_URI || require('../config/cfg_mongodb')
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, });


const storeModel = require('../Model/StoreModel');
const patientModel = require('../Model/PatientModel');
const agentModel = require('../Model/AgentModel');
const scheduleModel = require('../Model/ScheduleModel');
const illnessModel = require('../Model/IllnessModel');
const illnessCharacticModel = require('../Model/IllnessCharacticModel');
const treatmentRightsModel = require('../Model/TreatmentRightsModel');
const treatmentStoreModel = require('../Model/TreatmentStore'); // ไม่เอาตัวนี้แล้ว รอถอน
const treatmentModel = require('../Model/TreatmentModel');
const treatmentDetailModel = require('../Model/Treatment_DetailModel');
const treatment_ProgressionNoteModel = require('../Model/Treatment_ProgressionNoteModel');
const caseTypeModel = require('../Model/CaseTypeModel');
const casePatientModel = require('../Model/CasePatientModel');
const casePatientPersonalDetailModel = require('../Model/CasePatient_PersonalDetailModel');
const casePatientStage1Model = require('../Model/CasePatient_Stage_1');
const casePatientStage2Model = require('../Model/CasePatient_Stage_2');
const casePatientStage3Model = require('../Model/CasePatient_Stage_3');
const purchaseOrderModel = require('../Model/PurchaseOrderModel');
const purchaseOrderDetailModel = require('../Model/PurchaseOrder_DetailModel');

const courseModel = require('../Model/CourseModel');

const productModel = require('../Model/ProductModel');
const productGroupModel = require('../Model/Product_GroupModel');
const inventoryImportModel = require('../Model/Product_InventoryImportModel');
const inventoryModel = require('../Model/Product_InventoryModel');
const productInventoryPriceModel = require('../Model/Product_Inventory_Price');
const productImagesModel = require('../Model/product_imageModel');
const tempCaseTypeModel = require('../Model/TempCaseTypeModel');
const tempTreatmentRightsModel = require('../Model/TempTreatmentRightsModel');
const tempPtDiagnosisModel = require('../Model/TemplatePtDiagnosisModel');
const tempCourseGroupModel = require('../Model/TemplateCourseGroupModel');
const tempIllnessModel = require('../Model/TemplateIllnessModel');
const tempIllnessCharacticModel = require('../Model/TempIllnessCharacticModel');

const AutoIncrementPatientModel = require('../Model/AutoIncrementPatientModel');
const AutoIncrementCasePatientStoreModel = require('../Model/AutoIncrementCasePatientStoreModel');
const AutoIncrementCasePatientBranchModel = require('../Model/AutoIncrementCasePatientBranchModel');
const AutoIncrementInventoryImportModel = require('../Model/AutoIncrementInventoryImportModel');
const AutoIncrementPtDiagnosisModel = require('../Model/AutoIncrementTemplatePtDiagnosisModel');
const AutoIncrementTemplateCourseGroupModel = require('../Model/AutoIncrementTemplateCourseGroupModel');
const AutoIncrementCourseGroupModel = require('../Model/AutoIncrementCourseModel');
const AutoIncrementInventoryModel = require('../Model/AutoIncrementInventoryModel');
const AutoIncrementProductGroupModel = require('../Model/AutoIncrementProductGroupModel');
const AutoIncrementproductInventoryPriceModel = require('../Model/AutoIncrementPruductPriceModel');
const AutoIncrementProductModel = require('../Model/AutoIncrementProductModel');
const AutoIncrementTreatmentModel = require('../Model/AutoIncrementTreatmentModel');
const AutoIncrementPurchaseOrderModel = require('../Model/AutoIncrementPurchaseOrderModel');
const AutoIncrementPurchaseOrderRunnerModel = require('../Model/AutoIncrementPurchaseOrderRunnerModel');


const provinceModel = require('../Model/ProvinceModel');
const amphureModel = require('../Model/AmphureModel');
const districtModel = require('../Model/DistrictModel');

const logCustomerLoginModel = require('../Model/LogCustomerLoginModel');
// const logProductInventoryDecreseModel = require('../Model/LogProduct_InventoryDecrese');

const archiveTreatmentModel = require('../Model/Archive_TreatmentModel');
const archiveTreatmentDetailModel = require('../Model/Archive_Treatment_DetailModel');

const casePatient_StatusModel = require('../Model/CasePatient_StatusModel');

const checkObjectId = require('./miscController').checkObjectId;
const validateObjectId = require('./miscController').validateObjectId;
const checkStoreBranch = require('./miscController').checkStoreBranch;
const checkStore = require('./miscController').checkStore;
const patientPIDModel = require('../Model/Patient_PIDModel')
const patientPhoneNumberModel = require('../Model/Patient_PhoneNumberModel')
const agentEmailModel = require('../Model/Agent_EmailModel');
const scheduleModel_Refactor = require('../Model/ScheduleModel_Refactor');

module.exports = {
    
    mongoose, 
    ObjectId: mongoose.Types.ObjectId,
    checkObjectId, 
    validateObjectId,
    checkStore,
    checkStoreBranch,

    caseTypeModel,
    storeModel,
    patientModel, 
    patientPIDModel,
    patientPhoneNumberModel,
    agentModel, 
    agentEmailModel,
    scheduleModel,
    scheduleModel_Refactor,
    illnessModel,
    illnessCharacticModel,
    treatmentRightsModel,
    treatmentStoreModel,
    treatmentModel,
    treatmentDetailModel,
    treatment_ProgressionNoteModel,
    
    casePatientModel,
    casePatientPersonalDetailModel,
    casePatientStage1Model,
    casePatientStage2Model,
    casePatientStage3Model,

    purchaseOrderModel,
    purchaseOrderDetailModel,

    courseModel,

    productModel,
    productGroupModel,
    inventoryImportModel,
    inventoryModel,
    productInventoryPriceModel,
    productImagesModel,

    tempCaseTypeModel,
    tempTreatmentRightsModel,
    tempPtDiagnosisModel,
    tempCourseGroupModel,
    tempIllnessModel,
    tempIllnessCharacticModel,

    AutoIncrementPatientModel,
    AutoIncrementCasePatientStoreModel,
    AutoIncrementCasePatientBranchModel,
    AutoIncrementInventoryImportModel,
    AutoIncrementPtDiagnosisModel,
    AutoIncrementTemplateCourseGroupModel,
    AutoIncrementCourseGroupModel,
    AutoIncrementInventoryModel,
    AutoIncrementProductGroupModel,
    AutoIncrementproductInventoryPriceModel,
    AutoIncrementProductModel,
    AutoIncrementTreatmentModel,
    AutoIncrementPurchaseOrderModel,
    AutoIncrementPurchaseOrderRunnerModel,

    provinceModel,
    amphureModel,
    districtModel,

    logCustomerLoginModel, 
    // logProductInventoryDecreseModel,

    archiveTreatmentModel,
    archiveTreatmentDetailModel,

    casePatient_StatusModel
};