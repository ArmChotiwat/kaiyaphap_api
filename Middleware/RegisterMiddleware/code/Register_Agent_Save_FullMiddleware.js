const Register_Agent_Save_FullMiddleware = async (req, res, next) => {
    let ErrorJson = {
        http_code: 400,
        document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
        description: []
    };
    try {
        /**
         ** JSON => {
                    "username":"iii8@imd.co.th",
                    "password":"12345678",
                    "store":[
                        {
                            "_storeid": "5ea003d688b7265b04296e2c",
                            "role": "2",
                            "branch":[
                                {
                                    "_branchid":"5f758e7941011800527d91a8"
                                }
                            ],
                            "email":"iii8@imd.co.th",
                            "user_status":true,
                            "avatarUrl":"",
                            "personal": {
                                "pre_name":"นาง",
                                "special_prename":"",
                                "first_name":"รุ้งนภา",
                                "last_name":"ดาริพา",
                                "gender":"หญิง",
                                "birth_date":"1989-08-23",
                                "telephone_number":null,
                                "phone_number":"0189789682",
                                "identity_card": {
                                    "ctype":true,
                                    "id":"1564650798796"
                                },
                                "address": {
                                    "country":"Thailand",
                                    "homenumber":"11/7",
                                    "province":"พระนครศรีอยุธยา",
                                    "district":"นครหลวง",
                                    "subdistrict":"บ่อโพง",
                                    "alley":"",
                                    "village_number":"",
                                    "village":"",
                                    "building":"",
                                    "postcode":"13260"
                                },
                                "educated_histroy": [
                                    {
                                        "deegree":"ปริญญาตรี",
                                        "faculty":"เอก",
                                        "educatedYear":"2568",
                                        "university":"สวัสดี"
                                    }
                                ],
                                "certificate":{
                                    "certificatedCode":"ICY568-88",
                                    "certificatedExpired":"2032-08-25"
                                },
                                "work_expriance": [
                                    {
                                        "location":"",
                                        "year":"",
                                        "description":""
                                    }
                                ],
                                "pflevel":"B",
                                "skill":[]
                            }
                        ]
                    }
        */
        const payload = req.body;

        const { validate_String_AndNotEmpty, validate_StringObjectId_NotNull, validate_StringOrNull_AndNotEmpty, validateDateTime, validatePhoneNumber, validateCitizenId_Thailand, validateStrict_Number_OrNull } = require('../../../Controller/miscController');

        if (!validate_String_AndNotEmpty(payload.password)) {
            ErrorJson.description.push(`Params <password> must be String and Not Empty`);
        }
        if (typeof payload.store != 'object' || payload.store.length !== 1) {
            ErrorJson.description.push(`Params <store> must be Array Object and Length equal 1`);
        }
        else {
            const payloadStore_Name = 'Params <store[0]';
            const payloadStore = payload.store[0];

            if (!validate_StringObjectId_NotNull(payloadStore._storeid)) {
                ErrorJson.description.push(`${payloadStore_Name}._storeid> must be String ObjectId and Not Empty`);
            }

            if (typeof payloadStore.branch != 'object' || payloadStore.branch.length !== 1) {
                ErrorJson.description.push(`${payloadStore_Name}.branch> must be Array Object and Length equal 1`);
            }
            else {
                const payloadBranch_Name = 'Params <store[0].branch[0]';
                const payloadBranch = payloadStore.branch[0];

                if (!validate_StringObjectId_NotNull(payloadBranch._branchid)) {
                    ErrorJson.description.push(`${payloadBranch_Name}._branchid> must be String ObjectId and Not Empty`);
                }
            }

            if (!validate_String_AndNotEmpty(payloadStore.email)) {
                ErrorJson.description.push(`${payloadStore_Name}.email> must be String and Not Empty`);
            }

            if (typeof payloadStore.personal != 'object') {
                ErrorJson.description.push(`${payloadStore_Name}.email> must be Object`);
            }
            else {
                const payloadPersonal_Name = 'Params <store[0].personal';
                const payloadPersonal = payloadStore.personal;

                if (!validate_String_AndNotEmpty(payloadPersonal.pre_name)) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.pre_name> must be String and Not Empty`);
                }

                if (!validate_StringOrNull_AndNotEmpty(payloadPersonal.special_prename)) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.special_prename> must be String or Null and Not Empty`);
                }

                if (validate_String_AndNotEmpty(payloadPersonal.pre_name) && payloadPersonal.pre_name === 'อื่นๆ') {
                    if (!validate_String_AndNotEmpty(payloadPersonal.special_prename)) {
                        ErrorJson.description.push(`${payloadPersonal_Name}.special_prename> must be String and Not Empty, Due ${payloadPersonal_Name}.pre_name> is อื่นๆ`);
                    }
                }

                if (!validate_String_AndNotEmpty(payloadPersonal.first_name)) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.first_name> must be String and Not Empty`);
                }

                if (!validate_String_AndNotEmpty(payloadPersonal.last_name)) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.last_name> must be String and Not Empty`);
                }

                if (!validate_String_AndNotEmpty(payloadPersonal.gender)) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.gender> must be String and Not Empty`);
                }
                else {
                    if (payloadPersonal.gender !== 'ชาย' && payloadPersonal.gender !== 'หญิง') {
                        ErrorJson.description.push(`${payloadPersonal_Name}.gender> must be String is worng format`);
                    }
                }

                if (!validate_String_AndNotEmpty(payloadPersonal.birth_date)) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.birth_date> must be String YYYY-MM-DD and Not Empty`);
                }
                else {
                    if (!validateDateTime.validateDate_String(payloadPersonal.birth_date)) {
                        ErrorJson.description.push(`${payloadPersonal_Name}.birth_date> must be String YYYY-MM-DD`);
                    }
                }

                if (!validate_StringOrNull_AndNotEmpty(payloadPersonal.telephone_number)) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.telephone_number> must be String or Null and Not Empty`);
                }

                if (!validate_String_AndNotEmpty(payloadPersonal.phone_number)) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.phone_number> must be String 10 Digits Contains 0-9 and Not Empty`);
                }
                else {
                    if (!validatePhoneNumber(payloadPersonal.phone_number)) {
                        ErrorJson.description.push(`${payloadPersonal_Name}.phone_number> must be String 10 Digits Contains 0-9`);
                    }
                }

                if (typeof payloadPersonal.identity_card != 'object') {
                    ErrorJson.description.push(`${payloadPersonal_Name}.identity_card> must be Object`);
                }
                else {
                    const payloadPersonal_Id_Name = 'Params <store[0].personal.identity_card';
                    const payloadPersonalId = payloadStore.personal.identity_card;

                    if (typeof payloadPersonalId.ctype != 'boolean') {
                        ErrorJson.description.push(`${payloadPersonal_Id_Name}.ctype> must be Boolean`);
                    }
                    else {
                        if (!validate_String_AndNotEmpty(payloadPersonalId.id)) {
                            ErrorJson.description.push(`${payloadPersonal_Id_Name}.id> must be String and Not Empty`);
                        }
                        else {
                            if (payloadPersonalId.ctype === true) {
                                if (!validateCitizenId_Thailand(payloadPersonalId.id)) {
                                    ErrorJson.description.push(`${payloadPersonal_Id_Name}.id> must be String 13 Digits, Due select Thai Citizen ID`);
                                }
                            }
                        }
                    }
                }

                if (typeof payloadPersonal.address != 'object') {
                    ErrorJson.description.push(`${payloadPersonal_Name}.address> must be Object`);
                }
                else {
                    /**
                     * ที่อยู่
                     * @typedef {Object} payloadPersonalAddress
                     * @property {String|null} country - ประเทศ
                     * @property {String} homenumber - บ้านเลขที่
                     * @property {String} district - เขต/อำเภอ
                     * @property {String} subdistrict - แขง/ตำบล
                     * @property {String|null} alley - ถนน/ซอย
                     * @property {String|null} village_number - เลขที่หมู่บ้าน
                     * @property {String|null} village - ชื่อหมูบ้าน
                     * @property {String|null} building - ชื่ออาคาร
                     * @property {String} postcode - เลขไปรษณีย์
                     */
                    /** @type {payloadPersonalAddress} */
                    const payloadPersonalAddress = payloadStore.personal.address;
                    const payloadPersonal_Address_Name = 'Params <store[0].personal.address';

                    if (!validate_String_AndNotEmpty(payloadPersonalAddress.homenumber)) {
                        ErrorJson.description.push(`${payloadPersonal_Address_Name}.homenumber> must be String and Not Empty`);
                    }
                    if (!validate_String_AndNotEmpty(payloadPersonalAddress.district)) {
                        ErrorJson.description.push(`${payloadPersonal_Address_Name}.district> must be String and Not Empty`);
                    }
                    if (!validate_String_AndNotEmpty(payloadPersonalAddress.subdistrict)) {
                        ErrorJson.description.push(`${payloadPersonal_Address_Name}.subdistrict> must be String and Not Empty`);
                    }
                    if (!validate_StringOrNull_AndNotEmpty(payloadPersonalAddress.alley)) {
                        ErrorJson.description.push(`${payloadPersonal_Address_Name}.alley> must be String or Null and Not Empty`);
                    }
                    if (!validateStrict_Number_OrNull(payloadPersonalAddress.village_number)) {
                        ErrorJson.description.push(`${payloadPersonal_Address_Name}.village_number> must be String or Null and Not Empty`);
                    }
                    if (!validate_StringOrNull_AndNotEmpty(payloadPersonalAddress.village)) {
                        ErrorJson.description.push(`${payloadPersonal_Address_Name}.village> must be String or Null and Not Empty`);
                    }
                    if (!validate_StringOrNull_AndNotEmpty(payloadPersonalAddress.building)) {
                        ErrorJson.description.push(`${payloadPersonal_Address_Name}.building> must be String or Null and Not Empty`);
                    }
                    if (!validate_String_AndNotEmpty(payloadPersonalAddress.postcode)) {
                        ErrorJson.description.push(`${payloadPersonal_Address_Name}.postcode> must be String and Not Empty`);
                    }
                }

                if (typeof payloadPersonal.educated_histroy !== 'object' || payloadPersonal.educated_histroy.length < 0) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.educated_histroy> must Array Object`);
                }
                else {
                    for (let index = 0; index < payloadPersonal.educated_histroy.length; index++) {
                        /**
                         * การศึกษา
                         * @typedef {Object} elementEH
                         * @property {String} deegree - ระดับ การศึกษา
                         * @property {String} faculty - สาขา การศึกษา
                         * @property {String} educatedYear - ปีจบ การศึกษา
                         * @property {String} university - มหาลัย การศึกษา
                         */
                        /** @type {elementEH} */
                        const elementEH = payloadPersonal.educated_histroy[index];
                        const elementEH_Name = `Params <store[0].personal.educated_histroy[${index}]`;
                        
                        if (!validate_String_AndNotEmpty(elementEH.deegree)) {
                            ErrorJson.description.push(`${elementEH_Name}.deegree> must be String and Not Empty`);
                        }
                        if (!validate_String_AndNotEmpty(elementEH.faculty)) {
                            ErrorJson.description.push(`${elementEH_Name}.faculty> must be String and Not Empty`);
                        }
                        if (!validate_String_AndNotEmpty(elementEH.educatedYear)) {
                            ErrorJson.description.push(`${elementEH_Name}.educatedYear> must be String and Not Empty`);
                        }
                        if (!validate_String_AndNotEmpty(elementEH.university)) {
                            ErrorJson.description.push(`${elementEH_Name}.university> must be String and Not Empty`);
                        }
                    }
                }
                if (typeof payloadPersonal.certificate !== 'object' || payloadPersonal.certificate.length < 0) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.certificate> must Array Object`);
                }
                else {
                    for (let index = 0; index < payloadPersonal.certificate.length; index++) {
                        /**
                         * ใบประกอบวิชาชีพ
                         * @typedef {Object} elementCert
                         * @property {String} certificatedCode - เลขที่ ใบประกอบวิชาชีพ
                         * @property {String} certificatedExpired - วันหมดอายุ ใบประกอบวิชาชีพ YYYY-MM-DD
                         */
                        /** @type {elementCert} */
                        const elementCert = payloadPersonal.certificate[index];
                        const elementCert_Name = `Params <store[0].personal.educated_histroy[${index}]`;

                        if (!validate_String_AndNotEmpty(elementCert.certificatedCode)) {
                            ErrorJson.description.push(`${elementCert_Name}.certificatedCode> must be String and Not Empty`);
                        }
                        if (!validate_String_AndNotEmpty(elementCert.certificatedExpired)) {
                            ErrorJson.description.push(`${elementCert_Name}.certificatedExpired> must be String and Not Empty`);
                        }
                        else {
                            if (!validateDateTime.validateDate_String(elementCert.certificatedExpired)) {
                                ErrorJson.description.push(`${elementCert_Name}.certificatedExpired> must be String YYYY-MM-DD`);
                            }
                        }
                    }
                }

                if (typeof payloadPersonal.work_expriance !== 'object' || payloadPersonal.work_expriance.length < 0) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.work_expriance> must Array Object`);
                }
                else {
                    for (let index = 0; index < payloadPersonal.work_expriance.length; index++) {
                        /**
                         * ประสบการณ์ทำงาน
                         * @typedef {Object} elementWExp
                         * @property {String} location - สถาณที่
                         * @property {String|null} year - ปี YYYY
                         * @property {String|null} description - คำอธิบาย
                         */
                        /** @type {elementWExp} */
                        const elementWExp = payloadPersonal.work_expriance[index];
                        const elementWExp_Name = `Params <store[0].personal.work_expriance[${index}]`;

                        if (!validate_String_AndNotEmpty(elementWExp.location)) {
                            ErrorJson.description.push(`${elementWExp_Name}.location> must be String and Not Empty`);
                        }
                        if (!validate_StringOrNull_AndNotEmpty(elementWExp.year)) {
                            ErrorJson.description.push(`${elementWExp_Name}.year> must be String YYYY or Null and Not Empty`);
                        }
                        else {
                            const chkYrear = require('moment')(elementWExp.year, 'YYYY', true).isValid();
                            if (!chkYrear) {
                                ErrorJson.description.push(`${elementWExp_Name}.year> must be String YYYY`);
                            }
                        }
                        if (!validate_StringOrNull_AndNotEmpty(elementWExp.description)) {
                            ErrorJson.description.push(`${elementWExp_Name}.description> must be String or Null and Not Empty`);
                        }
                    }
                }
                /**
                                "skill":[]
                 */

                if (!validate_String_AndNotEmpty(payloadPersonal.pflevel)) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.pflevel> must String and Not Empty`);
                }
                else {
                    const pflevel = ['A', 'B', 'C'];
                    if (pflevel.filter(where => (where === payloadPersonal.pflevel)).length !== 1) {
                        ErrorJson.description.push(`${payloadPersonal_Name}.pflevel> must String [A, B, C]`);
                    }
                }

                if (typeof payloadPersonal.skill !== 'object' || payloadPersonal.skill.length < 0) {
                    ErrorJson.description.push(`${payloadPersonal_Name}.skill> must Array Object`);
                }
                else {
                    for (let index = 0; index < payloadPersonal.skill.length; index++) {
                        /**
                         * ทักษะเชี่ยวชาญ
                         * @typedef {String} elementSk
                         */
                        /** @type {elementSk} */
                        const elementSk = payloadPersonal.skill[index];
                        const elementSk_Name = `Params <store[0].personal.skill[${index}]`;

                        if (!validate_String_AndNotEmpty(elementSk)) {
                            ErrorJson.description.push(`${elementSk_Name}> must be String and Not Empty`);
                        }
                    }
                }
            }
        }

        if (ErrorJson.description.length > 0 ) { res.status(400).json(ErrorJson).end(); return; }
        else {
            next();
        }

    } catch (error) {
        console.error(error);
        ErrorJson.http_code = 422;
        ErrorJson.description.push(`Other Error`);
        res.status(422).end();
    }

};



module.exports = Register_Agent_Save_FullMiddleware;