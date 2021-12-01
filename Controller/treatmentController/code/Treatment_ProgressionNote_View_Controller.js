/**
 * Controller สำหรับ ดู Progression Note
 */
const Treatment_ProgressionNote_View_Controller = async (
  data = {
    _ref_storeid: '',
    _ref_branchid: '',
    _ref_agentid: '',
    _ref_casepatinetid: '',
    skip: 0,
  },
  callback = (err = new Error) => { }
) => {
  const controllerName = `Treatment_ProgressionNote_View_Controller`;

  const miscController = require('../../miscController');
  const validateObjectId = miscController.validateObjectId;
  const checkAgentId = miscController.checkAgentId;

  const mongodbController = require('../../mongodbController');
  const treatment_ProgressionNoteModel = mongodbController.treatment_ProgressionNoteModel;
  const ObjectId = mongodbController.ObjectId;

  if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
  else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
  else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
  else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
  else if (typeof data._ref_casepatinetid != 'string' || !validateObjectId(data._ref_casepatinetid)) { callback(new Error(`${controllerName}: <data._ref_casepatinetid> must be String ObjectId`)); return; }
  else if (typeof data.skip != 'number' || data.skip < 0) { callback(new Error(`${controllerName}: <data.skip> must be Number and morethan or equal 0`)); return; }
  else {
    const chkAgent = await checkAgentId(
      {
        _storeid: data._ref_storeid,
        _branchid: data._ref_branchid,
        _agentid: data._ref_agentid
      },
      (err) => { if (err) { callback(err); return; } }
    );

    if (!chkAgent) { callback(`${controllerName}: chkAgent return not found`); return; }
    else if (chkAgent.role !== 2) { callback(`${controllerName}: chkAgent.role (${chkAgent.role}) not equal 2 <Terapic Agent>`); return; }
    else {
      const findTreatment_ProgessionNote = await treatment_ProgressionNoteModel.aggregate(
        [
          {
            '$match': {
              '_ref_casepatinetid': ObjectId(data._ref_casepatinetid),
              '_ref_storeid': ObjectId(data._ref_storeid),
              '_ref_branchid': ObjectId(data._ref_branchid)
            }
          }, {
            '$sort': {
              '_id': -1
            }
          }, {
            '$skip': data.skip
          }, {
            '$limit': 1
          }, {
            '$project': {
              '_id': 0,
              '_ref_treatemt_progressionnoteid': '$_id',
              '_ref_treatmentid': '$_ref_treatmentid',
              '_ref_scheduleid': '$_ref_scheduleid',
              '_ref_casepatinetid': '$_ref_casepatinetid',
              '_ref_patient_userid': '$_ref_patient_userid',
              '_ref_patient_userstoreid': '$_ref_patient_userstoreid',
              '_ref_storeid': '$_ref_storeid',
              '_ref_branchid': '$_ref_branchid',
              'create_date': '$create_date',
              'create_date_string': '$create_date_string',
              'create_time_string': '$create_time_string',
              '_ref_agent_userid_create': '$_ref_agent_userid_create',
              '_ref_agent_userstoreid_create': '$_ref_agent_userstoreid_create',
              'modify_date': '$modify_date',
              'modify_date_string': '$modify_date_string',
              'modify_time_string': '$modify_time_string',
              '_ref_agent_userid_modify': '$_ref_agent_userid_modify',
              '_ref_agent_userstoreid_modify': '$_ref_agent_userstoreid_modify',
              'diagnosis_file': '$diagnosis_file',
              'S': '$S',
              'O': '$O',
              'A': '$A',
              'P': '$P'
            }
          }
        ],
        (err) => { if (err) { callback(err); return; } }
      );

      if (!findTreatment_ProgessionNote) { callback(new Error(`${controllerName}: findTreatment_ProgessionNote have error while aggregate`)); return; }
      else {
        callback(null);
        for (let index = 0; index < findTreatment_ProgessionNote[0].diagnosis_file.length; index++) {
          const change_name_image = '/image_progressionnote/' + data._ref_treatment_progressionnoteid + '/' + findTreatment_ProgessionNote[0].diagnosis_file[index].file_name;
          findTreatment_ProgessionNote[0].diagnosis_file[index].file_name = change_name_image;
        }
        return findTreatment_ProgessionNote;
      }
    }
  }
};

module.exports = Treatment_ProgressionNote_View_Controller;