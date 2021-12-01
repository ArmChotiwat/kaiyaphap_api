const jwtDecodeData = (authorizationHeader = new String('')) => {
    if(typeof authorizationHeader != 'string') { return; }
    else {
        try {
            const jwt = require("jwt-simple");
            const { JWT_SECRET } = require('../../../Config/cfg_crypto');
            const payloadToken = jwt.decode(authorizationHeader, JWT_SECRET);
            const mapData = {
                _agentid: String(payloadToken._agentid),
                username: (!payloadToken.username) ? String(payloadToken.sub):String(payloadToken.username),
            };
            return mapData;
        } catch (error) {
            console.error(error);
            return;
        }
    }
};

module.exports = jwtDecodeData;