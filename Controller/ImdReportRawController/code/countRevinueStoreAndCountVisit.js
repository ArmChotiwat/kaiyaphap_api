/** (แยกตาม Store)
 ** จำนวนครั้งที่รักษาทั้งหมดในระบบ 
 ** จำนวนครั้งทีรักษาในเดือนนี้ (ตามทรานเซกชั้น)
 ** มีการเปิดเคสในเดือนนี้ 
 ** มีการเปิด Next visit ในเดือนนี้ 
 * */
const countRevinueStoreAndCountVisitController = async (data = { _storeid: new String, getDate: new String | new Date() }, callback = (err = new Error) => { }) => {
    const mongodbController = require('../../mongodbController');
    const { checkObjectId } = require('../../mongodbController');
    const moment = require('moment');
    const storeid = await checkObjectId(data._storeid, (err) => { if (err) { callback(err); return; } });
    try {
        let date = '';
        let match_data = '';
        if (typeof data.getDate === 'string' && data.getDate.length === 10) {
            date = moment(data.getDate).format("YYYY-MM-DD");
            match_data = {
                'create_date_string': {
                    '$gte': moment(date).startOf('month').format('YYYY-MM-DD'),
                    '$lte': moment(date).endOf('month').format('YYYY-MM-DD')
                }
            }
        } else {
            match_data = {
                'create_date_string': {
                    '$gte': moment().startOf('month').format('YYYY-MM-DD'),
                    '$lte': moment().endOf('month').format('YYYY-MM-DD')
                }
            }
        }
        const f_sum_visit_all_store = async () => {

            const sum_visit_all_store = await mongodbController.treatmentModel.aggregate
                (
                    [
                        {
                            '$match': {
                                '_ref_storeid': storeid
                            }
                        }, {
                            '$lookup': {
                                'from': 'l_casepatient',
                                'localField': '_ref_casepatinetid',
                                'foreignField': '_id',
                                'as': 'l_casepatient'
                            }
                        }, {
                            '$unwind': {
                                'path': '$l_casepatient'
                            }
                        }, {
                            '$match': {
                                'l_casepatient._ref_storeid': storeid
                            }
                        }, {
                            '$group': {
                                '_id': '$_ref_storeid',
                                'sum': {
                                    '$sum': 1
                                }
                            }
                        }
                    ]
                )
            if (sum_visit_all_store.length === 0 || !sum_visit_all_store) {
                return 0;
            } else {
                return sum_visit_all_store[0].sum;
            }
        }

        const f_sum_visit_month_store = async () => {
            const treatmentModel = await mongodbController.treatmentModel.aggregate
                (
                    [
                        {
                            '$match': {
                                '_ref_storeid': storeid
                            }
                        }, {
                            '$match': match_data
                        }, {
                            '$lookup': {
                                'from': 'l_casepatient',
                                'localField': '_ref_casepatinetid',
                                'foreignField': '_id',
                                'as': 'l_casepatient'
                            }
                        }, {
                            '$unwind': {
                                'path': '$l_casepatient'
                            }
                        }, {
                            '$match': {
                                'l_casepatient._ref_storeid': storeid
                            }
                        }, {
                            '$group': {
                                '_id': '$_ref_storeid',
                                'sum': {
                                    '$sum': 1
                                }
                            }
                        }
                    ]
                )
            if (treatmentModel.length === 0 || !treatmentModel) {
                return 0;
            } else {
                return treatmentModel[0].sum;
            }

        }

        const count_case_all_store = async () => {
            const count_casePatientModel_store = await mongodbController.casePatientModel.aggregate
                (
                    [
                        {
                            '$match': {
                                '_ref_storeid': storeid
                            }
                        }, {
                            '$match': match_data

                        }, {
                            '$lookup': {
                                'from': 'st_casepatient',
                                'localField': '_id',
                                'foreignField': '_ref_casepatientid',
                                'as': 'st_casepatient'
                            }
                        }, {
                            '$project': {
                                's_casd': {
                                    '$cond': [
                                        {
                                            '$eq': [
                                                {
                                                    '$size': '$st_casepatient'
                                                }, 1
                                            ]
                                        }, 'First', 'Next'
                                    ]
                                }
                            }
                        }, {
                            '$group': {
                                '_id': '$s_casd',
                                'cout': {
                                    '$sum': 1
                                }
                            }
                        }
                    ]
                )


            let map
            if (!count_casePatientModel_store || count_casePatientModel_store.length === 0) {
                map = {
                    First: 0,
                    Next: 0,
                }
                return map;
            } else {
                if (count_casePatientModel_store[0]._id === 'First') {
                    if (count_casePatientModel_store.length === 1) {
                        map = {
                            First: count_casePatientModel_store[0].cout,
                            Next: 0,
                        }
                    } else {
                        map = {
                            First: count_casePatientModel_store[0].cout,
                            Next: count_casePatientModel_store[1].cout,
                        }
                    }

                    return map;
                } else if (count_casePatientModel_store[0]._id === 'Next') {
                    if (count_casePatientModel_store.length === 1) {
                        map = {
                            First: 0,
                            Next: count_casePatientModel_store[0].cout,
                        }
                    } else {
                        map = {
                            First: count_casePatientModel_store[1].cout,
                            Next: count_casePatientModel_store[0].cout,
                        }
                    }

                    return map;
                } else {
                    return map = {
                        First: 0,
                        Next: 0,
                    }
                }
            }
        }

        let map
        map = {
            date_start: match_data.create_date_string.$gte,
            date_end: match_data.create_date_string.$lte,
            sum_visit_all_store: await f_sum_visit_all_store(),
            cont_visit_First_Next: await count_case_all_store(),
            sum_visit_month_store: await f_sum_visit_month_store()
        }
        callback(null);
        return map;
    } catch (error) {
        callback(error);
        return;
    }
};


module.exports = countRevinueStoreAndCountVisitController;