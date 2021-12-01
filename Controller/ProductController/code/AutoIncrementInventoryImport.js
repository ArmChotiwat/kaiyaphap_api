const AutoIncrementInventoryImport = async (data = { _storeid: new String(''), _branchid: new String(''), data2: new Object() }, callback = (err = new Error) => { }) => {
    const moment = require('moment');
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const checkStore = require('../../mongodbController').checkStore;
    const AutoIncrementInventoryImportModel = require('../../mongodbController').AutoIncrementInventoryImportModel;
    const ProducrinventoryImportModel = require('../../mongodbController').inventoryImportModel;
    const currentTime = moment();
    const currentYear = currentTime.year();
    const currentMonth = currentTime.month() + 1;

    if (typeof data != 'object') { callback(new Error(`AutoIncrementInventoryImport: data must be Object`)); return; }
    else if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(` ${data._storeid} : AutoIncrementInventoryImport : data._storeid must be String and Not Empty`)); return; }
    else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`${data._branchid} : AutoIncrementInventoryImport : data._storeid must be String and Not Empty`)); return; }
    else if (typeof data.data2 != 'object' || data.data2 == '') { callback(new Error(`${data.data2} : AutoIncrementInventoryImport : data.data2 must be string and Not Empty`)); return; }
    else {
        const chkStore = await checkStore({ _storeid: data._storeid }, (err) => { callback(err); return; });
        if (!chkStore) { callback(new Error('AutoIncrementInventoryImport: _storeid NOT Found')); return; }
        else {
            const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
            const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
            const mapData = {
                _storeid: _storeid,
                _branchid: _branchid,
                year: currentYear,
                month: currentMonth,
            }
            const transactionSave = new AutoIncrementInventoryImportModel(mapData);
            const resultdata = await transactionSave.save()
                .then(
                    (result) => { return result; }
                )
                .catch(
                    (err) => { callback(err); return; }
                );
            callback(null);
            if (!resultdata) {
                return;
            } else {
                const _id = await checkObjectId(data.data2._id, (err) => { if (err) { callback(err); return; } });
                let i = 1;
                while (i <= 10) {
                    let Updata_product_inventory_import_count = await ProducrinventoryImportModel.findOne(
                        {
                            '_id': _id
    
                        }, (err) => { if (err) callback(err); return; }
                    );
                    Updata_product_inventory_import_count.run_number_inventoryimport = resultdata.seq ;
                    Updata_product_inventory_import_count = await Updata_product_inventory_import_count.save();
                    if (Updata_product_inventory_import_count != null || Updata_product_inventory_import_count != '') {
                        break;
                    }
                    i++;
                }
            }
            return resultdata;
        }
    }

};
module.exports = {
    AutoIncrementInventoryImport
};