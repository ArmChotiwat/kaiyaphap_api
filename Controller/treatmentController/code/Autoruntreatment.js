const Autoruntreatment = async (data = { _storeid: new String(''), data2: new Object() }, callback = (err = new Error) => { }) => {
    const moment = require('moment');
    const checkObjectId = require('../../mongodbController').checkObjectId;
    const checkStore = require('../../mongodbController').checkStore;
    const AutoruntreatmentModel = require('../../mongodbController').AutoIncrementTreatmentModel;
    const treatmentModel = require('../../mongodbController').treatmentModel;
    const currentTime = moment();
    const currentYear = currentTime.year();
    const currentMonth = currentTime.month() + 1;

    if (typeof data != 'object') { callback(new Error(`Autoruntreatment: data must be Object`)); return; }
    else if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error(` ${data._storeid} : Autoruntreatment : data._storeid must be String and Not Empty`)); return; }
    else if (typeof data.data2 != 'object' || data.data2 == '') { callback(new Error(`${data.data2} : Autoruntreatment : data.data2 must be string and Not Empty`)); return; }
    else {
        const chkStore = await checkStore({ _storeid: data._storeid }, (err) => { callback(err); return; });
        if (!chkStore) { callback(new Error('Autoruntreatment: _storeid NOT Found')); return; }
        else {
            const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
            const mapData = {
                _ref_storeid: _storeid
            }
            const transactionSave = new AutoruntreatmentModel(mapData);
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
                    let Updata_run_number = await treatmentModel.findOne(
                        {
                            '_id': _id

                        }, (err) => { if (err) callback(err); return; }
                    );
                    Updata_run_number.run_number = resultdata.seq;
                    Updata_run_number = await Updata_run_number.save();
                    if (Updata_run_number != null || Updata_run_number != '') {
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
    Autoruntreatment
};