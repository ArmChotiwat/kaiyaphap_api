const reportRaw_listPatinets = async (
  data =
    {
      _storeid: new String(''),
      datestart: new String(''),
      dateend: new String(''),

    }, callback = (err = new Error) => { }) => {
  const momnet = require('moment');
  const thday = new Array("อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์");
  const thmonth = new Array("มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม");

  const checkObjectId = require('../../mongodbController').checkObjectId;
  const patientModel = require('../../mongodbController').patientModel;

  const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { console.error(err); callback(err); return; } })
  const now = new Date()
  const theTodayYear = (now.getFullYear() + 543);
  const theTodayMonth = thmonth[now.getMonth()];
  const theTodayDay = now.getDate();
  const theTodayDayDesc = thday[now.getDay()];

  let match
  if (data.datestart.length === 10 && data.dateend.length === 10) {
    match = {
      '$gte': momnet(data.datestart, 'YYYY-MM-DD', true).format('YYYY-MM-DD'), '$lte': momnet(data.dateend, 'YYYY-MM-DD', true).format('YYYY-MM-DD')
    }
  } else if (data.datestart.length !== 10 && data.dateend.length === 10) {
    match = {
      '$gte': momnet('1000-01-01', 'YYYY-MM-DD', true).format('YYYY-MM-DD'), '$lte': momnet(data.dateend, 'YYYY-MM-DD', true).format('YYYY-MM-DD')
    }
  } else if (data.datestart.length === 10 && data.dateend.length !== 10) {
    match = {
      '$gte': momnet(data.datestart, 'YYYY-MM-DD', true).format('YYYY-MM-DD'), '$lte': momnet().format('YYYY-MM-DD')
    }
  } else {
    match = {
      '$lte': momnet().format('YYYY-MM-DD')
    }
  }

  const getReport = await patientModel.aggregate(
    [
      {
        '$match': {
          'store._storeid': _storeid
        }
      }, {
        '$unwind': {
          'path': '$store'
        }
      }, {
        '$match': {
          'store._storeid': _storeid,
          'store.userRegisterDate': match
        }
      }
    ]
  );
  const fnMap = (getData) => {
    const renderMap = getData.map(
      where => (
        {
          _storeid: where.store._storeid,
          _patientid: where.store._id,
          _hn: where.store.hn || 0,
          patient: where.store.personal
        }
      )
    );
    return renderMap;
  };
  try {
    let mapData = await fnMap(getReport);
    mapData = {
      reportDate: {
        desc: theTodayDayDesc,
        day: theTodayDay,
        month: theTodayMonth,
        year: theTodayYear
      },
      data: mapData
    }
    callback(null);
    return mapData;
  } catch (error) {
    console.error(error);
    callback(error);
    return;
  }
}

module.exports = reportRaw_listPatinets;