const casePatinetCreateStage3_Ortho_Lower_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _patientid: new String(''),
        _casepatientid: new String(''),
        _data_stage_3_OL: new Object()
    },
    callback = (err = new Err) => { }
) => {
    if (typeof data != 'object') { callback(new Error(`casePatinetCreateStage3_Ortho_Lower_Controller: <data> must be Object`)); }
    else if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_Lower_Controller: <data._storeid> must be String and Not Empty`)); return; }
    else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_Lower_Controller: <data._branchid> must be String and Not Empty`)); return; }
    else if (typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_Lower_Controller: <data._agentid> must be String and Not Empty`)); return; }
    else if (typeof data._patientid != 'string' || data._patientid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_Lower_Controller: <data._patientid> must be String and Not Empty`)); return; }
    else if (typeof data._casepatientid != 'string' || data._casepatientid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_Lower_Controller: <data._casepatientid> must be String and Not Empty`)); return; }
    else if (typeof data._data_stage_3_OL != 'object') { callback(new Error(`casePatinetCreateStage3_Ortho_Lower_Controller: <data._data_stage_2> must be Object`)); return; }
    else if (typeof data._data_stage_3_OL._ref_casepatinetid != 'string' || data._data_stage_3_OL._ref_casepatinetid == '' || data._data_stage_3_OL._ref_casepatinetid != data._casepatientid) {
        callback(new Error(`casePatinetCreateStage3_Ortho_Lower_Controller: <data._data_stage_2._ref_casepatinetid> must be String and Not Empty and data._data_stage_2._ref_casepatinetid === data._casepatientid`));
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
            callback(new Error('casePatinetCreateStage3_Ortho_Lower_Controller: data-casePatientId-not-exists'));
            return;
        }
        else if (!chkCaseProgress.casePatientPersonalDetailId) {
            callback(new Error('casePatinetCreateStage3_Ortho_Lower_Controller: data-casePatientPersonalDetailId-not-exists'));
            return;
        }
        else if (chkCaseProgress.casePatientStage3Id) {
            callback(new Error('casePatinetCreateStage3_Ortho_Lower_Controller: data-casePatientStage3Id-exists'));
            return;
        }
        else {
            const _data_stage_3_OL = data._data_stage_3_OL;

            const mapST3OU_StringAndNull = (dataName = '', dataInput = '') => {
                if (typeof dataName != 'string' || dataName == '' || dataName == null) {
                    throw new Error(`mapST3OU_StringAndNull: ${dataName}: must be String and Not Empty`);
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
            const mapST3OU_NumberMoreEqueal0AndNull = (dataName = '', dataInput = -1) => {
                if (typeof dataName != 'string' || dataName == '' || dataName == null) {
                    throw new Error(`mapST3OU_NumberMoreEqueal0AndNull: ${dataName}: must be String and Not Empty`);
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
            const mapST3OU_BooleanAndNull = (dataName = '', dataInput = false) => {
                if (typeof dataName != 'string' || dataName == '' || dataName == null) {
                    throw new Error(`mapST3OU_StringAndNull: ${dataName}: must be String and Not Empty`);
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
            const mapST3OU_posture_group = () => {
                if (typeof _data_stage_3_OL.posture_group == 'object' && _data_stage_3_OL.posture_group.length >= 0) {
                    if (_data_stage_3_OL.posture_group.length === 0) { return []; }
                    else {
                        let mapDataPG = [];

                        for (let indexPG = 0; indexPG < _data_stage_3_OL.posture_group.length; indexPG++) {
                            const elementPG = _data_stage_3_OL.posture_group[indexPG];

                            if (typeof elementPG == 'string' && elementPG != '') {
                                mapDataPG.push(elementPG.toString());
                            }
                            else {
                                throw new Error(`posture_group[${indexPG}]: must be String and Not Empty`);
                            }
                        }

                        return mapDataPG;
                    }
                }
                else {
                    throw new Error(`posture_group: must be Array`);
                }
            };
            const mapST3OU_table_range_of_motion_right = () => {
                if (typeof _data_stage_3_OL.table_range_of_motion_right == 'object' && _data_stage_3_OL.table_range_of_motion_right.length >= 0) {
                    if (_data_stage_3_OL.table_range_of_motion_right.length === 0) { return []; }
                    else {
                        let mapDataTRMR = [];

                        for (let indexTRMR = 0; indexTRMR < _data_stage_3_OL.table_range_of_motion_right.length; indexTRMR++) {
                            const elementTRMR = _data_stage_3_OL.table_range_of_motion_right[indexTRMR];

                            if (typeof elementTRMR.name != 'string' || elementTRMR.name == '') {
                                throw new Error(`table_range_of_motion_right[${indexTRMR}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapTRMR = {
                                    id: mapST3OU_StringAndNull(`table_range_of_motion_right[${indexTRMR}].id`, elementTRMR.id),
                                    name: mapST3OU_StringAndNull(`table_range_of_motion_right[${indexTRMR}].name`, elementTRMR.name),
                                    active_rom: mapST3OU_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTRMR}].active_rom`, elementTRMR.active_rom),
                                    pain_scale: mapST3OU_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTRMR}].pain_scale`, elementTRMR.pain_scale),
                                    passive_rom: mapST3OU_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTRMR}].passive_rom`, elementTRMR.passive_rom),
                                    pain_scale2: mapST3OU_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTRMR}].pain_scale2`, elementTRMR.pain_scale2),
                                    endfeel: mapST3OU_StringAndNull(`table_range_of_motion_right[${indexTRMR}].endfeel`, elementTRMR.endfeel),
                                    key: mapST3OU_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTRMR}].key`, elementTRMR.key),
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
            const mapST3OU_table_range_of_motion_left = () => {
                if (typeof _data_stage_3_OL.table_range_of_motion_left == 'object' && _data_stage_3_OL.table_range_of_motion_left.length >= 0) {
                    if (_data_stage_3_OL.table_range_of_motion_left.length === 0) { return []; }
                    else {
                        let mapDataTRMR = [];

                        for (let indexTRML = 0; indexTRML < _data_stage_3_OL.table_range_of_motion_left.length; indexTRML++) {
                            const elementTRML = _data_stage_3_OL.table_range_of_motion_left[indexTRML];

                            if (typeof elementTRML.name != 'string' || elementTRML.name == '') {
                                throw new Error(`table_range_of_motion_left[${indexTRML}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapTRMR = {
                                    id: mapST3OU_StringAndNull(`table_range_of_motion_left[${indexTRML}].id`, elementTRML.id),
                                    name: mapST3OU_StringAndNull(`table_range_of_motion_left[${indexTRML}].name`, elementTRML.name),
                                    active_rom: mapST3OU_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTRML}].active_rom`, elementTRML.active_rom),
                                    pain_scale: mapST3OU_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTRML}].pain_scale`, elementTRML.pain_scale),
                                    passive_rom: mapST3OU_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTRML}].passive_rom`, elementTRML.passive_rom),
                                    pain_scale2: mapST3OU_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTRML}].pain_scale2`, elementTRML.pain_scale2),
                                    endfeel: mapST3OU_StringAndNull(`table_range_of_motion_left[${indexTRML}].endfeel`, elementTRML.endfeel),
                                    key: mapST3OU_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTRML}].key`, elementTRML.key),
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
            const mapST3OU_capsular_length_test = () => {
                if (typeof _data_stage_3_OL.capsular_length_test == 'object' && _data_stage_3_OL.capsular_length_test.length >= 0) {
                    if (_data_stage_3_OL.capsular_length_test.length === 0) { return []; }
                    else {
                        let mapDataCLT = [];

                        for (let indexCLT = 0; indexCLT < _data_stage_3_OL.capsular_length_test.length; indexCLT++) {
                            const elementCLT = _data_stage_3_OL.capsular_length_test[indexCLT];

                            if (typeof elementCLT.name != 'string' || elementCLT.name == '' || elementCLT.name == null) {
                                throw new Error(`capsular_length_test[${indexCLT}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapCLT = {
                                    name: mapST3OU_StringAndNull(`capsular_length_test[${indexCLT}].name`, elementCLT.name),
                                    right: mapST3OU_StringAndNull(`capsular_length_test[${indexCLT}].right`, elementCLT.right),
                                    left: mapST3OU_StringAndNull(`capsular_length_test[${indexCLT}].left`, elementCLT.left),
                                };

                                mapDataCLT.push(mapCLT);
                            }
                        }

                        return mapDataCLT;
                    }
                }
                else {
                    throw new Error(`capsular_length_test: must be Array`);
                }
            };
            const mapST3OU_special_test = () => {
                if (typeof _data_stage_3_OL.special_test == 'object' && _data_stage_3_OL.special_test.length >= 0) {
                    if (_data_stage_3_OL.special_test.length === 0) { return []; }
                    else {
                        let mapDataST = [];

                        for (let indexST = 0; indexST < _data_stage_3_OL.special_test.length; indexST++) {
                            const elementST = _data_stage_3_OL.special_test[indexST];

                            if (typeof elementST.name != 'string' || elementST.name == '' || elementST.name == null) {
                                throw new Error(`special_test[${indexST}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapST = {
                                    name: mapST3OU_StringAndNull(`special_test[${indexST}].name`, elementST.name),
                                    type: mapST3OU_BooleanAndNull(`special_test[${indexST}].type`, elementST.type)
                                };

                                mapDataST.push(mapST);
                            }
                        }

                        return mapDataST;
                    }
                }
                else {
                    throw new Error(`special_test: must be Array`);
                }
            };
            const mapST3OU_other_other_case = () => {
                if (typeof _data_stage_3_OL.other.other_case == 'object' && _data_stage_3_OL.other.other_case.length >= 0) {
                    if (_data_stage_3_OL.other.other_case.length === 0) { return []; }
                    else {
                        let mapDataOOC = [];

                        for (let indexOOC = 0; indexOOC < _data_stage_3_OL.other.other_case.length; indexOOC++) {
                            const elementOOC = _data_stage_3_OL.other.other_case[indexOOC];

                            if (typeof elementOOC.name != 'string' || elementOOC.name == '' || elementOOC.name == null) {
                                throw new Error(`other.other_case[${indexOOC}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapST = {
                                    name: mapST3OU_StringAndNull(`other.other_case[${indexOOC}].name`, elementOOC.name)
                                };

                                mapDataOOC.push(mapST);
                            }
                        }

                        return mapDataOOC;
                    }
                }
                else {
                    throw new Error(`other.other_case: must be Array`);
                }
            };
            const mapST3OU_pt_diagnosis = () => {
                if (typeof _data_stage_3_OL.pt_diagnosis == 'string' && _data_stage_3_OL.pt_diagnosis != '') {
                    return _data_stage_3_OL.pt_diagnosis.toString();
                }
                else {
                    throw new Error(`pt_diagnosis: must be String and Not Empty`);
                }
            };


            let mapStage3_OU = null;
            try {
                mapStage3_OU = {
                    _ref_casepatinetid: _data_stage_3_OL._ref_casepatinetid,

                    create_date: create_date,
                    create_date_string: create_date_string,
                    create_time_string: create_time_string,

                    modify_date: modify_date,
                    modify_date_string: modify_date_string,
                    modify_time_string: modify_time_string,

                    stage3data_OL: {
                        bp: mapST3OU_StringAndNull('bp', _data_stage_3_OL.bp),
                        hr: mapST3OU_NumberMoreEqueal0AndNull('hr', _data_stage_3_OL.hr),
                        o2sat: mapST3OU_NumberMoreEqueal0AndNull('o2sat', _data_stage_3_OL.o2sat),
                        posture_group: mapST3OU_posture_group(),
                        posture_other: mapST3OU_StringAndNull('posture_other', _data_stage_3_OL.posture_other),
                        redness_at: mapST3OU_StringAndNull('redness_at', _data_stage_3_OL.redness_at),
                        swelling_at: mapST3OU_StringAndNull('swelling_at', _data_stage_3_OL.swelling_at),
                        warmth_at: mapST3OU_StringAndNull('warmth_at', _data_stage_3_OL.warmth_at),
                        spasm_at: mapST3OU_StringAndNull('spasm_at', _data_stage_3_OL.spasm_at),
                        tender_point_at: mapST3OU_StringAndNull('tender_point_at', _data_stage_3_OL.tender_point_at),
                        trigger_point_at: mapST3OU_StringAndNull('trigger_point_at', _data_stage_3_OL.trigger_point_at),
                        referred_pain_at: mapST3OU_StringAndNull('referred_pain_at', _data_stage_3_OL.referred_pain_at),
                        crepitus_sound: mapST3OU_BooleanAndNull('crepitus_sound', _data_stage_3_OL.crepitus_sound),
                        crepitus_at: mapST3OU_StringAndNull('crepitus_at', _data_stage_3_OL.crepitus_at),
                        observation_other: mapST3OU_StringAndNull('observation_other', _data_stage_3_OL.observation_other),
                        table_range_of_motion_right: mapST3OU_table_range_of_motion_right(),
                        table_range_of_motion_left: mapST3OU_table_range_of_motion_left(),
                        passive_accessory_movement: mapST3OU_StringAndNull('passive_accessory_movement', _data_stage_3_OL.passive_accessory_movement),
                        manual_muscle_test: mapST3OU_StringAndNull('manual_muscle_test', _data_stage_3_OL.manual_muscle_test),
                        isometric_test: mapST3OU_StringAndNull('isometric_test', _data_stage_3_OL.isometric_test),
                        muscle_length_test: mapST3OU_StringAndNull('muscle_length_test', _data_stage_3_OL.muscle_length_test),
                        squat: mapST3OU_StringAndNull('squat', _data_stage_3_OL.squat),
                        kneeling: mapST3OU_StringAndNull('kneeling', _data_stage_3_OL.kneeling),
                        lunges: mapST3OU_StringAndNull('lunges', _data_stage_3_OL.lunges),
                        jumping: mapST3OU_StringAndNull('jumping', _data_stage_3_OL.jumping),
                        jogging: mapST3OU_StringAndNull('jogging', _data_stage_3_OL.jogging),
                        high_knee: mapST3OU_StringAndNull('high_knee', _data_stage_3_OL.high_knee),
                        step_up_and_down: mapST3OU_StringAndNull('step_up_and_down', _data_stage_3_OL.step_up_and_down),
                        functional_test_other: mapST3OU_StringAndNull('functional_test_other', _data_stage_3_OL.functional_test_other),
                        ulnt1: mapST3OU_StringAndNull('ulnt1', _data_stage_3_OL.ulnt1),
                        ulnt1_note: mapST3OU_StringAndNull('ulnt1_note', _data_stage_3_OL.ulnt1_note),
                        ulnt2: mapST3OU_StringAndNull('ulnt2', _data_stage_3_OL.ulnt2),
                        ulnt2_note: mapST3OU_StringAndNull('ulnt2_note', _data_stage_3_OL.ulnt2_note),
                        ulnt3a: mapST3OU_StringAndNull('ulnt3a', _data_stage_3_OL.ulnt3a),
                        ulnt3a_note: mapST3OU_StringAndNull('ulnt3a_note', _data_stage_3_OL.ulnt3a_note),
                        ulnt3b: mapST3OU_StringAndNull('ulnt3b', _data_stage_3_OL.ulnt3b),
                        ulnt3b_note: mapST3OU_StringAndNull('ulnt3b_note', _data_stage_3_OL.ulnt3b_note),
                        neurodynamic_ulnt1: mapST3OU_StringAndNull('neurodynamic_ulnt1', _data_stage_3_OL.neurodynamic_ulnt1),
                        functional_other: mapST3OU_StringAndNull('functional_other', _data_stage_3_OL.functional_other),
                        capsular_length_test: mapST3OU_capsular_length_test(),
                        special_test: mapST3OU_special_test(),
                        other: {
                            other_case: mapST3OU_other_other_case()
                        },
                        long_term_goal: mapST3OU_StringAndNull('long_term_goal', _data_stage_3_OL.long_term_goal),
                        short_team_goal: mapST3OU_StringAndNull('short_team_goal', _data_stage_3_OL.short_team_goal),
                        _ref_pt_diagnosisid: (await miscController.checkPtDiagnosis(_data_stage_3_OL._ref_pt_diagnosisid, (err) => { if (err) { throw err; } }))._ref_pt_diagnosisid,
                        pt_diagnosis: (await miscController.checkPtDiagnosis(_data_stage_3_OL._ref_pt_diagnosisid, (err) => { if (err) { throw err; } })).name,
                        pt_diagnosis_other: mapST3OU_StringAndNull('pt_diagnosis_other', _data_stage_3_OL.pt_diagnosis_other),
                    }
                }

            } catch (error) {
                callback(error);
                return;
            }

            if (mapStage3_OU) {
                const mapStage3 = {
                    _ref_casepatinetid: mapStage3_OU._ref_casepatinetid,

                    create_date: mapStage3_OU.create_date,
                    create_date_string: mapStage3_OU.create_date_string,
                    create_time_string: mapStage3_OU.create_time_string,

                    modify_date: mapStage3_OU.modify_date,
                    modify_date_string: mapStage3_OU.modify_date_string,
                    modify_time_string: mapStage3_OU.modify_time_string,

                    stage3data: {
                        ortho: {
                            upper: null,
                            lower: mapStage3_OU.stage3data_OL,
                            trunk_spine: null,
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
            }
            else {
                callback(`casePatinetCreateStage3_Ortho_Upper_Controller: not found mapStage3_OU Variable`);
                return;
            }
        }
    }
};

module.exports = casePatinetCreateStage3_Ortho_Lower_Controller;