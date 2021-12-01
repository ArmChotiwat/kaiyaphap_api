const mapProduct_BooleanAndNull = (dataName = '', dataInput = false) => {
    if (typeof dataName != 'string' || dataName == '' || dataName == null) {
        throw new Error(`mapProduct_StringAndNull: ${dataName}: must be String and Not Empty`);
    }
    else {
        if (typeof dataInput == 'boolean') {
            return dataInput;
        }
        else {
            throw new Error(`${dataName}: must be Boolean`);
        }
    }
};
module.exports = mapProduct_BooleanAndNull;