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
app.get("/crop",(req,res)=>{
    res.render("crop");
})
app.get("/savedata",async(req,res)=>{
    const testdata = await testmodel.find().sort({_id:-1}).limit(15).exec();

    const nitrogenval=testdata.map(soil=>soil.nitrogen);
    const nitrogen=Number(mode(nitrogenval));

    const phosphorusval=testdata.map(soil=>soil.phosphorus);
    const phosphorus=Number(mode(phosphorusval));

    const potassiumval=testdata.map(soil=>soil.potassium);
    const potassium=Number(mode(potassiumval));

    const pHval=testdata.map(soil=>soil.pH);
    const pH=Number(mode(pHval));

    const temperatureval=testdata.map(soil=>soil.temperature);
    const temperature=Number(mode(temperatureval));
    res.render("savedata",{
        nitrogen:nitrogen,
        phosphorus:phosphorus,
        potassium:potassium,
        pH:pH,
        temperature:temperature,
    });
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

    const nitrogenval=testdata.map(soil=>soil.nitrogen);
    const nitrogen=Number(mode(nitrogenval));

    const phosphorusval=testdata.map(soil=>soil.phosphorus);
    const phosphorus=Number(mode(phosphorusval));

    const potassiumval=testdata.map(soil=>soil.potassium);
    const potassium=Number(mode(potassiumval));

    const pHval=testdata.map(soil=>soil.pH);
    const pH=Number(mode(pHval));

    const temperatureval=testdata.map(soil=>soil.temperature);
    const temperature=Number(mode(temperatureval));
    
    // processing nitrogen
    
    if (nitrogen> 300) {
        nitrogenmsg = `Value of nitrogen is higher than optimum value. We can find
         that the soil contains an excess quantity of nutrients for vegetable cultivation, we should maintain the ratio of npk.value is ${nitrogen}`;
    }else if (nitrogen> 201 && nitrogen< 300 ) {
        nitrogenmsg = `Value of nitrogen is optimum for vegetable cultivation.value is ${nitrogen}`;

    }else if (nitrogen> 101 && nitrogen< 150){
        nitrogenmsg = `Value of nitrogen is optimum for Field crop cultivation.value is ${nitrogen}`;
    } 
      else if(nitrogen> 150 && nitrogen< 200){
       nitrogenmsg = `We can find that the soil does not have an adequate quantity of nutrients for vegetable cultivation. 
       We can find that the soil contains an excess quantity of nutrients for field crop cultivation, we should maintain the ratio of npk.value is ${nitrogen}` ;
    } else{
      nitrogenmsg = `value of nitrogen is lower than optimum value for field crop cultivation and vegetable crop cultivation.value is ${nitrogen}`
    }

    if (phosphorus> 90) {
        phosphorusmsg = `Value of phosphorus is higher than optimum value. We can find
        that the soil contains an excess quantity of nutrients for vegetable cultivation, we should maintain the ratio of npk.Value is ${phosphorus}`;
    }else if (phosphorus> 61 && phosphorus< 90 ) {
        phosphorusmsg = `Value of phosphorus is optimum for vegetable cultivation.Value is ${phosphorus}`;

    }else if (phosphorus> 11 && phosphorus< 20){
        phosphorusmsg = `Value of phosphorus is optimum for Field crop cultivation.Value is ${phosphorus}`;
    } 
      else if(phosphorus> 20 && phosphorus< 61){
        phosphorusmsg = `We can find that the soil does not have an adequate quantity of nutrients for vegetable cultivation. 
        We can find that the soil contains an excess quantity of nutrients for field crop cultivation, we should maintain the ratio of npk.Value is ${phosphorus}` ;
    } else{
        phosphorusmsg = `value of phosphorus is lower than optimum value for field crop cultivation and vegetable crop cultivation.Value is ${phosphorus}`
    }

    if (potassium> 240) {
        potassiummsg = `Value of potassium is higher than optimum value. We can find
        that the soil contains an excess quantity of nutrients for vegetable cultivation, we should maintain the ratio of npk.Value is ${potassium}`;
    }else if (potassium> 161 && potassium< 240 ) {
        potassiummsg = `Value of potassium is optimum for vegetable cultivation.Value is ${potassium}`;

    }else if (potassium> 101 && potassium< 150){
        potassiummsg = `Value of potassium is optimum for Field crop cultivation.Value is ${potassium}`;
    } 
      else if(potassium> 150 && potassium< 161){
        potassiummsg = `We can find that the soil does not have an adequate quantity of nutrients for vegetable cultivation. 
        We can find that the soil contains an excess quantity of nutrients for field crop cultivation, we should maintain the ratio of npk.Value is ${potassium}` ;
    } else{
        potassiummsg = `value of potassium is lower than optimum value for field crop cultivation and vegetable crop cultivation.Value is ${potassium}`
    }

    if (pH> 7.5) {
        pHmsg = `Should decrease the amount of pH.Value is ${pH}`;
    }else if (pH> 6.6 && pH< 7.5 ) {
        pHmsg = `Perfect range for plant growth and planting'.Value is ${pH}`;

    }else {
        pHmsg = `Should increase the amount of pH.Value is ${pH}`
    }

    if (temperature> 30) {
        temperaturemsg = `It is not the perfect range for nitrification, plant growth, and planting.Value is ${temperature}`;
    }else if (temperature> 19 && temperature< 30 ) {
        temperaturemsg = `Perfect range of nitrification, plant growth, and planting.Value is ${temperature}`;

    }else {

        temperaturemsg = `value is lower than optimum value for plant growth.Value is ${temperature}`
    }


    console.log(nitrogen);  
       
    
            
        res.render("analysis",
        {
            nitrogenmsg:nitrogenmsg,
        phosphorusmsg:phosphorusmsg,
        potassiummsg:potassiummsg,
        pHmsg:pHmsg,
        temperaturemsg:temperaturemsg,
        nitrogen:nitrogen,
        phosphorus:phosphorus,
        potassium:potassium,
        pH:pH,
        temperature:temperature,
       });
      

          
      
                
        
});    

  // file upload 
  
  // const storage=multer.diskStorage({destination:function(req,file,cb){cb(null, path.join(__dirname, 'public'));},
    //filename:function(req,file,cb){cb(null,file.filename+"_"+Date.now()+"_"+file.originalname);},})

  //const upload = multer({ storage:storage,}).single("image");

function mode(array){
    if (array.length==0)
    return null;
    var modeMap={};
    var maxEl=array[0],maxCount=1;
    for (var i=0;i<array.length;i++){
        var el =array[i];
        if(modeMap[el]==null)
        modeMap[el]=1;
        else
        modeMap[el]++;
        if(modeMap[el]>maxCount){
            maxEl=el;
            maxCount=modeMap[el];
        }
    }
    return maxEl;
}
       

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
