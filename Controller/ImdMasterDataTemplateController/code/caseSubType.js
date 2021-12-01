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

const caseSubTypeController_save = async (payload = {mainname: new String(''), subname: new String(''), prefix: new String('')}, callback = (err = new Error) => {} ) => {
    const tempCaseTypeModel = require('../../mongodbController').tempCaseTypeModel;
    
    try {
        if(typeof payload != 'object') { callback(new Error('caseSubTypeController_save: <payload> must be Object')); return; }
        else if(typeof payload.mainname != 'string' || payload.mainname == '') { callback(new Error('caseSubTypeController_save: <payload.mainname> must be String and Not Empty')); return; }
        else if(typeof payload.subname != 'string' || payload.subname == '') { callback(new Error('caseSubTypeController_save: <payload.subname> must be String and Not Empty')); return; }
        else if(typeof payload.prefix != 'string' || payload.prefix == '') { callback(new Error('caseSubTypeController_save: <payload.prefix> must be Object')); return; }
        else {
            const mainname = refactorName(payload.mainname);
            const subname = refactorName(payload.subname);
            const prefix = refactorPrefix(payload.prefix);
            const findMainTypeExists = await tempCaseTypeModel.find(
                {
                    'name': { $regex: regExCaseinsensetive(mainname) }
                },
                (err) => {
                    if(err) {
                        callback(err);
                        return;
                    }
                }
            );
            if(findMainTypeExists.length != 1) { callback(null); return 'main_type_not_exists'; } // MainType Must Found
            else {
                const regExName = regExCaseinsensetive(mainname);
                const regExSubName = regExCaseinsensetive(subname);
                const findSubTypeExists = await tempCaseTypeModel.aggregate(
                    [
                        {
                          '$match': {
                            'name': mainname,
                            'type_sub.name': subname
                          }
                        }
                    ],
                    (err) => {
                        if(err) {
                            callback(err);
                            return;
                        }
                    }
                );
                if(findSubTypeExists.length != 0) { callback(null); return 'sub_type_exists'; } // SubType Must Not Found
                else {
                    const currentDate = new Date(); 
                    const mapModel = {
                        name: subname,
                        prefix: prefix,
                        num: findMainTypeExists[0].type_sub.length + 1,
                        dateAdd: currentDate,
                        dateModify: currentDate
                    };
                    await tempCaseTypeModel.findByIdAndUpdate(
                        findMainTypeExists[0]._id,
                        {
                            $addToSet: { 'type_sub': mapModel }
                        },
                        (err) => {
                            if(err) {
                                callback(err);
                                return;
                            }
                        }
                    );
                    const findResult = await tempCaseTypeModel.findOne(
                        {
                            'name': mainname,
                            'type_sub.name': subname,
                            'type_sub.prefix': prefix,
                        },
                        (err) => {
                            if(err) {
                                callback(err);
                                return;
                            }
                        }
                    );
                    if(!findResult) { callback(new Error(`caseSubTypeController_save: save failed`)); return; }
                    else {
                        callback(null);
                        return findResult;
                    }
                }
            }
        }

    } catch (error) {
        callback(error);
        return;
    }
}


module.exports = {
    caseSubTypeController_save,
};