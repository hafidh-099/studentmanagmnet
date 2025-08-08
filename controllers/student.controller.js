const database = require("../utils/database");
const { validationResult } = require("express-validator"); //this is used to gather result(success or error)

const dataPage = 3; //make it public

exports.getStudent = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page||1); //we convert into int in order to pass it into myql directly
    const offset = (page - 1) * dataPage;
    // console.log("Page:", page, "Offset:", offset);
    // const userId = req.session.isLoggedIn.userId
    // const[studentdata] = await database.execute('select * from Students where id=?',[userId]);
    const [studentdata] = await database.execute(
      `select * from Students LIMIT ${dataPage} OFFSET ${offset}`
    );
    const [[{ total }]] = await database.execute(
      "select count(*)as total from Students"
    );
    //You have a Products table that has a userId column (foreign key). or use this to render admin page

    res.render("index.ejs", {
      studentdata: studentdata,
      totalStudents: total,
      curentpage:page,
      hasNextPage: dataPage * page < total,
      hasPreviousPage:page>1,
      nextpage:page+1,
      previousPage:page-1,
      lastPage:Math.ceil(total/dataPage)
    });
    // const myco = req.get("cookie").split("=")[1];
    // console.log(myco);
  } catch (error) {
    // res.redirect('/error')
    // let err = new Error("error occure during page loading");
    // err.httpStatusCode = 500;
    return next(error);
  }
};
exports.geteditpage = async (req, res, next) => {
  try {
    res.render("add.ejs", {
      validateError: [],
      data: {
        name: "",
        Vname: "",
        email: "",
      },
    });
  } catch (error) {
    return next(error);
  }
};
exports.postdata = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const error = validationResult(req); //in request express validator is where is store it message
    if (!error.isEmpty()) {
      //isEmpty()return t or f
      // console.log(error.array());
      return res.status(422).render("add", {
        validateError: error.array(),
        data: {
          name: name,
          Vname: "",
          email: email,
        },
      });
    }
    //protect post data to ensure only valid id user can add product.(user who login can add it own product)
    // const userId = req.session.isLoggedIn.userId
    // const [studentdata] = await database.execute(
    //   "select * from Students where id=?",
    //   [userId]
    // );
    // console.log(studentdata);
    // const x = studentdata[0].id;
    // if(x!==userId){
    //     // console.log({typeofx :typeof x,valueOfx :x})
    //     // console.log({typeofid :typeof userId,valueOfid :userId})
    //     res.redirect("/")
    // }else{
    // res.cookie("token",name,{httpOnly:true,maxAge:3000});
    await database.execute("insert into Students(name,email) values (?,?)", [
      name,
      email,
    ]);
    res.status(201).redirect("/");
  } catch (error) {
    return next(error);
  }
};

exports.getStudentById = async (req, res, next) => {
  try {
    const myId = req.params.id;
    // console.log(myId);
    const [studentdat] = await database.execute(
      "select * from Students where id = ?",
      [myId]
    );
    // console.log({studentdat});
    res.render("edit.ejs", { student: studentdat[0] });
  } catch (error) {
    return next(error);
  }
};
exports.postEditedData = async (req, res, next) => {
  try {
    const userId = req.session.isLoggedIn.userId;
    const [studentdata] = await database.execute(
      "select * from Students where id=?",
      [userId]
    );
    if (studentdata[0].id !== userId) {
      res.redirect("/");
    } else {
      const { id, name, email } = req.body;
      await database.execute("update Students set name=?, email=? where id=?", [
        name,
        email,
        id,
      ]);
      res.redirect("/");
    }
    //validate too for security
  } catch (error) {
    return next(error);
  }
};

exports.deleteStudents = async (req, res, next) => {
  try {
    //validate too for security
    const myid = req.params.id;
    await database.execute("delete from Students where id=?", [myid]);
    res.redirect("/");
  } catch (error) {
    return next(error);
  }
};
exports.error = (req, res, next) => {
  try {
    res.render("erropage");
  } catch (error) {
    return next(error);
  }
};
