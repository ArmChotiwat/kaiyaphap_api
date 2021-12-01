const regExReplace_RefactorProductName = (stringdata = new String('')) => {

    //#region เลือกข้อความที่ต้องการ
    const regExReplace_RefactorProductName_Before = require('./regExReplace_RefactorProductName_Before');
    stringdata = regExReplace_RefactorProductName_Before(stringdata);
    //#endregion เลือกข้อความที่ต้องการ

    //#region จัด WhiteSpace 
    const regExReplace_RefactorProductName_WhiteSpace = require('./regExReplace_RefactorProductName_WhiteSpace');
    stringdata = regExReplace_RefactorProductName_WhiteSpace(stringdata);
    //#endregion จัด WhiteSpace 
    
    //#region จัด Bracket
    const regExReplace_RefactorProductName_Bracket = require('./regExReplace_RefactorProductName_Bracket');
    stringdata = regExReplace_RefactorProductName_Bracket(stringdata);
    //#endregion จัด Bracket

    //#region จัด Dot
    const regExReplace_RefactorProductName_Dot = require('./regExReplace_RefactorProductName_Dot');
    stringdata = regExReplace_RefactorProductName_Dot(stringdata);
    //#endregion จัด Dot

    //#region จัด Comma
    const regExReplace_RefactorProductName_Comma = require('./regExReplace_RefactorProductName_Comma');
    stringdata = regExReplace_RefactorProductName_Comma(stringdata);
    //#endregion จัด Comma

    //#region จัด Slash
    const regExReplace_RefactorProductName_Slash = require('./regExReplace_RefactorProductName_Slash');
    stringdata = regExReplace_RefactorProductName_Slash(stringdata);
    //#endregion จัด Slash

    return stringdata;
};

module.exports = regExReplace_RefactorProductName;