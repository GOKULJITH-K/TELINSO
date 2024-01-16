const express = require('express');
const path = require('path');
const bcrypt = require("bcrypt");
const {loginmodel,savemodel}=require("./config");
//const multer =require("multer")
const port=process.env.PORT || 3000 ;


const app = express();
app.use(express.json());

app.use(express.urlencoded({extended:false}));

app.set('view engine','ejs');

app.use(express.static("public"));


 

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/signup",(req,res)=>{
    res.render("signup"); 
})
app.get("/welcome",(req,res)=>{
    res.render("welcome");
})
app.get("/weather",(req,res)=>{
    res.render("weather");
})
app.get("/savedata",(req,res)=>{
    res.render("savedata");
})
app.get("/soilhealth",async(req,res)=>{
    const soildatas = await savemodel.find().exec();
        res.render("soilhealth",{soildatas:soildatas});
        
})

  // file upload
  
  // const storage=multer.diskStorage({destination:function(req,file,cb){cb(null, path.join(__dirname, 'public'));},
    //filename:function(req,file,cb){cb(null,file.filename+"_"+Date.now()+"_"+file.originalname);},})

  //const upload = multer({ storage:storage,}).single("image");

  

//login

app.post("/login", async(req,res)=>{

    try{
        const check=await loginmodel.findOne({name: req.body.username});
        if(!check){

            res.send("You have an invalid username");
            
        }

        const isPasswordMatch=await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){

            res.render("welcome");
        }else{

            res.send("You have an invalid password");
        }
    }catch{
        res.send("You have an invalid credential");
    }

})

app.post("/signup", async(req,res) =>{

    const data={
        name:req.body.username,
        password:req.body.password
    }

    const existingUser = await loginmodel.findOne({name:data.name});

    if(existingUser){
        
        res.send("User exist");
    }
    else{
        const saltRounds=10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;
        const logindata=await loginmodel.insertMany(data);
        console.log(logindata);
 
    }

    
})

app.post("/savedata", async(req,res) =>{

    const userdata={

        soilname:req.body.name,
        nitrogen:req.body.nitrogen,
        phosphorus:req.body.phosphorus,
        potassium:req.body.potassium,
        // image:req.file.filename
    }
   
       
        const savedata=await savemodel.insertMany(userdata);
        console.log(savedata);
       
        
        res.render("savedata");
  
  
    
})

 

app.listen(port,() => {
    console.log(`server running on port:${port} `);
})
