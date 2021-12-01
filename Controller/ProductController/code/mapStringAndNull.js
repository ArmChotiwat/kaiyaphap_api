const mapProduct_StringAndNull = (dataName = '', dataInput = '') => {
    if (typeof dataName != 'string' || dataName == '' || dataName == null) {
        throw new Error(`mapProduct_StringAndNull: ${dataName}: must be String and Not Empty`);
    }
    else {
        if (dataInput === null) { return null; }
        else if (typeof dataInput == 'string') {
            if (dataInput == '') { return null; }
            else { return String(dataInput).toString(); }
        }
        else {
            throw new Error(`${dataName}: must be String/Null`);
        }
    }
};
module.exports = mapProduct_StringAndNull;