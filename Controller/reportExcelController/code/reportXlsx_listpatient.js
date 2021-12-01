const reportExcel_listPatinets = async (
  data = {
    _storeid: new String(''),
    datestart: new String(''),
    dateend: new String(''),
  },
  callback = (err = new Error) => { }) => {
  const momnet = require('moment');
  const excel4node = require('excel4node');
  const checkObjectId = require('../../mongodbController').checkObjectId;  

  const patientModel = require('../../mongodbController').patientModel;

  const thday = new Array("อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์");
  const thmonth = new Array("มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม");  
  if (typeof data._storeid != 'string' || data._storeid == '') { callback(new Error('reportExcelController => reportExcel_listPatinets: data._storeid is not String or is String or os Empty')); return; }
  else {
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

    const _storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(new Error('reportExcelController => reportExcel_listPatinets: data._storeid cannot convert to ObjectId')); console.error(err); return; } });
    const now = new Date()
    const theTodayYear = (now.getFullYear() + 543);
    const theTodayMonth = thmonth[now.getMonth()];
    const theTodayDay = now.getDate();
    const theTodayDayDesc = thday[now.getDay()];
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

      let wBook = new excel4node.Workbook();
      let wSheet = wBook.addWorksheet('Sheet1');

      // Set Document Style
      var wBookStyle = wBook.createStyle({

      });
      let new_date_start = match.$gte =='1000-01-01' || !match.$gte ? '-' : match.$gte      
      wSheet.cell(1, 1).string('จาก : ' + new_date_start);
      wSheet.cell(1, 2).string('ถึง : ' + match.$lte);
      // Start Header
      wSheet.cell(2, 1).string('ลำดับ');
      wSheet.cell(2, 2).string('HN');
      wSheet.cell(2, 3).string('ชื่อ-นามสกุล');
      wSheet.cell(2, 4).string('เลข ปชช/passport');
      wSheet.cell(2, 5).string('ว/ด/ป เกิด');
      wSheet.cell(2, 6).string('เพศ');
      wSheet.cell(2, 7).string('เบอร์มือถือ');
      wSheet.cell(2, 8).string('ที่อยู่');
      wSheet.cell(2, 9).string('สิทธิ์การรักษา');
      wSheet.cell(2, 10).string('โรคประจำตัว');
      // End Header

      // Start Render Detail
      const checkNullOrEmpty = (getContractPresent) => {
        if (typeof getContractPresent == 'undefined') { return ''; }
        getContractPresent.address_number = getContractPresent.address_number === undefined ? '' : getContractPresent.address_number;
        //console.log(`data is ${getContractPresent.address_number}`)
        getContractPresent.village_number = getContractPresent.village_number || '';
        getContractPresent.village = getContractPresent.village || '';
        getContractPresent.building = getContractPresent.building || '';
        getContractPresent.alley = getContractPresent.alley || '';
        getContractPresent.road = getContractPresent.road || '';
        getContractPresent.province = getContractPresent.province || '';
        getContractPresent.district = getContractPresent.district || '';
        getContractPresent.sub_district = getContractPresent.sub_district || '';
        getContractPresent.postcode = getContractPresent.postcode || '';
        let data = [];
        const checkData = (getData) => {
          if (getData === null || getData == "") {
            return false;
          }
          else { return true; }
        }
        if (checkData(getContractPresent.address_number)) { data.push(getContractPresent.address_number) }
        if (checkData(getContractPresent.village_number)) { data.push(getContractPresent.village_number) }
        if (checkData(getContractPresent.village)) { data.push(getContractPresent.village) }
        if (checkData(getContractPresent.building)) { data.push(getContractPresent.building) }
        if (checkData(getContractPresent.alley)) { data.push(getContractPresent.alley) }
        if (checkData(getContractPresent.road)) { data.push(getContractPresent.road) }
        if (checkData(getContractPresent.province)) { data.push(getContractPresent.province) }
        if (checkData(getContractPresent.district)) { data.push(getContractPresent.district) }
        if (checkData(getContractPresent.sub_district)) { data.push(getContractPresent.sub_district) }
        if (checkData(getContractPresent.postcode)) { data.push(getContractPresent.postcode) }

        return data.toString();
      }
      const mapCongenitalDiseas = (getData) => {
        let data = [];
        for (let index = 0; index < getData.length; index++) {
          const element = getData[index].name;
          data.push(element)
        }
        return data.toString();
      };
      const mapPatientName = (pre_name, special_prename, first_name, last_name) => {
        if (pre_name == 'อื่นๆ') {
          return '' + special_prename + '' + first_name + ' ' + last_name;
        }
        else {
          return '' + pre_name + '' + first_name + ' ' + last_name;
        }
      }
      if (mapData.data.length > 0) {
        for (let idxData = 0; idxData < mapData.data.length; idxData++) {
          const elementData = mapData.data[idxData];
          const rowsData = idxData + 3;

          // console.log(`${elementData._hn}: `+ ((elementData.patient.medication_privilege === undefined) ? 'data-none':elementData.patient.medication_privilege.privilege_name));
          wSheet.cell(rowsData, 1).string('' + (idxData + 1));
          wSheet.cell(rowsData, 2).string('' + elementData._hn);
          wSheet.cell(rowsData, 3).string('' + mapPatientName(elementData.patient.pre_name, elementData.patient.special_prename, elementData.patient.first_name, elementData.patient.last_name));
          wSheet.cell(rowsData, 4).string('' + ((elementData.patient.identity_card.id == null) ? '' : elementData.patient.identity_card.id));
          wSheet.cell(rowsData, 5).string('' + ((elementData.patient.birth_date == null) ? '' : momnet(elementData.patient.birth_date, 'YYYY/MM/DD').add(543, 'years').format("DD/MM/YYYY")));
          wSheet.cell(rowsData, 6).string('' + ((elementData.patient.gender == null) ? '' : elementData.patient.gender));
          wSheet.cell(rowsData, 7).string('' + ((elementData.patient.phone_number == null) ? '' : elementData.patient.phone_number));
          wSheet.cell(rowsData, 8).string('' + checkNullOrEmpty(elementData.patient.contract_present));
          wSheet.cell(rowsData, 9).string('' + ((elementData.patient.medication_privilege.privilege_name == null) ? '' : elementData.patient.medication_privilege.privilege_name));
          wSheet.cell(rowsData, 10).string('' + mapCongenitalDiseas(elementData.patient.general_user_detail.congenital_disease));
        }
      }
      // End Render Detail

      // wBook.write('Report_Patient_'+ mapData.reportDate.year + ''+ momnet().format('MM') + '' + momnet().format('DD') + '.xlsx', (_) => { callback(null); return _; } );
      return wBook;
    } catch (error) {
      console.error(error);
      callback(error);
      return;
    }
  }
};

module.exports = reportExcel_listPatinets;