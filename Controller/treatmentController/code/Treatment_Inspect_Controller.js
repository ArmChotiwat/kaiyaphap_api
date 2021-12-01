/**
 * Controller สำหรับ ส่อง FirstTime/NextVisit Treatment
 */
const Treatment_Inspect_Controller = async (
  data = {
    _ref_storeid: '',
    _ref_branchid: '',
    _ref_agentid: '',
    _ref_treatmentid: '',
  },
  callback = (err = new Error) => { }
) => {
  const controllerName = `Treatment_Inspect_Controller`;

  const { validate_StringObjectId_NotNull, checkAgentId } = require('../../miscController');
  const { ObjectId, treatmentModel } = require('../../mongodbController');

  if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
  else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
  else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
  else if (!validate_StringObjectId_NotNull(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
  else if (!validate_StringObjectId_NotNull(data._ref_treatmentid)) { callback(new Error(`${controllerName}: <data._ref_treatmentid> must be String ObjectId`)); return; }
  else {
    const chkAgent = await checkAgentId(
      {
        _storeid: data._ref_storeid,
        _branchid: data._ref_branchid,
        _agentid: data._ref_agentid
      },
      (err) => { if (err) { callback(err); return; } }
    );

    if (!chkAgent) { callback(new Error(`${controllerName}: chkAgent return not found`)); return; }
    if (chkAgent.role !== 1 && chkAgent.role !== 2) { callback(new Error(`${controllerName}: chkAgent.role (${chkAgent.role}) not equal 1 or 2`)); return; }

    const findTreatment = await treatmentModel.aggregate(
      [
        {
          '$match': {
            '_id': ObjectId(data._ref_treatmentid),
            '_ref_storeid': ObjectId(data._ref_storeid),
            '_ref_branchid': ObjectId(data._ref_branchid),
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
          '$match': {
            'agent_data_lookup_index': {
              '$ne': null
            }
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
          '$match': {
            'agent_data_lookup_store_index': {
              '$ne': null
            }
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
            'path': '$casepatinet_lookup'
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
            'includeArrayIndex': 'patinet_lookup_store',
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
          '$lookup': {
            'from': 'l_treatment_detail',
            'localField': '_id',
            'foreignField': '_ref_treatmentid',
            'as': 'lookup_treatment_detail'
          }
        }, {
          '$unwind': {
            'path': '$lookup_treatment_detail',
            'includeArrayIndex': 'lookup_treatment_detail_index',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'm_product',
            'localField': 'lookup_treatment_detail._ref_productid',
            'foreignField': '_id',
            'as': 'm_product'
          }
        }, {
          '$unwind': {
            'path': '$m_product',
            'includeArrayIndex': 'm_product_indexs',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'm_course',
            'localField': 'lookup_treatment_detail._ref_courseid',
            'foreignField': '_id',
            'as': 'm_course'
          }
        }, {
          '$unwind': {
            'path': '$m_course',
            'includeArrayIndex': 'm_course_indexs',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$addFields': {
            'lookup_treatment_detail.product_name': {
              '$cond': {
                'if': {
                  '$eq': [
                    '$m_product_indexs', null
                  ]
                },
                'then': null,
                'else': '$m_product.product_name'
              }
            },
            'lookup_treatment_detail.course_name': {
              '$cond': {
                'if': {
                  '$eq': [
                    '$m_course_indexs', null
                  ]
                },
                'then': null,
                'else': '$m_course.name'
              }
            }
          }
        }, {
          '$project': {
            '_id': '$_id',
            'treatment_data': {
              '_ref_treatmentid': '$_id',
              '_ref_scheduleid': '$_ref_scheduleid',
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
            'treatment_detail_data': '$lookup_treatment_detail',
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
                    '$year': new Date('Mon, 02 Nov 2020 01:56:20 GMT')
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
        }, {
          '$group': {
            '_id': '$_id',
            'treatment_data': {
              '$push': '$treatment_data'
            },
            'treatment_detail_data': {
              '$push': '$treatment_detail_data'
            },
            'agent_create_data': {
              '$push': '$agent_create_data'
            },
            'patient_data': {
              '$push': '$patient_data'
            }
          }
        }, {
          '$unwind': {
            'path': '$treatment_data',
            'includeArrayIndex': 'treatment_data_index2',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$unwind': {
            'path': '$agent_create_data',
            'includeArrayIndex': 'agent_create_data_index2',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$unwind': {
            'path': '$patient_data',
            'includeArrayIndex': 'patient_data_index2',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$match': {
            'patient_data_index2': 0,
            'agent_create_data_index2': 0,
            'treatment_data_index2': 0
          }
        }
      ],
      (err) => { if (err) { callback(err); return; } }
    );

    if (!findTreatment) { callback(new Error(`${controllerName}: findTreatment have error during aggregate`)); return; }
    else if (findTreatment.length !== 1) { callback(new Error(`${controllerName}: Length of findTreatment (${findTreatment.length}) not equal 1`)); return; }
    else {
      callback(null);
      return findTreatment[0];
    }
  }
};

module.exports = Treatment_Inspect_Controller;