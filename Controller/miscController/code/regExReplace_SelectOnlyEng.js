/**
 * Function => regExReplace_SelectOnlyEng
 * 
 * Param => stringdata (String)
 * 
 * Return => (String)
 * 
 ** พยัญชนะอังกฤษ พิมพ์ใหญ่ (English Big Alphabet)
 ** พยัญชนะอังกฤษ พิมพ์เล็ก (English Small Alphabet)
 ** เว้นวรรค (WhiteSpace) 
 */
const regExReplace_SelectOnlyEng = (stringdata = new String('')) => {
    const alphabet_eng_big = '[A-Z]'; // พยัญชนะอังกฤษ พิมพ์ใหญ่
    const alphabet_eng_small = '[a-z]'; // พยัญชนะอังกฤษ พิมพ์เล็ก
    const escape_whitespace = '[ ]'; // เว้นวรรค
    const prepare_regex = `${escape_whitespace}|${alphabet_eng_big}|${alphabet_eng_small}`;
    stringdata = stringdata.replace(new RegExp(`(?!${prepare_regex}).`,'g'), '');
    return stringdata;
};

module.exports = regExReplace_SelectOnlyEng;