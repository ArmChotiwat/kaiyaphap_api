const checkURIparams = () => {
    const hostname = process.env.DB_HOSTNAME;
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const ports = process.env.DB_PORTS;
    const database = "imd_kaiyaparp";
    const uri = process.env.MONGODB_URI;

    if(typeof uri == 'string') {
        return uri;
    }
    else if(
        typeof hostname == 'string' &&
        typeof username == 'string' && 
        typeof password == 'string' && 
        typeof ports == 'string' && 
        typeof database == 'string'
    ) {
        return `mongodb://${encodeURI(username)}:${encodeURI(password)}@${hostname}:${ports}/${database}?authSource=admin&readPreference=primary&ssl=false`;
    }
    else {
        return "mongodb://root:1qaz2wsx@192.168.12.24:27017/imd_kaiyaparp?authSource=admin&authMechanism=SCRAM-SHA-256&readPreference=primary&ssl=false";
        // return "mongodb://root:1qaz2wsx@192.168.12.24:27017/kyp_jrphysio_20201111_0909?authSource=admin&authMechanism=SCRAM-SHA-256&readPreference=primary&ssl=false";
        //return "mongodb://root:1qaz2wsx@192.168.12.24:27017/imd_kp_prod?authSource=admin&authMechanism=SCRAM-SHA-256&readPreference=primary&ssl=false";
    }
}

// const url = checkURIparams();

module.exports = checkURIparams();