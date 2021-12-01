/*
 ** Fn หาวันเริ่มต้นของอาทิตย์ และ วันสิ้นสุดของอาทิตย์  
 ** dayk_of_week, = ตัวอย่าง ( 0 - 1 ) วันแรกของอาทิตย์ที่ต้องการเริ่ม 0 = อาทิตย์ and 7 = วันเสาร์ type Number 
 ** start_date_week, = ตัวอย่าง ( '2020-08-01' )  วันที่เริ่ม type Sting (YYYY-MM-DD)
 ** end_date_week, = ตัวอย่าง ( '2020-08-30' )  วันที่สิ้นสุด type Sting (YYYY-MM-DD)
 ** ผลลัพ  => [2020-08-01 ,2020-08-02]
 */
const chackWeekOfMouth = async (
    day_of_week, // วันแรกของอาทิตย์ที่ต้องการเริ่ม 0 = อาทิตย์ and 7 = วันเสาร์ type Number
    start_date_week, // วันที่เริ่ม type Sting (YYYY-MM-DD)
    end_date_week, // วันที่สิ้น สุด type Sting (YYYY-MM-DD)
    callback = (err = new Err) => { }
) => {
    const moment = require('moment');
    const start_day_week = moment(start_date_week).startOf('month').week();
    const end_day_week = moment(end_date_week).endOf('month').week();
    let index_start_week = day_of_week; // เลืุอกวันที่เริ่มของอาทิต 0 = วันอาทิตย์ - 6 = วันเสาร์ 
    let map = []
    for (let index = start_day_week, week = end_day_week; index <= week; index++) {
        if (moment(start_date_week).startOf('month').day() === 0) {
            if (index_start_week === 0) { // กรณีวันแรกเป็นวันอาทิตย์ 
                if (index === start_day_week) { // ต้นเดือน 
                    map.push({
                        P_start: moment(start_date_week).startOf('month').format('YYYY-MM-DD'),
                        P_end: moment().week(index).endOf('week').format('YYYY-MM-DD'),
                        week: index
                    });
                } else if (index === end_day_week) {//กลางเดือน 
                    if (moment(start_date_week).endOf('month').day() >= index_start_week) { // กรณีกำหนดวันเริ่มต้นของอาทิตย์เกินวันสินสุดของเดิอน 
                        map.push({
                            P_start: moment().week(index).startOf('week').format('YYYY-MM-DD'),
                            P_end: moment(end_date_week).endOf('month').format('YYYY-MM-DD'),
                            week: index
                        });
                    }
                } else { //  สื้นเดือน 
                    map.push({
                        P_start: moment().week(index).startOf('week').format('YYYY-MM-DD'),
                        P_end: moment().week(index).endOf('week').format('YYYY-MM-DD'),
                        week: index
                    });
                }
            } else { // กรณีวันแรกเป็น วันอื่น ไม่ใช่วันอาทิตย์ 
                if (index === start_day_week) {
                    for (let indexs = 0; indexs <= 1; indexs++) {
                        if (indexs === 0) {
                            map.push({
                                P_start: moment(start_date_week).startOf('month').format('YYYY-MM-DD'),
                                P_end: moment().week(index).day(index_start_week - 1).format('YYYY-MM-DD'),
                                week: index
                            });
                            // P_start.push( moment().startOf('month').format('YYYY-MM-DD'));
                            // P_end.push(moment().week(index).day(index_start_week - 1).format('YYYY-MM-DD'));,

                        } else {
                            map.push({
                                P_start: moment().week(index).day(index_start_week).format('YYYY-MM-DD'),
                                P_end: moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD'),
                                week: index
                            });
                            // P_start.push( moment().week(index).day(index_start_week).format('YYYY-MM-DD'));
                            // P_end.push(moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD'));,

                        }
                    }

                } else if (index === end_day_week) {
                    if (moment(start_date_week).endOf('month').day() >= index_start_week) {
                        map.push({
                            P_start: moment().week(index).day(index_start_week).format('YYYY-MM-DD'),
                            P_end: moment(end_date_week).endOf('month').format('YYYY-MM-DD'),
                            week: index
                        });
                        // P_start.push( moment().week(index).day(index_start_week).format('YYYY-MM-DD'));
                        // P_end.push(moment().endOf('month').format('YYYY-MM-DD'));,

                    }

                } else {
                    map.push({
                        P_start: moment().week(index).day(index_start_week).format('YYYY-MM-DD'),
                        P_end: moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD'),
                        week: index
                    });
                    // P_start.push( moment().week(index).day(index_start_week).format('YYYY-MM-DD'));
                    // P_end.push(moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD'));,


                }
            }
        } else {// กรณีวันแรกเป็น วันอื่น ไม่ใช่วันอาทิตย์ 
            if (index === start_day_week) {
                map.push({
                    P_start: moment(start_date_week).startOf('month').format('YYYY-MM-DD'),
                    P_end: moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD'),
                    week: index
                });
                // P_start.push( moment().startOf('month').format('YYYY-MM-DD'));
                // P_end.push(moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD'));,

            } else if (index === end_day_week) {
                if (moment(start_date_week).endOf('month').day() >= index_start_week) {
                    map.push({
                        P_start: moment().week(index).day(index_start_week).format('YYYY-MM-DD'),
                        P_end: moment(end_date_week).endOf('month').format('YYYY-MM-DD'),
                        week: index
                    });
                    // P_start.push( moment().week(index).day(index_start_week).format('YYYY-MM-DD')); end_date_week
                    // P_end.push(moment().endOf('month').format('YYYY-MM-DD'));,

                }
            } else {
                map.push({
                    P_start: moment().week(index).day(index_start_week).format('YYYY-MM-DD'),
                    P_end: moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD'),
                    week: index
                });
                // P_start.push( moment().week(index).day(index_start_week).format('YYYY-MM-DD'));
                // P_end.push(moment().week(index + 1).day(index_start_week - 1).format('YYYY-MM-DD'));,

            }
        }
    }
    callback(null);
    return map;
}



module.exports = chackWeekOfMouth;