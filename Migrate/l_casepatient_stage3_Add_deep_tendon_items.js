(
    async () => {
        const { mongoose, casePatientStage3Model } = require('../Controller/mongodbController');
        try {
            const resultFind = await casePatientStage3Model.updateMany(
                {
                    $where: "this.stage3data && this.stage3data.ortho && this.stage3data.ortho.trunk_spine && !this.stage3data.ortho.trunk_spine.deep_tendon_items"
                },
                {
                    $set: {
                        'stage3data.ortho.trunk_spine.deep_tendon_items': [],
                    }
                },
                (err) => { if (err) { throw err; } }
            );

            console.log(resultFind);

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