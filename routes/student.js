const express = require("express");
const studentController = require("../controllers/student.controller");
const router = express.Router();
const { check, body } = require("express-validator");
const db = require("../utils/database");
let mycheck = check("email") //check is check velue everywhare like in header,body,cookie etc
  .isEmail()
  .withMessage("invalid email")
  .custom(async (value, { req }) => {
   
    // if (value === "hafidh@gmail.com") {
    //   throw new Error("this email is forbiden");
    // }
    // return true;
  });

let nameV = body("name") //(name is paramiter from input body,invalid username is common message to whole nameValidator)
  .isLength({ min: 5, max: 10 })
  .isAlphanumeric()
  .custom(async(value, { req }) => {
    //name confirmation
  // if (!value === req.body.name) {
  //   throw new Error("name not match");
  // }
  // return true;
   const myname = req.body.name;
   console.log({namevalidator:myname});
    const [data] = await db.execute("select * from Students where name = ?", [
      myname,
    ]);
    console.log({expvalidator:data});
    if (data.length > 0) {
      return Promise.reject("user already exist")//this is how to deal with async field
    }
    return true;
});
let matchP = body('Vname').custom((value,{req})=>{
  if (!value === req.body.name) {
    throw new Error("name not match");
  }
  return true;
})


router.get("/", studentController.getStudent);
router.get("/add", studentController.geteditpage);
router.post("/add", [mycheck, nameV,matchP], studentController.postdata);
router.get("/edit/:id", studentController.getStudentById);
router.post("/edit", studentController.postEditedData);
router.get("/delete/:id", studentController.deleteStudents);

module.exports = router;
