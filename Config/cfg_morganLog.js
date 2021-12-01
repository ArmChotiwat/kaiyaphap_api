const morganLogLevel = () => {
    const { Runtime_Type } = require('./cfg_runTime');
    if (Runtime_Type === 'Development') {
        return 'dev';
    }
    else if (Runtime_Type === 'Production') {
        if (process.env.MORGANLOG) {
            return process.env.MORGANLOG;
        }
        else {
            return '|Time|:date[iso]|UserAgent|:user-agent|HTTPv|:http-version|Method|:method|Refer|:referrer|RemoteAddr|:remote-addr|RemoteUser|:remote-user|ReqXFwdFor|:req[x-forwarded-for]|ResTimeMS|:response-time[0]|TotalTimeMS|:total-time[0]|ReqAuthorization|:req[Authorization]|URL|:url|ResStatusCode|:status|';
        }
    }
    else {
        throw new Error(`cfg_runTime.js Is not Set`);
    }
};

module.exports = morganLogLevel();
