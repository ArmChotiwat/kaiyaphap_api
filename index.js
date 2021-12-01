//index.js
/* import library ที่จำเป็นทั้งหมด */
const { KYP_System_API_Version } = require('./Config/cfg_version');
const mongoURI = require('./Config/cfg_mongodb');
const checkObjectId = require('./Controller/miscController').checkObjectId;

const express = require("express");
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const jwt = require("jwt-simple");
// const passport = require("passport");
const mongoose = require('./Config/Engine_mongodb').mongoose;
const cors = require('./Config/Engine_corsOrigin');
const momnet = require('moment');
const morgan = require('morgan');
// const excel4node = require('excel4node');
const mailTransporter = require('./Config/Engine_mailSender');
const jwtDecodeData = require('./Controller/miscController').jwtDecodeData;

const EXPRESSPORT = parseInt(process.env.HTTPPORT) || 8801;
const { JWT_SECRET } = require('./Config/cfg_crypto');
const kaiyaphap_email = process.env.ADMINEMAIL || 'kaiyaphap@imd.co.th';
const corsOrigin = process.env.CORSURL || '*';
const morganLogLevel = require('./Config/cfg_morganLog');
const fs = require('fs');
const accessLogStream = fs.createWriteStream(`./Log/MorganAccess_${momnet().format('YYYYMMDD_HHmmss')}.log`, { flags: 'a' });

// const no_reply_server = process.env.NOREPLYSERVER || 'mail.imd.co.th';
const no_reply_email = process.env.NOREPLYEMAIL || 'kaiyaphap@imd.co.th';
// const no_reply_password = process.env.NOREPLYPASSWORD || 'rsP8KVHwzP';

const regExReplace_Refactor_WhiteSpace = require('./Controller/miscController/code/regExReplace_Refactor_WhiteSpace');
const regExReplace_ClearWhiteSpaceStartEnd = require('./Controller/miscController/code/regExReplace_ClearWhiteSpaceStartEnd');
const { validate_StringOrNull_AndNotEmpty } = require('./Controller/miscController');

const app = express();
//#region Express Settings

// Express HTTP Log
app.use(morgan(morganLogLevel));
app.use(morgan(morganLogLevel, { stream: accessLogStream }));

// Express Cors Origin
app.use(cors); // Cors Origin Engine

// Express bodyParser
app.use(bodyParser.json()); // Convert req.body to JSON-Object
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// Express Upload
app.use(fileUpload({
    createParentPath: true
}));

// Express Static File
app.use(express.static('./media/upload', { maxAge: 1000 * 10 })); // Media Storage at ./media/upload
app.use('/storage', express.static('./storage')); // file Storage at ./storage

//#endregion Express Settings



//var url = "mongodb://localhost:27017/imd_kaiyaparp";
//var url = "mongodb://192.168.11.34:27017/imd_kaiyaparp";
//var url = "mongodb://root:1qaz2wsx@192.168.12.23:27017/imd_kaiyaparp?authSource=admin&readPreference=primary&ssl=false"
// const url = require('./Config/cfg_mongodb');
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.connect(mongoURI);


/*****************Model*********************/
const agentModel = require('./Model/AgentModel');
const patientModel = require('./Model/PatientModel')
const storeModel = require('./Model/StoreModel');
const treatmentStoreModel = require('./Model/TreatmentStore');
const scheduleModel = require('./Model/ScheduleModel');
const provinceModel = require('./Model/ProvinceModel');
const amphureModel = require('./Model/AmphureModel');
const districtModel = require('./Model/DistrictModel');
const occupationModel = require('./Model/OccupationModel');
const timeschedule = require('./Model/TimeSchedule');
const illnessModel = require('./Model/IllnessModel');
const illnessCharacticModel = require('./Model/IllnessCharacticModel');
const logresetpasswordModel = require('./Model/LogResetPasswordModel');
const logLoginModel = require('./Model/LoginLogModel');
const templateIllnessModel = require('./Model/TemplateIllnessModel');
const temppateIllCharacticModel = require('./Model/TempIllnessCharacticModel');
const thday = new Array("อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์");
const thmonth = new Array("มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม");
/******************Model********************/

const requireJWTAuth = require("./Middleware/jwt");
const jwtLogin_Agent_StoreBranchMiddleware = require('./Middleware/JwtMiddleware').jwtLogin_Agent_StoreBranchMiddleware;

//เสียบ middleware ยืนยันตัวตน JWT เข้าไป
app.get("/", jwtLogin_Agent_StoreBranchMiddleware, (req, res) => {
    const returnJson = {
        sucess: "1"
    }
    res.status(200).json(returnJson).end();
});


//#region MiddleWare
const logLogin = {
    saveAdmin: async (agentid, username, jwtPayload) => {
        const payloadTemplate = {
            _agentid: mongoose.Types.ObjectId(agentid),
            username: username,
            jwtToken: jwtPayload,
            datetime: new Date(),
        };
        const logLoginTemplate = new logLoginModel(payloadTemplate);
        await logLoginTemplate.save(
            (errors) => { if (errors) { return true } else { return false } }
        );
    },
    middleware: async (req, res, next) => {

    }
}
//#endregion MiddleWare

//#region Controller

const registerPatientController_AutoIncresement = require('./Controller/RegisterController').registerPatientController_AutoIncresement;
const autoincresementController = {
    get: async (_storeid = new String, personal_idcard = new String) => {
        const _zeroFill = (incmentNumber = Number, widthZero = Number || 6) => {
            let yearToday = momnet().add(543, 'years').format('YY');
            let resultZerofill = incmentNumber.toString().padStart(widthZero, '0');
            return resultZerofill + "/" + yearToday
        };
        try {
            const getAI = await registerPatientController_AutoIncresement(
                {
                    _storeid: _storeid,
                    personal_idcard: personal_idcard
                }
            );
            return _zeroFill(parseInt(getAI.seq), 6)
        } catch (error) {
            return _zeroFill(1, 6);
        }
    },
};
//#endregion Controller


//#region Register Module
// app.post(
//     '/register/agent',
//     jwtLogin_Agent_StoreBranchMiddleware,
//     async (req, res) => {
//         const payload = req.body;
//         payload.store[0].avatarUrl = '';
//         payload.store[0].userRegisterDate = momnet().format("YYYY-MM-DD");
//         const { chackEmailLowerCase } = require('./Controller/miscController')
//         const mail_username =await chackEmailLowerCase(payload.username, (err) => { if (err) { callback(err); return; } })
//         const findUserExists = await agentModel.aggregate(
//             [
//                 {
//                     '$match': {
//                         'username': mail_username
//                     }
//                 }
//             ]
//         );
//         if (findUserExists.length === 0) {
//             const Agent = new agentModel(payload);
//             await Agent.save(
//                 (errors, model) => {
//                     if (errors) {
//                         res.status(422).json(errors).end();
//                     }
//                     else {
//                         res.status(201).json(model).end()
//                     }
//                 }
//             );
//         }
//         else if (findUserExists.length === 1) {
//             const findStoreExists = await agentModel.aggregate(
//                 [
//                     {
//                         '$match': {
//                             '_id': mongoose.Types.ObjectId(findUserExists[0]._id)
//                         }
//                     }, {
//                         '$unwind': {
//                             'path': '$store'
//                         }
//                     }, {
//                         '$match': {
//                             'store._storeid': mongoose.Types.ObjectId(payload.store[0]._storeid)
//                         }
//                     }
//                 ]
//             );
//             if (findStoreExists.length === 0) {
//                 const Agent = new agentModel(payload);
//                 await agentModel.updateOne(
//                     {
//                         '_id': findUserExists[0]._id
//                     },
//                     {
//                         "$addToSet": { "store": Agent.store }
//                     },
//                     (errors) => {
//                         if (errors) { res.status(422).end(); }
//                         else { res.status(201).end(); }
//                     }
//                 );
//             }
//             else if (findStoreExists.length === 1) { res.status(501).end(); }
//         }
//         else {
//             res.status(500).end();
//         }
//     }
// );

app.post( // Upload Image For Agent
    '/register/upload/:userid/:agentid',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const { userid, agentid } = req.params;
        try {
            let fileReq = req.files.file;
            let extensions = "." + (fileReq.name.split("."))[fileReq.name.split(".").length - 1]
            if (typeof fileReq != 'object' || typeof fileReq == 'undefined') { res.status(422).send('error object').end(); }
            else {
                await fileReq.mv(
                    './media/upload/' + agentid + extensions,
                    (errors) => {
                        if (errors) { res.status(500).end(); }
                    }
                );
                await agentModel.updateOne(
                    {
                        "_id": mongoose.Types.ObjectId(userid),
                        "store._id": mongoose.Types.ObjectId(agentid)
                    },
                    {
                        "$set": {
                            "store.$.avatarUrl": '/' + agentid + extensions
                        }
                    },
                    (errors, model) => {
                        if (errors) {
                            res.status(500).end();
                        }
                        else {
                            res.status(200).json().end();
                        }
                    }
                )
            }
        } catch (error) {
            res.status(422).send(error).end();
        }
    }
);
//#endregion Register Module

//#region edit agent / patient
app.put('/user/agent/edit',
    jwtLogin_Agent_StoreBranchMiddleware,
    async function (req, res) {
        const payload = req.body;
        const findAgentid = await agentModel.aggregate(
            [
                {
                    '$match': {
                        '_id': mongoose.Types.ObjectId(payload.data._id),
                        'store._storeid': mongoose.Types.ObjectId(payload.data.store[0]._storeid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store'
                    }
                }, {
                    '$match': {
                        '_id': mongoose.Types.ObjectId(payload.data._id),
                        'store._storeid': mongoose.Types.ObjectId(payload.data.store[0]._storeid)
                    }
                }
            ]
        );
        if (findAgentid.length !== 1) { res.status(404).end(); }
        else {
            payload.data.store[0]._id = findAgentid[0].store._id;
            payload.data.store[0]._storeid = payload.data.store[0]._storeid;
            await agentModel.updateOne(
                {
                    '_id': mongoose.Types.ObjectId(payload.data._id),
                    'store._id': mongoose.Types.ObjectId(findAgentid[0].store._id),
                    'store._storeid': mongoose.Types.ObjectId(payload.data.store[0]._storeid)
                },
                {
                    '$set': {
                        'store.$': payload.data.store[0]
                    }
                },
                (errors) => {
                    if (errors) { res.status(422).end(); }
                    else {
                        res.status(200).json(
                            {
                                "_userid": payload.data._id,
                                "_agentid": findAgentid[0].store._id,
                                "_storeid": payload.data.store[0]._storeid,
                            }
                        ).end();
                    }
                }
            );

        }
    }
);
app.patch(
    '/user/agent/update/status',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const payload = req.body;
        if (
            typeof payload._userid == 'undefined' ||
            typeof payload._agentid == 'undefined' ||
            typeof payload._storeid == 'undefined'
        ) { res.status(400).end(); }
        else {
            const _userid = payload._userid;
            const _agentid = payload._agentid;
            const _storeid = payload._storeid;
            const findAgent = await agentModel.aggregate(
                [
                    {
                        '$project': {
                            '_id': 1,
                            'store._id': 1,
                            'store._storeid': 1,
                            'store.user_status': 1
                        }
                    }, {
                        '$unwind': {
                            'path': '$store'
                        }
                    }, {
                        '$match': {
                            '_id': mongoose.Types.ObjectId(_userid),
                            'store._id': mongoose.Types.ObjectId(_agentid),
                            'store._storeid': mongoose.Types.ObjectId(_storeid)
                        }
                    }
                ]
            );
            if (findAgent.length === 0) { res.status(404).end(); }
            else if (findAgent.length === 1) {
                await agentModel.updateOne(
                    {
                        '_id': mongoose.Types.ObjectId(_userid),
                        'store._id': mongoose.Types.ObjectId(_agentid),
                        'store._storeid': mongoose.Types.ObjectId(_storeid),
                    },
                    {
                        '$set': {
                            'store.$.user_status': !findAgent[0].store.user_status
                        }
                    },
                    (errors) => {
                        if (errors) { res.status(500).end(); }
                        else { res.status(200).end(); }
                    }
                );
            }
            else { res.status(422).end(); }
        }
    }
);
app.patch(
    '/user/agent/update/password',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const payload = req.body;
        if (
            typeof payload.userid == 'undefined' ||
            typeof payload.oldpassword == 'undefined' ||
            typeof payload.newpassword == 'undefined' ||
            payload.oldpassword == payload.newpassword
        ) { res.status(400).end(); }
        else {
            const findUser = await agentModel.findOne(
                {
                    "_id": payload.userid,
                    "password": payload.oldpassword
                },
                (errors) => {
                    if (errors) { res.status(422).end(); }
                }
            );
            if (!findUser) { res.status(404).end(); }
            else {
                await agentModel.updateOne(
                    {
                        "_id": mongoose.Types.ObjectId(payload.userid)
                    },
                    {
                        "password": payload.newpassword
                    },
                    (errors) => {
                        if (errors) { res.status(422).end(); }
                        else { res.status(200).end(); }
                    }
                );
            }
        }
    }
);

app.patch(
    '/user/agent/update/resetpassword',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const payload = req.body;
        if (
            typeof payload.userid == 'undefined' ||
            typeof payload.newpassword == 'undefined'
        ) { res.status(400).end(); }
        else {
            const findUser = await agentModel.findOne(
                {
                    "_id": payload.userid,
                },
                (errors) => {
                    if (errors) { res.status(422).end(); }
                }
            );
            if (!findUser) { res.status(404).end(); }
            else {
                await agentModel.updateOne(
                    {
                        "_id": mongoose.Types.ObjectId(payload.userid)
                    },
                    {
                        "password": payload.newpassword
                    },
                    (errors) => {
                        if (errors) { res.status(422).end(); }
                        else { res.status(200).end(); }
                    }
                );
            }
        }
    }
);

