const casePatinetCreateStage1Controller = async (
    data = {
        _storeid: new String(''),
        _branchid: new String(''),
        _agentid: new String(''),
        _patientid: new String(''),
        _casepatientid: new String(''),
        _data_stage_1: new Object()
    },
    callback = (err = new Err) => { }
) => {
    if (typeof data != 'object') { callback(new Error(`casePatinetCreateStage1Controller: <data> must be Object`)); }
    else if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(`casePatinetCreateStage1Controller: <data._storeid> must be String and Not Empty`)); return; }
    else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`casePatinetCreateStage1Controller: <data._branchid> must be String and Not Empty`)); return; }
    else if (typeof data._agentid != 'string' || data._agentid == '') { callback(new Error(`casePatinetCreateStage1Controller: <data._agentid> must be String and Not Empty`)); return; }
    else if (typeof data._patientid != 'string' || data._patientid == '') { callback(new Error(`casePatinetCreateStage1Controller: <data._patientid> must be String and Not Empty`)); return; }
    else if (typeof data._casepatientid != 'string' || data._casepatientid == '') { callback(new Error(`casePatinetCreateStage1Controller: <data._casepatientid> must be String and Not Empty`)); return; }
    else if (typeof data._data_stage_1 != 'object') { callback(new Error(`casePatinetCreateStage1Controller: <data._data_stage_1> must be Object`)); return; }
    else if (typeof data._data_stage_1._ref_casepatinetid != 'string' || data._data_stage_1._ref_casepatinetid == '' || data._data_stage_1._ref_casepatinetid != data._casepatientid) { callback(new Error(`casePatinetCreateStage1Controller: <data._data_stage_1._ref_casepatinetid> must be String and Not Empty and data._data_stage_1._ref_casepatinetid === data._casepatientid`)); return; }
    else if (typeof data._data_stage_1.update_congenital_disease != 'boolean') { callback(new Error(`casePatinetCreateStage1Controller: <data._data_stage_1.update_congenital_disease> must be Boolean`)); return; }
    else if (typeof data._data_stage_1.update_drug_allergy != 'boolean') { callback(new Error(`casePatinetCreateStage1Controller: <data._data_stage_1.update_drug_allergy> must be Boolean`)); return; }
    else if (typeof data._data_stage_1.update_illness_history != 'boolean') { callback(new Error(`casePatinetCreateStage1Controller: <data._data_stage_1.update_illness_history> must be Boolean`)); return; }
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
            callback(new Error('casePatinetCreateStage1Controller: data-casePatientId-not-exists'));
            return;
        }
        else if (!chkCaseProgress.casePatientPersonalDetailId) {
            callback(new Error('casePatinetCreateStage1Controller: data-casePatientPersonalDetailId-not-exists'));
            return;
        }
        else if (chkCaseProgress.casePatientStage1Id) {
            callback(new Error('casePatinetCreateStage1Controller: data-casePatientStage1Id-exists'));
            return;
        }
        else {
            const _data_stage_1 = data._data_stage_1;

            const mapST1_medicine_take = () => {
                if (typeof _data_stage_1.medicine_take != 'object') { throw new Error(`medicine_take: must be Array`); }

                if (_data_stage_1.medicine_take.length > 0) {
                    if (_data_stage_1.medicine_take[0].drug_group == '' || _data_stage_1.medicine_take[0].drug_group == null) { throw new Error(`medicine_take: have error`); }
                    _data_stage_1.medicine_take.forEach(element => {
                        if (typeof element.drug_group == 'string') {
                            if (element.drug_group == '') {
                                throw new Error(`medicine_take: have error`);
                            }
                        }
                        if (element.drug_group == null) {
                            throw new Error(`medicine_take: have error`);
                        }
                    });
                    const medicine_take = _data_stage_1.medicine_take.map(
                        (where) => ({
                            group: where.drug_group,
                            detail: where.drug_name
                        })
                    );
                    return medicine_take;
                }
                else { return []; }
            };
            const mapST1_injury_history = () => {
                if (typeof _data_stage_1.injury_history != 'boolean') { throw new Error(`injury_history: must be Boolean`); }
                if (typeof _data_stage_1.injury_history_name != 'string') { throw new Error(`injury_history_name: must be String`); }

                let injury_history = {
                    flag: new Boolean(false),
                    name: new String(''),
                };

                injury_history.flag = _data_stage_1.injury_history;
                injury_history.name = (_data_stage_1.injury_history_name == '') ? null : _data_stage_1.injury_history_name;

                return injury_history;
            };
            const mapST1_physical_examination = () => {
                if (typeof _data_stage_1.physical_examination != 'boolean') { throw new Error(`physical_examination: must be Boolean`); }
                if (typeof _data_stage_1.physical_examination_group != 'object') { throw new Error(`physical_examination_group: must be Array`); }

                let physical_examination = {
                    flag: new Boolean(false),
                    group: new Array(0),
                };

                if (_data_stage_1.physical_examination === false) {
                    if (_data_stage_1.physical_examination_group.length != 0) {
                        throw new Error(`physical_examination_group: Array's length must be 0, When physical_examination is false`);
                    }
                }
                else {
                    if (_data_stage_1.physical_examination_group.length === 0) {
                        throw new Error(`physical_examination_group: Array's length must be more than 0, When physical_examination is true`);
                    }
                }

                physical_examination.flag = _data_stage_1.physical_examination;
                physical_examination.group = _data_stage_1.physical_examination_group;

                return physical_examination;
            };
            const mapST1_surgery_history = () => {
                if (typeof _data_stage_1.surgery_history != 'boolean') { throw new Error(`surgery_history: must be Boolean`); }
                if (typeof _data_stage_1.surgery_history_type != 'string') { throw new Error(`surgery_history_type: must be String`); }
                if (typeof _data_stage_1.surgery_name != 'string') { throw new Error(`surgery_name: must be String`); }

                let surgery_history = {
                    flag: new Boolean(false),
                    type: new String(''),
                    name: new String(''),
                };

                if (_data_stage_1.surgery_history === false) {
                    if (_data_stage_1.surgery_history_type != '') {
                        throw new Error(`surgery_history_type: must be Empty when surgery_history is false`);
                    }
                    if (_data_stage_1.surgery_name != '') {
                        throw new Error(`surgery_name: must be Empty when surgery_history is false`);
                    }
                }

                surgery_history.flag = _data_stage_1.surgery_history;
                surgery_history.type = (_data_stage_1.surgery_history_type == '') ? null : _data_stage_1.surgery_history_type;
                surgery_history.name = (_data_stage_1.surgery_name == '') ? null : _data_stage_1.surgery_name;

                return surgery_history;
            };
            const mapST1_caution = () => {
                if (typeof _data_stage_1.caution != 'string') { throw new Error(`caution: must be String`); }

                return (_data_stage_1.caution == '') ? null : _data_stage_1.caution;
            };
            const mapST1_congenital_disease = async () => {
                if (typeof _data_stage_1.congenital_disease != 'object') { throw new Error(`caution: must be Array`); }
                if (_data_stage_1.congenital_disease.length === 0) { return []; }
                else {
                    const illnessCharacticModel = mongodbController.illnessCharacticModel;
                    const validateObjectId = mongodbController.validateObjectId;

                    let returnOutput = [];

                    for (let index = 0; index < _data_stage_1.congenital_disease.length; index++) {
                        const elementCD = _data_stage_1.congenital_disease[index];
                        if (typeof elementCD._illnesscharid != 'string' || !validateObjectId(elementCD._illnesscharid)) { throw new Error(`congenital_disease._id: have error due is not ObjectId or StringObjectId`); }

                        const findCDExists = await illnessCharacticModel.findById(
                            elementCD._illnesscharid,
                            (err) => { if (err) { callback(err); return; } }
                        );
                        if (!findCDExists || findCDExists.isused === false) { throw new Error(`congenital_disease._id NOT found`); }
                        else {
                            returnOutput.push(
                                {
                                    _ref_illnesscharid: findCDExists._id,
                                    name: findCDExists.name
                                }
                            );
                        }
                    }

                    return returnOutput;
                }
            };
            const mapST1_drug_allergy = () => {
                if (_data_stage_1.drug_allergy == null) { return null; }
                else if (typeof _data_stage_1.drug_allergy != 'string') { throw new Error(`drug_allergy: must be String`); }
                else {
                    return (_data_stage_1.drug_allergy == '') ? null : _data_stage_1.drug_allergy;
                }
            };
            const mapST1_illness_history = async () => {
                if (typeof _data_stage_1.illness_patien != 'object') { throw new Error(`illness_patien: must be Array`); }
                if (_data_stage_1.illness_patien.length === 0) { return []; }
                else {
                    const illnessModel = mongodbController.illnessModel;
                    const validateObjectId = mongodbController.validateObjectId;

                    let returnOutput = [];

                    for (let index = 0; index < _data_stage_1.illness_patien.length; index++) {
                        const elementIP = _data_stage_1.illness_patien[index];
                        if (typeof elementIP._id != 'string' || !validateObjectId(elementIP._id)) { throw new Error(`illness_patien._id: have error due is not ObjectId or StringObjectId`); }
                        if (typeof elementIP.name != 'string' || elementIP.name == '') { throw new Error(`illness_patien.name: have error due is not String OR is Empty`); }
                        if (typeof elementIP.answer != 'number') { throw new Error(`illness_patien.answer: have error due is not Number`); }
                        if (elementIP.detail != null) {
                            if (typeof elementIP.detail != 'string') {
                                throw new Error(`illness_patien.detail: must be String OR NULL`);
                            }
                        }


                        const findIPExists = await illnessModel.findById(
                            elementIP._id,
                            (err) => { if (err) { throw err; } }
                        );
                        if (!findIPExists || findIPExists.isused === false) { throw new Error(`illness_patien[${index}]._id NOT found OR isused = false <${elementIP._id}>`); }
                        else {
                            returnOutput.push(
                                {
                                    _ref_illnessid: findIPExists._id,
                                    name: findIPExists.name,
                                    answer: elementIP.answer,
                                    detail: (elementIP.detail == '') ? null : elementIP.detail
                                }
                            );
                        }
                    }

                    return returnOutput;
                }
            };


            let mapStage1;
            try {
                mapStage1 = {
                    _ref_casepatinetid: _data_stage_1._ref_casepatinetid,

                    create_date: create_date,
                    create_date_string: create_date_string,
                    create_time_string: create_time_string,

                    modify_date: modify_date,
                    modify_date_string: modify_date_string,
                    modify_time_string: modify_time_string,

                    stage1data: {
                        medicine_take: mapST1_medicine_take(),
                        injury_history: mapST1_injury_history(),
                        physical_examination: mapST1_physical_examination(),
                        surgery_history: mapST1_surgery_history(),
                        caution: mapST1_caution(),
                        congenital_disease: await mapST1_congenital_disease(),
                        drug_allergy: mapST1_drug_allergy(),
                        illness_history: await mapST1_illness_history()
                    }
                };
            } catch (error) {
                callback(error);
                throw error;
            }
            if (mapStage1) {
                const casePatientStage1Model = mongodbController.casePatientStage1Model;
                const stage1Model = new casePatientStage1Model(mapStage1);

                const transactionSave = await stage1Model.save()
                    .then(
                        result => { return result; }
                    )
                    .catch(
                        err => {
                            callback(err);
                            return;
                        }
                    );

                if (!transactionSave) { callback(new Error(`casePatinetCreateStage1Controller: transactionSave have error`)); return; }
                else {
                    const casePatientModel = mongodbController.casePatientModel;

                    const updateTransaction = await casePatientModel.findByIdAndUpdate(
                        chkCaseProgress.casePatientId,
                        {
                            'modify_date': modify_date,
                            'modify_date_string': modify_date_string,
                            'modify_time_string': modify_time_string
                        },
                        (err) => {
                            if (err) { callback(err); return; }
                        }
                    );

                    if (_data_stage_1.update_congenital_disease === true || _data_stage_1.update_drug_allergy === true || _data_stage_1.update_illness_history === true) {
                        const patientModel = mongodbController.patientModel;
                        const findPatient = await miscController.checkPatientId(
                            {
                                _patientid: data._patientid,
                                _storeid: data._storeid
                            },
                            (err) => { if (err) { callback(err); return; } }
                        );
                        if (_data_stage_1.update_congenital_disease === true) {
                            await patientModel.updateOne(
                                {
                                    '_id': findPatient._patientid,
                                    'store._id': findPatient._patientstoreid,
                                    'store._storeid': findPatient._storeid
                                },
                                {
                                    $set: {
                                        'store.$.personal.general_user_detail.congenital_disease': mapStage1.stage1data.congenital_disease.map(
                                            (where) => ({
                                                _illnesscharid: where._ref_illnesscharid,
                                                name: where.name
                                            })
                                        )
                                    }
                                },
                                (err) => { if (err) { callback(err); return; } }
                            );
                        }
                        if (_data_stage_1.update_drug_allergy === true) {
                            await patientModel.updateOne(
                                {
                                    '_id': findPatient._patientid,
                                    'store._id': findPatient._patientstoreid,
                                    'store._storeid': findPatient._storeid
                                },
                                {
                                    $set: { 'store.$.personal.general_user_detail.drug_allergy': mapStage1.stage1data.drug_allergy }
                                },
                                (err) => { if (err) { callback(err); return; } }
                            );
                        }
                        if (_data_stage_1.update_illness_history === true) {
                            await patientModel.updateOne(
                                {
                                    '_id': findPatient._patientid,
                                    'store._id': findPatient._patientstoreid,
                                    'store._storeid': findPatient._storeid
                                },
                                {
                                    $set: {
                                        'store.$.personal.illness_history': mapStage1.stage1data.illness_history.map(
                                            (where) => ({
                                                id: where._ref_illnessid,
                                                name: where.name,
                                                answer: where.answer,
                                                detail: where.detail
                                            })
                                        )
                                    }
                                },
                                (err) => { if (err) { callback(err); return; } }
                            );
                        }
                    }

                    callback(null);
                    return transactionSave;
                }
            }
        }
    }
};

module.exports = casePatinetCreateStage1Controller;
