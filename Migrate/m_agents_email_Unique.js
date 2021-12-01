(
    async () => {
        const { mongoose, ObjectId, agentModel, agentEmailModel } = require('../Controller/mongodbController');
        try {
            const findResult = await agentModel.find(
                {
                    $where: "this.store",
                },
                {},
                (err) => { if (err) { throw err; } }
            );

            findResult.forEach(
                (result, index) => {
                    process.stdout.write(`Data (${index+1}) Document processed ${index+1} of ${findResult.length}\r`);
                    result.store.forEach(
                        (resultStore) => {
                            resultStore.branch.forEach(
                                async (resultStoreBranch) => {
                                    const MAPData = {
                                        _ref_storeid: ObjectId(resultStore._storeid),
                                        _ref_branchid: ObjectId(resultStoreBranch._branchid),
                                        email: result.username
                                    };

                                    const newAgentEmailModel = new agentEmailModel(MAPData);
                                    await newAgentEmailModel.save().then(result => result).catch(err => { if (err) { throw err; }});
                                }
                            );
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