/**
 * Function => regExReplace_RefactorProductName_Before
 * 
 * Param => stringdata (String)
 * 
 * Return => (String)
 * 
 ** พยัญชนะ A ถึง Z (ตัวพิมพ์ใหญ่ Big English Alphabet)
 ** พยัญชนะ a ถึง z (ตัวพิมพ์เล็ก Smell Englist Alphabet)
 ** พยัญชนะไทย (Thai Alphabet)
 ** สระไทย (Thai Vowel)
 ** วงเล็บ ()
 ** ลูกน้ำ (Comma) ,
 ** จุด (Dot) .
 ** ทับ (Slash) /
 ** เว้นวรรค (WhiteSpace) 
 */
const regExReplace_RefactorProductName_Before = (stringdata = new String('')) => {
    const numberic = '[0123456789]';
    const alphabet_eng_big = '[A-Z]'; // พยัญชนะ A ถึง Z (ตัวพิมพ์ใหญ่)
    const alphabet_eng_small = '[a-z]'; // พยัญชนะ a ถึง z (ตัวพิมพ์เล็ก)
    const alphabet_thai = '[\u0e01-\u0e2e]'; // พยัญชนะไทย
    const vowel_thai = '[\u0e2f|\u0e30-\u0e39|\u0e40-\u0e4c]'; // สระไทย
    const escape_bracket = '[\(|\)]'; // วงเล็บ
    const escape_comma = '[\,]'; // ลูกน้ำ
    const escape_dot = '[\.]'; // จุด
    const escape_slash = '[\/]'; // ทับ
    const escape_whitespace = '[ ]'; // เว้นวรรค
    const prepare_regex = `${numberic}|${alphabet_eng_big}|${alphabet_eng_small}|${alphabet_thai}|${vowel_thai}|${escape_bracket}|${escape_comma}|${escape_dot}|${escape_whitespace}|${escape_slash}`;
    stringdata = stringdata.replace(new RegExp(`(?!${prepare_regex}).`,'g'), '');
    return stringdata;
};

module.exports = regExReplace_RefactorProductName_Before;