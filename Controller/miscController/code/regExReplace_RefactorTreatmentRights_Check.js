/**
 * 
 * เป็นฟังก์ชั้น สำหรับตรวจข้อมูล ของ การบันทึก Template สิทธิการรักษา ใหม่ (Imd)
 * 
 * โดยการตรวจข้อความที่ไม่ได้ใช้  ***หากตรวจพบ***  ถือว่า <ผิดปกติ>
 * 
 ** หากตรวจพบความ <ไม่ผิดปกติ> = true
 ** หากตรวจพบว่ามีความ <ผิดปกติ> = false
 * 
 */
const regExReplace_RefactorTreatmentRights_Check = (stringdata = new String('')) => {

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
    const escape_whitespace = '[\s]'; // เว้นวรรค
    const prepare_regex = `${numberic}|${alphabet_eng_big}|${alphabet_eng_small}|${alphabet_thai}|${vowel_thai}|${escape_bracket}|${escape_comma}|${escape_dot}|${escape_whitespace}|${escape_slash}|${escape_percent}`;
    stringdata = stringdata.match(new RegExp(`(?!${prepare_regex}).`,'g'));

    if(!stringdata) { return true; }
    else { return false; }
};


/**
 * 
 * เป็นฟังก์ชั้น สำหรับตรวจข้อมูล ของ การบันทึก Template สิทธิการรักษา ใหม่ (Imd)
 * 
 * โดยการตรวจข้อความที่เกี่ยวข้องกับวงเล็บ  ***หากตรวจพบ***  ถือว่า <ผิดปกติ>
 * 
 ** หากตรวจพบความ <ไม่ผิดปกติ> = true
 ** หากตรวจพบว่ามีความ <ผิดปกติ> = false
 * 
 */
const regExReplace_RefactorTreatmentRights_Check_Bracket = (stringdata = new String('')) => {

    const numberic = '[0123456789]';
    const numberic_bracket = `\(${numberic}|${numberic}\)`;

    const alphabet_thai = '[\u0e01-\u0e2e]'; // พยัญชนะไทย
    const alphabet_thai_bracket = `\(${alphabet_thai}|${alphabet_thai}\)`;

    const vowel_thai = '[\u0e2f|\u0e30-\u0e39|\u0e40-\u0e4c]'; // สระไทย
    const vowel_thai_bracket = `\(${vowel_thai}|${vowel_thai}\)`;

    const alphabet_eng_bracket = `\([a-z|A-Z]|[a-z|A-Z]\)`

    const whitespace_bracket = `\(\s+|\s+\)|\(\)`;
    
    const prepare_regex = `${numberic_bracket}|${whitespace_bracket}|${alphabet_eng_bracket}|${vowel_thai_bracket}|${alphabet_thai_bracket}`; // วงเล็บ

    stringdata = stringdata.match(new RegExp(`${prepare_regex}`,'g'));
    if(!stringdata) { return true; }
    else { return false; }
};

module.exports = { 
    regExReplace_RefactorTreatmentRights_Check,
    regExReplace_RefactorTreatmentRights_Check_Bracket
};