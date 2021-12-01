const zeroFill = (data = { incmentNumber: 0, widthZero: 4 }, callback = (err = new Error) => {} ) => {
    if(typeof data != 'object') { callback(new Error(`zeroFill: <data> must be Object`)); return; }
    else if(typeof data.incmentNumber != 'number') { callback(new Error(`zeroFill: <data.incmentNumber> must be Number`)); return; }
    else if(typeof data.widthZero != 'number') { callback(new Error(`zeroFill: <data.widthZero> must be Number`)); return; }
    else {
        const incmentNumber = Math.ceil(Math.abs(data.incmentNumber));
        const widthZero = Math.ceil(Math.abs(data.widthZero));

        const resultZerofill = incmentNumber.toString().padStart(widthZero, '0');

        callback(null);
        return resultZerofill
    }
};

module.exports = zeroFill;