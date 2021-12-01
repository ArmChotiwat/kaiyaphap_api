const AutoIncrementProduct = async (data = { _storeid: new String(''), data2: new Object() }, callback = (err = new Error) => { }) => {
    const moment = require('moment');
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const checkStore = require('../../mongodbController').checkStore;
    const AutoIncrementProductModel = require('../../mongodbController').AutoIncrementProductModel;
    const productModel = require('../../mongodbController').productModel;
    const currentTime = moment();
    const currentYear = currentTime.year();
    const currentMonth = currentTime.month() + 1;

    if (typeof data != 'object') { callback(new Error(`AutoIncrementProduct: data must be Object`)); return; }
    else if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(` ${data._storeid} : AutoIncrementProduct : data._storeid must be String and Not Empty`)); return; }
    else if (typeof data.data2 != 'object' || data.data2 == '') { callback(new Error(`${data.data2} : AutoIncrementProduct : data.data2 must be string and Not Empty`)); return; }
    else {
        const chkStore = await checkStore({ _storeid: data._storeid }, (err) => { callback(err); return; });
        if (!chkStore) { callback(new Error('AutoIncrementProduct: _storeid NOT Found')); return; }
        else {
            const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
            const mapData = {
                _storeid: _storeid,
                year: currentYear,
                month: currentMonth,
            }
            const transactionSave = new AutoIncrementProductModel(mapData);
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
                    let Updatarun_number_product = await productModel.findOne(
                        {
                            '_id': _id

                        }, (err) => { if (err) callback(err); return; }
                    );
                    Updatarun_number_product.run_number_product = resultdata.seq;
                    Updatarun_number_product.isused = true;
                    Updatarun_number_product = await Updatarun_number_product.save();
                    if (Updatarun_number_product != null || Updatarun_number_product != '') {
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
    AutoIncrementProduct
};