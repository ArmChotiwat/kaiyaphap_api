const checkPatient_Personal_GeneralUserDetail = async (
    general_user_detail = {
        cigarette_acttivity: {
            answer: Boolean(),
            detail: String()
        },
        alcohol_acttivity: {
            answer: Boolean(),
            detail: String()
        },
        congenital_disease: [
            {
                _illnesscharid: String(),
                name: String()
            }
        ],
        drug_allergy: String()
    }, 
    _ref_storeid = '', 
    callback = (err = new Error) => {} 
) => {
    const controllerName = `checkPatient_Personal_GeneralUserDetail`;

    const { ObjectId, illnessCharacticModel } = require('../../mongodbController');
    const { validate_StringOrNull_AndNotEmpty, validate_StringObjectId_NotNull } = require('../../miscController');

    if (typeof general_user_detail != 'object') { callback(new Error(`${controllerName}: <general_user_detail> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(_ref_storeid)) { callback(new Error(`${controllerName}: <_ref_storeid> must be String ObjectId`)); return; }
    else if (typeof general_user_detail.cigarette_acttivity != 'object') { callback(new Error(`${controllerName}: <general_user_detail.cigarette_acttivity> must be Object`)); return; }
    else if (typeof general_user_detail.cigarette_acttivity.answer != 'boolean') { callback(new Error(`${controllerName}: <general_user_detail.cigarette_acttivity.answer> must be Boolean`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(general_user_detail.cigarette_acttivity.detail)) { callback(new Error(`${controllerName}: <general_user_detail.cigarette_acttivity.detail> must be String Or Null and Not Empty`)); return; }
    else if (typeof general_user_detail.alcohol_acttivity != 'object') { callback(new Error(`${controllerName}: <general_user_detail.alcohol_acttivity> must be Object`)); return; }
    else if (typeof general_user_detail.alcohol_acttivity.answer != 'boolean') { callback(new Error(`${controllerName}: <general_user_detail.alcohol_acttivity.answer> must be Boolean`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(general_user_detail.alcohol_acttivity.detail)) { callback(new Error(`${controllerName}: <general_user_detail.alcohol_acttivity.detail> must be String Or Null and Not Empty`)); return; }
    else if (!validate_StringOrNull_AndNotEmpty(general_user_detail.drug_allergy)) { callback(new Error(`${controllerName}: <general_user_detail.drug_allergy> must be String Or Null and Not Empty`)); return; }
    else {
        if (typeof general_user_detail.alcohol_acttivity != 'object' ||  general_user_detail.alcohol_acttivity.length < 0) { callback(new Error(`${controllerName}: <general_user_detail.alcohol_acttivity> must be Array Object and Length or Array more than 0`)); return; }
        else {
            let CongenitalDisease_IllnessCharacticArray = [];

            for (let index = 0; index < general_user_detail.congenital_disease.length; index++) {
                const element = general_user_detail.congenital_disease[index];
                
                if (!validate_StringObjectId_NotNull(element._illnesscharid)) { callback(new Error(`${controllerName}: general_user_detail.congenital_disease[${index}]._illnesscharid must be String ObjectId`)); return; }
                else {
                    const findIllnessChar = await illnessCharacticModel.findOne({'_id': ObjectId(element._illnesscharid), '_storeid': ObjectId(_ref_storeid) }, {}, (err) => { if (err) { callback(err); return; } });
                    
                    if (!findIllnessChar) { callback(new Error(`${controllerName}: findIllnessChar return not found at general_user_detail.congenital_disease[${index}]._illnesscharid (${element._illnesscharid})`)); return; }
                    else if (findIllnessChar.isused == false) { callback(new Error(`${controllerName}: findIllnessChar.isused return FALSE at general_user_detail.congenital_disease[${index}]._illnesscharid (${element._illnesscharid})`)); return; }
                    else {
                        CongenitalDisease_IllnessCharacticArray.push(
                            {
                                _illnesscharid: ObjectId(findIllnessChar._id),
                                name: String(findIllnessChar.name)
                            }
                        );
                    }
                }
            }

            callback(null);
            return {
                cigarette_acttivity: {
                    answer: Boolean(general_user_detail.cigarette_acttivity.answer),
                    detail: (general_user_detail.cigarette_acttivity.detail === null) ? null:String(general_user_detail.cigarette_acttivity.detail)
                },
                alcohol_acttivity: {
                    answer: Boolean(general_user_detail.alcohol_acttivity.answer),
                    detail: (general_user_detail.alcohol_acttivity.detail === null) ? null:String(general_user_detail.alcohol_acttivity.detail)
                },
                congenital_disease: CongenitalDisease_IllnessCharacticArray,
                drug_allergy: (general_user_detail.drug_allergy === null) ? null:String(general_user_detail.drug_allergy)
            };
        }
    }
};

module.exports = checkPatient_Personal_GeneralUserDetail