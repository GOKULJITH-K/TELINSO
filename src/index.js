const express = require('express');
const path = require('path');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {loginmodel,savemodel,farmermodel,feedbackmodel,testmodel,test2model,predictionmodel} = require("./config");
const multer =require("multer");
const axios = require("axios");
const fs = require('fs');
const cookieParser = require('cookie-parser');
const port=process.env.PORT || 3000 ;
     
   
const app = express();
   
const secretKey = process.env.SECRET_KEY || 'telinso';
// middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.set('view engine','ejs');

app.use(express.static("public"));
app.use(express.static("uploads"));

const verifyToken = async(req,res)=>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message:'Unauthorized'});

 
    try{
        const decoded = await jwt.verify(token,secretKey);
        req.user = decoded;
    }
    catch(err){
        return res.status(401).json({message:'Unauthorized'});
    }
};
const extractToken = (req,res)=>{
    const token = req.headers['authorization'];
    if(token){
        req.token= token.split(' ')[1];
    }
    
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads'); 
    },
    filename: function(req, file, cb) {
        cb(null, `${file.originalname}`); 
    },
});

const upload = multer({ storage: storage });



   

app.get("/",async(req,res)=>{

    if (req.cookies.token) {
                
        const decoded = jwt.verify(req.cookies.token, secretKey);
        const user = await loginmodel.findOne({username:decoded.username}).exec();
        const firstname = user.firstname;
        res.render("welcome",{firstname,firstname});

    } else {
    
        res.render("index");
    }


})
app.get("/login",(req,res)=>{

    const message = ""; 
    res.render("login", { message: message });
})
app.get("/start",(req,res)=>{

     
    res.render("start");
})
app.get("/signup",(req,res)=>{
    res.render("signup"); 
})
app.get("/logout", (req, res) => {
    const message = ""; 
    res.clearCookie('token'); 
    res.render("login", { message: message });
    
    
});
app.get("/welcome",extractToken,verifyToken, async(req,res)=>{

   
    
        const user = await loginmodel.findOne({username:req.user.username}).exec();
        const firstname = user.firstname;
        res.render("welcome",{firstname,firstname});

})   
app.get("/weather",(req,res)=>{

    if(req.cookies.token){

        res.render("weather");

    }else{

        res.render("index");
    }
})
app.get("/profile",async(req,res)=>{

    if(req.cookies.token){
        const decoded = jwt.verify(req.cookies.token, secretKey);
        const user = await loginmodel.findOne({username:decoded.username}).exec();
        const firstname = user.firstname;
        const lastname = user.lastname;
        const username = user.username;
        const number =user.number;
        const email= user.email;
        const password = user.password;
        const id = user._id;



        res.render("profile",{firstname,lastname,username,number,email,password,id});

    }else{ 

        res.render("index");
    }
})
app.post("/update-profile" ,async(req,res)=>{

    const data={
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username:req.body.username,
        number:req.body.number,
        email:req.body.email,

        
    }   
    if(req.body.password){

        const password=req.body.password;
        const saltRounds=10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

        data.password = hashedPassword;
    }
    else{
        const decoded = jwt.verify(req.cookies.token, secretKey);
    const userdate = await loginmodel.findOne({username:decoded.username}).exec();
     data.password = userdate.password;

    }
    
    
    const decoded = jwt.verify(req.cookies.token, secretKey);
    const userdate = await loginmodel.findOne({username:decoded.username}).exec();
    const id = userdate._id;
    console.log(id)
    console.log(data)
    const existingUser = await loginmodel.findByIdAndUpdate(id,data);

    const user = await loginmodel.findOne({username:decoded.username}).exec();
    const firstname = user.firstname;
    const lastname = user.lastname;
    const username = user.username;
    const number =user.number;
    const email= user.email;
    const password = user.password;
    
  


    res.render("profile",{firstname,lastname,username,number,email,password,id});


})
app.get("/crophealth",(req,res)=>{

    if(req.cookies.token){


        res.render("crophealth",{classname:"",reasons:"",symptoms:"",mitigations:""});

    }else{

        res.render("index");
    }
})
app.get("/test2",(req,res)=>{

    if(req.cookies.token){

        res.render("test2");

    }else{

        res.render("index");
    }
})
app.post('/cropPredict', async(req,res)=> {

    const testdata = await testmodel.find().sort({_id:-1}).limit(15).exec();

    const nitrogenval=testdata.map(soil=>soil.nitrogen);
    const nitrogen=Number(mode(nitrogenval));

    const phosphorusval=testdata.map(soil=>soil.phosphorous);
    const phosphorous=Number(mode(phosphorusval));

    const potassiumval=testdata.map(soil=>soil.potassium);
    const potassium=Number(mode(potassiumval));

    const pHval=testdata.map(soil=>soil.ph);
    const pH=Number(mode(pHval));

    const temperatureval=testdata.map(soil=>soil.temperature);
    const temperaturev=Number(mode(temperatureval));

    const humidityval=testdata.map(soil=>soil.humidity);
    const humidityv=Number(mode(humidityval));
    
    const electrical_conductivityVal=testdata.map(soil=>soil.electrical_conductivity);
    const electrical_conductivity=Number(mode(electrical_conductivityVal));
    
    const { N, P, K, ph, humidity, ec, temperature } = req.body;
       
        
    const decoded = jwt.verify(req.cookies.token, secretKey);
    const user = await loginmodel.findOne({username:decoded.username}).exec();
    const username = user.username;
    const userId = user._id;
      
    const pythonResponse = await axios.post('https://telinsoapi.onrender.com/predictCrop', {
        N: N,
        P: P,
        K: K,
        ph: ph,
        humidity: humidity,
        ec: ec,
        temperature: temperature,
        username:username,
        id:userId,

   
    });             
     
   
    if(req.cookies.token){
        
             
        let suggested_crop,success_percentage;
        const decoded = jwt.verify(req.cookies.token, secretKey);
        /*
                const response = await axios.get('http://localhost:8000/predictCrop');
                const responseData = response.data;
                for (const data of responseData) {
                    if (data.username === decoded.username) {
                    
                        
                    }
                }
        */
        
          const data = await predictionmodel.findOne({username:decoded.username});
          suggested_crop=data.suggested_crop;
          success_percentage=data.success_percentage;
        res.render("crop",
        {
            nitrogen:nitrogen,
            phosphorous:phosphorous,
            potassium:potassium,
            ph:pH,
            temperature:temperaturev,
            humidity:humidityv,
            electrical_conductivity:electrical_conductivity,
            suggested_crop:suggested_crop,
            success_percentage:success_percentage,
            
        });

    }else{

        res.render("index");
    }
   
    
})
app.post('/upload', upload.single('image'), async (req, res) => {
   
    // Ensure the file is uploaded
  console.log(req.file.path);

  const image = fs.readFileSync(req.file.path, {
    encoding: "base64"
}); 
  
const response = await axios({
    method: "POST",
    url: "https://detect.roboflow.com/telinso/1",
    params: {
        api_key: "dVbUXioOhtnfoCsVFylB"
    }, 
    data: image,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }

})  
     const predictions = response.data.predictions;

    const classname = predictions[0].class;
    console.log(predictions[0].class)
    const data =await  test2model.findOne({name:classname}).exec();
    const reasons = data.reasons;
    const symptoms = data.symptoms;
    const mitigations= data.mitigations;
   
res.render("crophealth",{classname:classname,reasons:reasons,symptoms:symptoms,mitigations:mitigations});
})    
app.get("/crop",async(req,res)=>{
    const testdata = await testmodel.find().sort({_id:-1}).limit(15).exec();

    const nitrogenval=testdata.map(soil=>soil.nitrogen);
    const N=Number(mode(nitrogenval));

    const phosphorusval=testdata.map(soil=>soil.phosphorous);
    const P=Number(mode(phosphorusval));

    const potassiumval=testdata.map(soil=>soil.potassium);
    const K=Number(mode(potassiumval));

    const pHval=testdata.map(soil=>soil.ph);
    const ph=Number(mode(pHval));

    const temperatureval=testdata.map(soil=>soil.temperature);
    const temperature=Number(mode(temperatureval));

    const humidityval=testdata.map(soil=>soil.humidity);
    const humidity=Number(mode(humidityval));
    
    const electrical_conductivityVal=testdata.map(soil=>soil.electrical_conductivity);
    const ec=Number(mode(electrical_conductivityVal));
    
    const decoded = jwt.verify(req.cookies.token, secretKey);
    const user = await loginmodel.findOne({username:decoded.username}).exec();
    const username = user.username;
    const userId = user._id;
      
    const pythonResponse = await axios.post('https://telinsoapi.onrender.com/predictCrop', {
        N: N,
        P: P,
        K: K,
        ph: ph,
        humidity: humidity,
        ec: ec,
        temperature: temperature,
        username:username,
        id:userId,

   
    });     
 
   
    if(req.cookies.token){
        
             
        let suggested_crop,success_percentage;
        const decoded = jwt.verify(req.cookies.token, secretKey);
        /*
                const response = await axios.get('http://localhost:8000/predictCrop');
                const responseData = response.data;
                for (const data of responseData) {
                    if (data.username === decoded.username) {
                    
                        
                    }
                }
        */
        
          const data = await predictionmodel.findOne({username:decoded.username});
          suggested_crop=data.suggested_crop;
          success_percentage=data.success_percentage;
          
        res.render("crop",
        {
            nitrogen:N,
            phosphorous:P,
            potassium:K,
            ph:ph,
            temperature:temperature,
            humidity:humidity,
            electrical_conductivity:ec,
            suggested_crop:suggested_crop,
            success_percentage:success_percentage
            
        });  

    }else{

        res.render("index");
    }
   
})
app.get("/savedata",async(req,res)=>{
    const testdata = await testmodel.find().sort({_id:-1}).limit(30).exec();

    const nitrogenval=testdata.map(soil=>soil.nitrogen);
    const nitrogen=Number(mode(nitrogenval));

    const phosphorusval=testdata.map(soil=>soil.phosphorous);
    const phosphorous=Number(mode(phosphorusval));

    const potassiumval=testdata.map(soil=>soil.potassium);
    const potassium=Number(mode(potassiumval));

    const pHval=testdata.map(soil=>soil.ph);
    const ph=Number(mode(pHval));

    const temperatureval=testdata.map(soil=>soil.temperature);
    const temperature=Number(mode(temperatureval));

    const humidityval=testdata.map(soil=>soil.humidity);
    const humidity=Number(mode(humidityval));
    
    const electrical_conductivityVal=testdata.map(soil=>soil.electrical_conductivity);
    const electrical_conductivity=Number(mode(electrical_conductivityVal));
    if(req.cookies.token){

        res.render("savedata",{
            nitrogen:nitrogen,
            phosphorous:phosphorous,
            potassium:potassium,
            ph:ph,
            temperature:temperature,
            humidity:humidity,
            electrical_conductivity:electrical_conductivity,
        });

    }else{

        res.render("index");
    }
   
    
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
   
    if(req.cookies.token){

        res.render("farmerassist",{assistdata:assistdata});
    }else{

        res.render("index");
    }
   
})
  
