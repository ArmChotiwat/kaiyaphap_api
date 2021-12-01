// จำนวนนัดหมายในเดือนนี้ (แยกตาม Store)
const countScheduleAllFilterByStoreAndMonthController = async (data = { _storeid: new String, getDate: new String | new Date() }, callback = (err = new Error) => { }) => {
  const scheduleModel_Refactor = require('../../mongodbController').scheduleModel_Refactor;
  const checkObjectId = require('../../mongodbController').checkObjectId;
  const moment = require('moment');

  try {
    const _storeid = await checkObjectId(data._storeid);
    const getYear = parseInt(moment(data.getDate, 'YYYY-MM-DD').format("YYYY"));
    const getMonth = parseInt(moment(data.getDate, 'YYYY-MM-DD').format("MM"));
    const findResult = await scheduleModel_Refactor.aggregate(
      [
        {
          '$match': {
            '_ref_storeid': _storeid
          }
        }, {
          '$addFields': {
            'comp_year_month': {
              '$and': [
                {
                  '$eq': [
                    {
                      '$year': '$create_date'
                    }, getYear

                  ]
                }, {
                  '$eq': [
                    {
                      '$month': '$create_date'
                    }, getMonth

                  ]
                }
              ]
            }
          }
        }, {
          '$match': {
            'comp_year_month': {
              '$eq': true
            }
          }
        }, {
          '$group': {
            '_id': {
              'status': '$status'
            },
            'countStatus': {
              '$sum': 1
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'status': '$_id.status',
            'countStatus': '$countStatus'
          }
        }
      ]
    );
    if (findResult.length === 0) {
      const mapArr = [];
      const handleNullMapp = (name) => {
        return {
          status: name,
          countStatus: 0
        };
      };
      mapArr.push(handleNullMapp('นัดหมายไว้'), handleNullMapp('ยกเลิกนัด'), handleNullMapp('รอรับการรักษา'));
      callback(null);
      return mapArr;
    }
    else {
      const mapArr = [];
      const handleNullMapp = (name) => {
        return {
          status: name,
          countStatus: 0
        };
      };
      const AddSchedule = findResult.filter(where => where.status == 'นัดหมายไว้')[0] || handleNullMapp('นัดหมายไว้');
      const CancelSchedule = findResult.filter(where => where.status == 'ยกเลิกนัด')[0] || handleNullMapp('ยกเลิกนัด');
      const WaitTreatment = findResult.filter(where => where.status == 'รอรับการรักษา')[0] || handleNullMapp('รอรับการรักษา');
      mapArr.push(AddSchedule, WaitTreatment, CancelSchedule)
      callback(null);
      return mapArr;
    }
  } catch (error) {
    callback(error);
    return;
  }
};


module.exports = countScheduleAllFilterByStoreAndMonthController;