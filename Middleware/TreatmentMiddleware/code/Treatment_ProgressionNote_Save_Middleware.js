/**
 * Middleware สร้าง (Treatment ProgressionNote) ทำ ใบสั่งยา ครั้งที่สอง
 * Route POST => /treatment/create
 */
const Treatment_ProgressionNote_Save_Middleware = async (req, res, next) => {
    const { validate_StringObjectId_NotNull, validateObjectId, validate_StringOrNull_AndNotEmpty, checkCasePatientId_StoreBranch, validateNumber } = require('../../../Controller/miscController');
    const { ObjectId, treatmentModel, treatment_ProgressionNoteModel, casePatient_StatusModel } = require('../../../Controller/mongodbController');

    /**
     ** JSON => {
                    "_ref_storeid": { type: StringObjectId }, // ObjectId ของ ร้าน
                    "_ref_branchid": { type: StringObjectId }, // ObjectId ของ สาขา
                    "_ref_pateintid": { type: StringObjectId }, // ObjectId ของ ผู้ป่วย
                    "_ref_scheduleid": { type: StringObjectId }, // ObjectId ของ คิว
                    "_ref_casepatientid": { type: StringObjectId }, // ObjectId ของ Case Patient
                    "_ref_treatmentid": { type: StringObjectId }, // ObjectId ของ Treatment
                    "diagnosis_file_type": { type: Number 0|1|2|3 }, // Number 0 - 3
                    "S": { type: String Or Null },
                    "O": { type: String Or Null },
                    "A": { type: String Or Null },
                    "P": { type: String Or Null },
                }
    */
    const payload = req.body;
    // console.log(payload);

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };

    if (!validate_StringObjectId_NotNull(payload._ref_storeid)) { ErrorJson.description.push(`Paratmer _ref_storeid must be String ObjectId`); }
    if (!validate_StringObjectId_NotNull(payload._ref_branchid)) { ErrorJson.description.push(`Paratmer _ref_branchid must be String ObjectId`); }
    if (!validate_StringObjectId_NotNull(payload._ref_pateintid)) { ErrorJson.description.push(`Paratmer _ref_pateintid must be String ObjectId`); }
    if (!validate_StringObjectId_NotNull(payload._ref_scheduleid)) { ErrorJson.description.push(`Paratmer _ref_scheduleid must be String ObjectId`); }
    if (!validate_StringObjectId_NotNull(payload._ref_casepatientid)) { ErrorJson.description.push(`Paratmer _ref_casepatientid must be String ObjectId`); }
    if (!validateNumber(payload.diagnosis_file_type)) { ErrorJson.description.push(`Paratmer diagnosis_file_type must be Number and Reage 0-3`); }
    else {
        if (!(Math.ceil(payload.diagnosis_file_type) >= 0 && Math.ceil(payload.diagnosis_file_type) <= 3)) {
            ErrorJson.description.push(`Paratmer diagnosis_file_type must be Number of Reage 0-3`);
        }
    }

    if (!validate_StringOrNull_AndNotEmpty(payload._ref_treatmentid)) { ErrorJson.description.push(`Paratmer _ref_treatmentid must be String ObjectId or Null`); }
    else {
        if (payload._ref_treatmentid !== null) {
            if (!validateObjectId(payload._ref_treatmentid) || !validateObjectId(payload._ref_casepatientid)) { ErrorJson.description.push(`Paratmer _ref_treatmentid, _ref_casepatientid must be String ObjectId both`); }
            else {
                const findTreatment = await treatmentModel.findOne(
                    {
                        '_id': ObjectId(payload._ref_treatmentid),
                        '_ref_casepatinetid': ObjectId(payload._ref_casepatientid)
                    },
                    {},
                    (err) => { if (err) { console.error(err); return; } }
                );

                if (!findTreatment) { ErrorJson.description.push(`Paratmer _ref_treatmentid, _ref_casepatientid not found in treatment`); }
            }
        }
    }

    if (validateObjectId(payload._ref_storeid) && validateObjectId(payload._ref_branchid) && validateObjectId(payload._ref_casepatientid)) {
        const chkTreatment_ProgressionNote = await treatment_ProgressionNoteModel.findOne(
            {
                '_ref_scheduleid': ObjectId(payload._ref_scheduleid),
            },
            {},
            (err) => { 
                if (err) {
                    ErrorJson.description.push(`chkTreatment_ProgressionNote have error`);
                    console.error(err);
                    return;
                }
            }
        );

        const chkCasePatient = await checkCasePatientId_StoreBranch(
            payload._ref_storeid,
            payload._ref_branchid,
            payload._ref_casepatientid,
            (err) => {
                if (err) {
                    ErrorJson.description.push(`chkTreatment_ProgressionNote have error`);
                    console.error(err);
                    return;
                }
            }
        );

        if (chkTreatment_ProgressionNote) { ErrorJson.description.push(`Paratmer _ref_scheduleid return found, please add new Schduleid where never used`); }
        if (!chkCasePatient) { ErrorJson.description.push(`Paratmer _ref_casepatientid not found. please add Case Patient and Do Treatment (FirstTime) before do next visit`); }
        else {
            const countTreatment = await treatmentModel.find(
                {
                    '_ref_casepatinetid': ObjectId(chkCasePatient._ref_casepatientid)
                },
                {},
                (err) => { if (err) { console.error(err); return; }}
            ).countDocuments();

            if (!countTreatment) { ErrorJson.description.push(`Paratmer _ref_casepatientid not found in Treatment. please add Treatment before do next visit`); }
            else {
                if (countTreatment < 1) { ErrorJson.description.push(`Paratmer _ref_casepatinetid in Treatment found lower than 1. please add Treatment before do next visit`); }
            }
        }
    }

    if (!validate_StringOrNull_AndNotEmpty(payload.S)) { ErrorJson.description.push(`Paratmer S must be String Or Null and Not Empty`); }
    if (!validate_StringOrNull_AndNotEmpty(payload.O)) { ErrorJson.description.push(`Paratmer O must be String Or Null and Not Empty`); }
    if (!validate_StringOrNull_AndNotEmpty(payload.A)) { ErrorJson.description.push(`Paratmer A must be String Or Null and Not Empty`); }
    if (!validate_StringOrNull_AndNotEmpty(payload.P)) { ErrorJson.description.push(`Paratmer P must be String Or Null and Not Empty`); }

    const { checkAgentId } = require('../../../Controller/miscController');
    const { jwtDecode_Login_StoreBranchController } = require('../../../Controller/JwtController/index');
    const authorlization = req.header("authorization");
    /**
     ** JWTToken => {
            _agentid: { type: StringObjectId },
        }
    */
    const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);
    // const jwtDecodeToekn = { _agentid: '5e869c3dc893665810a4b555' };

    if (!jwtDecodeToekn || !jwtDecodeToekn._ref_agent_userid) { res.status(401).end(); return; }
    {
        const chkAgentId = await checkAgentId({_agentid: String(jwtDecodeToekn._ref_agent_userid), _storeid: payload._ref_storeid, _branchid: payload._ref_branchid}, (err) => { if (err) { console.error(err); return; } });

        if (!chkAgentId) { res.status(401).end(); return; }
        else if (chkAgentId.role !== 2) { res.status(401).end(); return; }
        else {
            if (validateObjectId(payload._ref_storeid) && validateObjectId(payload._ref_branchid) && validateObjectId(payload._ref_casepatientid) && validateObjectId(payload._ref_scheduleid) && validateObjectId(payload._ref_treatmentid)) {
                let validateOwner = false;
                
                const Retry_Max = 10;
                for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                    const findExistsTreatment = await casePatient_StatusModel.findOne(
                        {
                            '_ref_casepatientid': ObjectId(payload._ref_casepatientid),
                            '_ref_treatmentid': ObjectId(payload._ref_treatmentid),
                            '_ref_treatment_progressionnoteid': null,
                            '_ref_storeid': ObjectId(payload._ref_storeid),
                            '_ref_branchid': ObjectId(payload._ref_branchid),
                            'isnextvisited': true
                        },
                        {},
                        (err) => { if (err) { console.error(err); return; } }
                    );

                    const findOwnerTreatment = await treatmentModel.findOne(
                        {
                            '_id': ObjectId(payload._ref_treatmentid),
                            '_ref_scheduleid': ObjectId(payload._ref_scheduleid),
                            '_ref_casepatinetid': ObjectId(payload._ref_casepatientid),
                            '_ref_storeid': ObjectId(payload._ref_storeid),
                            '_ref_branchid': ObjectId(payload._ref_branchid),
                            '_ref_agent_userid_create': chkAgentId._agentid,
                            '_ref_agent_userstoreid_create': chkAgentId._agentstoreid
                        },
                        {},
                        (err) => { if (err) { console.error(err); return; } }
                    );

                    if (findExistsTreatment) {
                        if (findOwnerTreatment) {
                            validateOwner = true; 
                            break;
                        }
                    }
                }

                if (!validateOwner) { ErrorJson.description.push(`CasePatient validate owner failed`); }
            }
        }
    }


    if (ErrorJson.description.length > 0) { res.status(400).json(ErrorJson).end(); }
    else { next(); }
};


module.exports = Treatment_ProgressionNote_Save_Middleware;
