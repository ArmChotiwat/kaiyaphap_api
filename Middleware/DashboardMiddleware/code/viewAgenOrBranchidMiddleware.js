const Express = require('express');
/** @type {Express.RequestHandler} */
const view_agen_Middleware = async (req, res, next) => {
    const validateObjectId = require('../../../Controller/miscController').validateObjectId;
    const { storeid, branchid, patientid, scheduleid } = req.query;
  
}

module.exports =  view_agen_Middleware ;
