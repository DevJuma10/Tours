const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create a transporter --> service that will send the email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });

  //define email options
  const mailOptions = {
    from: 'Admin <juma.study@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //send email with nodemailer

  await transporter.sendEmail(mailOptions);
};

module.exports = sendEmail;
