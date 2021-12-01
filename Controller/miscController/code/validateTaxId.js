const validateTaxId = (
    data = {
        stringTaxid: new String(''),
        returnType : (data.returnType == Boolean) ? Boolean : String,
    },
    callback = (err = new Error) => {}
) => {
    try {
        if(typeof data.stringTaxid != 'string') { throw new Error(`validateTaxId: data.stringTaxid must be String`); }
        if(!data.returnType === Boolean || !data.returnType === String) { throw new Error(`validateTaxId: data.returnType must be String Or Boolean`); }
        else {
            const oldString = data.stringTaxid;
            const taxId_With_NumberAndDash = oldString.replace(new RegExp('[^-0123456789]', 'ig'), '');
            const taxId_NumberOnly = oldString.replace(new RegExp('[^0123456789]', 'ig'), '');
            if(data.returnType === Boolean) {
                if(taxId_With_NumberAndDash.length != 17 && taxId_NumberOnly != 13) { callback(null); return false; }
                else { 
                    for (let index = 0; index < taxId_With_NumberAndDash.split('').length; index++) {
                        const element = taxId_With_NumberAndDash.split('')[index];
                        if(index === 1 || index === 6 || index === 12 || index === 15) { // Dash Cehck
                            if(element === '-') { continue; }
                            else { throw new Error(`validateTaxId: data.stringTaxid[${index}] => "${element}" must be String Dash => "-" `); }
                        }
                        else { // Number Check
                            if(!isNaN(element)) { continue; }
                            else { throw new Error(`validateTaxId: data.stringTaxid[${index}] => "${element}" must be String Dash => "-" `); }
                        }
                    }
                    callback(null); 
                    return true; 
                }
            }
            else if (data.returnType === String) {
                if(taxId_With_NumberAndDash.length != 17 && taxId_NumberOnly != 13) { throw new Error(`validateTaxId: data.stringTaxid is Not Valid`); }
                else {
                    for (let index = 0; index < taxId_With_NumberAndDash.split('').length; index++) {
                        const element = taxId_With_NumberAndDash.split('')[index];
                        if(index === 1 || index === 6 || index === 12 || index === 15) { // Dash Cehck
                            if(element === '-') { continue; }
                            else { throw new Error(`validateTaxId: data.stringTaxid[${index}] => "${element}" must be String Dash => "-" `); }
                        }
                        else { // Number Check
                            if(!isNaN(element)) { continue; }
                            else { throw new Error(`validateTaxId: data.stringTaxid[${index}] => "${element}" must be String Dash => "-" `); }
                        }
                    }
                    callback(null);
                    return { taxId_With_NumberAndDash, taxId_NumberOnly };
                }
            }
            else { throw new Error(`validateTaxId: data.returnType must be String Or Boolean`); }
        }
    } catch (error) {
        callback(error);
        return;
    }
};

module.exports = validateTaxId;