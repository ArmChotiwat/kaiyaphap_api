const Chack_Next_Visit_Controller = require('./code/ChackNextVisitMiddleware');
const schedule_Save_Middleware = require('./code/scheduleSaveMiddleware');
const schedule_Save_New_Middleware = require('./code/scheduleSaveNewMiddleware');
const view_Schedule_Middleware = require('./code/viewScheduleMiddleware');
const schedule_Cancel_Middleware = require('./code/scheduleCancelMiddleware');
const view_Schdule_Today_Finished_Middleware =require('./code/viewSchduleTodayFinishedMiddleware');
const view_Schedule_Todey_Middleware = require('./code/viewScheduleTodeyMiddleware');
const schedule_Edit_Middleware = require('./code/scheduleEditMiddleware');
module.exports = {
    Chack_Next_Visit_Controller,
    schedule_Save_Middleware,
    schedule_Save_New_Middleware,
    view_Schedule_Middleware,
    schedule_Cancel_Middleware,
    view_Schdule_Today_Finished_Middleware,
    view_Schedule_Todey_Middleware,
    schedule_Edit_Middleware,
};