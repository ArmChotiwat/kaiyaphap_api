const moment = require('moment');
let date_start, date_end;
/*
 ** Fn หาวันเริ่มต้นของเดือนและปี และ วันสิ้นสุดของเดือนและปี 
 ** Year = ตัวอย่าง ( '2020' )  วันที่เริ่ม type Sting (YYYY-MM-DD)
 ** Month = ตัวอย่าง ( '2020-08-30' )  วันที่สิ้นสุด type Sting (YYYY-MM-DD)
 ** ผลลัพ  => P_start = 2020-08-01
 **          P_end = 2020-08-01
 */
const chack_date_start = async (
    data = {
        Year: new String('null'),
        Month: new String('null')
    }, callback = (err = new Error) => { }) => {
    if (typeof data.Year !== 'string' || typeof data.Month !== 'string') { callback(new Error(`chackMonthOrYear: <Year> or <Month> must be String `)); return; }
    try {
        if (data.Year !== 'null' && data.Month === 'null') { // มีการส่งค่า ปี มาเป็น string แต่ไม่ส่งค่าเดือนมา
            if (+data.Year > 2019) {
                date_start = moment(data.Year + '-01-01').startOf('year').format('YYYY-MM-DD');
                return date_start;
            } else {
                date_start = moment().startOf('year').format('YYYY-MM-DD');
                return date_start;
            }
        } else if (data.Month !== 'null' && data.Year === 'null') { // ไม่ส่งค่า เดือนมา แต่ไม่ส่งค่าปีมา 
            if (+data.Month > 0 && +data.Month < 13) {
                date_start = moment(moment().startOf('month').format('YYYY') + '-' + data.Month + '-01').startOf('month').format('YYYY-MM-DD');
                return date_start;
            } else {
                date_start = moment().startOf('month').format('YYYY-MM-DD');
                return date_start;
            }
        } else if (data.Month !== 'null' && data.Year !== 'null') {// ส่ง มาทั่งสอง ค่า คือ ปี และ เดือน 
            date_start = moment(moment(data.Year + '-01-01').format('YYYY') + '-' + data.Month + '-01').startOf('month').format('YYYY-MM-DD');
            return date_start;
        } else {// ไม่่ส่งค่าอะไรมาเเล้ว 
            date_start = moment().format('YYYY-MM-DD');
            return date_start;
        }
    } catch (error) {
        date_start = moment().format('YYYY-MM-DD');
        return date_start;
    }
}
const chack_date_end = async (data = { Year: new String('null'), Month: new String('null') }, callback = (err = new Error) => { }) => {
    if (typeof data.Year !== 'string' || typeof data.Month !== 'string') { callback(new Error(`chackMonthOrYear: <Year> or <Month> must be String `)); return; }
    try {
        if (data.Year !== 'null' && data.Month === 'null') { // มีการส่งค่า ปี มาเป็น string แต่ไม่ส่งค่าเดือนมา
            if (+data.Year > 2019) {
                date_end = moment(data.Year + '-01-01').endOf('year').format('YYYY-MM-DD');
                return date_end;
            } else {
                date_end = moment().endOf('year').format('YYYY-MM-DD');
                return date_end;
            }
        } else if (data.Month !== 'null' && data.Year === 'null') { // ไม่ส่งค่า เดือนมา แต่ไม่ส่งค่าปีมา 
            if (+data.Month > 0 && +data.Month < 13) {
                date_end = moment(moment().startOf('month').format('YYYY') + '-' + data.Month + '-01').endOf('month').format('YYYY-MM-DD');
                return date_end;
            } else {
                date_end = moment().endOf('month').format('YYYY-MM-DD');
                return date_end;
            }
        } else if (data.Month !== 'null' && data.Year !== 'null') { // ส่ง มาทั่งสอง ค่า คือ ปี และ เดือน 
            date_end = moment(moment(data.Year + '-01-01').format('YYYY') + '-' + data.Month + '-01').endOf('month').format('YYYY-MM-DD');
            return date_end;
        } else {// ไม่่ส่งค่าอะไรมาเเล้ว 
            date_end = moment().format('YYYY-MM-DD');
            return date_end;
        }
    } catch (error) {
        date_end = moment().format('YYYY-MM-DD');
        return date_end;
    }
}
const p_chack_date_start = async (data = { date: new String(''), Year: new String('null'), Month: new String('null') }, callback = (err = new Error) => { }) => {
    if (typeof data.Year !== 'string' || typeof data.Month !== 'string' || typeof data.date !== 'string') { callback(new Error(`chackMonthOrYear: <Year> or <Month> must be String `)); return; }
    try {
        if (data.Year !== 'null' && data.Month === 'null') { // มีการส่งค่า ปี มาเป็น string แต่ไม่ส่งค่าเดือนมา
            date_start = moment(data.date).subtract(1, 'year').format('YYYY-MM-DD')
            return date_start;
        } else if (data.Month !== 'null' && data.Year === 'null') { // ไม่ส่งค่า เดือนมา แต่ไม่ส่งค่าปีมา 
            date_start = moment(data.date).subtract(1, 'month').format('YYYY-MM-DD')
            return date_start;
        } else if (data.Month !== 'null' && data.Year !== 'null') {// ส่ง มาทั่งสอง ค่า คือ ปี และ เดือน 
            date_start = moment(data.date).subtract(1, 'month').format('YYYY-MM-DD')
            return date_start;
        } else {// ไม่่ส่งค่าอะไรมาเเล้ว 
            date_start = moment().subtract(1, 'day').format('YYYY-MM-DD')
            return date_start;
        }
    } catch (error) {
        date_start = moment().subtract(1, 'day').format('YYYY-MM-DD')
        return date_start;
    }
}
const p_chack_date_end = async (data = { date: new String(''), Year: new String('null'), Month: new String('null') }, callback = (err = new Error) => { }) => {
    if (typeof data.Year !== 'string' || typeof data.Month !== 'string' || typeof data.date !== 'string') { callback(new Error(`chackMonthOrYear: <Year> or <Month> must be String `)); return; }
    try {
        if (data.Year !== 'null' && data.Month === 'null') { // มีการส่งค่า ปี มาเป็น string แต่ไม่ส่งค่าเดือนมา
            date_end = moment(data.date).subtract(1, 'year').format('YYYY-MM-DD')
            return date_end;
        } else if (data.Month !== 'null' && data.Year === 'null') { // ไม่ส่งค่า เดือนมา แต่ไม่ส่งค่าปีมา 
            date_end = moment(data.date).subtract(1, 'month').format('YYYY-MM-DD')
            return date_end;
        } else if (data.Month !== 'null' && data.Year !== 'null') {// ส่ง มาทั่งสอง ค่า คือ ปี และ เดือน 
            date_end = moment(data.date).subtract(1, 'month').format('YYYY-MM-DD')
            return date_end;
        } else {// ไม่่ส่งค่าอะไรมาเเล้ว 
            date_end = moment().subtract(1, 'day').format('YYYY-MM-DD')
            return date_end;
        }
    } catch (error) {
        date_end = moment().subtract(1, 'day').format('YYYY-MM-DD')
        return date_end;
    }
}

module.exports = { chack_date_start, chack_date_end, p_chack_date_start, p_chack_date_end };