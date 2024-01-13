const mongoose = require("mongoose");
const connect=mongoose.connect("mongodb+srv://mongo:UNE8bmYvV38FARx5@cluster0.l2ubs1d.mongodb.net/login-tut");



connect.then(() =>{
    console.log("database connected succesfully");
})
.catch(() =>{
    console.log("failed");
})

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

const collection = new mongoose.model("users",LoginSchema);

module.exports=collection;