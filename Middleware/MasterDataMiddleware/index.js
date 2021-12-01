const illnessHistoryMiddleware_save = require('./code/illnessHistory').illnessHistoryMiddleware_save;
const illnessHistoryMiddleware_put = require('./code/illnessHistory').illnessHistoryMiddleware_put;
const illnessHistoryMiddleware_patch = require('./code/illnessHistory').illnessHistoryMiddleware_patch;
const illnessHistoryMiddleware_get = require('./code/illnessHistory').illnessHistoryMiddleware_get;
const illnessHistoryMiddleware_All_get = require('./code/illnessHistory').illnessHistoryMiddleware_All_get;
const treatmentStoreMiddleware = require('./code/treatmentStore');
const illnessCharacticMiddleware = require('./code/illnessCharactic');

const caseTypeMiddleware = require('./code/caseType');
const caseTypeStoreMiddleware_save = caseTypeMiddleware.caseTypeStoreMiddleware_save;
const caseTypeStoreMiddleware_view = caseTypeMiddleware.caseTypeStoreMiddleware_view;

const treatmentRightsStoreMiddleware = require('./code/treatmentRights_Store');
const treatmentRightsStoreMiddleware_save = treatmentRightsStoreMiddleware.treatmentRightsStore_Save_Middleware;
const treatmentRightsStoreMiddleware_edit = treatmentRightsStoreMiddleware.treatmentRightsStore_Edit_Middleware;
const treatmentRightsStoreMiddleware_disabled = treatmentRightsStoreMiddleware.treatmentRightsStore_Disabled_Middleware;
const treatmentRightsStoreMiddleware_view = treatmentRightsStoreMiddleware.treatmentRightsStore_View_Middleware;

const ptDiagnosisMiddleware = require('./code/ptDiagnosis');
const ptDiagnosisStoreMiddleware_view = ptDiagnosisMiddleware.ptDiagnosis_View_Middleware;

const courseGroupMiddleware = require('./code/courseGroup');
const courseGroupStoreMiddleware_view = courseGroupMiddleware.courseGroup_View_Middleware;

const courseMiddleware = require('./code/course');
const courseMiddleware_save = courseMiddleware.course_Save_Middleware;
const courseMiddleware_edit = courseMiddleware.course_Edit_Middleware;
const courseMiddleware_switch = courseMiddleware.course_Switch_Middleware;
const courseMiddleware_view = courseMiddleware.course_View_Middleware;

const productGroupMiddleware = require('./code/productGroup');
const productGroupMiddleware_save = productGroupMiddleware.productGroup_Save_Middleware;
const productGroupMiddleware_edit = productGroupMiddleware.productGroup_Edit_Middleware;
const productGroupMiddleware_switch = productGroupMiddleware.productGroup_Switch_Middleware;
const productGroupMiddleware_view = productGroupMiddleware.productGroup_View_Middleware;

module.exports = {
    illnessHistoryMiddleware_save,
    illnessHistoryMiddleware_put,
    illnessHistoryMiddleware_patch,
    illnessHistoryMiddleware_get,
    illnessHistoryMiddleware_All_get,
    
    treatmentStoreMiddleware,
    illnessCharacticMiddleware,
    caseTypeStoreMiddleware_save,
    caseTypeStoreMiddleware_view,
    treatmentRightsStoreMiddleware_save,
    treatmentRightsStoreMiddleware_edit,
    treatmentRightsStoreMiddleware_disabled,
    treatmentRightsStoreMiddleware_view,
    ptDiagnosisStoreMiddleware_view,

    courseGroupStoreMiddleware_view,

    courseMiddleware_save,
    courseMiddleware_edit,
    courseMiddleware_switch,
    courseMiddleware_view,

    productGroupMiddleware_save,
    productGroupMiddleware_edit,
    productGroupMiddleware_switch,
    productGroupMiddleware_view,
};