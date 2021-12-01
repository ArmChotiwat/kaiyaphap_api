(
    async () => {
        const { mongoose, tempPtDiagnosisModel } = require('../Controller/mongodbController');
        const { regExReplace } = require('../Controller/miscController');
        try {
            const findTemplatePtDiagnoisis = await tempPtDiagnosisModel.find(
                {},
                {},
                (err) => { if (err) { throw err; } }
            );

            for (let index = 0; index < findTemplatePtDiagnoisis.length; index++) {
                process.stdout.write(`Refactor Data from Documents ${index + 1} ... of Documents ${findTemplatePtDiagnoisis.length}\r`);
                const element = findTemplatePtDiagnoisis[index];
                await tempPtDiagnosisModel.findByIdAndUpdate(
                    element._id,
                    {
                        name: regExReplace.regEx_ClearWhiteSpaceStartEnd(regExReplace.regEx_OnlyOneWhiteSpace(element.name))
                    },
                    (err) => { if (err) { console.error(err); } }
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