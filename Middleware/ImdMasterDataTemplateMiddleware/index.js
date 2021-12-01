const caseTypeSaveMiddleware = require('./code/caseTypeSave');
const caseSubTypeSaveMiddleware = require('./code/caseSubTypeSave');
const templatePtDiagnosisMiddleware = require('./code/ptDiagnosis');
const templatePtDiagnosisMiddleware_save =  templatePtDiagnosisMiddleware.template_PtDiagnosis_Save_Middleware;
const imdLoginMiddleware = require('./code/imdLoginMiddleware')
const imdRegisterStoreMiddleware = require('./code/imdRegisterStoreMiddleware')
module.exports = {
    caseTypeSaveMiddleware,
    caseSubTypeSaveMiddleware,
    templatePtDiagnosisMiddleware_save,
    imdLoginMiddleware,
    imdRegisterStoreMiddleware,
};