app.post(
    '/user/agent/email/resetpassword',
    async (req, res) => {
        const payload = req.body;
        if (
            typeof payload.username == 'undefined' ||
            typeof payload.username == ''
        ) { res.status(400).end(); }
        else {
            const findAgent = await agentModel.findOne(
                {
                    'username': payload.username
                }
            );
            if (!findAgent) { res.status(404).end(); }
            else {
                const confirmAgent = await agentModel.aggregate(
                    [
                        {
                            '$match': {
                                '_id': mongoose.Types.ObjectId(findAgent._id),
                                'username': payload.username
                            }
                        }
                    ]
                );
                if (confirmAgent.length === 0) { res.status(404).end(); }
                else {
                    const findlogPW = await logresetpasswordModel.findOne(
                        {
                            _userid: mongoose.Types.ObjectId(confirmAgent[0]._id),
                            isused: false,
                            username: confirmAgent[0].username
                        }
                    );
                    if (!findlogPW) {
                        const logResetPWModel = new logresetpasswordModel(
                            {
                                _userid: mongoose.Types.ObjectId(confirmAgent[0]._id),
                                isused: false,
                                username: confirmAgent[0].username
                            }
                        );
                        await logResetPWModel.save(
                            (errors, info) => {
                                if (errors) { res.status(500).end(); }
                                else {
                                    let mailOptions = {
                                        from: no_reply_email,                // sender
                                        to: confirmAgent[0].username,                // list of receivers
                                        subject: 'KAIYAPHAP: Reset password for KAIYAPHAP',              // Mail subject
                                        html: '<dir style="box-sizing: border-box; text-align: center; border: 10px solid #4caf50; padding: 0px 0px 0px 0px"><h1 style="color:#4caf50; text-align: center; margin: 0% 10% 0% 10%;">เรียนคุณ ' + confirmAgent[0].store[0].personal.first_name + '</h1><br><dir><p style="font-size:130%; margin: 0% 10% 0% 10%; color:Black; text-align: center; padding: 0px 0px 0px 0px;">นี่คือรหัสสำหรับการเปลี่ยนรหัสผ่านใหม่<br>โปรดนำรหัสด้านล่างนี้ไปกรอกในระบบ ที่ช่อง<b>รหัสรีเซ็ท</b> จากนั้นให้กรอกรหัสผ่านใหม่ที่ต้องการลงในช่อง<b>รหัสผ่าน</b></p></dir><h1 style="background-color:#4caf50; color:White; text-align: center; margin: 0% 10% 0% 10%;">' + logResetPWModel._id + '</h1><br><p style="font-size:130%; margin: 0% 10% 0% 10%; color:Red; text-align: center;">***นี่เป็น Email ที่ส่งอัตโนมัติโดยระบบกายภาพ กรุณาอย่าตอบกลับ***</p><p style="font-size:130%; margin: 0% 10% 0% 10%; color:Red; text-align: center;">***This email was sent by the KAIYAPHAP automated emailing system.  Please do not reply.***</p></dir>'   // HTML body
                                    }; 
                                    mailTransporter.sendMail(
                                        mailOptions,
                                        function (err, info) {
                                            if (err) { console.log(err); res.status(500).end(); }
                                            else { res.status(200).end(); }
                                        }
                                    );
                                }
                            }
                        );
                    }
                    else {
                        let mailOptions = {
                            from: 'kaiyaphap@imd.co.th',                // sender
                            to: confirmAgent[0].username,                // list of receivers
                            subject: 'KAIYAPHAP: Reset password for KAIYAPHAP',              // Mail subject
                            html: '<dir style="box-sizing: border-box; text-align: center; border: 10px solid #4caf50; padding: 0px 0px 0px 0px"><h1 style="color:#4caf50; text-align: center; margin: 0% 10% 0% 10%;">เรียนคุณ ' + confirmAgent[0].store[0].personal.first_name + '</h1><br><dir><p style="font-size:130%; margin: 0% 10% 0% 10%; color:black; text-align: center; padding: 0px 0px 0px 0px;">นี่คือรหัสสำหรับการเปลี่ยนรหัสผ่านใหม่<br>โปรดนำรหัสด้านล่างนี้ไปกรอกในระบบ ที่ช่อง<b>รหัสรีเซ็ท</b> จากนั้นให้กรอกรหัสผ่านใหม่ที่ต้องการลงในช่อง<b>รหัสผ่าน</b></p></dir><h1 style="background-color:#4caf50; color:White; text-align: center; margin: 0% 10% 0% 10%;">' + findlogPW._id + '</h1><br><p style="font-size:130%; margin: 0% 10% 0% 10%; color:Red; text-align: center;">***นี่เป็น Email ที่ส่งอัตโนมัติโดยระบบกายภาพ กรุณาอย่าตอบกลับ***</p><p style="font-size:130%; margin: 0% 10% 0% 10%; color:Red; text-align: center;">***This email was sent by the KAIYAPHAP automated emailing system.  Please do not reply.***</p></dir>'   // HTML body
                        };;
                        mailTransporter.sendMail(
                            mailOptions,
                            function (err, info) {
                                if (err) { console.log(err); res.status(500).end(); }
                                else { res.status(200).end(); }
                            }
                        );
                    }

                }
            }
        }
    }
);

app.patch(
    '/user/agent/email/resetpassword',
    async (req, res) => {
        const payload = req.body;
        if (
            typeof payload.resetid == 'undefined' ||
            typeof payload.newpassword == 'undefined'
        ) { res.status(400).end(); }
        else {
            const findConfirm = await logresetpasswordModel.findOne(
                {
                    '_id': mongoose.Types.ObjectId(payload.resetid),
                    'isused': false
                },
                (errors) => {
                    if (errors) { res.status(500).end(); }
                }
            );
            if (!findConfirm) { res.status(404).end(); }
            else {
                await agentModel.updateOne(
                    {
                        "_id": mongoose.Types.ObjectId(findConfirm._userid)
                    },
                    {
                        'password': payload.newpassword
                    },
                    async (errors) => {
                        if (errors) { res.status(500).end(); }
                        else {
                            await logresetpasswordModel.updateOne(
                                {
                                    "_id": mongoose.Types.ObjectId(payload.resetid)
                                },
                                {
                                    'isused': true
                                },
                                (err) => {
                                    if (err) { res.status(500).end(); }
                                    else { res.status(200).end(); }
                                }
                            );
                        }
                    }
                );
            }
        }
    }
);

//#endregion edit agent / patient

//#region Check/Search Data patient

// app.get(
//     '/users/patient/:userid/:storeid',
//     jwtLogin_Agent_StoreBranchMiddleware,
//     async function (req, res) {
//         const { userid, storeid } = req.params;
//         const findUsers = await patientModel.aggregate(
//             [
//                 {
//                     '$match': {
//                         '_id': mongoose.Types.ObjectId(userid)
//                     }
//                 }, {
//                     '$unwind': {
//                         'path': '$store'
//                     }
//                 }, {
//                     '$match': {
//                         'store._storeid': mongoose.Types.ObjectId(storeid)
//                     }
//                 }
//             ]
//         );
//         if (findUsers.length === 0) {
//             res.status(404).end();
//         }
//         else {
//             findUsers[0].store.personal.referral = await findUsers[0].store.personal.referral || {};
//             findUsers[0].store.personal.referral.referral_name = await findUsers[0].store.personal.referral.referral_name || '';
//             findUsers[0].store.personal.vip_agent = await findUsers[0].store.personal.vip_agent || {};
//             findUsers[0].store.personal.vip_agent._agentid = await findUsers[0].store.personal.vip_agent._agentid || '';

//             res.status(200).json(findUsers[0]).end();
//         }
//     }
// );
//#endregion Check/Search Data patient

//#region Check/Search Data agnet
// app.get(
//     '/users/agent/:userid/:storeid',
//     jwtLogin_Agent_StoreBranchMiddleware,
//     async function (req, res) {
//         const { userid, storeid } = req.params;
//         const findUsers = await agentModel.aggregate(
//             [
//                 {
//                     '$match': {
//                         '_id': mongoose.Types.ObjectId(userid),
//                         'store._storeid': mongoose.Types.ObjectId(storeid)
//                     }
//                 }, {
//                     '$unwind': {
//                         'path': '$store'
//                     }
//                 }, {
//                     '$match': {
//                         '_id': mongoose.Types.ObjectId(userid),
//                         'store._storeid': mongoose.Types.ObjectId(storeid)
//                     }
//                 }
//             ]
//         );
//         if (findUsers.length === 0) {
//             res.status(404).end();
//         }
//         else {
//             res.status(200).json(findUsers[0]).end();
//         }
//     }
// );
//#endregion Check/Search Data agnet

// app.post('/login', async function (req, res) {
//   const payload = await req.body;
//   const findLoginUsers = await agentModel.aggregate(
//     [
//       {
//         '$match': {
//           'username': payload.username.toString(),
//           'password': payload.password.toString()
//         }
//       }
//     ]
//   );
//   if (findLoginUsers.length === 1) {

//     const payload = {
//       sub: findLoginUsers.username,
//       iat: new Date().getTime(),
//       _agentid: findLoginUsers[0]._id.toString(),
//       username: findLoginUsers[0].username.toString(),
//     };
//     const returnJson = {
//       _userid: findLoginUsers[0]._id.toString(),
//       username: findLoginUsers[0].username.toString(),
//       payload: jwt.encode(payload, SECRET)
//     };
//     res.status(200).json(returnJson).end();
//   }
//   else {
//     const returnJson = {
//       errors: "login failed"
//     };
//     res.status(422).json(returnJson).end();
//   }
// });

// app.get(
//   '/login/protal/:userid/:storeid/:branchid',
//   jwtLogin_Agent_StoreBranchMiddleware,
//   async (req, res) => {
//     const { userid, storeid, branchid } = req.params;
//     const findAgent = await agentModel.aggregate(
//       [
//         {
//           '$project': {
//             '_id': 1,
//             'store._id': 1,
//             'store._storeid': 1,
//             'store.role': 1,
//             'store.branch': 1,
//             'store.user_status': 1,
//             'store.personal.first_name': 1,
//             'store.personal.last_name': 1,
//           }
//         }, {
//           '$unwind': {
//             'path': '$store'
//           }
//         }, {
//           '$unwind': {
//             'path': '$store.branch'
//           }
//         }, {
//           '$match': {
//             '_id': mongoose.Types.ObjectId(userid),
//             'store._storeid': mongoose.Types.ObjectId(storeid),
//             'store.branch._branchid': mongoose.Types.ObjectId(branchid),
//             'store.user_status': true
//           }
//         }
//       ]
//     );
//     if (findAgent.length === 0) { res.status(404).json({ _agentid: '' }).end(); }
//     else {
//       const returnJson = {
//         _agentid: findAgent[0].store._id,
//         _role: findAgent[0].store.role,
//         firstname: findAgent[0].store.personal.first_name,
//         lastname: findAgent[0].store.personal.last_name,
//       }
//       res.status(200).json(returnJson).end();
//     }

//   }
// );

// app.post(
//   '/login/protal',
//   jwtLogin_Agent_StoreBranchMiddleware,
//   async function (req, res) {
//     const payload = req.body;
//     const findStoreUsers = await agentModel.aggregate(
//       [
//         {
//           '$match': {
//             '_id': mongoose.Types.ObjectId(payload.userid)
//           }
//         }, {
//           '$unwind': {
//             'path': '$store'
//           }
//         }, {
//           '$match': {
//             'store.user_status': true
//           }
//         }, {
//           '$unwind': {
//             'path': '$store.branch'
//           }
//         }, {
//           '$project': {
//             '_ref_agent_storeid': '$store._storeid',
//             '_ref_agent_branchid': '$store.branch._branchid'
//           }
//         }, {
//           '$lookup': {
//             'from': 'm_stores',
//             'localField': '_ref_agent_storeid',
//             'foreignField': '_id',
//             'as': 'lookup_store'
//           }
//         }, {
//           '$unwind': {
//             'path': '$lookup_store',
//             'includeArrayIndex': 'lookup_store_index',
//             'preserveNullAndEmptyArrays': true
//           }
//         }, {
//           '$match': {
//             'lookup_store_index': {
//               '$ne': null
//             }
//           }
//         }, {
//           '$unwind': {
//             'path': '$lookup_store.branch',
//             'includeArrayIndex': 'lookup_store_branch_index',
//             'preserveNullAndEmptyArrays': true
//           }
//         }, {
//           '$match': {
//             'lookup_store_branch_index': {
//               '$ne': null
//             }
//           }
//         }, {
//           '$addFields': {
//             'chkStore': {
//               '$cmp': [
//                 '$_ref_agent_storeid', '$lookup_store._id'
//               ]
//             },
//             'chkBranch': {
//               '$cmp': [
//                 '$_ref_agent_branchid', '$lookup_store.branch._id'
//               ]
//             }
//           }
//         }, {
//           '$match': {
//             'chkStore': {
//               '$eq': 0
//             },
//             'chkBranch': {
//               '$eq': 0
//             }
//           }
//         }, {
//           '$project': {
//             '_id': 0,
//             '_storeid': '$lookup_store._id',
//             'storename': '$lookup_store.name',
//             '_branchid': '$lookup_store.branch._id',
//             'branchname': '$lookup_store.branch.name',
//             'phone_number': '$lookup_store.branch.phone_number',
//             'address': '$lookup_store.branch.address'
//           }
//         }, {
//           '$sort': {
//             '_storeid': 1,
//             '_branchid': 1
//           }
//         }
//       ]
//     );
//     if (findStoreUsers.length === 0) {
//       res.status(404).end();
//     }
//     else {
//       res.send(findStoreUsers).end();
//     }
//   }
// );

// app.post(
//     '/search/patient',
//     jwtLogin_Agent_StoreBranchMiddleware,
//     async (req, res) => {
//         const payload = req.body;
//         let storedata = "";
//         if (typeof payload.storeid == 'undefined' || payload.storeid == "") { res.status(422).end(); }
//         else {
//             storedata = {
//                 '$match': { "store._storeid": mongoose.Types.ObjectId(payload.storeid) }
//             }
//         }

//         const regExCaseinsensetive = (stringdata) => {
//             return new RegExp(stringdata, 'i');
//         };

