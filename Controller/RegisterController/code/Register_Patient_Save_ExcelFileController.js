app.post(
    '/register/patinet/fileexcel',
    jwtLogin_Agent_StoreBranchMiddleware,
    async (req, res) => {
        const getHeaderRowFix = () => {
            const headers = [
                'No',
                'RefHN',
                'Profile_prefix',
                'Profile_is_prefix',
                'Profile_name',
                'Profile_surname',
                'Profile_is_identification',
                'Profile_citizen_id',
                'Profile_nickname',
                'Profile_birthday',
                'Profile_gender',
                'Profile_height',
                'Profile_weight',
                'Profile_nationality',
                'Profile_believe_in',
                'Profile_religion',
                'Profile_phone_number',
                'Profile_blood_type',
                'Profile_adviser',
                'Profile_email',
                'Profile_status',
                'Profile_career',
                'CurrentAddress_house_number',
                'CurrentAddress_alley',
                'CurrentAddress_village_number',
                'CurrentAddress_village',
                'CurrentAddress_road',
                'CurrentAddress_building',
                'CurrentAddress_province',
                'CurrentAddress_district',
                'CurrentAddress_sup_district',
                'CurrentAddress_postal_code',
                'AddressCard_house_number',
                'AddressCard_alley',
                'AddressCard_village_number',
                'AddressCard_village',
                'AddressCard_road',
                'AddressCard_building',
                'AddressCard_province',
                'AddressCard_district',
                'AddressCard_sup_district',
                'AddressCard_postal_code',
                'Emergency_prefix',
                'Emergency_is_prefix',
                'Emergency_name',
                'Emergency_surname',
                'Emergency_phone_number',
                'Emergency_email',
                'Emergency_Relevance',
                'Emergency_house_number',
                'Emergency_alley',
                'Emergency_village_number',
                'Emergency_village',
                'Emergency_road',
                'Emergency_building',
                'Emergency_province',
                'Emergency_district',
                'Emergency_sup_district',
                'Emergency_postal_code',
                'Treatment_treatment_rights',
                'Treatment_intolerance',
            ]
            return headers;
        };
        const { xlsx_file } = await req.files;
        const XLSX = require('xlsx');
        const workbook = XLSX.read(xlsx_file.data, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const header = getHeaderRowFix();
        const results = XLSX.utils.sheet_to_json(worksheet, {
            header: header,
        });
        const mapData = results.filter((data, index) => {
            if (index > 1) {
                return {
                    No: data.No,
                    RefHN: data.RefHN,
                    Profile_prefix: data.Profile_prefix,
                    Profile_is_prefix: data.Profile_is_prefix,
                    Profile_name: data.Profile_name,
                    Profile_surname: data.Profile_surname,
                    Profile_is_identification: data.Profile_is_identification,
                    Profile_citizen_id: data.Profile_citizen_id,
                    Profile_nickname: data.Profile_nickname,
                    Profile_birthday: data.Profile_birthday,
                    Profile_gender: data.Profile_gender,
                    Profile_height: data.Profile_height,
                    Profile_weight: data.Profile_weight,
                    Profile_nationality: data.Profile_nationality,
                    Profile_believe_in: data.Profile_believe_in,
                    Profile_religion: data.Profile_religion,
                    Profile_phone_number: data.Profile_phone_number,
                    Profile_blood_type: data.Profile_blood_type,
                    Profile_adviser: data.Profile_adviser,
                    Profile_email: data.Profile_email,
                    Profile_status: data.Profile_status,
                    Profile_career: data.Profile_career,
                    AddressCard_house_number: data.AddressCard_house_number,
                    AddressCard_alley: data.AddressCard_alley,
                    AddressCard_village_number: data.AddressCard_village_number,
                    AddressCard_village: data.AddressCard_village,
                    AddressCard_road: data.AddressCard_road,
                    AddressCard_building: data.AddressCard_building,
                    AddressCard_province: data.AddressCard_province,
                    AddressCard_district: data.AddressCard_district,
                    AddressCard_sup_district: data.AddressCard_district,
                    AddressCard_postal_code: data.AddressCard_postal_code,
                    CurrentAddress_house_number: data.CurrentAddress_house_number,
                    CurrentAddress_alley: data.CurrentAddress_alley,
                    CurrentAddress_village_number: data.CurrentAddress_village_number,
                    CurrentAddress_village: data.CurrentAddress_village,
                    CurrentAddress_road: data.CurrentAddress_road,
                    CurrentAddress_building: data.CurrentAddress_building,
                    CurrentAddress_province: data.CurrentAddress_province,
                    CurrentAddress_district: data.CurrentAddress_district,
                    CurrentAddress_sup_district: data.CurrentAddress_district,
                    CurrentAddress_postal_code: data.CurrentAddress_postal_code,
                    Emergency_prefix: data.Emergency_prefix,
                    Emergency_is_prefix: data.Emergency_is_prefix,
                    Emergency_name: data.Emergency_name,
                    Emergency_surname: data.Emergency_surname,
                    Emergency_phone_number: data.Emergency_phone_number,
                    Emergency_email: data.Emergency_email,
                    Emergency_Relevance: data.Emergency_Relevance,
                    Emergency_house_number: data.Emergency_house_number,
                    Emergency_alley: data.Emergency_alley,
                    Emergency_village_number: data.Emergency_village_number,
                    Emergency_village: data.Emergency_village,
                    Emergency_road: data.Emergency_road,
                    Emergency_building: data.Emergency_building,
                    Emergency_province: data.Emergency_province,
                    Emergency_district: data.Emergency_district,
                    Emergency_sup_district: data.Emergency_district,
                    Emergency_postal_code: data.Emergency_postal_code,
                    Treatment_treatment_rights: data.Treatment_treatment_rights,
                    Treatment_intolerance: data.Treatment_intolerance,
                    username: data.Profile_phone_number,
                    password: '12345678',
                }
            }
        });
        const findUser = async (Profile_phone_number) => {
            const find = await patientModel.findOne({ 'username': Profile_phone_number }).lean();
            if (!find) { console.log(`NOT find`) }
            else { console.log(`find`) }
        };
        for (let index = 0; index < mapData.length; index++) {
            const element = mapData[index];
            await new Promise(resolve => setTimeout(resolve, 500));
            await findUser(element.Profile_phone_number)
        }
        res.status(200).send(mapData).end();
    }
);
