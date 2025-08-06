const database = require('../utils/database');
const {validationResult} = require("express-validator");//this is used to gather result(success or error)

exports.getStudent= async (req,res)=>{
    const userId = req.session.isLoggedIn.userId
    // const[studentdata] = await database.execute('select * from Students where id=?',[userId]);
     const[studentdata] = await database.execute('select * from Students');
    //You have a Products table that has a userId column (foreign key). or use this to render admin page

        res.render('index.ejs',{studentdata});
        // const myco = req.get("cookie").split("=")[1];
        // console.log(myco);
}
exports.geteditpage = async (req,res)=>{
    res.render('add.ejs',{validateError:[]})
}
exports.postdata= async(req,res)=>{
    const {name,email} = req.body
    const error = validationResult(req);//in request express validator is where is store it message
    if(!error.isEmpty()){//isEmpty()return t or f
        console.log(error.array());
        return res.status(422).render("add",{validateError:error.array()});
    }
    //protect post data to ensure only valid id user can add product.(user who login can add it own product)
    const userId = req.session.isLoggedIn.userId
    const[studentdata] = await database.execute('select * from Students where id=?',[userId]);
    console.log(studentdata);
    const x = studentdata[0].id
    if(x!==userId){
        // console.log({typeofx :typeof x,valueOfx :x})
        // console.log({typeofid :typeof userId,valueOfid :userId})
        res.redirect("/")
    }else{
        // res.cookie("token",name,{httpOnly:true,maxAge:3000});   
        await database.execute('insert into Students(name,email) values (?,?)',[name,email]);
        res.redirect('/')
    }

}
exports.getStudentById = async(req,res)=>{
    const myId = req.params.id;
    // console.log(myId);
    const [studentdat] = await database.execute('select * from Students where id = ?',[myId]);
    // console.log({studentdat});
    res.render('edit.ejs',{student:studentdat[0]});
}
exports.postEditedData=async(req,res)=>{
        const userId = req.session.isLoggedIn.userId
    const[studentdata] = await database.execute('select * from Students where id=?',[userId]);
    if(studentdata[0].id!==userId){
        res.redirect("/")
    }else{
        const{id,name,email}=req.body;
        await database.execute('update Students set name=?, email=? where id=?',[name,email,id]);
        res.redirect('/')
    }
    //validate too for security
}

exports.deleteStudents=async(req,res)=>{
    //validate too for security
    const myid = req.params.id;
    await database.execute('delete from Students where id=?',[myid])
    res.redirect('/');
}