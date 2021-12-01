const regExCaseinsensetive = (stringdata = '') => {
    return new RegExp(stringdata, 'i');
};

const search_Patient_ListController = async (
    data = {
        _ref_storeid: '',
        user_status: true,
        idcard: '',
        email: '',
        pre_name: '',
        first_name: '',
        last_name: '',
        hn: '',
        homenumber: '',
        alley: '',
        village_number: '',
        village: '',
        building: '',
        province: '',
        district: '',
        subdistrict: '',
        postcode: '',
        phone_number: '',
        hn_ref: '',
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'search_Patient_ListController';

    const { validate_StringObjectId_NotNull } = require('../../miscController');

    const { ObjectId, patientModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else {
        const storedata = {
            '$match': { "store._storeid": ObjectId(data._ref_storeid) }
        }

        let findUserStatus = { '$match': {} }
        if (typeof data.user_status != 'undefined' && (data.user_status === true || data.user_status === false)) {
            findUserStatus = { '$match': { "store.user_status": data.user_status } }
        }
        let findIDcard = { '$match': {} }
        if (typeof data.idcard != 'undefined' && data.idcard != "") {
            findIDcard = { '$match': { "store.personal.identity_card.id": regExCaseinsensetive(data.idcard) } }
        }
        let findEmail = { '$match': {} }
        if (typeof data.email != 'undefined' && data.email != "") {
            findEmail = { '$match': { "store.personal.email": regExCaseinsensetive(data.email) } }
        }
        let findPreName = { '$match': {} }
        if (typeof data.pre_name != 'undefined' && data.pre_name != "") {
            findPreName = { '$match': { "store.personal.pre_name": regExCaseinsensetive(data.pre_name) } }
        }
        let findFirstName = { '$match': {} }
        if (typeof data.first_name != 'undefined' && data.first_name != "") {
            findFirstName = { '$match': { "store.personal.first_name": regExCaseinsensetive(data.first_name) } }
        }
        let findLastName = { '$match': {} }
        if (typeof data.last_name != 'undefined' && data.last_name != "") {
            findLastName = { '$match': { "store.personal.last_name": regExCaseinsensetive(data.last_name) } }
        }
        let findHN = { '$match': {} }
        if (typeof data.hn != 'undefined' && data.hn != "" && typeof data.hn == 'string' || data.hn === 0) {
            findHN = { '$match': { "store.hn": regExCaseinsensetive(data.hn) } }
        }
        let findHomeNumber = { '$match': {} }
        if (typeof data.homenumber != 'undefined' && data.homenumber != "") {
            findHomeNumber = { '$match': { "store.personal.contract_present.address_number": regExCaseinsensetive(data.homenumber) } }
        }
        let findAlley = { '$match': {} }
        if (typeof data.alley != 'undefined' && data.alley != "") {
            findAlley = { '$match': { "store.personal.contract_present.alley": regExCaseinsensetive(data.alley) } }
        }
        let findVillageNumber = { '$match': {} }
        if (typeof data.village_number != 'undefined' && data.village_number != "") {
            findVillageNumber = { '$match': { "store.personal.contract_present.village_number": regExCaseinsensetive(data.village_number) } }
        }
        let findVillage = { '$match': {} }
        if (typeof data.village != 'undefined' && data.village != "") {
            findVillage = { '$match': { "store.personal.contract_present.village": regExCaseinsensetive(data.village) } }
        }
        let findBuilding = { '$match': {} }
        if (typeof data.building != 'undefined' && data.building != "") {
            findBuilding = { '$match': { "store.personal.contract_present.building": regExCaseinsensetive(data.building) } }
        }
        let findProvince = { '$match': {} }
        if (typeof data.province != 'undefined' && data.province != "") {
            findProvince = { '$match': { "store.personal.contract_present.province": regExCaseinsensetive(data.province) } }
        }
        let findDistrict = { '$match': {} }
        if (typeof data.district != 'undefined' && data.district != "") {
            findDistrict = { '$match': { "store.personal.contract_present.district": regExCaseinsensetive(data.district) } }
        }
        let findSubDistrict = { '$match': {} }
        if (typeof data.subdistrict != 'undefined' && data.subdistrict != "") {
            findSubDistrict = { '$match': { "store.personal.contract_present.sub_district": regExCaseinsensetive(data.subdistrict) } }
        }
        let findPostCode = { '$match': {} }
        if (typeof data.postcode != 'undefined' && data.postcode != "") {
            findPostCode = { '$match': { "store.personal.contract_present.postcode": regExCaseinsensetive(data.postcode) } }
        }
        let findPhoneNumber = { '$match': {} }
        if (typeof data.phone_number != 'undefined' && data.phone_number != "") {
            findPhoneNumber = { '$match': { "store.personal.phone_number": regExCaseinsensetive(data.phone_number) } }
        }
        let findHnRef = { '$match': {} }
        if (typeof data.hn_ref != 'undefined' && data.hn_ref != "") {
            findPhoneNumber = { '$match': { "store.personal.hn_ref": regExCaseinsensetive(data.hn_ref) } }
        }

        const aggregatePipeline = [

            storedata,
            {
                '$unwind': {
                    'path': '$store'
                }
            },
            storedata,

            findUserStatus,
            findIDcard,
            findEmail,
            findPreName,
            findFirstName,
            findLastName,
            findHN,
            findHomeNumber,
            findAlley,
            findVillageNumber,
            findVillage,
            findBuilding,
            findProvince,
            findDistrict,
            findSubDistrict,
            findPostCode,
            findPhoneNumber,
            findHnRef,

            {
                '$addFields': {
                    'split_hn': {
                        '$split': [
                            '$store.hn', '/'
                        ]
                    }
                }
            }, {
                '$sort': {
                    'split_hn.1': 1,
                    'split_hn.0': 1
                }
            }
        ];

        const searchPatient = await patientModel.aggregate(
            aggregatePipeline,
            (err) => { if (err) { callback(err); return; } }
        );

        if (!searchPatient) { callback(new Error(`${controllerName} searchPatient have error during aggregate`)); return; }
        else {
            const mapSearchPatient = searchPatient.map(
                (where, index) => (
                    {
                        run_number: index + 1,
                        _userID: where._id,
                        _storeID: where.store._storeid,
                        hn: where.store.hn || "",
                        hn_ref: where.store.hn_ref || "",
                        role: 'patient',
                        userRegisterDate: where.store.userRegisterDate,
                        user_status: where.user_status,
                        idcard: where.store.personal.identity_card.id,
                        idstatus: where.store.personal.identity_card.id ? true : false,
                        pre_name: where.store.personal.pre_name,
                        special_prename: where.store.personal.special_prename,
                        first_name: where.store.personal.first_name,
                        last_name: where.store.personal.last_name,
                        phone_number: where.store.personal.phone_number
                    }
                )
            );

            return mapSearchPatient;
        }
    }
};


module.exports = search_Patient_ListController;