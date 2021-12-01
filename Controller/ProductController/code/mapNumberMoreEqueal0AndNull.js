const mapST3OG_NumberMoreEqueal0AndNull = (dataName = '', dataInput = -1) => {
    if (typeof dataName != 'string' || dataName == '' || dataName == null) {
        throw new Error(`NumberMoreEqueal0AndNull: ${dataName}: must be String and Not Empty`);
    }
    else {
        if (dataInput === null) { return null; }
        else if (typeof dataInput == 'number') {
            if (dataInput < 0) { throw new Error(`${dataName}: must be Number must Over Or Equeal 0`); }
            else { return Number(dataInput); }
        }
        else {
            throw new Error(`${dataName}: must be Number/Null`);
        }
    }
};
module.exports = mapST3OG_NumberMoreEqueal0AndNull;