app.get("/feedback",async(req,res)=>{
    const feedbackdata = await feedbackmodel.find().sort({_id:-1}).exec();
    res.render("feedback",{feedbackdata:feedbackdata});
})
app.get("/soilhealth",async(req,res)=>{
    
    const soildatas = await savemodel.find().sort({_id:-1}).exec();
   
    if(req.cookies.token){

        res.render("soilhealth", {soildatas: soildatas});
    }else{

        res.render("index");
    }
    
})  
app.get("/user",async(req,res)=>{
    
   
    const userdatas = await loginmodel.find().sort({_id:-1}).exec();
   
    res.render("user", {userdatas: userdatas});
      
})  
app.get("/approval/:id",async(req,res)=>{
    
    let id = req.params.id;
    const userdata = await loginmodel.findByIdAndUpdate(id,{approval:"approved"});
   
    const userdatas = await loginmodel.find().sort({_id:-1}).exec();
   
    res.render("user", {userdatas: userdatas});
    
      
})
app.get("/delete-user/:id",async(req,res)=>{
    
    let id = req.params.id;
    const userdata = await loginmodel.findByIdAndDelete(id);
   
    const userdatas = await loginmodel.find().sort({_id:-1}).exec();
   
    res.render("user", {userdatas: userdatas});
    
      
})  
app.get("/selection",async(req,res)=>{

    if(req.cookies.token){

        res.render("selection");
    }else{

        res.render("index");
    }

    
})
app.get("/delete",async(req,res)=>{

    //const deldata = await savemodel.findOne().sort({_id:-1}).exec();
    //const soilname = deldata.soilname;
    
    if(req.cookies.token){

        res.render("delete");
    }else{

        res.render("index");
    }
    
})
app.get("/alert",async(req,res)=>{

    const soildatas = await savemodel.find().sort({_id:-1}).exec();
    if(req.cookies.token){

        res.render("alert", {soildatas: soildatas});

    }else{

        res.render("index");
    }
     
})
app.get("/delete/delete-data", async(req,res)=>{
    
  
        await testmodel.deleteMany();
        const testdata = await testmodel.find().sort({_id:-1}).limit(15).exec();

        const nitrogenval=testdata.map(soil=>soil.nitrogen);
        const nitrogen=Number(mode(nitrogenval));
    
        const phosphorusval=testdata.map(soil=>soil.phosphorous);
        const phosphorous=Number(mode(phosphorusval));
    
        const potassiumval=testdata.map(soil=>soil.potassium);
        const potassium=Number(mode(potassiumval));
    
        const pHval=testdata.map(soil=>soil.ph);
        const ph=Number(mode(pHval));
    
        const temperatureval=testdata.map(soil=>soil.temperature);
        const temperature=Number(mode(temperatureval));

        const humidityval=testdata.map(soil=>soil.humidity);
        const humidity=Number(mode(humidityval));
        
        const electrical_conductivityVal=testdata.map(soil=>soil.electrical_conductivity);
        const electrical_conductivity=Number(mode(electrical_conductivityVal));

        if(req.cookies.token){

            res.render("savedata",{
                nitrogen:nitrogen,
                phosphorous:phosphorous,
                potassium:potassium,
                ph:ph,
                temperature:temperature,
                humidity:humidity,
                electrical_conductivity:electrical_conductivity,
            });
            
        }else{
    
            res.render("index");
        }
        
        
      
})
app.get("/alert/:id",async(req,res)=>{

    let id=req.params.id;
    const alertdata = await savemodel.findById(id);
    const soilname= alertdata.soilname;
    const datealert = alertdata.date;
    
    if(req.cookies.token){

        res.render("alert",
        {
          soilname:soilname,
          date:datealert,
          id:id
      });
        
    }else{

        res.render("index");
    }
   
    
})

  
app.get("/alert/delete/:id",async(req,res)=>{


    let id=req.params.id;
    await savemodel.findByIdAndDelete(id)

    const soildatas = await savemodel.find().sort({_id:-1}).exec();
    if(req.cookies.token){

        res.render("soilhealth", {soildatas: soildatas});
        
    }else{

        res.render("index");
    }
     
})
app.get("/selection/:id",async(req,res)=>{
    
    let id=req.params.id;
       
    const soildatas = await savemodel.findById(id);
    const N = soildatas.nitrogen;
    const P = soildatas.phosphorous;
    const K = soildatas.potassium;
    const ph = soildatas.ph;
    const temperature = soildatas.temperature;
    const humidity = soildatas.humidity;
    const ec = soildatas.electrical_conductivity;
       
    const decoded = jwt.verify(req.cookies.token, secretKey);
    const user = await loginmodel.findOne({username:decoded.username}).exec();
    const username = user.username;
    const userId = user._id;
      
    const pythonResponse = await axios.post('https://telinsoapi.onrender.com/predictCrop', {
        N: N,
        P: P,
        K: K,
        ph: ph,
        humidity: humidity,
        ec: ec,
        temperature: temperature,
        username:username,
        id:userId,

   
    });     
 
   
    if(req.cookies.token){
        
             
        let suggested_crop,success_percentage;
        const decoded = jwt.verify(req.cookies.token, secretKey);
        /*
                const response = await axios.get('http://localhost:8000/predictCrop');
                const responseData = response.data;
                for (const data of responseData) {
                    if (data.username === decoded.username) {
                    
                        
                    }
                }
        */
        
          const data = await predictionmodel.findOne({username:decoded.username});
          suggested_crop=data.suggested_crop;
          success_percentage=data.success_percentage;
       
        res.render("selection",{
            nitrogen:N,
            phosphorous:P,
            potassium:K,
            ph:ph,
            temperature:temperature,
            humidity:humidity,
            electrical_conductivity:ec,
            suggested_crop:suggested_crop,
            success_percentage:success_percentage,
        }); 
        
    }else{

        res.render("index");
    }

     
})

