const registerPatinetMiddleware =  require('./code/registerPatinetMiddleware');
const registerPatinetMiddleware_importExcelSave = require('./code/registerPatinetMiddleware_importExcelSave');
const Register_Patient_Save_FullMiddleware = require('./code/Register_Patient_Save_FullMiddleware');
const Register_Patient_Edit_FullMiddleware = require('./code/Register_Patient_Edit_FullMiddleware');
const Register_Patient_Save_QuickMiddleware = require('./code/Register_Patient_Save_QuickMiddleware');
const Register_Patient_Save_ExcelMiddleware = require('./code/Register_Patient_Save_ExcelMiddleware');

module.exports = {
    registerPatinetMiddleware,
    registerPatinetMiddleware_importExcelSave,
    Register_Patient_Save_FullMiddleware,
    Register_Patient_Edit_FullMiddleware,
    Register_Patient_Save_QuickMiddleware,
    Register_Patient_Save_ExcelMiddleware,
    Register_Agent_Save_FullMiddleware: require('./code/Register_Agent_Save_FullMiddleware'),
};