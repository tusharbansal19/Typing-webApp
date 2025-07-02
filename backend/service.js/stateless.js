const jwt=require("jsonwebtoken");
let skey="anutushi"
function setuser(user){
    return jwt.sign({...user,},skey);

}
function getuser(token){
    return jwt.verify(token,skey);
}
module.exports={setuser,
    getuser,
}