const no_reply_Email_Server = process.env.NOREPLYSERVER || 'mail.imd.co.th';
const no_reply_Email_Account = process.env.NOREPLYEMAIL || 'kaiyaphap@imd.co.th';
const no_reply_Email_Password = process.env.NOREPLYPASSWORD || 'rsP8KVHwzP';

module.exports = {
    no_reply_Email_Server,
    no_reply_Email_Account,
    no_reply_Email_Password,
};