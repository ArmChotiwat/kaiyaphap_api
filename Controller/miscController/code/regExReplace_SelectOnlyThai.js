/**
 * Function => regExReplace_SelectOnlyThai
 * 
 * Param => stringdata (String)
 * 
 * Return => (String)
 * 
 ** พยัญชนะไทย (Thai Alphabet)
 ** สระไทย (Thai Vowel)
 ** เว้นวรรค (WhiteSpace) 
 */
const regExReplace_SelectOnlyThai = (stringdata = String('')) => {
    const alphabet_thai = '[\u0e01-\u0e2e]'; // พยัญชนะไทย
    const vowel_thai = '[\u0e2f|\u0e30-\u0e39|\u0e40-\u0e4c]'; // สระไทย
    const escape_whitespace = '[\s]'; // เว้นวรรค
    const prepare_regex = `${escape_whitespace}|${alphabet_thai}|${vowel_thai}`;
    const RegEx_Final = RegExp(`(?!${prepare_regex}).`,'g');
    stringdata = stringdata.replace(RegEx_Final, '');
    return stringdata;
};

module.exports = regExReplace_SelectOnlyThai;