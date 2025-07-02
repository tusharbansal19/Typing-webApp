let mongoose=require("mongoose");



let URLsigma=new mongoose.Schema({
    urlid:{
        type:String,
        unique:true,
        require:true
    },
    email:{
        type:String,
        require:true,
        
        },
    sorturl:{
        type:String,
        require:true
    },
    visits:[{timeStamp:{type:String}}],

 
   
},{timestamps:true});


let url =mongoose.model("ukurls",URLsigma);
module.exports=url;