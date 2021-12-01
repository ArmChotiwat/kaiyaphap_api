const case_PatinetCreateCase_Stage_2_Image_Middleware = (req, res, next) => {
    const { validate_StringObjectId_NotNull, validateObjectId } = require('../../../Controller/miscController');
    const payload = req.body;
    const file = req.files.file
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
         * - <_agentid> m_agent => 'store._id'
         * - <_casemainid> m_patient => '_id'
         * - <_casesubid>
         */
        if (!validate_StringObjectId_NotNull(payload._casepatientid) || !validateObjectId(payload._casepatientid)) { ErrorJson.description.push(`Paratmer <_casepatientid> must be String and Not Empty`); }
        if (typeof file != 'object' || payload._casepatientid == '' ) { ErrorJson.description.push(`Paratmer <file> mest be file and Not Empty`); }
        for (let index = 0; index < file.length; index++) {
            if (file[index].mimetype !== 'image/png' && file[index].mimetype !== 'image/jpeg' && file[index].mimetype !== 'image/bmp' && file[index].mimetype !== 'image/tiff' && file[index].mimetype !== 'image/gif') {
                ErrorJson.description.push(`Paratmer <file> not support types file`);
                // console.log(file);
            } 
            
        }
        
        if (ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { next(); }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};


module.exports = case_PatinetCreateCase_Stage_2_Image_Middleware;