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
    phosphorous:{
        type: String,
        required: true
        
    },
    potassium:{
        type: String,
        required: true
        
    }, 
    ph:{
        type: String,
        required: true
        
    }, 
    temperature:{
        type: String,
        required: true
        
    }, 
     // image:{  type: String,required: true}
});
  
// model savedata
const savemodel = mongoose.model("soildatas",saveSchema);

//model farmers

const farmerSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        
        
    },
    message:{
        type: String,
        required: true
        
    },
    linkname:{
        type: String,
        
    },
    longmessage:{
        type: String,
        required:true
        
    },

    link:{
        type: String,
        
        
    }
   
    
});

// model farmerdata
const farmermodel = mongoose.model("farmers",farmerSchema);

// feedback

const feedbackSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        
        
    },
    email:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
        
    }
   
     
});

// model savedata
const feedbackmodel = mongoose.model("feedbacks",feedbackSchema);

//schema test
const testSchema = new mongoose.Schema({
    nitrogen:{
        type: String,
        required: true
    },
    phosphorous:{
        type: String,
        required: true
    },
    potassium:{
        type: String,
        required: true
    },
    ph:{
        type: String,
        required: true
    },
    temperature:{
        type: String,
        required: true
    },
   
});

// model test
const testmodel = mongoose.model("tests",testSchema);

// exports

module.exports ={
    loginmodel,
    savemodel,
    farmermodel,
    feedbackmodel,
    testmodel,
};