app.get("/archive/:id",async(req,res)=>{
    
    let id=req.params.id;
    
    const soildatas = await savemodel.findById(id);
    const nitrogen = soildatas.nitrogen;
    const phosphorous = soildatas.phosphorous;
    const potassium = soildatas.potassium;
    const ph = soildatas.ph;
    const temperature = soildatas.temperature;
    const humidity = soildatas.humidity;
    const electrical_conductivity = soildatas.electrical_conductivity;

     
       
    if(req.cookies.token){

        res.render("archive",
        {
            
            nitrogen:nitrogen,
            phosphorous:phosphorous,
            potassium:potassium,
            ph:ph,
            temperature:temperature,
            humidity:humidity,
            electrical_conductivity:electrical_conductivity,
       });
        
    }else{

        res.render("index");
    }

               
         

 
})
  
//
app.get("/analysis",async(req,res)=>{
    
    const testdata = await testmodel.find().sort({_id:-1}).limit(15).exec();

    const nitrogenval=testdata.map(soil=>soil.nitrogen);
    const nitrogen=Number(mode(nitrogenval));

    const phosphorusval=testdata.map(soil=>soil.phosphorous);
    const phosphorous=Number(mode(phosphorusval));

    const potassiumval=testdata.map(soil=>soil.potassium);
    const potassium=Number(mode(potassiumval));

    const pHval=testdata.map(soil=>soil.ph);
    const ph=Number(mode(pHval));

    const temperatureval=testdata.map(soil=>soil.temperature);
    const temperature=Number(mode(temperatureval));

    const humidityval=testdata.map(soil=>soil.humidity);
    const humidity=Number(mode(humidityval));
        
    const electrical_conductivityVal=testdata.map(soil=>soil.electrical_conductivity);
    const electrical_conductivity=Number(mode(electrical_conductivityVal));
    
    
       
    if(req.cookies.token){

        res.render("analysis",
        {
            
        nitrogen:nitrogen,
        phosphorous:phosphorous,
        potassium:potassium,
        ph:ph,
        temperature:temperature,
        humidity:humidity,
        electrical_conductivity:electrical_conductivity,
       });
      
    }else{   
 
        res.render("index");
    }

            
       
  
});    

 
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

