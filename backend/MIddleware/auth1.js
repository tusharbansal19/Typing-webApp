let user =require("../model/user")

let express=require("express");
const { rawListeners } = require("../url");
const { getid } = require("../service.js/hashmao");
const { getuser } = require("../service.js/stateless");


async function auth1(req,res,next){
    console.log("this is text for middleware")
   let {email}=req.body;

    if(!email)
        return res.json({done:false});

    console.log(email);
    email=getuser(email);
    if(!email.email)
        return res.json({done:false});
    
    console.log(email);
    email=email.email;
    
    // let x=getuser(secid);
    // console.log("user:"+x)
    // if(!x)
    //   return res.redirect("/login");

  // await user.deleteMany({})
    user1= await user.find({email,});
    req.user=user1;
    if(!user1)
        return res.json({done:false});
    req.body.email=email;
  
    console.log("this is middle ware user:"+user1)
    next();
}
module.exports={auth1};