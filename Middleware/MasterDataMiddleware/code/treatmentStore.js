const ObjectId = require('mongoose').Types.ObjectId;


const Express = require("express");

/** @type {Express.RequestHandler} */
const treatmentStoreMiddleware_save = async (req, res, next) => {
    try {
        const payload = await req.body;
        if(typeof payload._storeid != 'string' || payload._storeid == ''){ res.status(400).end(); }
        else if (typeof payload._branchid != 'string' || payload._branchid == '') { res.status(400).end(); }
        else if (typeof payload.name != 'string' || payload.name == '') { res.status(400).end(); }
        else if (typeof payload.price != 'number' || payload.price == null) { res.status(400).end(); }
        else {
            ObjectId(payload._storeid);
            ObjectId(payload._branchid);
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(422).end();
    }
}

/** @type {Express.RequestHandler} */
const treatmentStoreMiddleware_get = async (req, res, next) => {
    try {
        const { storeid, branchid } = req.params;
        if(typeof storeid != 'string' || storeid == ''){ res.status(400).end(); }
        else if (typeof branchid != 'string' || branchid == '') { res.status(400).end(); }
        else {
            ObjectId(storeid);
            ObjectId(branchid);
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(400).end();
    }
}

/** @type {Express.RequestHandler} */
const treatmentStoreMiddleware_put= async (req, res, next) => {
    try {
        const payload = await req.body;
        if(typeof payload._id != 'string' || payload._id == ''){ res.status(400).end(); }
        else if(typeof payload._storeid != 'string' || payload._storeid == ''){ res.status(400).end(); }
        else if (typeof payload._branchid != 'string' || payload._branchid == '') { res.status(400).end(); }
        else if (typeof payload.name != 'string' || payload.name == '') { res.status(400).end(); }
        else if (typeof payload.price != 'number' || payload.price == null) { res.status(400).end(); }
        else if (typeof payload.isused != 'boolean' || payload.isused == null) { res.status(400).end(); }
        else {
            ObjectId(payload._id);
            ObjectId(payload._storeid);
            ObjectId(payload._branchid);

            next();
        }
    } catch (error) {
        console.error(error);
        res.status(400).end();
    }
} 


/** @type {Express.RequestHandler} */
const treatmentStoreMiddleware_Status_patch= async (req, res, next) => {
    try {
        const payload = await req.body;
        if(typeof payload._id != 'string' || payload._id == ''){ res.status(400).end(); }
        else if(typeof payload._storeid != 'string' || payload._storeid == ''){ res.status(400).end(); }
        else if (typeof payload._branchid != 'string' || payload._branchid == '') { res.status(400).end(); }
        else {
            ObjectId(payload._id);
            ObjectId(payload._storeid);
            ObjectId(payload._branchid);

            next();
        }
    } catch (error) {
        console.error(error);
        res.status(400).end();
    }
} 


module.exports = { 
    treatmentStoreMiddleware_save,
    treatmentStoreMiddleware_get,
    treatmentStoreMiddleware_put,
    treatmentStoreMiddleware_Status_patch,
};