const express = require("express");
const studentController = require("../controllers/student.controller");
const router = express.Router();
const { check, body } = require("express-validator");
let mycheck = check("email") //check is check velue everywhare like in header,body,cookie etc
  .isEmail()
  .withMessage("invalid email")
  .custom((value, { req }) => {
    if (value === "hafidh@gmail.com") {
      throw new Error("this email is forbiden");
    }
    return true;
  });


let nameV = body("name", "invalid username")//(name is paramiter from input body,invalid username is common message to whole nameValidator)
  .isLength({ min: 5, max: 10 })
  .isAlphanumeric();

let confirmUser=body('Vname').custom((value,{req})=>{
    if(!value===req.body.name){
        throw new Error("name not match");
    }
    return true
})

router.get("/", studentController.getStudent);
router.get("/add", studentController.geteditpage);
router.post("/add", [mycheck, nameV,confirmUser], studentController.postdata);
router.get("/edit/:id", studentController.getStudentById);
router.post("/edit", studentController.postEditedData);
router.get("/delete/:id", studentController.deleteStudents);

module.exports = router;
