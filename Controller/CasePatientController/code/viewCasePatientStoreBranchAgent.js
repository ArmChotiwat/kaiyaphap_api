const casePatientModel = require('../../../Model/CasePatientModel');

const viewCasePatientStoreBranchAgentController = async (
   data = {
      _storeid: new String(''),
      _branchid: new String(''),
      _agentid: new String(''),
      _patientid: new String('')
   },
   callback = (err = new Error) => { }
) => {
   const miscController = require('../../miscController');
   const checkAgentId = miscController.checkAgentId;
   const checkPatientId = miscController.checkPatientId
   const casePatinetModel = require('../../mongodbController').casePatientModel;

   if (typeof data != 'object') { callback(new Error(`viewCasePatientStoreBranchAgentController: <data> must be Object`)); return; }
   else if (typeof data._storeid != 'string') { callback(new Error(`viewCasePatientStoreBranchAgentController: <data._storeid> must be String and Not Empty`)); return; }
   else if (typeof data._branchid != 'string') { callback(new Error(`viewCasePatientStoreBranchAgentController: <data._branchid> must be String and Not Empty`)); return; }
   else if (typeof data._agentid != 'string') { callback(new Error(`viewCasePatientStoreBranchAgentController: <data._agentid> must be String and Not Empty`)); return; }
   else if (typeof data._patientid != 'string') { callback(new Error(`viewCasePatientStoreBranchAgentController: <data._patientid> must be String and Not Empty`)); return; }
   else {

      const chkAgent = await checkAgentId(
         {
            _storeid: data._storeid,
            _branchid: data._branchid,
            _agentid: data._agentid
         },
         (err) => { if (err) { callback(err); return; } }
      );

      const chkPatient = await checkPatientId(
         {
            _storeid: data._storeid,
            _patientid: data._patientid
         },
         (err) => { if (err) { callback(err); return; } }
      );



      if (!chkAgent || !chkPatient) { callback(new Error(`Agent Or Patient Not Found`)); return; }
      else {

         const cerent_date_now = async () => {
            const cerent_date = await casePatientModel.aggregate(
               [
                  {
                     '$match': {
                        '_ref_storeid': chkAgent._storeid,
                        '_ref_branchid': chkAgent._branchid,
                        // '_ref_agent_userid': chkAgent._agentid,
                        '_ref_patient_userid': chkPatient._patientid,
                        'istruncated': false
                     }
                  }, {
                     '$lookup': {
                        'from': 'l_treatment',
                        'localField': '_id',
                        'foreignField': '_ref_casepatinetid',
                        'as': 'l_treatment'
                     }
                  }, {
                     '$unwind': {
                        'path': '$l_treatment',
                        'includeArrayIndex': 'index_l_treatment',
                        'preserveNullAndEmptyArrays': true
                     }
                  }, {
                     '$group': {
                        '_id': '$_id',
                        'date': {
                           '$push': {
                              'date': '$l_treatment.create_date_string',
                              'time': '$l_treatment.create_time_string'
                           }
                        }
                     }
                  }
               ],
               (err) => { if (err) { callback(err); return; } }
            );
            if (!cerent_date) { callback(new Error(`viewCasePatientStoreBranchAgentController: cerent_date Error`)); return; }
            else if (cerent_date.length === 0) { callback(null); return cerent_date; }
            else {
               let data = [];

               for (let index = 0; index < cerent_date.length; index++) {
                  cerent_date[index].date.sort((a, b) => (a.date > b.date) ? 1 : (a.date === b.date) ? ((a.time > b.time) ? 1 : -1) : -1);
                  const cerent_date_last_date = cerent_date[index].date[cerent_date[index].date.length - 1].date
                  const cerent_date_last_time = cerent_date[index].date[cerent_date[index].date.length - 1].time
                  if (!cerent_date_last_date && !cerent_date_last_time) {
                     data.push({
                        _id: '',
                        date: null,
                        time: null
                     });
                  } else if (cerent_date_last_date && cerent_date_last_time) {
                     data.push({
                        _id: cerent_date[index]._id,
                        date: cerent_date_last_date.toString(),
                        time: cerent_date_last_time.toString()
                     }

                     );
                  } else if (cerent_date_last_date && !cerent_date_last_time) {
                     data.push({
                        _id: cerent_date[index]._id,
                        date: cerent_date_last_date.toString(),
                        time: null
                     }

                     );
                  } else if (!cerent_date_last_date && cerent_date_last_time) {
                     data.push({
                        _id: cerent_date[index]._id,
                        date: null,
                        time: cerent_date_last_time.toString()
                     }

                     );
                  } else {
                     data.push({
                        _id: '',
                        date: null,
                        time: null
                     }

                     );
                  }
               };
               return data;
            }

         };

         let findCasePatient = await casePatinetModel.aggregate(
            [
               {
                  '$match': {
                     '_ref_storeid': chkAgent._storeid,
                     '_ref_branchid': chkAgent._branchid,
                     // '_ref_agent_userid': chkAgent._agentid,
                     '_ref_patient_userid': chkPatient._patientid,
                     'istruncated': false
                  }
               }, {
                  '$lookup': {
                     'from': 'l_casepatient_pd',
                     'localField': '_id',
                     'foreignField': '_ref_casepatinetid',
                     'as': 'patient_pd'
                  }
               }, {
                  '$unwind': {
                     'path': '$patient_pd',
                     'includeArrayIndex': 'index_patient_pd',
                     'preserveNullAndEmptyArrays': true
                  }
               }, {
                  '$lookup': {
                     'from': 'st_casepatient',
                     'localField': '_id',
                     'foreignField': '_ref_casepatientid',
                     'as': 'st_casepatient'
                  }
               }, {
                  '$unwind': {
                     'path': '$st_casepatient',
                     'includeArrayIndex': 'index_st_casepatient',
                     'preserveNullAndEmptyArrays': true
                  }
               }, {
                  '$project': {
                     '_id': 1,
                     'case_number_branch': 1,
                     '_ref_casemaintypeid': 1,
                     '_casemaintypename': 1,
                     '_ref_casesubtypeid': 1,
                     '_casesubtypename': 1,
                     'create_date_string': 1,
                     'create_time_string': 1,
                     'isclosed': 1,
                     'create_date': 1,
                     'modify_date_string': 1,
                     'modify_time_string': 1,
                     'isnextvisited': '$st_casepatient.isnextvisited',
                     'have_first_time_treatment': {
                        '$cond': {
                           'if': {
                              '$or': [
                                 {
                                    '$eq': [
                                       '$index_st_casepatient', null
                                    ]
                                 }, {
                                    '$and': [
                                       {
                                          '$eq': [
                                             '$st_casepatient._ref_treatmentid', null
                                          ]
                                       }, {
                                          '$eq': [
                                             '$st_casepatient.isnextvisited', false
                                          ]
                                       }
                                    ]
                                 }
                              ]
                           },
                           'then': false,
                           'else': true
                        }
                     },
                     'body_name': []
                  }
               }, {
                  '$sort': {
                     'isclosed': -1,
                     'create_date': -1,
                     'run_number_branch': 1
                  }
               }
            ],
            (err) => { if (err) { callback(err); return; } }
         );

         if (!findCasePatient) { callback(new Error(`viewCasePatientStoreBranchAgentController: findCasePatient Error`)); return; }
         else if (findCasePatient.length === 0) { callback(null); return findCasePatient; }
         else {
            const find_body_name = await casePatinetModel.aggregate(
               [
                  {
                     '$match': {
                        '_ref_storeid': chkAgent._storeid,
                        '_ref_branchid': chkAgent._branchid,
                        // '_ref_agent_userid': chkAgent._agentid,
                        '_ref_patient_userid': chkPatient._patientid,
                        'istruncated': false
                     }
                  }, {
                     '$lookup': {
                        'from': 'l_casepatient_stage_2',
                        'localField': '_id',
                        'foreignField': '_ref_casepatinetid',
                        'as': 'l_casepatient_stage_2'
                     }
                  }, {
                     '$unwind': {
                        'path': '$l_casepatient_stage_2',
                        'includeArrayIndex': 'index_l_casepatient_stage_2',
                        'preserveNullAndEmptyArrays': true
                     }
                  }, {
                     '$project': {
                        'data_stage2': {
                           '$switch': {
                              'branches': [
                                 {
                                    'case': {
                                       '$eq': [
                                          '$index_l_casepatient_stage_2', null
                                       ]
                                    },
                                    'then': null
                                 }, {
                                    'case': {
                                       '$ne': [
                                          '$l_casepatient_stage_2.stage2data', null
                                       ]
                                    },
                                    'then': '$l_casepatient_stage_2.stage2data'
                                 }, {
                                    'case': {
                                       '$ne': [
                                          '$l_casepatient_stage_2.stage2data_neuro', null
                                       ]
                                    },
                                    'then': '$l_casepatient_stage_2.stage2data_neuro'
                                 }
                              ],
                              'default': null
                           }
                        }
                     }
                  }, {
                     '$unwind': {
                        'path': '$data_stage2.body_chart',
                        'includeArrayIndex': 'index_data_stage2_body_chart',
                        'preserveNullAndEmptyArrays': true
                     }
                  }, {
                     '$addFields': {
                        'stage2data_neuro': {
                           '$switch': {
                              'branches': [
                                 {
                                    'case': {
                                       '$ne': [
                                          '$data_stage2.hemi', null
                                       ]
                                    },
                                    'then': '$data_stage2.hemi'
                                 }, {
                                    'case': {
                                       '$ne': [
                                          '$data_stage2.para', null
                                       ]
                                    },
                                    'then': '$data_stage2.para'
                                 }, {
                                    'case': {
                                       '$ne': [
                                          '$data_stage2.full', null
                                       ]
                                    },
                                    'then': '$data_stage2.full'
                                 }
                              ],
                              'default': null
                           }
                        }
                     }
                  }, {
                     '$addFields': {
                        'body_name': {
                           '$cond': {
                              'if': {
                                 '$ne': [
                                    '$index_data_stage2_body_chart', null
                                 ]
                              },
                              'then': '$data_stage2.body_chart.body_name',
                              'else': '$stage2data_neuro'
                           }
                        }
                     }
                  }, {
                     '$group': {
                        '_id': '$_id',
                        'items': {
                           '$push': '$body_name'
                        }
                     }
                  }
               ],
               (err) => { if (err) { callback(err); return; } }
            );
            if (!find_body_name) { callback(new Error(`viewCasePatientStoreBranchAgentController: find_body_name Error`)); return; }
            else if (find_body_name.length === 0) { callback(null); return findCasePatient; }
            else {
               const cerent_date = await cerent_date_now();
               // console.log(cerent_date);
               for (let index = 0; index < findCasePatient.length; index++) {

                  for (let cerent_date_indexs = 0; cerent_date_indexs < cerent_date.length; cerent_date_indexs++) {
                     if (findCasePatient[index]._id.toString() === cerent_date[cerent_date_indexs]._id.toString()) {
                        findCasePatient[index].modify_date_string = cerent_date[cerent_date_indexs].date.toString();
                        findCasePatient[index].modify_time_string = cerent_date[cerent_date_indexs].time.toString();
                     }
                  };

                  for (let indexs = 0; indexs < find_body_name.length; indexs++) {
                     if (findCasePatient[index]._id.toString() === find_body_name[indexs]._id.toString()) {
                        findCasePatient[index].body_name = find_body_name[indexs].items
                     }
                  };

               }
               callback(null);
               return findCasePatient;
            }

         }
      }
   }

};

module.exports = viewCasePatientStoreBranchAgentController;
