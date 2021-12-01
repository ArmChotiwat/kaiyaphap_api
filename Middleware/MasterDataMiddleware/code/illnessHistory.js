const illnessHistoryMiddleware_save = async (req, res, next) => {
    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty, checkAgentId } = require('../../../Controller/miscController');
    const { jwtDecode_Login_StoreBranchController } = require('../../../Controller/JwtController/index');

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };

    try {
        /**
         ** JSON => {
                "_storeid": { typer: StringObjectId },
                "name": { typer: String },
            }
        */
        const payload = req.body;

        if (!validate_StringObjectId_NotNull(payload._storeid)) { ErrorJson.description.push(`Parameter <_storeid> must be String ObjectId`); }
        if (!validate_String_AndNotEmpty(payload.name)) { ErrorJson.description.push(`Parameter <name> must be String and Not Empty`); }

        if (ErrorJson.description.length !== 0) { res.status(ErrorJson.http_code).json(ErrorJson).end(); return; }
        else {
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(req.header("authorization"));
            if (!jwtDecodeToekn) { res.status(401).end(); return; }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); return; }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid)
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); return; }
                if (chkAgent.role !== 1) { res.status(401).end(); return; }
                else {
                    next();
                }
            }
        }

    } catch (error) {
        console.error(error);
        res.status(422).end();
    }
};



const illnessHistoryMiddleware_put = async (req, res, next) => {
    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty, checkAgentId } = require('../../../Controller/miscController');
    const { jwtDecode_Login_StoreBranchController } = require('../../../Controller/JwtController/index');

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };

    try {
        /**
         ** JSON => {
                "_storeid": { type: StringOjectId },
                "_illnessHistoryid": { type: StringOjectId },
                "name": { type: String },
                "isused": { type: Boolean },
            }
        */
        const payload = req.body;

        if (!validate_StringObjectId_NotNull(payload._storeid)) { ErrorJson.description.push(`Parameter <_storeid> must be String ObjectId`); }
        if (!validate_StringObjectId_NotNull(payload._illnessHistoryid)) { ErrorJson.description.push(`Parameter <_illnessHistoryid> must be String ObjectId`); }
        if (!validate_String_AndNotEmpty(payload.name)) { ErrorJson.description.push(`Parameter <name> must be String and Not Empty`); }
        if (typeof payload.isused != 'boolean') { ErrorJson.description.push(`Parameter <isused> must be Boolean`); }

        if (ErrorJson.description.length !== 0) { res.status(ErrorJson.http_code).json(ErrorJson).end(); return; }
        else {
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(req.header("authorization"));
            if (!jwtDecodeToekn) { res.status(401).end(); return; }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); return; }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid)
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); return; }
                if (chkAgent.role !== 1) { res.status(401).end(); return; }
                else {
                    next();
                }
            }
        }

    } catch (error) {
        console.error(error);
        res.status(422).end();
    }
};




const illnessHistoryMiddleware_patch = async (req, res, next) => {
    const { validate_StringObjectId_NotNull, validate_String_AndNotEmpty, checkAgentId } = require('../../../Controller/miscController');
    const { jwtDecode_Login_StoreBranchController } = require('../../../Controller/JwtController/index');

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };

    try {
        /**
         ** JSON => {
                "_storeid": { type: StringOjectId },
                "_illnessHistoryid": { type: StringOjectId },
            }
        */
        const payload = req.body;

        if (!validate_StringObjectId_NotNull(payload._storeid)) { ErrorJson.description.push(`Parameter <_storeid> must be String ObjectId`); }
        if (!validate_StringObjectId_NotNull(payload._illnessHistoryid)) { ErrorJson.description.push(`Parameter <_illnessHistoryid> must be String ObjectId`); }

        if (ErrorJson.description.length !== 0) { res.status(ErrorJson.http_code).json(ErrorJson).end(); return; }
        else {
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(req.header("authorization"));
            if (!jwtDecodeToekn) { res.status(401).end(); return; }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); return; }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid)
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); return; }
                if (chkAgent.role !== 1) { res.status(401).end(); return; }
                else {
                    next();
                }
            }
        }

    } catch (error) {
        console.error(error);
        res.status(422).end();
    }
};



const illnessHistoryMiddleware_get = async (req, res, next) => {
    const { validate_StringObjectId_NotNull, checkAgentId } = require('../../../Controller/miscController');
    const { jwtDecode_Login_StoreBranchController } = require('../../../Controller/JwtController/index');

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };

    try {
        /**
         ** Query => {
                "storeid": { typer: StringObjectId }
            }
        */
        const { storeid } = req.query;

        if (!validate_StringObjectId_NotNull(storeid)) { ErrorJson.description.push(`Parameter <storeid> must be String ObjectId`); }

        if (ErrorJson.description.length !== 0) { res.status(ErrorJson.http_code).json(ErrorJson).end(); return; }
        else {
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(req.header("authorization"));
            if (!jwtDecodeToekn) { res.status(401).end(); return; }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); return; }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid)
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); return; }
                else {
                    next();
                }
            }
        }

    } catch (error) {
        console.error(error);
        res.status(422).end();
    }
};




const illnessHistoryMiddleware_All_get = async (req, res, next) => {
    const { validate_StringObjectId_NotNull, checkAgentId } = require('../../../Controller/miscController');
    const { jwtDecode_Login_StoreBranchController } = require('../../../Controller/JwtController/index');

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011001, // 400 Response/Bad Request, 200 GET, 110 GET/Masterdata, 001 Instruction 1 
        description: []
    };

    try {
        /**
         ** Query => {
                "storeid": { typer: StringObjectId }
            }
        */
        const { storeid } = req.query;

        if (!validate_StringObjectId_NotNull(storeid)) { ErrorJson.description.push(`Parameter <storeid> must be String ObjectId`); }

        if (ErrorJson.description.length !== 0) { res.status(ErrorJson.http_code).json(ErrorJson).end(); return; }
        else {
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(req.header("authorization"));
            if (!jwtDecodeToekn) { res.status(401).end(); return; }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); return; }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid)
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); return; }
                else {
                    next();
                }
            }
        }

    } catch (error) {
        console.error(error);
        res.status(422).end();
    }
};




module.exports = {
    illnessHistoryMiddleware_save,
    illnessHistoryMiddleware_put,
    illnessHistoryMiddleware_patch,
    illnessHistoryMiddleware_get,
    illnessHistoryMiddleware_All_get
};