const ObjectId = require("../../mongodbController").mongoose.Types.ObjectId;
const checkObjectId = require("../../mongodbController").checkObjectId;
const logCustomerLoginModel = require("../../mongodbController").logCustomerLoginModel;

const logCustomerLoginController = {
    save: async (
        loginData = {
            _agentid = new String(''),
            _storeid = new String(''),
            _branchid = new String(''),
            jwtToken = new String(''),
            username = new String(''),
        }, 
        callback = (err = new Error()) => {}) => {
        try {
            if( typeof loginData != 'object') { callback(new Error('logCustomerLoginController => save: loginData is not object')); return; }
            else if(typeof loginData._agentid != 'string' || loginData._agentid == '') { callback(new Error('logCustomerLoginController => save: loginData._agentid is not string or is empty')); return; }
            else if(typeof loginData._storeid != 'string' || loginData._storeid == '') { callback(new Error('logCustomerLoginController => save: loginData._storeid is not string or is empty')); return; }
            else if(typeof loginData._branchid != 'string' || loginData._branchid == '') { callback(new Error('logCustomerLoginController => save: loginData._branchid is not string or is empty')); return; }
            else if(typeof loginData.jwtToken != 'string' || loginData.jwtToken == '') { callback(new Error('logCustomerLoginController => save: loginData.jwtToken is not string or is empty')); return; }
            else if(typeof loginData.username != 'string' || loginData.username == '') { callback(new Error('logCustomerLoginController => save: loginData.username is not string or is empty')); return; }
            else {
                const _agentid = await checkObjectId(loginData._agentid, (err) => { if(err) { callback(new Error('logCustomerLoginController => save: loginData._agentid convert to ObjectId Failed')); return; } } );
                const _storeid = await checkObjectId(loginData._storeid, (err) => { if(err) { callback(new Error('logCustomerLoginController => save: loginData._storeid convert to ObjectId Failed')); return; } } );
                const _branchid = await checkObjectId(loginData._branchid, (err) => { if(err) { callback(new Error('logCustomerLoginController => save: loginData._branchid convert to ObjectId Failed')); return; } } );
                const jwtToken = loginData.jwtToken;
                const username = loginData.username;
            }

        } catch (error) {
            callback(error);
            return;
        }
    },
};