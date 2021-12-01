const express = require('express');
const router = express.Router();
const { jwtDecode_Login_StoreBranchController } = require('../Controller/JwtController/index');

// Route => /product
router.all(
    '/',
    (req, res) => {
        res.status(200).end();
    }
);


// Route POST => /product/create
// สร้าง ระเบียนสินค้า
const product_Save_Middleware = require('../Middleware/ProductMiddileware').product_Save_Middleware;
const product_Save_Controller = require('../Controller/ProductController').product_Save_Controller;
router.post(
    '/create',
    product_Save_Middleware,
    async function (req, res) {
        try {
            /**
             ** JSON => {
                    "_storeid": { type: StringObjectId },
                    "product_name": { type: String },
                    "product_serial": { type: String OR null },
                    "product_category": { type: String OR null },
                    "product_brand": { type: String OR null },
                    "product_main_version": { type: String OR null },
                    "product_sub_version": { type: String OR null },
                    "_ref_product_groupid": { type: StringObjectId Or null },
                }
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else {
                const saveProductResult = await product_Save_Controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        product_name: payload.product_name,
                        product_serial: payload.product_serial,
                        product_category: payload.product_category,
                        product_brand: payload.product_brand,
                        product_main_version: payload.product_main_version,
                        product_sub_version: payload.product_sub_version,
                        _ref_product_groupid: payload._ref_product_groupid,
                        // product_validation: payload.product_validation, #### Future Feature By Nong Arm
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!saveProductResult) { res.status(422).end(); }
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


// Route PUT => /product/edit
// แก้ไข ระเบียนสินค้า
const product_Edit_Middleware = require('../Middleware/ProductMiddileware').product_Edit_Middleware;
const prodcut_Edit_Controller = require('../Controller/ProductController').prodcut_Edit_Controller;
router.put(
    '/edit',
    product_Edit_Middleware,
    async function (req, res) {
        try {
            /**
             ** JSON => {
                    "_storeid": { type: StringObjectId },
                    "_ref_productid": { type: StringObjectId },
                    "product_name": { type: String },
                    "product_serial": { type: String OR null },
                    "product_category": { type: String OR null },
                    "product_brand": { type: String OR null },
                    "product_main_version": { type: String OR null },
                    "product_sub_version": { type: String OR null },
                    "_ref_product_groupid": { type: StringObjectId Or null },
                }
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else {
                const editProductResult = await prodcut_Edit_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _ref_productid: payload._ref_productid,
                        product_name: payload.product_name,
                        product_serial: payload.product_serial,
                        product_category: payload.product_category,
                        product_brand: payload.product_brand,
                        product_main_version: payload.product_main_version,
                        product_sub_version: payload.product_sub_version,
                        _ref_product_groupid: payload._ref_product_groupid,
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!editProductResult) { res.status(422).end(); }
                else {
                    res.status(200).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route GET => /product/viewall/:storeid/:branchid
// ดู ระเบียนสินค้า ทั้งหมด
const product_View_All_Controller = require('../Controller/ProductController').product_View_All_Controller;
router.get(
    '/viewall/:storeid/:branchid',
    async (req, res) => {
        try {
            /**
             ** Params => {
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId }
                }
            */
            const { storeid, branchid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await product_View_All_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );

                if (!getResult) { res.status(422).end(); }
                else {
                    res.status(200).json(getResult).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route GET => /product/inventory/viewall/:storeid/:branchid
// ดู สินค้าคงคลัง (ทั้งหมด) ตามสาขา
const productInventory_StoreBranch_View_All_Middleware = require('../Middleware/ProductMiddileware').productInventory_StoreBranch_View_All_Middleware;
const productInventory_StoreBranch_View_All_Controller = require('../Controller/ProductController').productInventory_StoreBranch_View_All_Controller;
router.get(
    '/inventory/viewall/:storeid/:branchid',
    productInventory_StoreBranch_View_All_Middleware,
    async function (req, res) {
        try {
            /**
             ** JSON => {
                    "_storeid": { type: StringObjectId },
                    "_branchid": { type: StringObjectId },
                }
            */
            const { storeid, branchid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await productInventory_StoreBranch_View_All_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!getResult) { res.status(422).end(); }
                else {
                    res.status(200).json(getResult).end();
                }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route PATCH => /product/inventory/edit
// แก้ไข เปิด-ปิด สินค้าคงคลัง ตามสาขา
const productInventory_Switch_Middleware = require('../Middleware/ProductMiddileware').productInventory_Switch_Middleware;
const productInventory_Switch_Controller = require('../Controller/ProductController').productInventory_Switch_Controller;
router.patch(
    '/inventory/edit',
    productInventory_Switch_Middleware,
    async function (req, res) {
        try {
            /**
             ** JSON => {
                    "_storeid": { type: StringObjectId },
                    "_branchid": { type: StringObjectId },
                    "_ref_productid": { type: StringObjectId },
                }
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
            else {
                const editProductResult = await productInventory_Switch_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                        _ref_productid: payload._ref_productid,
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!editProductResult) { res.status(422).end(); }
                else {
                    res.status(200).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route POST => /product/inventoryimport/craete
// สร้าง ใบสินค้านำเข้า เพื่อนำเข้าจำนวนสินค้า ไปยังสินค้าคงคลัง ตามสาขา
const productInventoryImport_Save_Middileware = require('../Middleware/ProductMiddileware').productInventoryImport_Save_Middileware;
const productInventoryImport_Save_Controller = require('../Controller/ProductController').productInventoryImport_Save_Controller;
router.post(
    '/inventoryimport/craete',
    productInventoryImport_Save_Middileware,
    async function (req, res) {
        try {
            /**
             ** JSON => {
                    "_storeid": { type: StringObjectId },
                    "_branchid": { type: StringObjectId },
                    "import_date_string": { type: DateString }, // วันที่นำเข้าสินค้า YYYY-MM-DD
                    "import_time_string": { type: TimeString }, // เวลาที่นำเข้าสินค้า HH:mm:ss
                    "_ref_agentid_import": { type: StringObjectId }, // _agentid ผู้จัดซื้อ-นำเข้าสินค้า
                    "run_number_inventoryimport_customize": { type: String }, // เลขที่เองสารกำหนดเอง โดย User
                    "run_number_inventoryimport_ref": { type: String }, // เลขที่เอกสารอ้างอิง โดย User
                    "product": [
                        {
                            "_ref_productid": { type: StringObjectId }, // ObjectId ระเบียนสินค้า
                            "inventoryimport_count": { type: Number morethan or equal 0 }, // จำนวนสินค้านำเข้า
                            "inventoryimport_price": { type: Number morethan or equal 0 } // ราคาสินค้านำเข้า (ราคาที่ซื้อมา)
                        }
                    ]
                }
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
            else {
                const saveResult = await productInventoryImport_Save_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),

                        import_date_string: payload.import_date_string,
                        import_time_string: payload.import_time_string,
                        _ref_agentid_import: payload._ref_agentid_import,

                        run_number_inventoryimport_customize: payload.run_number_inventoryimport_customize,
                        run_number_inventoryimport_ref: payload.run_number_inventoryimport_ref,
                        
                        product: payload.product,
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


// Route GET => /product/inventoryimport/viewagent/:storeid/:branchid
// ดู รายชื่อ Admin/นักกายภาพ ที่ใช้งานอยู่ ตามสาขา
const productInventoryImport_View_Agent_Middleware = require('../Middleware/ProductMiddileware').productInventoryImport_View_Agent_Middleware;
const productInventoryImport_View_Agent_Controller = require('../Controller/ProductController').productInventoryImport_View_Agent_Controller;
router.get(
    '/inventoryimport/viewagent/:storeid/:branchid',
    productInventoryImport_View_Agent_Middleware,
    async function (req, res) {
        try {
            /**
             ** Params => {
                    "storeid": { type: StringObjectId },
                    "branchid": { type: StringObjectId },
                }
            */
            const { storeid, branchid } = req.params;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== branchid) { res.status(401).end(); }
            else {
                const getResult = await productInventoryImport_View_Agent_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),
                    },
                    (err) => { if (err) { throw err; } }
                );
                if (!getResult) { res.status(422).end(); }
                else {
                    res.status(200).json(getResult).end();
                }
            }

        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);


// Route POST => /product/productprice/craete
// บันทึก-ปรับ ราคาสินค้าปัจจุบัน ตามสาขา
const productInventoryPrice_Save_Controller = require('../Controller/ProductController').productInventoryPrice_Save_Controller;
const productInventoryPrice_Save_Middleware = require('../Middleware/ProductMiddileware').productInventoryPrice_Save_Middleware;
router.post(
    '/productprice/craete',
    productInventoryPrice_Save_Middleware,
    async (req, res) => {
        try {
            /**
             ** JSON => {
                    "_storeid": { type: StringObjectId }, // ObjectId ร้าน
                    "_branchid": { type: StringObjectId }, // ObjectId สาขา
                    "_ref_productid": { type: StringObjectId }, // ObjectId ระเบียนสินค้า
                    "product_price": { type: Number morethan or equal 0 }, // ราคาสินค้าที่จะตั้ง
                    "run_number_inventoryimport_customize": { type: String Or null }, // เลขที่เองสารกำหนดเอง โดย User
                    "run_number_inventoryimport_ref": { type: String Or null }, // เลขที่เอกสารอ้างอิง โดย User
                }
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
            else {
                const saveResult = await productInventoryPrice_Save_Controller(
                    {
                        _ref_storeid: String(jwtDecodeToekn._ref_storeid),
                        _ref_branchid: String(jwtDecodeToekn._ref_branchid),
                        _ref_agentid: String(jwtDecodeToekn._ref_agent_userid),

                        run_number_inventoryimport_customize: payload.run_number_inventoryimport_customize,
                        run_number_inventoryimport_ref: payload.run_number_inventoryimport_ref,

                        _ref_productid: payload._ref_productid,
                        product_price: payload.product_price,
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


// Route => /product/upload/files
const product_Images_Controller = require('../Controller/ProductController/code/productImagesController');
router.post( // Upload Image For Agent
    '/upload/files',
    async (req, res) => {
        try {
            const { checkAgentId } = require('../Controller/miscController');

            const payload = req.body;

            const fileReq = req.files;
            
            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
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
                    const productImagesController = await product_Images_Controller(
                        {
                            images: fileReq,
                            parameter: payload
        
                        }, (err) => { if (err) { console.error(err); res.status(422).end(); } }
                    );
                    if (!productImagesController) { res.status(422).end(); }
                    else {
                        res.status(201).end();
                    }
                }
            }

        } catch (error) {
            res.status(422).send(error).end();
        }
    }
);

module.exports = router;