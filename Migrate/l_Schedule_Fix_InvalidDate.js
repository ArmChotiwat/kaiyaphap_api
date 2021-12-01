(
    async () => {
        const moment = require('moment');
        const { mongoose, scheduleModel, ObjectId } = require('../Controller/mongodbController');
        try {
            await scheduleModel.find(
                {
                    'data.date': "Invalid date"
                },
                {},
                (err) => { if (err) { throw err; } }
            ).then(
                (resultFind) => {
                    resultFind.forEach(
                        (result) => {
                            const m_ScheduleId = ObjectId(result._id);

                            result.data.forEach(
                                async (resultData) => {
                                    const update_ScheduleId = ObjectId(resultData._id);

                                    if (resultData.date === "Invalid date") {
                                        console.log(`Data Update update_ScheduleId: ${update_ScheduleId}`);

                                        await scheduleModel.updateMany(
                                            {
                                                '_id': m_ScheduleId,
                                                'data._id': update_ScheduleId,
                                            },
                                            {
                                                $set: {
                                                    'data.$.date': moment(update_ScheduleId.getTimestamp()).format('YYYY-MM-DD')
                                                }
                                            },
                                            (err) => { if (err) { throw err; } }
                                        );
                                    }
                                    
                                }
                            );
                        }
                    );
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