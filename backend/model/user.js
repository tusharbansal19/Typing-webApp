let mongoose=require("mongoose");
let urlsigma=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
   password:{
    type:String,
        require:true
   }
},{timestamps:true});

let user=mongoose.model("user",urlsigma);
module.exports=user;