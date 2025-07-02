let express=require("express")
let url=require("../url");
let { setuser }=require("../service.js/stateless");
let user=require("../model/user")
let router=express.Router();
let {handlesignup}=require("../controller/user");
const { setid } = require("../service.js/hashmao");

// Helper for setting cookie
function setAuthCookie(res, token) {
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

router.post("/get",async(req,res)=>{
  try{

    
    res.cookie('token', 'your-jwt-token', {
      httpOnly: true, 
      secure: true,    
      sameSite: 'Strict',  
      maxAge: 24 * 60 * 60 * 1000 
    });
    
    return res.json({done:true});
  }
  catch(err){
    console.log(err);
    return res.status(402).json(err,);
  }
});




router.post("/",async(req,res)=>{
  try{
    let body = req.body;
    if(!body.name||!body.email||!body.password)
      return res.status(400).json({ success: false, message: "All fields required" });
    let existingUser = await user.findOne({ email: body.email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }
    let useri=await user.create({
      name:body.name,
      email:body.email,
      password:body.password
    })
    let accessToken = setuser({
      name:body.name,
      email:body.email,
      id: useri._id
    });
    setAuthCookie(res, accessToken);
    return res.status(200).json({
      success: true,
      message: "Signup successful",
      accessToken,
      user: { name: useri.name, email: useri.email, id: useri._id }
    });
  }
  catch(err){
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/login",async(req,res)=>{
  try{
    let body = req.body;
    if(!body.email||!body.password)
      return res.status(400).json({ success: false, message: "All fields required" });
    let useri=await user.findOne({ email:body.email });
    if(!useri)
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    if(useri.password!=body.password)
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    let accessToken = setuser({
      name:useri.name,
      email:useri.email,
      id: useri._id
    });
    setAuthCookie(res, accessToken);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: { name: useri.name, email: useri.email, id: useri._id }
    });
  }
  catch(err){
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});


module.exports=router;