(
    async () => {
        const { mongoose, storeModel } = require('../Controller/mongodbController');
        try {
            const transactionUpdate = await storeModel.updateMany(
                {},
                {
                    $set: {
                        'isclosed': false,
                        'branch.$[].isclosed': false,
                    }
                },
                (err) => { if (err) { throw err; }}
            );
            
            console.log(transactionUpdate);


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