app.post("/login", express.json(), async(req,res)=>{

    // cookie adding 

    try{
        const check=await loginmodel.findOne({username: req.body.username,approval:"approved"});
        if(req.body.username=="admin" && req.body.password=="admin" ){

            res.render("admin");
 
        }
       
        if(!check){

            const message = "You have an invalid username";
            res.render("login", { message: message });
             
        }   
 
        const isPasswordMatch=await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){

            const token = jwt.sign({
                userId: check._id,
                username: check.username
            }, secretKey, { expiresIn: '7d' });
            

            res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); 
        
            res.render("welcome",{firstname:check.firstname});
              
        } 
        else{ 
           const message = "You have an invalid password";
            res.render("login",{message:message});
        }
    }catch{
        const message = "You have an invalid password";
            res.render("login",{message:message});
    }
  

   

})



app.post("/signup", async(req,res) =>{

    const data={
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username:req.body.username,
        password:req.body.password,
        number:req.body.number,
        email:req.body.email,
        approval:req.body.approval
    }

    const existingUser = await loginmodel.findOne({username:data.username});

    if(existingUser){
        
        const message = "Username already in use.Please try another";
            res.render("login",{message:message});
    } 
    else{ 
        const saltRounds=10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;
        const logindata=await loginmodel.insertMany(data);
        console.log(logindata);
        const message = "Your account will be activated upon approval";
            res.render("login",{message:message});
 
    }
     
    
})
 
