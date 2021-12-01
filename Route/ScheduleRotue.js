// *** Route => /schedule
const express = require('express');
const router = express.Router();
const { jwtDecode_Login_StoreBranchController } = require('../Controller/JwtController/index');
const { checkAgentId } = require('../Controller/miscController');

router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);

// GET => /schedule/appointment/:storeid/:branchid
const appointmentController = require('../Controller/ScheduleController').appointmentController;
const findScheduleAppointmentNowToFutureController = appointmentController.findScheduleAppointmentNowToFutureController;
router.get(
    '/appointment/:storeid/:branchid',
    async (req, res) => {
        try {
            const { storeid, branchid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else {
                    const getResult = await findScheduleAppointmentNowToFutureController(
                        {
                            _storeid: storeid,
                            _branchid: branchid
                        },
                        (err) => { if (err) { throw err; } }
                    );
                    if (!getResult) { res.status(200).end(); }
                    else {
                        res.status(200).json(getResult).end();
                    }
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// GET => /schedule/chacknextvisit/
const ChackNextVisitMiddleware = require('../Middleware/ScheduleMiddleware').Chack_Next_Visit_Controller
const ChackNextVisitController = require('../Controller/ScheduleController').Chack_Next_Visit_Controller;
router.get(
    '/chacknextvisit',
    ChackNextVisitMiddleware,
    async (req, res) => {
        try {
            /**
             ** Query Params => {
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId },
                    "patientid": { type: StringObjectId },
                    "scheduleid": { type: StringObjectId },
                }
            */
            const { storeid, branchid, patientid, scheduleid } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else {
                    const getResult = await ChackNextVisitController(
                        {
                            _storeid: storeid,
                            _branchid: branchid,
                            _patientid: patientid,
                            _scheduleid: scheduleid,
                        },
                        (err) => { if (err) { throw err; } }
                    );
                    if (!getResult) { res.status(200).end(); }
                    else {
                        res.status(200).json(getResult).end();
                    }
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);
// POST => /schedule/save
const schedule_Save_New_Middleware = require('../Middleware/ScheduleMiddleware').schedule_Save_New_Middleware
const schedule_Save_New_Controller = require('../Controller/ScheduleController').schedule_Save_New_Controller;
router.post( // จองคิว
    '/save',
    schedule_Save_New_Middleware,
    async (req, res) => {
        try {

            /**
             ** JSON  => {
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId },
                    "patientid": { type: StringObjectId },   
                    "agentid": { type: StringObjectId },   
                    "data_schedule" : {
                        dateFrom_string : { type: StringDate } YYYY-MM-DD
                        timeFrom_string : { type: StringTime } HH:mm
                        dateTo_string :{ type: StringDate } YYYY-MM-DD
                        timeTo_string : { type: StringTime } HH:mm
                        detail : { type: String} 
                    }                 
                       
                }
            */
            const { storeid, branchid, agentid, patientid, data_schedule } = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }

            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else {
                    const saveSchedule = await schedule_Save_New_Controller(
                        {
                            _storeid: String(jwtDecodeToekn._ref_storeid),
                            _branchid: String(jwtDecodeToekn._ref_branchid),
                            _agentid: String(agentid),
                            _patientid: String(patientid),
                            data_schedule: data_schedule
                        },

                        (err) => { if (err) { throw err; } }
                    );
                    if (!saveSchedule) { res.status(422).end(); }
                    else { res.status(201).json(saveSchedule).end(); }
                }

            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// GET => /schedule/view
const view_Schedule_Middleware = require('../Middleware/ScheduleMiddleware').view_Schedule_Middleware
const view_schedule_controller = require('../Controller/ScheduleController').view_schedule_controller;
router.get(
    '/view',
    view_Schedule_Middleware,
    async (req, res) => {
        try {
            /**
             ** Query Params => {
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId },
                    "tabledate" : { type: StringObjectId },
                }
            */
            const { storeid, branchid, tabledate } = req.query;
            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else {
                    const getResult = await view_schedule_controller(
                        {
                            _storeid: storeid,
                            _branchid: branchid,
                            _agentid: String(jwtDecodeToekn._ref_agent_userid),
                            tabledate: tabledate,
                        },
                        (err) => { if (err) { throw err; } }
                    );
                    if (!getResult) { res.status(200).end(); }
                    else {
                        res.status(200).json(getResult).end();
                    }
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// PATCH => /schedule/cancel
// ยกเลิกการจอง
const schedule_Cancel_Middleware = require('../Middleware/ScheduleMiddleware').schedule_Cancel_Middleware
const schedule_Cancel_Controller = require('../Controller/ScheduleController').schedule_Cancel_Controller;
router.patch(
    '/cancel',
    schedule_Cancel_Middleware,
    async (req, res) => {
        try {
            /**
             ** JSON => {
                    "_ref_storeid": { type: StringObjectId },
                    "_ref_branchid": { type: StringObjectId },
                    "_ref_scheduleid:" : { type: StringObjectId },
                }
            */
            const { _ref_storeid, _ref_branchid, _ref_scheduleid } = req.body;
            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);
            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== _ref_storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== _ref_branchid) { res.status(401).end(); }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else {
                    const getResult = await schedule_Cancel_Controller(
                        {
                            _storeid: _ref_storeid,
                            _branchid: _ref_branchid,
                            _agentid: String(jwtDecodeToekn._ref_agent_userid),
                            _scheduleid: _ref_scheduleid

                        },
                        (err) => { if (err) { throw err; } }
                    );

                    if (!getResult) {
                        res.status(422).end();
                    }
                    else {
                        res.status(201).json(getResult).end();
                    }
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// GET => /schedule/viewtoday/finished
const view_Schdule_Today_Finished_Middleware = require('../Middleware/ScheduleMiddleware').view_Schdule_Today_Finished_Middleware
const view_Schedule_Todey_Finished_Controller = require('../Controller/ScheduleController').view_Schedule_Todey_Finished_Controller;
router.get(
    '/viewtoday/finished',
    view_Schdule_Today_Finished_Middleware,
    async (req, res) => {
        try {
            /**
             ** Query Params => {
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId },
                    "getdate" : { type: StringObjectId },
                }
            */
            const { storeid, branchid, getdate } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else {
                    const getResult = await view_Schedule_Todey_Finished_Controller(
                        {
                            _storeid: storeid,
                            _branchid: branchid,
                            _agentid: String(jwtDecodeToekn._ref_agent_userid),
                            getdate: getdate
                        },
                        (err) => { if (err) { throw err; } }
                    );
                    if (!getResult) { res.status(200).end(); }
                    else {
                        res.status(200).json(getResult).end();
                    }
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// GET => /schedule/viewtoday
const view_Schedule_Todey_Middleware = require('../Middleware/ScheduleMiddleware').view_Schedule_Todey_Middleware
const view_Schedule_Todey_Controller = require('../Controller/ScheduleController').view_Schedule_Todey_Controller;
router.get(
    '/viewtoday',
    view_Schedule_Todey_Middleware,
    async (req, res) => {
        try {
            /**
             ** Query Params => {
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId }
                }
            */
            const { storeid, branchid } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else {
                    const getResult = await view_Schedule_Todey_Controller(
                        {
                            _storeid: storeid,
                            _branchid: branchid,
                            _agentid: String(jwtDecodeToekn._ref_agent_userid)
                        },
                        (err) => { if (err) { throw err; } }
                    );
                    if (!getResult) { res.status(200).end(); }
                    else {
                        res.status(200).json(getResult).end();
                    }
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// PATCH => /schedule/confirm
//const ChackNextVisitMiddleware = require('../Middleware/ScheduleMiddleware').Chack_Next_Visit_Controller
const schedule_Confirm_Controller = require('../Controller/ScheduleController').schedule_Confirm_Controller;
router.patch(
    '/confirm',
    //ChackNextVisitMiddleware,
    async (req, res) => {
        try {
            /**
             ** JSON => {
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId },
                    "scheduleid" : { type: StringObjectId },
                }
            */
            const { _scheduleid } = req.body;
            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);
            if (!jwtDecodeToekn) { res.status(401).end(); }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid)
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else {
                    const getResult = await schedule_Confirm_Controller(
                        {
                            _storeid: String(jwtDecodeToekn._ref_storeid),
                            _branchid: String(jwtDecodeToekn._ref_branchid),
                            _agentid: String(jwtDecodeToekn._ref_agent_userid),
                            _scheduleid: _scheduleid,
                        },
                        (err) => { if (err) { throw err; } }
                    );
                    if (!getResult) { res.status(422).end(); }
                    else {
                        res.status(201).json(getResult).end();
                    }
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// PUT => /schedule/edit
// แก้ไข นัดหมาย
const schedule_Edit_Middleware = require('../Middleware/ScheduleMiddleware').schedule_Edit_Middleware;
const schedule_Edit_Controller = require('../Controller/ScheduleController').schedule_Edit_Controller;
router.put(
    '/edit',
    schedule_Edit_Middleware,
    async (req, res) => {
        try {
            /**
             ** JSON  => {
                    "_ref_storeid": { type: StringObjectId },
                    "_ref_branchid": { type: StringObjectId },
                    "_ref_scheduleid": { type: StringObjectId },  
                    "_ref_agent_userstoreid": { type: StringObjectId },  
                    "data_schedule" : {
                        "dateFrom_string": { type: StringDate } YYYY-MM-DD
                        "timeFrom_string": { type: StringTime } HH:mm:ss
                        "dateTo_string": { type: StringDate } YYYY-MM-DD
                        "timeTo_string": { type: StringTime } HH:mm:ss
                        "detail": { type: String } 
                    }
                }
            */
            const { _ref_storeid, _ref_branchid, _ref_agent_userstoreid, _ref_scheduleid, data_schedule } = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== _ref_storeid) { console.log(1); res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== _ref_branchid) { console.log(2); res.status(401).end(); }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else if (chkAgent.role !== 1) { res.status(401).end(); }
                else {
                    const saveSchedule = await schedule_Edit_Controller(
                        {
                            _storeid: String(jwtDecodeToekn._ref_storeid),
                            _branchid: String(jwtDecodeToekn._ref_branchid),
                            _agentid: String(_ref_agent_userstoreid),
                            _scheduleid: String(_ref_scheduleid),
                            data_schedule: data_schedule
                        },

                        (err) => { if (err) { throw err; } }
                    );

                    if (!saveSchedule) { res.status(422).end(); }
                    else {
                        res.status(201).json(saveSchedule).end();
                    }
                }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// GET => /schedule/viewbyagent
//const ChackNextVisitMiddleware = require('../Middleware/ScheduleMiddleware').Chack_Next_Visit_Controller
const view_Schdule_By_Agen_Controller = require('../Controller/ScheduleController').view_Schdule_By_Agen_Controller;
router.get(
    '/viewbyagent',
    //ChackNextVisitMiddleware,
    async (req, res) => {
        try {
            /**
             ** Query Params => {
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId },
                    "getdate" : { type: StringObjectId },
                }
            */
            const { storeid, branchid, getdate } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else {
                    const getResult = await view_Schdule_By_Agen_Controller(
                        {
                            _storeid: storeid,
                            _branchid: branchid,
                            _agentid: String(jwtDecodeToekn._ref_agent_userid),
                            getdate: getdate,
                        },
                        (err) => { if (err) { throw err; } }
                    );
                    if (!getResult) { res.status(200).end(); }
                    else {
                        res.status(200).json(getResult).end();
                    }
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// GET => /schedule/viewbyagent/mouth
const view_Schdule_Montht_By_Agen_Controller = require('../Controller/ScheduleController').view_Schdule_Montht_By_Agen_Controller;
router.get(
    '/viewbyagent/mouth',
    //ChackNextVisitMiddleware,
    async (req, res) => {
        try {
            /**
             ** Query Params => {
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId },
                    "getdate" : { type: StringObjectId },
                }
            */
            const { storeid, branchid, getdate } = req.query;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {                
                const chkAgent = await checkAgentId(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!chkAgent) { res.status(401).end(); }
                else {
                    const getResult = await view_Schdule_Montht_By_Agen_Controller(
                        {
                            _storeid: storeid,
                            _branchid: branchid,
                            _agentid: String(chkAgent._agentid),
                            getdate: getdate,
                        },
                        (err) => { if (err) { throw err; } }
                    );
                    if (!getResult) { res.status(200).end(); }
                    else {
                        res.status(200).json(getResult).end();
                    }
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

module.exports = router;