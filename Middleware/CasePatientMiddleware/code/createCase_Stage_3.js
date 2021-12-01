const casePatinetCreateStage3Middleware = async (req, res, next) => {
    const { validate_StringObjectId_NotNull, validateObjectId } = require('../../../Controller/miscController');
    const { ObjectId, casePatientModel } = require('../../../Controller/mongodbController');

    const payload = req.body;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        /**
         * **JSON Playload In
         * - <_storeid>
         * - <_branchid>
         * - <_patientid>
         * - <_agentid>
         * - <_casemainid>
         * - <_casesubid>
         */
        let Passed = true;
        if(!validate_StringObjectId_NotNull(payload._storeid) || !validateObjectId(payload._storeid) ){ Passed = false; ErrorJson.description.push(`Paratmer <_storeid> must be String and Not Empty`);}
        if(!validate_StringObjectId_NotNull(payload._branchid) || !validateObjectId(payload._branchid) ){ Passed = false; ErrorJson.description.push(`Paratmer <_branchid> must be String and Not Empty`);}
        if(!validate_StringObjectId_NotNull(payload._agentid) || !validateObjectId(payload._agentid) ){ Passed = false; ErrorJson.description.push(`Paratmer <_agentid> must be String and Not Empty`);}
        if(!validate_StringObjectId_NotNull(payload._patientid) || !validateObjectId(payload._patientid) ){ Passed = false; ErrorJson.description.push(`Paratmer <_patientid> must be String and Not Empty`);}
        if(!validate_StringObjectId_NotNull(payload._casepatientid) || !validateObjectId(payload._casepatientid) ){ Passed = false; ErrorJson.description.push(`Paratmer <_casepatientid> must be String and Not Empty`);}
        
        if(typeof payload._data_stage_3 != 'object'){ ErrorJson.description.push(`Paratmer <_data_stage_3> must be Object`); }
        if(typeof payload._data_stage_3._ref_casepatinetid != 'string' || payload._data_stage_3._ref_casepatinetid == '' || payload._data_stage_3._ref_casepatinetid != payload._casepatientid) { 
            ErrorJson.description.push(
                "casePatinetCreateStage1Controller: <_data_stage_3._ref_casepatinetid> must be String and Not Empty and _data_stage_3._ref_casepatinetid === _casepatientid"
            ); 
        }

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
        else {
            const chkAgentId = await checkAgentId(
                {
                    _agentid: String(jwtDecodeToekn._ref_agent_userid), 
                    _storeid: payload._storeid, 
                    _branchid: payload._branchid
                }, 
                (err) => { if (err) { console.error(err); return; } }
            );

            if (!chkAgentId) { res.status(401).end(); return; }
            else if (chkAgentId.role !== 2) { res.status(401).end(); return; }
            else {
                if (validateObjectId(payload._storeid) && validateObjectId(payload._branchid) && validateObjectId(payload._casepatientid)) {
                    let validateOwner = false;
                    
                    const Retry_Max = 10;
                    for (let Retry_Count = 0; Retry_Count < Retry_Max; Retry_Count++) {
                        const findOwner = await casePatientModel.findOne(
                            {
                                '_id': ObjectId(payload._casepatientid),
                                '_ref_storeid': ObjectId(payload._storeid),
                                '_ref_branchid': ObjectId(payload._branchid),
                                '_ref_agent_userid': chkAgentId._agentid,
                                '_ref_agent_userstoreid': chkAgentId._agentstoreid
                            },
                            (err) => { if (err) { throw err; } }
                        );

                        if (findOwner) {
                            validateOwner = true;
                            break;
                        }
                    }

                    if (!validateOwner) { ErrorJson.description.push(`ProgressionNote validate owner failed`); }
                }
            }
        }


        
        if(ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { next(); }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};


module.exports = casePatinetCreateStage3Middleware;