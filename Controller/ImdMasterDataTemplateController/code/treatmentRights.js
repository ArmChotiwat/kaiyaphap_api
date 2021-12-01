/**
 * 
 * Controller สำหรับ สร้าง Template ของสิทธิ์การรักษา (ใช้กับ Imd)
 * 
 */
const treatmentRights_Save_Controller = async (
    data = {
        name: new String(''),
        _agentid: new String(''),
        refactor_name: false
    },
    callback = (err = new Error) => { }
) => {
    const miscController = require('../../miscController');
    const regExReplace = miscController.regExReplace;
    const regExReplace_RefactorTreatmentRights = miscController.regExReplace_RefactorTreatmentRights;

    if (typeof data != 'object') {
        callback(new Error(`treatmentRights_Save_Controller: data must be Object`));
        return;
    }
    else if(typeof data.name != 'string' || data.name == '') {
        callback(new Error(`treatmentRights_Save_Controller: data.name must be String and Not Empty`));
        return;
    }
    else if(typeof data.refactor_name != 'boolean') {
        callback(new Error(`treatmentRights_Save_Controller: data.refactor_name must be Boolean`));
        return;
    }
    else {
        if (!data.refactor_name) {
            if(!regExReplace_RefactorTreatmentRights.RefactorTreatmentRights_Check.Check(data.name)) {
                callback(new Error(`treatmentRights_Save_Controller: data.name have not Valid of text input`));
                return;
            }
        }
        else {
            // data.name = regExReplace_RefactorTreatmentRights.RefactorTreatmentRights(data.name)
            if (typeof data.name != 'string' || data.name == '') {
                callback(new Error(`treatmentRights_Save_Controller: data.name must be String and Not Empty`));
                return;
            }
            else {
                if (regExReplace.regEx_ClearWhiteSpace(data.name) == '') {
                    callback(new Error(`treatmentRights_Save_Controller: data.name must be String and Not Empty`));
                    return;
                }
            }
        }
    }


    const _storeid = await miscController.checkObjectId('5ea003d688b7265b04296e2c', (err) => { if (err) { callback(err); return; } });
    const _branchid = await miscController.checkObjectId('5ea003d688b7265b04296e2c', (err) => { if (err) { callback(err); return; } });
    const _agentid = await miscController.checkObjectId(data._agentid.toString(), (err) => { if (err) { callback(err); return; } });

    const chkAgentId = await miscController.checkAgentId(
        {
            _storeid: _storeid.toString(),
            _branchid: _branchid.toString(),
            _agentid: _agentid.toString()
        },
        (err) => { if (err) { callback(err); return; } }
    );
    if (!chkAgentId) { callback(new Error(`treatmentRights_Save_Controller: chkAgentId Failed`)); return; }
    else {
        const moment = require('moment');

        const create_date = moment();
        const create_date_string = create_date.format('YYYY-MM-DD');
        const create_time_string = create_date.format('HH:mm:ss');

        const modify_date = create_date;
        const modify_date_string = create_date.format('YYYY-MM-DD');
        const modify_time_string = create_date.format('HH:mm:ss');


        const mapData = {
            name: data.name,

            create_date: create_date,
            create_date_string: create_date_string,
            create_time_string: create_time_string,
            _ref_agent_userid_create: chkAgentId._agentid,
            _ref_agent_userstoreid_create: chkAgentId._agentid,

            modify_date: modify_date,
            modify_date_string: modify_date_string,
            modify_time_string: modify_time_string,
            _ref_agent_userid_modify: chkAgentId._agentid,
            _ref_agent_userstoreid_modify: chkAgentId._agentid,

            isused: true,
        };

        const tempTreatmentRightsModel = require('../../mongodbController').tempTreatmentRightsModel;
        const transactionSave = new tempTreatmentRightsModel(mapData);
        const saveResult = await transactionSave.save().then( Result => (Result) ).catch( err => { if(err) { callback(err); return; }  } );
        if(!saveResult) { return; }
        else {
            return saveResult;
        }
    }

};


module.exports = {
    treatmentRights_Save_Controller,
};