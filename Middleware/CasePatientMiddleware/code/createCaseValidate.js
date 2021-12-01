


const Express = require("express");

/** @type {Express.RequestHandler} */
const casePatinetCreateValidateMiddleware = async (req, res, next) => {
    const payload = req.body;

    let ErrorJson = {
        http_code: 400,
        document_code: 40020011102, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };

    

    try {
        /**
         * **JSON Playload In
         * - <_storeid>
         * - <_branchid>
         * - <_patientid>
         * - <_agentid> m_agent => 'store._id'
         * - <_casemainid> m_patient => '_id'
         * - <_casesubid>
         */

        const mongodbController = require('../../../Controller/mongodbController')
        const validateObjectId = mongodbController.validateObjectId;
        const checkObjectId = mongodbController.checkObjectId;
        
        const storeModel = mongodbController.storeModel;
        const patientModel = mongodbController.patientModel;
        const agentModel = mongodbController.agentModel;
        const caseTypeModel = mongodbController.caseTypeModel;

        if (!validateObjectId(payload._storeid)) { ErrorJson.description.push(`Parameter <_storeid> must be String ObjectId`); }
        if (!validateObjectId(payload._branchid)) { ErrorJson.description.push(`Parameter <_branchid> must be String ObjectId`); }
        if (!validateObjectId(payload._patientid)) { ErrorJson.description.push(`Parameter <_patientid> must be String ObjectId`); }
        if (!validateObjectId(payload._agentid)) { ErrorJson.description.push(`Parameter <_agentid> must be String ObjectId`); }
        if (!validateObjectId(payload._casemainid)) { ErrorJson.description.push(`Parameter <_casemainid> must be String ObjectId`); }
        if (!validateObjectId(payload._casesubid)) { ErrorJson.description.push(`Parameter <_casesubid> must be String ObjectId`); }

        if (ErrorJson.description.length != 0) { res.status(ErrorJson.http_code).json(ErrorJson).end(); }
        else {
            const _storeid = await checkObjectId(payload._storeid, (err) => { if (err) { ErrorJson.description.push(`Parameter <_storeid> Validate ObjectId failed`); return; } });
            const _branchid = await checkObjectId(payload._branchid, (err) => { if (err) { ErrorJson.description.push(`Parameter <_branchid> Validate ObjectId failed`); return; } });
            const _patientid = await checkObjectId(payload._patientid, (err) => { if (err) { ErrorJson.description.push(`Parameter <_patientid> Validate ObjectId failed`); return; } });
            const _agentid = await checkObjectId(payload._agentid, (err) => { if (err) { ErrorJson.description.push(`Parameter <_agentid> Validate ObjectId failed`); return; } });
            const _casemainid = await checkObjectId(payload._casemainid, (err) => { if (err) { ErrorJson.description.push(`Parameter <_casemainid> Validate ObjectId failed`); return; } });
            const _casesubid = await checkObjectId(payload._casesubid, (err) => { if (err) { ErrorJson.description.push(`Parameter <_casesubid> Validate ObjectId failed`); return; } });

            if (ErrorJson.description.length != 0) { res.status(ErrorJson.http_code).json(ErrorJson).end(); }
            else {
                const findStoreExists = await storeModel.find(
                    {
                        '_id': _storeid,
                        'branch._id': _branchid
                    }
                );
                if (!(findStoreExists && findStoreExists.length === 1)) { ErrorJson.description.push(`Data Request Error: 100`); }
        
                const findPatientInStoreExists = await patientModel.find(
                    {
                        '_id': _patientid,
                        'store._storeid': _storeid,
                        'store.user_status': true
                    }
                );
                if (!(findPatientInStoreExists && findPatientInStoreExists.length === 1)) { ErrorJson.description.push(`Data Request Error: 200`); }
        
                const findAgentInStoreExists = await agentModel.find(
                    {
                        'store._storeid': _storeid,
                        "store._id": _agentid,
                        'store.user_status': true
                    }
                );
                if (!(findAgentInStoreExists && findAgentInStoreExists.length === 1)) { ErrorJson.description.push(`Data Request Error: 300`); }
        
                const findCaseTypeInStoreExists = await caseTypeModel.find(
                    {
                        '_storeid': _storeid,
                        '_branchid': _branchid,
                        '_reftid': _casemainid,
                        'isused': true,
        
                        'type_sub._reftid': _casesubid,
                        'type_sub.isused': true
                    }
                );
                if (!(findCaseTypeInStoreExists && findCaseTypeInStoreExists.length === 1)) { ErrorJson.description.push(`Data Request Error: 400`); }
        
                if (ErrorJson.description.length != 0) { res.status(ErrorJson.http_code).json(ErrorJson).end(); }
                else {
                    next();
                }
            }
        }
    } catch (error) {
        console.error(error);
        ErrorJson.http_code = 422;
        ErrorJson.description.push(`Other Error`);
        res.status(ErrorJson.http_code).json(ErrorJson).end();
    }
};


module.exports = casePatinetCreateValidateMiddleware;