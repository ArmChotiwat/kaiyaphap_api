const casePatinetCreateStage3_Ortho_TrunkSpine_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _patientid: new String(''),
        _casepatientid: new String(''),
        _data_stage_3_OTS: new Object()
    },
    callback = (err = new Err) => { }
) => {
    if (typeof data != 'object') { callback(new Error(`casePatinetCreateStage3_Ortho_TrunkSpine_Controller: <data> must be Object`)); }
    else if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_TrunkSpine_Controller: <data._storeid> must be String and Not Empty`)); return; }
    else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_TrunkSpine_Controller: <data._branchid> must be String and Not Empty`)); return; }
    else if (typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_TrunkSpine_Controller: <data._agentid> must be String and Not Empty`)); return; }
    else if (typeof data._patientid != 'string' || data._patientid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_TrunkSpine_Controller: <data._patientid> must be String and Not Empty`)); return; }
    else if (typeof data._casepatientid != 'string' || data._casepatientid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_TrunkSpine_Controller: <data._casepatientid> must be String and Not Empty`)); return; }
    else if (typeof data._data_stage_3_OTS != 'object') { callback(new Error(`casePatinetCreateStage3_Ortho_TrunkSpine_Controller: <data._data_stage_2> must be Object`)); return; }
    else if (typeof data._data_stage_3_OTS._ref_casepatinetid != 'string' || data._data_stage_3_OTS._ref_casepatinetid == '' || data._data_stage_3_OTS._ref_casepatinetid != data._casepatientid) {
        callback(new Error(`casePatinetCreateStage3_Ortho_TrunkSpine_Controller: <data._data_stage_2._ref_casepatinetid> must be String and Not Empty and data._data_stage_2._ref_casepatinetid === data._casepatientid`));
        return;
    }
    else {
        const moment = require('moment');
        const miscController = require('../../miscController');
        const validate_String_AndNotEmpty = miscController.validate_String_AndNotEmpty;
        const validate_StringOrNull_AndNotEmpty = miscController.validate_StringOrNull_AndNotEmpty;
        const checkCasePatientProgress = miscController.checkCasePatientProgress;
        const mongodbController = require('../../mongodbController');

        const create_date = moment();
        const create_date_string = create_date.format('YYYY-MM-DD');
        const create_time_string = create_date.format('HH:mm:ss');

        const modify_date = create_date;
        const modify_date_string = create_date.format('YYYY-MM-DD');
        const modify_time_string = create_date.format('HH:mm:ss');

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
            callback(new Error('casePatinetCreateStage3_Ortho_TrunkSpine_Controller: data-casePatientId-not-exists'));
            return;
        }
        else if (!chkCaseProgress.casePatientPersonalDetailId) {
            callback(new Error('casePatinetCreateStage3_Ortho_TrunkSpine_Controller: data-casePatientPersonalDetailId-not-exists'));
            return;
        }
        else if (chkCaseProgress.casePatientStage3Id) {
            callback(new Error('casePatinetCreateStage3_Ortho_TrunkSpine_Controller: data-casePatientStage3Id-exists'));
            return;
        }
        else {
            const _data_stage_3_OTS = data._data_stage_3_OTS;

            const mapST3OTS_StringAndNull = (dataName = '', dataInput = '') => {
                if (typeof dataName != 'string' || dataName == '' || dataName == null) {
                    throw new Error(`mapST3OTS_StringAndNull: ${dataName}: must be String and Not Empty`);
                }
                else {
                    if (dataInput === null) { return null; }
                    else if (typeof dataInput == 'string') {
                        if (dataInput == '') { return null; }
                        else { return dataInput.toString(); }
                    }
                    else {
                        throw new Error(`${dataName}: must be String/Null`);
                    }
                }
            };
            const mapST3OTS_NumberMoreEqueal0AndNull = (dataName = '', dataInput = -1) => {
                if (typeof dataName != 'string' || dataName == '' || dataName == null) {
                    throw new Error(`mapST3OTS_NumberMoreEqueal0AndNull: ${dataName}: must be String and Not Empty`);
                }
                else {
                    if (dataInput === null) { return null; }
                    else if (typeof dataInput == 'number') {
                        if (dataInput < 0) { throw new Error(`${dataName}: must be Number must Over Or Equeal 0`); }
                        else { return Number(dataInput); }
                    }
                    else {
                        throw new Error(`${dataName}: must be Number/Null`);
                    }
                }
            };
            const mapST3OTS_BooleanAndNull = (dataName = '', dataInput = false) => {
                if (typeof dataName != 'string' || dataName == '' || dataName == null) {
                    throw new Error(`mapST3OTS_StringAndNull: ${dataName}: must be String and Not Empty`);
                }
                else {
                    if (typeof dataInput == 'boolean') {
                        return dataInput;
                    }
                    else {
                        throw new Error(`${dataName}: must be Boolean`);
                    }
                }
            };
            const mapST3OTS_posture_group = () => {
                if (typeof _data_stage_3_OTS.posture_group == 'object' && _data_stage_3_OTS.posture_group.length >= 0) {
                    if (_data_stage_3_OTS.posture_group.length === 0) { return []; }
                    else {
                        let mapDataPG = [];

                        for (let indexPG = 0; indexPG < _data_stage_3_OTS.posture_group.length; indexPG++) {
                            const elementPG = _data_stage_3_OTS.posture_group[indexPG];

                            if (typeof elementPG != 'string' || elementPG == '') {
                                throw new Error(`posture_group[${indexPG}].name: must be String and Not Empty`);
                            }
                            else {
                                mapDataPG.push(elementPG.toString());
                            }
                        }

                        return mapDataPG;
                    }
                }
                else {
                    throw new Error(`posture_group: must be Array`);
                }
            };
            const mapST3OTS_table_range_of_motion_right = () => {
                if (typeof _data_stage_3_OTS.table_range_of_motion_right == 'object' && _data_stage_3_OTS.table_range_of_motion_right.length >= 0) {
                    if (_data_stage_3_OTS.table_range_of_motion_right.length === 0) { return []; }
                    else {
                        let mapDataTRMR = [];

                        for (let indexTRMR = 0; indexTRMR < _data_stage_3_OTS.table_range_of_motion_right.length; indexTRMR++) {
                            const elementTRMR = _data_stage_3_OTS.table_range_of_motion_right[indexTRMR];

                            if (typeof elementTRMR.name != 'string' || elementTRMR.name == '') {
                                throw new Error(`table_range_of_motion_right[${indexTRMR}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapTRMR = {
                                    id: mapST3OTS_StringAndNull(`table_range_of_motion_right[${indexTRMR}].id`, elementTRMR.id),
                                    name: mapST3OTS_StringAndNull(`table_range_of_motion_right[${indexTRMR}].name`, elementTRMR.name),
                                    active_rom: mapST3OTS_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTRMR}].active_rom`, elementTRMR.active_rom),
                                    pain_scale: mapST3OTS_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTRMR}].pain_scale`, elementTRMR.pain_scale),
                                    passive_rom: mapST3OTS_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTRMR}].passive_rom`, elementTRMR.passive_rom),
                                    pain_scale2: mapST3OTS_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTRMR}].pain_scale2`, elementTRMR.pain_scale2),
                                    endfeel: mapST3OTS_StringAndNull(`table_range_of_motion_right[${indexTRMR}].endfeel`, elementTRMR.endfeel),
                                    key: mapST3OTS_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTRMR}].key`, elementTRMR.key),

                                };

                                mapDataTRMR.push(mapTRMR);
                            }
                        }

                        return mapDataTRMR;
                    }
                }
                else {
                    throw new Error(`table_range_of_motion_right: must be Array`);
                }
            };
            const mapST3OTS_table_range_of_motion_left = () => {
                if (typeof _data_stage_3_OTS.table_range_of_motion_left == 'object' && _data_stage_3_OTS.table_range_of_motion_left.length >= 0) {
                    if (_data_stage_3_OTS.table_range_of_motion_left.length === 0) { return []; }
                    else {
                        let mapDataTRMR = [];

                        for (let indexTRML = 0; indexTRML < _data_stage_3_OTS.table_range_of_motion_left.length; indexTRML++) {
                            const elementTRML = _data_stage_3_OTS.table_range_of_motion_left[indexTRML];

                            if (typeof elementTRML.name != 'string' || elementTRML.name == '') {
                                throw new Error(`table_range_of_motion_left[${indexTRML}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapTRMR = {
                                    id: mapST3OTS_StringAndNull(`table_range_of_motion_left[${indexTRML}].id`, elementTRML.id),
                                    name: mapST3OTS_StringAndNull(`table_range_of_motion_left[${indexTRML}].name`, elementTRML.name),
                                    active_rom: mapST3OTS_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTRML}].active_rom`, elementTRML.active_rom),
                                    pain_scale: mapST3OTS_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTRML}].pain_scale`, elementTRML.pain_scale),
                                    passive_rom: mapST3OTS_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTRML}].passive_rom`, elementTRML.passive_rom),
                                    pain_scale2: mapST3OTS_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTRML}].pain_scale2`, elementTRML.pain_scale2),
                                    endfeel: mapST3OTS_StringAndNull(`table_range_of_motion_left[${indexTRML}].endfeel`, elementTRML.endfeel),
                                    key: mapST3OTS_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTRML}].key`, elementTRML.key),
                                };

                                mapDataTRMR.push(mapTRMR);
                            }
                        }

                        return mapDataTRMR;
                    }
                }
                else {
                    throw new Error(`table_range_of_motion_left: must be Array`);
                }
            };
            const mapST3OTS_sensory_right = () => {
                if (typeof _data_stage_3_OTS.sensory_right == 'object' && _data_stage_3_OTS.sensory_right.length >= 0) {
                    if (_data_stage_3_OTS.sensory_right.length === 0) { return []; }
                    else {
                        let mapDataSR = [];
                        for (let indexSR = 0; indexSR < _data_stage_3_OTS.sensory_right.length; indexSR++) {
                            const elementSR = _data_stage_3_OTS.sensory_right[indexSR];

                            if (typeof elementSR.name != 'string' || elementSR.name == '') {
                                throw new Error(`sensory_right[${indexSR}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapRS = {
                                    name: mapST3OTS_StringAndNull(`sensory_right[${indexSR}].name`, elementSR.name),
                                    pinprick: mapST3OTS_StringAndNull(`sensory_right[${indexSR}].pinprick`, elementSR.pinprick),
                                    light_touch: mapST3OTS_StringAndNull(`sensory_right[${indexSR}].light_touch`, elementSR.light_touch),
                                    action: mapST3OTS_StringAndNull(`sensory_right[${indexSR}].action`, elementSR.action),
                                };

                                mapDataSR.push(mapRS);
                            }


                        }
                        return mapDataSR;
                    }

                }
            };
            const mapST3OTS_sensory_left = () => {
                if (typeof _data_stage_3_OTS.sensory_left == 'object' && _data_stage_3_OTS.sensory_left.length >= 0) {
                    if (_data_stage_3_OTS.sensory_left.length === 0) { return []; }
                    else {
                        let mapDataSL = [];
                        for (let indexSL = 0; indexSL < _data_stage_3_OTS.sensory_left.length; indexSL++) {
                            const elementSL = _data_stage_3_OTS.sensory_left[indexSL];

                            if (typeof elementSL.name != 'string' || elementSL.name == '') {
                                throw new Error(`sensory_left[${indexSL}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapRL = {

                                    name: mapST3OTS_StringAndNull(`sensory_left[${indexSL}].name`, elementSL.name),
                                    pinprick: mapST3OTS_StringAndNull(`sensory_left[${indexSL}].pinprick`, elementSL.pinprick),
                                    light_touch: mapST3OTS_StringAndNull(`sensory_left[${indexSL}].light_touch`, elementSL.light_touch),
                                    action: mapST3OTS_StringAndNull(`sensory_left[${indexSL}].action`, elementSL.action),
                                };

                                mapDataSL.push(mapRL);
                            }


                        }
                        return mapDataSL;
                    }

                }
            };
            const mapST3OTS_deep_tendon_items = () => {
                if (typeof _data_stage_3_OTS.deep_tendon_items == 'object' && _data_stage_3_OTS.deep_tendon_items.length >= 0) {
                    let mapDataDTI = [];
                    for (let indexDTI = 0; indexDTI < _data_stage_3_OTS.deep_tendon_items.length; indexDTI++) {
                        const elementDIT = _data_stage_3_OTS.deep_tendon_items[indexDTI];
                        // validate_String_AndNotEmpty
                        // validate_StringOrNull_AndNotEmpty
                        if (!validate_String_AndNotEmpty(elementDIT.name)) { throw new Error(`deep_tendon_items[${indexDTI}].name must be String and Not Empty`); }
                        else if (!validate_String_AndNotEmpty(elementDIT.name_list)) { throw new Error(`deep_tendon_items[${indexDTI}].name_list must be String and Not Empty`); }
                        else if (!validate_StringOrNull_AndNotEmpty(elementDIT.right)) { throw new Error(`deep_tendon_items[${indexDTI}].right must be String or Null and Not Empty`); }
                        else if (!validate_StringOrNull_AndNotEmpty(elementDIT.left)) { throw new Error(`deep_tendon_items[${indexDTI}].left must be String or Null and Not Empty`); }
                        else {
                            mapDataDTI.push(
                                {
                                    name: String(elementDIT.name),
                                    name_list: String(elementDIT.name_list),
                                    right: (elementDIT.right === null) ? null: String(elementDIT.right),
                                    left: (elementDIT.left === null) ? null: String(elementDIT.left),
                                }
                            );
                        }
                    }
                    return mapDataDTI;
                }
                else {
                    throw new Error(`deep_tendon_items: must be array object`);
                }
            };
            const mapST3OTS_special_test = () => {
                if (typeof _data_stage_3_OTS.special_test == 'object' && _data_stage_3_OTS.special_test.length >= 0) {
                    if (_data_stage_3_OTS.special_test.length === 0) { return []; }
                    else {
                        let mapDataST = [];
                        for (let indexST = 0; indexST < _data_stage_3_OTS.special_test.length; indexST++) {
                            const elementST = _data_stage_3_OTS.special_test[indexST];

                            if (typeof elementST.name != 'string' || elementST.name == '') {
                                throw new Error(`special_test[${indexST}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapRT = {
                                    name: mapST3OTS_StringAndNull(`special_test[${indexST}].name`, elementST.name),
                                    type: mapST3OTS_BooleanAndNull(`special_test[${indexST}].type`, elementST.type)
                                };

                                mapDataST.push(mapRT);
                            }


                        }
                        return mapDataST;
                    }

                }
            };
            const mapST3OTS_pt_diagnosis = () => {
                if (typeof _data_stage_3_OTS.pt_diagnosis == 'string' && _data_stage_3_OTS.pt_diagnosis != '') {
                    return _data_stage_3_OTS.pt_diagnosis.toString();
                }
                else {
                    throw new Error(`pt_diagnosis: must be String and Not Empty`);
                }
            };
            const mapST3OTS_other_other_case = () => {
                if (typeof _data_stage_3_OTS.other.other_case == 'object' && _data_stage_3_OTS.other.other_case.length >= 0) {
                    if (_data_stage_3_OTS.other.other_case.length === 0) { return []; }
                    else {
                        let mapDataOOC = [];

                        for (let indexOOC = 0; indexOOC < _data_stage_3_OTS.other.other_case.length; indexOOC++) {
                            const elementOOC = _data_stage_3_OTS.other.other_case[indexOOC];

                            if (typeof elementOOC.name != 'string' || elementOOC.name == '' || elementOOC.name == null) {
                                throw new Error(`other.other_case[${indexOOC}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapOOC = {
                                    name: mapST3OTS_StringAndNull(`other.other_case[${indexOOC}].name`, elementOOC.name)
                                };

                                mapDataOOC.push(mapOOC);
                            }

                        }

                        return mapDataOOC;
                    }
                }
                else {
                    throw new Error(`other.other_case: must be Array`);
                }
            };
            /**
             * 
             */
            let mapStage3_OTS = null;
            try {
                mapStage3_OTS = {
                    _ref_casepatinetid: _data_stage_3_OTS._ref_casepatinetid,

                    create_date: create_date,
                    create_date_string: create_date_string,
                    create_time_string: create_time_string,

                    modify_date: modify_date,
                    modify_date_string: modify_date_string,
                    modify_time_string: modify_time_string,

                    stage3data_OTS: {

                        bp: mapST3OTS_StringAndNull('bp', _data_stage_3_OTS.bp),
                        hr: mapST3OTS_NumberMoreEqueal0AndNull('hr', _data_stage_3_OTS.hr),
                        o2sat: mapST3OTS_NumberMoreEqueal0AndNull('o2sat', _data_stage_3_OTS.o2sat),
                        posture_group: mapST3OTS_posture_group(),
                        posture_other: mapST3OTS_StringAndNull('posture_other', _data_stage_3_OTS.posture_other),
                        redness_at: mapST3OTS_StringAndNull('redness_at', _data_stage_3_OTS.redness_at),
                        swelling_at: mapST3OTS_StringAndNull('swelling_at', _data_stage_3_OTS.swelling_at),
                        warmth_at: mapST3OTS_StringAndNull('warmth_at', _data_stage_3_OTS.warmth_at),
                        spasm_at: mapST3OTS_StringAndNull('spasm_at', _data_stage_3_OTS.spasm_at),
                        tender_point_at: mapST3OTS_StringAndNull('tender_point_at', _data_stage_3_OTS.tender_point_at),
                        trigger_point_at: mapST3OTS_StringAndNull('trigger_point_at', _data_stage_3_OTS.trigger_point_at),
                        referred_pain_at: mapST3OTS_StringAndNull('referred_pain_at', _data_stage_3_OTS.referred_pain_at),
                        crepitus_sound: mapST3OTS_BooleanAndNull('crepitus_sound', _data_stage_3_OTS.crepitus_sound),
                        crepitus_at: mapST3OTS_StringAndNull('crepitus_at', _data_stage_3_OTS.crepitus_at),
                        observation_other: mapST3OTS_StringAndNull('observation_other', _data_stage_3_OTS.observation_other),
                        table_range_of_motion_right: mapST3OTS_table_range_of_motion_right(),
                        table_range_of_motion_left: mapST3OTS_table_range_of_motion_left(),
                        cervical_contralateral: mapST3OTS_StringAndNull('cervical_contralateral', _data_stage_3_OTS.cervical_contralateral),
                        cervical_ipsilateral: mapST3OTS_StringAndNull('cervical_ipsilateral', _data_stage_3_OTS.cervical_ipsilateral),
                        lumbar_contralateral: mapST3OTS_StringAndNull('lumbar_contralateral', _data_stage_3_OTS.lumbar_contralateral),
                        lumbar_ipsilateral: mapST3OTS_StringAndNull('lumbar_ipsilateral', _data_stage_3_OTS.lumbar_ipsilateral),
                        ppim: mapST3OTS_StringAndNull('ppim', _data_stage_3_OTS.ppim),
                        paiv: mapST3OTS_StringAndNull('paiv', _data_stage_3_OTS.paiv),
                        isometric_test: mapST3OTS_StringAndNull('isometric_test', _data_stage_3_OTS.isometric_test),
                        muscle_length_test: mapST3OTS_StringAndNull('muscle_length_test', _data_stage_3_OTS.muscle_length_test),
                        slr: mapST3OTS_StringAndNull('slr', _data_stage_3_OTS.slr),
                        slr_comment: mapST3OTS_StringAndNull('slr_comment', _data_stage_3_OTS.slr_comment),
                        slump_test: mapST3OTS_StringAndNull('slump_test', _data_stage_3_OTS.slump_test),
                        slump_test_comment: mapST3OTS_StringAndNull('slump_test_comment', _data_stage_3_OTS.slump_test_comment),
                        prone_knee_bending: mapST3OTS_StringAndNull('prone_knee_bending', _data_stage_3_OTS.prone_knee_bending),
                        prone_knee_bending_comment: mapST3OTS_StringAndNull('prone_knee_bending_comment', _data_stage_3_OTS.prone_knee_bending_comment),
                        sensory_right: mapST3OTS_sensory_right(),
                        sensory_left: mapST3OTS_sensory_left(),
                        deep_tendon_items: mapST3OTS_deep_tendon_items(),
                        special_test: mapST3OTS_special_test(),
                        other: {
                            other_case: mapST3OTS_other_other_case(),
                        },
                        long_term_goal: mapST3OTS_StringAndNull('long_term_goal', _data_stage_3_OTS.long_term_goal),
                        short_term_goal: mapST3OTS_StringAndNull('long_term_goal', _data_stage_3_OTS.long_term_goal),
                        _ref_pt_diagnosisid: (await miscController.checkPtDiagnosis(_data_stage_3_OTS._ref_pt_diagnosisid, (err) => { if (err) { throw err; } }))._ref_pt_diagnosisid,
                        pt_diagnosis: (await miscController.checkPtDiagnosis(_data_stage_3_OTS._ref_pt_diagnosisid, (err) => { if (err) { throw err; } })).name,
                        pt_diagnosis_other: mapST3OTS_StringAndNull('pt_diagnosis_other', _data_stage_3_OTS.pt_diagnosis_other),
                    }
                }

            } catch (error) {
                callback(error);
                return;
            }

            if (mapStage3_OTS) {
                const mapStage3 = {
                    _ref_casepatinetid: mapStage3_OTS._ref_casepatinetid,

                    create_date: mapStage3_OTS.create_date,
                    create_date_string: mapStage3_OTS.create_date_string,
                    create_time_string: mapStage3_OTS.create_time_string,

                    modify_date: mapStage3_OTS.modify_date,
                    modify_date_string: mapStage3_OTS.modify_date_string,
                    modify_time_string: mapStage3_OTS.modify_time_string,

                    stage3data: {
                        ortho: {
                            upper: null,
                            lower: null,
                            trunk_spine: mapStage3_OTS.stage3data_OTS,
                            general: null
                        },
                        neuro: null
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
            } else {
                callback(`casePatinetCreateStage3_Ortho_TrunkSpine_Controller: not found mapStage3_OTS Variable`);
                return;
            }
        }
    }
};

module.exports = casePatinetCreateStage3_Ortho_TrunkSpine_Controller;