// save data router
app.post("/test2data", async(req,res) =>{

    // const imageBuffer = fs.readFileSync(req.file.path);
     const userdata={
 
         name:req.body.name,
         reasons:req.body.reasons,
         symptoms:req.body.symptoms,
         mitigations:req.body.mitigations,
         
            
     } 
    
        
         const savedata=await test2model.insertMany(userdata);
         console.log(savedata);
        
         
         res.render("welcome");
   
   
     
 })
app.post("/savedata", upload.single("image"), async(req,res) =>{

   // const imageBuffer = fs.readFileSync(req.file.path);
    const userdata={

        soilname:req.body.name,
        nitrogen:req.body.nitrogen,
        phosphorous:req.body.phosphorous,
        potassium:req.body.potassium,
        ph:req.body.ph,
        temperature:req.body.temperature,
        humidity:req.body.humidity,
        electrical_conductivity:req.body.electrical_conductivity,
        date:req.body.date,
        coordinates:req.body.coordinates,
        //image: imageBuffer 
           
    }
   
       
        const savedata=await savemodel.insertMany(userdata);
        console.log(savedata);
       
        
        res.render("welcome");
  
  
    
})
app.post("/farmer", upload.single("image"), async(req,res) =>{

    const farmerdata={

        title:req.body.title,
        message:req.body.message,
        linkname:req.body.linkname,
        link:req.body.link,
        image:req.file.filename 
        
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
        phosphorous:req.body.phosphorous,
        potassium:req.body.potassium,
        ph:req.body.ph,
        temperature:req.body.temperature,
        humidity:req.body.humidity,
        electrical_conductivity:req.body.electrical_conductivity,
        
    }
   
       
        const testsdata=await testmodel.insertMany(testdata);
        console.log(testsdata);
       
         
        res.render("test");
  
 }) 
 
  
  

app.listen(port,() => {
    console.log(`server running on port:${port} `);
})
   