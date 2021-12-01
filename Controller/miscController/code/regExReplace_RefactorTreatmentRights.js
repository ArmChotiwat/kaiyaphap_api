/**
 * Function => regExReplace_RefactorTreatmentRights
 * 
 * สำหรับ Refactor ชื่อสิทธิ์การรักษา (TreatmentRights - Name)
 */
const regExReplace_RefactorTreatmentRights = (stringdata = new String('')) => {

    // Clear unwanted String
    const numberic = '[0123456789]';
    const alphabet_eng_big = '[A-Z]'; // พยัญชนะ A ถึง Z (ตัวพิมพ์ใหญ่)
    const alphabet_eng_small = '[a-z]'; // พยัญชนะ a ถึง z (ตัวพิมพ์เล็ก)
    const alphabet_thai = '[\u0e01-\u0e2e]'; // พยัญชนะไทย
    const vowel_thai = '[\u0e2f|\u0e30-\u0e39|\u0e40-\u0e4c]'; // สระไทย
    const escape_bracket = '[\(|\)]'; // วงเล็บ
    const escape_comma = '[\,]'; // ลูกน้ำ
    const escape_dot = '[\.]'; // จุด
    const escape_percent = '[\%]'; // เปอร์เซ็นต์
    const escape_slash = '[\/]'; // ทับ
    const escape_whitespace = '[ ]'; // เว้นวรรค
    const prepare_regex = `${numberic}|${alphabet_eng_big}|${alphabet_eng_small}|${alphabet_thai}|${vowel_thai}|${escape_bracket}|${escape_comma}|${escape_dot}|${escape_whitespace}|${escape_slash}|${escape_percent}`;
    stringdata = stringdata.replace(new RegExp(`(?!${prepare_regex}).`,'g'), '');

    // Bracket
    const regExReplace_Refactor_Bracket = require('./regExReplace_Refactor_Bracket');
    stringdata = regExReplace_Refactor_Bracket(stringdata);

    // Comma
    const regExReplace_Refactor_Comma = require('./regExReplace_Refactor_Comma');
    stringdata = regExReplace_Refactor_Comma(stringdata);

    // Dot
    const regExReplace_Refactor_Dot = require('./regExReplace_Refactor_Dot');
    stringdata = regExReplace_Refactor_Dot(stringdata);

    // Percent
    const regExReplace_Refactor_Percent = require('./regExReplace_Refactor_Percent');
    stringdata = regExReplace_Refactor_Percent(stringdata);

    // Slash
    const regExReplace_Refactor_Slash = require('./regExReplace_Refactor_Slash');
    stringdata = regExReplace_Refactor_Slash(stringdata);

    // WhiteSpace
    const regExReplace_Refactor_WhiteSpace = require('./regExReplace_Refactor_WhiteSpace');
    stringdata = regExReplace_Refactor_WhiteSpace(stringdata);
    
    return stringdata;

};

module.exports = regExReplace_RefactorTreatmentRights;