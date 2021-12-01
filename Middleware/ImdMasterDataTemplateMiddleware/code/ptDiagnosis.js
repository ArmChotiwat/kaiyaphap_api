/**
 * Middleware สำหรับ Route POST => /imd/masterdatatemplate/ptdiagnosis/create
 */
const template_PtDiagnosis_Save_Middleware = (req, res, next) => {
    const payload = req.body;
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        if(typeof payload.name != 'string' || payload.name == ''){ ErrorJson.description.push(`Paratmer <name> mest be String and Not Empty`);}
        if(ErrorJson.description.length != 0) { res.status(400).json(ErrorJson).end(); }
        else { next(); }
    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(400).json(ErrorJson).end();
    }
};


module.exports = {
    template_PtDiagnosis_Save_Middleware,
};