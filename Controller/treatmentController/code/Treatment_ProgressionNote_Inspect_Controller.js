/**
 * Controller สำหรับ ส่อง Progression Note
 */
const Treatment_ProgressionNote_Inspect_Controller = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agentid: '',
        _ref_treatment_progressionnoteid: ''
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `Treatment_ProgressionNote_Inspect_Controller`;

    const { validate_String_AndNotEmpty, validateObjectId, checkAgentId } = require('../../miscController');

    const { ObjectId, treatment_ProgressionNoteModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_String_AndNotEmpty(data._ref_storeid) || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_String_AndNotEmpty(data._ref_branchid) || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!validate_String_AndNotEmpty(data._ref_agentid) || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
    else if (!validate_String_AndNotEmpty(data._ref_treatment_progressionnoteid) || !validateObjectId(data._ref_treatment_progressionnoteid)) { callback(new Error(`${controllerName}: <data._ref_treatment_progressionnoteid> must be String ObjectId`)); return; }
    else {
        const chkAgentId = await checkAgentId(
            {
                _agentid: data._ref_agentid,
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid,
            },
            (err) => { if (err) { callback(err); return; } }
        );

        const findTreatmentPGN = await treatment_ProgressionNoteModel.aggregate(
            [
                {
                  '$match': {
                    '_id': ObjectId(data._ref_treatment_progressionnoteid), 
                    '_ref_storeid': ObjectId(data._ref_storeid), 
                    '_ref_branchid': ObjectId(data._ref_branchid)
                  }
                }, {
                  '$lookup': {
                    'from': 'm_agents', 
                    'localField': '_ref_agent_userid_create', 
                    'foreignField': '_id', 
                    'as': 'lookup_agent'
                  }
                }, {
                  '$unwind': {
                    'path': '$lookup_agent', 
                    'includeArrayIndex': 'lookup_agent_index', 
                    'preserveNullAndEmptyArrays': true
                  }
                }, {
                  '$unwind': {
                    'path': '$lookup_agent.store', 
                    'includeArrayIndex': 'lookup_agent_store_index', 
                    'preserveNullAndEmptyArrays': true
                  }
                }, {
                  '$addFields': {
                    'chkAgentId': {
                      '$cmp': [
                        '$_ref_agent_userid_create', '$lookup_agent._id'
                      ]
                    }, 
                    'chkAgentStoreId': {
                      '$cmp': [
                        '$_ref_agent_userstoreid_create', '$lookup_agent.store._id'
                      ]
                    }
                  }
                }, {
                  '$match': {
                    'lookup_agent_index': {
                      '$ne': null
                    }, 
                    'lookup_agent_store_index': {
                      '$ne': null
                    }, 
                    'chkAgentId': {
                      '$eq': 0
                    }, 
                    'chkAgentStoreId': {
                      '$eq': 0
                    }
                  }
                }, {
                  '$limit': 1
                }, {
                  '$project': {
                    'run_number': '$run_number', 
                    '_ref_treatmentid': '$_ref_treatmentid', 
                    '_ref_scheduleid': '$_ref_scheduleid', 
                    '_ref_casepatinetid': '$_ref_casepatinetid', 
                    '_ref_patient_userid': '$_ref_patient_userid', 
                    '_ref_patient_userstoreid': '$_ref_patient_userstoreid', 
                    'S': '$S', 
                    'O': '$O', 
                    'A': '$A', 
                    'P': '$P', 
                    'create_date': '$create_date', 
                    'create_date_string': '$create_date_string', 
                    'create_time_string': '$create_time_string', 
                    '_ref_agent_userid_create': '$_ref_agent_userid_create', 
                    '_ref_agent_userstoreid_create': '$_ref_agent_userstoreid_create', 
                    'agent_pre_name': '$lookup_agent.store.personal.pre_name', 
                    'agent_special_pre_name': {
                      '$cond': {
                        'if': {
                          '$eq': [
                            '$lookup_agent.store.personal.pre_name', 'อื่นๆ'
                          ]
                        }, 
                        'then': '$lookup_agent.store.personal.special_prename', 
                        'else': null
                      }
                    }, 
                    'agent_first_name': '$lookup_agent.store.personal.first_name', 
                    'agent_last_name': '$lookup_agent.store.personal.last_name', 
                    'diagnosis_file_type': '$diagnosis_file_type', 
                    'diagnosis_file': '$diagnosis_file'
                  }
                }
            ],
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgentId) { callback(new Error(`${controllerName}: chkAgentId return not found`)); return; }
        else if (chkAgentId.role !== 1 && chkAgentId.role !== 2) { callback(new Error(`${controllerName}: chkAgentId.role (${chkAgentId.role}) not equal 1 or 2`)); return; }
        else if (!findTreatmentPGN) { callback(new Error(`${controllerName} findTreatmentPGN have error during aggregate`)); return; }
        else {
            callback(null);
            for (let index = 0; index < findTreatmentPGN[0].diagnosis_file.length; index++) {
              const change_name_image = '/image_progressionnote/' + data._ref_treatment_progressionnoteid + '/' + findTreatmentPGN[0].diagnosis_file[index].file_name;
              findTreatmentPGN[0].diagnosis_file[index].file_name = change_name_image;
            }
            return findTreatmentPGN;
        }  
    }
};

module.exports = Treatment_ProgressionNote_Inspect_Controller;

