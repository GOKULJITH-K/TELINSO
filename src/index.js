const express = require('express');
const path = require('path');
const bcrypt = require("bcrypt");
const {loginmodel,savemodel,farmermodel,feedbackmodel,testmodel}=require("./config");
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
app.get("/admin",(req,res)=>{
    res.render("admin");
})
app.get("/farmer",(req,res)=>{
    res.render("farmer");
})
app.get("/test",(req,res)=>{
    res.render("test");
})
app.get("/farmerassist",async(req,res)=>{
    const assistdata = await farmermodel.find().sort({_id:-1}).exec();
    res.render("farmerassist",{assistdata:assistdata});
})
app.get("/feedback",async(req,res)=>{
    const feedbackdata = await feedbackmodel.find().sort({_id:-1}).exec();
    res.render("feedback",{feedbackdata:feedbackdata});
})
app.get("/soilhealth",async(req,res)=>{
    const soildatas = await savemodel.find().sort({_id:-1}).exec();
        res.render("soilhealth",{soildatas:soildatas});
})

//
app.get("/analysis",async(req,res)=>{
    const testdata = await testmodel.find().sort({_id:-1}).limit(15).exec();
    const nitrogenValue = testdata.map(soil => soil.nitrogen);
    const phosphorusValue = testdata.map(soil => soil.phosphorus);
    const potassiumValue = testdata.map(soil => soil.potassium);
    const phValue = testdata.map(soil => soil.pH);
    const temperatureValue = testdata.map(soil => soil.temperature);

    // another method for getting individual value from array
   // testdata.forEach(soil => {
     //   const nitrogenValue = soil.nitrogen;
       // const phosphorusValue = soil.phosphorus;
        //const potassiumValue = soil.potassium;
        //const phValue = soil.pH;
        //const temperatureValue= soil.temperature;
           
       
        const testsoil={
            nitrogenValue:nitrogenValue,
            phosphorusValue:phosphorusValue,
            potassiumValue:potassiumValue,
            phValue:phValue,
            temperatureValue:temperatureValue,
    }
  
         console.log(testsoil);
            
        res.render("analysis",testsoil);
          
        
});    

  // file upload 
  
  // const storage=multer.diskStorage({destination:function(req,file,cb){cb(null, path.join(__dirname, 'public'));},
    //filename:function(req,file,cb){cb(null,file.filename+"_"+Date.now()+"_"+file.originalname);},})

  //const upload = multer({ storage:storage,}).single("image");

  

//login router

app.post("/login", async(req,res)=>{

    try{
        const check=await loginmodel.findOne({name: req.body.username});
        if(!check){

            res.send("You have an invalid username");
            
        }

        const isPasswordMatch=await bcrypt.compare(req.body.password, check.password);
        if(req.body.username=="admin" && req.body.password=="admin" ){

            res.render("admin");

        }else if(isPasswordMatch){

            res.render("welcome");
        }
        else{ 

            res.send("You have an invalid password");
        }
    }catch{
        res.send("You have an invalid credential");
    }
    const check=await loginmodel.findOne({name: req.body.username});

})

// signup router

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

// save data router

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
       
        
        res.render("soilhealth");
  
  
    
})
app.post("/farmer", async(req,res) =>{

    const farmerdata={

        title:req.body.title,
        message:req.body.message,
        linkname:req.body.linkname,
        link:req.body.link,
        
    }
   
       
        const farmersdata=await farmermodel.insertMany(farmerdata);
        console.log(farmersdata);
       
        
        res.render("farmer");
  
  
    
})

// feedback router
app.post("/feedback", async(req,res) =>{

    const feedbackdata={

        name:req.body.name,
        email:req.body.email,
        message:req.body.message,
        
    }
   
       
        const feedbacksdata=await feedbackmodel.insertMany(feedbackdata);
        console.log(feedbacksdata);
       
        
        res.redirect("welcome")
  
  
    
})
 // router test

 app.post("/test", async(req,res) =>{

    const testdata={

      
        nitrogen:req.body.nitrogen,
        phosphorus:req.body.phosphorus,
        potassium:req.body.potassium,
        pH:req.body.pH,
        temperature:req.body.temperature,
        
    }
   
       
        const testsdata=await testmodel.insertMany(testdata);
        console.log(testsdata);
       
         
        res.render("test");
  
 }) 
  

app.listen(port,() => {
    console.log(`server running on port:${port} `);
})
