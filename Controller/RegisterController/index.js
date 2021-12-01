const registerPatientController_AutoIncresement = require('./code/registerPatientController_AutoIncresement');
const registerPatientController_importExcelSave = require('./code/registerPatientController_importExcelSave');
const Register_Patient_Save_FullController = require('./code/Register_Patient_Save_FullController');
const Register_Patient_Edit_FullController = require('./code/Register_Patient_Edit_FullController');
const Register_Patient_Save_QuickController = require('./code/Register_Patient_Save_QuickController');
const Register_Patient_Save_ExcelController = require('./code/Register_Patient_Save_ExcelController');

module.exports = {
    registerPatientController_AutoIncresement,
    registerPatientController_importExcelSave,
    Register_Patient_Save_FullController,
    Register_Patient_Edit_FullController,
    Register_Patient_Save_QuickController,
    Register_Patient_Save_ExcelController,
    Register_Agent_Save_FullController: require('./code/Register_Agent_Save_FullController'),
    RegisterImd_Agent_Save_FullController: require('./code/RegisterImd_Agent_Save_FullController'),
};