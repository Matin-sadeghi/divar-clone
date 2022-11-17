const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const fetch = require("node-fetch");


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
        <p>${message}/p>
        <br>
        <p>از طرف وبسایت ما</p>
        `,
  });
};

module.exports.captcha = async(req,res,)=>{


    if (
        req.body["g-recaptcha-response"] == "" ||
        req.body["g-recaptcha-response"] == undefined
      ) {
   
        return "redirect";

      } 

      
    const secretKey = process.env.CAPTCHA_KEY;
    const verificationUrl =
      "https://www.google.com/recaptcha/api/siteverify?secret=" +
      secretKey +
      "&response=" +
      req.body["g-recaptcha-response"] +
      "&remoteip=" +
      req.connection.remoteAddress;

      try {
        const response = await fetch(verificationUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
        });
      const json = await response.json();
      if (json.success) {
          return true
      }else{
          return false
      }
      } catch (err) {
        console.log(err);
      }
  

}
  
