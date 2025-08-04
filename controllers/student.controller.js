const database = require('../utils/database');

exports.getStudent= async (req,res)=>{
    const[studentdata] = await database.execute('select * from Students');
    
        res.render('index.ejs',{studentdata});
        // const myco = req.get("cookie").split("=")[1];
        // console.log(myco);
}
exports.geteditpage = async (req,res)=>{
    res.render('add.ejs')
}
exports.postdata= async(req,res)=>{
    const {name,email} = req.body
    // res.cookie("token",name,{httpOnly:true,maxAge:3000});   
    await database.execute('insert into Students(name,email) values (?,?)',[name,email]);
    res.redirect('/')
}
exports.getStudentById = async(req,res)=>{
    const myId = req.params.id;
    // console.log(myId);
    const [studentdat] = await database.execute('select * from Students where id = ?',[myId]);
    // console.log({studentdat});
    res.render('edit.ejs',{student:studentdat[0]});
}
exports.postEditedData=async(req,res)=>{
    const{id,name,email}=req.body;
    await database.execute('update Students set name=?, email=? where id=?',[name,email,id]);
    res.redirect('/')
}

exports.deleteStudents=async(req,res)=>{
    const myid = req.params.id;
    await database.execute('delete from Students where id=?',[myid])
    res.redirect('/');
}