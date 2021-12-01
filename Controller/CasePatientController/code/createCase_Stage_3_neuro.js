const casePatinetCreateStage3_Neuro_Controller = async (
   data = {
      _storeid: '',
      _branchid: '',
      _agentid: '',
      _patientid: '',
      _casepatientid: '',
      _data_stage_3_neuro: {}
   },
   callback = (err = new Err) => { }
) => {
   if (typeof data != 'object') { callback(new Error(`casePatinetCreateStage3_Neuro_Controller: <data> must be Object`)); }
   else if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`casePatinetCreateStage3_Neuro_Controller: <data._storeid> must be String and Not Empty`)); return; }
   else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`casePatinetCreateStage3_Neuro_Controller: <data._branchid> must be String and Not Empty`)); return; }
   else if (typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`casePatinetCreateStage3_Neuro_Controller: <data._agentid> must be String and Not Empty`)); return; }
   else if (typeof data._patientid != 'string' || data._patientid == '') { callback(new Error(`casePatinetCreateStage3_Neuro_Controller: <data._patientid> must be String and Not Empty`)); return; }
   else if (typeof data._casepatientid != 'string' || data._casepatientid == '') { callback(new Error(`casePatinetCreateStage3_Neuro_Controller: <data._casepatientid> must be String and Not Empty`)); return; }
   else if (typeof data._data_stage_3_neuro != 'object') { callback(new Error(`casePatinetCreateStage3_Neuro_Controller: <data._data_stage_3_neuro> must be Object`)); return; }
   else if (typeof data._data_stage_3_neuro._ref_casepatinetid != 'string' || data._data_stage_3_neuro._ref_casepatinetid == '' || data._data_stage_3_neuro._ref_casepatinetid != data._casepatientid) {
      callback(new Error(`casePatinetCreateStage3_Neuro_Controller: <data._data_stage_3_neuro._ref_casepatinetid> must be String and Not Empty and data._data_stage_3_neuro._ref_casepatinetid === data._casepatientid`));
      return;
   }
   else {      
      const moment = require('moment');
      const miscController = require('../../miscController');
      const checkCasePatientProgress = miscController.checkCasePatientProgress;
      const mongodbController = require('../../mongodbController');

      const create_date = moment();
      const create_date_string = create_date.format('YYYY-MM-DD');
      const create_time_string = create_date.format('HH:mm:ss');

      const modify_date = create_date;
      const modify_date_string = create_date.format('YYYY-MM-DD');
      const modify_time_string = create_date.format('HH:mm:ss');

      const _data_stage_3_neuro = data._data_stage_3_neuro;

      const chkCaseProgress = await checkCasePatientProgress(
         {
            _storeid: data._storeid,
            _branchid: data._branchid,
            _agentid: data._agentid,
            _patientid: data._patientid,
            _casepatientid: data._casepatientid
         },
         (err) => { if (err) { callback(err); return; } }
      );

      if (!chkCaseProgress.casePatientId) {
         callback(new Error('casePatinetCreateStage3_Neuro_Controller: data-casePatientId-not-exists'));
         return;
      }
      else if (!chkCaseProgress.casePatientPersonalDetailId) {
         callback(new Error('casePatinetCreateStage3_Neuro_Controller: data-casePatientPersonalDetailId-not-exists'));
         return;
      }
      else if (chkCaseProgress.casePatientStage3Id) {
         callback(new Error('casePatinetCreateStage3_Neuro_Controller: data-casePatientStage3Id-exists'));
         return;
      }
      else {

         /**
          * @param {String} dataName 
          * @param {null|String} dataInput 
          */
         const mapNR_StringOrNullandNotEmpty = async (dataName, dataInput) => {
            if (typeof dataName !== 'string' || dataName === '' || dataName === null) {
               throw new Error(`mapST3OG_StringAndNull: ${dataName}: must be String and Not Empty`);
            }
            else {
               if (miscController.validate_StringOrNull_AndNotEmpty(dataInput) === false) {
                  throw new Error(`dataName : ${dataName}, dataInput : <(${dataInput})>, must be String/Null`);
               } else {
                  return dataInput;
               }
            }
         };


         /**
          * @param {String} dataName 
          * @param {null|Number} dataInput 
          */
         const mapNR_NumberOrNullandNotEmpty = async (dataName, dataInput) => {
            if (typeof dataName !== 'string' || dataName === '' || dataName === null) {
               throw new Error(`mapST3OG_StringAndNull: ${dataName}: must be String and Not Empty`);
            }
            else {
               if (dataInput === null) {
                  return null;
               } else if (typeof dataInput == 'number') {
                  return Number(dataInput);
               } else {
                  throw new Error(`dataName : ${dataName}, dataInput : <(${dataInput})>, must be Number/Null`);
               }
            }
         };

         /**
          * @param {String} dataName 
          * @param {[""]} dataInput 
          */
         const mapNR_Ar_StringOrNullandNotEmpty = async (dataName, dataInput) => {
            if (typeof dataName !== 'string' || dataName === '' || dataName === null) {
               throw new Error(`mapST3OG_StringAndNull ${dataName} : must be String and Not Empty`);
            }
            else {
               if (Array.isArray(dataInput) === false) {
                  throw new Error(`${dataName}: must be Array`);
               } else {
                  if (dataInput.length > 0) {
                     for (let index = 0; index < dataInput.length; index++) {
                        if (miscController.validate_StringOrNull_AndNotEmpty(dataInput[index]) === false) {
                           throw new Error(`dataName : ${dataName}, dataInput : <(${dataInput})>, must be String/Null`);
                        }
                     }
                     return dataInput;
                  } else {
                     return dataInput;
                  }
               }
            };
         };

         const fn_Functional_assessment_Right = async () => {
            if (Array.isArray(_data_stage_3_neuro.Functional_assessment_Right) === false) {
               throw new Error(`${_data_stage_3_neuro.Functional_assessment_Right}: must be Array`);
            } else {
               if (_data_stage_3_neuro.Functional_assessment_Right.length > 0) {
                  for (let index = 0; index < _data_stage_3_neuro.Functional_assessment_Right.length; index++) {
                     await mapNR_StringOrNullandNotEmpty('Functional_assessment_Right.name', _data_stage_3_neuro.Functional_assessment_Right[index].name);
                     await mapNR_StringOrNullandNotEmpty('Functional_assessment_Right.FA_Right_Drop', _data_stage_3_neuro.Functional_assessment_Right[index].FA_Right_Drop);
                     await mapNR_StringOrNullandNotEmpty('Functional_assessment_Right.comment', _data_stage_3_neuro.Functional_assessment_Right[index].comment);
                  }
                  return _data_stage_3_neuro.Functional_assessment_Right;
               } else {
                  return _data_stage_3_neuro.Functional_assessment_Right;
               }

            }
         }

         const fn_Functional_assessment_Left = async () => {
            if (Array.isArray(_data_stage_3_neuro.Functional_assessment_Left) === false) {
               throw new Error(`${_data_stage_3_neuro.Functional_assessment_Left}: must be Array`);
            } else {
               if (_data_stage_3_neuro.Functional_assessment_Left.length > 0) {
                  for (let index = 0; index < _data_stage_3_neuro.Functional_assessment_Left.length; index++) {
                     await mapNR_StringOrNullandNotEmpty('Functional_assessment_Left.name', _data_stage_3_neuro.Functional_assessment_Left[index].name);
                     await mapNR_StringOrNullandNotEmpty('Functional_assessment_Left.FA_Right_Drop', _data_stage_3_neuro.Functional_assessment_Left[index].FA_Right_Drop);
                     await mapNR_StringOrNullandNotEmpty('Functional_assessment_Left.comment', _data_stage_3_neuro.Functional_assessment_Left[index].comment);
                  };
                  return _data_stage_3_neuro.Functional_assessment_Left; 
               } else {
                  return _data_stage_3_neuro.Functional_assessment_Left;
               }

            }
         }

         const fn_Functional_assessment = async () => {
            if (Array.isArray(_data_stage_3_neuro.Functional_assessment) === false) {
               throw new Error(`${_data_stage_3_neuro.Functional_assessment}: must be Array`);
            } else {
               if (_data_stage_3_neuro.Functional_assessment.length > 0) {
                  for (let index = 0; index < _data_stage_3_neuro.Functional_assessment.length; index++) {
                     await mapNR_StringOrNullandNotEmpty('Functional_assessment.name', _data_stage_3_neuro.Functional_assessment[index].name);
                     await mapNR_StringOrNullandNotEmpty('Functional_assessment.FA_Right_Drop', _data_stage_3_neuro.Functional_assessment[index].FA_Right_Drop);
                     await mapNR_StringOrNullandNotEmpty('Functional_assessment.comment', _data_stage_3_neuro.Functional_assessment[index].comment);
                  };
                  return _data_stage_3_neuro.Functional_assessment;
               } else {
                  return _data_stage_3_neuro.Functional_assessment;
               }

            }
         }

         const fn_specialtest = async () => {
            if (Array.isArray(_data_stage_3_neuro.specialtest) === false) {
               throw new Error(`${_data_stage_3_neuro.specialtest}: must be Array`);
            } else {
               if (_data_stage_3_neuro.specialtest.length > 0) {
                  for (let index = 0; index < _data_stage_3_neuro.specialtest.length; index++) {
                     await mapNR_StringOrNullandNotEmpty('specialtest.name', _data_stage_3_neuro.specialtest[index].name);
                     await mapNR_StringOrNullandNotEmpty('specialtest.select', _data_stage_3_neuro.specialtest[index].select);
                     await mapNR_StringOrNullandNotEmpty('specialtest.remark', _data_stage_3_neuro.specialtest[index].remark);
                  };
                  return _data_stage_3_neuro.specialtest;
               } else {
                  return _data_stage_3_neuro.specialtest;
               }

            }
         }

         let mapStage3_nuero = null;
         try {
            mapStage3_nuero = {
               _ref_casepatinetid: _data_stage_3_neuro._ref_casepatinetid,

               create_date: create_date,
               create_date_string: create_date_string,
               create_time_string: create_time_string,

               modify_date: modify_date,
               modify_date_string: modify_date_string,
               modify_time_string: modify_time_string,

               stage3data_nuero: {
                  bp: await mapNR_StringOrNullandNotEmpty('bp', _data_stage_3_neuro.bp),
                  hr: await mapNR_NumberOrNullandNotEmpty('hr', _data_stage_3_neuro.hr),
                  o2sat: await mapNR_NumberOrNullandNotEmpty('o2sat', _data_stage_3_neuro.o2sat),
                  consciousness: await mapNR_Ar_StringOrNullandNotEmpty('consciousness', _data_stage_3_neuro.consciousness),
                  gcs: await mapNR_StringOrNullandNotEmpty('gcs', _data_stage_3_neuro.gcs),
                  gcsV: await mapNR_StringOrNullandNotEmpty('gcsV', _data_stage_3_neuro.gcsV),
                  gcsM: await mapNR_StringOrNullandNotEmpty('gcsM', _data_stage_3_neuro.gcsM),
                  bodybuilt: await mapNR_Ar_StringOrNullandNotEmpty('bodybuilt', _data_stage_3_neuro.bodybuilt),
                  bmi: await mapNR_NumberOrNullandNotEmpty('bmi', _data_stage_3_neuro.bmi),
                  ambulation: await mapNR_Ar_StringOrNullandNotEmpty('ambulation', _data_stage_3_neuro.ambulation),
                  vision: await mapNR_StringOrNullandNotEmpty('vision', _data_stage_3_neuro.vision,),
                  visionright: await mapNR_StringOrNullandNotEmpty('visionright', _data_stage_3_neuro.visionright,),
                  hearing: await mapNR_StringOrNullandNotEmpty('hearing', _data_stage_3_neuro.hearing,),
                  hearingright: await mapNR_StringOrNullandNotEmpty('hearingright', _data_stage_3_neuro.hearingright,),
                  neglect: await mapNR_StringOrNullandNotEmpty('neglect', _data_stage_3_neuro.neglect,),
                  neglectright: await mapNR_StringOrNullandNotEmpty('neglectright', _data_stage_3_neuro.neglectright,),
                  posture: await mapNR_Ar_StringOrNullandNotEmpty('posture', _data_stage_3_neuro.posture),
                  posture_comment: await mapNR_StringOrNullandNotEmpty('posture_comment', _data_stage_3_neuro.posture_comment),
						chest_shape: await mapNR_Ar_StringOrNullandNotEmpty('chest_shape', _data_stage_3_neuro.chest_shape),
						breathing: await mapNR_Ar_StringOrNullandNotEmpty('breathing', _data_stage_3_neuro.breathing),
						breathing_other: await mapNR_StringOrNullandNotEmpty('breathing_other', _data_stage_3_neuro.breathing_other),
                  acessory: await mapNR_StringOrNullandNotEmpty('acessory', _data_stage_3_neuro.acessory),
                  acessory_comment: await mapNR_StringOrNullandNotEmpty('acessory_comment', _data_stage_3_neuro.acessory_comment),
                  skincolor: await mapNR_StringOrNullandNotEmpty('skincolor', _data_stage_3_neuro.skincolor),
                  clubbing: await mapNR_StringOrNullandNotEmpty('clubbing', _data_stage_3_neuro.clubbing),
                  peripheral: await mapNR_StringOrNullandNotEmpty('peripheral', _data_stage_3_neuro.peripheral),
                  lncisionline: await mapNR_StringOrNullandNotEmpty('lncisionline', _data_stage_3_neuro.lncisionline),
                  lncisionline_comment: await mapNR_StringOrNullandNotEmpty('lncisionline_comment', _data_stage_3_neuro.lncisionline_comment),
                  cough: await mapNR_StringOrNullandNotEmpty('cough', _data_stage_3_neuro.cough),
                  sputum: await mapNR_StringOrNullandNotEmpty('sputum', _data_stage_3_neuro.sputum),
                  sputum_color: await mapNR_StringOrNullandNotEmpty('sputum_color', _data_stage_3_neuro.sputum_color),
                  devices: await mapNR_Ar_StringOrNullandNotEmpty('devices', _data_stage_3_neuro.devices),
                  l_min: await mapNR_NumberOrNullandNotEmpty('l_min', _data_stage_3_neuro.l_min),
                  devices_comment: await mapNR_StringOrNullandNotEmpty('devices_comment', _data_stage_3_neuro.devices_comment),
                  rom_active_right: await mapNR_StringOrNullandNotEmpty('rom_active_right', _data_stage_3_neuro.rom_active_right),
                  rom_active_left: await mapNR_StringOrNullandNotEmpty('rom_active_left', _data_stage_3_neuro.rom_active_left),
                  rom_passive_right: await mapNR_StringOrNullandNotEmpty('rom_passive_right', _data_stage_3_neuro.rom_passive_right),
                  rom_passive_left: await mapNR_StringOrNullandNotEmpty('rom_passive_left', _data_stage_3_neuro.rom_passive_left),
                  musclestrength_right: await mapNR_StringOrNullandNotEmpty('musclestrength_right', _data_stage_3_neuro.musclestrength_right),
                  musclestrength_left: await mapNR_StringOrNullandNotEmpty('musclestrength_left', _data_stage_3_neuro.musclestrength_left),
                  musclelength_right: await mapNR_StringOrNullandNotEmpty('musclelength_right', _data_stage_3_neuro.musclelength_right),
                  musclelength_left: await mapNR_StringOrNullandNotEmpty('musclelength_left', _data_stage_3_neuro.musclelength_left),
                  muscletone_right: await mapNR_StringOrNullandNotEmpty('muscletone_right', _data_stage_3_neuro.muscletone_right),
                  muscletone_left: await mapNR_StringOrNullandNotEmpty('muscletone_left', _data_stage_3_neuro.muscletone_left),
                  data_USE_rigth: {
                     lighttouch: await mapNR_StringOrNullandNotEmpty('data_USE_rigth.lighttouch', _data_stage_3_neuro.data_USE_rigth.lighttouch),
                     light_comment: await mapNR_StringOrNullandNotEmpty('data_USE_rigth.light_comment', _data_stage_3_neuro.data_USE_rigth.light_comment),
                     pinprick_RU: await mapNR_StringOrNullandNotEmpty('data_USE_rigth.pinprick_RU', _data_stage_3_neuro.data_USE_rigth.pinprick_RU),
                     pinprick_comment_UR: await mapNR_StringOrNullandNotEmpty('data_USE_rigth.pinprick_comment_UR', _data_stage_3_neuro.data_USE_rigth.pinprick_comment_UR),
                     proprioception_RU: await mapNR_StringOrNullandNotEmpty('data_USE_rigth.proprioception_RU', _data_stage_3_neuro.data_USE_rigth.proprioception_RU),
                     proprioception_comment_RU: await mapNR_StringOrNullandNotEmpty('data_USE_rigth.proprioception_comment_RU', _data_stage_3_neuro.data_USE_rigth.proprioception_comment_RU),
                     temperature: await mapNR_StringOrNullandNotEmpty('data_USE_rigth.temperature', _data_stage_3_neuro.data_USE_rigth.temperature),
                     temperature_comment: await mapNR_StringOrNullandNotEmpty('data_USE_rigth.temperature_comment', _data_stage_3_neuro.data_USE_rigth.temperature_comment)
                  },
                  data_Use_left: {
                     lighttouch_UL: await mapNR_StringOrNullandNotEmpty('data_Use_left.lighttouch_UL', _data_stage_3_neuro.data_Use_left.lighttouch_UL),
                     light_comment_UL: await mapNR_StringOrNullandNotEmpty('data_Use_left.light_comment_UL', _data_stage_3_neuro.data_Use_left.light_comment_UL),
                     pinprick_UL: await mapNR_StringOrNullandNotEmpty('data_Use_left.pinprick_UL', _data_stage_3_neuro.data_Use_left.pinprick_UL),
                     pinprick_comment__UL: await mapNR_StringOrNullandNotEmpty('data_Use_left.pinprick_comment__UL', _data_stage_3_neuro.data_Use_left.pinprick_comment__UL),
                     proprioception_UL: await mapNR_StringOrNullandNotEmpty('data_Use_left.proprioception_UL', _data_stage_3_neuro.data_Use_left.proprioception_UL),
                     proprioception_comment_UL: await mapNR_StringOrNullandNotEmpty('data_Use_left.proprioception_comment_UL', _data_stage_3_neuro.data_Use_left.proprioception_comment_UL),
                     temperature__UL: await mapNR_StringOrNullandNotEmpty('data_Use_left.temperature__UL', _data_stage_3_neuro.data_Use_left.temperature__UL),
                     temperature_comment_UL: await mapNR_StringOrNullandNotEmpty('data_Use_left.temperature_comment_UL', _data_stage_3_neuro.data_Use_left.temperature_comment_UL)
                  },
                  data_Les_right: {
                     lighttouch_LR: await mapNR_StringOrNullandNotEmpty('data_Les_right.lighttouch_LR', _data_stage_3_neuro.data_Les_right.lighttouch_LR),
                     light_comment_LR: await mapNR_StringOrNullandNotEmpty('data_Les_right.light_comment_LR', _data_stage_3_neuro.data_Les_right.light_comment_LR),
                     pinprick_LR: await mapNR_StringOrNullandNotEmpty('data_Les_right.pinprick_LR', _data_stage_3_neuro.data_Les_right.pinprick_LR),
                     pinprick_comment_LR: await mapNR_StringOrNullandNotEmpty('data_Les_right.pinprick_comment_LR', _data_stage_3_neuro.data_Les_right.pinprick_comment_LR),
                     proprioception_LR: await mapNR_StringOrNullandNotEmpty('data_Les_right.proprioception_LR', _data_stage_3_neuro.data_Les_right.proprioception_LR),
                     proprioception_comment_LR: await mapNR_StringOrNullandNotEmpty('data_Les_right.proprioception_comment_LR', _data_stage_3_neuro.data_Les_right.proprioception_comment_LR),
                     temperature_LR: await mapNR_StringOrNullandNotEmpty('data_Les_right.temperature_LR', _data_stage_3_neuro.data_Les_right.temperature_LR),
                     temperature_comment_LR: await mapNR_StringOrNullandNotEmpty('data_Les_right.temperature_comment_LR', _data_stage_3_neuro.data_Les_right.temperature_comment_LR)
                  },
                  data_Les_left: {
                     lighttouch_LL: await mapNR_StringOrNullandNotEmpty('data_Les_left.lighttouch_LL', _data_stage_3_neuro.data_Les_left.lighttouch_LL),
                     light_comment_LL: await mapNR_StringOrNullandNotEmpty('data_Les_left.light_comment_LL', _data_stage_3_neuro.data_Les_left.light_comment_LL),
                     pinprick_LL: await mapNR_StringOrNullandNotEmpty('data_Les_left.pinprick_LL', _data_stage_3_neuro.data_Les_left.pinprick_LL),
                     pinprick_comment_LL: await mapNR_StringOrNullandNotEmpty('data_Les_left.pinprick_comment_LL', _data_stage_3_neuro.data_Les_left.pinprick_comment_LL),
                     proprioception_LL: await mapNR_StringOrNullandNotEmpty('data_Les_left.proprioception_LL', _data_stage_3_neuro.data_Les_left.proprioception_LL),
                     proprioception_comment_LL: await mapNR_StringOrNullandNotEmpty('data_Les_left.proprioception_comment_LL', _data_stage_3_neuro.data_Les_left.proprioception_comment_LL),
                     temperature_LL: await mapNR_StringOrNullandNotEmpty('data_Les_left.temperature_LL', _data_stage_3_neuro.data_Les_left.temperature_LL),
                     temperature_comment_LL: await mapNR_StringOrNullandNotEmpty('data_Les_left.temperature_comment_LL', _data_stage_3_neuro.data_Les_left.temperature_comment_LL)
                  },
                  brachioradialis_left: await mapNR_StringOrNullandNotEmpty('brachioradialis_left', _data_stage_3_neuro.brachioradialis_left),
                  brachioradialis_right: await mapNR_StringOrNullandNotEmpty('brachioradialis_right', _data_stage_3_neuro.brachioradialis_right),
                  brachioradialis_comment: await mapNR_StringOrNullandNotEmpty('brachioradialis_comment', _data_stage_3_neuro.brachioradialis_comment),
                  biceps_left: await mapNR_StringOrNullandNotEmpty('biceps_left', _data_stage_3_neuro.biceps_left),
                  biceps_right: await mapNR_StringOrNullandNotEmpty('biceps_right', _data_stage_3_neuro.biceps_right),
                  biceps_comment: await mapNR_StringOrNullandNotEmpty('biceps_comment', _data_stage_3_neuro.biceps_comment),
                  triceps_left: await mapNR_StringOrNullandNotEmpty('triceps_left', _data_stage_3_neuro.triceps_left),
                  triceps_right: await mapNR_StringOrNullandNotEmpty('triceps_right', _data_stage_3_neuro.triceps_right),
                  triceps_comment: await mapNR_StringOrNullandNotEmpty('triceps_comment', _data_stage_3_neuro.triceps_comment),
                  patella_left: await mapNR_StringOrNullandNotEmpty('patella_left', _data_stage_3_neuro.patella_left),
                  patella_right: await mapNR_StringOrNullandNotEmpty('patella_right', _data_stage_3_neuro.patella_right),
                  patella_comment: await mapNR_StringOrNullandNotEmpty('patella_comment', _data_stage_3_neuro.patella_comment),
                  achilles_left: await mapNR_StringOrNullandNotEmpty('achilles_left', _data_stage_3_neuro.achilles_left),
                  achilles_right: await mapNR_StringOrNullandNotEmpty('achilles_right', _data_stage_3_neuro.achilles_right),
                  achilles_comment: await mapNR_StringOrNullandNotEmpty('achilles_comment', _data_stage_3_neuro.achilles_comment),
                  balance_sitting_top: await mapNR_StringOrNullandNotEmpty('balance_sitting_top', _data_stage_3_neuro.balance_sitting_top),
                  balance_sitting_top_comment: await mapNR_StringOrNullandNotEmpty('balance_sitting_top_comment', _data_stage_3_neuro.balance_sitting_top_comment),
                  balance_sitting_bottom: await mapNR_StringOrNullandNotEmpty('balance_sitting_bottom', _data_stage_3_neuro.balance_sitting_bottom),
                  balance_sitting_bottom_comment: await mapNR_StringOrNullandNotEmpty('balance_sitting_bottom_comment', _data_stage_3_neuro.balance_sitting_bottom_comment),
                  balance_standing_top: await mapNR_StringOrNullandNotEmpty('balance_standing_top', _data_stage_3_neuro.balance_standing_top),
                  balance_standing_top_comment: await mapNR_StringOrNullandNotEmpty('balance_standing_top_comment', _data_stage_3_neuro.balance_standing_top_comment),
                  balance_standing_bottom: await mapNR_StringOrNullandNotEmpty('balance_standing_bottom', _data_stage_3_neuro.balance_standing_bottom),
                  balance_standing_bottom_comment: await mapNR_StringOrNullandNotEmpty('balance_standing_bottom_comment', _data_stage_3_neuro.balance_standing_bottom_comment),
                  fingertonose_right: await mapNR_StringOrNullandNotEmpty('fingertonose_right', _data_stage_3_neuro.fingertonose_right),
                  fingertonose_left: await mapNR_StringOrNullandNotEmpty('fingertonose_left', _data_stage_3_neuro.fingertonose_left),
                  heeltoshin_right: await mapNR_StringOrNullandNotEmpty('heeltoshin_right', _data_stage_3_neuro.heeltoshin_right),
                  heeltoshin_left: await mapNR_StringOrNullandNotEmpty('heeltoshin_left', _data_stage_3_neuro.heeltoshin_left),
                  other_right: await mapNR_StringOrNullandNotEmpty('other_right', _data_stage_3_neuro.other_right),
                  other_left: await mapNR_StringOrNullandNotEmpty('other_left', _data_stage_3_neuro.other_left),
                  Functional_assessment_Right: await fn_Functional_assessment_Right(),
                  Functional_assessment_Left: await fn_Functional_assessment_Left(),
                  Functional_assessment: await fn_Functional_assessment(),
                  gaitanalysis: await mapNR_StringOrNullandNotEmpty('gaitanalysis', _data_stage_3_neuro.gaitanalysis),
                  specialtest: await fn_specialtest(),
                  data_Palpation: {
                     dataUpper: {
                        Trachea: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataUpper.Trachea', _data_stage_3_neuro.data_Palpation.dataUpper.Trachea),
                        Symmetry_list: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataUpper.Symmetry_list', _data_stage_3_neuro.data_Palpation.dataUpper.Symmetry_list),
                        Commentmovement: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataUpper.Commentmovement', _data_stage_3_neuro.data_Palpation.dataUpper.Commentmovement),
                        Rightcm: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataUpper.Rightcm', _data_stage_3_neuro.data_Palpation.dataUpper.Rightcm),
                        Leftcm: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataUpper.Leftcm', _data_stage_3_neuro.data_Palpation.dataUpper.Leftcm),
                        commentexpansion: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataUpper.commentexpansion', _data_stage_3_neuro.data_Palpation.dataUpper.commentexpansion),
                        right: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataUpper.right', _data_stage_3_neuro.data_Palpation.dataUpper.right),
                        left: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataUpper.left', _data_stage_3_neuro.data_Palpation.dataUpper.left),
                        TractileComment_list: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataUpper.TractileComment_list', _data_stage_3_neuro.data_Palpation.dataUpper.TractileComment_list),
                        Expand: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataUpper.Expand', _data_stage_3_neuro.data_Palpation.dataUpper.Expand)
                     },
                     dataMiddle: {
                        Trachea_M: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataMiddle.Trachea_M', _data_stage_3_neuro.data_Palpation.dataMiddle.Trachea_M),
                        Symmetry_list_MD: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataMiddle.Symmetry_list_MD', _data_stage_3_neuro.data_Palpation.dataMiddle.Symmetry_list_MD),
                        Expand_M: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataMiddle.Expand_M', _data_stage_3_neuro.data_Palpation.dataMiddle.Expand_M),
                        Commentmovement_M: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataMiddle.Commentmovement_M', _data_stage_3_neuro.data_Palpation.dataMiddle.Commentmovement_M),
                        Rightcm_M: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataMiddle.Rightcm_M', _data_stage_3_neuro.data_Palpation.dataMiddle.Rightcm_M),
                        Leftcm_M: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataMiddle.Leftcm_M', _data_stage_3_neuro.data_Palpation.dataMiddle.Leftcm_M),
                        commentexpansion_M: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataMiddle.commentexpansion_M', _data_stage_3_neuro.data_Palpation.dataMiddle.commentexpansion_M),
                        right_M: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataMiddle.right_M', _data_stage_3_neuro.data_Palpation.dataMiddle.right_M),
                        left_M: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataMiddle.left_M', _data_stage_3_neuro.data_Palpation.dataMiddle.left_M),
                        TractileComment_list_M: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataMiddle.TractileComment_list_M', _data_stage_3_neuro.data_Palpation.dataMiddle.TractileComment_list_M)
                     },
                     dataLower: {
                        Trachea_L: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataLower.Trachea_L', _data_stage_3_neuro.data_Palpation.dataLower.Trachea_L),
                        Symmetry_list_L: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataLower.Symmetry_list_L', _data_stage_3_neuro.data_Palpation.dataLower.Symmetry_list_L),
                        Expand_L: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataLower.Expand_L', _data_stage_3_neuro.data_Palpation.dataLower.Expand_L),
                        Commentmovement_L: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataLower.Commentmovement_L', _data_stage_3_neuro.data_Palpation.dataLower.Commentmovement_L),
                        Rightcm_L: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataLower.Rightcm_L', _data_stage_3_neuro.data_Palpation.dataLower.Rightcm_L),
                        Leftcm_L: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataLower.Leftcm_L', _data_stage_3_neuro.data_Palpation.dataLower.Leftcm_L),
                        commentexpansion_L: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataLower.commentexpansion_L', _data_stage_3_neuro.data_Palpation.dataLower.commentexpansion_L),
                        right_L: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataLower.right_L', _data_stage_3_neuro.data_Palpation.dataLower.right_L),
                        left_L: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataLower.left_L', _data_stage_3_neuro.data_Palpation.dataLower.left_L),
                        TractileComment_list_L: await mapNR_StringOrNullandNotEmpty('data_Palpation.dataLower.TractileComment_list_L', _data_stage_3_neuro.data_Palpation.dataLower.TractileComment_list_L)
                     }
                  },
                  dataPercussionnote: {
                     upper_right: await mapNR_StringOrNullandNotEmpty('dataPercussionnote.upper_right', _data_stage_3_neuro.dataPercussionnote.upper_right),
                     upper_left: await mapNR_StringOrNullandNotEmpty('dataPercussionnote.upper_left', _data_stage_3_neuro.dataPercussionnote.upper_left),
                     middle_right: await mapNR_StringOrNullandNotEmpty('dataPercussionnote.middle_right', _data_stage_3_neuro.dataPercussionnote.middle_right),
                     middle_left: await mapNR_StringOrNullandNotEmpty('dataPercussionnote.middle_left', _data_stage_3_neuro.dataPercussionnote.middle_left),
                     lower_right: await mapNR_StringOrNullandNotEmpty('dataPercussionnote.lower_right', _data_stage_3_neuro.dataPercussionnote.lower_right),
                     lower_left: await mapNR_StringOrNullandNotEmpty('dataPercussionnote.lower_left', _data_stage_3_neuro.dataPercussionnote.lower_left)
                  },
                  dataBreathsounds: {
                     upper_Breath_right: await mapNR_StringOrNullandNotEmpty('dataBreathsounds.upper_Breath_right', _data_stage_3_neuro.dataBreathsounds.upper_Breath_right),
                     upper_Breath_left: await mapNR_StringOrNullandNotEmpty('dataBreathsounds.upper_Breath_left', _data_stage_3_neuro.dataBreathsounds.upper_Breath_left),
                     middle_Breath_right: await mapNR_StringOrNullandNotEmpty('dataBreathsounds.middle_Breath_right', _data_stage_3_neuro.dataBreathsounds.middle_Breath_right),
                     middle_Breath_left: await mapNR_StringOrNullandNotEmpty('dataBreathsounds.middle_Breath_left', _data_stage_3_neuro.dataBreathsounds.middle_Breath_left),
                     lower_Breath_right: await mapNR_StringOrNullandNotEmpty('dataBreathsounds.lower_Breath_right', _data_stage_3_neuro.dataBreathsounds.lower_Breath_right),
                     lower_Breath_left: await mapNR_StringOrNullandNotEmpty('dataBreathsounds.lower_Breath_left', _data_stage_3_neuro.dataBreathsounds.lower_Breath_left)
                  },
                  dataGoal: {
                     longtermgoal: await mapNR_StringOrNullandNotEmpty('dataGoal.longtermgoal', _data_stage_3_neuro.dataGoal.longtermgoal),
                     shorttermgoal: await mapNR_StringOrNullandNotEmpty('dataGoal.shorttermgoal', _data_stage_3_neuro.dataGoal.shorttermgoal)
                  },
                  _ref_pt_diagnosisid: (await miscController.checkPtDiagnosis(_data_stage_3_neuro._ref_pt_diagnosisid, (err) => { if (err) { throw err; } }))._ref_pt_diagnosisid,
                  pt_diagnosis: (await miscController.checkPtDiagnosis(_data_stage_3_neuro._ref_pt_diagnosisid, (err) => { if (err) { throw err; } })).name,//{ type: String, required: true },
                  pt_diagnosis_other: await mapNR_StringOrNullandNotEmpty('pt_diagnosis_other', _data_stage_3_neuro.pt_diagnosis_other),//{ type: String, default: null },
               }
            }
         } catch (error) {
            callback(error);
            return;
         }

         if (mapStage3_nuero) {
            const mapStage3 = {
               _ref_casepatinetid: mapStage3_nuero._ref_casepatinetid,

               create_date: mapStage3_nuero.create_date,
               create_date_string: mapStage3_nuero.create_date_string,
               create_time_string: mapStage3_nuero.create_time_string,

               modify_date: mapStage3_nuero.modify_date,
               modify_date_string: mapStage3_nuero.modify_date_string,
               modify_time_string: mapStage3_nuero.modify_time_string,

               stage3data: {
                  ortho: null,
                  neuro: mapStage3_nuero.stage3data_nuero
               }
            };            
            const casePatientStage3Model = mongodbController.casePatientStage3Model;
            const stage3Model = new casePatientStage3Model(mapStage3);

            const transactionSave = await stage3Model.save()
               .then(
                  result => { return result; }
               )
               .catch(
                  err => {
                     callback(err);
                     return;
                  }
               );

            callback(null);
            return transactionSave;
         }
         else {
            callback(`casePatinetCreateStage3_Ortho_Upper_Controller: not found mapStage3_nuero Variable`);
            return;
         }
      }
   }
};

module.exports = casePatinetCreateStage3_Neuro_Controller;