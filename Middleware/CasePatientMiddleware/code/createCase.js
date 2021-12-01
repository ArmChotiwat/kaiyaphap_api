const casePatinetCreateMiddleware = async (req, res, next) => {
    const { validate_StringObjectId_NotNull, validateObjectId } = require('../../../Controller/miscController');
    const { ObjectId, casePatientModel } = require('../../../Controller/mongodbController');

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    try {
        /**
         ** JSON => {
                "_storeid": { type: StringObjectId },
                "_branchid": { type: StringObjectId },
                "_patientid": { type: StringObjectId },
                "_agentid": { type: StringObjectId },
                "_ref_scheduleid": { type: StringObjectId },
                "_casemainid": { type: StringObjectId },
                "_casesubid": { type: StringObjectId }
            }
        */
        const payload = req.body;

        let Passed = true;

        if (!validate_StringObjectId_NotNull(payload._storeid) || !validateObjectId(payload._storeid)) { Passed = false; ErrorJson.description.push(`Paratmer <_storeid> must be String ObjectId`); }
        if (!validate_StringObjectId_NotNull(payload._branchid) || !validateObjectId(payload._branchid)) { Passed = false; ErrorJson.description.push(`Paratmer <_branchid> must be String ObjectId`); }
        if (!validate_StringObjectId_NotNull(payload._patientid) || !validateObjectId(payload._patientid)) { Passed = false; ErrorJson.description.push(`Paratmer <_patientid> must be String ObjectId`); }
        if (!validate_StringObjectId_NotNull(payload._agentid) || !validateObjectId(payload._agentid)) { Passed = false; ErrorJson.description.push(`Paratmer <_agentid> must be String ObjectId`); }
        if (!validate_StringObjectId_NotNull(payload._casemainid) || !validateObjectId(payload._casemainid)) { Passed = false; ErrorJson.description.push(`Paratmer <_casemainid> must be String ObjectId`); }
        if (!validate_StringObjectId_NotNull(payload._casesubid) || !validateObjectId(payload._casesubid)) { Passed = false; ErrorJson.description.push(`Paratmer <_casesubid> must be String ObjectId`); }
        if (!validate_StringObjectId_NotNull(payload._ref_scheduleid) || !validateObjectId(payload._ref_scheduleid)) { Passed = false; ErrorJson.description.push(`Paratmer <_ref_scheduleid> must be String ObjectId`); }
        if (Passed) {
            const chkScheduleInCasePatientisDuplicated = await casePatientModel.findOne(
                {
                    '_ref_scheduleid': ObjectId(payload._ref_scheduleid)
                },
                {},
                (err) => { if (err) { throw err; } }
            );

            if (chkScheduleInCasePatientisDuplicated) { ErrorJson.description.push(`Paratmer <_ref_scheduleid> is exists in case due not allowed create multiplie casepatient in one _ref_scheduleid`); }
        }
        

        if (ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else {
            next();
        }
        
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(400).json(ErrorJson).end();
    }
};


module.exports = casePatinetCreateMiddleware;