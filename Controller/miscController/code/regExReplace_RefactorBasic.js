/**
 * Function => regExReplace_RefactorBasic
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
 ** Hifen - 
 */
const regExReplace_RefactorBasic = (stringdata = new String('')) => {
   stringdata = stringdata.replace(new RegExp(/[^0-9|A-Z|a-z|ก-ฮ|ะ-ุ|เ-์||\(|\)|\,|\.|\/|\s|\-]/g),'');

    return stringdata;
};

module.exports = regExReplace_RefactorBasic;

