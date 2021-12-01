const AutoIncrementCasePatient = require('./code/autoIncresementCasePatient');
const AutoIncrementCasePatientStore = AutoIncrementCasePatient.AutoIncrementCasePatientStore;
const AutoIncrementCasePatientStoreBranch = AutoIncrementCasePatient.AutoIncrementCasePatientStoreBranch;

const casePatinetCreateController = require('./code/createCase');
const viewCasePatientStoreBranchAgentController = require('./code/viewCasePatientStoreBranchAgent');
const viewCasePatientStoreBranchAgentDetailController = require('./code/viewCasePatientStoreBranchAgentDetail');
const casePatinetCreateStage1Controller = require('./code/createCase_Stage_1');
const casePatinetCreateStage2Controller = require('./code/createCase_Stage_2');
const casePatinetCreateCaseStage2ImageController = require('./code/createCase_Stage_2_image')
const casePatinetCloneStage1Controller = require('./code/cloneCase_Stage_1');
const casePatinetViewStage1LastestController = require('./code/viewCase_Stage_1_Lastest');
const casePatinetCreateStage3_Ortho_Upper_Controller = require('./code/createCase_Stage_3_Ortho_Upper');
const casePatinetCreateStage3_Ortho_Lower_Controller = require('./code/createCase_Stage_3_Ortho_Lower');
const casePatinetCreateStage3_Ortho_TrunkSpine_Controller = require('./code/createCase_Stage_3_Ortho_TrunkSpine');
const casePatinetCreateStage3_Ortho_General_Controller = require('./code/createCase_Stage_3_Ortho_General');

const casePatient_View_CaseStatus_Controller = require('./code/casePatient_View_CaseStatus_Controller');
const CasePatient_View_Related_Status_Controller = require('./code/CasePatient_View_Related_Status_Controller');
const casePatientClosureController = require('./code/casePatient_ClosureController')
const casePatinetCreateStage3_Neuro_Controller = require('./code/createCase_Stage_3_neuro')
module.exports = {
    AutoIncrementCasePatientStore,
    AutoIncrementCasePatientStoreBranch,
    casePatinetCreateController,
    viewCasePatientStoreBranchAgentController,
    viewCasePatientStoreBranchAgentDetailController,
    casePatinetCreateStage1Controller,
    casePatinetCreateStage2Controller,
    casePatinetCreateCaseStage2ImageController,
    casePatinetCloneStage1Controller,
    casePatinetViewStage1LastestController,
    casePatientClosureController,
    casePatinetCreateStage3Controller: {
        Ortho: {
            Upper: casePatinetCreateStage3_Ortho_Upper_Controller,
            Lower: casePatinetCreateStage3_Ortho_Lower_Controller,
            TrunkSpine: casePatinetCreateStage3_Ortho_TrunkSpine_Controller,
            General: casePatinetCreateStage3_Ortho_General_Controller
        },
    },
    casePatinetCreateStage3_Neuro_Controller,
    casePatient_View_CaseStatus_Controller,
    CasePatient_View_Related_Status_Controller,
};