//         let findUserStatus = { '$match': {} }
//         if (typeof payload.user_status != 'undefined' && (payload.user_status === true || payload.user_status === false)) {
//             findUserStatus = { '$match': { "store.user_status": payload.user_status } }
//         }
//         let findIDcard = { '$match': {} }
//         if (typeof payload.idcard != 'undefined' && payload.idcard != "") {
//             findIDcard = { '$match': { "store.personal.identity_card.id": regExCaseinsensetive(payload.idcard) } }
//         }
//         let findEmail = { '$match': {} }
//         if (typeof payload.email != 'undefined' && payload.email != "") {
//             findEmail = { '$match': { "store.personal.email": regExCaseinsensetive(payload.email) } }
//         }
//         let findPreName = { '$match': {} }
//         if (typeof payload.pre_name != 'undefined' && payload.pre_name != "") {
//             findPreName = { '$match': { "store.personal.pre_name": regExCaseinsensetive(payload.pre_name) } }
//         }
//         let findFirstName = { '$match': {} }
//         if (typeof payload.first_name != 'undefined' && payload.first_name != "") {
//             findFirstName = { '$match': { "store.personal.first_name": regExCaseinsensetive(payload.first_name) } }
//         }
//         let findLastName = { '$match': {} }
//         if (typeof payload.last_name != 'undefined' && payload.last_name != "") {
//             findLastName = { '$match': { "store.personal.last_name": regExCaseinsensetive(payload.last_name) } }
//         }
//         let findHN = { '$match': {} }
//         if (typeof payload.hn != 'undefined' && payload.hn != "" && typeof payload.hn == 'string' || payload.hn === 0) {
//             findHN = { '$match': { "store.hn": regExCaseinsensetive(payload.hn) } }
//         }
//         let findHomeNumber = { '$match': {} }
//         if (typeof payload.homenumber != 'undefined' && payload.homenumber != "") {
//             findHomeNumber = { '$match': { "store.personal.contract_present.address_number": regExCaseinsensetive(payload.homenumber) } }
//         }
//         let findAlley = { '$match': {} }
//         if (typeof payload.alley != 'undefined' && payload.alley != "") {
//             findAlley = { '$match': { "store.personal.contract_present.alley": regExCaseinsensetive(payload.alley) } }
//         }
//         let findVillageNumber = { '$match': {} }
//         if (typeof payload.village_number != 'undefined' && payload.village_number != "") {
//             findVillageNumber = { '$match': { "store.personal.contract_present.village_number": regExCaseinsensetive(payload.village_number) } }
//         }
//         let findVillage = { '$match': {} }
//         if (typeof payload.village != 'undefined' && payload.village != "") {
//             findVillage = { '$match': { "store.personal.contract_present.village": regExCaseinsensetive(payload.village) } }
//         }
//         let findBuilding = { '$match': {} }
//         if (typeof payload.building != 'undefined' && payload.building != "") {
//             findBuilding = { '$match': { "store.personal.contract_present.building": regExCaseinsensetive(payload.building) } }
//         }
//         let findProvince = { '$match': {} }
//         if (typeof payload.province != 'undefined' && payload.province != "") {
//             findProvince = { '$match': { "store.personal.contract_present.province": regExCaseinsensetive(payload.province) } }
//         }
//         let findDistrict = { '$match': {} }
//         if (typeof payload.district != 'undefined' && payload.district != "") {
//             findDistrict = { '$match': { "store.personal.contract_present.district": regExCaseinsensetive(payload.district) } }
//         }
//         let findSubDistrict = { '$match': {} }
//         if (typeof payload.subdistrict != 'undefined' && payload.subdistrict != "") {
//             findSubDistrict = { '$match': { "store.personal.contract_present.sub_district": regExCaseinsensetive(payload.subdistrict) } }
//         }
//         let findPostCode = { '$match': {} }
//         if (typeof payload.postcode != 'undefined' && payload.postcode != "") {
//             findPostCode = { '$match': { "store.personal.contract_present.postcode": regExCaseinsensetive(payload.postcode) } }
//         }
//         let findPhoneNumber = { '$match': {} }
//         if (typeof payload.phone_number != 'undefined' && payload.phone_number != "") {
//             findPhoneNumber = { '$match': { "store.personal.phone_number": regExCaseinsensetive(payload.phone_number) } }
//         }
//         let findHnRef = { '$match': {} }
//         if (typeof payload.hn_ref != 'undefined' && payload.hn_ref != "") {
//             findPhoneNumber = { '$match': { "store.personal.hn_ref": regExCaseinsensetive(payload.hn_ref) } }
//         }

//         if (!storedata) {
//             res.status(422).send(payload).end();
//         }
//         else {

//             const aggdata = [

//                 storedata,
//                 {
//                     '$unwind': {
//                         'path': '$store'
//                     }
//                 },
//                 storedata,

//                 findUserStatus,
//                 findIDcard,
//                 findEmail,
//                 findPreName,
//                 findFirstName,
//                 findLastName,
//                 findHN,
//                 findHomeNumber,
//                 findAlley,
//                 findVillageNumber,
//                 findVillage,
//                 findBuilding,
//                 findProvince,
//                 findDistrict,
//                 findSubDistrict,
//                 findPostCode,
//                 findPhoneNumber,
//                 findHnRef,

//                 {
//                     '$addFields': {
//                         'split_hn': {
//                             '$split': [
//                                 '$store.hn', '/'
//                             ]
//                         }
//                     }
//                 }, {
//                     '$sort': {
//                         'split_hn.1': 1,
//                         'split_hn.0': 1
//                     }
//                 }
//             ];

//             const findPatient = await patientModel.aggregate(
//                 aggdata
//             );

//             if (findPatient.length === 0) { res.status(404).end(); }
//             else {
//                 const mapFindPatient = findPatient.map(
//                     (x, index) => (
//                         {
//                             run_number: index + 1,
//                             _userID: x._id,
//                             _storeID: x.store._storeid,
//                             hn: x.store.hn || "",
//                             hn_ref: x.store.hn_ref || "",
//                             role: 'patient',
//                             userRegisterDate: x.store.userRegisterDate,
//                             user_status: x.user_status,
//                             idcard: x.store.personal.identity_card.id,
//                             idstatus: x.store.personal.identity_card.id ? true : false,
//                             pre_name: x.store.personal.pre_name,
//                             special_prename: x.store.personal.special_prename,
//                             first_name: x.store.personal.first_name,
//                             last_name: x.store.personal.last_name,
//                             phone_number: x.store.personal.phone_number
//                         }
//                     )
//                 )
//                 res.status(200).send(mapFindPatient).end();
//             }
//         }

//     }
// );

// app.post(
//     '/search/agent/',
//     jwtLogin_Agent_StoreBranchMiddleware,
//     async (req, res) => {
//         const payload = await req.body
//         let storedata = "";
//         if (typeof payload.storeid == 'undefined' || payload.storeid == "") { res.status(422).end(); }
//         else {
//             storedata = {
//                 '$match': {
//                     "store._storeid": mongoose.Types.ObjectId(payload.storeid),
//                     "store.branch._branchid": mongoose.Types.ObjectId(payload.branchid)
//                 }
//             }
//         }

//         const regExCaseinsensetive = (stringdata) => {
//             return new RegExp(stringdata, 'i');
//         };

//         let findUserStatus = { '$match': {} }
//         if (typeof payload.user_status != 'undefined' && (payload.user_status === true || payload.user_status === false)) {
//             findUserStatus = { '$match': { "store.user_status": payload.user_status } }
//         }
//         let findIDcard = { '$match': {} }
//         if (typeof payload.idcard != 'undefined' && payload.idcard != "") {
//             findIDcard = { '$match': { "store.personal.identity_card.id": regExCaseinsensetive(payload.idcard) } }
//         }
//         let findEmail = { '$match': {} }
//         if (typeof payload.email != 'undefined' && payload.email != "") {
//             findEmail = { '$match': { "store.personal.email": regExCaseinsensetive(payload.email) } }
//         }
//         let findPreName = { '$match': {} }
//         if (typeof payload.pre_name != 'undefined' && payload.pre_name != "") {
//             findPreName = { '$match': { "store.personal.pre_name": regExCaseinsensetive(payload.pre_name) } }
//         }
//         let findFirstName = { '$match': {} }
//         if (typeof payload.first_name != 'undefined' && payload.first_name != "") {
//             findFirstName = { '$match': { "store.personal.first_name": regExCaseinsensetive(payload.first_name) } }
//         }
//         let findLastName = { '$match': {} }
//         if (typeof payload.last_name != 'undefined' && payload.last_name != "") {
//             findLastName = { '$match': { "store.personal.last_name": regExCaseinsensetive(payload.last_name) } }
//         }
//         let findHomeNumber = { '$match': {} }
//         if (typeof payload.homenumber != 'undefined' && payload.homenumber != "") {
//             findHomeNumber = { '$match': { "store.personal.address.homenumber": regExCaseinsensetive(payload.homenumber) } }
//         }
//         let findAlley = { '$match': {} }
//         if (typeof payload.alley != 'undefined' && payload.alley != "") {
//             findAlley = { '$match': { "store.personal.address.alley": regExCaseinsensetive(payload.alley) } }
//         }
//         let findVillageNumber = { '$match': {} }
//         if (typeof payload.village_number != 'undefined' && payload.village_number != "") {
//             findVillageNumber = { '$match': { "store.personal.address.village_number": regExCaseinsensetive(payload.village_number) } }
//         }
//         let findVillage = { '$match': {} }
//         if (typeof payload.village != 'undefined' && payload.village != "") {
//             findVillage = { '$match': { "store.personal.address.village": regExCaseinsensetive(payload.village) } }
//         }
//         let findBuilding = { '$match': {} }
//         if (typeof payload.building != 'undefined' && payload.building != "") {
//             findBuilding = { '$match': { "store.personal.address.building": regExCaseinsensetive(payload.building) } }
//         }
//         let findProvince = { '$match': {} }
//         if (typeof payload.province != 'undefined' && payload.province != "") {
//             findProvince = { '$match': { "store.personal.address.province": regExCaseinsensetive(payload.province) } }
//         }
//         let findDistrict = { '$match': {} }
//         if (typeof payload.district != 'undefined' && payload.district != "") {
//             findDistrict = { '$match': { "store.personal.address.district": regExCaseinsensetive(payload.district) } }
//         }
//         let findSubDistrict = { '$match': {} }
//         if (typeof payload.subdistrict != 'undefined' && payload.subdistrict != "") {
//             findSubDistrict = { '$match': { "store.personal.address.subdistrict": regExCaseinsensetive(payload.subdistrict) } }
//         }
//         let findPostCode = { '$match': {} }
//         if (typeof payload.postcode != 'undefined' && payload.postcode != "") {
//             findPostCode = { '$match': { "store.personal.address.postcode": regExCaseinsensetive(payload.postcode) } }
//         }

//         const aggregateCommand = [
//             {
//                 '$unwind': {
//                     'path': '$store'
//                 }
//             },
//             {
//                 '$match': { "store.role": 2 }
//             },
//             storedata,
//             findUserStatus,
//             findIDcard,
//             findEmail,
//             findPreName,
//             findFirstName,
//             findLastName,
//             findHomeNumber,
//             findAlley,
//             findVillageNumber,
//             findVillage,
//             findBuilding,
//             findProvince,
//             findDistrict,
//             findSubDistrict,
//             findPostCode,
//         ];
//         const findAgent = await agentModel.aggregate(
//             aggregateCommand
//         );

//         if (findAgent.length === 0) { res.status(200).json([]).end(); }
//         else {
//             const mapData = findAgent.map(
//                 (where, index) => (
//                     {
//                         runIndex: index + 1,
//                         _userid: where._id,
//                         _agentid: where.store._id,
//                         pre_name: where.store.personal.pre_name,
//                         special_prename: where.store.personal.special_prename,
//                         first_name: where.store.personal.first_name,
//                         last_name: where.store.personal.last_name,
//                         phone_number: where.store.personal.phone_number,
//                         user_register_date: where.store.userRegisterDate,
//                         user_status: where.store.user_status
//                     }
//                 )
//             );
//             res.status(200).json(mapData).end();
//         }


//     }
// );


//#region Master Data

// const illnessHistoryMiddleware_save = require('./Middleware/MasterDataMiddleware').illnessHistoryMiddleware_save;
// const illnessHistoryController_save = require('./Controller/masterDataController').illnessHistoryController.illnessHistoryController_save;
// app.post(
//     '/master/illness',
//     jwtLogin_Agent_StoreBranchMiddleware,
//     illnessHistoryMiddleware_save,
//     async function (req, res) {
//         const payload = await req.body;
//         const transactionSave = await illnessHistoryController_save(
//             {
//                 _storeid: payload._storeid,
//                 name: payload.name
//             },
//             (err) => { if (err) { console.error(err); res.status(500).end(); } }
//         );
//         if (!transactionSave) { res.status(422).end(); }
//         else { res.status(201).end(); }
//     }
// );

// const illnessHistoryController_get = require('./Controller/masterDataController').illnessHistoryController.illnessHistoryController_get;
// app.get(
//     '/master/illness/:storeid',
//     jwtLogin_Agent_StoreBranchMiddleware,
//     async function (req, res) {
//         const getData = await illnessHistoryController_get(
//             {
//                 _storeid: req.params.storeid
//             },
//             (err) => { if (err) { console.error(err); res.status(500).end(); } }
//         );
//         if (!getData) { res.status(200).end(); }
//         else { res.status(200).json(getData).end(); }
//     }
// );

// const illnessHistoryController_All_get = require('./Controller/masterDataController').illnessHistoryController.illnessHistoryController_All_get;
// app.get(
//     '/master/illnessall/:storeid',
//     jwtLogin_Agent_StoreBranchMiddleware,
//     async function (req, res) {
//         if (typeof req.params.storeid != 'string' || req.params.storeid == '') { res.status(400).end(); }
//         else {
//             const getData = await illnessHistoryController_All_get(
//                 {
//                     _storeid: req.params.storeid
//                 },
//                 (err) => { if (err) { console.error(err); res.status(500).end(); } }
//             );
//             if (!getData) { res.status(200).end(); }
//             else { res.status(200).json(getData).end(); }
//         }
//     }
// );

