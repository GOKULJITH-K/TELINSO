const express = require('express');
const pasth = require('path');
const bcrypt = require("bcrypt");
const collection=require("./config");
const port=process.env.PORT || 3000


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

//login

app.post("/login", async(req,res)=>{

    try{
        const check=await collection.findOne({name: req.body.username});
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

    const existingUser = await collection.findOne({name:data.name});

    if(existingUser){
        
        res.send("User exist");
    }
    else{
        const saltRounds=10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;
        const userdata=await collection.insertMany(data);
        console.log(userdata);

    }

    
})






app.listen(port,() => {
    console.log(`server running on port:${port} `);
})
