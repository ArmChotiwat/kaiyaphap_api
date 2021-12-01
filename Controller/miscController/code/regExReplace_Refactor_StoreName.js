/** MiscController Refactor: สำหรับ Format ชื่อร้านให้ตรงตามกำหนด */
const regExReplace_Refactor_StoreName = (stringdata = '') => {
    const regExReplace_ClearWhiteSpaceStartEnd = require('./regExReplace_ClearWhiteSpaceStartEnd');
    const regExReplace_OnlyOneWhiteSpace = require('./regExReplace_OnlyOneWhiteSpace');

    const Alphabet_Thai = '[\u0e01-\u0e2e]'; // พยัญชนะไทย
    const Vowel_Thai = '[\u0e2f|\u0e30-\u0e39|\u0e40-\u0e4c]'; // สระไทย
    const Escape_Whitespace = '[\s]'; // เว้นวรรค
    const Number_Arabic = '[0-9]'; // Number Arabic
    const Alphabet_Eng = '[a-z|A-Z]'; // English Alphabet
    
    const prepare_regex = `${Escape_Whitespace}|${Alphabet_Thai}|${Vowel_Thai}|${Number_Arabic}|${Alphabet_Eng}`;
    const RegEx_Final = RegExp(`(?!${prepare_regex}).`,'g');

    return regExReplace_OnlyOneWhiteSpace(regExReplace_ClearWhiteSpaceStartEnd(stringdata.replace(RegEx_Final, '')));
};

module.exports = regExReplace_Refactor_StoreName;