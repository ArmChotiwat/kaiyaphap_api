// *** Route => /imd/masterdata-customer
const express = require('express');
const router = express.Router();
// const jwtDecodeData = require('../Controller/miscController').jwtDecodeData;

router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);


// Route GET => /imd/masterdata-customer/case-type/viewall
// ดู Case Type ทั้งหมด ของลูกค้า ตามร้าน/สาขา
const imdViewAll_Case_Type_StoreBranchMiddleware = require('../Middleware/ImdMasterDataCustomerMiddleware').imdViewAll_Case_Type_StoreBranchMiddleware;
const imdViewAll_Case_Type_StoreBranchController = require('../Controller/ImdMasterDataCustomerController').imdViewAll_Case_Type_StoreBranchController;
router.get(
    '/case-type/viewall',
    imdViewAll_Case_Type_StoreBranchMiddleware,
    async (req, res) => {
        try {
            /**
             ** Query String => {
                    "_ref_storeid": { type: StringObjectId },
                    "_ref_branchid": { type: StringObjectId },
                }
            */
            const { _ref_storeid, _ref_branchid } = req.query;

            const getResult = await imdViewAll_Case_Type_StoreBranchController(
                {
                    _ref_storeid: _ref_storeid,
                    _ref_branchid: _ref_branchid
                },
                (err) => { if (err) { throw err; } }
            );

            if (!getResult) { res.status(422).end(); return; }
            else {
                res.status(200).json(getResult).end();
                return;
            }

        } catch (error) {
            console.error();
            res.status(422).end();
            return;
        }
    }
);


// Route PATCH => /imd/masterdata-customer/case-type/switch
// เปิด-ปิด Case Type ของลูกค้า ตามร้าน/สาขา
const imdSwitch_Case_Type_StoreBranchMiddleware = require('../Middleware/ImdMasterDataCustomerMiddleware').imdSwitch_Case_Type_StoreBranchMiddleware;
const imdSwitch_Case_Type_StoreBranchController = require('../Controller/ImdMasterDataCustomerController').imdSwitch_Case_Type_StoreBranchController;
router.patch(
    '/case-type/switch',
    imdSwitch_Case_Type_StoreBranchMiddleware,
    async (req, res) => {
        try {
            /**
             ** JSON => {
                    "_ref_storeid": { type: StringObjectId },
                    "_ref_branchid": { type: StringObjectId },
                    "_ref_case_typeid": { type: StringObjectId },
                }
            */
            const { _ref_storeid, _ref_branchid, _ref_case_typeid } = req.body;

            const switchResult = await imdSwitch_Case_Type_StoreBranchController(
                {
                    _ref_storeid: _ref_storeid,
                    _ref_branchid: _ref_branchid,
                    _ref_case_typeid: _ref_case_typeid
                },
                (err) => { if (err) { throw err; } }
            );

            if (!switchResult) { res.status(422).end(); return; }
            else {
                res.status(200).end();
                return;
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
            return;
        }
    }
);


module.exports = router;