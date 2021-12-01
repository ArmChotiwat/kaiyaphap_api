// Route => /masterdata/illness-history
const express = require('express');
const router = express.Router();
const { jwtDecode_Login_StoreBranchController } = require('../../Controller/JwtController/index');


// Route => /masterdata/illness-history
router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);


// Route POST => /masterdata/illness-history/save
// เพิ่ม ประวัติการเจ็บป่วย
const illnessHistoryMiddleware_save = require('../../Middleware/MasterDataMiddleware').illnessHistoryMiddleware_save;
const illnessHistoryController_save = require('../../Controller/masterDataController').illnessHistoryController.illnessHistoryController_save;
router.post(
    '/save',
    illnessHistoryMiddleware_save,
    async function (req, res) {
        try {
            /**
             ** JSON => {
                    "_storeid": { typer: StringObjectId },
                    "name": { typer: String },
                }
            */
            const payload = await req.body;

            const transactionSave = await illnessHistoryController_save(
                {
                    _storeid: payload._storeid,
                    name: payload.name
                },
                (err) => { if (err) { throw err; } }
            );
            if (!transactionSave) { res.status(422).end(); }
            else {
                res.status(201).end();
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route PUT => /masterdata/illness-history/edit
// แก้ไข ประวัติการเจ็บป่วย
const illnessHistoryMiddleware_put = require('../../Middleware/MasterDataMiddleware').illnessHistoryMiddleware_put;
const illnessHistoryController_put = require('../../Controller/masterDataController').illnessHistoryController.illnessHistoryController_put;
router.put(
    '/edit',
    illnessHistoryMiddleware_put,
    async (req, res) => {
        try {
            /**
             ** JSON => {
                    "_storeid": { type: StringOjectId },
                    "_illnessHistoryid": { type: StringOjectId },
                    "name": { type: String },
                    "isused": { type: Boolean },
                }
             */
            const payload = req.body;
        
            const editResult = await illnessHistoryController_put(
                {
                    _storeid: payload._storeid,
                    _ilnessHistoryid: payload._illnessHistoryid,
                    name: payload.name,
                    isused: payload.isused
                },
                (err) => { if (err) { throw err; } }
            );

            if (!editResult) { res.status(422).end(); }
            else {
                res.status(200).end();
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route PATCH => /masterdata/illness-history/switch-status
// เปิด-ปิด ประวัติการเจ็บป่วย
const illnessHistoryMiddleware_patch = require('../../Middleware/MasterDataMiddleware').illnessHistoryMiddleware_patch;
const illnessHistoryController_Status_patch = require('../../Controller/masterDataController').illnessHistoryController.illnessHistoryController_Status_patch;
router.patch(
    '/switch-status',
    illnessHistoryMiddleware_patch,
    async (req, res) => {
        try {
            /**
             ** JSON => {
                    "_storeid": { type: StringOjectId },
                    "_illnessHistoryid": { type: StringOjectId },
                }
            */
            const payload = req.body;

            const switchResult = await illnessHistoryController_Status_patch(
                {
                    _storeid: payload._storeid,
                    _ilnessHistoryid: payload._illnessHistoryid,
                },
                (err) => { if (err) { throw err; } }
            );

            if (!switchResult) { res.status(422).end(); }
            else {
                res.status(200).end();
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route GET => /masterdata/illness-history/view
const illnessHistoryMiddleware_get = require('../../Middleware/MasterDataMiddleware').illnessHistoryMiddleware_get;
const illnessHistoryController_get = require('../../Controller/masterDataController').illnessHistoryController.illnessHistoryController_get;
// ดู ประวัติการเจ็บป่วย (แสดงเฉพาะที่ใช้งานได้)
router.get(
    '/view',
    illnessHistoryMiddleware_get,
    async function (req, res) {
        try {
            /**
             ** Params => {
                    "storeid": { typer: StringObjectId },
                }
            */
            const { storeid } = req.query;

            const getResult = await illnessHistoryController_get(
                {
                    _storeid: storeid
                },
                (err) => { if (err) { throw err; } }
            );
            if (!getResult) {
                res.status(200).end();
            }
            else {
                res.status(200).json(getResult).end();
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);





// Route GET => /masterdata/illness-history/viewall
const illnessHistoryMiddleware_All_get = require('../../Middleware/MasterDataMiddleware').illnessHistoryMiddleware_All_get;
const illnessHistoryController_All_get = require('../../Controller/masterDataController').illnessHistoryController.illnessHistoryController_All_get;
// ดู ประวัติการเจ็บป่วย (แสดงที่ใช้งานได้ และไม่ได้)
router.get(
    '/viewall',
    illnessHistoryMiddleware_All_get,
    async function (req, res) {
        try {
            /**
             ** Params => {
                    "storeid": { typer: StringObjectId },
                }
            */
            const { storeid } = req.query;

            const getResult = await illnessHistoryController_All_get(
                {
                    _storeid: storeid
                },
                (err) => { if (err) { throw err; } }
            );
            if (!getResult) {
                res.status(200).end();
            }
            else {
                res.status(200).json(getResult).end();
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);




module.exports = router;