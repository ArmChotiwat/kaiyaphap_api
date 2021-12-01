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

// Route PATCH => /store/taxid
const storeTaxId_Update_Middleware = require('../Middleware/StoreMiddleware').storeTaxId_Update_Middleware;
const storeTaxId_Update_Controller = require('../Controller/StoreController').storeTaxId_Update_Controller;
router.patch(
    '/taxid',
    storeTaxId_Update_Middleware,
    async (req, res) => {
        try {
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload._storeid) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_branchid) !== payload._branchid) { res.status(401).end(); }
            else {
                const requestSaved = await storeTaxId_Update_Controller(
                    {
                        _storeid: String(jwtDecodeToekn._ref_storeid),
                        _branchid: String(jwtDecodeToekn._ref_branchid),
                        _agentid: String(jwtDecodeToekn._ref_agent_userid),
                        tax_id: payload.tax_id,
                        update_all: false
                    },
                    (err) => { if (err) { throw err; } }
                );
        
                if (!requestSaved) { res.status(422).end(); }
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

// Route POST => /store/upload/imagestore
const store_Upload_Image_Middleware = require('../Middleware/StoreMiddleware').store_Upload_Image_Middleware;
const store_Upload_Image_Controller = require('../Controller/masterDataController').uploadImageStore_save;
router.post(
    '/upload/imagestore',
    store_Upload_Image_Middleware,
    async (req, res) => {
        try {
            /*
                Params => {
                    "file": { type: file },
                    "storeid": { type: StringObjectId },
                }
            */
            const payload = req.body;

            const authorlization = req.header("authorization");
            const jwtDecodeToekn = jwtDecode_Login_StoreBranchController(authorlization);

            if (!jwtDecodeToekn) { res.status(401).end(); }
            else if (String(jwtDecodeToekn._ref_storeid) !== payload.storeid) { res.status(401).end(); }
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
                    const fileReq = req.files;
                    
                    const StoreImagesController = await store_Upload_Image_Controller(
                        {   
                            _branchid : String(chkAgent._branchid),
                            _storeid : String(chkAgent._storeid),
                            images: fileReq,
                            parameter: payload,
                            role : chkAgent.role

                        }, (err) => { if (err) { throw err; } }
                    );

                    if (!StoreImagesController) { res.status(422).end(); }
                    else {
                        res.status(201).end();
                    }
                }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// Route GET => /store/view/imagestore/:storeid/:branchid
const view_Image_Store_Middleware = require('../Middleware/StoreMiddleware').view_Image_Store_Middleware
const view_Image_Store_Controller = require('../Controller/masterDataController').uploadImageStore_get;
router.get(
    '/view/imagestore/:storeid/:branchid',
    view_Image_Store_Middleware,
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
                    const ViewStoreImagesController = await view_Image_Store_Controller(
                        {
                            _storeid: String(jwtDecodeToekn._ref_storeid),
                            _branchid : String(jwtDecodeToekn._ref_branchid)
            
                        }, (err) => { if (err) { throw err; } }
                    );
                    if (!ViewStoreImagesController) { res.status(422).end(); }
                    else {
                        res.status(200).json(ViewStoreImagesController).end();
                    }
                }
            }
        } catch (error) {
            console.error(error);
            res.status(422).end();
        }
    }
);

// Route GET => /store/view/imagestorefullpath /:storeid/:branchid
const view_Image_Store_Middleware2 = require('../Middleware/StoreMiddleware').view_Image_Store_Middleware
const viewImageStore_full_path = require('../Controller/masterDataController').viewImageStore_full_path;
router.get(
    '/view/imagestorefullpath/:storeid/:branchid',
    view_Image_Store_Middleware2,
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
                    const ViewStoreImagesController = await viewImageStore_full_path(
                        {
                            _storeid: String(jwtDecodeToekn._ref_storeid),
                            _branchid : String(jwtDecodeToekn._ref_branchid)
        
                        }, (err) => { if (err) { throw err; } }
                    );
                    if (!ViewStoreImagesController) { res.status(422).end(); }
                    else {
                        res.status(200).json(ViewStoreImagesController).end();
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