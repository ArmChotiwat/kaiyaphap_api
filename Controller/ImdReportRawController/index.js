const countPatientInStoreController = require('./code/countPatientInStore');
const countPatientInStoreFilterByGenderController = require('./code/countPatientInStoreFilterByGender');
const patientRegisterInStoreTimelineController = require('./code/patientRegisterInStoreTimeline');
const countAgePatientStoreController = require('./code/countAgePatientStore');
const countScheduleAllFilterByStoreController = require('./code/countScheduleAllFilterByStore');
const countScheduleAllFilterByStoreAndMonthController = require('./code/countScheduleAllFilterByStoreAndMonth');
const countScheduleAllFilterByStoreWithBranchController = require('./code/countScheduleAllFilterByStoreWithBranch');
const countScheduleAllFilterByStoreWithBranchAndMonthController = require('./code/countScheduleAllFilterByStoreWithBranchAndMonth');
const countRevinueStoreAndCountVisitController = require('./code/countRevinueStoreAndCountVisit')
const sumRevinueStoreForIncomeController =require('./code/sumRevinueStoreForIncome')
module.exports = {
    patientRawReportController: {
        countPatientInStoreController,
        countPatientInStoreFilterByGenderController,
        patientRegisterInStoreTimelineController,
        countAgePatientStoreController,
        countScheduleAllFilterByStoreController,
        countScheduleAllFilterByStoreAndMonthController,
        countScheduleAllFilterByStoreWithBranchController,
        countScheduleAllFilterByStoreWithBranchAndMonthController,
        countRevinueStoreAndCountVisitController,
        sumRevinueStoreForIncomeController
    },
}