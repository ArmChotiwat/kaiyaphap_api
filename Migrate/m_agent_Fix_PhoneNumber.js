(
    async () => {
        const { mongoose, agentModel } = require('../Controller/mongodbController');
        try {
            const Regex_Replace = /[^0-9]/ig;

            await agentModel.find(
                {
                    $where: "this.store",
                },
                {},
                (err) => { if (err) { throw err; } }
            ).then(
                (resultFind) => {
                    resultFind.forEach(result => {
                        result.store.forEach(async (resultStore) => {
                            console.log(`Update _agentstoreid: ${resultStore._id}`);

                            const Replace_PhoneNumber = resultStore.personal.phone_number.replace(Regex_Replace, '');

                            await agentModel.updateMany(
                                {
                                    '_id': result._id,
                                    'store._storeid': resultStore._storeid
                                },
                                {
                                    $set: {
                                        'store.$.personal.phone_number': Replace_PhoneNumber
                                    }
                                },
                                (err) => { if (err) { throw err; } }
                            );
                        });
                    });
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