const viewCasePatientStoreBranchAgentDetailController = async (
    data = {
        _storeid: String(''),
        _branchid: String(''),
        _agentid: String(''),
        _patientid: String(''),
        _casepatientid: String(''),
    },
    callback = (err = new Error) => { }
) => {
    const controllerName = `viewCasePatientStoreBranchAgentDetailController`;

    const miscController = require('../../miscController')
    const validateObjectId = miscController.validateObjectId;
    const checkStoreBranch = miscController.checkStoreBranch;
    const checkAgentId = miscController.checkAgentId;

    if (typeof data != 'object') { callback(`${controllerName}: <data> must be Object`); }
    else if (typeof data._storeid != 'string' || !validateObjectId(data._storeid)) { callback(new Error(`${controllerName}: <data._storeid> must be String and Not Empty`)); return; }
    else if (typeof data._branchid != 'string' || !validateObjectId(data._branchid)) { callback(new Error(`${controllerName}: <data._branchid> must be String and Not Empty`)); return; }
    else if (!(await checkStoreBranch({ _storeid: data._storeid, _branchid: data._branchid }, (err) => { if (err) { return; } }))) { callback(new Error(`${controllerName}: <data._storeid> <data._branchid> checkStoreBranch return not found`)); return; }
    else if (typeof data._agentid != 'string' || !validateObjectId(data._agentid)) { callback(new Error(`${controllerName}: <data._agentid> must be String and Not Empty`)); return; }
    else if (typeof data._patientid != 'string' || !validateObjectId(data._patientid)) { callback(new Error(`${controllerName}: <data._patientid> must be String and Not Empty`)); return; }
    else if (typeof data._casepatientid != 'string' || !validateObjectId(data._casepatientid)) { callback(new Error(`${controllerName}: <data._casepatientid> must be String and Not Empty`)); return; }
    else {
        const checkCasePatientProgress = miscController.checkCasePatientProgress;

        const chkAgentId = await checkAgentId(
            {
                _agentid: data._agentid,
                _storeid: data._storeid,
                _branchid: data._branchid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkAgentId) { callback(new Error(`${controllerName}: chkAgentId return not found`)); return; }
        if (chkAgentId.role !== 1 && chkAgentId.role !== 2) { callback(new Error(`${controllerName}: chkAgentId.role (${chkAgentId.role}) not equal 1 or 2`)); return; }

        const mongodbController = require('../../mongodbController');
        const casePatientModel = mongodbController.casePatientModel;
        const casePatientPersonalDetailModel = mongodbController.casePatientPersonalDetailModel;
        const casePatientStage1Model = mongodbController.casePatientStage1Model;
        const casePatientStage2Model = mongodbController.casePatientStage2Model;
        const casePatientStage3Model = mongodbController.casePatientStage3Model;
        const treatmentModel = mongodbController.treatmentModel;
        const agentModel = mongodbController.agentModel;

        let resultReport = {
            casePatient: null,
            casePatientPersonalDetail: null,
            casePatientAgentPersonalDetail: null,
            casePatientStage1: null,
            casePatientStage2: null,
            casePatientStage3: null,
            casePatientStage4: null,
            casePatientStage2image: [],
        }

        const chkCasePatientProgress = await checkCasePatientProgress(
            {
                _storeid: data._storeid,
                _branchid: data._branchid,
                // _agentid: data._agentid,
                _patientid: data._patientid,
                _casepatientid: data._casepatientid
            },
            (err) => { if (err) { callback(err); return; } }
        );

        if (!chkCasePatientProgress) { callback(null); return; }
        else {

            const findCasePatient = await casePatientModel.findById(
                chkCasePatientProgress.casePatientId,
                (err) => { if (err) { callback(err); return; } }
            );
            if (findCasePatient) { resultReport.casePatient = findCasePatient }

            const findcasePatientPersonalDetail = await casePatientPersonalDetailModel.findById(
                chkCasePatientProgress.casePatientPersonalDetailId,
                (err) => { if (err) { callback(err); return; } }
            );
            if (findcasePatientPersonalDetail) { resultReport.casePatientPersonalDetail = findcasePatientPersonalDetail }

            const findcasePatientAgentPersonalDetail = await agentModel.aggregate(
                [
                    {
                        '$match': {
                            '_id': findCasePatient._ref_agent_userid
                        }
                    }, {
                        '$unwind': {
                            'path': '$store'
                        }
                    }, {
                        '$match': {
                            'store._id': findCasePatient._ref_agent_userstoreid
                        }
                    }, {
                        '$project': {
                            '_id': 0,
                            '_ref_agent_userid': '$_id',
                            '_ref_agent_userstoreid': '$store._id',
                            'pre_name': '$store.personal.pre_name',
                            'special_prename': {
                                '$cond': {
                                    'if': {
                                        '$eq': [
                                            '$store.personal.pre_name', 'อื่นๆ'
                                        ]
                                    },
                                    'then': {
                                        '$ifNull': [
                                            '$store.personal.special_prename', null
                                        ]
                                    },
                                    'else': null
                                }
                            },
                            'first_name': '$store.personal.first_name',
                            'last_name': '$store.personal.last_name'
                        }
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );
            if (findcasePatientAgentPersonalDetail || findcasePatientAgentPersonalDetail.length === 1) { resultReport.casePatientAgentPersonalDetail = findcasePatientAgentPersonalDetail[0] }

            const findCasePatientStage1 = await casePatientStage1Model.findById(
                chkCasePatientProgress.casePatientStage1Id,
                (err) => { if (err) { callback(err); return; } }
            );
            if (findCasePatientStage1) { resultReport.casePatientStage1 = findCasePatientStage1 }

            const findCasePatientStage2 = await casePatientStage2Model.findById(
                chkCasePatientProgress.casePatientStage2Id,
                (err) => { if (err) { callback(err); return; } }
            );
            if (findCasePatientStage2) {

                resultReport.casePatientStage2 = findCasePatientStage2;
                if (findCasePatientStage2.stage2data !== null) {
                    for (let index = 0, length = findCasePatientStage2.stage2data.inputfile_image.length; index < length; index++) {
                        resultReport.casePatientStage2image.push('/stage2image/' + data._storeid + '/' + data._casepatientid + findCasePatientStage2.stage2data.inputfile_image[index].name);
                    }
                }
                if (findCasePatientStage2.stage2data_neuro !== null) {
                    for (let index = 0, length = findCasePatientStage2.stage2data_neuro.inputfile_image.length; index < length; index++) {
                        resultReport.casePatientStage2image.push('/stage2image/' + data._storeid + '/' + data._casepatientid + findCasePatientStage2.stage2data_neuro.inputfile_image[index].name);
                    }
                }


            }

            const findCasePatientStage3 = await casePatientStage3Model.findById(
                chkCasePatientProgress.casePatientStage3Id,
                (err) => { if (err) { callback(err); return; } }
            );
            if (findCasePatientStage3) { resultReport.casePatientStage3 = findCasePatientStage3 }

            const findcasePatientStage4 = await treatmentModel.aggregate( // findTreatmentFirstTime
                [
                    {
                        '$match': {
                            '_id': chkCasePatientProgress.casePatientFirstTimeTreatmentId,
                        }
                    }, {
                        '$lookup': {
                            'from': 'l_treatment_detail',
                            'localField': '_id',
                            'foreignField': '_ref_treatmentid',
                            'as': 'product_course_detail'
                        }
                    }, {
                        '$unwind': {
                            'path': '$product_course_detail',
                            'includeArrayIndex': 'index_product_course_detail',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_course',
                            'localField': 'product_course_detail._ref_courseid',
                            'foreignField': '_id',
                            'as': 'm_course'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_course',
                            'includeArrayIndex': 'index_m_course',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$lookup': {
                            'from': 'm_product',
                            'localField': 'product_course_detail._ref_productid',
                            'foreignField': '_id',
                            'as': 'm_product'
                        }
                    }, {
                        '$unwind': {
                            'path': '$m_product',
                            'includeArrayIndex': 'index_m_product',
                            'preserveNullAndEmptyArrays': true
                        }
                    }, {
                        '$addFields': {
                            'product_course_detail.product_name': {
                                '$cond': {
                                    'if': {
                                        '$ne': [
                                            '$index_m_product', null
                                        ]
                                    },
                                    'then': '$m_product.product_name',
                                    'else': null
                                }
                            },
                            'product_course_detail.course_name': {
                                '$cond': {
                                    'if': {
                                        '$ne': [
                                            '$index_m_course', null
                                        ]
                                    },
                                    'then': '$m_course.name',
                                    'else': null
                                }
                            }
                        }
                    }, {
                        '$group': {
                            '_id': {
                                'id': '$_id',
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
                                'price_total_after': '$price_total_after'
                            },
                            'product_course_detail': {
                                '$push': '$product_course_detail'
                            }
                        }
                    }, {
                        '$project': {
                            '_id': '$_id.id',
                            'count_product_list': '$_id.count_product_list',
                            'price_product_list_total': '$_id.price_product_list_total',
                            'price_product_list_discount': '$_id.price_product_list_discount',
                            'price_product_list_total_discount': '$_id.price_product_list_total_discount',
                            'count_course_list': '$_id.count_course_list',
                            'price_course_list_total': '$_id.price_course_list_total',
                            'price_course_list_discount': '$_id.price_course_list_discount',
                            'price_course_list_total_discount': '$_id.price_course_list_total_discount',
                            'price_total_before': '$_id.price_total_before',
                            'price_discount': '$_id.price_discount',
                            'price_total_after': '$_id.price_total_after',
                            'product_course_detail': '$product_course_detail'
                        }
                    }, {
                        '$sort': {
                            '_id': 1
                        }
                    }, {
                        '$limit': 1
                    }
                ],
                (err) => { if (err) { callback(err); return; } }
            );

            const findcasePatientStage4_MedCert = await treatmentModel.findById(
                chkCasePatientProgress.casePatientFirstTimeTreatmentId,
                {},
                (err) => { if (err) { callback(err); return; } }
            );

            if (findcasePatientStage4.length === 1) {
                resultReport.casePatientStage4 = findcasePatientStage4[0];

                if (findcasePatientStage4_MedCert && findcasePatientStage4_MedCert._ref_agent_userid_create) {
                    resultReport.casePatientStage4._ref_agent_userid_create = findcasePatientStage4_MedCert._ref_agent_userid_create;
                }
                else {
                    callback(new Error(`${controllerName}: findcasePatientStage4_MedCert not find _ref_agent_userid_create`));
                    return;
                }
                if (findcasePatientStage4_MedCert && findcasePatientStage4_MedCert._ref_agent_userstoreid_create) {
                    resultReport.casePatientStage4._ref_agent_userstoreid_create = findcasePatientStage4_MedCert._ref_agent_userstoreid_create;
                }
                else {
                    callback(new Error(`${controllerName}: findcasePatientStage4_MedCert not find _ref_agent_userstoreid_create`));
                    return;
                }

                if (findcasePatientStage4_MedCert && findcasePatientStage4_MedCert.medical_certificate_th) {
                    resultReport.casePatientStage4.medical_certificate_th = {
                        patient_name: findcasePatientStage4_MedCert.medical_certificate_th.patient_name || null,
                        agent_name: findcasePatientStage4_MedCert.medical_certificate_th.agent_name || null,
                        pt_diagnosis: findcasePatientStage4_MedCert.medical_certificate_th.pt_diagnosis || null,
                        treatment: findcasePatientStage4_MedCert.medical_certificate_th.treatment || null,
                        detected_symptom: findcasePatientStage4_MedCert.medical_certificate_th.detected_symptom || null,
                    };
                    
                }
                else {
                    resultReport.casePatientStage4.medical_certificate_th = {
                        patient_name: null,
                        agent_name: null,
                        pt_diagnosis: null,
                        treatment: null,
                        detected_symptom: null,
                    };
                }
                if (findcasePatientStage4_MedCert && findcasePatientStage4_MedCert.medical_certificate_en) {
                    resultReport.casePatientStage4.medical_certificate_en = {
                        patient_name: findcasePatientStage4_MedCert.medical_certificate_en.patient_name || null,
                        agent_name: findcasePatientStage4_MedCert.medical_certificate_en.agent_name || null,
                        pt_diagnosis: findcasePatientStage4_MedCert.medical_certificate_en.pt_diagnosis || null,
                        treatment: findcasePatientStage4_MedCert.medical_certificate_en.treatment || null,
                        detected_symptom: findcasePatientStage4_MedCert.medical_certificate_en.detected_symptom || null,
                    };
                }
                else {
                    resultReport.casePatientStage4.medical_certificate_en = {
                        patient_name: null,
                        agent_name: null,
                        pt_diagnosis: null,
                        treatment: null,
                        detected_symptom: null,
                    };
                }
            }

            callback(null);
            return resultReport;
        }

    }
};

module.exports = viewCasePatientStoreBranchAgentDetailController;
