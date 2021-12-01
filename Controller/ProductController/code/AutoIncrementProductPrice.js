const AutoIncrementProductPrice = async (data = { _productid: new String(''), _storeid: new String(''), _branchid: new String(''), data2: new Object() }, callback = (err = new Error) => { }) => {
    if (typeof data != 'object') { callback(new Error(`AutoIncrementProductPrice: data must be Object`)); return; }
    else if (typeof data._productid != 'string' || data._productid == '') { callback(new Error(` ${data._productid} : AutoIncrementProductPrice : data._productid must be String and Not Empty`)); return; }
    else if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(` ${data._storeid} : AutoIncrementProductPrice : data._storeid must be String and Not Empty`)); return; }
    else if (typeof data._branchid != 'string' || data._branchid == '') { callback(new Error(`${data._branchid} : AutoIncrementProductPrice : data._branchid must be String and Not Empty`)); return; }
    else if (typeof data.data2 != 'object' || data.data2 == '') { callback(new Error(`${data.data2} : AutoIncrementProductPrice : data.data2 must be string and Not Empty`)); return; }
    else {
        const checkStore = require('../../mongodbController').checkStore;
        const chkStore = await checkStore({ _storeid: data._storeid }, (err) => { callback(err); return; });

        if (!chkStore) { callback(new Error('AutoIncrementProductPrice: _storeid NOT Found')); return; }
        else {
            const checkObjectId = require('../../mongodbController').checkObjectId;
            const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
            const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
            const _productid = await checkObjectId(data._productid, (err) => { if (err) { callback(err); return; } });

            const mapData = {
                _productid: _productid,
                _storeid: _storeid,
                _branchid: _branchid,
            };

            const AutoIncrementproductInventoryPriceModel = require('../../mongodbController').AutoIncrementproductInventoryPriceModel;
            const transactionSave = new AutoIncrementproductInventoryPriceModel(mapData);
            const resultdata = await transactionSave.save().then(result => (result)).catch((err) => { callback(err); return; });

            if (!resultdata) {
                callback(new Error(`AutoIncrementProductPrice: save Document failed`));
                return;
            }
            else {
                const productInventoryPrice = require('../../mongodbController').productInventoryPriceModel;
                const _id = await checkObjectId(data.data2._id, (err) => { if (err) { callback(err); return; } });

                let i = 1;
                while (i <= 10) {
                    i++;

                    let Updata_run_number_inventoryimport = await productInventoryPrice.findOne({'_id': _id}, (err) => { if (err) callback(err); return; });

                    if (!Updata_run_number_inventoryimport) { callback(new Error(`AutoIncrementProductPrice: Updata_run_number_inventoryimport return not found`)); return; }
                    else {
                        Updata_run_number_inventoryimport.run_number_inventoryimport = resultdata.seq;

                        const updateResult = await Updata_run_number_inventoryimport.save().then(result => (result)).catch(err => { return; });

                        if (!updateResult) { continue; }
                        else {
                            callback(null);
                            return updateResult; // Sucessfull
                        }
                    }
                }

                callback(new Error(`AutoIncrementProductPrice: updateResult do failed or server is busy`));
                return;
            }
        }
    }
};
module.exports = {
    AutoIncrementProductPrice
};