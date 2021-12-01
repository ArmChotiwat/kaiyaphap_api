const casePatinetCreateController = async (
  data = {
    _storeid: String(''),
    _branchid: String(''),
    _patientid: String(''),
    _agentid: String(''),
    _ref_scheduleid: String(''),
    _casemainid: String(''),
    _casesubid: String(''),
  },
  callback = (err = new Error) => { }) => {
  const controllerName = `casePatinetCreateController`;

  const moment = require('moment');
  const zeroFill = require('../../miscController').zeroFill;

  const mongodbController = require('../../../Controller/mongodbController');
  const checkObjectId = mongodbController.checkObjectId;
  const patientModel = mongodbController.patientModel;
  const agentModel = mongodbController.agentModel;
  const caseTypeModel = mongodbController.caseTypeModel;
  const casePatientPersonalDetailModel = mongodbController.casePatientPersonalDetailModel;
  const casePatientModel = mongodbController.casePatientModel;

  const miscController = require('../../miscController');
  const checkAgentId = miscController.checkAgentId;
  const validateObjectId = miscController.validateObjectId;
  const Schedule_Check_Status = miscController.Schedule_Check_Status;

  const AutoIncrementCasePatientController = require('./autoIncresementCasePatient');
  const AutoIncrementCasePatientStore = AutoIncrementCasePatientController.AutoIncrementCasePatientStore;
  const AutoIncrementCasePatientStoreBranch = AutoIncrementCasePatientController.AutoIncrementCasePatientStoreBranch;

  const zeroFillPrefixStore = 4;
  const zeroFillPrefixBranch = 4;

  if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
  else if (typeof data._storeid != 'string' || !validateObjectId(data._storeid)) { callback(new Error(`${controllerName}: <data._storeid> must be String ObjectId`)); return; }
  else if (typeof data._branchid != 'string' || !validateObjectId(data._branchid)) { callback(new Error(`${controllerName}: <data._branchid> must be String ObjectId`)); return; }
  else if (typeof data._patientid != 'string' || !validateObjectId(data._patientid)) { callback(new Error(`${controllerName}: <data._patientid> must be String ObjectId`)); return; }
  else if (typeof data._agentid != 'string' || !validateObjectId(data._agentid)) { callback(new Error(`${controllerName}: <data._agentid> must be String ObjectId`)); return; }
  else if (typeof data._ref_scheduleid != 'string' || !validateObjectId(data._ref_scheduleid)) { callback(new Error(`${controllerName}: <data._ref_scheduleid> must be String ObjectId`)); return; }
  else if (typeof data._casemainid != 'string' || !validateObjectId(data._casemainid)) { callback(new Error(`${controllerName}: <data._casemainid> must be String ObjectId`)); return; }
  else if (typeof data._casesubid != 'string' || !validateObjectId(data._casesubid)) { callback(new Error(`${controllerName}: <data._casesubid> must be String ObjectId`)); return; }
  else {
    const chkSchedule = await Schedule_Check_Status(
      {
        _ref_storeid: data._storeid,
        _ref_branchid: data._branchid,
        _ref_scheduleid: data._ref_scheduleid,
      },
      (err) => { if (err) { callback(err); return; } }
    );

    const _ref_scheduleid = await checkObjectId(data._ref_scheduleid, (err) => { if (err) { callback(err); return; } });
    const chkDuplicated_Schedule_CasePatient = await casePatientModel.findOne(
      {
        '_ref_scheduleid': _ref_scheduleid
      },
      {},
      (err) => { if (err) { callback(err); return; } }
    );

    if (!chkSchedule) { callback(new Error(`${controllerName}: chkSchedule return not found`)); return; }
    else if (chkSchedule.statusMode !== 3) { callback(new Error(`${controllerName}: chkSchedule.statusMode (${chkSchedule.statusMode}) must equal 3`)); return; }
    else if (chkDuplicated_Schedule_CasePatient) { callback(new Error(`${controllerName}: chkDuplicated_Schedule_CasePatient return found`)); return; }
    else {
      const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
      const _branchid = await checkObjectId(data._branchid, (err) => { if (err) { callback(err); return; } });
      const _patientid = await checkObjectId(data._patientid, (err) => { if (err) { callback(err); return; } });
      const _agentid = await checkObjectId(data._agentid, (err) => { if (err) { callback(err); return; } });
      const _casemainid = await checkObjectId(data._casemainid, (err) => { if (err) { callback(err); return; } });
      const _casesubid = await checkObjectId(data._casesubid, (err) => { if (err) { callback(err); return; } });

      let _ref_storeid, _ref_branchid;
      let _ref_patient_userid, _ref_patient_userstoreid;
      let _ref_agent_userid, _ref_agent_userstoreid;

      const create_date = moment();
      const create_date_string = create_date.format('YYYY-MM-DD');
      const create_time_string = create_date.format('HH:mm:ss');

      const modify_date = create_date;
      const modify_date_string = create_date.format('YYYY-MM-DD');
      const modify_time_string = create_date.format('HH:mm:ss');

      let _ref_casemaintypeid, _ref_reftcasemaintypeid, _casemaintypename;
      let _ref_casesubtypeid, _ref_reftcasesubtypeid, _casesubtypename;

      let prefixCase, prefixMainCase, prefixSubCase, prefixYear, prefixMonth, prefixRunnerStore, prefixRunnerBranch;
      let run_number_store, case_number_store;
      let run_number_branch, case_number_branch;

      const isclosed = false;
      const istruncated = false;

      const findPatient = await patientModel.aggregate(
        [
          {
            '$match': {
              '_id': _patientid
            }
          }, {
            '$unwind': {
              'path': '$store'
            }
          }, {
            '$match': {
              '_id': _patientid,
              'store._storeid': _storeid
            }
          }
        ],
        (err) => {
          if (err) { callback(err); return; }
        }
      );
      if (!findPatient || findPatient.length != 1) { callback(new Error(`casePatinetCreateController: Patient Not Found`)); return; }
      else {
        _ref_patient_userid = findPatient[0]._id;
        _ref_patient_userstoreid = findPatient[0].store._id;
      }

      const findAgent = await checkAgentId(
        {
          _agentid: data._agentid,
          _storeid: data._storeid,
          _branchid: data._branchid
        },
        (err) => { if (err) { callback(err); return; } }
      );
      if (!findAgent) { callback(new Error(`casePatinetCreateController: Agent Not Found`)); return; }
      else {
        _ref_agent_userid = findAgent._agentid
        _ref_agent_userstoreid = findAgent._agentstoreid
      }

      const findCaseType = await caseTypeModel.aggregate(
        [
          {
            '$match': {
              '_storeid': _storeid,
              '_branchid': _branchid,
              '_reftid': _casemainid,
              'isused': true,
              'type_sub._reftid': _casesubid,
              'type_sub.isused': true
            }
          }, {
            '$unwind': {
              'path': '$type_sub'
            }
          }, {
            '$match': {
              '_storeid': _storeid,
              '_branchid': _branchid,
              '_reftid': _casemainid,
              'isused': true,
              'type_sub._reftid': _casesubid,
              'type_sub.isused': true
            }
          }
        ],
        (err) => {
          if (err) { callback(err); return; }
        }
      );
      if (!findCaseType || findCaseType.length != 1) { callback(new Error(`casePatinetCreateController: CaseType Not Found`)); return; }
      else {
        /**
           * COU20200600001
           * C_O_U_2020_06_01_0001
           * 
           * C => Case
           * O => MainCase/Group
           * U => SubCase/Type
           * 2020 => Year
           * 06 => Month
           * 01 => Day
           * 000001 => Running Number (4 Digits <00000>)
          */
        prefixCase = 'C'; // Case
        prefixMainCase = findCaseType[0].prefix; // MainCase/Group
        prefixSubCase = findCaseType[0].type_sub.prefix; // SubCase/Type
        prefixYear = create_date.format('YYYY');
        prefixMonth = create_date.format('MM');

        _ref_casemaintypeid = findCaseType[0]._id;
        _ref_reftcasemaintypeid = findCaseType[0]._reftid;
        _casemaintypename = findCaseType[0].name;

        _ref_casesubtypeid = findCaseType[0].type_sub._id;
        _ref_reftcasesubtypeid = findCaseType[0].type_sub._reftid;
        _casesubtypename = findCaseType[0].type_sub.name;
      }

      if (
        !create_date ||
        !create_date_string ||
        !create_time_string ||
        !modify_date ||
        !modify_date_string ||
        !modify_time_string ||

        !_ref_patient_userid ||
        !_ref_patient_userstoreid ||

        !_ref_agent_userid ||
        !_ref_agent_userstoreid ||

        !_ref_casemaintypeid ||
        !_ref_reftcasemaintypeid ||
        !_casemaintypename ||

        !_ref_casesubtypeid ||
        !_ref_reftcasesubtypeid ||
        !_casesubtypename ||

        !prefixCase ||
        !prefixMainCase ||
        !prefixSubCase ||
        !prefixYear ||
        !prefixMonth
      ) { callback(new Error(`data Not Found`)); return; }
      else {
        const aiCaseStore = await AutoIncrementCasePatientStore(
          {
            _storeid: data._storeid
          },
          (err) => { callback(err); return; }
        );
        const aiCaseStoreBranch = await AutoIncrementCasePatientStoreBranch(
          {
            _storeid: data._storeid,
            _branchid: data._branchid
          },
          (err) => { callback(err); return; }
        );
        _ref_storeid = _storeid;
        _ref_branchid = _branchid;

        if (!aiCaseStore || !aiCaseStoreBranch) { callback(new Error(`casePatinetCreateController: AutoIncresement Error`)); return; }
        else {
          /**
           * COU20200600001
           * C_O_U_2020_06_01_0001
           * 
           * C => Case
           * O => MainCase/Group
           * U => SubCase/Type
           * 2020 => Year
           * 06 => Month
           * 01 => Day
           * 000001 => Running Number (4 Digits <00000>)
           */

          run_number_store = aiCaseStore.seq;
          prefixRunnerStore = await zeroFill(
            {
              incmentNumber: run_number_store,
              widthZero: zeroFillPrefixStore
            },
            (err) => { if (err) { callback(err); return; } }
          );
          case_number_store = prefixCase.toString() + prefixMainCase.toString() + prefixSubCase.toString() + prefixYear.toString() + prefixMonth.toString() + prefixRunnerStore.toString();

          run_number_branch = aiCaseStoreBranch.seq;
          prefixRunnerBranch = await zeroFill(
            {
              incmentNumber: run_number_branch,
              widthZero: zeroFillPrefixBranch
            },
            (err) => { if (err) { callback(err); return; } }
          );
          case_number_branch = prefixCase.toString() + prefixMainCase.toString() + prefixSubCase.toString() + prefixYear.toString() + prefixMonth.toString() + prefixRunnerBranch.toString();

          const mapcasePatinetData = {
            _ref_storeid: _ref_storeid,
            _ref_branchid: _ref_branchid,

            _ref_scheduleid: _ref_scheduleid,

            _ref_patient_userid: _ref_patient_userid,
            _ref_patient_userstoreid: _ref_patient_userstoreid,

            _ref_agent_userid: _ref_agent_userid,
            _ref_agent_userstoreid: _ref_agent_userstoreid,

            create_date: create_date,
            create_date_string: create_date_string,
            create_time_string: create_time_string,

            modify_date: modify_date,
            modify_date_string: modify_date_string,
            modify_time_string: modify_time_string,

            run_number_store: run_number_store,
            case_number_store: case_number_store,

            run_number_branch: run_number_branch,
            case_number_branch: case_number_branch,

            _ref_casemaintypeid: _ref_casemaintypeid,
            _ref_reftcasemaintypeid: _ref_reftcasemaintypeid,
            _casemaintypename: _casemaintypename,

            _ref_casesubtypeid: _ref_casesubtypeid,
            _ref_reftcasesubtypeid: _ref_reftcasesubtypeid,
            _casesubtypename: _casesubtypename,

            isclosed: isclosed,
            istruncated: istruncated,
          }

          const casePatientModeltransactionSave = new casePatientModel(mapcasePatinetData);
          const casePatientSaveResult = await casePatientModeltransactionSave.save()
            .then(
              result => {
                return result;
              }
            )
            .catch(
              err => {
                callback(err);
                return;
              }
            );

          if (!casePatientSaveResult) { callback(new Error(`casePatinetCreateController: casePatientSaveResult Error`)); return; }
          else {
            const mapPatientData = {

              _ref_casepatinetid: casePatientSaveResult._id,

              create_date: casePatientSaveResult.create_date,
              create_date_string: casePatientSaveResult.create_date_string,
              create_time_string: casePatientSaveResult.create_time_string,

              patient_personal: findPatient[0].store.personal,
            };

            const patientModeltransactionSave = new casePatientPersonalDetailModel(mapPatientData);
            const patientSaveResult = await patientModeltransactionSave.save()
              .then(
                result => {
                  return result;
                }
              )
              .catch(
                err => {
                  callback(err);
                  return;
                }
              );

            if (!patientSaveResult) { callback(new Error(`casePatinetCreateController: patientSaveResult Error`)); return; }
            else {
              callback(null);
              return casePatientSaveResult;
            }
          }
        }
      }
    }
  }

};


module.exports = casePatinetCreateController;