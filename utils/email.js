const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create a transporter --> service that will send the email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //define email options
  const mailOptions = {
    from: '"Admin" <jumamelvine10@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //send email with nodemailer

  await transporter.sendMail(mailOptions);

  transporter.close();
};

module.exports = sendEmail;
