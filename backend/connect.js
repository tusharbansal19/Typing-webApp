const mongoose  = require("mongoose");

let isConnected = false;

async function connect(url){
  if (isConnected) return;
  await mongoose.connect(url);
  isConnected = true;
  console.log("mongo DB connected...");
}
module.exports = { connect };