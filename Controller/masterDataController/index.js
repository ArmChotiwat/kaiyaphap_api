const listAllProvinceThailand = require('./code/thailandProvince');
const listAllAmphureThailand = require('./code/thailandAmphure');
const listAllDistrictThailand = require('./code/thailandDistrict');

const illnessHistoryController = require('./code/illnessHistory');
const treatmentStoreController = require('./code/treatmentStore');
const illnessCharacticController = require('./code/illnessCharactic');

const caseTypeController = require('./code/caseType');
const caseTypeStoreController_save = caseTypeController.caseTypeStoreController_save;
const caseTypeStoreController_view = caseTypeController.caseTypeStoreController_view;

const treatmentRightsStoreController = require('./code/treatmentRights_Store');
const treatmentRightsStoreController_save = treatmentRightsStoreController.treatmentRightsStore_Save_Controller;
const treatmentRightsStoreController_edit = treatmentRightsStoreController.treatmentRightsStore_Edit_Controller;
const treatmentRightsStoreController_disabled = treatmentRightsStoreController.treatmentRightsStore_Disabled_Controller;
const treatmentRightsStoreController_view = treatmentRightsStoreController.treatmentRightsStore_View_Controller;

const ptDiagnosis_Controller = require('./code/ptDiagnosis');
const ptDiagnosisController_view = ptDiagnosis_Controller.ptDiagnosis_View_Controller;

const courseGroup_Controller = require('./code/courseGroup');
const courseGroupController_view = courseGroup_Controller.courseGroup_View_Controller;

const course_Controller = require('./code/course');
const courseController_save = course_Controller.course_Save_Controller;
const courseController_edit = course_Controller.course_Edit_Controller;
const courseController_switch = course_Controller.course_Switch_Controller;
const courseController_view = course_Controller.course_View_Controller;

const productGroup_Controller = require('./code/productGroup');
const productGroupController_save = productGroup_Controller.productGroup_Save_Controller;
const productGroupController_edit = productGroup_Controller.productGroup_Edit_Controller;
const productGroupController_switch = productGroup_Controller.productGroup_Switch_Controller;
const productGroupController_view = productGroup_Controller.productGroup_View_Controller
const productGroupController_viewall = productGroup_Controller.productGroup_ViewAll_Controller

const uploadImageStore = require('./code/uploadImageStore');
const uploadImageStore_save = uploadImageStore.upload_image_store;
const uploadImageStore_get = uploadImageStore.viewImageStore;
const viewImageStore_full_path = uploadImageStore.viewImageStore_full_path;

module.exports = {
    listAllProvinceThailand,
    listAllAmphureThailand,
    listAllDistrictThailand,

    illnessHistoryController,
    treatmentStoreController,
    illnessCharacticController,

    caseTypeStoreController_save,
    caseTypeStoreController_view,

    treatmentRightsStoreController_save,
    treatmentRightsStoreController_edit,
    treatmentRightsStoreController_disabled,
    treatmentRightsStoreController_view,

    ptDiagnosisController_view,

    courseGroupController_view,

    courseController_save,
    courseController_edit,
    courseController_switch,
    courseController_view,

    productGroupController_save,
    productGroupController_edit,
    productGroupController_switch,
    productGroupController_view,
    productGroupController_viewall,

    uploadImageStore_save,
    uploadImageStore_get,
    viewImageStore_full_path,
};