// const illnessHistoryController_put = require('./Controller/masterDataController').illnessHistoryController.illnessHistoryController_put;
// app.put(
//     '/master/illness',
//     jwtLogin_Agent_StoreBranchMiddleware,
//     async (req, res) => {
//         const payload = await req.body;
//         const transactionPut = await illnessHistoryController_put(
//             {
//                 _storeid: payload._storeid,
//                 _ilnessHistoryid: payload._id,
//                 name: payload.name,
//                 isused: payload.isused
//             },
//             (err) => { if (err) { console.error(err); res.status(422).end(); } }
//         );
//         if (!transactionPut) { res.status(422).end(); }
//         else { res.status(200).end(); }
//     }
// );

// const illnessHistoryController_Status_patch = require('./Controller/masterDataController').illnessHistoryController.illnessHistoryController_Status_patch;
// app.patch(
//     '/master/illness/status',
//     jwtLogin_Agent_StoreBranchMiddleware,
//     async (req, res) => {
//         const payload = await req.body;
//         const transactionEdit = await illnessHistoryController_Status_patch(
//             {
//                 _storeid: payload._storeid,
//                 _ilnessHistoryid: payload._id,
//             },
//             (err) => { if (err) { console.error(err); res.status(422).end(); } }
//         );
//         if (!transactionEdit) { res.status(422).end(); }
//         else { res.status(200).end(); }
//     }
// );

const treatmentStoreMiddleware_save = require('./Middleware/MasterDataMiddleware').treatmentStoreMiddleware.treatmentStoreMiddleware_save;
const treatmentStoreController_save = require('./Controller/masterDataController').treatmentStoreController.treatmentStoreController_save;
app.post(
    '/master/treatmentstore',
    jwtLogin_Agent_StoreBranchMiddleware,
    treatmentStoreMiddleware_save,
    async function (req, res) {
        const transactionSave = await treatmentStoreController_save(
            {
                _storeid: req.body._storeid,
                _branchid: req.body._branchid,
                name: req.body.name,
                price: req.body.price
            },
            (err) => { if (err) { console.error(err); res.status(500).end(); } }
        );
        if (!transactionSave) { res.status(422).end(); }
        else { res.status(201).end(); }
    }
);

const treatmentStoreMiddleware_get = require('./Middleware/MasterDataMiddleware').treatmentStoreMiddleware.treatmentStoreMiddleware_get;
const treatmentStoreController_get = require('./Controller/masterDataController').treatmentStoreController.treatmentStoreController_get;
app.get(
    '/master/treatmentstore/:storeid/:branchid',
    jwtLogin_Agent_StoreBranchMiddleware,
    treatmentStoreMiddleware_get,
    async function (req, res) {
        const { storeid, branchid } = req.params;
        const getData = await treatmentStoreController_get(
            {
                _storeid: storeid,
                _branchid: branchid
            },
            (err) => { if (err) { console.error(err); res.status(500).end(); } }
        );
        if (!getData) { res.status(200).end(); }
        else { res.status(200).json(getData).end(); }
    }
);

const treatmentStoreMiddleware_put = require('./Middleware/MasterDataMiddleware').treatmentStoreMiddleware.treatmentStoreMiddleware_put;
const treatmentStoreController_put = require('./Controller/masterDataController').treatmentStoreController.treatmentStoreController_put;
app.put(
    '/master/treatmentstore',
    jwtLogin_Agent_StoreBranchMiddleware,
    treatmentStoreMiddleware_put,
    async (req, res) => {
        const payload = await req.body;
        const transactionEdit = await treatmentStoreController_put(
            {
                _treatmentStoreid: payload._id,
                _storeid: payload._storeid,
                _branchid: payload._branchid,
                name: payload.name,
                price: payload.price,
                isused: payload.isused,
            },
            (err) => { if (err) { console.error(err); res.status(500).end(); } }
        );
        if (!transactionEdit) { res.status(422).end(); }
        else { res.status(200).end(); }

    }
);

const treatmentStoreMiddleware_Status_patch = require('./Middleware/MasterDataMiddleware').treatmentStoreMiddleware.treatmentStoreMiddleware_Status_patch;
const treatmentStoreController_Status_patch = require('./Controller/masterDataController').treatmentStoreController.treatmentStoreController_Status_patch;
app.patch(
    '/master/treatmentstore/status',
    jwtLogin_Agent_StoreBranchMiddleware,
    treatmentStoreMiddleware_Status_patch,
    async (req, res) => {
        const payload = await req.body;
        const transactionEdit = await treatmentStoreController_Status_patch(
            {
                _treatmentStoreid: payload._id,
                _storeid: payload._storeid,
                _branchid: payload._branchid
            },
            (err) => { if (err) { console.error(err); res.status(500).end(); } }
        );
        if (!transactionEdit) { res.status(422).end(); }
        else { res.status(200).end(); }
    }
);


const illnessCharacticMiddleware_save = require('./Middleware/MasterDataMiddleware').illnessCharacticMiddleware.illnessCharacticMiddleware_save;
const illnessCharacticController_save = require('./Controller/masterDataController').illnessCharacticController.illnessCharacticController_save;
app.post(
    '/master/illnesscharactics',
    jwtLogin_Agent_StoreBranchMiddleware,
    illnessCharacticMiddleware_save,
    async function (req, res) {
        const payload = await req.body;
        const transactionSave = await illnessCharacticController_save(
            {
                _storeid: payload._storeid,
                name: payload.name
            },
            (err) => { if (err) { console.error(err); res.status(422).end(); } }
        );
        if (!transactionSave) { res.status(422).end(); }
        else { res.status(201).end(); }
    }
);
app.get(
    '/master/illnesscharactics/:storeid',
    jwtLogin_Agent_StoreBranchMiddleware,
    async function (req, res) {
        const { jwtDecode_Login_StoreBranchController } = require('./Controller/JwtController/index');

        const jwtDcodeData = jwtDecode_Login_StoreBranchController(req.header("authorization"));

        if (!jwtDcodeData) { res.status(401).end(); return; }
        else {
            try {
                const getIllnessChar = await illnessCharacticModel.find(
                    {
                        '_storeid': jwtDcodeData._ref_storeid,
                        'isused': true,
                    },
                    (errors) => {
                        if (errors) { throw errors; }
                    }
                );
                if (!getIllnessChar) {
                    res.status(200).json([]).end();
                    return;
                }
                else {
                    res.status(200).json(getIllnessChar).end();
                    return;
                }

            } catch (error) {
                console.error(error);
                res.status(422).end();
                return;
            }
        }
    }
);
app.get(
    '/master/illnesscharacticsall/:storeid',
    jwtLogin_Agent_StoreBranchMiddleware,
    async function (req, res) {
        const { storeid } = req.params;
        try {
            mongoose.Types.ObjectId(storeid)
        } catch (error) {
            res.status(422).end();
        }
        const getIllnessChar = await illnessCharacticModel.find(
            {
                '_storeid': mongoose.Types.ObjectId(storeid),
            },
            (errors) => {
                if (errors) { res.status(500).end(); }
            }
        ).sort({ _id: 1 });
        if (getIllnessChar.length === 0) { res.status(200).end(); }
        else { res.status(200).json(getIllnessChar).end(); }
    }
);

app.put(
    '/master/illnesscharactics',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const payload = await req.body;
        if (
            typeof payload._id != 'string' || payload._id == ''
            || typeof payload._storeid != 'string' || payload._storeid == ''
            || typeof payload.name != 'string' || payload.name == ''
            || typeof payload.isused != 'boolean'
        ) { res.status(400).end(); }
        else {
            try {
                mongoose.Types.ObjectId(payload._storeid);
                mongoose.Types.ObjectId(payload._id);
            } catch (error) {
                res.status(422).end();
            }
            const findExists = await illnessCharacticModel.find(
                {
                    _id: mongoose.Types.ObjectId(payload._id),
                    _storeid: mongoose.Types.ObjectId(payload._storeid)
                },
                (errors) => { if (errors) { res.status(500).end(); } }
            );
            if (findExists.length <= 0) { res.status(404).end(); }
            else if (findExists.length > 1) { res.status(500).end(); }
            else {
                await illnessCharacticModel.updateOne(
                    {
                        _id: mongoose.Types.ObjectId(findExists[0]._id),
                        _storeid: mongoose.Types.ObjectId(findExists[0]._storeid)
                    },
                    {
                        '$set': {
                            'name': payload.name,
                            'isused': payload.isused
                        }
                    },
                    (errors) => {
                        if (errors) { res.status(500).end(); }
                        else { res.status(200).end(); }
                    }
                );
            }
        }
    }
);

app.patch(
    '/master/illnesscharactics/status',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const payload = await req.body;
        if (
            typeof payload._storeid != 'string' || payload._storeid == ''
            || typeof payload._id != 'string' || payload._id == ''
        ) { res.status(400).end(); }
        else {
            try {
                mongoose.Types.ObjectId(payload._storeid);
                mongoose.Types.ObjectId(payload._id);
            } catch (error) {
                res.status(422).end();
            }
            const findExists = await illnessCharacticModel.find(
                {
                    _id: mongoose.Types.ObjectId(payload._id),
                    _storeid: mongoose.Types.ObjectId(payload._storeid)
                },
                (errors) => { if (errors) { res.status(500).end(); } }
            );
            if (findExists.length <= 0) { res.status(404).end(); }
            else if (findExists.length > 1) { res.status(500).end(); }
            else {
                await illnessCharacticModel.updateOne(
                    {
                        _id: mongoose.Types.ObjectId(findExists[0]._id),
                        _storeid: mongoose.Types.ObjectId(findExists[0]._storeid)
                    },
                    {
                        '$set': { 'isused': !findExists[0].isused }
                    },
                    (errors) => {
                        if (errors) { res.status(500).end(); }
                        else { res.status(200).end(); }
                    }
                );
            }
        }
    }
);

app.post(
    '/master/store',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const payload = req.body;
        const store = new storeModel(payload);
        await store.save(function (err) {
            if (err) {
                const returnJson = {
                    errors: "cannot add store detail"
                };
                res.status(422).json(returnJson).end();
            }
        });

        const returnJson = {
            sucess: "add store sucessfully"
        };
        res.status(200).json(returnJson).end();
    }
);
app.get(
    '/master/store',
    jwtLogin_Agent_StoreBranchMiddleware,
    async function (req, res) {
        const storeAllData = await storeModel.find();
        let mapData = storeAllData.map(
            x => ({
                _id: x._id,
                id: x.id,
                name: x.name,
                branch: x.branch
            })
        )
        if (!storeAllData) {
            const returnJson = {
                errors: "no data"
            };
            res.status(422).json(returnJson).end();
        }
        res.status(200).json(mapData).end();
    }
)
app.get(
    '/master/store/:storeid',
    jwtLogin_Agent_StoreBranchMiddleware,
    async function (req, res) {
        const { storeid } = await req.params
        if (typeof storeid == 'undefined' || storeid == "") res.status(422).end();
        const storeData = await storeModel.findById(storeid);
        if (!storeData) {
            const returnJson = {
                errors: "no data"
            };
            res.status(422).json(returnJson).end();
        }
        const mapStoreData = {
            _storeID: storeData._id,
            storeCode: storeData.id,
            storeName: storeData.name
        }

        res.status(200).json(mapStoreData).end();
    }
)

app.post(
    '/master/occupation',
    jwtLogin_Agent_StoreBranchMiddleware,
    async function (req, res) {
        const payload = req.body;
        const occupation = new occupationModel(payload);
        await occupation.save(
            (errors) => {
                res.status(422).end(errors);
            }
        );
        res.status(201).end();
    }
);

app.get(
    '/master/occupation',
    jwtLogin_Agent_StoreBranchMiddleware,
    async function (req, res) {
        const findOccupation = await occupationModel.find(
            {},
            {
                _id: 1,
                name_th: 1
            },
            (errors) => {
                if (errors) {
                    res.status(422).end(errors);
                }
            }
        );
        if (!findOccupation) {
            res.status(404).end();
        }
        res.status(200).json(findOccupation).end();
    }
);


app.post(
    '/master/timeschedule',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const payload = req.body;
        if (
            typeof payload._storeid == 'undefined' ||
            typeof payload._branchid == 'undefined' ||
            typeof payload.data == 'undefined' ||
            typeof payload.data.timeFrom == 'undefined' ||
            typeof payload.data.timeTo == 'undefined'
        ) { res.status(400).end(); }
        else {

            const findStore = await timeschedule.findOne(
                {
                    "_storeid": mongoose.Types.ObjectId(payload._storeid),
                    "_branchid": mongoose.Types.ObjectId(payload._branchid),
                },
                (errors) => { if (errors) res.status(500).end(); }
            );
            if (!findStore) {
                const mapData = {
                    _storeid: payload._storeid,
                    _branchid: payload._branchid,
                    data: [
                        {
                            timeFrom: payload.data.timeFrom,
                            timeTo: payload.data.timeTo
                        }
                    ]
                };
                const transactionSave = new timeschedule(mapData);
                transactionSave.save(
                    (errors) => {
                        if (errors) { res.status(422).end(); }
                        else { res.status(201).end(); }
                    }
                );
            }
            else {
                const findDuplicate = await timeschedule.aggregate(
                    [
                        {
                            '$match': {
                                '_id': mongoose.Types.ObjectId(findStore._id)
                            }
                        }, {
                            '$unwind': {
                                'path': '$data'
                            }
                        }, {
                            '$match': {
                                'data.timeFrom': payload.data.timeFrom,
                                'data.timeTo': payload.data.timeTo
                            }
                        }
                    ]
                );
                if (findDuplicate.length === 0) {
                    const tMap = {
                        timeFrom: payload.data.timeFrom,
                        timeTo: payload.data.timeTo
                    }
                    await timeschedule.findByIdAndUpdate(
                        findStore._id,
                        {
                            $addToSet: {
                                'data': tMap,
                            }
                        },
                        {
                            new: false
                        },
                        (errors) => {
                            if (errors) { res.status(422).end(); }
                            else { res.status(201).end(); }
                        }
                    );
                }
                else {
                    res.status(200).end();
                }
            }

        }
    }
);

