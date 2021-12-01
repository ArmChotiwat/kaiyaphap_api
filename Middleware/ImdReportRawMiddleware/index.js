const patientRegisterInStoreTimelineMiddleware = require('./code/patientRegisterInStoreTimeline');
const countPatientInStoreMiddleware = require('./code/countPatientInStore');

module.exports = {
    patientRawReportMiddleware: {
        patientRegisterInStoreTimelineMiddleware,
        countPatientInStoreMiddleware,
    },
};