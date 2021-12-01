const CorsFilter = () => {
    const corsOrigin = require('./cfg_corsOrigin');

    const whiteList = corsOrigin.split(',');

    if (whiteList.length > 1) {
        return function (origin, callback) {
            // allow requests with no origin 
            // if (!origin) return callback(null, true);

            // not allow requests with no origin 
            if (!origin) {
                return callback(null, false);
            }

            // Not Allow CORS URL FROM Request, When Not Exists In Cors
            if (whiteList.indexOf(origin) === -1) {
                // const message = 'The CORS policy for this origin doesnt allow access from the particular origin.';
                // return callback(new Error(message), false);

                return callback(null, false);
            }
            else {
                return callback(null, true);
            }
        }
    }
    else {
        return whiteList[0];
    }
};


const corsOrigin_Engine = () => {
    const cors = require('cors');
    const CorsPlugin = CorsFilter();
    return cors({ origin: CorsPlugin });
}


module.exports = corsOrigin_Engine();