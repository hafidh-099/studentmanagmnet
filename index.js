const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/student");
const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.set('view engine','ejs')
app.use(express.static("public"));

app.use('/',router)


app.listen(3000,()=>{
    console.log(`server is running http://localhost:3000`)
});