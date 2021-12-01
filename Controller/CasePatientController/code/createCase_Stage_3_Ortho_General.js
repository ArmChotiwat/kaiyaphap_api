const casePatinetCreateStage3_Ortho_General_Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _patientid: new String(''),
        _casepatientid: new String(''),
        _data_stage_3_OG: new Object()
    },
    callback = (err = new Err) => { }
) => {
    if (typeof data != 'object') { callback(new Error(`casePatinetCreateStage3_Ortho_General_Controller: <data> must be Object`)); }
    else if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_General_Controller: <data._storeid> must be String and Not Empty`)); return; }
    else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_General_Controller: <data._branchid> must be String and Not Empty`)); return; }
    else if (typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_General_Controller: <data._agentid> must be String and Not Empty`)); return; }
    else if (typeof data._patientid != 'string' || data._patientid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_General_Controller: <data._patientid> must be String and Not Empty`)); return; }
    else if (typeof data._casepatientid != 'string' || data._casepatientid == '') { callback(new Error(`casePatinetCreateStage3_Ortho_General_Controller: <data._casepatientid> must be String and Not Empty`)); return; }
    else if (typeof data._data_stage_3_OG != 'object') { callback(new Error(`casePatinetCreateStage3_Ortho_General_Controller: <data._data_stage_3_OG> must be Object`)); return; }
    else if (typeof data._data_stage_3_OG._ref_casepatinetid != 'string' || data._data_stage_3_OG._ref_casepatinetid == '' || data._data_stage_3_OG._ref_casepatinetid != data._casepatientid) {
        callback(new Error(`casePatinetCreateStage3_Ortho_General_Controller: <data._data_stage_3_OG._ref_casepatinetid> must be String and Not Empty and data._data_stage_3_OG._ref_casepatinetid === data._casepatientid`));
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
            callback(new Error('casePatinetCreateStage3_Ortho_General_Controller: data-casePatientId-not-exists'));
            return;
        }
        else if (!chkCaseProgress.casePatientPersonalDetailId) {
            callback(new Error('casePatinetCreateStage3_Ortho_General_Controller: data-casePatientPersonalDetailId-not-exists'));
            return;
        }
        else if (chkCaseProgress.casePatientStage3Id) {
            callback(new Error('casePatinetCreateStage3_Ortho_General_Controller: data-casePatientStage3Id-exists'));
            return;
        }
        else {
            const _data_stage_3_OG = data._data_stage_3_OG;

            const mapST3OG_StringAndNull = (dataName = '', dataInput = '') => {
                if (typeof dataName != 'string' || dataName == '' || dataName == null) {
                    throw new Error(`mapST3OG_StringAndNull: ${dataName}: must be String and Not Empty`);
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
            const mapST3OG_NumberMoreEqueal0AndNull = (dataName = '', dataInput = -1) => {
                if (typeof dataName != 'string' || dataName == '' || dataName == null) {
                    throw new Error(`mapST3OG_NumberMoreEqueal0AndNull: ${dataName}: must be String and Not Empty`);
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
            const mapST3OG_Boolean = (dataName = '', dataInput = false) => {
                if (typeof dataName != 'string' || dataName == '' || dataName == null) {
                    throw new Error(`mapST3OG_StringAndNull: ${dataName}: must be String and Not Empty`);
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
            const mapST3OG_table_range_of_motion_right = () => {
                if (typeof _data_stage_3_OG.table_range_of_motion_right == 'object' && _data_stage_3_OG.table_range_of_motion_right.length >= 0) {
                    if (_data_stage_3_OG.table_range_of_motion_right.length === 0) { return []; }
                    else {
                        let mapDataTROMR = [];
                        for (let indexTROMR = 0; indexTROMR < _data_stage_3_OG.table_range_of_motion_right.length; indexTROMR++) {
                            const elementTROMR = _data_stage_3_OG.table_range_of_motion_right[indexTROMR];
            
                            if (typeof elementTROMR.name != 'string' || elementTROMR.name == '') {
                                throw new Error(`table_range_of_motion_right[${indexTROMR}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapTROMR =  {
                                    id: mapST3OG_StringAndNull(`table_range_of_motion_right[${indexTROMR}].id`, elementTROMR.id),                         //{ type: String, default: null },
                                    name: mapST3OG_StringAndNull(`table_range_of_motion_right[${indexTROMR}].name`, elementTROMR.name),                     //{ type: String, required: true },
                                    active_rom: mapST3OG_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTROMR}].active_rom`, elementTROMR.active_rom),//{ type: Number, default: null },
                                    pain_scale: mapST3OG_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTROMR}].pain_scale`, elementTROMR.pain_scale),//{ type: Number, default: null },
                                    passive_rom: mapST3OG_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTROMR}].passive_rom`, elementTROMR.passive_rom),//{ type: Number, default: null },
                                    pain_scale2: mapST3OG_NumberMoreEqueal0AndNull(`table_range_of_motion_right[${indexTROMR}].pain_scale2`, elementTROMR.pain_scale2),//{ type: Number, default: null },
                                    endfeel: mapST3OG_StringAndNull(`table_range_of_motion_right[${indexTROMR}].endfeel`, elementTROMR.endfeel),                 //{ type: String, default: null },
                                };
            
                                mapDataTROMR.push(mapTROMR);
                            }
            
            
                        }
                        return mapDataTROMR;
                    }
            
                }
            };
            const mapST3OG_table_range_of_motion_left = () => {
                if (typeof _data_stage_3_OG.table_range_of_motion_left == 'object' && _data_stage_3_OG.table_range_of_motion_left.length >= 0) {
                    if (_data_stage_3_OG.table_range_of_motion_left.length === 0) { return []; }
                    else {
                        let mapDataTROML = [];
                        for (let indexTROML = 0; indexTROML < _data_stage_3_OG.table_range_of_motion_left.length; indexTROML++) {
                            const elementTROML = _data_stage_3_OG.table_range_of_motion_left[indexTROML];
            
                            if (typeof elementTROML.name != 'string' || elementTROML.name == '') {
                                throw new Error(`table_range_of_motion_left[${indexTROML}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapTROML =  {
                                    id: mapST3OG_StringAndNull(`table_range_of_motion_left[${indexTROML}].id`, elementTROML.id),                         //{ type: String, default: null },
                                    name: mapST3OG_StringAndNull(`table_range_of_motion_left[${indexTROML}].name`, elementTROML.name),                     //{ type: String, required: true },
                                    active_rom: mapST3OG_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTROML}].active_rom`, elementTROML.active_rom),//{ type: Number, default: null },
                                    pain_scale: mapST3OG_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTROML}].pain_scale`, elementTROML.pain_scale),//{ type: Number, default: null },
                                    passive_rom: mapST3OG_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTROML}].passive_rom`, elementTROML.passive_rom),//{ type: Number, default: null },
                                    pain_scale2: mapST3OG_NumberMoreEqueal0AndNull(`table_range_of_motion_left[${indexTROML}].pain_scale2`, elementTROML.pain_scale2),//{ type: Number, default: null },
                                    endfeel: mapST3OG_StringAndNull(`table_range_of_motion_left[${indexTROML}].endfeel`, elementTROML.endfeel),                 //{ type: String, default: null },
                                };
            
                                mapDataTROML.push(mapTROML);
                            }
            
            
                        }
                        return mapDataTROML;
                    }
            
                }
            };
            const mapST3OG_sensory_test_right = () => {
                if (typeof _data_stage_3_OG.sensory_test_right == 'object' && _data_stage_3_OG.sensory_test_right.length >= 0) {
                    if (_data_stage_3_OG.sensory_test_right.length === 0) { return []; }
                    else {
                        let mapDataSRT = [];
                        for (let indexSRT = 0; indexSRT < _data_stage_3_OG.sensory_test_right.length; indexSRT++) {
                            const elementSRT = _data_stage_3_OG.sensory_test_right[indexSRT];
            
                            if (typeof elementSRT.name != 'string' || elementSRT.name == '') {
                                throw new Error(`sensory_test_right[${indexSRT}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapSRT = {
                                    name: mapST3OG_StringAndNull(`sensory_test_right[${indexSRT}].name`, elementSRT.name),   //{ type: String, required: true },
                                    left: mapST3OG_StringAndNull(`sensory_test_right[${indexSRT}].left`, elementSRT.left),   //{ type: String, default: null },
                                    right: mapST3OG_StringAndNull(`sensory_test_right[${indexSRT}].right`, elementSRT.right),   //{ type: String, default: null },
                                };
            
                                mapDataSRT.push(mapSRT);
                            }
            
            
                        }
                        return mapDataSRT;
                    }
            
                }
            };
            const mapST3OG_sensory_test_left = () => {
                if (typeof _data_stage_3_OG.sensory_test_left == 'object' && _data_stage_3_OG.sensory_test_left.length >= 0) {
                    if (_data_stage_3_OG.sensory_test_left.length === 0) { return []; }
                    else {
                        let mapDataSTL = [];
                        for (let indexSTL = 0; indexSTL < _data_stage_3_OG.sensory_test_left.length; indexSTL++) {
                            const elementSTL = _data_stage_3_OG.sensory_test_left[indexSTL];
            
                            if (typeof elementSTL.name != 'string' || elementSTL.name == '') {
                                throw new Error(`sensory_test_left[${indexSTL}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapSTL = {
                                    name: mapST3OG_StringAndNull(`sensory_test_left[${indexSTL}].name`, elementSTL.name),   //{ type: String, required: true },
                                    left: mapST3OG_StringAndNull(`sensory_test_left[${indexSTL}].left`, elementSTL.left),   //{ type: String, default: null },
                                    right: mapST3OG_StringAndNull(`sensory_test_left[${indexSTL}].right`, elementSTL.right),   //{ type: String, default: null },
                                };
            
                                mapDataSTL.push(mapSTL);
                            }
            
            
                        }
                        return mapDataSTL;
                    }
            
                }
            };
            const mapST3OG_neurodynamic_test = () => {
                if (typeof _data_stage_3_OG.neurodynamic_test == 'object' && _data_stage_3_OG.neurodynamic_test.length >= 0) {
                    if (_data_stage_3_OG.neurodynamic_test.length === 0) { return []; }
                    else {
                        let mapDataST = [];
                        for (let indexST = 0; indexST < _data_stage_3_OG.neurodynamic_test.length; indexST++) {
                            const elementST = _data_stage_3_OG.neurodynamic_test[indexST];
            
                            if (typeof elementST.name != 'string' || elementST.name == '') {
                                throw new Error(`neurodynamic_test[${indexST}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapST = {
                                    name: mapST3OG_StringAndNull(`neurodynamic_test[${indexST}].name`, elementST.name),//{ type: String, required: true },
                                    type: mapST3OG_Boolean(`neurodynamic_test[${indexST}].type`, elementST.type),//{ type: Boolean, default: false },
                                    note: mapST3OG_StringAndNull(`neurodynamic_test[${indexST}].note`, elementST.note),//{ type: String, default: null },
                                };
            
                                mapDataST.push(mapST);
                            }
            
            
                        }
                        return mapDataST;
                    }
            
                }
            };
            const mapST3OG_special_test = () => {
                if (typeof _data_stage_3_OG.special_test == 'object' && _data_stage_3_OG.special_test.length >= 0) {
                    if (_data_stage_3_OG.special_test.length === 0) { return []; }
                    else {
                        let mapDataSpT = [];
                        for (let indexSpT = 0; indexSpT < _data_stage_3_OG.special_test.length; indexSpT++) {
                            const elementSpT = _data_stage_3_OG.special_test[indexSpT];
            
                            if (typeof elementSpT.name != 'string' || elementSpT.name == '') {
                                throw new Error(`special_test[${indexSpT}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapSpT = {
                                    name: mapST3OG_StringAndNull(`special_test[${indexSpT}].name`, elementSpT.name),//{ type: String, required: true },
                                    type: mapST3OG_Boolean(`special_test[${indexSpT}].type`, elementSpT.type),//{ type: Boolean, default: false },
                                };
            
                                mapDataSpT.push(mapSpT);
                            }
            
            
                        }
                        return mapDataSpT;
                    }
            
                }
            };
            const mapST3OG_Other = () => {
                if (typeof _data_stage_3_OG.other == 'object' && _data_stage_3_OG.other.length >= 0) {
                    if (_data_stage_3_OG.other.length === 0) { return []; }
                    else {
                        let mapDataOther = [];
                        for (let indexOther = 0; indexOther < _data_stage_3_OG.other.length; indexOther++) {
                            const elementOther = _data_stage_3_OG.other[indexOther];
            
                            if (typeof elementOther.name != 'string' || elementOther.name == '') {
                                throw new Error(`other[${indexOther}].name: must be String and Not Empty`);
                            }
                            else {
                                const mapOther = {
                                    name: mapST3OG_StringAndNull(`other[${indexOther}].name`, elementOther.name),//{ type: String, required: true },
                                };
            
                                mapDataOther.push(mapOther);
                            }
            
            
                        }
                        return mapDataOther;
                    }
            
                }
            };

            let mapStage3_OG = null;
            try {
                mapStage3_OG = {
                    _ref_casepatinetid: _data_stage_3_OG._ref_casepatinetid,

                    create_date: create_date,
                    create_date_string: create_date_string,
                    create_time_string: create_time_string,

                    modify_date: modify_date,
                    modify_date_string: modify_date_string,
                    modify_time_string: modify_time_string,

                    stage3data_OG: {
                        bp: mapST3OG_StringAndNull('bp', _data_stage_3_OG.bp),                     //{ type: String, default: null },
                        hr: mapST3OG_NumberMoreEqueal0AndNull('hr', _data_stage_3_OG.hr),          //{ type: Number, default: null },
                        o2sat: mapST3OG_NumberMoreEqueal0AndNull('o2sat', _data_stage_3_OG.o2sat),       //{ type: Number, default: null },
                        observation_palpation: mapST3OG_StringAndNull('observation_palpation', _data_stage_3_OG.observation_palpation),  //{ type: String, default: null },
                        table_range_of_motion_right: mapST3OG_table_range_of_motion_right(),
                        table_range_of_motion_left: mapST3OG_table_range_of_motion_left(),
                        passive_accessory_movement: mapST3OG_StringAndNull('passive_accessory_movement', _data_stage_3_OG.passive_accessory_movement),//{ type: String, default: null },
                        manual_isometric_test: mapST3OG_StringAndNull('manual_isometric_test', _data_stage_3_OG.manual_isometric_test),//{ type: String, default: null },
                        muscle_length_test: mapST3OG_StringAndNull('muscle_length_test', _data_stage_3_OG.muscle_length_test),//{ type: String, default: null },
                        combined_functional_movement: mapST3OG_StringAndNull('combined_functional_movement', _data_stage_3_OG.combined_functional_movement),//{ type: String, default: null },
                        sensory_test_right: mapST3OG_sensory_test_right(),
                        sensory_test_left: mapST3OG_sensory_test_left(),
                        brachioradialis_right: mapST3OG_StringAndNull('brachioradialis_right', _data_stage_3_OG.brachioradialis_right),//{ type: String, default: null },
                        brachioradialis_left: mapST3OG_StringAndNull('brachioradialis_left', _data_stage_3_OG.brachioradialis_left),//{ type: String, default: null },
                        biceps_right: mapST3OG_StringAndNull('biceps_right', _data_stage_3_OG.biceps_right),//{ type: String, default: null },
                        biceps_left: mapST3OG_StringAndNull('biceps_left', _data_stage_3_OG.biceps_left),//{ type: String, default: null },
                        triceps_right: mapST3OG_StringAndNull('triceps_right', _data_stage_3_OG.triceps_right),//{ type: String, default: null },
                        triceps_left: mapST3OG_StringAndNull('triceps_left', _data_stage_3_OG.triceps_left),//{ type: String, default: null },
                        patella_right: mapST3OG_StringAndNull('patella_right', _data_stage_3_OG.patella_right),//{ type: String, default: null },
                        patella_left: mapST3OG_StringAndNull('patella_left', _data_stage_3_OG.patella_left),//{ type: String, default: null },
                        achilles_right: mapST3OG_StringAndNull('achilles_right', _data_stage_3_OG.achilles_right),//{ type: String, default: null },
                        achilles_left: mapST3OG_StringAndNull('achilles_left', _data_stage_3_OG.achilles_left),//{ type: String, default: null },
                        neurodynamic_test: mapST3OG_neurodynamic_test(),
                        special_test: mapST3OG_special_test(),
                        other: mapST3OG_Other(),
                        long_term_goal: mapST3OG_StringAndNull('long_term_goal', _data_stage_3_OG.long_term_goal),//{ type: String, default: null },
                        short_team_goal: mapST3OG_StringAndNull('short_team_goal', _data_stage_3_OG.short_team_goal),//{ type: String, default: null },
                        _ref_pt_diagnosisid: (await miscController.checkPtDiagnosis(_data_stage_3_OG._ref_pt_diagnosisid, (err) => { if (err) { throw err; } }))._ref_pt_diagnosisid,
                        pt_diagnosis: (await miscController.checkPtDiagnosis(_data_stage_3_OG._ref_pt_diagnosisid, (err) => { if (err) { throw err; } })).name,//{ type: String, required: true },
                        pt_diagnosis_other: mapST3OG_StringAndNull('pt_diagnosis_other', _data_stage_3_OG.pt_diagnosis_other),//{ type: String, default: null },
                    }
                }
            } catch (error) {
                callback(error);
                return;
            }

            if (mapStage3_OG) {
                const mapStage3 = {
                    _ref_casepatinetid: mapStage3_OG._ref_casepatinetid,

                    create_date: mapStage3_OG.create_date,
                    create_date_string: mapStage3_OG.create_date_string,
                    create_time_string: mapStage3_OG.create_time_string,

                    modify_date: mapStage3_OG.modify_date,
                    modify_date_string: mapStage3_OG.modify_date_string,
                    modify_time_string: mapStage3_OG.modify_time_string,

                    stage3data: {
                        ortho: {
                            upper: null,
                            lower: null,
                            trunk_spine: null,
                            general: mapStage3_OG.stage3data_OG
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
                callback(`casePatinetCreateStage3_Ortho_Upper_Controller: not found mapStage3_OG Variable`);
                return;
            }
        }
    }
};

module.exports = casePatinetCreateStage3_Ortho_General_Controller;