app.get(
    '/master/timeschedule/:storeid/:branchid',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const { storeid, branchid } = req.params;
        const findTimeSchedule = await timeschedule.find(
            {
                "_storeid": storeid,
                "_branchid": branchid,
            },
            {
                "__v": 0
            },
            (errors) => { if (errors) res.status(500).end(); }
        );
        if (!findTimeSchedule) { res.status(404).end(); }
        else { res.status(200).json(findTimeSchedule).end(); }
    }
);
app.get(
    '/master/timeschedule/agent/:loginuserid/:loginagentid/:storeid/:branchid',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const { loginuserid, loginagentid, storeid, branchid } = req.params;
        const checkRole = await agentModel.aggregate(
            [
                {
                    '$match': {
                        '_id': mongoose.Types.ObjectId(loginuserid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store'
                    }
                }, {
                    '$match': {
                        'store._id': mongoose.Types.ObjectId(loginagentid),
                        'store._storeid': mongoose.Types.ObjectId(storeid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store.branch'
                    }
                }, {
                    '$match': {
                        'store.branch._branchid': mongoose.Types.ObjectId(branchid)
                    }
                }
            ],
            (err) => { if (err) { console.error(err); } }
        );
        if (checkRole.length === 0) { res.status(200).json([]).end(); }
        else if (checkRole.length === 1) {
            if (checkRole[0].store.role === 1) { // Admin Role
                const findAgentUsers = await agentModel.aggregate(
                    [
                        {
                            '$match': {
                                'store._storeid': mongoose.Types.ObjectId(storeid),
                                'store.branch._branchid': mongoose.Types.ObjectId(branchid)
                            }
                        }, {
                            '$unwind': {
                                'path': '$store'
                            }
                        },
                        {
                            '$unwind': {
                                'path': '$store.branch'
                            }
                        }, {
                            '$match': {
                                'store._storeid': mongoose.Types.ObjectId(storeid),
                                'store.branch._branchid': mongoose.Types.ObjectId(branchid),
                                'store.user_status': true,
                                'store.role': 2
                            }
                        }
                    ]
                );
                if (findAgentUsers.length === 0) { res.status(200).json([]).end(); }
                else {
                    const mapData = await findAgentUsers.map(
                        x => (
                            {
                                _userid: x._id,
                                _agentid: x.store._id,
                                _storeid: x.store._storeid,
                                _branchid: x.store.branch._branchid,
                                avatarUrl: x.store.avatarUrl,
                                pfcolor: x.store.personal.pflevel,
                                prename: x.store.personal.pre_name,
                                first_name: regExReplace_ClearWhiteSpaceStartEnd(regExReplace_Refactor_WhiteSpace(x.store.personal.first_name)),
                                last_name: regExReplace_ClearWhiteSpaceStartEnd(regExReplace_Refactor_WhiteSpace(x.store.personal.last_name))
                            }
                        )
                    );
                    res.status(200).json(mapData).end();
                }
            }
            else if (checkRole[0].store.role === 2) {
                const findAgentUsers = await agentModel.aggregate(
                    [
                        {
                            '$match': {
                                '_id': mongoose.Types.ObjectId(loginuserid),
                                'store._id': mongoose.Types.ObjectId(loginagentid),
                                'store._storeid': mongoose.Types.ObjectId(storeid),
                                'store.branch._branchid': mongoose.Types.ObjectId(branchid)
                            }
                        }, {
                            '$unwind': {
                                'path': '$store'
                            }
                        },
                        {
                            '$unwind': {
                                'path': '$store.branch'
                            }
                        }, {
                            '$match': {
                                '_id': mongoose.Types.ObjectId(loginuserid),
                                'store._id': mongoose.Types.ObjectId(loginagentid),
                                'store._storeid': mongoose.Types.ObjectId(storeid),
                                'store.branch._branchid': mongoose.Types.ObjectId(branchid)
                            }
                        }
                    ],
                    (err) => { if (err) { console.error(err); } }
                );
                if (findAgentUsers.length === 0) { res.status(200).json([]).end(); }
                else {
                    const mapData = await findAgentUsers.map(
                        x => (
                            {
                                _userid: x._id,
                                _agentid: x.store._id,
                                _storeid: x.store._storeid,
                                _branchid: x.store.branch._branchid,
                                avatarUrl: x.store.avatarUrl,
                                pfcolor: x.store.personal.pflevel,
                                prename: x.store.personal.pre_name,
                                first_name: regExReplace_ClearWhiteSpaceStartEnd(regExReplace_Refactor_WhiteSpace(x.store.personal.first_name)),
                                last_name: regExReplace_ClearWhiteSpaceStartEnd(regExReplace_Refactor_WhiteSpace(x.store.personal.last_name))
                            }
                        )
                    );
                    res.status(200).json(mapData).end();
                }
            }
            else {
                res.status(422).end();
            }
        }
        else {
            res.status(422).end();
        }
    }
);

const Route_MasterData = require('./Route/MasterData');
app.use(
    '/masterdata',
    // jwtLogin_Agent_StoreBranchMiddleware,
    Route_MasterData
);
//#endregion Master Data

//#region Master Thailand Data
const Route_MasterDataThailand = require('./Route/MasterDataThailandRoute');
app.use(
    '/master/thailand',
    // jwtLogin_Agent_StoreBranchMiddleware,
    Route_MasterDataThailand
);
//#endregion Master Thailand Data


//#region Schedule
const Route_Schedule = require('./Route/ScheduleRotue');
app.use(
    '/schedule',
    jwtLogin_Agent_StoreBranchMiddleware,
    Route_Schedule
);
//#endregion Schedule
const schedule_Save_Middleware = require('./Middleware/ScheduleMiddleware').schedule_Save_Middleware
const schedule_Save_Controller = require('./Controller/ScheduleController').schedule_Save_Controller
app.post( // จองคิว
    '/content/schedule',
    jwtLogin_Agent_StoreBranchMiddleware,
    schedule_Save_Middleware,
    async (req, res) => {
        try {
            const payload = req.body;
            const getResult = await schedule_Save_Controller(
                payload,
                (err) => { if (err) { throw err; } }
            );

            if (!getResult) { res.status(200).end(); }
            else { res.status(200).json(getResult).end(); }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

app.get(
    '/content/schedule/:loginuserid/:loginagentid/:loginstoreid/:loginbranchid/:tabledate',
    //jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const { loginuserid, loginagentid, loginstoreid, loginbranchid, tabledate } = req.params;
        const userid = loginuserid;
        const agentid = loginagentid;
        const storeid = loginstoreid;
        const branchid = loginbranchid;

        const getFindRole = await agentModel.aggregate(
            [
                {
                    '$match': {
                        '_id': mongoose.Types.ObjectId(userid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store'
                    }
                }, {
                    '$match': {
                        'store._id': mongoose.Types.ObjectId(agentid),
                        'store._storeid': mongoose.Types.ObjectId(storeid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store.branch'
                    }
                }, {
                    '$match': {
                        'store.branch._branchid': mongoose.Types.ObjectId(branchid)
                    }
                }
            ]
        );

        if (getFindRole.length === 0) { res.status(404).end(); }
        else {
            const findRole = getFindRole[0];
            if (findRole.store.role == 1) {
                const renderTimeTable = await scheduleModel.aggregate(
                    [
                        {
                            '$match': {
                                '_storeid': mongoose.Types.ObjectId(findRole.store._storeid),
                                '_barnchid': mongoose.Types.ObjectId(findRole.store.branch._branchid),
                            }
                        }, {
                            '$project': {
                                '_storeid': '$_storeid',
                                '_barnchid': '$_barnchid',
                                'data': {
                                    '$filter': {
                                        'input': '$data',
                                        'as': 'getData',
                                        'cond': {
                                            '$and': [
                                                { '$ne': ['$$getData.status', 'ยกเลิกนัด'] }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    ]
                );
                //res.send(renderTimeTable).end();
                if (renderTimeTable.length === 0) { res.status(404).end(); }
                else {

                    renderTimeTable[0].data.sort(
                        function (a, b) {
                            const toint = (value) => {
                                return parseInt(value.replace(":", ""))
                            }
                            if (toint(a.timeFrom) > toint(b.timeFrom)) {
                                return 1;
                            }
                            if (toint(b.timeFrom) > toint(a.timeFrom)) {
                                return -1;
                            }
                            return 0;
                        }
                    );
                    const findPfColor = async (agentid) => {
                        if (!agentid) return 'red';
                        const findPF = await agentModel.aggregate(
                            [
                                {
                                    '$unwind': {
                                        'path': '$store'
                                    }
                                }, {
                                    '$match': {
                                        'store._id': mongoose.Types.ObjectId(agentid)
                                    }
                                }, {
                                    '$project': {
                                        'store.personal.pflevel': 1
                                    }
                                }
                            ]
                        );
                        const thePF = findPF[0].store.personal.pflevel || 'C';
                        if (thePF == 'A') {
                            return 'A'
                        }
                        else if (thePF == 'B') {
                            return 'B'
                        }
                        else if (thePF == 'C') {
                            return 'C'
                        }
                        else {
                            return 'C'
                        }
                    }

                    const agentIDData = [];
                    const dataAgent = [];
                    for (let indexData = 0; indexData < renderTimeTable[0].data.length; indexData++) {
                        const elementData = renderTimeTable[0].data[indexData];
                        if (agentIDData.filter(x => x == elementData._agentid.toString()).length <= 0) {
                            agentIDData.push(elementData._agentid.toString());
                            dataAgent.push(
                                {
                                    _agentid: elementData._agentid.toString(),
                                    pfcolor: await findPfColor(elementData._agentid),
                                    agentname: elementData.agentname,
                                    avatarUrl: elementData.avatarUrl,
                                }
                            );
                        }

                    }

                    const mapTimeData = []
                    for (let indexData = 0; indexData < dataAgent.length; indexData++) {
                        const elementData = dataAgent[indexData]._agentid;
                        const elementAllData = dataAgent[indexData]
                        const filterAgentID = renderTimeTable[0].data.filter(where => where._agentid == elementData && where.date === tabledate)
                        const mapFilter = filterAgentID.map(
                            (x, index) => (
                                {
                                    runIndex: index,
                                    timeFrom: x.timeFrom,
                                    timeTo: x.timeTo,
                                    data: {
                                        _scheduleid: x._id,
                                        pateintname: x.patientnamge,
                                        _patientid: x._patientid,
                                        status: x.status,
                                        detail: x.detail,
                                        date: x.date
                                    }
                                }
                            )
                        );
                        const mapTimeByAgent = elementAllData
                        elementAllData.timeTable = mapFilter

                        mapTimeData.push(mapTimeByAgent);
                    }

                    res.status(200).send(mapTimeData).end();
                }
            }
            else if (findRole.store.role == 2) {
                const renderTimeTable = await scheduleModel.aggregate(
                    [
                        {
                            '$match': {
                                '_storeid': mongoose.Types.ObjectId(findRole.store._storeid),
                                '_barnchid': mongoose.Types.ObjectId(findRole.store.branch._branchid),
                            }
                        }, {
                            '$project': {
                                '_storeid': '$_storeid',
                                '_barnchid': '$_barnchid',
                                'data': {
                                    '$filter': {
                                        'input': '$data',
                                        'as': 'getData',
                                        'cond': {
                                            '$and': [
                                                {
                                                    '$eq': [
                                                        '$$getData._agentid', mongoose.Types.ObjectId(agentid)
                                                    ]
                                                },
                                                {
                                                    '$ne': [
                                                        '$$getData.status', 'ยกเลิกนัด'
                                                    ]
                                                },
                                                {
                                                    '$ne': [
                                                        '$$getData.status', 'สำเร็จ'
                                                    ]
                                                },
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    ]
                );
                //res.send(renderTimeTable).end();
                if (renderTimeTable.length === 0) { res.status(404).end(); }
                else {

                    renderTimeTable[0].data.sort(
                        function (a, b) {
                            const toint = (value) => {
                                return parseInt(value.replace(":", ""))
                            }
                            if (toint(a.timeFrom) > toint(b.timeFrom)) {
                                return 1;
                            }
                            if (toint(b.timeFrom) > toint(a.timeFrom)) {
                                return -1;
                            }
                            return 0;
                        }
                    );
                    const findPfColor = async (agentid) => {
                        if (!agentid) return 'red';
                        const findPF = await agentModel.aggregate(
                            [
                                {
                                    '$unwind': {
                                        'path': '$store'
                                    }
                                }, {
                                    '$match': {
                                        'store._id': mongoose.Types.ObjectId(agentid)
                                    }
                                }, {
                                    '$project': {
                                        'store.personal.pflevel': 1
                                    }
                                }
                            ]
                        );
                        const thePF = findPF[0].store.personal.pflevel || 'C';
                        if (thePF == 'A') {
                            return 'A'
                        }
                        else if (thePF == 'B') {
                            return 'B'
                        }
                        else if (thePF == 'C') {
                            return 'C'
                        }
                        else {
                            return 'C'
                        }
                    }

                    const agentIDData = [];
                    const dataAgent = [];
                    for (let indexData = 0; indexData < renderTimeTable[0].data.length; indexData++) {
                        const elementData = renderTimeTable[0].data[indexData];
                        if (agentIDData.filter(x => x == elementData._agentid.toString()).length <= 0) {
                            agentIDData.push(elementData._agentid.toString());
                            dataAgent.push(
                                {
                                    _agentid: elementData._agentid.toString(),
                                    pfcolor: await findPfColor(elementData._agentid),
                                    agentname: elementData.agentname,
                                    avatarUrl: elementData.avatarUrl,
                                }
                            );
                        }

                    }

                    const mapTimeData = []
                    for (let indexData = 0; indexData < dataAgent.length; indexData++) {
                        const elementData = dataAgent[indexData]._agentid;
                        const elementAllData = dataAgent[indexData]
                        const filterAgentID = renderTimeTable[0].data.filter(where => where._agentid == elementData && where.date === tabledate)
                        const mapFilter = filterAgentID.map(
                            (x, index) => (
                                {
                                    runIndex: index,
                                    timeFrom: x.timeFrom,
                                    timeTo: x.timeTo,
                                    data: {
                                        _scheduleid: x._id,
                                        pateintname: x.patientnamge,
                                        _patientid: x._patientid,
                                        status: x.status,
                                        detail: x.detail,
                                        date: x.date
                                    }
                                }
                            )
                        );
                        const mapTimeByAgent = elementAllData
                        elementAllData.timeTable = mapFilter

                        mapTimeData.push(mapTimeByAgent);
                    }

                    res.status(200).send(mapTimeData).end();
                }
            }
            else {
                res.status(422).end();
            }
        }

    }
)
//#region scheduletoday
// ตารางงงานวันนี้
app.get(
    '/content/scheduletoday/:loginuserid/:loginagentid/:storeid/:branchid',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const { loginuserid, loginagentid, storeid, branchid } = req.params;
        const findRole = await agentModel.aggregate(
            [
                {
                    '$match': {
                        '_id': mongoose.Types.ObjectId(loginuserid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store'
                    }
                }, {
                    '$match': {
                        'store._id': mongoose.Types.ObjectId(loginagentid),
                        'store._storeid': mongoose.Types.ObjectId(storeid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store.branch'
                    }
                }, {
                    '$match': {
                        'store.branch._branchid': mongoose.Types.ObjectId(branchid)
                    }
                }
            ]
        );
        if (findRole.length === 0) { res.status(401).end(); }
        else if (findRole.length === 1) {
            // START Prepare Rule
            if (findRole[0].store.role == 1) { // Agent Admin
                const theToday = momnet().format("YYYY-MM-DD")
                const findScheduleToday = await scheduleModel.aggregate(
                    [
                        {
                            '$match': {
                                '_storeid': mongoose.Types.ObjectId(storeid),
                                '_barnchid': mongoose.Types.ObjectId(branchid)
                            }
                        }, {
                            '$unwind': {
                                'path': '$data'
                            }
                        }, {
                            '$match': {
                                'data.date': theToday
                            }
                        }, {
                            '$group': {
                                '_id': '$_id',
                                'data': {
                                    '$push': '$data'
                                }
                            }
                        }
                    ]
                )

                if (findScheduleToday.length === 0) { res.status(200).send([]).end(); }
                else {
                    findScheduleToday[0].data.sort(
                        function (a, b) {
                            const toint = (value) => {
                                return parseInt(value.replace(":", ""))
                            }
                            if (toint(a.timeFrom) > toint(b.timeFrom)) {
                                return 1;
                            }
                            if (toint(b.timeFrom) > toint(a.timeFrom)) {
                                return -1;
                            }
                            return 0;
                        }
                    );
                    findScheduleToday[0].data.sort(
                        function (a, b) {
                            const toScore = (value) => {
                                if (value == 'นัดหมายไว้') { return 1 }
                                else { return 2 }
                            }
                            if (toScore(a.status) > toScore(b.status)) {
                                return 1;
                            }
                            if (toScore(b.status) > toScore(a.status)) {
                                return -1;
                            }
                            return 0;
                        }
                    );

                    for (let index = 0; index < findScheduleToday[0].data.length; index++) {
                        const element = findScheduleToday[0].data[index];
                        const findUncompletePatientDetail = await patientModel.aggregate(
                            [
                                {
                                    '$match': {
                                        '_id': mongoose.Types.ObjectId(element._patientid)
                                    }
                                }, {
                                    '$unwind': {
                                        'path': '$store'
                                    }
                                }, {
                                    '$match': {
                                        'store._storeid': mongoose.Types.ObjectId(storeid)
                                    }
                                }, {
                                    '$project': {
                                        'pidc': {
                                            '$ifNull': [
                                                '$store.personal.identity_card.id', ''
                                            ]
                                        }
                                    }
                                }
                            ]
                        );
                        if (findUncompletePatientDetail.length === 1) {
                            if (findUncompletePatientDetail[0].pidc === '') {
                                findScheduleToday[0].data[index].idstatus = false;
                            }
                            else {
                                findScheduleToday[0].data[index].idstatus = true;
                            }
                        }
                    }
                    res.send(findScheduleToday).end();
                }
            }
            else if (findRole[0].store.role == 2) { // Agent
                const theToday = momnet().format("YYYY-MM-DD")
                const findScheduleToday = await scheduleModel.aggregate(
                    [
                        {
                            '$match': {
                                '_storeid': mongoose.Types.ObjectId(storeid),
                                '_barnchid': mongoose.Types.ObjectId(branchid),
                                'data.date': theToday
                            }
                        }, {
                            '$unwind': {
                                'path': '$data',
                                'includeArrayIndex': 'unwind_data_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$match': {
                                'data._agentid': mongoose.Types.ObjectId(loginagentid),
                                'data.date': theToday
                            }
                        }, {
                            '$lookup': {
                                'from': 'm_patients',
                                'localField': 'data._patientid',
                                'foreignField': '_id',
                                'as': 'm_patients'
                            }
                        }, {
                            '$unwind': {
                                'path': '$m_patients',
                                'includeArrayIndex': 'unwind_m_patients_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$match': {
                                'unwind_m_patients_index': {
                                    '$ne': null
                                }
                            }
                        }, {
                            '$addFields': {
                                'chkPatinet': {
                                    '$cmp': [
                                        '$data._patientid', '$m_patients._id'
                                    ]
                                }
                            }
                        }, {
                            '$match': {
                                'chkPatinet': {
                                    '$eq': 0
                                }
                            }
                        }, {
                            '$unwind': {
                                'path': '$m_patients.store',
                                'includeArrayIndex': 'unwind_m_patients_store_index',
                                'preserveNullAndEmptyArrays': true
                            }
                        }, {
                            '$match': {
                                'unwind_m_patients_store_index': {
                                    '$ne': null
                                }
                            }
                        }, {
                            '$addFields': {
                                'chkPatinetStore': {
                                    '$cmp': [
                                        '$_storeid', '$m_patients.store._storeid'
                                    ]
                                }
                            }
                        }, {
                            '$match': {
                                'chkPatinetStore': {
                                    '$eq': 0
                                }
                            }
                        }, {
                            '$addFields': {
                                'data.hn': '$m_patients.store.hn'
                            }
                        }, {
                            '$group': {
                                '_id': '$_id',
                                'data': {
                                    '$push': '$data'
                                }
                            }
                        }
                    ],
                    (err) => { if (err) { console.error(err); res.status(422).end(); } }
                );
                if (findScheduleToday.length === 0) { res.status(200).send([]).end(); }
                else {
                    findScheduleToday[0].data.sort(
                        function (a, b) {
                            const toint = (value) => {
                                return parseInt(value.replace(":", ""))
                            }
                            if (toint(a.timeFrom) > toint(b.timeFrom)) {
                                return 1;
                            }
                            if (toint(b.timeFrom) > toint(a.timeFrom)) {
                                return -1;
                            }
                            return 0;
                        }
                    );
                    findScheduleToday[0].data.sort(
                        function (a, b) {
                            const toScore = (value) => {
                                if (value == 'นัดหมายไว้') { return 1 }
                                else { return 2 }
                            }
                            if (toScore(a.status) > toScore(b.status)) {
                                return 1;
                            }
                            if (toScore(b.status) > toScore(a.status)) {
                                return -1;
                            }
                            return 0;
                        }
                    );
                    for (let index = 0; index < findScheduleToday[0].data.length; index++) {
                        const element = findScheduleToday[0].data[index];
                        const findUncompletePatientDetail = await patientModel.aggregate(
                            [
                                {
                                    '$match': {
                                        '_id': mongoose.Types.ObjectId(element._patientid)
                                    }
                                }, {
                                    '$unwind': {
                                        'path': '$store'
                                    }
                                }, {
                                    '$match': {
                                        'store._storeid': mongoose.Types.ObjectId(storeid)
                                    }
                                }, {
                                    '$project': {
                                        'pidc': {
                                            '$ifNull': [
                                                '$store.personal.identity_card.id', ''
                                            ]
                                        }
                                    }
                                }
                            ]
                        );
                        if (findUncompletePatientDetail.length === 1) {
                            if (findUncompletePatientDetail[0].pidc === '') {
                                findScheduleToday[0].data[index].idstatus = false;
                            }
                            else {
                                findScheduleToday[0].data[index].idstatus = true;
                            }
                        }
                    }
                    res.send(findScheduleToday).end();
                }
            }
            else {
                res.send(422).end();
            }
            // END Prepare Rule
        }
        else { res.status(422).end(); }
    }
);

app.patch(
    '/action/scheduletoday/cancel',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const payload = req.body;
        const getScheduleID = new mongoose.Types.ObjectId(payload._scheduleid);
        const findSchedule = await scheduleModel.find(
            {
                "data._id": getScheduleID
            },
            {
                "data.$": 1
            }
        );

        if (!findSchedule) { res.status(404).end(); }
        else {
            const updateTransaction = await scheduleModel.updateMany(
                {
                    "data._id": getScheduleID
                },
                {
                    "$set": {
                        "data.$.status": 'ยกเลิกนัด'
                    }
                },
                (errors) => {
                    if (errors) res.status(422).end();
                }
            )
            res.status(200).end();
        }
    }
);

app.patch(
    '/action/scheduletoday/confirm',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const payload = req.body;
        const getScheduleID = new mongoose.Types.ObjectId(payload._scheduleid);
        const findSchedule = await scheduleModel.find(
            {
                "data._id": getScheduleID
            },
            {
                "data.$": 1
            }
        );

        if (!findSchedule) { res.status(404).end(); }
        else {
            const updateTransaction = await scheduleModel.updateMany(
                {
                    "data._id": getScheduleID
                },
                {
                    "$set": {
                        "data.$.status": 'รอรับการรักษา'
                    }
                },
                (errors) => {
                    if (errors) res.status(422).end();
                }
            )
            res.status(200).end();
        }
    }
);

//#endregion scheduletoday

//#region treatment page
app.get(
    '/treatment/schedule/check/:storeid/:branchid/:agentid/:getdate',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const { storeid, branchid, agentid, getdate } = await req.params;
        const findData = await scheduleModel.aggregate(
            [
                {
                    '$match': {
                        '_storeid': mongoose.Types.ObjectId(storeid),
                        '_barnchid': mongoose.Types.ObjectId(branchid)
                    }
                }, {
                    '$unwind': {
                        'path': '$data'
                    }
                }, {
                    '$match': {
                        '_storeid': mongoose.Types.ObjectId(storeid),
                        '_barnchid': mongoose.Types.ObjectId(branchid),
                        'data._agentid': mongoose.Types.ObjectId(agentid),
                        'data.date': getdate,
                        'data.status': 'รอรับการรักษา'
                    }
                }, {
                    '$lookup': {
                        'from': 'm_patients',
                        'localField': 'data._patientid',
                        'foreignField': '_id',
                        'as': 'm_patients'
                    }
                }, {
                    '$unwind': {
                        'path': '$m_patients'
                    }
                }, {
                    '$match': {
                        'm_patients.store._storeid': mongoose.Types.ObjectId(storeid)
                    }
                }, {
                    '$unwind': {
                        'path': '$m_patients.store'
                    }
                }, {
                    '$match': {
                        'm_patients.store._storeid': mongoose.Types.ObjectId(storeid)
                    }
                }, {
                    '$addFields': {
                        'data.hn': '$m_patients.store.hn'
                    }
                }, {
                    '$addFields': {
                        'data.timeFrom': {
                            '$concat': [
                                '$data.date', ' ', '$data.timeFrom', ':', '00'
                            ]
                        }
                    }
                }, {
                    '$addFields': {
                        'data.timeFromnew': {
                            '$dateFromString': {
                                'dateString': '$data.timeFrom',
                                'format': '%Y-%m-%d %H:%M:%S'
                            }
                        }
                    }
                }, {
                    '$addFields': {
                        'data.timeFrom': {
                            '$substr': [
                                '$data.timeFrom', 11, -1
                            ]
                        }
                    }
                }, {
                    '$addFields': {
                        'data.timeFrom': {
                            '$substr': [
                                '$data.timeFrom', 0, 5
                            ]
                        }
                    }
                }, {
                    '$sort': {
                        'data.timeFromnew': 1
                    }
                }, {
                    '$group': {
                        '_id': '$_id',
                        'data': {
                            '$push': '$data'
                        }
                    }
                }
            ]
        );
        if (findData.length != 1) { res.status(200).end(); }
        else {
            // const sortData = findData[0].data.sort((a = "", b = "") => {
            //   if (parseInt(a.timeFrom.replace(':')) > parseInt(b.timeFrom.replace(':'))) {
            //     return -1;
            //   }
            //   if (parseInt(a.timeFrom.replace(':')) < parseInt(b.timeFrom.replace(':'))) {
            //     return 1;
            //   }
            //   return +a - +b;
            // });
            // findData[0].data = sortData;
            res.status(200).json(findData[0].data).end();
        }
    }
);
app.get(
    '/treatment/patient/pick/:patientid/:storeid',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const { patientid, storeid } = await req.params;
        const findData = await patientModel.aggregate(
            [
                {
                    '$match': {
                        '_id': mongoose.Types.ObjectId(patientid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store'
                    }
                }, {
                    '$match': {
                        'store._storeid': mongoose.Types.ObjectId(storeid)
                    }
                }, {
                    '$project': {
                        '_id': 0,
                        '_patientid': '$_id',
                        'hn': '$store.hn',
                        'pre_name': '$store.personal.pre_name',
                        'special_prename': {
                            '$ifNull': [
                                '$store.personal.special_prename', ''
                            ]
                        },
                        'first_name': '$store.personal.first_name',
                        'last_name': '$store.personal.last_name',
                        'brith_date': '$store.personal.birth_date',
                        'illChar': '$store.personal.general_user_detail.congenital_disease'
                    }
                }
            ]
        );
        if (findData.length != 1) { res.status(200).end(); }
        else { res.status(200).json(findData[0]).end(); }
    }
);
//#endregion treatment page

//#region CasePatient
const Route_CasePatient = require('./Route/CasePatientRoute');
app.use(
    '/casepatient',
    // jwtLogin_Agent_StoreBranchMiddleware,
    Route_CasePatient
);
//#endregion CasePatient

//#region report excel
const Route_ReportExcel = require('./Route/ReportExcelRoute');
app.use(
    '/report/excel',
    jwtLogin_Agent_StoreBranchMiddleware,
    Route_ReportExcel
);
//#endregion report excel

//#region report RAW
const Route_ReportRaw = require('./Route/ReportRawRoute');
app.use(
    '/report/raw',
    jwtLogin_Agent_StoreBranchMiddleware,
    Route_ReportRaw
);
//#endregion report RAW

const adminIMDCheckUserMiddleware = async (req, res, next) => { // Admin Check Account Middleware
    const payloadToken = await jwt.decode(req.headers.authorization, JWT_SECRET);
    if (payloadToken.sub != kaiyaphap_email) { res.status(401).end(); }
    else {
        const findLogLogin = await logLoginModel.find(
            {
                'username': payloadToken.sub.toString(),
                'jwtToken': req.headers.authorization.toString()
            },
            (errors) => { if (errors) { res.status(500).end(); } }
        );
        if (findLogLogin.length === 1) { next(); }
        else { res.status(401).end(); }
    }
};

//#region IMD Agents
const imdLoginMiddleware = require('./Middleware/ImdMasterDataTemplateMiddleware').imdLoginMiddleware
const imdLoginController = require('./Controller/ImdMasterDataTemplateController').imdLoginController
app.post( // IMD Agent login
    '/imd/login',
    imdLoginMiddleware,
    async (req, res) => {
        try {
            const payload = await req.body;
            const { chackEmailLowerCase } = require('./Controller/miscController')
            const mail_username =await chackEmailLowerCase(payload.username, (err) => { if (err) { callback(err); return; } })
            const do_login = await imdLoginController(
                mail_username,
                payload.password,
                (err) => { if (err) { throw err; } }
            )
            if (!do_login) { res.status(200).end(); }
            else {
                res.status(200).json(do_login).end();
            }
        } catch (error) {
            console.error(error);
            res.status(200).end();
        }
    }
);
const imdRegisterStoreMiddleware = require('./Middleware/ImdMasterDataTemplateMiddleware').imdRegisterStoreMiddleware
app.post( // register store
    '/imd/registerstore',
    imdRegisterStoreMiddleware,
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const payload = await req.body;

        const finStoreNameExtists = await storeModel.find(
            {
                'name': payload.name
            },
            (errors) => { if (errors) { res.status(500).end(); } }
        );
        if (finStoreNameExtists.length != 0) { res.status(422).end(); }
        else {
            const storeid = mongoose.Types.ObjectId();
            payload._id = storeid;
            payload.branch = [{ //สาขา
                _id: storeid,
                name: "สาขาหลัก",
                email: payload.email,
                phone_number: payload.phone_number,
                address: payload.address
            }];
            const storeTemplate = new storeModel(payload);
            await storeTemplate.save(
                (errors) => { if (errors) { res.status(500).end(); } }
            );
            const initMaster = async (storeid) => {
                const tempIllness = await templateIllnessModel.find();
                if (tempIllness.length >= 1) {
                    await tempIllness.forEach(async element => {
                        const illTempTransaction = new illnessModel({
                            _storeid: storeid,
                            name: element.name,
                            isused: true,
                        });
                        await illTempTransaction.save();
                    });
                }
                const tempIllnessChar = await temppateIllCharacticModel.find();
                if (tempIllnessChar.length >= 1) {
                    await tempIllnessChar.forEach(async element => {
                        const illTempCharTransaction = new illnessCharacticModel({
                            _storeid: storeid,
                            name: element.name,
                            isused: true,
                        });
                        await illTempCharTransaction.save();
                    });
                }
            }
            await initMaster(storeid);
            res.status(201).json(
                {
                    _storeid: storeTemplate._id,
                    _branchid: storeTemplate.branch[0]._id
                }
            ).end();
        }

    }
);


app.put( // edit store
    '/imd/store/edit/:storeid',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const payload = await req.body;
        const { storeid } = await req.params;
        try {
            await mongoose.Types.ObjectId(storeid)
        } catch (error) {
            res.status(400).end();
        }
        if (
            typeof payload.name != 'string' || payload.name == ''
            || typeof payload.email != 'string' || payload.email == ''
            || typeof payload.phone_number != 'string' || payload.phone_number == ''
            || !validate_StringOrNull_AndNotEmpty(payload.tel_number)
            || typeof payload.address != 'object'
        ) { res.status(400).end(); }
        else {
            payload.branch = [{ //สาขา
                name: "สาขาหลัก",
                email: payload.email,
                phone_number: payload.phone_number,
                address: {
                    buiding: payload.address.buiding,
                    country: payload.address.country,
                    homenumber: payload.address.homenumber,
                    province: payload.address.province,
                    district: payload.address.district,
                    subdistrict: payload.address.subdistrict,
                    alley: payload.address.alley,
                    villagenumber: payload.address.villagenumber,
                    village: payload.address.village,
                    postcode: payload.address.postcode,
                    // tax_id: payload.address.tax_id,
                }
            }];
            await storeModel.updateOne(
                {
                    '_id': mongoose.Types.ObjectId(storeid),
                    'branch._id': mongoose.Types.ObjectId(storeid),
                },
                {
                    '$set': {
                        'name': payload.name,
                        'email': payload.email,
                        'phone_number': payload.phone_number,
                        'tel_number': payload.tel_number,

                        'address.buiding': payload.address.buiding,
                        'address.country': payload.address.country,
                        'address.homenumber': payload.address.homenumber,
                        'address.province': payload.address.province,
                        'address.district': payload.address.district,
                        'address.subdistrict': payload.address.subdistrict,
                        'address.alley': payload.address.alley,
                        'address.villagenumber': payload.address.villagenumber,
                        'address.village': payload.address.village,
                        'address.postcode': payload.address.postcode,
                        // 'address.tax_id': payload.address.tax_id,

                        'branch.$.name': payload.branch[0].name,
                        'branch.$.email': payload.branch[0].email,
                        'branch.$.phone_number': payload.branch[0].phone_number,
                        'branch.$.tel_number': payload.branch[0].tel_number,

                        'branch.$.address.buiding': payload.branch[0].address.buiding,
                        'branch.$.address.country': payload.branch[0].address.country,
                        'branch.$.address.homenumber': payload.branch[0].address.homenumber,
                        'branch.$.address.province': payload.branch[0].address.province,
                        'branch.$.address.district': payload.branch[0].address.district,
                        'branch.$.address.subdistrict': payload.branch[0].address.subdistrict,
                        'branch.$.address.alley': payload.branch[0].address.alley,
                        'branch.$.address.villagenumber': payload.branch[0].address.villagenumber,
                        'branch.$.address.village': payload.branch[0].address.village,
                        'branch.$.address.postcode': payload.branch[0].address.postcode,
                        // 'branch.$.address.tax_id': payload.branch[0].address.tax_id,
                    }
                },
                (errors) => {
                    if (errors) { res.status(500).end(); }
                }
            );
            res.status(200).end();
        }
    }
);

app.post( // register branch
    '/imd/registerbranch',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const payload = req.body;
        if (
            typeof payload._storeid != 'string' || payload._storeid == ''
            || typeof payload.name != 'string' || payload.name == ''
            || typeof payload.email != 'string' || payload.email == ''
            || typeof payload.phone_number != 'string' || payload.phone_number == ''
            || typeof payload.address != 'object'
        ) { res.status(400).end(); }
        else {
            const branchTemplate = [
                {
                    name: payload.name,
                    email: payload.email,
                    phone_number: payload.phone_number,
                    address: payload.address
                }
            ];
            //   const storeModels = await storeModel.updateOne(
            //     {
            //       '_id': mongoose.Types.ObjectId(payload._storeid)
            //     },
            //     {
            //       '$addToSet': { 'branch': branchTemplate }
            //     } //(errors) => { if (errors) {  } else { res.status(201).end(); } }
            //   ).then(result => { return result; }).catch(err => { res.status(500).end(); return; });
            //  console.log(storeModels); 
            const _storeid = await checkObjectId(payload._storeid, (err) => { if (err) { callback(err); return; } });
            let index_storeModel_save = 1;
            while (index_storeModel_save <= 10) {
                let storeModel_save = await storeModel.findOne(
                    {
                        '_id': _storeid

                    }, (err) => { if (err) callback(err); return; }
                );
                storeModel_save.branch.push(branchTemplate[0]);
                storeModel_save = await storeModel_save.save();
                if (!storeModel_save || storeModel_save != null || storeModel_save != '') {
                    res.status(201).json(storeModel_save.branch[storeModel_save.branch.length - 1]._id).end();
                    break;
                } else {
                    if (index_storeModel_save === 10) {
                        res.status(500).end();
                        break;
                    }
                }
                index_storeModel_save++;
            }
        }
    }
);

app.put( // edit branch
    '/imd/branch/edit/:storeid/:branchid',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const { storeid, branchid } = await req.params;
        const payload = await req.body;
        if (
            typeof payload.name != 'string' || payload.name == '' ||
            typeof payload.email != 'string' || payload.email == '' ||
            typeof payload.phone_number != 'string' || payload.phone_number == '' ||
            typeof payload.address != 'object'
        ) { res.status(400).end(); }
        else {
            payload.branch = { //สาขา
                name: payload.name,
                email: payload.email,
                phone_number: payload.phone_number,
                tel_number: payload.tel_number,
                address: {
                    buiding: payload.address.buiding,
                    country: payload.address.country,
                    homenumber: payload.address.homenumber,
                    province: payload.address.province,
                    district: payload.address.district,
                    subdistrict: payload.address.subdistrict,
                    alley: payload.address.alley,
                    villagenumber: payload.address.villagenumber,
                    village: payload.address.village,
                    postcode: payload.address.postcode,
                }
            };
            const findBranchExists = await storeModel.aggregate(
                [
                    {
                        '$match': {
                            '_id': mongoose.Types.ObjectId(storeid)
                        }
                    }, {
                        '$unwind': {
                            'path': '$branch'
                        }
                    }, {
                        '$match': {
                            'branch._id': mongoose.Types.ObjectId(branchid)
                        }
                    }
                ]
            );
            if (findBranchExists.length === 1) {
                await storeModel.updateOne(
                    {
                        '_id': mongoose.Types.ObjectId(storeid),
                        'branch._id': mongoose.Types.ObjectId(branchid),
                    },
                    {
                        '$set': {
                            'branch.$.name': payload.branch.name,
                            'branch.$.email': payload.branch.email,
                            'branch.$.phone_number': payload.branch.phone_number,
                            'branch.$.tel_number': payload.branch.tel_number,

                            'branch.$.address.buiding': payload.branch.address.buiding,
                            'branch.$.address.country': payload.branch.address.country,
                            'branch.$.address.homenumber': payload.branch.address.homenumber,
                            'branch.$.address.province': payload.branch.address.province,
                            'branch.$.address.district': payload.branch.address.district,
                            'branch.$.address.subdistrict': payload.branch.address.subdistrict,
                            'branch.$.address.alley': payload.branch.address.alley,
                            'branch.$.address.villagenumber': payload.branch.address.villagenumber,
                            'branch.$.address.village': payload.branch.address.village,
                            'branch.$.address.postcode': payload.branch.address.postcode,
                        },
                    },
                    (errors) => { if (errors) { res.status(500).end(); } else { res.status(200).end(); } }
                );
            }
            else { res.status(422).end(); }
        }
    }
);


app.get( // detail store
    '/imd/store/detail/:storeid',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const { storeid } = await req.params;
        try {
            await mongoose.Types.ObjectId(storeid)
        } catch (error) {
            res.status(400).end();
        }
        const resultFindStore = await storeModel.aggregate(
            [
                {
                    '$match': {
                        '_id': mongoose.Types.ObjectId(storeid)
                    }
                }, {
                    '$unwind': {
                        'path': '$branch'
                    }
                }, {
                    '$match': {
                        'branch._id': mongoose.Types.ObjectId(storeid)
                    }
                }
            ]
        );
        if (resultFindStore.length === 0) { res.status(200).end(); }
        else if (resultFindStore.length === 1) { res.status(200).json(resultFindStore[0]).end(); }
        else { res.status(422).end(); }
    }
);

app.get( // detail branch
    '/imd/store/detail/:storeid/:branchid',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const { storeid, branchid } = await req.params;
        const findBranch = await storeModel.aggregate(
            [
                {
                    '$match': {
                        '_id': mongoose.Types.ObjectId(storeid)
                    }
                }, {
                    '$unwind': {
                        'path': '$branch'
                    }
                }, {
                    '$match': {
                        'branch._id': mongoose.Types.ObjectId(branchid)
                    }
                }
            ]
        );
        if (findBranch.length === 1) { res.status(200).json(findBranch).end(); }
        else { res.status(200).end(); }
    }
);

app.get( // full detail and lists all store
    '/imd/registerstore',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const getAlldata = await storeModel.find(
            (errors) => { if (errors) { res.status(500).end(); } }
        );
        if (getAlldata.length === 0) { res.status(200).end(); }
        else { res.status(200).json(getAlldata).end(); }
    }
);

app.get( // full detail store
    '/imd/registerstore/:storeid',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const { storeid } = req.params;
        const getStoredata = await storeModel.find(
            {
                '_id': mongoose.Types.ObjectId(storeid)
            },
            (errors) => { if (errors) { res.status(500).end(); } }
        );
        if (getStoredata.length === 1) { res.status(200).json(getStoredata).end(); }
        else { res.status(200).end(); }
    }
);

// const RegisterImd_Agent_Save_FullController = require('./Controller/RegisterController').RegisterImd_Agent_Save_FullController;
// app.post( // register first agent {require POST => 'registerstore' before run this}
//     '/imd/registeragent',
//     requireJWTAuth,
//     adminIMDCheckUserMiddleware,
//     async (req, res) => {
//         try {
//             const payload = req.body;

//             const jwtDecodeResult = jwtDecodeData(req.header("authorization"));

//             if (
//                 typeof payload.username != 'string' || payload.username == ''
//                 || typeof payload.password != 'string' || payload.password == ''
//                 || payload.store.length != 1
//                 || typeof payload.store[0]._storeid != 'string' || payload.store[0]._storeid == ''
//                 || payload.store[0].branch.length != 1
//                 || typeof payload.store[0].branch[0]._branchid != 'string' || payload.store[0].branch[0]._branchid == ''
//                 || payload.store[0].role != 1
//                 || typeof payload.store[0].email != 'string' || payload.store[0].email == ''
//                 || typeof payload.store[0].user_status != 'boolean' || typeof payload.store[0].user_status == false
//                 || typeof payload.store[0].personal != 'object'
//                 || typeof payload.store[0].personal.pre_name != 'string' || payload.store[0].personal.pre_name == ''
//                 || typeof payload.store[0].personal.first_name != 'string' || payload.store[0].personal.first_name == ''
//                 || typeof payload.store[0].personal.last_name != 'string' || payload.store[0].personal.last_name == ''
//                 || typeof payload.store[0].personal.gender != 'string' || payload.store[0].personal.gender == ''
//                 || typeof payload.store[0].personal.birth_date != 'string' || payload.store[0].personal.birth_date == ''
//                 || typeof payload.store[0].personal.identity_card != 'object'
//                 || typeof payload.store[0].personal.identity_card.ctype != 'boolean'
//                 || typeof payload.store[0].personal.identity_card.id != 'string' || payload.store[0].personal.identity_card.id == ''
//                 || typeof payload.store[0].personal.address != 'object'
//             ) { res.status(400).end(); }
//             else {
//                 const saveResult = await RegisterImd_Agent_Save_FullController(
//                     {
//                         _ref_imd_agentid: jwtDecodeResult._agentid,
//                         agentData: {
//                             email: payload.store[0].email,
//                             password: payload.password,
//                             agentStoreData: {
//                                 _storeid: payload.store[0]._storeid,
//                                 _branchid: payload.store[0].branch[0]._branchid,
//                                 personal: payload.store[0].personal,
//                             }
//                         }
//                     },
//                     (err) => { if (err) { throw err; } }
//                 );

//                 if (!saveResult) { res.status(422).end(); }
//                 else {
//                     res.status(201).end();
//                 }
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(422).end();
//         }
//     }
// );


app.put(
    '/imd/agent/edit/:userid/:agentid/:storeid/:branchid',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const { userid, agentid, storeid, branchid } = await req.params;
        const payload = await req.body;
        const findBranchExist = await storeModel.aggregate(
            [
                {
                    '$match': {
                        '_id': mongoose.Types.ObjectId(storeid)
                    }
                }, {
                    '$unwind': {
                        'path': '$branch'
                    }
                }, {
                    '$match': {
                        'branch._id': mongoose.Types.ObjectId(branchid)
                    }
                }
            ]
        );
        if (findBranchExist.length != 1) { res.status(422).end(); }
        else {
            const findAgentExist = await agentModel.aggregate(
                [
                    {
                        '$match': {
                            '_id': mongoose.Types.ObjectId(userid)
                        }
                    }, {
                        '$unwind': {
                            'path': '$store'
                        }
                    }, {
                        '$match': {
                            'store._id': mongoose.Types.ObjectId(agentid),
                            'store._storeid': mongoose.Types.ObjectId(storeid),
                            'store.role': 1
                        }
                    }, {
                        '$unwind': {
                            'path': '$store.branch'
                        }
                    }, {
                        '$match': {
                            'store.branch._branchid': mongoose.Types.ObjectId(branchid)
                        }
                    }
                ]
            );
            if (findAgentExist.length != 1) { res.status(422).end(); }
            else {
                const agentModelTransaction = new agentModel(payload);
                await agentModel.updateOne(
                    {
                        '_id': mongoose.Types.ObjectId(userid),
                        'store._id': mongoose.Types.ObjectId(agentid),
                        'store._storeid': mongoose.Types.ObjectId(storeid),
                    },
                    {
                        $set: {
                            'store.$.personal': agentModelTransaction.store[0].personal
                        }
                    },
                    (errors, result) => { if (errors) { res.status(500).end(); } else { res.status(200).end(); } }
                );
            }
        }
    }
);

const RegisterImd_Agent_Save_FullController = require('./Controller/RegisterController').RegisterImd_Agent_Save_FullController;
app.post( // register agent branch
    '/imd/registeragentbranch',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        try {
            const payload = req.body;

            const jwtDecodeResult = jwtDecodeData(req.header("authorization"));
            
            if (
                typeof payload.username != 'string' || payload.username == ''
                || typeof payload.password != 'string' || payload.password == ''
                || payload.store.length != 1
                || typeof payload.store[0]._storeid != 'string' || payload.store[0]._storeid == ''
                || payload.store[0].branch.length != 1
                || typeof payload.store[0].branch[0]._branchid != 'string' || payload.store[0].branch[0]._branchid == ''
                || payload.store[0].role != 1
                || typeof payload.store[0].email != 'string' || payload.store[0].email == ''
                || typeof payload.store[0].user_status != 'boolean' || typeof payload.store[0].user_status == false
                || typeof payload.store[0].personal != 'object'
                || typeof payload.store[0].personal.pre_name != 'string' || payload.store[0].personal.pre_name == ''
                || typeof payload.store[0].personal.first_name != 'string' || payload.store[0].personal.first_name == ''
                || typeof payload.store[0].personal.last_name != 'string' || payload.store[0].personal.last_name == ''
                || typeof payload.store[0].personal.gender != 'string' || payload.store[0].personal.gender == ''
                || typeof payload.store[0].personal.birth_date != 'string' || payload.store[0].personal.birth_date == ''
                || typeof payload.store[0].personal.identity_card != 'object'
                || typeof payload.store[0].personal.identity_card.ctype != 'boolean'
                || typeof payload.store[0].personal.identity_card.id != 'string' || payload.store[0].personal.identity_card.id == ''
                || typeof payload.store[0].personal.address != 'object'
            ) { res.status(400).end(); }
            else {
                const saveResult = await RegisterImd_Agent_Save_FullController(
                    {
                        _ref_imd_agentid: jwtDecodeResult._agentid,
                        agentData: {
                            email: payload.store[0].email,
                            password: payload.password,
                            agentStoreData: {
                                _storeid: payload.store[0]._storeid,
                                _branchid: payload.store[0].branch[0]._branchid,
                                personal: payload.store[0].personal,
                            }
                        }
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!saveResult) { res.status(422).end(); }
                else {
                    res.status(201).end();
                }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

app.get( // agent detail by store and branch
    '/imd/agents/:storeid/:branchid',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const { storeid, branchid } = await req.params;
        try {
            mongoose.Types.ObjectId(storeid);
            mongoose.Types.ObjectId(branchid);
        } catch (error) {
            res.status(400).end();
        }
        const findAgents = await agentModel.aggregate(
            [
                {
                    '$match': {
                        'store._storeid': mongoose.Types.ObjectId(storeid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store'
                    }
                }, {
                    '$match': {
                        'store._storeid': mongoose.Types.ObjectId(storeid),
                        'store.role': 1
                    }
                }, {
                    '$match': {
                        'store.branch._branchid': mongoose.Types.ObjectId(branchid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store.branch'
                    }
                }, {
                    '$match': {
                        'store.branch._branchid': mongoose.Types.ObjectId(branchid)
                    }
                }
            ]
        );
        if (findAgents.length === 0) { res.status(200).end(); }
        else { res.status(200).json(findAgents).end(); }
    }
);

app.get(
    '/imd/agent/:userid/:agentid/:storeid/:branchid',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const { userid, agentid, storeid, branchid } = await req.params;
        const findAgent = await agentModel.aggregate(
            [
                {
                    '$match': {
                        '_id': mongoose.Types.ObjectId(userid)
                    }
                }, {
                    '$unwind': {
                        'path': '$store'
                    }
                }, {
                    '$match': {
                        'store._id': mongoose.Types.ObjectId(agentid),
                        'store._storeid': mongoose.Types.ObjectId(storeid),
                        'store.role': 1
                    }
                }, {
                    '$unwind': {
                        'path': '$store.branch'
                    }
                }, {
                    '$match': {
                        'store.branch._branchid': mongoose.Types.ObjectId(branchid)
                    }
                }
            ]
        );
        if (findAgent.length != 1) { res.status(422).end(); }
        else { res.status(200).json(findAgent[0]).end(); }
    }
);

app.post( // register time table
    '/imd/registertimetable',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const payload = req.body;
        if (
            typeof payload._storeid != 'string' || payload._storeid == ''
            || typeof payload._branchid != 'string' || payload._branchid == ''
            || typeof payload.timeFrom != 'string' || payload.timeFrom == ''
            || typeof payload.timeTo != 'string' || payload.timeTo == ''
        ) { res.status(400).end(); }
        else {
            let timeFrom_HH = parseInt(payload.timeFrom.split(':')[0]);
            let timeFrom_MM = parseInt(payload.timeFrom.split(':')[1]);
            let timeTo_HH = parseInt(payload.timeTo.split(':')[0]);
            let timeTo_MM = parseInt(payload.timeTo.split(':')[1]);
            if (timeFrom_MM >= 30) { timeFrom_MM = 30; } else { timeFrom_MM = 0; }
            if (timeTo_MM >= 30) { timeTo_MM = 30; } else { timeTo_MM = 0; }
            if (timeFrom_MM != 0 && timeTo_MM != 0) { res.status(500).end(); }
            else {
                const setSequence = Math.abs(timeTo_HH - timeFrom_HH);
                let elementFrom = timeFrom_HH;
                let elementFrom_MM = timeFrom_MM.toString().padStart(2, '0');
                let elementTo = timeFrom_HH;
                let elementTo_MM = timeTo_MM.toString().padStart(2, '0');
                let branchTime = [];
                for (let index = 0; index < setSequence; index++) {
                    elementFrom = timeFrom_HH + index;
                    elementTo = timeFrom_HH + 1 + index;
                    const strFrom = "" + elementFrom + ":" + elementFrom_MM;
                    const strTo = "" + elementTo + ":" + elementTo_MM;
                    branchTime.push(
                        {
                            'timeFrom': strFrom,
                            'timeTo': strTo
                        }
                    );
                };
                if (branchTime.length === 0) { res.status(422).end(); }
                else {

                    const findStoreExists = await storeModel.aggregate(
                        [
                            {
                                '$match': {
                                    '_id': mongoose.Types.ObjectId(payload._storeid)
                                }
                            }, {
                                '$unwind': {
                                    'path': '$branch'
                                }
                            }, {
                                '$match': {
                                    'branch._id': mongoose.Types.ObjectId(payload._branchid)
                                }
                            }
                        ]
                    );
                    if (findStoreExists.length === 0) { res.status(422).end(); }
                    else {
                        const findTimeTableExists = await timeschedule.find(
                            {
                                '_storeid': payload._storeid,
                                '_branchid': payload._branchid,
                            },
                            (errors) => { if (errors) { res.status(500).end(); } }
                        );
                        if (findTimeTableExists.length != 0) { res.status(200).end(); }
                        else {
                            const mapData = {
                                '_storeid': payload._storeid,
                                '_branchid': payload._branchid,
                                'data': branchTime
                            };
                            const transactionModel = new timeschedule(mapData);
                            transactionModel.save(
                                (errors) => { if (errors) { res.status(500).end(); } else { res.status(201).end(); } }
                            );
                        }
                    }
                }
            }
        }
    }
);

app.get( // imd timetable
    '/imd/timetable/:storeid/:branchid',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    async (req, res) => {
        const { storeid, branchid } = await req.params;
        try {
            mongoose.Types.ObjectId(storeid);
            mongoose.Types.ObjectId(branchid);
        } catch (error) {
            res.status(400).end();
        }
        const findTimeTable = await timeschedule.find(
            {
                '_storeid': mongoose.Types.ObjectId(storeid),
                '_branchid': mongoose.Types.ObjectId(branchid)
            },
            (errors, result) => { if (errors) { res.status(500).end(); } }
        );
        if (findTimeTable.length === 1) {
            res.status(200).json(findTimeTable[0]).end();
        } else {
            res.status(200).end();
        }
    }
);

const Route_ImdReportRaw = require('./Route/ImdReportRawRoute');
app.use(
    '/imd/report/raw',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    Route_ImdReportRaw
)

const Route_ImdMasterDataTemplate = require('./Route/ImdMasterDataTemplateRoute');
app.use(
    '/imd/masterdatatemplate',
    // requireJWTAuth,
    // adminIMDCheckUserMiddleware,
    Route_ImdMasterDataTemplate
);

const Rote_Store = require('./Route/StoreRoute');
app.use(
    '/store',
    // requireJWTAuth,
    Rote_Store
);
const Route_ImdMasterDataCustomer = require('./Route/ImdMasterDataCustomerRoute');
app.use(
    '/imd/masterdata-customer',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    Route_ImdMasterDataCustomer
);
const Route_ImdAgentDataCustomer = require('./Route/ImdAgentDataCustomerRoute');
app.use(
    '/imd/agentdate-customer',
    requireJWTAuth,
    adminIMDCheckUserMiddleware,
    Route_ImdAgentDataCustomer
);
const Route_Product = require('./Route/ProductRoute')
app.use(
    '/product',
    // requireJWTAuth,
    // adminIMDCheckUserMiddleware,
    Route_Product
);
const Route_Treatment = require('./Route/TreatmentRoute')
app.use(
    '/treatment',
    // requireJWTAuth,
    // adminIMDCheckUserMiddleware,
    Route_Treatment
);
//#endregion IMD Agents

const Route_Dashboard = require('./Route/DashboardRoute');
app.use(
    '/dashboard',
    // requireJWTAuth,
    Route_Dashboard
);

const Route_PurchaseOrder = require('./Route/PurchaseOrder');
app.use(
    '/purchaseorder',
    // requireJWTAuth,
    Route_PurchaseOrder
);

const Route_Patient = require('./Route/PatientRoute');
app.use(
    '/patient2',
    jwtLogin_Agent_StoreBranchMiddleware,
    Route_Patient
);


const Route_Agent = require('./Route/AgentRoute');
app.use(
    '/agent2',
    jwtLogin_Agent_StoreBranchMiddleware,
    Route_Agent
);

const LoginRoute = require('./Route/LoginRoute');
app.use(
    '/login',
    //requireJWTAuth,
    LoginRoute
);

app.listen(EXPRESSPORT, () => { console.log(`Kaiyaphap-backend Version: ${KYP_System_API_Version}\nServer is Running at PORT: ${EXPRESSPORT}\nMongoDB URI: ${mongoURI}\nCors: ${corsOrigin.split(',')}`) });
