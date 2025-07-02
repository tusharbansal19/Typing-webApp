const mongoose  = require("mongoose");

async function connect(url){
await mongoose.connect(url).then(()=>console.log("mongo DB connected..."));
}
module.exports={connect,};