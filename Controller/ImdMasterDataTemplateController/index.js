const caseTypeController_save = require('./code/caseType').caseTypeController_save;
const caseTypeController_view = require('./code/caseType').caseTypeController_view;
const caseSubTypeController_save = require('./code/caseSubType').caseSubTypeController_save;
const treatmentRights_Save_Controller = require('./code/treatmentRights').treatmentRights_Save_Controller;
const templatePtDiagnosisController = require('./code/ptDiagnosis');
const templatePtDiagnosisController_save = templatePtDiagnosisController.template_PtDiagnosis_Save_Controller;
const templatePtDiagnosisController_edit = templatePtDiagnosisController.template_PtDiagnosis_Edit_Controller
const templatePtDiagnosisController_switch = templatePtDiagnosisController.template_PtDiagnosis_Switch_Controller;
const templatePtDiagnosisController_view = templatePtDiagnosisController.template_PtDiagnosis_View_Controller;
const templateCourseGroupController = require('./code/courseGroup');
const templateCourseGroupController_save = templateCourseGroupController.template_CourseGroup_Save_Controller;
const templateCourseGroupController_edit = templateCourseGroupController.template_CourseGroup_Edit_Controller
const templateCourseGroupController_switch = templateCourseGroupController.template_CourseGroup_Switch_Controller;
const templateCourseGroupController_view = templateCourseGroupController.template_CourseGroup_View_Controller;
const imdLoginController = require('./code/imdLoginController'); 
const imd_Register_Store_Comtroller = require('./code/imdRegisterStoreComtroller')
module.exports = {
    caseTypeController_save,
    caseTypeController_view,
    caseSubTypeController_save,
    treatmentRights_Save_Controller,

    templatePtDiagnosisController_save,
    templatePtDiagnosisController_edit,
    templatePtDiagnosisController_switch,
    templatePtDiagnosisController_view,
    
    templateCourseGroupController_save,
    templateCourseGroupController_edit,
    templateCourseGroupController_switch,
    templateCourseGroupController_view,

    imdLoginController,
    imd_Register_Store_Comtroller,
};