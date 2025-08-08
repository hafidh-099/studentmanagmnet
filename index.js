const express = require("express");
const bodyParser = require("body-parser");
const home = require("./routes/student");
const auth = require("./routes/auth");
const session = require("express-session");
const mysqlsession = require("express-mysql-session")(session);
const flash = require("connect-flash");
const csrufToken = require("csurf")
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  session({
    secret: "itsecret",
    resave: false,
    saveUninitialized: false,
  })
);


app.use(flash()); //now we can use flash anywhare in our application on request object
app.use("/", home);
app.use("/", auth);
//middleware to handle all error
app.use((error,req,res,next)=>{
  //if any error occure this will execute (accept next error from controllr)
  res.status(500).render("erropage.ejs",{error})
});
app.listen(3000, () => {
  console.log(`server is running http://localhost:3000`);
});
