const illnessCharacticController_save = async (data = { _storeid: new String, name: new String }, callback = (err = new Error) => {} ) => {
    const mongodbController = require('../../mongodbController');
    const checkObjectId = mongodbController.checkObjectId;
    const illnessCharacticModel = mongodbController.illnessCharacticModel;
    const illnessModel = mongodbController.illnessModel;

    const _storeid = await checkObjectId(data._storeid, (err) => { if(err) { callback(err); return; } });
    const name = data.name;
    const findDuplicate = await illnessModel.find(
        {
            '_storeid': _storeid,
            'name': name
        },
        (err) => { if(err) { callback(err); return; } }
    );
    if(findDuplicate.length != 0) { callback(new Error('illnessCharacticController => illnessCharacticController_save: data is duplicated OR database have error')); return; }
    else {
        const mapData = {
            '_storeid': _storeid,
            'name': name,
            'isused': true,
        };
        const modelTransaction = new illnessCharacticModel(mapData);
        const saveResult = await modelTransaction.save().then(result => (result)).catch(err => { callback(err); return; });
        if(!saveResult) { return; }
        else { callback(null); return modelTransaction; }
    }
};


module.exports = {
    illnessCharacticController_save,
};