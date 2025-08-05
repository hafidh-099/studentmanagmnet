require("dotenv").config();
const mail ={
  service: "gmail",
  auth: {
    user: "hafidhmwita30@gmail.com", // your Gmail address
    pass: process.env.EMAIL_PASS, // the app password from Google
  },
}
module.exports=mail;