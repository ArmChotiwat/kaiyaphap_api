/**
 * Controller สำหรับ ดูใบ PO
 */
const PurchaseOrder_View_Controller = async (
  data = {
    _ref_storeid: '',
    _ref_branchid: '',
    _ref_agentid: '',
    _ref_poid: '',
  },
  callback = (err = new Error) => { }
) => {
  const controllerName = `PurchaseOrder_View_Controller`;

  const miscController = require('../../miscController');
  const validateObjectId = miscController.validateObjectId;
  const checkAgentId = miscController.checkAgentId;

  if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
  else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
  else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
  else if (typeof data._ref_agentid != 'string' || !validateObjectId(data._ref_agentid)) { callback(new Error(`${controllerName}: <data._ref_agentid> must be String ObjectId`)); return; }
  else if (typeof data._ref_poid != 'string' || !validateObjectId(data._ref_poid)) { callback(new Error(`${controllerName}: <data._ref_poid> must be String ObjectId`)); return; }
  else {
    const chkAgentId = await checkAgentId(
      {
        _storeid: data._ref_storeid,
        _branchid: data._ref_branchid,
        _agentid: data._ref_agentid
      },
      (err) => { if (err) { callback(err); return; } }
    );

    if (!chkAgentId) { callback(new Error(`${controllerName}: chkAgentId return not found`)); return; }
    if (chkAgentId.role !== 1) { callback(new Error(`${controllerName}: chkAgentId.role (${chkAgentId.role}) not equal 1`)); return; }
    else {
      const { checkObjectId, purchaseOrderModel, purchaseOrderDetailModel } = require('../../mongodbController');

      const _ref_poid = await checkObjectId(data._ref_poid, (err) => { if (err) { callback(err); return; } });

      if (!_ref_poid) { callback(new Error(`${controllerName}: _ref_poid convert ObjectId failed`)); return; }
      else {
        const findPurchaseOrderHeader = await purchaseOrderModel.aggregate(
          [
            {
              '$match': {
                '_id': _ref_poid,
                '_ref_storeid': chkAgentId._storeid,
                '_ref_branchid': chkAgentId._branchid,
                'isclosed': false,
                'istruncated': false
              }
            }, {
              '$lookup': {
                'from': 'l_casepatient',
                'localField': '_ref_casepatinetid',
                'foreignField': '_id',
                'as': 'casepatient_lookup'
              }
            }, {
              '$unwind': {
                'path': '$casepatient_lookup'
              }
            }, {
              '$lookup': {
                'from': 'm_patients',
                'localField': 'casepatient_lookup._ref_patient_userid',
                'foreignField': '_id',
                'as': 'patient_lookup'
              }
            }, {
              '$unwind': {
                'path': '$patient_lookup'
              }
            }, {
              '$unwind': {
                'path': '$patient_lookup.store'
              }
            }, {
              '$addFields': {
                'match_patient_userid': {
                  '$cmp': [
                    '$patient_lookup._id', '$casepatient_lookup._ref_patient_userid'
                  ]
                },
                'match_patient_storeid': {
                  '$cmp': [
                    '$patient_lookup.store._id', '$casepatient_lookup._ref_patient_userstoreid'
                  ]
                }
              }
            }, {
              '$match': {
                'match_patient_userid': {
                  '$eq': 0
                },
                'match_patient_storeid': {
                  '$eq': 0
                }
              }
            }, {
              '$lookup': {
                'from': 'l_treatment',
                'localField': '_ref_treatmentid',
                'foreignField': '_id',
                'as': 'treatment_lookup'
              }
            }, {
              '$unwind': {
                'path': '$treatment_lookup'
              }
            }, {
              '$lookup': {
                'from': 'm_agents',
                'localField': 'treatment_lookup._ref_agent_userid_create',
                'foreignField': '_id',
                'as': 'agent_treatment_lookup'
              }
            }, {
              '$unwind': {
                'path': '$agent_treatment_lookup'
              }
            }, {
              '$unwind': {
                'path': '$agent_treatment_lookup.store'
              }
            }, {
              '$addFields': {
                'match_treatment_agent_userid': {
                  '$cmp': [
                    '$agent_treatment_lookup._id', '$treatment_lookup._ref_agent_userid_create'
                  ]
                },
                'match_treatment_agent_storeid': {
                  '$cmp': [
                    '$agent_treatment_lookup.store._id', '$treatment_lookup._ref_agent_userstoreid_create'
                  ]
                }
              }
            }, {
              '$match': {
                'match_treatment_agent_userid': {
                  '$eq': 0
                },
                'match_treatment_agent_storeid': {
                  '$eq': 0
                }
              }
            }, {
              '$lookup': {
                'from': 'm_agents',
                'localField': '_ref_agent_userid_create',
                'foreignField': '_id',
                'as': 'agent_po_lookup'
              }
            }, {
              '$unwind': {
                'path': '$agent_po_lookup'
              }
            }, {
              '$unwind': {
                'path': '$agent_po_lookup.store'
              }
            }, {
              '$addFields': {
                'match_po_agent_userid': {
                  '$cmp': [
                    '$agent_po_lookup._id', '$_ref_agent_userid_create'
                  ]
                },
                'match_po_storeid': {
                  '$cmp': [
                    '$agent_po_lookup.store._id', '$_ref_agent_userstoreid_create'
                  ]
                }
              }
            }, {
              '$match': {
                'match_po_agent_userid': {
                  '$eq': 0
                },
                'match_po_storeid': {
                  '$eq': 0
                }
              }
            }, {
              '$lookup': {
                'from': 'm_agents',
                'localField': 'casepatient_lookup._ref_agent_userid',
                'foreignField': '_id',
                'as': 'agent_caspatient_lookup'
              }
            }, {
              '$unwind': {
                'path': '$agent_caspatient_lookup'
              }
            }, {
              '$unwind': {
                'path': '$agent_caspatient_lookup.store'
              }
            }, {
              '$addFields': {
                'match_casepatient_agent_userid': {
                  '$cmp': [
                    '$agent_caspatient_lookup._id', '$casepatient_lookup._ref_agent_userid'
                  ]
                },
                'match_casepatient_agent_storeid': {
                  '$cmp': [
                    '$agent_caspatient_lookup.store._id', '$casepatient_lookup._ref_agent_userstoreid'
                  ]
                }
              }
            }, {
              '$match': {
                'match_casepatient_agent_userid': {
                  '$eq': 0
                },
                'match_casepatient_agent_storeid': {
                  '$eq': 0
                }
              }
            }, {
              '$lookup': {
                'from': 'ar_treatment',
                'localField': 'treatment_lookup._id',
                'foreignField': '_ref_original_treatmentid',
                'as': 'ar_treatment_lookup'
              }
            }, {
              '$unwind': {
                'path': '$ar_treatment_lookup'
              }
            }, {
              '$lookup': {
                'from': 'm_stores',
                'localField': '_ref_storeid',
                'foreignField': '_id',
                'as': 'm_stores'
              }
            }, {
              '$unwind': {
                'path': '$m_stores'
              }
            }, {
              '$addFields': {
                'match_ar_treatmentid': {
                  '$cmp': [
                    '$ar_treatment_lookup._ref_original_treatmentid', '$treatment_lookup._id'
                  ]
                }
              }
            }, {
              '$addFields': {
                'text': '$m_stores.address.tax_id'
              }
            }, {
              '$match': {
                'match_ar_treatmentid': {
                  '$eq': 0
                }
              }
            }, {
              '$project': {
                '_id': 0,
                'po_data': {
                  '_ref_poid': '$_id',
                  'run_po': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          {
                            '$ifNull': [
                              '$run_po', false
                            ]
                          }, false
                        ]
                      },
                      'then': null,
                      'else': '$run_po'
                    }
                  },
                  '_ref_agent_userid_po_create': '$_ref_agent_userid_create',
                  '_ref_agent_userstoreid_create': '$_ref_agent_userstoreid_create',
                  'agent_po_prename': '$agent_po_lookup.store.personal.pre_name',
                  'agent_po_special_prename': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$agent_po_lookup.store.personal.pre_name', 'อื่นๆ'
                        ]
                      },
                      'then': {
                        '$ifNull': [
                          '$agent_po_lookup.store.personal.special_prename', null
                        ]
                      },
                      'else': null
                    }
                  },
                  'agent_po_firstname': '$agent_po_lookup.store.personal.first_name',
                  'agent_po_lastname': '$agent_po_lookup.store.personal.last_name',
                  'count_product_list': '$count_product_list',
                  'price_product_list_total': '$price_product_list_total',
                  'price_product_list_discount': '$price_product_list_discount',
                  'price_product_list_total_discount': '$price_product_list_total_discount',
                  'count_course_list': '$count_course_list',
                  'price_course_list_total': '$price_course_list_total',
                  'price_course_list_discount': '$price_course_list_discount',
                  'price_course_list_total_discount': '$price_course_list_total_discount',
                  'price_total_before': '$price_total_before',
                  'price_discount': '$price_discount',
                  'price_total_after': '$price_total_after',
                  'create_date': '$create_date',
                  'create_date_string': '$create_date_string',
                  'create_time_string': '$create_time_string',
                  'ispaid': '$ispaid',
                  'paid_type' : '$paid_type'
                },
                'treatment_data': {
                  '_ref_treatmentid': '$treatment_lookup._id',
                  'medical_certificate_th': '$treatment_lookup.medical_certificate_th',
                  'medical_certificate_en': '$treatment_lookup.medical_certificate_en',
                  '_ref_treatment_agent_userid_create': '$treatment_lookup._ref_agent_userid_create',
                  '_ref_treatment_agent_userstoreid_create': '$treatment_lookup._ref_agent_userstoreid_create',
                  'agent_treatment_prename': '$agent_treatment_lookup.store.personal.pre_name',
                  'agent_treatment_special_prename': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$agent_treatment_lookup.store.personal.pre_name', 'อื่นๆ'
                        ]
                      },
                      'then': {
                        '$ifNull': [
                          '$agent_treatment_lookup.store.personal.special_prename', null
                        ]
                      },
                      'else': null
                    }
                  },
                  'agent_treatment_firstname': '$agent_treatment_lookup.store.personal.first_name',
                  'agent_treatment_lastname': '$agent_treatment_lookup.store.personal.last_name',
                  'agent_treatment_certificate': '$agent_treatment_lookup.store.personal.certificate',
                  'agent_tretment_price_history': {
                    'price_product_list_total': '$ar_treatment_lookup.price_product_list_total',
                    'price_product_list_discount': '$ar_treatment_lookup.price_product_list_discount',
                    'price_product_list_total_discount': '$ar_treatment_lookup.price_product_list_total_discount',
                    'price_course_list_total': '$ar_treatment_lookup.price_course_list_total',
                    'price_course_list_discount': '$ar_treatment_lookup.price_course_list_discount',
                    'price_course_list_total_discount': '$ar_treatment_lookup.price_course_list_total_discount',
                    'price_total_before': '$ar_treatment_lookup.price_total_before',
                    'price_discount': '$ar_treatment_lookup.price_discount',
                    'price_total_after': '$ar_treatment_lookup.price_total_after'
                  }
                },
                'casepatient_data': {
                  '_ref_store_casepatientid': '$casepatient_lookup._id',
                  '_ref_casemaintypeid': '$casepatient_lookup._ref_casemaintypeid',
                  '_ref_imd_casemaintypeid': '$casepatient_lookup._ref_reftcasemaintypeid',
                  'case_main_typename': '$casepatient_lookup._casemaintypename',
                  '_ref_casesubtypeid': '$casepatient_lookup._ref_casesubtypeid',
                  '_ref_imd_casesubtypeid': '$casepatient_lookup._ref_reftcasesubtypeid',
                  'case_sub_typename': '$casepatient_lookup._casesubtypename',
                  'case_number_store': '$casepatient_lookup.case_number_store',
                  'case_number_branch': '$casepatient_lookup.case_number_branch',
                  'create_date': '$casepatient_lookup.create_date',
                  'create_date_string': '$casepatient_lookup.create_date_string',
                  'create_time_string': '$casepatient_lookup.create_time_string',
                  '_ref_agent_userid_casepatient_create': '$casepatient_lookup._ref_agent_userid',
                  '_ref_agent_userstoreid_casepatient_create': '$casepatient_lookup._ref_agent_userstoreid',
                  'agent_casepatient_prename': '$agent_caspatient_lookup.store.personal.pre_name',
                  'agent_casepatient_special_prename': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$agent_caspatient_lookup.store.personal.pre_name', 'อื่นๆ'
                        ]
                      },
                      'then': {
                        '$ifNull': [
                          '$agent_caspatient_lookup.store.personal.special_prename', null
                        ]
                      },
                      'else': null
                    }
                  },
                  'agent_casepatient_firstname': '$agent_caspatient_lookup.store.personal.first_name',
                  'agent_casepatient_lastname': '$agent_caspatient_lookup.store.personal.last_name',
                  'agent_casepatient_certificate': '$agent_caspatient_lookup.store.personal.certificate'
                },
                'patient_data': {
                  'hn': '$patient_lookup.store.hn',
                  'patient_prename': '$patient_lookup.store.personal.pre_name',
                  'patientt_special_prename': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$patient_lookup.store.personal.pre_name', 'อื่นๆ'
                        ]
                      },
                      'then': {
                        '$ifNull': [
                          '$patient_lookup.store.personal.special_prename', null
                        ]
                      },
                      'else': null
                    }
                  },
                  'patient_firstname': '$patient_lookup.store.personal.first_name',
                  'patient_lastname': '$patient_lookup.store.personal.last_name',
                  'birth_date': '$patient_lookup.store.personal.birth_date',
                  'age': {
                    '$subtract': [
                      {
                        '$year': new Date('Mon, 21 Sep 2020 02:12:58 GMT')
                      }, {
                        '$year': {
                          '$dateFromString': {
                            'dateString': '$patient_lookup.store.personal.birth_date',
                            'format': '%Y/%m/%d'
                          }
                        }
                      }
                    ]
                  },
                  'congenital_disease': '$patient_lookup.store.personal.general_user_detail.congenital_disease',
                  'medication_privilege': '$patient_lookup.store.personal.medication_privilege'
                },
                'text': '$text'
              }
            }
          ],
          (err) => { if (err) { callback(err); return; } }
        );

        const findPurchaseOrderDetail = await purchaseOrderDetailModel.aggregate(
          [
            {
              '$match': {
                '_ref_poid': _ref_poid,
                '_ref_storeid': chkAgentId._storeid,
                '_ref_branchid': chkAgentId._branchid,
                'ispaid': true,
                'isclosed': false,
                'istruncated': false
              }
            }, {
              '$lookup': {
                'from': 'm_product',
                'localField': '_ref_productid',
                'foreignField': '_id',
                'as': 'product_lookup'
              }
            }, {
              '$lookup': {
                'from': 'm_course',
                'localField': '_ref_courseid',
                'foreignField': '_id',
                'as': 'course_lookup'
              }
            }, {
              '$project': {
                '_id': 0,
                '_ref_poid': '$_ref_poid',
                '_ref_po_detailid': '$_id',
                'run_number': '$run_number',
                '_ref_productid': '$_ref_productid',
                'product_name': {
                  '$cond': {
                    'if': {
                      '$eq': [
                        '$_ref_productid', null
                      ]
                    },
                    'then': null,
                    'else': {
                      '$arrayElemAt': [
                        '$product_lookup.product_name', 0
                      ]
                    }
                  }
                },
                'product_count': '$product_count',
                'product_price': '$product_price',
                'product_price_total': '$product_price_total',
                'product_remark': '$product_remark',
                '_ref_courseid': '$_ref_courseid',
                'course_name': {
                  '$cond': {
                    'if': {
                      '$eq': [
                        '$_ref_courseid', null
                      ]
                    },
                    'then': null,
                    'else': {
                      '$arrayElemAt': [
                        '$course_lookup.name', 0
                      ]
                    }
                  }
                },
                'course_count': '$course_count',
                'course_price': '$course_price',
                'course_price_total': '$course_price_total',
                'course_remark': '$course_remark',
                'ispaid': '$ispaid',
                'isclosed': '$isclosed',
                'istruncated': '$istruncated'
              }
            }
          ],
          (err) => { if (err) { callback(err); return; } }
        );

        if (!findPurchaseOrderHeader) { callback(new Error(`${controllerName}: findPurchaseOrderHeader have error`)); return; }
        else if (findPurchaseOrderHeader.length !== 1) { callback(new Error(`${controllerName}: findPurchaseOrderHeader have document (${findPurchaseOrderHeader.length}) not equal 1`)); return; }
        if (!findPurchaseOrderDetail) { callback(new Error(`${controllerName}: findPurchaseOrderDetail have error`)); return; }
        else {
          callback(null);
          return {
            po_header: findPurchaseOrderHeader[0],
            podetail: findPurchaseOrderDetail,
          };
        }
      }
    }
  }
};

module.exports = PurchaseOrder_View_Controller;