const casePatinetCreateStage2Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _patientid: new String(''),
        _casepatientid: new String(''),
        _data_stage_2: new Object(),
        _data_stage_2_neuro: new Object(),
    },
    callback = (err = new Err) => { }
) => {
    if (typeof data != 'object') { callback(new Error(`casePatinetCreateStage2Controller: <data> must be Object`)); }
    else if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`casePatinetCreateStage2Controller: <data._storeid> must be String and Not Empty`)); return; }
    else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`casePatinetCreateStage2Controller: <data._branchid> must be String and Not Empty`)); return; }
    else if (typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`casePatinetCreateStage2Controller: <data._agentid> must be String and Not Empty`)); return; }
    else if (typeof data._patientid != 'string' || data._patientid == '') { callback(new Error(`casePatinetCreateStage2Controller: <data._patientid> must be String and Not Empty`)); return; }
    else if (typeof data._casepatientid != 'string' || data._casepatientid == '') { callback(new Error(`casePatinetCreateStage2Controller: <data._casepatientid> must be String and Not Empty`)); return; }
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
            callback(new Error('casePatinetCreateStage2Controller: data-casePatientId-not-exists'));
            return;
        }
        else if (!chkCaseProgress.casePatientPersonalDetailId) {
            callback(new Error('casePatinetCreateStage2Controller: data-casePatientPersonalDetailId-not-exists'));
            return;
        }
        else if (chkCaseProgress.casePatientStage2Id) {
            callback(new Error('casePatinetCreateStage2Controller: data-casePatientStage2Id-exists'));
            return;
        }
        else {
            if (data._data_stage_2 !== null && data._data_stage_2_neuro === null) {

                if (typeof data._data_stage_2 != 'object') { callback(new Error(`casePatinetCreateStage2Controller: <data._data_stage_2> must be Object`)); return; }
                else if (typeof data._data_stage_2._ref_casepatinetid != 'string' || data._data_stage_2._ref_casepatinetid == '' || data._data_stage_2._ref_casepatinetid != data._casepatientid) { callback(new Error(`casePatinetCreateStage2Controller: <data._data_stage_2._casepatientid> must be String and Not Empty and data._data_stage_2._casepatientid === data._casepatientid`)); return; }
                else {
                    const _data_stage_2 = data._data_stage_2;

                    const mapST2_current_history = () => {
                        if (_data_stage_2.current_history != null) {
                            if (typeof _data_stage_2.current_history != 'string') {
                                throw new Error(`current_history: must be String or Null`);
                            }
                            else if (_data_stage_2.current_history == '' || _data_stage_2.current_history == null) {
                                return null;
                            }
                            else {
                                return _data_stage_2.current_history;
                            }
                        }
                        else {
                            return null;
                        }

                    };
                    const mapST2_important_symptoms = () => {
                        if (_data_stage_2.important_symptoms != null) {
                            if (typeof _data_stage_2.important_symptoms != 'string') {
                                throw new Error(`important_symptoms: must be String or Null`);
                            }
                            else if (_data_stage_2.important_symptoms == '' || _data_stage_2.important_symptoms == null) {
                                return null;
                            }
                            else {
                                return _data_stage_2.important_symptoms;
                            }
                        }
                        else {
                            return null;
                        }
                    };
                    const mapST2_body_chart = () => {
                        const errorObjectStr = 'body_chart';

                        if (typeof _data_stage_2.body_chart != 'object' && _data_stage_2.body_chart.length < 0) {
                            throw new Error(`${errorObjectStr}: must be Array`);
                        }
                        else if (_data_stage_2.body_chart.length === 0) {
                            return [];
                        }
                        else {
                            let mapBodyChart = [];


                            for (let indexELE = 0; indexELE < _data_stage_2.body_chart.length; indexELE++) {
                                const elementBC = _data_stage_2.body_chart[indexELE];

                                let tempBodyChart = {
                                    body_name: null,
                                    pain: null,
                                    pain_point: null,
                                    pain_point_data: {
                                        px: null,
                                        py: null,
                                    },
                                    numbness: null,
                                    continuation: null,
                                    depth: null,
                                    strength: null,
                                    pain_scale: null,
                                    aggrevate: null,
                                    ease: null,
                                    am: null,
                                    pm: null,
                                    night: null,
                                };

                                // body_name
                                if (typeof elementBC.body_name == 'string' && elementBC.body_name != '') {
                                    tempBodyChart.body_name = elementBC.body_name;

                                    // pain
                                    if (typeof elementBC.pain == 'string' || elementBC.pain === null) {
                                        if (elementBC.pain == '') { tempBodyChart.pain = null; }
                                        else { tempBodyChart.pain = elementBC.pain; }
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].pain: must be String and Not Empty`);
                                    }
                                    // pain_point
                                    if (typeof elementBC.pain_point == 'boolean') {
                                        tempBodyChart.pain_point = elementBC.pain_point;
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].pain_point: must be Boolean`);
                                    }
                                    // pain_point_data
                                    if (typeof elementBC.pain_point_data == 'object') {
                                        // pain_point_data.px
                                        if (typeof elementBC.pain_point_data.px == 'string' || elementBC.pain_point_data.px === null) {
                                            if (elementBC.pain_point_data.px == '') { tempBodyChart.pain_point_data.px = null; }
                                            else { tempBodyChart.pain_point_data.px = elementBC.pain_point_data.px; }
                                        }
                                        else {
                                            throw new Error(`${errorObjectStr}[${indexELE}].pain_point_data.px: must be String and Not Empty`);
                                        }
                                        // pain_point_data.py
                                        if (typeof elementBC.pain_point_data.py == 'string' || elementBC.pain_point_data.py === null) {
                                            if (elementBC.pain_point_data.py == '') { tempBodyChart.pain_point_data.py = null; }
                                            else { tempBodyChart.pain_point_data.py = elementBC.pain_point_data.py; }
                                        }
                                        else {
                                            throw new Error(`${errorObjectStr}[${indexELE}].pain_point_data.py: must be String and Not Empty`);
                                        }
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].pain_point_data: must be Object`);
                                    }
                                    // numbness
                                    if (typeof elementBC.numbness == 'string' || elementBC.numbness === null) {
                                        if (elementBC.numbness == '') { tempBodyChart.numbness = null; }
                                        else { tempBodyChart.numbness = elementBC.numbness; }
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].numbness: must be String and Not Empty`);
                                    }
                                    // continuation
                                    if (typeof elementBC.continuation == 'string' || elementBC.continuation === null) {
                                        if (elementBC.continuation == '') { tempBodyChart.continuation = null; }
                                        else { tempBodyChart.continuation = elementBC.continuation; }
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].continuation: must be String and Not Empty`);
                                    }
                                    // depth
                                    if (typeof elementBC.depth == 'string' || elementBC.depth === null) {
                                        if (elementBC.depth == '') { tempBodyChart.depth = null; }
                                        else { tempBodyChart.depth = elementBC.depth; }
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].depth: must be String and Not Empty`);
                                    }
                                    // strength
                                    if (typeof elementBC.strength == 'string' || elementBC.strength === null) {
                                        if (elementBC.strength == '') { tempBodyChart.strength = null; }
                                        else { tempBodyChart.strength = elementBC.strength; }
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].strength: must be String and Not Empty`);
                                    }
                                    // pain_scale
                                    if (typeof elementBC.pain_scale == 'number' || elementBC.pain_scale === null) {
                                        if (elementBC.pain_scale === null) { tempBodyChart.pain_scale = 0; }
                                        else { tempBodyChart.pain_scale = Math.abs(elementBC.pain_scale); }
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].pain_scale: must be String and Not Empty`);
                                    }
                                    // aggrevate
                                    if (typeof elementBC.aggrevate == 'string' || elementBC.aggrevate === null) {
                                        if (elementBC.aggrevate == '') { tempBodyChart.aggrevate = null; }
                                        else { tempBodyChart.aggrevate = elementBC.aggrevate; }
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].aggrevate: must be String and Not Empty`);
                                    }
                                    // ease
                                    if (typeof elementBC.ease == 'string' || elementBC.ease === null) {
                                        if (elementBC.ease == '') { tempBodyChart.ease = null; }
                                        else { tempBodyChart.ease = elementBC.ease; }
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].ease: must be String and Not Empty`);
                                    }
                                    // am
                                    if (typeof elementBC.am == 'string' || elementBC.am === null) {
                                        if (elementBC.am == '') { tempBodyChart.am = null; }
                                        else { tempBodyChart.am = elementBC.am; }
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].am: must be String and Not Empty`);
                                    }
                                    // pm
                                    if (typeof elementBC.pm == 'string' || elementBC.pm === null) {
                                        if (elementBC.pm == '') { tempBodyChart.pm = null; }
                                        else { tempBodyChart.pm = elementBC.pm; }
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].pm: must be String and Not Empty`);
                                    }
                                    // night
                                    if (typeof elementBC.night == 'string' || elementBC.night === null) {
                                        if (elementBC.night == '') { tempBodyChart.night = null; }
                                        else { tempBodyChart.night = elementBC.night; }
                                    }
                                    else {
                                        throw new Error(`${errorObjectStr}[${indexELE}].night: must be String and Not Empty`);
                                    }

                                    mapBodyChart.push(tempBodyChart);
                                }
                                else {
                                    throw new Error(`${errorObjectStr}[${indexELE}].body_name must be String and Not Empty`);
                                }
                            }

                            // console.log(mapBodyChart);
                            return mapBodyChart;
                        }
                    };
                    const mapST2_type_scan = () => {
                        if (_data_stage_2.type_scan != null) {
                            if (typeof _data_stage_2.type_scan != 'string') {
                                throw new Error(`type_scan: must be String or Null`);
                            }
                            else if (_data_stage_2.type_scan == '' || _data_stage_2.type_scan == null) {
                                return null;
                            }
                            else {
                                return _data_stage_2.type_scan;
                            }
                        }
                        else {
                            return null;
                        }
                    };
                    const mapST2_data_body_chart_active = () => {
                        if (typeof _data_stage_2.data_body_chart_active != 'object' || _data_stage_2.data_body_chart_active.length < 0) {
                            throw new Error("data_body_chart_active: must be Array");
                        }
                        else {
                            if (_data_stage_2.data_body_chart_active.length === 0) { return []; }
                            else {
                                let mapReturn = [];

                                for (let indexDBCA = 0; indexDBCA < _data_stage_2.data_body_chart_active.length; indexDBCA++) {
                                    const elementDBCA = _data_stage_2.data_body_chart_active[indexDBCA];

                                    if ((typeof elementDBCA.name == 'string' && elementDBCA.name != '') && (typeof elementDBCA.class == 'string' && elementDBCA.class != '')) {
                                        mapReturn.push({ name: elementDBCA.name, class: elementDBCA.class });
                                    }
                                    else {
                                        throw new Error(`data_body_chart_active: Object <name> ${typeof elementDBCA.name} : ${elementDBCA.name} /<class> ${typeof elementDBCA.class} : ${elementDBCA.class} must be String and Not empty`);
                                    }
                                }

                                return mapReturn;
                            }
                        }
                    }


                    let mapStage2;
                    try {
                        mapStage2 = {
                            _ref_casepatinetid: _data_stage_2._ref_casepatinetid,

                            create_date: create_date,
                            create_date_string: create_date_string,
                            create_time_string: create_time_string,

                            modify_date: modify_date,
                            modify_date_string: modify_date_string,
                            modify_time_string: modify_time_string,

                            stage2data: {
                                current_history: mapST2_current_history(),
                                important_symptoms: mapST2_important_symptoms(),
                                body_chart: mapST2_body_chart(),
                                type_scan: mapST2_type_scan(),
                                data_body_chart_active: mapST2_data_body_chart_active(),
                                inputfile_image: []
                            },
                            stage2data_neuro: null
                        };

                        // console.log(mapStage2.stage2data.body_chart);
                    } catch (error) {
                        callback(error);
                        return;
                    }

                    if (mapStage2) {

                        const casePatientStage2Model = mongodbController.casePatientStage2Model;
                        const stage2Model = new casePatientStage2Model(mapStage2);

                        const transactionSave = await stage2Model.save()
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
                }

            }
            else if (data._data_stage_2 === null && data._data_stage_2_neuro !== null) {
                if (typeof data._data_stage_2_neuro != 'object') { callback(new Error(`casePatinetCreateStage2Controller: <data._data_stage_2_neuro> must be Object`)); return; }
                else if (typeof data._data_stage_2_neuro._ref_casepatinetid != 'string' || data._data_stage_2_neuro._ref_casepatinetid == '' || data._data_stage_2_neuro._ref_casepatinetid != data._casepatientid) { callback(new Error(`casePatinetCreateStage2Controller: <data._data_stage_2_neuro._ref_casepatinetid> must be String and Not Empty and data._data_stage_2_neuro._ref_casepatinetid === data._casepatientid`)); return; }
                else if (data._data_stage_2_neuro.hemi === null && data._data_stage_2_neuro.para === null && data._data_stage_2_neuro.full === null) {
                    callback(new Error(`casePatinetCreateStage2Controller: <data._data_stage_2_neuro> (full para hemi) not null all`));
                    return;
                } else {

                    const check_hemi = async () => {
                        if (typeof data._data_stage_2_neuro.hemi !== 'string' || await miscController.checkNull(data._data_stage_2_neuro.hemi) === null) {
                            return null;
                        } else {
                            if (typeof data._data_stage_2_neuro.hemi === 'string') {
                                return String(data._data_stage_2_neuro.hemi);
                            }
                        }
                    }

                    const check_para = async () => {
                        if (typeof data._data_stage_2_neuro.para !== 'object' || data._data_stage_2_neuro.para === null) {
                            return null;
                        } else {
                            if (data._data_stage_2_neuro.para.indexMotorAll === null &&
                                data._data_stage_2_neuro.para.indexMotorLeft === null &&
                                data._data_stage_2_neuro.para.indexMotorRight === null &&
                                data._data_stage_2_neuro.para.indexSensoryAll === null &&
                                data._data_stage_2_neuro.para.indexSensoryLeft === null &&
                                data._data_stage_2_neuro.para.indexSensoryRight === null) {

                                throw new Error(`casePatinetCreateStage2Controller: <data._data_stage_2_neuro> (indexMotorAll indexMotorLeft indexMotorRight indexSensoryAll indexSensoryLeft indexSensoryRight) not null all`);
                            } else {
                                let date_para;
                                const check_number = async (data) => {
                                    if (typeof data !== 'number' || await miscController.checkNull(data) === null) {
                                        return null;
                                    } else {
                                        if (typeof data === 'number' && data >= 0 && data <= 27) {
                                            return Number(data);
                                        }
                                    }
                                }
                                date_para = {
                                    indexMotorAll: await check_number(data._data_stage_2_neuro.para.indexMotorAll),
                                    indexMotorLeft: await check_number(data._data_stage_2_neuro.para.indexMotorLeft),
                                    indexMotorRight: await check_number(data._data_stage_2_neuro.para.indexMotorRight),
                                    indexSensoryAll: await check_number(data._data_stage_2_neuro.para.indexSensoryAll),
                                    indexSensoryLeft: await check_number(data._data_stage_2_neuro.para.indexSensoryLeft),
                                    indexSensoryRight: await check_number(data._data_stage_2_neuro.para.indexSensoryRight)
                                }
                                return date_para;
                            }
                        }
                    }

                    const check_full = async () => {
                        if (typeof data._data_stage_2_neuro.full !== 'string' || await miscController.checkNull(data._data_stage_2_neuro.full) === null) {
                            return null;
                        } else {
                            if (typeof data._data_stage_2_neuro.full === 'string') {
                                return String(data._data_stage_2_neuro.full);
                            }
                        }
                    }

                    const check_description = async () => {
                        if (typeof data._data_stage_2_neuro.description !== 'string' || await miscController.checkNull(data._data_stage_2_neuro.description) === null) {
                            return null;
                        } else {
                            if (typeof data._data_stage_2_neuro.description === 'string') {
                                return String(data._data_stage_2_neuro.description);
                            }
                        }
                    }

                    const check_string_notnull = async (data) => {
                        if (miscController.validate_String_AndNotEmpty(data) === false) {
                            throw new Error(`casePatinetCreateStage2Controller: munt be string and not null`);
                        } else {
                            return String(data);
                        }
                    }

                    const check_string_or_null = async (data) => {

                        if (await miscController.checkNull(data) === null) {
                            if (miscController.validate_StringOrNull_AndNotEmpty(data) === false) {
                                return null;
                            }
                        } else {
                            return data;
                        }
                    }

                    const check_date_string_or_null = async (data) => {

                        if (await miscController.checkNull(data) !== null) {
                            if (miscController.validateDateTime.validateDate_String(data)) {
                                return String(data);
                            } else {
                                throw new Error(`casePatinetCreateStage2Controller: munt be string and not null fomat (YYYY-MM-DD)`);
                            }
                            
                        } else {
                            if (miscController.validate_StringOrNull_AndNotEmpty(data) === false) {
                                return null;
                            }else{
                                
                            }
                        }
                    }

                    const check_number_or_null = async (data) => {
                        if (await miscController.checkNull(data) !== null) {
                            if (miscController.validateNumber(data) === false) {
                                throw new Error(`casePatinetCreateStage2Controller: munt be number or null and not empty `);
                            } else {
                                return Number(data);
                            }

                        } else {
                            return data;
                        }
                    }

                    const _data_stage_2_neuro = data._data_stage_2_neuro;
                    let mapStage2_neuro;
                    try {
                        mapStage2_neuro = {
                            _ref_casepatinetid: _data_stage_2_neuro._ref_casepatinetid,

                            create_date: create_date,
                            create_date_string: create_date_string,
                            create_time_string: create_time_string,

                            modify_date: modify_date,
                            modify_date_string: modify_date_string,
                            modify_time_string: modify_time_string,
                            stage2data: null,
                            stage2data_neuro: {
                                hemi: await check_hemi(),
                                para: await check_para(),
                                full: await check_full(),
                                description: await check_description(),
                                formData: {
                                    fall: await check_string_notnull(data._data_stage_2_neuro.formData.fall), // ประวัติการหกล้ม มี ไม่มี ไม่ระบุ
                                    numberFall: await check_number_or_null(data._data_stage_2_neuro.formData.numberFall), // จำนวนครั้ง
                                    lastFall: await check_date_string_or_null(data._data_stage_2_neuro.formData.lastFall), // ล้มครั้งล่าสุดเมื่อวันที่
                                    stay: await check_string_or_null(data._data_stage_2_neuro.formData.stay), // พักอาศัยอยู่
                                    careTaker: await check_string_or_null(data._data_stage_2_neuro.formData.careTaker), // ผู้ดูแลหลัก
                                    houseStyle: await check_string_notnull(data._data_stage_2_neuro.formData.houseStyle), // ลักษณะบ้าน 0 1 2 3 4 5 6 
                                    bathroomStyle: { // ลักษณะและสถานที่ห้องน้ำ
                                        position: await check_string_notnull(data._data_stage_2_neuro.formData.bathroomStyle.position), // none or  inside or outside
                                        type: await check_string_notnull(data._data_stage_2_neuro.formData.bathroomStyle.type), // none or seat or squatting
                                        handrail: await check_string_notnull(data._data_stage_2_neuro.formData.bathroomStyle.handrail), //none or yes or no
                                    },
                                    OtherEnvironment: await check_string_or_null(data._data_stage_2_neuro.formData.OtherEnvironment), // สภาพแวดล้อมอื่นๆ
                                    mentalAndSocialState: { // สภาพแวดล้อมอื่นๆ
                                        type: await check_string_notnull(data._data_stage_2_neuro.formData.mentalAndSocialState.type),//none good or notgood
                                        text: await check_string_or_null(data._data_stage_2_neuro.formData.mentalAndSocialState.text),
                                    },
                                },
                                type_scan: await check_string_notnull(data._data_stage_2_neuro.type_scan),
                                inputfile_image: []
                            }
                        };

                        // console.log(mapStage2_neuro.stage2data.body_chart);
                    } catch (error) {
                        callback(error);
                        return;
                    }

                    if (mapStage2_neuro) {

                        const casePatientStage2Model = mongodbController.casePatientStage2Model;
                        const stage2Model = new casePatientStage2Model(mapStage2_neuro);

                        const transactionSave = await stage2Model.save()
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
                }

            }

        }
    }
};

module.exports = casePatinetCreateStage2Controller;