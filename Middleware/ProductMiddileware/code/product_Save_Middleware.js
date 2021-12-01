
const product_Save_Middleware = (req, res, next) => {
    const { validate_StringObjectId_NotNull } = require('../../../Controller/miscController');
    try {
        const payload = req.body;

        let ErrorJson = {
            http_code: 400,
            document_code: 40020011101, // 400 Response/Bad Request, 200 GET, 111 GET/Masterdatatemplate, 001 Instruction 1 
            description: []
        };

        // ##### Future Feature By Nong Arm
        // const regExMatch_RefactorProductName = (stringdata = new String('')) => {
        //     const numberic = '[0123456789]';
        //     const alphabet_eng_big = '[A-Z]'; // พยัญชนะ A ถึง Z (ตัวพิมพ์ใหญ่)
        //     const alphabet_eng_small = '[a-z]'; // พยัญชนะ a ถึง z (ตัวพิมพ์เล็ก)
        //     const alphabet_thai = '[\u0e01-\u0e2e]'; // พยัญชนะไทย
        //     const vowel_thai = '[\u0e2f|\u0e30-\u0e39|\u0e40-\u0e4c]'; // สระไทย
        //     const escape_bracket = '[\(|\)]'; // วงเล็บ
        //     const escape_comma = '[\,]'; // ลูกน้ำ
        //     const escape_dot = '[\.]'; // จุด
        //     const escape_slash = '[\/]'; // ทับ
        //     const escape_whitespace = '[ ]'; // เว้นวรรค
        //     const prepare_regex = `${numberic}|${alphabet_eng_big}|${alphabet_eng_small}|${alphabet_thai}|${vowel_thai}|${escape_bracket}|${escape_comma}|${escape_dot}|${escape_whitespace}|${escape_slash}`;
        //     stringdata = stringdata.match(`(?!${prepare_regex}).`, 'g'); // ไม่เอาที่กล่าวมาข้างต้น 
        //     let cleanName = stringdata;

        //     if (cleanName !== null) {
        //         ErrorJson.description.push(`productMiddileware <product_name> must be string 0-9, A-Z, a-z, thailanguage, [ (), (/), (.), (.)]  <err = ${cleanName}>`);
        //         cleanName = null;
        //     }

        //     cleanName = payload.product_name.match(/\s+\s/g);
        //     if (cleanName !== null) {
        //         ErrorJson.description.push(`productMiddileware <product_name> not double Whitespace  <err = ${cleanName}>`);
        //         cleanName = null;
        //     }

        //     cleanName = payload.product_name.match(/^\s+|\s+$/g);
        //     if (cleanName !== null) {
        //         ErrorJson.description.push(`productMiddileware <product_name> not Whitespace font word and back word  <err = ${cleanName}>`);
        //         cleanName = null;
        //     }

        //     cleanName = payload.product_name.match(/\( +/g);
        //     if (cleanName !== null) {
        //         ErrorJson.description.push(`productMiddileware <product_name> not Whitespace font word and back word in Bracket  <err = ${cleanName}>`);
        //         cleanName = null;
        //     }

        //     cleanName = payload.product_name.match(/ +\)/g);
        //     if (cleanName !== null) {
        //         ErrorJson.description.push(`productMiddileware <product_name> not Whitespace font word and back word in Bracket  <err = ${cleanName}>`);
        //         cleanName = null;
        //     }

        //     cleanName = payload.product_name.match(/ +\./g); // Clear Whitespace if Detect .
        //     if (cleanName !== null) {
        //         ErrorJson.description.push(`productMiddileware <product_name> not Whitespace font Pont  <err = ${cleanName}>`);
        //         cleanName = null;
        //     }

        //     cleanName = payload.product_name.match(/\. +/g); // Clear Whitespace if Detect .
        //     if (cleanName !== null) {
        //         ErrorJson.description.push(`productMiddileware <product_name> back Pont plese one Whitespace  <err = ${cleanName}>`);
        //         cleanName = null;
        //     }

        //     cleanName = payload.product_name.match(/ +\,/g); // Refactor Whitespace if Detect ,
        //     if (cleanName !== null) {
        //         ErrorJson.description.push(`productMiddileware <product_name> not Whitespace font Comma  <err = ${cleanName}>`);
        //         cleanName = null;
        //     }

        //     cleanName = payload.product_name.match(/\, +/g); // Refactor Whitespace if Detect ,
        //     if (cleanName !== null) {
        //         ErrorJson.description.push(`productMiddileware <product_name> back Comma plese one Whitespace  <err = ${cleanName}>`);
        //         cleanName = null;
        //     }

        //     cleanName = payload.product_name.match(/ +\//g); // Clear Whitespace if Detect /
        //     if (cleanName !== null) {
        //         ErrorJson.description.push(`productMiddileware <product_name> not Whitespace font Slash  <err = ${cleanName}>`);
        //         cleanName = null;
        //     }

        //     cleanName = payload.product_name.match(/\/ +/g); // Clear Whitespace if Detect /
        //     if (cleanName !== null) {
        //         ErrorJson.description.push(`productMiddileware <product_name> back Slash plese not Whitespace  <err = ${cleanName}>`);
        //         cleanName = null;
        //     }
        //     if (ErrorJson.description.length != 0) {
        //         return ErrorJson;
        //     } else {
        //         return null;
        //     }

        // };

        if (typeof payload._storeid != 'string' || payload._storeid == '' || !validate_StringObjectId_NotNull(payload._storeid)) {
            ErrorJson.description.push(`productMiddileware <_storeid> mest be ObjectId String and Not Empty`);
        }
        // #### No longer used _agentid due Switct to used _agentid in JWT Token
        // if (typeof payload._agentid != 'string' || payload._agentid == '' || !validate_StringObjectId_NotNull(payload._agentid)) {
        //     ErrorJson.description.push(`productMiddileware <_agentid> mest be ObjectId String and Not Empty`);
        // }
        if (typeof payload.product_name != 'string' || payload.product_name == '') {
            ErrorJson.description.push(`productMiddileware <product_name> must be String and Not Empty and Not Null`);
        }
        // #### Future Feature By Nong Arm
        // if (typeof payload.product_validation != 'boolean') {
        //     ErrorJson.description.push(`productMiddileware <product_validation> must be boolean and Not Empty and Not null `);
        // }
        // #### Future Feature By Nong Arm
        // if (payload.product_validation == true) {
        //     regExMatch_RefactorProductName(payload.product_name);
        // }
        if (payload.product_serial !== null) {
            if (typeof payload.product_serial != 'string') {
                ErrorJson.description.push(`productMiddileware <product_serial> must be String or Null and Not Empty`);
            } else if (payload.product_serial == '') {
                ErrorJson.description.push(`productMiddileware <product_serial> must be String or Null and Not Empty`);
            } else {
                // if (payload.product_validation == true) {
                //     cleanName = payload.product_serial.match(/[^A-|0-9|\-]/g);
                //     if (cleanName !== null) {
                //         ErrorJson.description.push(`productMiddileware <product_serial> must be [ A-Z ] [ 0123456789 ] [ - ] <err = ${cleanName}>`);
                //     }
                // }
            }
        }
        if (payload.product_category !== null) {
            if (typeof payload.product_category != 'string') {
                ErrorJson.description.push(`productMiddileware <product_category> String or Null and Not Empty`);

            } else if (payload.product_category == '') {
                ErrorJson.description.push(`productMiddileware <product_category> String or Null and Not Empty`);
            } else {
                // #### Future Feature By Nong Arm
                // if (payload.product_validation == true) {
                //     cleanName = payload.product_category.match(/[^A-Z|a-z|ก-ฮ|ะ-ุ|เ-์|\/]/g);
                //     if (cleanName !== null) {
                //         ErrorJson.description.push(`productMiddileware <product_category> must be [ Thailanguage and Englanguage] [ / ] <err = ${cleanName}>`);
                //     }
                // }
            }
        }
        if (payload.product_brand !== null) {
            if (typeof payload.product_brand != 'string') {
                ErrorJson.description.push(`productMiddileware <product_brand> String or Null and Not Empty`);

            } else if (payload.product_brand == '') {
                ErrorJson.description.push(`productMiddileware <product_brand> String or Null and Not Empty`);
            } else {
                // #### Future Feature By Nong Arm
                // if (payload.product_validation == true) {
                //     cleanName = payload.product_brand.match(/[^A-Z|ก-ฮ|ะ-ุ|เ-์|a-z]/g);
                //     if (cleanName !== null) {
                //         ErrorJson.description.push(`productMiddileware <product_brand> must be [ Thailanguage and Englanguage]  <err = ${cleanName}>`);
                //     }
                // }
            }
        }
        if (payload.product_main_version !== null) {
            if (typeof payload.product_main_version != 'string') {
                ErrorJson.description.push(`productMiddileware <product_main_version> String or Null and Not Empty`);

            } else if (payload.product_main_version == '') {
                ErrorJson.description.push(`productMiddileware <product_main_version> String or Null and Not Empty`);
            } else {
                // #### Future Feature By Nong Arm
                // if (payload.product_validation == true) {
                //     cleanName = payload.product_main_version.match(/[^A-Z|a-z|\/|\.|\-|0-9]/g);
                //     if (cleanName !== null) {
                //         ErrorJson.description.push(`productMiddileware <product_main_version> must be [ Englanguage ] [ 0-9 ] [ / ] [ . ] [ - ]  <err = ${cleanName}>`);
                //     }
                // }
            }
        }
        if (payload.product_sub_version !== null) {
            if (typeof payload.product_sub_version != 'string') {
                ErrorJson.description.push(`productMiddileware <product_sub_version> String or Null and Not Empty`);

            } else if (payload.product_sub_version == '') {
                ErrorJson.description.push(`productMiddileware <product_sub_version> String or Null and Not Empty`);
            } else {
                // #### Future Feature By Nong Arm
                // if (payload.product_validation == true) {
                //     cleanName = payload.product_sub_version.match(/[^0-9|\.|\-]/g);
                //     if (cleanName !== null) {
                //         ErrorJson.description.push(`productMiddileware <product_sub_version> must be [ 0-9 ] [ . ] <err = ${cleanName}>`);
                //     }
                // }
            }
        }
        if (payload._ref_product_groupid !== null) {
            if (!validate_StringObjectId_NotNull(payload._ref_product_groupid)) {
                ErrorJson.description.push(`Parameter <_ref_product_groupid> mest be ObjectId String and Not Empty`);
            }
        }
        if (ErrorJson.description.length != 0) {
            res.status(400).json(ErrorJson).end();
        } else {
            next();
        }

    } catch (error) {
        console.error(error);
        ErrorJson.description.push(`Other Error`);
        res.status(422).json(ErrorJson).end();
    }
};
module.exports = product_Save_Middleware;