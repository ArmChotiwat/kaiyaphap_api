const checkAgent_Personal_Certificate = async (
    certificate = {
        certificatedCode: '',
        certificatedExpired: '',
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'checkAgent_Personal_EducateaHistory';

    const { validate_StringOrNull_AndNotEmpty }  = require('../../miscController');

    if (typeof certificate != 'object') { callback(new Error(`${controllerName}: <certificate> must be Object`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(certificate.certificatedCode)) { callback(new Error(`${controllerName}: <certificate.certificatedCode> must be String or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(certificate.certificatedExpired)) { callback(new Error(`${controllerName}: <certificate.certificatedExpired> must be String or Null and Not Empty`)); return; }
    else {
        callback(null);
        return {
            certificatedCode: certificate.certificatedCode,
            certificatedExpired: certificate.certificatedExpired,
        };
    }
};


module.exports = checkAgent_Personal_Certificate;