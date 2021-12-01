(
    async () => {
        const { mongoose, ObjectId, patientModel, patientPIDModel } = require('../Controller/mongodbController');
        try {
            const findPatinet = await patientModel.find(
                {
                    'store.personal.identity_card.id': { $ne: null }
                },
                {},
                (err) => { if (err) { throw err; } }
            );

            await findPatinet.forEach(
                (resultPatient, index) => {
                    process.stdout.write(`Migrate Data from Documents ${index + 1} ... of Documents ${findPatinet.length}\r`);

                    resultPatient.store.forEach(
                        async (resultPatientStore) => {
                            if (resultPatientStore.personal && resultPatientStore.personal.identity_card && resultPatientStore.personal.identity_card !== null) {
                                const MAPData = {
                                    _ref_storeid: ObjectId(resultPatientStore._storeid),
                                    _ref_patient_userid: ObjectId(resultPatient._id),
                                    _ref_patient_userstoreid: ObjectId(resultPatientStore._id),
                                    identity_card: String(resultPatientStore.personal.identity_card.id),
                                };

                                const newPatientPIDModel = new patientPIDModel(MAPData);
                                await newPatientPIDModel.save().then(result => result).catch(err => {  });
                            }
                        }
                        
                    );

                    process.stdout.clearLine();
                }
            );

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