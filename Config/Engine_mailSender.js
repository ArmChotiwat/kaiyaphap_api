const Engine_mailSender = () => {
    const nodemailer = require('nodemailer');

    const cfg_MailServer = require('./cfg_mailSender');

    const no_reply_server = cfg_MailServer.no_reply_Email_Server;
    const no_reply_email = cfg_MailServer.no_reply_Email_Account;
    const no_reply_password = cfg_MailServer.no_reply_Email_Password;

    return nodemailer.createTransport({
        host: no_reply_server,
        port: 587,
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: no_reply_email, // your email
          pass: no_reply_password // your email password
        }
    });
};

module.exports = Engine_mailSender();