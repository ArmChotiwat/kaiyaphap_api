const regExCaseinsensetive = (stringdata = '') => {
    return new RegExp(stringdata, 'i');
};

const search_Agent_ListController = async (
    data = {
        _ref_storeid: '',
        _ref_branchid: '',
        user_status: true,
        idcard: '',
        email: '',
        pre_name: '',
        first_name: '',
        last_name: '',
        homenumber: '',
        alley: '',
        village_number: '',
        village: '',
        building: '',
        province: '',
        district: '',
        subdistrict: '',
        postcode: '',
    },
    callback = (err = new Error) => {}
) => {
    const controllerName = 'search_Agent_ListController';

    const { validate_StringObjectId_NotNull } = require('../../miscController');

    const { ObjectId, agentModel } = require('../../mongodbController');

    if (typeof data != 'object') { callback(new Error(`${controllerName}: <data> must be Object`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_storeid)) { callback(new Error(`${controllerName}: <data._ref_storeid> must be String ObjectId`)); return; }
    else if (!validate_StringObjectId_NotNull(data._ref_branchid)) { callback(new Error(`${controllerName}: <data._ref_branchid> must be String ObjectId`)); return; }
    else {
        const StoreBranch_Match = {
            '$match': {
                "store._storeid": ObjectId(data._ref_storeid),
                "store.branch._branchid": ObjectId(data._ref_branchid),
            }
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
        let findHomeNumber = { '$match': {} }
        if (typeof data.homenumber != 'undefined' && data.homenumber != "") {
            findHomeNumber = { '$match': { "store.personal.address.homenumber": regExCaseinsensetive(data.homenumber) } }
        }
        let findAlley = { '$match': {} }
        if (typeof data.alley != 'undefined' && data.alley != "") {
            findAlley = { '$match': { "store.personal.address.alley": regExCaseinsensetive(data.alley) } }
        }
        let findVillageNumber = { '$match': {} }
        if (typeof data.village_number != 'undefined' && data.village_number != "") {
            findVillageNumber = { '$match': { "store.personal.address.village_number": regExCaseinsensetive(data.village_number) } }
        }
        let findVillage = { '$match': {} }
        if (typeof data.village != 'undefined' && data.village != "") {
            findVillage = { '$match': { "store.personal.address.village": regExCaseinsensetive(data.village) } }
        }
        let findBuilding = { '$match': {} }
        if (typeof data.building != 'undefined' && data.building != "") {
            findBuilding = { '$match': { "store.personal.address.building": regExCaseinsensetive(data.building) } }
        }
        let findProvince = { '$match': {} }
        if (typeof data.province != 'undefined' && data.province != "") {
            findProvince = { '$match': { "store.personal.address.province": regExCaseinsensetive(data.province) } }
        }
        let findDistrict = { '$match': {} }
        if (typeof data.district != 'undefined' && data.district != "") {
            findDistrict = { '$match': { "store.personal.address.district": regExCaseinsensetive(data.district) } }
        }
        let findSubDistrict = { '$match': {} }
        if (typeof data.subdistrict != 'undefined' && data.subdistrict != "") {
            findSubDistrict = { '$match': { "store.personal.address.subdistrict": regExCaseinsensetive(data.subdistrict) } }
        }
        let findPostCode = { '$match': {} }
        if (typeof data.postcode != 'undefined' && data.postcode != "") {
            findPostCode = { '$match': { "store.personal.address.postcode": regExCaseinsensetive(data.postcode) } }
        }


        const aggregatePipeline = [
            StoreBranch_Match,
            {
                '$unwind': {
                    'path': '$store'
                }
            },
            StoreBranch_Match,
            {
                '$match': { "store.role": 2 }
            },
            findUserStatus,
            findIDcard,
            findEmail,
            findPreName,
            findFirstName,
            findLastName,
            findHomeNumber,
            findAlley,
            findVillageNumber,
            findVillage,
            findBuilding,
            findProvince,
            findDistrict,
            findSubDistrict,
            findPostCode,
        ];


        const searchAgent = await agentModel.aggregate(
            aggregatePipeline,
            (err) => { if (err) { callback(err); return; } }
        );

        if (!searchAgent) { callback(new Error(`${controllerName} searchAgent have error during aggregate`)); return; }
        else {
            const mapSearchAgent = searchAgent.map(
                (where, index) => (
                    {
                        runIndex: index + 1,
                        _userid: where._id,
                        _agentid: where.store._id,
                        pre_name: where.store.personal.pre_name,
                        special_prename: where.store.personal.special_prename,
                        first_name: where.store.personal.first_name,
                        last_name: where.store.personal.last_name,
                        phone_number: where.store.personal.phone_number,
                        user_register_date: where.store.userRegisterDate,
                        user_status: where.store.user_status
                    }
                )
            );
            
            return mapSearchAgent;
        }
    }
};



module.exports = search_Agent_ListController;