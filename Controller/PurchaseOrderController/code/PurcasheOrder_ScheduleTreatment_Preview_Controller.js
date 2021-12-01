/**
 * Controller สำหรับ ดู Treatment ผ่าน Schedule เพื่อทำ ใบจ่ายยา Purchase Order (PO)
 */
const PurcasheOrder_ScheduleTreatment_Preview_Controller = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        _ref_agentid: '',
        _ref_scheduleid: '',        
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `PurcasheOrder_TreatmentPreview_Controller`;

    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;
    const checkAgentId = miscController.checkAgentId;
    const Schedule_Check_Status = miscController.Schedule_Check_Status;

    const { checkObjectId, agentModel, treatmentModel, treatmentDetailModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
    else if (typeof data._ref_scheduleid != 'string' || !validateObjectId(data._ref_scheduleid)) { callback(new Error(`${controllerName}: <data._ref_scheduleid> must be String ObjectId`)); return; }
    else {
        const chkAgentid = await checkAgentId(
            {
                _agentid: data._ref_agentid,
                _storeid: data._ref_storeid,
                _branchid: data._ref_branchid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        const _agentid = await checkObjectId(chkAgentid._agentid, (err) => { if (err) { callback(err); return; } });
        const _agentstoreid = await checkObjectId(chkAgentid._agentstoreid, (err) => { if (err) { callback(err); return; } });
        const chkAgnetPermission_Level1 = await agentModel.findOne(
            {
                '_id': _agentid,
                'store._id': _agentstoreid,
                'store.role': 1
            },
            {},
            (err) => { if (err) { callback(err); return; } }
        );

        const chkSchedule = await Schedule_Check_Status(
            {
                _ref_storeid: data._ref_storeid,
                _ref_branchid: data._ref_branchid,
                _ref_scheduleid: data._ref_scheduleid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgentid) { callback(new Error(`${controllerName}: chkAgentid return not found`)); return; }
        else if (!chkAgnetPermission_Level1) { callback(new Error(`${controllerName}: chkAgnetPermission_Level1 return not found`)); return; }
        else if (!chkSchedule) { callback(new Error(`${controllerName}: chkSchedule return not found`)); return; }
        else if (chkSchedule.statusMode !== 4) { callback(new Error(`${controllerName}: chkSchedule have statusMode (${chkSchedule.statusMode}) not equal 4`)); return; }
        else {
            const _ref_scheduleid = await checkObjectId(data._ref_scheduleid, (err) => { if (err) { callback(err); return; } });
            const findTreatment = await treatmentModel.aggregate(
              [
                {
                  '$match': {
                    '_ref_scheduleid': _ref_scheduleid
                  }
                }, {
                  '$lookup': {
                    'from': 'm_agents', 
                    'localField': '_ref_agent_userid_create', 
                    'foreignField': '_id', 
                    'as': 'agent_data_lookup'
                  }
                }, {
                  '$unwind': {
                    'path': '$agent_data_lookup', 
                    'includeArrayIndex': 'agent_data_lookup_index', 
                    'preserveNullAndEmptyArrays': true
                  }
                }, {
                  '$addFields': {
                    'match_agent_create_result': {
                      '$cmp': [
                        '$_ref_agent_userid_create', '$agent_data_lookup._id'
                      ]
                    }
                  }
                }, {
                  '$match': {
                    'match_agent_create_result': {
                      '$eq': 0
                    }
                  }
                }, {
                  '$unwind': {
                    'path': '$agent_data_lookup.store', 
                    'includeArrayIndex': 'agent_data_lookup_store_index', 
                    'preserveNullAndEmptyArrays': true
                  }
                }, {
                  '$addFields': {
                    'match_agent_create_unwind_result': {
                      '$cmp': [
                        '$_ref_agent_userstoreid_create', '$agent_data_lookup.store._id'
                      ]
                    }
                  }
                }, {
                  '$match': {
                    'match_agent_create_unwind_result': {
                      '$eq': 0
                    }
                  }
                }, {
                  '$lookup': {
                    'from': 'l_casepatient', 
                    'localField': '_ref_casepatinetid', 
                    'foreignField': '_id', 
                    'as': 'casepatinet_lookup'
                  }
                }, {
                  '$unwind': {
                    'path': '$casepatinet_lookup', 
                    'includeArrayIndex': 'casepatinet_lookup_index', 
                    'preserveNullAndEmptyArrays': true
                  }
                }, {
                  '$addFields': {
                    'chkCasepatient': {
                      '$cmp': [
                        '$_ref_casepatinetid', '$casepatinet_lookup._id'
                      ]
                    }
                  }
                }, {
                  '$match': {
                    'casepatinet_lookup_index': {
                      '$ne': null
                    }, 
                    'chkCasepatient': {
                      '$eq': 0
                    }
                  }
                }, {
                  '$lookup': {
                    'from': 'm_patients', 
                    'localField': 'casepatinet_lookup._ref_patient_userid', 
                    'foreignField': '_id', 
                    'as': 'patinet_lookup'
                  }
                }, {
                  '$unwind': {
                    'path': '$patinet_lookup', 
                    'includeArrayIndex': 'patinet_lookup_index', 
                    'preserveNullAndEmptyArrays': true
                  }
                }, {
                  '$match': {
                    'patinet_lookup_index': {
                      '$ne': null
                    }
                  }
                }, {
                  '$addFields': {
                    'patinet_userid_match_result': {
                      '$cmp': [
                        '$casepatinet_lookup._ref_patient_userid', '$patinet_lookup._id'
                      ]
                    }
                  }
                }, {
                  '$match': {
                    'patinet_userid_match_result': {
                      '$eq': 0
                    }
                  }
                }, {
                  '$unwind': {
                    'path': '$patinet_lookup.store', 
                    'includeArrayIndex': 'patinet_lookup_store_index', 
                    'preserveNullAndEmptyArrays': true
                  }
                }, {
                  '$addFields': {
                    'patinet_userstoreid_match_result': {
                      '$cmp': [
                        '$casepatinet_lookup._ref_patient_userstoreid', '$patinet_lookup.store._id'
                      ]
                    }
                  }
                }, {
                  '$match': {
                    'patinet_userstoreid_match_result': {
                      '$eq': 0
                    }
                  }
                }, {
                  '$project': {
                    '_id': 0, 
                    'treatment_data': {
                      '_ref_treatmentid': '$_id', 
                      'medical_certificate_th': '$medical_certificate_th', 
                      'medical_certificate_en': '$medical_certificate_en', 
                      'count_product_list': '$count_product_list', 
                      'price_product_list_total': '$price_product_list_total', 
                      'price_product_list_discount': '$price_product_list_discount', 
                      'price_product_list_total_discount': '$price_product_list_total_discount', 
                      'count_course_list': '$count_course_list', 
                      'price_course_list_total': '$price_course_list_total', 
                      'price_course_list_discount': '$price_course_list_discount', 
                      'price_course_list_total_discount': '$price_course_list_total_discount', 
                      'price_total': '$price_total_before', 
                      'price_discount': '$price_discount', 
                      'price_total_discount': '$price_total_after', 
                      'create_date': '$create_date', 
                      'create_date_string': '$create_date_string', 
                      'create_time_string': '$create_time_string', 
                      'modify_date': '$modify_date', 
                      'modify_date_string': '$modify_date_string', 
                      'modify_time_string': '$modify_time_string', 
                      'po_is_modified': '$po_is_modified', 
                      'po_modifier_ref_poid': '$po_modifier_ref_poid'
                    }, 
                    'agent_create_data': {
                      '_ref_agentuserid': '$_ref_agent_userid_create', 
                      '_ref_agentstoreid': '$_ref_agent_userstoreid_create', 
                      'pre_name': '$agent_data_lookup.store.personal.pre_name', 
                      'special_prename': {
                        '$cond': {
                          'if': {
                            '$eq': [
                              '$agent_data_lookup.store.personal.pre_name', 'อื่นๆ'
                            ]
                          }, 
                          'then': {
                            '$ifNull': [
                              '$agent_data_lookup.store.personal.special_prename', null
                            ]
                          }, 
                          'else': null
                        }
                      }, 
                      'first_name': '$agent_data_lookup.store.personal.first_name', 
                      'last_name': '$agent_data_lookup.store.personal.last_name'
                    }, 
                    'patient_data': {
                      '_ref_patientuserid': '$patinet_lookup._id', 
                      '_ref_patientstoreid': '$patinet_lookup.store._id', 
                      'hn': '$patinet_lookup.store.hn', 
                      'hn_ref': '$patinet_lookup.store.hn_ref', 
                      'pre_name': '$patinet_lookup.store.personal.pre_name', 
                      'special_prename': {
                        '$cond': {
                          'if': {
                            '$eq': [
                              '$patinet_lookup.store.personal.pre_name', 'อื่นๆ'
                            ]
                          }, 
                          'then': {
                            '$ifNull': [
                              '$patinet_lookup.store.personal.special_prename', null
                            ]
                          }, 
                          'else': null
                        }
                      }, 
                      'first_name': '$patinet_lookup.store.personal.first_name', 
                      'last_name': '$patinet_lookup.store.personal.last_name', 
                      'birth_date': '$patinet_lookup.store.personal.birth_date', 
                      'age': {
                        '$subtract': [
                          {
                            '$year': new Date()
                          }, {
                            '$year': {
                              '$dateFromString': {
                                'dateString': '$patinet_lookup.store.personal.birth_date', 
                                'format': '%Y/%m/%d'
                              }
                            }
                          }
                        ]
                      }, 
                      'congenital_disease': '$patinet_lookup.store.personal.general_user_detail.congenital_disease'
                    }
                  }
                }
              ],
              (err) => { if (err) { callback(err); return; } }
            );
            
            if (!findTreatment) { callback(new Error(`${controllerName}: findTreatment return not found`)); return; }
            else if (findTreatment.length !== 1) { callback(new Error(`${controllerName}: findTreatment.length (${findTreatment.length}) must return 1 maybe _ref_scheduleid (${_ref_scheduleid})`)); return; }
            else {
              const findTreatmentDetail = await treatmentDetailModel.aggregate(
                [
                    {
                      '$match': {
                        '_ref_treatmentid': findTreatment[0].treatment_data._ref_treatmentid,
                      }
                    }, {
                      '$lookup': {
                        'from': 'm_product', 
                        'localField': '_ref_productid', 
                        'foreignField': '_id', 
                        'as': 'product_data'
                      }
                    }, {
                      '$lookup': {
                        'from': 'm_course', 
                        'localField': '_ref_courseid', 
                        'foreignField': '_id', 
                        'as': 'course_data'
                      }
                    }, {
                      '$project': {
                        '_id': 0, 
                        '_ref_treatmentid': '$_ref_treatmentid', 
                        '_ref_treatment_detailid': '$_id', 
                        '_ref_productid': '$_ref_productid', 
                        'product_name': {
                          '$cond': {
                            'if': {
                              '$ifNull': [
                                '$_ref_productid', null
                              ]
                            }, 
                            'then': {
                              '$arrayElemAt': [
                                '$product_data.product_name', 0
                              ]
                            }, 
                            'else': null
                          }
                        }, 
                        'product_count': '$count_product', 
                        'product_price': '$price_product', 
                        'product_price_total': '$price_product_total', 
                        'product_remark': '$remark_product', 
                        '_ref_courseid': '$_ref_courseid', 
                        'course_name': {
                          '$cond': {
                            'if': {
                              '$ifNull': [
                                '$_ref_courseid', null
                              ]
                            }, 
                            'then': {
                              '$arrayElemAt': [
                                '$course_data.name', 0
                              ]
                            }, 
                            'else': null
                          }
                        }, 
                        'course_count': '$count_course', 
                        'course_price': '$price_course', 
                        'course_price_total': '$price_course_total', 
                        'course_remark': '$remark_course'
                      }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
              );
              if (!findTreatmentDetail) { callback(new Error(`${controllerName}: findTreatmentDetail return not found`)); return; }
              else {
                  callback(null);
                  return {
                      treatment_data: findTreatment[0],
                      treatment_detail_data: findTreatmentDetail
                  };
              }
            }
        }
    }
};

module.exports = PurcasheOrder_ScheduleTreatment_Preview_Controller;