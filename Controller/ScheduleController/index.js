const appointmentController = require('./code/appointment');
const Chack_Next_Visit_Controller = require('./code/ChackNextVisitController');
const schedule_Save_Controller =require('./code/scheduleSaveController');
const schedule_Save_New_Controller = require('./code/scheduleSaveNewController');
const view_schedule_controller = require('./code/viewScheduleController');
const view_Schedule_Todey_Controller = require('./code/viewScheduleTodeyController');
const schedule_Cancel_Controller = require('./code/scheduleCancelController');
const schedule_Confirm_Controller = require('./code/scheduleConfirmController');
const schedule_Edit_Controller = require('./code/scheduleEditController');
const view_Schdule_By_Agen_Controller = require('./code/viewSchduleByAgenController');
const view_Schedule_Todey_Finished_Controller = require('./code/viewSchduleTodayFinishedController');
const view_Schdule_Montht_By_Agen_Controller = require('./code/viewSchduleMonthtByAgenController')
module.exports = {
    appointmentController,
    Chack_Next_Visit_Controller,
    schedule_Save_Controller,
    schedule_Save_New_Controller,
    view_schedule_controller,
    view_Schedule_Todey_Controller,
    schedule_Cancel_Controller,
    schedule_Confirm_Controller,
    schedule_Edit_Controller,
    view_Schdule_By_Agen_Controller,
    view_Schedule_Todey_Finished_Controller,
    view_Schdule_Montht_By_Agen_Controller,
};