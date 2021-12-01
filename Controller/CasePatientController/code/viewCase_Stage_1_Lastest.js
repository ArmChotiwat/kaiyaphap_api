const casePatinetViewStage1LastestController = async (
  data = {
    _storeid: new String(''),
    _branchid: new String(''),
    _agentid: new String(''),
    _patientid: new String('')
  },
  callback = (err = new Err) => { }
) => {
  const miscController = require('../../miscController');
  
  const checkStoreBranch = await miscController.checkStoreBranch({_storeid: data._storeid, _branchid: data._branchid}, (err) => { if(err) { callback(err); return; } });
  if(checkStoreBranch === true) {
    const checkPatient = await miscController.checkPatientId({_storeid: data._storeid, _patientid: data._patientid}, (err) => { if(err) { callback(err); return; } });
    
    if(checkPatient._patientid) {
      const mongodbController = require('../../mongodbController');
      
      const findSourceCasePatientForClone = await mongodbController.casePatientModel.aggregate(
        [
          {
            '$match': {
              '_ref_storeid': mongodbController.mongoose.Types.ObjectId(data._storeid),
              '_ref_branchid': mongodbController.mongoose.Types.ObjectId(data._branchid),
              '_ref_patient_userid': checkPatient._patientid,
              'istruncated': false
            }
          }, {
            '$sort': {
              'create_date': -1
            }
          }, {
            '$lookup': {
              'from': 'l_casepatient_stage_1',
              'localField': '_id',
              'foreignField': '_ref_casepatinetid',
              'as': 'stage1'
            }
          }, {
            '$match': {
              'stage1': {
                '$size': 1
              }
            }
          }, {
            '$limit': 1
          }
        ],
        (err) => { if (err) { callback(err); return; } }
      );
      if (!findSourceCasePatientForClone || findSourceCasePatientForClone.length != 1) { callback(new Error(`casePatinetViewStage1LastestController: Source Case as Requested are Not Found`)); return; }
      else {
        callback(null);
        return findSourceCasePatientForClone;
      }
    }
    else {
      callback(new Error(`casePatinetViewStage1LastestController: *checkPatient Not Found`));
      return;
    }
  }
  else if(checkStoreBranch === false) {
    callback(new Error(`casePatinetViewStage1LastestController: *checkStoreBranch Not Found`));
    return;
  }
  else {
    callback(new Error(`casePatinetViewStage1LastestController: Have Other Error`));
    return;
  }
};

module.exports = casePatinetViewStage1LastestController;