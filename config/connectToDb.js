const mongoose=require("mongoose");

async function ConnectToDb(){
    await mongoose.connect("mongodb://localhost:27017/Smart-Task-Manger-Api").then(()=>{console.log("Connectd")}).catch((err)=>{console.log("Error")});
    console.log("/");
};
module.exports=ConnectToDb;