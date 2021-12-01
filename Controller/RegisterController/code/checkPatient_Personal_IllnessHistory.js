const checkPatient_Personal_GeneralUserDetail = async (
    illness_history = [
        {
            id: String(),
            name: String(),
            answer: Number(),
            detail: String(),
        }
    ], 
    _ref_storeid = '', 
    callback = (err = new Error) => {} 
) => {
    const controllerName = `checkPatient_Personal_GeneralUserDetail`;

    const { validate_StringObjectId_NotNull, validate_StringOrNull_AndNotEmpty } = require('../../miscController');
    const { ObjectId, illnessModel } = require('../../mongodbController');

    if (typeof illness_history != 'object' || illness_history.length < 0) { callback(new Error(`${controllerName}: <illness_history> must be Array Object and Length more than or equal 0`)); return; }
    else if (!validate_StringObjectId_NotNull(_ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid> must be String ObjectId`)); return; }
    else {
        let Approved_IllnessHistory = [];

        for (let index = 0; index < illness_history.length; index++) {
            const element = illness_history[index];
            
            if (!validate_StringObjectId_NotNull(element.id)) { callback(new Error(`${controllerName}: llness_history[${index}]._id must be String ObjectId`)); return; }
            else if (typeof element.answer != 'number') { callback(new Error(`${controllerName}: llness_history[${index}]._id must be Number`)); return; }
            else if (!validate_StringOrNull_AndNotEmpty(element.detail)) { callback(new Error(`${controllerName}: llness_history[${index}]._id must be String or Null and Not Empty`)); return; }
            else {
                const findIllnessHistory = await illnessModel.findOne(
                    {
                        '_id': ObjectId(element.id),
                        '_storeid': ObjectId(_ref_storeid)
                    },
                    {},
                    (err) => { if (err) { callback(err); return; } }
                );

                if (!findIllnessHistory) { callback(new Error(`${controllerName}: findIllnessHistory return not found at llness_history[${index}]._id (${element.id})`)); return; }
                else if (findIllnessHistory.isused == false) { callback(new Error(`${controllerName}: findIllnessHistory.isused return FALSE at llness_history[${index}]._id (${element.id})`)); return; }
                else {
                    Approved_IllnessHistory.push(
                        {
                            id: ObjectId(findIllnessHistory._id),
                            name: String(findIllnessHistory.name),
                            answer: element.answer,
                            detail: (element.detail === null) ? null:String(element.detail)
                        }
                    );
                }
            }
        }

        callback(null);
        return Approved_IllnessHistory;
    }
};

module.exports = checkPatient_Personal_GeneralUserDetail;