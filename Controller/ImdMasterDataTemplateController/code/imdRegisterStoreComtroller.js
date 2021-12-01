/**
 * login เข้า เว็บผั่ง IMD 
 */
const imd_Register_Store_Comtroller = async (
    payload,
    callback = (err = new Error) => { }
) => {

    const moment = require('moment');
    const mongoose = require('../../../Config/Engine_mongodb').mongoose;
    const { validate_String_AndNotEmpty, validateEmail, validatePhoneNumber, chackEmail } = require('../../miscController');
    const { storeModel } = require('../../mongodbController');
    if (!validate_String_AndNotEmpty(payload.name) ||
        !validate_String_AndNotEmpty(payload.email) || !validateEmail(payload.email) ||
        !validate_String_AndNotEmpty(payload.phone_number) || validatePhoneNumber(payload.phone_number) ||
        typeof payload.address != 'object'
    ) { }
    else {
        const finStoreNameExtists = await storeModel.find(
            {
                'name': payload.name
            },
            (errors) => { if (errors) { res.status(500).end(); } }
        );
        if (finStoreNameExtists.length != 0) { res.status(422).end(); }
        else {
            const generate_objectId = async () => {
                let storeid;
                while (true) {
                    storeid = mongoose.Types.ObjectId();
                    const storeModel = await storeModel.aggregate(
                        [
                            {
                                '$match': {
                                    '_id': storeid
                                }
                            }
                        ],
                        (err) => { if (err) { callback(err); return; } }
                    );
                    if (storeModel.length === 0) {
                        break;
                    }
                }
                return storeid;
            };

            const storeid = await generate_objectId();
            const name_mail = await chackEmail(payload.email, (err) => { if (err) callback(err); return; })
            payload._id = storeid
            payload.branch = [{ //สาขา
                _id: storeid,
                name: "สาขาหลัก",
                email: name_mail,
                phone_number: payload.phone_number,
                address: payload.address
            }];
            const storeTemplate = new storeModel(payload);
            await storeTemplate.save(
                (errors) => { if (errors) { res.status(500).end(); } }
            );
            const initMaster = async (storeid) => {
                const tempIllness = await templateIllnessModel.find();
                if (tempIllness.length >= 1) {
                    await tempIllness.forEach(async element => {
                        const illTempTransaction = new illnessModel({
                            _storeid: storeid,
                            name: element.name,
                            isused: true,
                        });
                        await illTempTransaction.save();
                    });
                }
                const tempIllnessChar = await temppateIllCharacticModel.find();
                if (tempIllnessChar.length >= 1) {
                    await tempIllnessChar.forEach(async element => {
                        const illTempCharTransaction = new illnessCharacticModel({
                            _storeid: storeid,
                            name: element.name,
                            isused: true,
                        });
                        await illTempCharTransaction.save();
                    });
                }
            }
            await initMaster(storeid);
            res.status(201).json(
                {
                    _storeid: storeTemplate._id,
                    _branchid: storeTemplate.branch[0]._id
                }
            ).end();
        }
    }

}
module.exports = imd_Register_Store_Comtroller;