const nodemailer = require('nodemailer');
const ejs = require('ejs');

const config = require('../configs/config');


//Enter valid gmail credentials
//*****Allow less secure to send mails in gmail settings*****
var transporter = nodemailer.createTransport({
  host: config.MAIL.SMTP_HOST,
  port: config.MAIL.SMTP_PORT,
  secure: config.MAIL.SECURE, // true for 465, false for other ports
  auth: { 
    user: config.MAIL.SMTP_USER, // generated ethereal user
    pass: config.MAIL.SMTP_PASS, // generated ethereal password
  },
});


const sendError = ({ error = '', message = '', lineNumber = '', type = 'error' }, p2p = null) => {
  console.log('type',type);
  
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: config.MAIL.fromMail || '', // sender address
      to: config.MAIL.toMail, // list of receivers
      cc : config.MAIL.CC || '',
      subject: 'Timeswapper error', // Subject line
      html: type == 'error' ? getEJSTemplate(error,message,lineNumber) : getEJSTemplateAlert(message),
    };
    if (p2p) {
      mailOptions['cc'] = p2p + ',' + config.MAIL.ccMail;
    }
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log('Send mail err ' + err);
        return reject({ success: false });
      } else {
        console.log('mail sent');
        // console.log('Mail send ' + info);
        // console.log(info);
        return resolve({ success: true });
      }
    });
  });
};


function getEJSTemplate(error,message,lineNumber) {
  let template =
    `<html>
      <body>
      <table border="1px" style="border-collapse: collapse">
        <thead>
          <th>Error</th>
          ${message ? `<th>Message</th>` : ''}
          ${lineNumber  ? `<th>Line Number</th>` : ''}
        </thead>
        <tr>
          <td><%= error %></td>
          ${message ? `<td>${message}</td>` : ''}
          ${lineNumber  ? `<td>${lineNumber}</td>` : ''}
        </tr>
      </table>
      </body>
    </html>`;
  
  let compiledTemplate = ejs.compile(template, {
    cache: true,
    filename: 'errorTemplate',
  });

  return compiledTemplate({ error });
}

function getEJSTemplateAlert(message) {
  let template =
    `<html>
      <body>
      <table border="1px" style="border-collapse: collapse">
        <thead>
          <th>Alert</th>
        </thead>
        <tr>
          <td>${message}</td>
        </tr>
      </table>
      </body>
    </html>`;
  
  let compiledTemplate = ejs.compile(template, {
    cache: true,
    filename: 'errorTemplate',
  });

  return compiledTemplate();
}

module.exports = sendError;