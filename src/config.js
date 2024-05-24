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
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    username:{
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

const test2Schema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    reasons:{
        type: String,
        required: true
    },
    symptoms:{
        type: String,
        required: true
    },
    mitigations:{
        type: String,
        required: true
    }
});

// model users
const test2model = mongoose.model("test2",test2Schema);

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
    humidity:{
        type: String,
        required: true
    },
    electrical_conductivity:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
        
    }, 
    coordinates:{  
        type: String,
        
    },
    image:{  
        type: Buffer,
        

    }
   
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
    
    link:{
        type: String,
        
        
    },
    image:{  
        type: String,
        required:true
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
    humidity:{
        type: String,
        required: true
    },
    electrical_conductivity:{
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
    test2model,
};

