/**
 * Sub Controller สำหรับ ทำ Auto Increment ของ PurcahseOrder Model
 */
const AutoIncrement_PurchaseOrder_Controller = async (
    data = {
        _ref_poid: '',
        _ref_storeid: '',
        _ref_branchid: '',
        timeStamp: new Date()
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = `AutoIncrement_PurchaseOrder_Controller`;

    const moment = require('moment');

    const miscController = require('../../miscController');
    const validateObjectId = miscController.validateObjectId;

    const mongodbController = require('../../mongodbController');
    const ObjectId = mongodbController.mongoose.Types.ObjectId;
    const purchaseOrderModel = mongodbController.purchaseOrderModel;
    const AutoIncrementPurchaseOrderModel = mongodbController.AutoIncrementPurchaseOrderModel;

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (typeof data._ref_poid != 'string' || !validateObjectId(data._ref_poid)) { callback(new Error(`${controllerName}: <data._ref_poid> must be String ObjectId`)); return; }
    else if (typeof data._ref_storeid != 'string' || !validateObjectId(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (typeof data._ref_branchid != 'string' || !validateObjectId(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else if (!moment(data.timeStamp).isValid()) { callback(new Error(`${controllerName}: <data.timeStamp> must be Moment Date Object`)); return; }
    else {
        const _ref_poid = ObjectId(data._ref_poid);
        const _ref_storeid = ObjectId(data._ref_storeid);
        const _ref_branchid = ObjectId(data._ref_branchid);
        const currentDate = moment(data.timeStamp);
        const currentYear = currentDate.year();
        const currentMonth = currentDate.month() + 1;

        let findPurchaseOrder = await purchaseOrderModel.findOne(
            {
                '_id': _ref_poid,
                '_ref_storeid': _ref_storeid,
                '_ref_branchid': _ref_branchid
            },
            {},
            (err) => { if (err) { callback(err); return; } }
        );

        if (!findPurchaseOrder) { callback(new Error(`${controllerName}: findPurchaseOrder return not found`)); return; }
        else {
            const mapNewDocumentIncrement = {
                _ref_storeid: _ref_storeid,
                _ref_branchid: _ref_branchid,
                year: currentYear,
                month: currentMonth
            };
    
            const newDocument = new AutoIncrementPurchaseOrderModel(mapNewDocumentIncrement);
            const transactionSaveIncrement = await newDocument.save().then(result => result).catch(err => { if (err) { callback(err); return; } });
            
            if (!transactionSaveIncrement) { callback(new Error(`${controllerName}: transactionSaveIncrement have error`)); return; }
            else { // Update Data PurchaseOrder
                findPurchaseOrder.run_number = transactionSaveIncrement.seq;
                // PO1994020001
                // PO-1994-02-0001
                // PO1994029999
                // PO-1994-02-9999
                // PO19940210000
                // PO-1994-02-10000
                findPurchaseOrder.run_po = `PO${currentYear}${String(currentMonth).padStart(2, '0')}${String(transactionSaveIncrement.seq).padStart(4,'0')}`;

                const Retry_Max = 10;
                for (let index = 0; index < Retry_Max; index++) {
                    const transactionUpdatePO = await findPurchaseOrder.save().then(result => result).catch(err => { if (err) { console.error(err); return; } });

                    if (!transactionUpdatePO) { continue; }
                    else { // AutoIncrement Update Passed
                        callback(null);
                        return {
                            _ref_poid: ObjectId(transactionUpdatePO._id),

                            _ref_storeid: Object(transactionUpdatePO._ref_storeid),
                            _ref_branchid: Object(transactionUpdatePO._ref_branchid),
                            _ref_autoinc_purchaseorderid: Object(transactionSaveIncrement._id),
                            year: Number(transactionSaveIncrement.year),
                            month: Number(transactionSaveIncrement.month)
                        };
                    }
                }

                // AutoIncrement Update Failed
                callback(new Error(`${controllerName}: transactionUpdatePO have error`));
                return;
            }
        }
    }
};

module.exports = AutoIncrement_PurchaseOrder_Controller;