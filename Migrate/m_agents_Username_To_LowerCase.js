(
    async () => {
        const { mongoose, agentModel } = require('../Controller/mongodbController');
        try {
            const regex_replace = /[^A-Z|a-z|0-9|\.|\@|\_]/ig;

            const findData = await agentModel.find(
                {},
                {},
                (err) => { if (err) { throw err; } }
            );

            for (let index = 0; index < findData.length; index++) {
                process.stdout.write(`Migrate Data from Documents ${index + 1} ... of Documents ${findData.length}\n`);

                const element = findData[index];

                const username = element.username.toLowerCase().replace(regex_replace, '');
                await agentModel.updateOne(
                    {
                        '_id': element._id
                    },
                    {
                        $set: {
                            'username': username,
                            'isclosed': false
                        }
                    },
                    (err) => { if (err) { throw err; } }
                );

                process.stdout.clearLine();
            }

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