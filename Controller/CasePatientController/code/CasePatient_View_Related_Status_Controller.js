/**
 * Controller สำหรับ ดู Status ส่วน Treatment, Next Visit Treatment, Progression Note และ Purchase Order ของ CasePatient
 */
const CasePatient_View_Related_Status_Controller = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agentid: '',
        _ref_casepatientid: '',
        skip: 0,
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `CasePatient_View_Related_Status_Controller`;

    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const checkAgentId = miscController.checkAgentId;

    const mongodbController = require('../../mongodbController');
    const casePatient_StatusModel = mongodbController.casePatient_StatusModel;
    const ObjectId = mongodbController.ObjectId;

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
    else if (typeof data._ref_casepatientid != 'string' || !validateObjectId(data._ref_casepatientid)) { callback(new Error(`${controllerName}: <data._ref_casepatientid> must be String ObjectId`)); return; }
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
            const findCasePatientStatus = await casePatient_StatusModel.aggregate(
                [
                    {
                      '$match': {
                        '_ref_storeid': ObjectId(data._ref_storeid), 
                        '_ref_branchid': ObjectId(data._ref_branchid), 
                        '_ref_casepatientid': ObjectId(data._ref_casepatientid)
                      }
                    }, {
                      '$addFields': {
                        'chkTreatment': {
                          '$cond': {
                            'if': {
                              '$eq': [
                                '$_ref_treatmentid', null
                              ]
                            }, 
                            'then': false, 
                            'else': true
                          }
                        }, 
                        'chkTPGN': {
                          '$cond': {
                            'if': {
                              '$eq': [
                                '$_ref_treatment_progressionnoteid', null
                              ]
                            }, 
                            'then': false, 
                            'else': true
                          }
                        }
                      }
                    }, {
                      '$sort': {
                        'chkTreatment': 1, 
                        'chkTPGN': 1, 
                        '_id': -1, 
                        '_ref_casepatientid': -1, 
                        'isnextvisited': -1
                      }
                    }, {
                        '$skip': Math.floor(Math.abs(Number(data.skip)))
                    }, {
                      '$project': {
                        '_id': 0, 
                        '_ref_storeid': '$_ref_storeid', 
                        '_ref_branchid': '$_ref_branchid', 
                        '_ref_casepatientid': '$_ref_casepatientid', 
                        '_ref_treatmentid': '$_ref_treatmentid', 
                        '_ref_treatment_progressionnoteid': '$_ref_treatment_progressionnoteid', 
                        '_ref_poid': '$_ref_poid'
                      }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );

            if (!findCasePatientStatus) { callback(new Error(`${controllerName}: findCasePatientStatus have error during aggregate`)); return; }
            else {
                try {
                    const mapResult = findCasePatientStatus.map(
                        (where, index) => (
                            {
                                run_index: index + 1,
                                _ref_storeid: ObjectId(where._ref_storeid),
                                _ref_branchid: ObjectId(where._ref_branchid),
                                _ref_casepatientid: ObjectId(where._ref_casepatientid),
                                _ref_treatmentid: (!where._ref_treatmentid) ? null:ObjectId(where._ref_treatmentid),
                                _ref_treatment_progressionnoteid: (!where._ref_treatment_progressionnoteid) ? null:ObjectId(where._ref_treatment_progressionnoteid),
                                _ref_poid: (!where._ref_poid) ? null:ObjectId(where._ref_poid),
                            }
                        )
                    );
    
                    callback(null);
                    return mapResult;

                } catch (error) {
                    callback(error);
                    return;
                }
            }
        }
    }
};

module.exports = CasePatient_View_Related_Status_Controller;