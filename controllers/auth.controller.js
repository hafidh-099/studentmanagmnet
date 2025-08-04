const db = require("../utils/database");
const nodemailer = require("nodemailer");
const mail = require("../utils/mail");
const sendinf = require("../utils/sendmail");
const bcrypt = require("bcrypt")
const crypto = require("crypto"); //for random crytpo token generation("which we will used for email varifiacation")

const mymail = nodemailer.createTransport(mail);
exports.renderLogin = (req, res) => {
  let error = req.flash("error");
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("login.ejs", {
    //u use key to access it
    error,
  });
};

exports.varifyLogin = async (req, res) => {
  const { username, password } = req.body;
  const [result] = await db.execute("select * from Students where name=?", [
    username,
  ]);
  const final = result[0];
  if (!final) {
    //syntax value with message //now u can use where you redirect user
    req.flash("error", "invalid email or password");
    res.redirect("/login");
  } else {
    if (password == final.password) {
      // req.session.isLoggedIn= "true"
      res.redirect("/");
    }
  }
  req.flash("error", "invalid email or password");
  res.redirect("/login");
};

exports.renderRegister = (req, res) => {
  res.render("register.ejs");
};

exports.registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    await db.execute("insert into Students(name,password,email)values(?,?,?)", [
      username,
      password,
      email,
    ]);
    res.redirect("/login");
    const send = mymail.sendMail(sendinf.registermail);
  } catch (error) {
    console.error(error);
  }
};

exports.resetPassword = (req, res) => {
  let err = req.flash("emailerror");
  let succ = req.flash("validemail");
  if (err.length > 0) {
    err = err[0];
  } else {
    err = null;
  }
  if (succ.length > 0) {
    succ = succ[0];
  } else {
    succ = null;
  }
  res.render("resetpassword", {
    // path:,
    succ,
    err,
  });
};

exports.resetPass = async (req, res) => {
  const { email } = req.body;

  // Find user
  const [users] = await db.execute("SELECT * FROM Students WHERE email = ?", [email]);
  const user = users[0];

  if (!user) {
    req.flash("emailerror", "Invalid email.");
    return res.redirect("/reset");
  }

  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  const tokenExp = Date.now() + 3600000; // 1 hour

  // Save token + expiry to database
  await db.execute(
    "UPDATE Students SET resetToken = ?, resetTokenExp = ? WHERE email = ?",
    [token, tokenExp, email]
  );

  // Send email (for now, just flash success)
  req.flash("validemail", "Please check your email to reset your password.");
  res.redirect("/login");

  const send = mymail.sendMail({
  from: '"Hafidh Dev company 👨‍💻" <hafidhmwita30@gmail.com>',
  to: "hafinhoramsey@gmail.com",
  subject: "Reset Password",
  html: `
    <h2>Password Reset</h2>
    <p>You requested to reset your password.</p>
    <p>Click the link below to proceed:</p>
    <a href="http://localhost:3000/resetpage/${token}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
  `
});


};

exports.renderReset=async(req,res)=>{
  const token = req.params.token;
  console.log(token);
 const[user]=await db.execute(`select * from Students where resetToken=? && resetTokenExp>?`,[token,Date.now()]);
 console.log(user[0]);
  res.render("resetpass",{
    userId:user[0].id,
    token:token
  });
}
exports.updatePassword=async(req,res)=>{
  const{password,userId,token}=req.body;
  console.log(token)
  const hashpass= await bcrypt.hashSync(password,10);
  console.log(hashpass);
  //for security
  const [user]=await db.execute("select * from Students where resetToken=? && resetTokenExp>?",[token,Date.now()])
  const name = user[0].name;
  console.log(user);
  await db.execute("update Students set password=?,resetToken=?,resetTokenExp=? where id=? && name=?",[password,null,null,userId,name]);
  res.redirect('/login');
}