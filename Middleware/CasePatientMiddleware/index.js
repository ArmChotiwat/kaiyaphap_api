const casePatinetCreateMiddleware = require('./code/createCase');
const casePatinetCreateValidateMiddleware = require('./code/createCaseValidate');
const viewCasePatientStoreBranchAgentMiddleware = require('./code/viewCasePatientStoreBranchAgent');
const viewCasePatientStoreBranchAgentDetailMiddleware = require('./code/viewCasePatientStoreBranchAgentDetail');
const casePatinetCreateStage1Middleware = require('./code/createCase_Stage_1');
const casePatinetCreateStage2Middleware = require('./code/createCase_Stage_2');
const casePatinetCloneStage1Middleware = require('./code/cloneCase_Stage_1');
const casePatinetViewStage1LastestMiddleware = require('./code/viewCase_Stage_1_Lastest');
const casePatinetCreateStage3Middleware = require('./code/createCase_Stage_3');
const casePatient_View_CaseStatus_Middleware = require('./code/casePatient_View_CaseStatus_Middleware');
const case_PatinetCreateCase_Stage_2_Image_Middleware = require('./code/casePatinetCreateCase_Stage_2_ImageMiddleware');
const CasePatient_View_Related_Status_Middleware = require('./code/CasePatient_View_Related_Status_Middleware');
const casePatientClosureMiddleware = require('./code/casePatientClosureMiddleware');
const casePatinetCreateStage3NeuroMiddleware = require('./code/createCase_Stage_3Neuro')

module.exports = {
    casePatinetCreateMiddleware,
    casePatinetCreateValidateMiddleware,
    viewCasePatientStoreBranchAgentMiddleware,
    viewCasePatientStoreBranchAgentDetailMiddleware,
    casePatinetCreateStage1Middleware,
    casePatinetCreateStage2Middleware,
    casePatinetCloneStage1Middleware,
    casePatinetViewStage1LastestMiddleware,
    casePatinetCreateStage3Middleware,
    casePatient_View_CaseStatus_Middleware,
    case_PatinetCreateCase_Stage_2_Image_Middleware,
    CasePatient_View_Related_Status_Middleware,
    casePatientClosureMiddleware,
    casePatinetCreateStage3NeuroMiddleware,
};