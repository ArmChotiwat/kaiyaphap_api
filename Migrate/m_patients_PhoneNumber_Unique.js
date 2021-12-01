(
    async () => {
        const { mongoose, ObjectId, patientModel, patientPhoneNumberModel } = require('../Controller/mongodbController');
        try {
            const findPatinet = await patientModel.find(
                {},
                {},
                (err) => { if (err) { throw err; } }
            );

            await findPatinet.forEach(
                (resultPatient, index) => {
                    process.stdout.write(`Validate Data from Documents ${index + 1} ... of Documents ${findPatinet.length}\n`);

                    resultPatient.store.forEach(
                        async (resultPatientStore) => {
                            const MAPData = {
                                _ref_storeid: ObjectId(resultPatientStore._storeid),
                                _ref_patient_userid: ObjectId(resultPatient._id),
                                _ref_patient_userstoreid: ObjectId(resultPatientStore._id),
                                phone_number: String(resultPatientStore.personal.phone_number).replace(/[^0-9]/g, ''),
                            };

                            const newPatientPhoneNumberModel = new patientPhoneNumberModel(MAPData);
                            await newPatientPhoneNumberModel.save().then(result => result).catch(err => {  });
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