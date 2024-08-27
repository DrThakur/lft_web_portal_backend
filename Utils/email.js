const nodemailer = require('nodemailer');


const sendEmail = async (option)=> {
    // Create Transporter 
 const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });


  // define Email options
  const emailOptions = {
    from :'LFT Web Portal support<ankit.thakur@logic-fruit.com>',
    to: option.email,
    subject:option.subject,
    text:option.message
  }

 await transporter.sendMail(emailOptions);
}

module.exports = sendEmail;