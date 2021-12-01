(
    async () => {
        const { mongoose, agentModel } = require('../Controller/mongodbController');
        try {
            const transactionDelete = await agentModel.deleteMany(
                {
                    $where: "!this.store || this.store.length === 0",
                },
                {},
                (err) => { if (err) { throw err; } }
            );

            console.log(transactionDelete);

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