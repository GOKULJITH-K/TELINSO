const mongoose = require("mongoose");
const connect=mongoose.connect("mongodb+srv://mongo:UNE8bmYvV38FARx5@cluster0.l2ubs1d.mongodb.net/login-tut");



connect.then(() =>{
    console.log("database connected succesfully");
})
.catch(() =>{
    console.log("failed");
})

//schema users
const LoginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

// model users
const loginmodel = mongoose.model("users",LoginSchema);


// schema savedata
const saveSchema = new mongoose.Schema({
    soilname:{
        type: String,
        required: true,
        
        
    },
    nitrogen:{
        type: String,
        required: true
        
    },
    phosphorus:{
        type: String,
        required: true
        
    },
    potassium:{
        type: String,
        required: true
        
    }, 
     //image:{  type: String,required: true}
});

// model savedata
const savemodel = mongoose.model("soildatas",saveSchema);

module.exports ={
    loginmodel,
    savemodel
};

