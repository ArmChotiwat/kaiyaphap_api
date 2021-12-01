(
    async () => {
        const moment = require('moment');
        const { mongoose, ObjectId, patientModel } = require('../Controller/mongodbController');
        try {
            const findPatient = await patientModel.find(
                {
                    $where: "this.store && this.store.length > 0",
                    $or: [
                        { 'store.userRegisterDate': { $eq: null } },
                        { 'store.create_date': { $eq: null } },
                        { 'store.create_date_string': { $eq: null } },
                        { 'store.create_time_string': { $eq: null } },
                    ]
                },
                {},
                (err) => { if (err) { throw err; } }
            );

            await findPatient.forEach((elementPatient, index) => {
                elementPatient.store.forEach(async (elementPatientStore) => {
                    console.log(`Document Process ${index+1} of ${findPatient.length}`);
                    
                    if (elementPatientStore.userRegisterDate && moment(elementPatientStore.userRegisterDate, "YYYY-MM-DD", true).isValid()) {
                        const createDate_PK = moment(ObjectId(elementPatientStore._id).getTimestamp()).utcOffset("+7:00");
                        const createDate_userRegisterDate = moment(elementPatientStore.userRegisterDate, "YYYY-MM-DD", true).utcOffset("+7:00");

                        if (createDate_PK.format("YYYY-MM-DD") !== createDate_userRegisterDate.format("YYYY-MM-DD")) {
                            // console.log(
                            //     {
                            //         patientstoreid: elementPatientStore._id,
                            //         createDate_PK: createDate_PK.format("YYYY-MM-DD HH:mm:ss"),
                            //         createDate_userRegisterDate: createDate_userRegisterDate.format("YYYY-MM-DD HH:mm:ss"),
                            //         intregrate: moment(`${createDate_userRegisterDate.format("YYYY-MM-DD")} ${createDate_PK.format("HH:mm:ss")}`, "YYYY-MM-DD HH:mm:ss", true)
                            //     }
                            // );
                            const intregrateMoment = moment(`${createDate_userRegisterDate.format("YYYY-MM-DD")} ${createDate_PK.format("HH:mm:ss")}`, "YYYY-MM-DD HH:mm:ss", true);
                            await patientModel.updateOne(
                                {
                                    '_id': elementPatient._id,
                                    'store._id': elementPatientStore._id
                                },
                                {
                                    $set: {
                                        'store.$.create_date': intregrateMoment,
                                        'store.$.create_date_string': intregrateMoment.format("YYYY-MM-DD"),
                                        'store.$.create_time_string': intregrateMoment.format("HH:mm:ss"),
                                    }
                                },
                                (err) => { if (err) { throw err; } }
                            );
                        }
                        else {
                            const createDate_PK = moment(ObjectId(elementPatientStore._id).getTimestamp()).utcOffset("+7:00");
                            // const createDate_userRegisterDate = moment(elementPatientStore.userRegisterDate, "YYYY-MM-DD", true).utcOffset("+7:00");

                            // console.log(
                            //     {
                            //         patientstoreid: elementPatientStore._id,
                            //         createDate_PK: createDate_PK.format("YYYY-MM-DD HH:mm:ss"),
                            //         createDate_userRegisterDate: createDate_userRegisterDate.format("YYYY-MM-DD HH:mm:ss"),
                            //         intregrate: moment(`${createDate_userRegisterDate.format("YYYY-MM-DD")} ${createDate_PK.format("HH:mm:ss")}`, "YYYY-MM-DD HH:mm:ss", true)
                            //     }
                            // );

                            await patientModel.updateOne(
                                {
                                    '_id': elementPatient._id,
                                    'store._id': elementPatientStore._id
                                },
                                {
                                    $set: {
                                        'store.$.create_date': createDate_PK,
                                        'store.$.create_date_string': createDate_PK.format("YYYY-MM-DD"),
                                        'store.$.create_time_string': createDate_PK.format("HH:mm:ss"),
                                    }
                                },
                                (err) => { if (err) { throw err; } }
                            );
                        }
                    }
                    else {
                        const createDate_PK = moment(ObjectId(elementPatientStore._id).getTimestamp()).utcOffset("+7:00");
                        await patientModel.updateOne(
                                {
                                    '_id': elementPatient._id,
                                    'store._id': elementPatientStore._id
                                },
                                {
                                    $set: {
                                        'store.$.userRegisterDate': createDate_PK.format("YYYY-MM-DD"),
                                        'store.$.create_date': createDate_PK,
                                        'store.$.create_date_string': createDate_PK.format("YYYY-MM-DD"),
                                        'store.$.create_time_string': createDate_PK.format("HH:mm:ss"),
                                    }
                                },
                                (err) => { if (err) { throw err; } }
                        );
                    }
                });
            });

            const Cdown = 20;
            for (let Ctick = 0; Cdown >= Ctick; Ctick++) {
                setTimeout(
                    () => {
                        process.stdout.write(`Data Update finished In ${Cdown-Ctick} Sec. \r`);
                        if (Cdown === Ctick) { console.log(`Data Update finished, exit app`); mongoose.disconnect(); }
                    },
                    1000*Ctick
                );
            }

        } catch (error) {
            console.log(`Update Doc have Problem`);
            console.error(error);
        }
    }
)()