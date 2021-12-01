// จำนวนนัดหมายทั้งหมด (แยกตาม Store)
const countScheduleAllFilterByStoreController = async (data = { _storeid: new String }, callback = (err = new Error) => { }) => {
  const scheduleModel_Refactor = require('../../mongodbController').scheduleModel_Refactor;
  const checkObjectId = require('../../mongodbController').checkObjectId;

  try {
    const _storeid = await checkObjectId(data._storeid);
    const findResult = await scheduleModel_Refactor.aggregate(
      [ 
        {
          '$match': {
            '_ref_storeid': _storeid
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
      ],
      (err) => { if (err) { callback(err); return; } }
    );
    if (findResult.length === 0 || !findResult) {
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


module.exports = countScheduleAllFilterByStoreController;