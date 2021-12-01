const regExCaseinsensetive = (stringdata = new String('')) => {
    stringdata = stringdata.replace(new RegExp(' ', 'ig'),'*') + '*';
    return new RegExp(stringdata, 'ig');
};

const refactorName = (stringdata = new String('')) => {
    stringdata = stringdata.replace(new RegExp('[^a-zA-Z0-9 ]', 'g'), ''); // Clear Special Character
    stringdata = stringdata.replace(new RegExp('^ *', 'ig'), ''); // Clear Front WhiteSpace
    stringdata = stringdata.replace(new RegExp(' *$', 'ig'), ''); // Clear Back WhiteSpace
    stringdata = stringdata.replace(new RegExp(' + +', 'ig'), ' '); // Only One WhiteSpace
    return stringdata;
};

const refactorPrefix = (stringdata = new String('')) => {
    stringdata = stringdata.replace(new RegExp('[^a-zA-Z0-9 ]', 'g'), ''); // Clear Special Character
    stringdata = stringdata.replace(new RegExp(' ', 'ig'), ''); // Clear WhiteSpace
    stringdata = stringdata.toUpperCase();
    return stringdata;
};

const caseTypeController_save = async (payload = { mainname: new String(''), prefix: new String('') }, callback = (err = new Error) => {} ) => {
    const tempCaseTypeModel = require('../../mongodbController').tempCaseTypeModel;

    try {
        if(typeof payload != 'object') { callback(new Error('caseTypeController_save: <payload> must be Object')); return; }
        else if(typeof payload.mainname != 'string' || payload.mainname == '') { callback(new Error('caseTypeController_save: <payload.mainname> must be Object')); return; }
        else if(typeof payload.prefix != 'string' || payload.prefix == '') { callback(new Error('caseTypeController_save: <payload.prefix> must be Object')); return; }
        else {
            let mainname = refactorName(payload.mainname);
            let prefix = refactorPrefix(payload.prefix);
            const findDataExists = await tempCaseTypeModel.find(
                {
                    "name": { $regex: regExCaseinsensetive(mainname) }
                },
                (err) => { if(err) { callback(err); return; } }
            );
            if(findDataExists.length != 0) {
                callback(null);
                return 'name_exists';
            }
            else {
                let countDoc = await tempCaseTypeModel.countDocuments((err) => { if(err) { callback(err); return; } });
                if(countDoc === 0) { countDoc = 1; }
                else {
                    countDoc = countDoc + 1;
                }
                const currentDate = new Date();
                const mapModel = {
                    name: mainname,
                    prefix: prefix,
                    num: countDoc,
                    dateAdd: currentDate,
                    dateModify: currentDate
                };

                const transactionModel = new tempCaseTypeModel(mapModel);
                await transactionModel.save();

                const findResult = await tempCaseTypeModel.findOne(
                    {
                        'name': mainname,
                        'prefix': prefix
                    },
                    (err) => {
                        if(err) {
                            callback(err);
                            return;
                        }
                    }
                );
                if(!findResult) { callback(new Error(`caseTypeController_save: save failed`)); return; }
                else {
                    callback(null);
                    return findResult;
                }
            }
        }
    } catch (error) {
        callback(error);
        return;
    }
};

const caseTypeController_view = async ( callback = (err = new Error) => {} ) => {
    const tempCaseTypeModel = require('../../mongodbController').tempCaseTypeModel;
    
    const getAllData = await tempCaseTypeModel.find(
        {},
        {
            '__v': 0
        },
        (err) => {
            if(err) { callback(err); return; }
        }
    );
    
    callback(null);
    return getAllData;
}; 

module.exports = {
    caseTypeController_save,
    caseTypeController_view,
};