const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transportDetails = smtpTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: "test.matinsadeghi@gmail.com",
    pass: "hjygeqrqiglhmlzw",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendEmail = (email, username, subject, message) => {
  const transporter = nodemailer.createTransport(transportDetails);
  transporter.sendMail({
    from: "test.matinsadeghi@gmail.com",
    to: email,
    subject: subject,
    html: `<h1> سلام ${username} </h1>
        <br>
        <p>${message}</p>
        <br>
        <p>از طرف وبسایت ما</p>
        `,
  });
};
